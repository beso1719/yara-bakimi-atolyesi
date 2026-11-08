// Supabase bağlantısı (publishable key tarayıcıda görünür; tabloları RLS + RPC korur).
// Boş bırakılırsa canlı sınav yalnızca DEMO modunda (sanal öğrencilerle) çalışır.
window.YARA_CONFIG = {
  SUPABASE_URL: "https://yvmumwftjceolgsmreeu.supabase.co",
  SUPABASE_KEY: "sb_publishable_ratbNabofJ1Fi66UwYwTcA_LgV6JAcV",
  // Öğrencilerin açacağı sayfa (QR bu adrese ?pin= ile gider). Boşsa mevcut adresten türetilir.
  JOIN_URL: ""
};
