# Yara Bakımı Atölyesi

Hemşirelik öğrencileri için web tabanlı eğitim oyunu ve sınıfça canlı mini sınav. İçerik **“Yara Bakımında Hemşirelik Eğitimi”** sunumundan (Berfin Çelik, Sude Başeğmez, Mislina Boran, Emine Yurtsever, Halise Bozkurt, Muhammed Sefa Demirezen) hazırlanmıştır.

- **Öğrenci oyunu:** `docs/index.html` → https://beso1719.github.io/yara-bakimi-atolyesi/
  6 bölüm: Yara ve sınıflandırma · Yara iyileşmesi · Pansuman ve tedavi · Bası yarası · Yanık yarası · Cerrahi yara ve hemşirelik bakımı; ayrıca bireysel final sınavı.
- **Canlı mini sınav (projeksiyon):** `docs/sinav/` → https://beso1719.github.io/yara-bakimi-atolyesi/sinav/
  QR + PIN ile katılım, Kahoot tarzı soru akışı, anlık cevap dağılımı, podyum ve sınıf analizi (konu bazında başarı, en çok yapılan hatalar, öğrenci tablosu, CSV/PDF). 300 kişiye kadar.
- **Öğrenci telefonu:** `docs/katil/` (QR buraya `?pin=` ile gelir)
- **Geçmiş sınavın analizi:** `sinav/?analiz=PIN` · **Prova:** sınav ekranında “Demo sınıf” (sanal 28 öğrenci)
- Hasta oyunu (Yara Bakım Masası): `docs/hasta/`

Oyun kaynakları `src/` ve `hasta/` → `sh build.sh`. Canlı sınav dosyaları doğrudan `docs/canli/` içindedir (sorular: `docs/canli/js/quiz-data.js`). Supabase şeması: `supabase-schema.sql` (yq_ tabloları).

İçerik eğitim amaçlı özettir; kurum protokolleri ve hekim istemi önceliklidir.
