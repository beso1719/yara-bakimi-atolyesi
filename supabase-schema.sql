-- Yara Bakımı canlı sınav şeması (Supabase SQL Editor'da bir kez çalıştırın; tekrar çalıştırmak güvenlidir).
-- Tablolar "yq_" önekiyle aynı projedeki diğer uygulamalardan ayrılır.
-- Okuma herkese açık (anon); tüm yazmalar security definer RPC'lerle yapılır ve gizli anahtarlar ayrı tablolarda tutulur.

create extension if not exists pgcrypto;

create table if not exists public.yq_sessions (
  id uuid primary key default gen_random_uuid(),
  pin text unique not null,
  quiz_id text not null default 'yara-v1',
  title text,
  status text not null default 'idle' check (status in ('idle','lobby','get_ready','question','reveal','board','ended')),
  q_index int not null default -1,
  q_count int not null default 0,
  q_started_at timestamptz,
  q_duration int not null default 20,
  q_text text,
  q_options jsonb,
  q_topic text,
  q_img text,
  reveal_correct int,
  deck_pos text,
  remote_cmd text,
  remote_seq int not null default 0,
  qset jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.yq_host_keys (
  session_id uuid primary key references public.yq_sessions(id) on delete cascade,
  host_token uuid not null default gen_random_uuid()
);

create table if not exists public.yq_players (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.yq_sessions(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 20),
  avatar text not null default '🙂',
  score int not null default 0,
  correct_count int not null default 0,
  streak int not null default 0,
  last_points int not null default 0,
  rank int,
  joined_at timestamptz not null default now(),
  unique (session_id, nickname)
);

create table if not exists public.yq_player_keys (
  player_id uuid primary key references public.yq_players(id) on delete cascade,
  secret uuid not null default gen_random_uuid()
);

create table if not exists public.yq_answers (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.yq_sessions(id) on delete cascade,
  player_id uuid not null references public.yq_players(id) on delete cascade,
  q_index int not null,
  choice int not null,
  ms int not null,
  created_at timestamptz not null default now(),
  unique (player_id, q_index)
);
create index if not exists yq_answers_session_idx on public.yq_answers(session_id, q_index);
create index if not exists yq_players_session_idx on public.yq_players(session_id);

-- RLS: herkes okuyabilir; doğrudan yazma yok. Anahtar tabloları hiç okunamaz.
alter table public.yq_sessions enable row level security;
alter table public.yq_players enable row level security;
alter table public.yq_answers enable row level security;
alter table public.yq_host_keys enable row level security;
alter table public.yq_player_keys enable row level security;

drop policy if exists yq_sessions_read on public.yq_sessions;
create policy yq_sessions_read on public.yq_sessions for select using (true);
drop policy if exists yq_players_read on public.yq_players;
create policy yq_players_read on public.yq_players for select using (true);
drop policy if exists yq_answers_read on public.yq_answers;
create policy yq_answers_read on public.yq_answers for select using (true);

-- ——— RPC'ler ———

-- Oturum aç: 6 haneli benzersiz PIN + sunucu anahtarı döner
create or replace function public.yq_create(p_title text, p_quiz text default 'yara-v1')
returns table(session_id uuid, pin text, host_token uuid)
language plpgsql security definer set search_path = public as $$
#variable_conflict use_column
declare v_pin text; v_id uuid; v_tok uuid;
begin
  loop
    v_pin := lpad((floor(random() * 900000) + 100000)::int::text, 6, '0');
    exit when not exists (select 1 from yq_sessions s where s.pin = v_pin);
  end loop;
  insert into yq_sessions(pin, title, quiz_id) values (v_pin, left(p_title, 80), p_quiz) returning id into v_id;
  insert into yq_host_keys(session_id) values (v_id) returning yq_host_keys.host_token into v_tok;
  return query select v_id, v_pin, v_tok;
end $$;

-- Sunucu durumu günceller (anahtar kontrollü). Yalnızca verilen alanlar değişir.
create or replace function public.yq_host(p_session uuid, p_token uuid, p jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from yq_host_keys k where k.session_id = p_session and k.host_token = p_token) then
    raise exception 'yetkisiz';
  end if;
  update yq_sessions s set
    status        = coalesce(p->>'status', s.status),
    q_index       = coalesce((p->>'q_index')::int, s.q_index),
    q_count       = coalesce((p->>'q_count')::int, s.q_count),
    q_duration    = coalesce((p->>'q_duration')::int, s.q_duration),
    q_text        = case when p ? 'q_text' then p->>'q_text' else s.q_text end,
    q_options     = case when p ? 'q_options' then p->'q_options' else s.q_options end,
    q_topic       = case when p ? 'q_topic' then p->>'q_topic' else s.q_topic end,
    q_img         = case when p ? 'q_img' then p->>'q_img' else s.q_img end,
    reveal_correct= case when p ? 'reveal_correct' then (p->>'reveal_correct')::int else s.reveal_correct end,
    deck_pos      = case when p ? 'deck_pos' then p->>'deck_pos' else s.deck_pos end,
    qset          = case when p ? 'qset' then p->'qset' else s.qset end,
    q_started_at  = case when p->>'status' = 'question' then now() else s.q_started_at end,
    updated_at    = now()
  where s.id = p_session;
end $$;

-- Sunucu skorları yazar: [{id, score, correct_count, streak, last_points, rank}]
create or replace function public.yq_host_scores(p_session uuid, p_token uuid, p_rows jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from yq_host_keys k where k.session_id = p_session and k.host_token = p_token) then
    raise exception 'yetkisiz';
  end if;
  update yq_players pl set
    score = (r->>'score')::int, correct_count = (r->>'correct_count')::int, streak = (r->>'streak')::int,
    last_points = (r->>'last_points')::int, rank = (r->>'rank')::int
  from jsonb_array_elements(p_rows) r
  where pl.id = (r->>'id')::uuid and pl.session_id = p_session;
end $$;

-- Telefon kumandası: sunucu anahtarıyla ileri/geri komutu
create or replace function public.yq_remote(p_pin text, p_token uuid, p_cmd text)
returns void language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  select s.id into v_id from yq_sessions s join yq_host_keys k on k.session_id = s.id where s.pin = p_pin and k.host_token = p_token;
  if v_id is null then raise exception 'yetkisiz'; end if;
  update yq_sessions set remote_cmd = left(p_cmd, 20), remote_seq = remote_seq + 1, updated_at = now() where id = v_id;
end $$;

-- Öğrenci katılır: oyuncu kimliği + gizli anahtar döner
create or replace function public.yq_join(p_pin text, p_nick text, p_avatar text)
returns table(player_id uuid, secret uuid, session_id uuid)
language plpgsql security definer set search_path = public as $$
#variable_conflict use_column
declare v_s yq_sessions; v_pid uuid; v_sec uuid; v_nick text := btrim(p_nick);
begin
  select * into v_s from yq_sessions s where s.pin = p_pin;
  if v_s.id is null then raise exception 'pin_yok'; end if;
  if v_s.status in ('ended') then raise exception 'bitti'; end if;
  if char_length(v_nick) < 1 or char_length(v_nick) > 20 then raise exception 'ad_gecersiz'; end if;
  if exists (select 1 from yq_players pl where pl.session_id = v_s.id and lower(pl.nickname) = lower(v_nick)) then raise exception 'ad_alinmis'; end if;
  if (select count(*) from yq_players pl where pl.session_id = v_s.id) >= 300 then raise exception 'dolu'; end if;
  insert into yq_players(session_id, nickname, avatar) values (v_s.id, v_nick, left(coalesce(p_avatar, '🙂'), 8)) returning id into v_pid;
  insert into yq_player_keys(player_id) values (v_pid) returning yq_player_keys.secret into v_sec;
  return query select v_pid, v_sec, v_s.id;
end $$;

-- Öğrenci cevaplar: süre sunucu saatiyle ölçülür, geç ve tekrar cevap reddedilir
create or replace function public.yq_answer(p_player uuid, p_secret uuid, p_q int, p_choice int)
returns int language plpgsql security definer set search_path = public as $$
declare v_s yq_sessions; v_ms int;
begin
  if not exists (select 1 from yq_player_keys k where k.player_id = p_player and k.secret = p_secret) then raise exception 'yetkisiz'; end if;
  select s.* into v_s from yq_sessions s join yq_players pl on pl.session_id = s.id where pl.id = p_player;
  if v_s.status <> 'question' or v_s.q_index <> p_q then raise exception 'kapali'; end if;
  v_ms := (extract(epoch from (now() - v_s.q_started_at)) * 1000)::int;
  if v_ms > v_s.q_duration * 1000 + 1500 then raise exception 'sure_doldu'; end if;
  insert into yq_answers(session_id, player_id, q_index, choice, ms) values (v_s.id, p_player, p_q, p_choice, greatest(v_ms, 0))
  on conflict (player_id, q_index) do nothing;
  return v_ms;
end $$;

revoke all on function public.yq_create(text, text) from public;
revoke all on function public.yq_host(uuid, uuid, jsonb) from public;
revoke all on function public.yq_host_scores(uuid, uuid, jsonb) from public;
revoke all on function public.yq_remote(text, uuid, text) from public;
revoke all on function public.yq_join(text, text, text) from public;
revoke all on function public.yq_answer(uuid, uuid, int, int) from public;
grant execute on function public.yq_create(text, text) to anon, authenticated;
grant execute on function public.yq_host(uuid, uuid, jsonb) to anon, authenticated;
grant execute on function public.yq_host_scores(uuid, uuid, jsonb) to anon, authenticated;
grant execute on function public.yq_remote(text, uuid, text) to anon, authenticated;
grant execute on function public.yq_join(text, text, text) to anon, authenticated;
grant execute on function public.yq_answer(uuid, uuid, int, int) to anon, authenticated;

-- Gerçek zamanlı yayın
do $$ begin
  begin alter publication supabase_realtime add table public.yq_sessions; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.yq_players; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.yq_answers; exception when duplicate_object then null; end;
end $$;
