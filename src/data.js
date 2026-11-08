/* ================= bölüm içerikleri =================
   Kaynak: "Yara Bakımında Hemşirelik Eğitimi" sunumu (Berfin Çelik, Sude Başeğmez, Mislina Boran,
   Emine Yurtsever, Halise Bozkurt, Muhammed Sefa Demirezen). Sorular yalnız sunumdaki bilgilerden üretilmiştir. */
const LEVELS = [
  /* ---------------- 1. YARA VE SINIFLANDIRMA ---------------- */
  {
    id: 'wound', title: 'Yara ve Sınıflandırma', icon: 'layers', color: '#3E6FB0',
    short: 'Yara nedir; oluşum nedeni, doku bütünlüğü, derinlik, temizlik ve renge göre beş sınıflandırma.',
    ref: [
      { t: 'Yara nedir?', b: [
        'Herhangi bir neden sonucu <b>deri veya deri ile birlikte daha derin dokuların, organların bütünlüğünün bozulmasıdır.</b>',
        'Nedenler: kesici-delici yaralanma, uzun süreli basınca bağlı basınç yarası, travma, iskemi, kimyasal ajan, sıcak-soğuğa bağlı yanık, hastalık.'] },
      { t: 'Oluşum nedeni · bütünlük · derinlik', b: [
        '<b>Mekanik:</b> ayrılma, laserasyon, cerrahi yara. <b>Yanık-kimyasal:</b> sıcaklık, kimyasal, elektrik, radyasyon. <b>Kronik:</b> dokuda kanlanma yetersiz (ör. venöz bacak ülseri).',
        '<b>Açık yara:</b> cilt bütünlüğü bozulur, kan/beden sıvısı kaybı olur. <b>Kapalı yara:</b> burkulma, zorlama, darbe; cilt bütünlüğü bozulmaz.',
        '<b>Yüzeysel:</b> sıyrık, kontüzyon (cilt altı kılcal kanamaya bağlı ödem). <b>Derin:</b> delici, batıcı aletlerle oluşur.'] },
      { t: 'Temizlik durumuna göre', b: [
        '<b>Temiz:</b> doku kaybı ve enfeksiyon yok, kenarlar birleşir, minimal skar.',
        '<b>Temiz-kontamine:</b> solunum, GİS, genitoüriner gibi flora içeren organların kontrollü koşullarda, yayılma olmadan açılması.',
        '<b>Kontamine:</b> patojen var ama enfeksiyon belirtisi henüz yok (travmadan hemen sonra gelen açık yara, steril teknikte majör sorun, bağırsak içeriğinin yayılması).',
        '<b>Kirli:</b> patojen var; kızarıklık, ağrı, akıntı, kötü koku gibi enfeksiyon belirtileri görülür.'] },
      { t: 'Renk durumuna göre', b: [
        '<b>Kırmızı:</b> cilt yırtılması, travmatik/cerrahi yara; açık kırmızı, temiz.',
        '<b>Sarı:</b> kabuklu ya da yumuşak nekrotik doku; sarı-yeşil. Evre 2 basınç yarası, 2. derece yanık.',
        '<b>Siyah:</b> kalın nekrotik doku. 3. derece yanık, 3.–4. evre basınç yarası, gangrenli ülser.',
        '<b>Karışık:</b> üç renk kısmen birlikte görülür.'] },
    ],
    rounds: [
      { type: 'match', title: 'Yara rengini eşleştir', prompt: 'Her yara tanımını doğru renk sınıfıyla eşleştir.',
        pairs: [
          { id: 'red', label: 'Kırmızı yara', caption: 'Açık kırmızı, temiz görünümlü cilt yırtılması ya da cerrahi yara', reveal: 'Travmatik veya cerrahi yara', hint: 'Kırmızı yara açık kırmızı renkte ve temiz görünümdedir.' },
          { id: 'yel', label: 'Sarı yara', caption: 'Sarı-yeşil, kabuklu ya da yumuşak nekrotik doku', reveal: 'Ör. Evre 2 basınç yarası, 2. derece yanık', hint: 'Sarı yarada kabuklu ya da yumuşak nekrotik doku vardır.' },
          { id: 'blk', label: 'Siyah yara', caption: 'Kalın nekrotik doku ile kaplı', reveal: 'Ör. 3. derece yanık, 3.–4. evre basınç yarası, gangren', hint: 'Siyah yara kalın nekrotik doku ile kaplıdır.' },
          { id: 'mix', label: 'Karışık yara', caption: 'Kırmızı, sarı ve siyah alanlar bir arada', reveal: 'Üç renk kısmen birlikte görülür', hint: 'Karışık yarada üç renk kısmi olarak birlikte görünür.' },
        ] },
      { type: 'match', title: 'Temizlik durumunu eşleştir', prompt: 'Her durumu temizlik sınıfıyla eşleştir.',
        pairs: [
          { id: 'tmz', label: 'Temiz yara', caption: 'Doku kaybı ve enfeksiyon yok, kenarlar birleşiyor', reveal: 'Minimal skar dokusu gelişir', hint: 'Temiz yarada doku kaybı ve enfeksiyon yoktur, kenarlar birleşir.' },
          { id: 'tk', label: 'Temiz-kontamine', caption: 'Bağırsak gibi flora içeren organ kontrollü koşullarda, yayılma olmadan açıldı', reveal: 'Solunum, GİS, genitoüriner sistem', hint: 'Flora içeren lüminal organın kontrollü açılması temiz-kontamine yaradır.' },
          { id: 'kon', label: 'Kontamine yara', caption: 'Travmadan hemen sonra gelen açık yara; enfeksiyon belirtisi henüz yok', reveal: 'Patojen var, belirti yok', hint: 'Kontamine yarada patojen vardır ama enfeksiyon belirtileri henüz çıkmamıştır.' },
          { id: 'krl', label: 'Kirli yara', caption: 'Kızarıklık, ağrı, akıntı ve kötü koku var', reveal: 'Enfeksiyon belirtileri mevcut', hint: 'Kirli yarada patojen vardır ve enfeksiyon belirtileri görülür.' },
        ] },
      { type: 'quiz', title: 'Hangi sınıfa girer?', questions: [
        { q: 'Burkulma sonrası bilekte şişlik ve ağrı var ancak deride açıklık yok. Doku bütünlüğüne göre bu yara nedir?', options: ['Kapalı yara', 'Açık yara', 'Derin yara', 'Kirli yara'], why: 'Burkulma, zorlama veya darbe sonucu cilt bütünlüğü bozulmadan oluşan yaralar kapalı yaradır.' },
        { q: 'Venöz bacak ülseri oluşum nedenine göre hangi gruptadır?', options: ['Kronik yara', 'Mekanik yara', 'Yanık-kimyasal yara', 'Kapalı yara'], why: 'Kronik yaralar dokudaki kanlanmanın yetersiz olması sonucu oluşur; venöz bacak ülseri tipik örnektir.' },
        { q: 'Kontüzyon nasıl tanımlanır?', options: ['Cilt altında kılcal damar kanamaları sonucu ödem oluşumu', 'Delici aletle oluşan derin yara', 'Kalın nekrotik doku ile kaplı yara', 'Cerrahi kesi sonrası oluşan yara'], why: 'Kontüzyon yüzeysel bir yaradır: cilt altında kılcal damar kanamaları sonucu ödem gelişir.' },
        { q: 'Radyasyona bağlı oluşan yara oluşum nedenine göre hangi gruba girer?', options: ['Yanık-kimyasal yaralar', 'Mekanik yaralar', 'Kronik yaralar', 'Yüzeysel yaralar'], why: 'Yanık-kimyasal yaralar sıcaklık, kimyasal madde, elektrik enerjisi ve radyasyon yaralarını kapsar.' },
        { q: 'Laserasyon hangi yara grubuna örnektir?', options: ['Mekanik yara', 'Kronik yara', 'Yanık-kimyasal yara', 'Kapalı yara'], why: 'Mekanik yaralar ayrılma, laserasyon ve cerrahi yaraları kapsar.' },
      ] },
      { type: 'tf', title: 'Doğru mu, yanlış mı?', prompt: 'Her ifade için karar ver.',
        items: [
          { s: 'Yara yalnızca derinin bütünlüğünün bozulmasıdır; organ hasarı yara sayılmaz.', a: false, why: 'Tanım deri ile birlikte daha derin dokuların ve organların bütünlüğünün bozulmasını da kapsar.' },
          { s: 'Kontamine yarada patojen mikroorganizma vardır ama enfeksiyon belirtileri henüz ortaya çıkmamıştır.', a: true, why: 'Kontamine yaranın tanımı budur; belirtiler varsa kirli yara denir.' },
          { s: 'Siyah yara, yumuşak ve sarı-yeşil nekrotik doku ile kaplıdır.', a: false, why: 'Bu sarı yaranın tanımıdır. Siyah yara kalın nekrotik doku ile kaplıdır.' },
          { s: 'Açık yarada kan ve beden sıvısı kaybı olur.', a: true, why: 'Açık yara cilt bütünlüğünü bozar ve kan/beden sıvısı kaybına neden olur.' },
          { s: 'Derin yaralar genellikle delici, batıcı aletler sonucu oluşur.', a: true, why: 'Sunumdaki sınıflamaya göre derin yaralar delici ve batıcı aletlerle oluşur.' },
          { s: 'Evre 2 basınç yarası ve 2. derece yanık genellikle siyah yara görünümündedir.', a: false, why: 'Bunlar sarı yara örnekleridir; siyah yara 3. derece yanık ve 3.–4. evre basınç yarasında görülür.' },
        ] },
    ],
  },

  /* ---------------- 2. YARA İYİLEŞMESİ ---------------- */
  {
    id: 'healing', title: 'Yara İyileşmesi', icon: 'sprout', color: '#2C78B8',
    short: 'Primer-sekonder-tersiyer iyileşme, hemostazdan maturasyona evreler ve iyileşmeyi geciktiren faktörler.',
    ref: [
      { t: 'İyileşme tipleri', art: () => healArt('primer'), b: [
        '<b>Primer:</b> belirgin kontaminasyon ve doku kaybı yok; yara kenarları yaklaştırılarak iyileşir.',
        '<b>Sekonder:</b> granülasyon dokusunun yara alanını doldurması beklenir; rejenerasyon ve reepitelizasyonla iyileşir.',
        '<b>Tersiyer:</b> sekonder iyileşmeye bırakılan yara, şartlar uygun hale gelince <b>sütüre edilerek kapatılır.</b>'] },
      { t: 'Hemostaz ve inflamasyon', art: () => phaseArt('hemo'), b: [
        'Damar hasarı → kanama → refleks <b>vazokonstriksiyon</b>; bölgeye giden kan azalır.',
        'Pıhtılaşmada görevli hücre parçacıkları (trombositler) hasarlı bölgeye yapışıp <b>ilk tıkacı</b> oluşturur.',
        'Bu geçici tıkacın üzerine <b>pıhtılaşma faktörleri</b> devreye girer ve pıhtı oluşur; kanama tamamen durur.',
        'İnflamasyonda bağışıklık hücreleri bölgeye gelir; hafif kızarıklık normal olabilir.'] },
      { t: 'Proliferasyon (4–21 gün)', art: () => phaseArt('prol'), b: [
        '<b>Epitelizasyon:</b> yara yüzeyi yeni epitel hücreleriyle örtülür.',
        '<b>Fibroplazi:</b> fibroblastlar göç edip çoğalır, yeni bağ dokusu oluşur.',
        '<b>Anjiyogenez:</b> beslenme ve oksijenlenme için yeni kılcal damarlar üretilir.',
        '<b>Kollajen sentezi:</b> yaraya yapısal sağlamlık ve direnç kazandıran ana protein yapılır.',
        'Sonuçta yara yatağı dolar, yara büzülerek küçülür ve epitelle kaplanır.'] },
      { t: 'Maturasyon ve geciktiren faktörler', art: () => phaseArt('mat'), b: [
        '<b>Maturasyon:</b> aylar boyunca iz dokusu olgunlaşır, kollajen yeniden düzenlenir.',
        'Lokal: <b>nekroz, infeksiyon, kan desteği, mobilite, yabancı cisim.</b>',
        'Sistemik: <b>beslenme, vitamin eksikliği, yaş, immün direnç, eşlik eden hastalık</b> (diyabet, anemi vb.).'] },
    ],
    rounds: [
      { type: 'match', title: 'İyileşme tipini eşleştir', prompt: 'Her çizimi doğru iyileşme tipiyle eşleştir.',
        pairs: [
          { id: 'primer', label: 'Primer iyileşme', art: () => healArt('primer'), caption: 'Kontaminasyon ve doku kaybı yok; kenarlar yaklaştırılmış', reveal: 'Minimal skar ile iyileşir', hint: 'Primer iyileşmede yara kenarları yaklaştırılarak iyileşme sağlanır.' },
          { id: 'sekonder', label: 'Sekonder iyileşme', art: () => healArt('sekonder'), caption: 'Açık yara, granülasyon dokusuyla dolması bekleniyor', reveal: 'Rejenerasyon ve reepitelizasyon', hint: 'Sekonderde granülasyon dokusunun yara alanını doldurması beklenir.' },
          { id: 'tersiyer', label: 'Tersiyer iyileşme', art: () => healArt('tersiyer'), caption: 'Önce açık bırakılan yara, koşullar uygun olunca kapatılıyor', reveal: 'Sütüre edilerek kapatılır', hint: 'Tersiyerde sekonder iyileşmeye bırakılan yara, şartlar uygun hale gelince sütüre edilir.' },
        ] },
      { type: 'match', title: 'Evreleri zaman çizelgesine yerleştir', prompt: 'Yara iyileşme evrelerini doğru sıraya ve zamana yerleştir.', layout: 'timeline',
        pairs: [
          { id: 'hemo', label: 'Hemostaz', time: 'ilk saatler', art: () => phaseArt('hemo'), caption: 'Vazokonstriksiyon, trombosit tıkacı, pıhtı', reveal: 'Kanama tamamen durdurulur', hint: 'Hemostaz ilk saatlerde gerçekleşir: vazokonstriksiyon, trombosit tıkacı ve pıhtı.' },
          { id: 'infl', label: 'İnflamasyon', time: 'ilk günler', art: () => phaseArt('infl'), caption: 'Bağışıklık hücreleri bölgeye gelir', reveal: 'Hafif kızarıklık normal olabilir', hint: 'İnflamasyonda bağışıklık hücreleri bölgeye gelir; hafif kızarıklık normaldir.' },
          { id: 'prol', label: 'Proliferasyon', time: '4 – 21. gün', art: () => phaseArt('prol'), caption: 'Epitelizasyon, fibroplazi, anjiyogenez, kollajen', reveal: 'Yeni doku oluşur, yara kapanır', hint: 'Proliferasyon inflamasyonu izler ve 4–21 gün sürer.' },
          { id: 'mat', label: 'Maturasyon', time: 'aylar', art: () => phaseArt('mat'), caption: 'İz dokusu olgunlaşır', reveal: 'Kollajen yeniden düzenlenir', hint: 'Maturasyonda aylar boyunca iz dokusu olgunlaşır.' },
        ] },
      { type: 'match', title: 'Proliferasyonun 4 basamağı', prompt: 'Proliferasyon evresindeki her basamağı tanımıyla eşleştir.',
        pairs: [
          { id: 'epi', label: 'Epitelizasyon', caption: 'Yara yüzeyinin yeni deri hücreleriyle örtülerek dış ortama kapatılması', reveal: 'Yara yüzeyi kapanır', hint: 'Epitelizasyon yara yüzeyinin yeni epitel hücreleriyle örtülmesidir.' },
          { id: 'fib', label: 'Fibroplazi', caption: 'Fibroblastların göç edip çoğalarak yeni bağ dokusu oluşturması', reveal: 'Yeni bağ dokusu', hint: 'Fibroplazi fibroblastların göçü ve çoğalmasıyla bağ dokusunun oluşmasıdır.' },
          { id: 'anj', label: 'Anjiyogenez', caption: 'Dokunun beslenmesi ve oksijenlenmesi için yeni kılcal damarların üretilmesi', reveal: 'Yeni kılcal damarlar', hint: 'Anjiyogenez yeni kılcal damar üretimidir.' },
          { id: 'kol', label: 'Kollajen sentezi', caption: 'Yaraya yapısal sağlamlık ve direnç kazandıran ana proteinin yapımı', reveal: 'Fibroblastlar üretir', hint: 'Kollajen fibroblastlar tarafından üretilir ve yaraya sağlamlık kazandırır.' },
        ] },
      { type: 'order', title: 'Hemostazda kanama nasıl durur?', prompt: 'Damar hasarından kanamanın durmasına kadar olan basamakları sırala; yanlış kartları seçme.',
        steps: [
          { text: 'Damar hasarı sonucu kanama olur', why: 'Süreç damar hasarıyla başlar.' },
          { text: 'Refleks vazokonstriksiyon bölgeye giden kanı azaltır', why: 'Kanamaya ilk yanıt damarın refleks olarak daralmasıdır.' },
          { text: 'Trombositler hasarlı bölgeye yapışıp ilk tıkacı oluşturur', why: 'Vazokonstriksiyonun ardından trombositler kümelenip geçici bir yara bandı gibi tıkaç yapar.' },
          { text: 'Pıhtılaşma faktörleri devreye girer, pıhtı oluşur', why: 'Geçici tıkacın üzerine pıhtılaşma faktörleri kalıcı pıhtıyı oluşturur.' },
          { text: 'Kanama yara iyileşene kadar tamamen durur', why: 'Pıhtı oluşunca kanama tamamen durdurulmuş olur.' },
        ],
        distractors: [
          { text: 'Vazodilatasyonla bölgeye giden kan artırılır', why: 'Hemostazda refleks vazokonstriksiyon olur; vazodilatasyon kanamayı artırır.' },
          { text: 'Fibroblastlar kollajen üreterek kanamayı durdurur', why: 'Kollajen sentezi proliferasyon evresine aittir; kanamayı trombosit tıkacı ve pıhtı durdurur.' },
        ] },
      { type: 'tf', title: 'İyileşmeyi geciktirenler', prompt: 'Her ifade için karar ver.',
        items: [
          { s: 'Yarada nekroz ve yabancı cisim bulunması iyileşmeyi geciktirir.', a: true, why: 'Nekroz ve yabancı cisim, iyileşmeyi geciktiren lokal faktörlerdendir.' },
          { s: 'Diyabet ve anemi gibi eşlik eden hastalıklar iyileşmeyi etkilemez.', a: false, why: 'Eşlik eden hastalıklar (diyabet, anemi vb.) iyileşmeyi geciktiren sistemik faktörlerdir.' },
          { s: 'Vitamin eksikliği ve yetersiz beslenme yara iyileşmesini geciktirir.', a: true, why: 'Beslenme ve vitamin eksikliği sistemik geciktirici faktörlerdir.' },
          { s: 'Proliferasyon evresi yaklaşık 4–21 gün sürer.', a: true, why: 'Sunuma göre proliferasyon inflamatuar aşamayı izler ve 4–21 gün sürer.' },
          { s: 'Tersiyer iyileşmede yara ilk anda sütüre edilir ve hiç açık bırakılmaz.', a: false, why: 'Bu primer iyileşmedir. Tersiyerde yara önce sekonder iyileşmeye bırakılır, sonra kapatılır.' },
          { s: 'Yaş ve immün direnç yara iyileşmesini etkileyen faktörlerdendir.', a: true, why: 'Yaş ve immün direnç sistemik faktörler arasındadır.' },
        ] },
    ],
  },

  /* ---------------- 3. PANSUMAN VE TEDAVİ ---------------- */
  {
    id: 'dressing', title: 'Pansuman ve Yara Tedavisi', icon: 'gauze', color: '#0A7A72',
    short: 'Pansumanın amacı, koruyucu-emici-basınçlı ve kuru-ıslak-Garrel pansuman, VAC, deri grefti ve flep.',
    ref: [
      { t: 'Pansumanın amacı', b: [
        'Yarayı dış etkenlerden ve enfeksiyondan korumak.',
        'Akıntıyı emmek; yara ve çevresindeki dokuyu desteklemek.',
        '<b>Nemli ortam sağlamak</b> ve ödemi önlemek.',
        'Ağrıyı azaltmak, ısı kaybını önlemek, kanamayı durdurmak.'] },
      { t: 'Amaca göre pansuman', b: [
        '<b>Koruyucu:</b> yara su geçirmez malzemeyle kaplanır; kanama/akıntı olmadığı için emicilik aranmaz.',
        '<b>Emici:</b> akıntıyı emmek için emici, kuru malzemeyle kapatılır; yumuşak sargılar da emicidir.',
        '<b>Basınçlı:</b> kanamayı durdurmak, ödemi azaltmak, ölü boşluğu kapatmak için. Basınç her yere eşit; ekstremitede <b>distalden proksimale</b>; dolaşımı engellememeli.'] },
      { t: 'Yapılış özelliğine göre', art: () => dropsArt(2), b: [
        '<b>Kuru:</b> epidermis sağlam, malzemenin yaraya yapışma ihtimali yok.',
        '<b>Islak:</b> yara nemli kalmalıysa ya da sıvı ilaç/antiseptik uygulanacaksa; <b>en az 2 saatte bir</b> değiştirilir.',
        '<b>Garrel:</b> bölgeyi sürekli ya da aralıklı antiseptik/ilaçla yıkamak için.',
        '<b>Hazır steril:</b> trafik kazası, yangın, patlama gibi acil durumlarda paket hâlinde hazır.'] },
      { t: 'Yara tedavisi', b: [
        'Önemli olan kapatma yöntemi değil; <b>gerginliğin en az olacağı şekilde</b> kenarları yaklaştırıp minimal skarla primer iyileşme sağlamaktır.',
        '<b>VAC:</b> yara üzerine kontrollü, lokalize <b>negatif basınç</b> uygulayan, invaziv olmayan yöntem; ekstremite, sternal, diyabetik, yanık, abdominal ve bası yaralarında kullanılır.',
        '<b>Deri grefti:</b> dokunun kan desteğinden ayrılarak yeni bölgeye transferi. Duyular sırasıyla <b>ağrı, dokunma, ısı</b> olarak geri gelir.',
        '<b>Flep:</b> bir ucu kendi damarlarıyla beslenmek üzere yerinde bırakılan doku şeridi; kendi kan dolaşımını korur.'] },
    ],
    rounds: [
      { type: 'match', title: 'Amaca göre pansuman', prompt: 'Her klinik durumu doğru pansuman türüyle eşleştir.',
        pairs: [
          { id: 'kor', label: 'Koruyucu pansuman', caption: 'Kanama ve akıntı yok; yara dış ortamdan korunacak', reveal: 'Su geçirmez malzeme, emicilik aranmaz', hint: 'Koruyucu pansumanda kanama/akıntı olmadığı için emici özellik aranmaz.' },
          { id: 'emi', label: 'Emici pansuman', caption: 'Yaradan bol akıntı geliyor', reveal: 'Emici, kuru malzeme', hint: 'Emici pansuman akıntının emilmesi için kuru, emici malzemeyle yapılır.' },
          { id: 'bas', label: 'Basınçlı pansuman', caption: 'Kanama durdurulmalı, ödem azaltılmalı, ölü boşluk kapatılmalı', reveal: 'Ekstremitede distalden proksimale', hint: 'Basınçlı pansuman kanamayı durdurur, ödemi azaltır ve ölü boşluğu kapatır.' },
        ] },
      { type: 'match', title: 'Yapılış özelliğine göre pansuman', prompt: 'Her durumu doğru pansuman yöntemiyle eşleştir.',
        pairs: [
          { id: 'kuru', label: 'Kuru pansuman', caption: 'Epidermis sağlam, malzeme yaraya yapışmayacak', reveal: 'En basit yöntem', hint: 'Kuru pansuman epidermisin sağlam olduğu, yapışma ihtimali olmayan yaralarda uygulanır.' },
          { id: 'islak', label: 'Islak pansuman', caption: 'Yara nemli kalmalı ya da sıvı antiseptik uygulanacak', reveal: 'En az 2 saatte bir değiştirilir', hint: 'Islak pansuman nem gerektiğinde ya da sıvı ilaç uygulanacağında kullanılır.' },
          { id: 'garrel', label: 'Garrel pansuman', caption: 'Bölge sürekli ya da aralıklı antiseptikle yıkanacak', reveal: 'Sürekli/aralıklı irrigasyon', hint: 'Garrel pansuman yaralı bölgeyi devamlı ya da aralıklı yıkamak için kullanılır.' },
          { id: 'hazir', label: 'Hazır steril pansuman', caption: 'Trafik kazası, yangın, patlama gibi acil durum', reveal: 'Paket hâlinde kullanıma hazır', hint: 'Hazır steril pansuman acil durumlarda hemen pansuman yapılabilmesi içindir.' },
        ] },
      { type: 'quiz', title: 'Tedavi kararları', questions: [
        { q: 'Kol yarasına basınçlı pansuman yapılacak. Sargı hangi yönde uygulanmalıdır?', options: ['Distalden proksimale', 'Proksimalden distale', 'Yaranın ortasından dışa doğru', 'Yön önemli değildir'], why: 'Basınçlı pansuman ekstremitede distalden başlayıp yaranın proksimaline doğru yapılır; basınç dolaşımı engellememelidir.' },
        { q: 'Islak pansuman en az ne sıklıkla değiştirilmelidir?', options: ['2 saatte bir', '12 saatte bir', 'Günde bir kez', '3 günde bir'], why: 'Islak pansumanın en az iki saatte bir değiştirilmesi gerekir.' },
        { q: 'VAC (vakum yardımlı kapama) tedavisinin temel prensibi nedir?', options: ['Yara üzerine kontrollü, lokalize negatif basınç uygulamak', 'Yarayı sürekli antiseptikle yıkamak', 'Yaraya pozitif basınçla oksijen vermek', 'Yarayı açık havada kurutmak'], why: 'VAC, akut ve kronik yaralarda iyileşmeyi hızlandırmak için kontrollü ve lokalize negatif basınç uygulayan invaziv olmayan bir yöntemdir.' },
        { q: 'Deri grefti sonrası duyular hangi sırayla geri kazanılır?', options: ['Ağrı → dokunma → ısı', 'Isı → dokunma → ağrı', 'Dokunma → ağrı → ısı', 'Hepsi aynı anda'], why: 'Greft sonrası sırasıyla ağrı, dokunma ve ısı duyuları kazanılır.' },
        { q: 'Flebi deri greftinden ayıran temel özellik nedir?', options: ['Kendi özgün kan dolaşımını korur', 'Başka bir canlıdan alınır', 'Yalnız epidermisi içerir', 'Yaraya geçici olarak konur'], why: 'Flepte bir uç kendi damarlarıyla beslenmek üzere yerinde bırakılır; greftin tersine kendi kan dolaşımını korur.' },
        { q: 'Yara kapatmada en önemli ilke hangisidir?', options: ['Kenarları gerginliğin en az olacağı şekilde yaklaştırmak', 'Mutlaka dikiş kullanmak', 'Yarayı her zaman açık bırakmak', 'En hızlı kapatma yöntemini seçmek'], why: 'Önemli olan yöntem değil, gerginliğin en az olacağı şekilde kenarları yaklaştırıp minimal skarla primer iyileşme sağlamaktır.' },
      ] },
      { type: 'tf', title: 'Pansumanın amacı', prompt: 'Her ifade pansumanın amaçlarından biri mi? Karar ver.',
        items: [
          { s: 'Pansumanın amaçlarından biri yarayı tamamen kurutmaktır.', a: false, why: 'Tersine, pansumanın amaçlarından biri nemli ortam sağlamaktır.' },
          { s: 'Pansuman ısı kaybını önler ve ağrıyı azaltır.', a: true, why: 'Ağrıyı azaltmak ve ısı kaybını önlemek pansumanın amaçlarındandır.' },
          { s: 'Koruyucu pansumanda emici malzeme kullanılması zorunludur.', a: false, why: 'Koruyucu pansumanda kanama ve akıntı olmadığı için emici özellik aranmaz.' },
          { s: 'Basınçlı pansumanda basınç yaranın her yerine eşit uygulanır.', a: true, why: 'Basınç eşit uygulanmalı ve dolaşımı engellememelidir.' },
          { s: 'VAC yalnız cerrahi yaralarda kullanılabilir.', a: false, why: 'VAC ekstremite, sternal, spinal, fasiyal, diyabetik, yanık, abdominal ve bası yaralarında da başarıyla uygulanır.' },
        ] },
    ],
  },

  /* ---------------- 4. BASI YARASI ---------------- */
  {
    id: 'pressure', title: 'Bası Yarası', icon: 'bed', color: '#7E55A8',
    short: 'Nasıl oluşur, risk bölgeleri, önleme (pozisyon, nem, beslenme, friksiyon), dört evre ve bakımı.',
    ref: [
      { t: 'Tanım ve oluşum', b: [
        'Uzun süreli <b>basınç ve/veya sürtünme</b> sonucu dolaşımın bozulmasıyla oluşan yerel doku hasarı veya açık yaradır.',
        'Kemik çıkıntıları: <b>sakrum, topuklar, kalça kemikleri, dirsekler, kulaklar.</b>',
        '<b>1)</b> Dış basınç kılcal basıncı aşar → <b>2)</b> iskemi (oksijen ve besin alamama) → <b>3)</b> nekroz: önce kızarıklık, önlem alınmazsa derin açık yara.'] },
      { t: 'Önleme', b: [
        'Yatağa bağımlı: <b>en az 2 saatte bir</b>; tekerlekli sandalyeye bağımlı: <b>saat başı</b> pozisyon.',
        'Diz ve ayak bilekleri arası yastık/köpük; topuklar için diz altından ayak bileğine kadar alt bacağa yastık.',
        '<b>Nem:</b> terleme, drenaj, banyo sonrası ıslaklık, fekal/üriner inkontinans belirlenir.',
        '<b>Beslenme:</b> protein ve kalori artırılır. <b>Friksiyon:</b> trapez kullan, hastayı <b>çarşafla</b> çek; koltuk altından tutarak çekme.'] },
      { t: 'Evreler', art: () => ulcerArt('s2'), b: [
        '<b>Evre 1:</b> deri bütün; parmakla basmakla solmayan kalıcı kızarıklık; sıcak, ağrılı, sert olabilir.',
        '<b>Evre 2:</b> epidermis/üst dermiste kısmi kayıp; sıyrık, su toplanması, sığ çukur.',
        '<b>Evre 3:</b> üst fasyaya kadar tam derinlikte kayıp ya da nekroz; kemik, tendon, ekleme uzanmaz; derin çukur.',
        '<b>Evre 4:</b> fasya altına, kemik, tendon, eklem kapsülüne kadar ilerlemiş kayıp.'] },
      { t: 'Bakım ve tedavi', b: [
        '<b>Evre 1:</b> genellikle kendiliğinden iyileşir; pozisyon, hijyen, cilt hasarını önleme.',
        '<b>Evre 2:</b> dikkatli değerlendirme (derinde Evre 3 olabilir), nedenleri kaldır, enfeksiyondan koru.',
        '<b>Evre 3:</b> nekrotik doku uzaklaştırılır, enfeksiyon tedavisi (pansuman, antibiyotik), protein-enerjiden zengin beslenme; çoğu zaman cerrahi.',
        '<b>Evre 4:</b> Evre 3 gibi, ancak kemik etkilendiği için debridman genellikle radikaldir.'] },
    ],
    rounds: [
      { type: 'match', title: 'Bası yarası evresini eşleştir', prompt: 'Deri kesitlerine bak; her görüntüyü doğru evreyle eşleştir.',
        pairs: [
          { id: 's1', label: 'Evre 1', art: () => ulcerArt('s1'), caption: 'Deri bütün, basmakla solmayan kızarıklık', reveal: 'Genellikle kendiliğinden iyileşir', hint: 'Evre 1’de cilt bütünlüğü bozulmamıştır; parmakla basınca solmayan kalıcı kızarıklık vardır.' },
          { id: 's2', label: 'Evre 2', art: () => ulcerArt('s2'), caption: 'Sığ, kısmi derinlikte kayıp; sıyrık ya da su toplanması', reveal: 'Epidermis ve/veya üst dermis', hint: 'Evre 2’de epidermis ve/veya dermisin üst tabakasında kısmi doku kaybı vardır.' },
          { id: 's3', label: 'Evre 3', art: () => ulcerArt('s3'), caption: 'Derin çukur; kemik ve tendon görünmüyor', reveal: 'Üst fasyaya kadar tam derinlik', hint: 'Evre 3’te üst fasyaya kadar tam derinlikte kayıp vardır; kemik, tendon ve ekleme uzanmaz.' },
          { id: 's4', label: 'Evre 4', art: () => ulcerArt('s4'), caption: 'Kas ve kemik açıkta', reveal: 'Debridman genellikle radikal', hint: 'Evre 4’te kayıp fasya altına, kemik, tendon ve eklem kapsülüne ulaşır.' },
        ] },
      { type: 'order', title: 'Bası yarası nasıl oluşur?', prompt: 'Bası yarasının oluşum basamaklarını sırala; yanlış kartları seçme.',
        steps: [
          { text: 'Vücudun bir bölgesi uzun süre sabit kalır', why: 'Süreç bölgenin uzun süre hareketsiz kalmasıyla başlar.' },
          { text: 'Dış basınç kılcal damarlardaki kan basıncını aşar, dolaşım engellenir', why: 'Dolaşımın engellenmesi ilk mekanizmadır.' },
          { text: 'Hücreler yeterli oksijen ve besin alamaz (iskemi)', why: 'Kan akımı kesilince doku oksijensiz kalır.' },
          { text: 'Dokular canlılığını yitirir (nekroz), önce kızarıklık görülür', why: 'Oksijensiz kalan hücreler ölür; ilk bulgu kızarıklıktır.' },
          { text: 'Önlem alınmazsa derin açık yaraya dönüşür', why: 'Kızarıklık döneminde önlem alınmazsa yara derinleşir.' },
        ],
        distractors: [
          { text: 'Bölgeye giden kan akımı artar', why: 'Bası yarasında kan akımı artmaz, dış basınçla engellenir.' },
          { text: 'Enfeksiyon önce gelişir, ardından basınç oluşur', why: 'Bası yarasının nedeni basınç/sürtünmedir; enfeksiyon başlatıcı değildir.' },
        ] },
      { type: 'spots', title: 'Sırtüstü pozisyonda risk bölgeleri', prompt: 'Sırtüstü yatan hastada bası yarası riskinin en yüksek olduğu 5 kemik çıkıntısını bul. Yanlış noktalar eldivene mal olur.',
        how: 'İşaretli noktalardan risk bölgesi olanlara dokun.', counterLabel: 'Bulunan risk bölgesi', fineLabel: 'bu pozisyonda risk bölgesi değil', dots: true, scene: supineScene,
        spots: [
          { x: 27, y: 104, r: 16, err: true, title: 'Oksiput', why: 'Sırtüstü yatışta başın arka kısmı yatağa basınç uygulayan bir kemik çıkıntısıdır.' },
          { x: 96, y: 113, r: 16, err: true, title: 'Skapula', why: 'Kürek kemikleri sırtüstü yatışta yatakla temas eden kemik çıkıntılarıdır.' },
          { x: 176, y: 110, r: 16, err: true, title: 'Dirsek', why: 'Sunumda sayılan risk bölgelerinden biridir; dirsek yatağa dayanır.' },
          { x: 222, y: 114, r: 16, err: true, title: 'Sakrum', why: 'Sunumda ilk sayılan bölgedir; sırtüstü yatışta en sık bası yarası gelişen yerdir.' },
          { x: 384, y: 112, r: 16, err: true, title: 'Topuk', why: 'Topukların yatağa temasını önlemek için diz altından ayak bileğine kadar alt bacağa yastık konur.' },
          { x: 52, y: 74, r: 16, err: false, title: 'Alın', why: 'Sırtüstü yatışta yüz yukarı bakar; alın basınç almaz.' },
          { x: 130, y: 74, r: 16, err: false, title: 'Sternum', why: 'Göğüs ön yüzü sırtüstü yatışta basınç altında değildir.' },
          { x: 300, y: 92, r: 16, err: false, title: 'Patella', why: 'Diz kapağı sırtüstü yatışta basınç almaz.' },
          { x: 198, y: 74, r: 16, err: false, title: 'Karın', why: 'Karın ön yüzü kemik çıkıntısı değildir ve sırtüstü yatışta basınç almaz.' },
        ] },
      { type: 'match', title: 'Evreye göre bakım', prompt: 'Her bakım yaklaşımını ait olduğu evreyle eşleştir.',
        pairs: [
          { id: 'b1', label: 'Evre 1', caption: 'Genellikle kendiliğinden iyileşir; pozisyon, hijyen ve cilt hasarını önleme yeterlidir', reveal: 'Önlemler', hint: 'Evre 1 genellikle kendiliğinden iyileşir; önlemler alınır.' },
          { id: 'b2', label: 'Evre 2', caption: 'Derin dokuda Evre 3 olabileceği için dikkatli değerlendirme; nedenler kaldırılır, enfeksiyondan korunur', reveal: 'Değerlendir ve koru', hint: 'Evre 2’de ilk adım dikkatli değerlendirmedir; derinde Evre 3 olabilir.' },
          { id: 'b3', label: 'Evre 3', caption: 'Nekrotik doku uzaklaştırılır, enfeksiyon tedavi edilir, protein-enerjiden zengin beslenme; çoğu zaman cerrahi', reveal: 'Nekroz temizliği', hint: 'Evre 3’te nekrotik doku uzaklaştırılır ve genellikle cerrahi gerekir.' },
          { id: 'b4', label: 'Evre 4', caption: 'Kemik etkilendiği için debridman genellikle radikaldir', reveal: 'Radikal debridman', hint: 'Evre 4’ün tedavisi Evre 3 gibidir; kemik etkilendiği için debridman radikaldir.' },
        ] },
      { type: 'tf', title: 'Önlemede doğru mu, yanlış mı?', prompt: 'Her ifade için karar ver.',
        items: [
          { s: 'Yatağa bağımlı hastaya en az 2 saatte bir pozisyon verilir.', a: true, why: 'Sunuma göre yatağa bağımlı hastada en az 2 saatte bir pozisyon değiştirilir.' },
          { s: 'Tekerlekli sandalyeye bağımlı hastada pozisyon 4 saatte bir değiştirilir.', a: false, why: 'Tekerlekli sandalyeye bağımlı hastada pozisyon saat başı değiştirilmelidir.' },
          { s: 'Yatağın ayak ucuna kaymış hasta, iki kişi tarafından koltuk altlarından tutularak yukarı çekilir.', a: false, why: 'Bu yaygın ama yanlış bir uygulamadır; hasta mutlaka çarşaf kullanılarak çekilmelidir.' },
          { s: 'Hasta yatakta hareket ederken trapez kullanması friksiyonu azaltır.', a: true, why: 'Trapez kullanmak sürtünme ve yırtılmayı kontrol etmenin yollarından biridir.' },
          { s: 'Risk altındaki hastanın protein ve kalori alımı azaltılmalıdır.', a: false, why: 'Risk altındaki hastaların protein ve kalori alımı artırılmalıdır.' },
          { s: 'Dizlerin ve ayak bileklerinin birbirine sürtünmesini önlemek için bacak araları yastıkla desteklenir.', a: true, why: 'Bacak araları yastık ya da köpük kenarlıklarla desteklenmelidir.' },
          { s: 'Evre 1 bası yarasında deride açık bir yara bulunur.', a: false, why: 'Evre 1’de cilt bütünlüğü bozulmamıştır; yalnız basmakla solmayan kalıcı kızarıklık vardır.' },
        ] },
    ],
  },

  /* ---------------- 5. YANIK YARASI ---------------- */
  {
    id: 'burn', title: 'Yanık Yarası', icon: 'flame', color: '#D2602A',
    short: 'Yanık türleri, Dokuzlar Kuralı, yanık şoku ve dönemler, derecelendirme, ilk yardım ve tedavi yöntemleri.',
    ref: [
      { t: 'Yanık türleri', b: [
        '<b>Termal:</b> alev, sıcak sıvı, sıcak katı, buhar; derinlik temas süresi, sıcaklık ve deri kalınlığına bağlı.',
        '<b>Soğuk (donma):</b> buz kristalleri hücreleri patlatır; hemokonsantrasyon, tromboz, hipoksi.',
        '<b>Elektrik:</b> akımın yolu, doku direnci ve süreye bağlı termal hasar. <b>Radyasyon:</b> UV ya da iyonize radyasyon; en sık güneş yanığı.',
        '<b>İnhalasyon:</b> toksik dumanlar solunum yolunda kimyasal yanık; sıklıkla farinks; <b>karbonmonoksit</b> hücresel solunumu bozar. Ayrıca <b>kimyasal</b> yanıklar.'] },
      { t: 'Yanık derecesi', art: () => burnArt('d2s'), b: [
        '<b>1. derece:</b> yalnız epidermis; kabarık değil, ağrılı, kuru, kırmızı, <b>basmakla solar</b>. Ör. güneş yanığı.',
        '<b>Yüzeyel 2.:</b> 24 saatte büller; ağrılı, kıpkırmızı, nemli, basmakla solar; 7–21 günde düzelir, skar nadir.',
        '<b>Derin 2.:</b> retiküler dermise uzanır; yalnız dokunmakla ağrı, kolay soyulan büller, kırmızı-beyaz alacalı, <b>basmakla solmayan mumsu</b> görünüm.',
        '<b>3.:</b> tüm katmanlar; anestetik/hipoestetik, mumlu beyaz-gri-siyah, kuru, bül yok, tam iyileşme beklenmez. <b>4.:</b> fasya, kas, kemik.'] },
      { t: 'Genişlik, şok ve dönemler', b: [
        '<b>Wallace Dokuzlar Kuralı:</b> vücut 9 ve katlarına ayrılır; hızlı ve kolay. <b>Çocuklarda kullanılmaz</b> (beden oranları yaşla değişir).',
        '<b>Yanık şoku:</b> kapiller geçirgenlik artar → plazma sızar → ödem ve hacim kaybı → doku hipoksisi, çoklu organ yetmezliği.',
        'Sıvı kaybı <b>ilk 8 saatte en fazla</b>, 36–48 saat sürer. <b>Diüretik dönem</b> 48–72 saat sonra: sıvı damar içine döner, aşırı sıvı yüklenmesi riski.',
        'İlk 48 saat <b>hiperkalemi</b>, ~1 hafta sonra <b>hipokalemi</b>; ilk günler hipernatremi, fazla sıvıda hiponatremi; negatif nitrojen dengesi.'] },
      { t: 'İlk yardım ve tedavi', b: [
        'Kaynakla teması kes; alev varsa <b>“Dur, Yat, Yuvarlan”</b> ya da battaniye. <b>10–20 dk, 15–20 °C</b> akan su; buz yok.',
        'Takı ve sıkı giysileri hemen çıkar; deriye yapışanı zorlama, etrafından kes. Temiz/steril örtü ya da streç filmle gevşekçe ört.',
        '<b>Açık yöntem:</b> yüz, boyun, perine, geniş göğüs; hava ile temas, izolasyon şart. <b>Yarı açık:</b> antimikrobiyal ajan + ince gaz. <b>Kapalı:</b> günde en az bir yıkama ve pansuman; derin büyük yaralar, ağrılı.',
        '<b>Fasyatomi:</b> fasyanın kesilmesi. <b>Eskaratomi:</b> eskarın kesilmesi. <b>Debridman:</b> nekrotik dokunun sağlıklı dokuya kadar çıkarılması. <b>Homogreft:</b> insandan; <b>heterogreft:</b> başka canlıdan (ör. domuz derisi, üç günde bir değişir).'] },
    ],
    rounds: [
      { type: 'match', title: 'Yanık derecesini eşleştir', prompt: 'Her deri kesitinde yanığın ulaştığı derinliğe bak ve doğru dereceyi yerleştir.',
        pairs: [
          { id: 'd1', label: '1. derece', art: () => burnArt('d1'), caption: 'Kabarık değil, kuru, kırmızı; basmakla solar', reveal: 'Yalnız epidermis · ör. güneş yanığı', hint: '1. derece yalnız epidermisi içerir; kabarık olmayan, kuru, kırmızı ve basmakla solan lezyondur.' },
          { id: 'd2s', label: 'Yüzeyel 2. derece', art: () => burnArt('d2s'), caption: 'Büller, nemli, kıpkırmızı, çok ağrılı; basmakla solar', reveal: '7–21 günde düzelir, skar nadir', hint: 'Yüzeyel 2. derecede 24 saat içinde büller oluşur; ağrılı, nemli ve basmakla solan görünümdedir.' },
          { id: 'd2d', label: 'Derin 2. derece', art: () => burnArt('d2d'), caption: 'Kırmızı-beyaz alacalı, mumsu; basmakla solmaz', reveal: 'Retiküler dermise uzanır', hint: 'Derin 2. derece retiküler dermise uzanır; yalnız dokunmakla ağrır ve basmakla solmaz.' },
          { id: 'd3', label: '3. derece', art: () => burnArt('d3'), caption: 'Kuru, mumlu beyaz-siyah, bül yok, duyu kaybı', reveal: 'Tam iyileşme beklenmez', hint: '3. derece derinin tüm katmanlarına uzanır; anestetik ya da hipoestetiktir, bül yoktur.' },
          { id: 'd4', label: '4. derece', art: () => burnArt('d4'), caption: 'Fasya, kas veya kemik etkilenmiş', reveal: 'Hayatı tehdit edebilir', hint: '4. derece yanık fasya, kas veya kemik gibi alttaki dokulara uzanır.' },
        ] },
      { type: 'order', title: 'Yanıkta ilk yardım sırası', prompt: 'Kıyafeti alev alan bir hastaya ulaştın. İlk yardım adımlarını doğru sırayla uygula; yanlış uygulamaları seçme.',
        steps: [
          { text: 'Isı, elektrik veya kimyasal kaynakla teması derhal kes', why: 'Önce yakan kaynak ortadan kaldırılır.' },
          { text: 'Alevi “Dur, Yat, Yuvarlan” ya da kalın battaniyeyle söndür (hastayı koşturma)', why: 'Koşmak alevi büyütür; yuvarlanmak ya da battaniye oksijeni keser.' },
          { text: 'Yanık bölgesini 10–20 dakika ılık/serin (15–20 °C) akan suda tut', why: 'Vakit kaybetmeden serin akan su hasarı sınırlar.' },
          { text: 'Yüzük, saat, bilezik ve sıkı giysileri hemen çıkar', why: 'Ödem hızla geliştiği için takılar ve sıkı giysiler erkenden çıkarılır.' },
          { text: 'Deriye yapışan giysiyi zorlama, etrafından kes', why: 'Yapışan giysiyi çekmek dokuyu koparır.' },
          { text: 'Temiz, nemli/kuru steril gazlı bez ya da streç filmle gevşekçe ört', why: 'Son olarak yara gevşek bir örtüyle kapatılır.' },
        ],
        distractors: [
          { text: 'Yanığa buz ya da çok soğuk su uygula', why: 'Ani soğuk damarları büzüştürerek doku hasarını artırır.' },
          { text: 'Deriye yapışmış giysiyi çekip çıkar', why: 'Yapışmış giysi zorlanarak çıkarılmaz, etrafından kesilir.' },
          { text: 'Yarayı sıkıca sararak kapat', why: 'Ödem gelişeceği için örtü gevşek olmalıdır.' },
        ] },
      { type: 'tbsa', title: 'Dokuzlar Kuralı ile yanık genişliği', prompt: 'Vakayı oku, yanık olan bölgeleri ön ve arka görünümde boya, sonra kontrol et.',
        cases: [
          { text: '<b>Vaka 1.</b> 34 yaşında kadın; üzerine kaynar su dökülmüş. Gövdenin <b>ön yüzü</b> (göğüs ve karın) ile <b>sağ kolun tamamında</b> (ön ve arka) 2. derece yanık var.', regions: ['trunk-f', 'armR-f', 'armR-b'], why: 'Gövde ön %18 + sağ kol %9 (ön %4,5 + arka %4,5) = %27.' },
          { text: '<b>Vaka 2.</b> Alev yanığı: <b>her iki bacağın ön yüzü</b> ve <b>perinede</b> derin 2. derece yanık var.', regions: ['legR-f', 'legL-f', 'peri'], why: 'Bacak ön yüzleri %9 + %9, perine %1 = %19.' },
          { text: '<b>Vaka 3.</b> Yetişkin erkek, yangından kurtarılmış. <b>Sırtın tamamı</b> ile <b>her iki kolun arka yüzünde</b> 3. derece yanık var.', regions: ['trunk-b', 'armR-b', 'armL-b'], why: 'Gövde arka %18 + kolların arka yüzleri %4,5 + %4,5 = %27. Not: Dokuzlar Kuralı çocuklarda kullanılmaz.' },
        ] },
      { type: 'match', title: 'Yanıkta tedavi ve girişimler', prompt: 'Her tanımı doğru yöntemle eşleştir.',
        pairs: [
          { id: 'acik', label: 'Açık yöntem', caption: 'Yüz, boyun, perine, geniş göğüs yanığı temizlenir ve hava ile teması sağlanır', reveal: 'İzolasyon tekniği şart', hint: 'Açık yöntemde yanıklı bölge hava ile temas eder; izolasyon şarttır.' },
          { id: 'yari', label: 'Yarı açık yöntem', caption: 'Lokal antimikrobiyal ajan ince bir gaz tabakasıyla yarayla temasta tutulur', reveal: 'Debridmanı hızlandırır, grefti destekler', hint: 'Yarı açık yöntemde antimikrobiyal ajan ince gazla yarayla temasta tutulur.' },
          { id: 'kapali', label: 'Kapalı yöntem', caption: 'Günde en az bir kez yıkama ve pansuman; derin büyük yaralar', reveal: 'Ağrılıdır, enfeksiyona dikkat', hint: 'Kapalı yöntemde yara günde en az bir kez yıkanır ve pansuman değiştirilir.' },
          { id: 'eskar', label: 'Eskaratomi', caption: 'Eskarın kesilmesi', reveal: 'Cerrahi girişim', hint: 'Eskaratomi eskarın kesilmesidir.' },
          { id: 'fasya', label: 'Fasyatomi', caption: 'Fasyanın kesilmesi', reveal: 'Cerrahi girişim', hint: 'Fasyatomi fasyanın kesilmesidir.' },
          { id: 'debr', label: 'Debridman', caption: 'Nekrotik dokunun sağlıklı dokuya ulaşana kadar çıkarılması', reveal: 'Ölü doku temizliği', hint: 'Debridman nekrotik dokunun sağlıklı dokuya kadar çıkarılmasıdır.' },
        ] },
      { type: 'quiz', title: 'Yanık vakaları', questions: [
        { q: 'Yanık sonrası damar içi sıvı kaybı en çok hangi zaman diliminde olur?', options: ['İlk 8 saatte', '48–72. saatte', 'Birinci haftada', 'İkinci haftada'], why: 'Damar içi sıvı kaybı yanıktan itibaren ilk sekiz saatte en fazladır ve 36–48 saat devam eder.' },
        { q: 'Yanıklı hastada ilk 48 saatte hangi elektrolit bozukluğu beklenir?', options: ['Hiperkalemi', 'Hipokalemi', 'Hiponatremi', 'Hipokalsemi'], why: 'Hücre içindeki potasyum hücre dışına çıktığı için ilk 48 saatte hiperkalemi görülebilir; yaklaşık bir hafta sonra hipokalemi gelişebilir.' },
        { q: 'Diüretik dönem genellikle ne zaman başlar ve en önemli riski nedir?', options: ['48–72 saat sonra; aşırı sıvı yüklenmesi', 'İlk 8 saatte; hipovolemik şok', 'İlk saatte; hipotermi', '2 hafta sonra; kontraktür'], why: 'Kapiller bütünlük oluşmaya başlayınca (48–72 saat) ödem sıvısı damar yatağına döner; aşırı sıvı yüklenmesi oluşabilir.' },
        { q: 'Dokuzlar Kuralı neden çocuklarda kullanılmaz?', options: ['Çocukların beden yüzdeleri yaşla değiştiği için', 'Çocuk derisi daha kalın olduğu için', 'Çocuklarda yanık şoku görülmediği için', 'Hesaplaması çok uzun sürdüğü için'], why: 'Çocukların beden yüzdeleri yaşla değiştiği için bu yöntem çocuklarda kullanılmaz.' },
        { q: 'Yangından kurtarılan hastada solunum yolu hasarı ve hücresel solunum bozukluğu düşünülüyor. Hücresel solunumu bozan gaz hangisidir?', options: ['Karbonmonoksit', 'Oksijen', 'Azot', 'Karbondioksit'], why: 'Yanmadan üretilen karbonmonoksit hücresel solunumu bozar; inhalasyon yanıklarında sıklıkla farinks etkilenir.' },
        { q: 'Domuz derisi gibi başka bir canlıdan alınan biyolojik örtüye ne ad verilir?', options: ['Heterogreft', 'Homogreft', 'Otogreft', 'Flep'], why: 'Heterogreft başka bir canlıdan alınır (ör. domuz derisi), kolay uyum sağlar ve üç günde bir değiştirilir. Homogreft insandan alınır.' },
        { q: 'Yanıkta greft için yaranın hazır olduğunu gösteren bulgu hangisidir?', options: ['Koyu kırmızı, sağlam, düz, çok az akıntılı granülasyon dokusu', 'Siyah, kuru eskar', 'Sarı, bol akıntılı yara yatağı', 'Kanayan, düzensiz kenarlı yara'], why: 'Koyu kırmızı, sağlam, düz ve çok az akıntılı granülasyon dokusu yaranın grefte hazır olduğunu gösterir.' },
      ] },
    ],
  },

  /* ---------------- 6. CERRAHİ, KRONİK YARA VE HEMŞİRELİK BAKIMI ---------------- */
  {
    id: 'care', title: 'Cerrahi Yara ve Hemşirelik Bakımı', icon: 'scalpel', color: '#B83A55',
    short: 'Cerrahi yara bulguları, venöz ülser, enfeksiyon kontrolü, beslenme ve ağrı yönetimi, hasta eğitimi.',
    ref: [
      { t: 'Cerrahi yara', b: [
        'Steril şartlarda yapılan kesi sonrası oluşan <b>kontrollü doku hasarı</b>; amacı tedavidir.',
        'Kapatma: <b>dikiş (sütür), zımba (stapler), yapıştırıcı bant, cerrahi doku yapıştırıcısı</b>, bazen açık bırakma.',
        '<b>Beklenen:</b> hafif ağrı, gerginlik, hafif kızarıklık, minimal sızıntı, kaşıntı, sertlik, hafif morluk.',
        '<b>Tehlike:</b> artan kızarıklık, şiddetli ağrı, kötü kokulu akıntı, sarı/yeşil iltihap, ateş, yaranın açılması, kanama, şişlik, dikişlerin ayrılması.'] },
      { t: 'Venöz ülser', b: [
        'Sıklıkla <b>medial malleol</b> çevresi; yüzeysel, düzensiz kenarlı, eksüdalı.',
        'Ödem, varis, hemosiderin renklenmesi, staz dermatiti eşlik edebilir; ağrı elevasyonla azalabilir.',
        '<b>Arteriyel dolaşım değerlendirilmeden kompresyon başlanmaz.</b>',
        'Bakım: uygun kompresyon, bacak elevasyonu, baldır kas pompası egzersizi, eksüdaya uygun örtü, çevre deri koruması.'] },
      { t: 'Enfeksiyon kontrolü', b: [
        '<b>Lokal:</b> yayılan kızarıklık, ısı artışı, ağrı artışı/zonklama, ödem, kötü kokulu pürülan akıntı, fonksiyon kaybı.',
        '<b>Sistemik:</b> ateş, titreme, taşikardi, halsizlik, lökositoz.',
        'Korunma: pansumandan önce <b>el hijyeni</b>, bariyer pansuman, debridmanla ölü dokunun uzaklaştırılması.'] },
      { t: 'Hemşirelik yaklaşımları', b: [
        'Sistematik değerlendirme: tip, evre, boyut (uzunluk-genişlik-derinlik), eksüda, yara yatağı; <b>dokümantasyon.</b>',
        'Pansuman: emici köpük, hidrojel, hidrokolloid; enfeksiyonda <b>gümüşlü</b> ürünler.',
        'Beslenme: protein <b>1,2–1,5 g/kg/gün</b>; <b>C vitamini</b> kollajen, <b>çinko</b> hücre bölünmesi-bağışıklık, <b>A vitamini</b> epitelizasyon; sıvı <b>30–35 mL/kg</b> (yanıkta 9’lar kuralına göre).',
        'Ağrı: VAS ile değerlendir; analjezik pansumandan <b>30–45 dk önce</b>; yapışmayan (silikon) örtü; yapışanı ılık SF ile yumuşat.'] },
    ],
    rounds: [
      { type: 'tf', title: 'Beklenen mi, tehlike mi?', prompt: 'Ameliyat sonrası 3. gün. Her bulgu için “bu bulgu beklenen (normal) bir bulgudur” ifadesine karar ver.',
        items: [
          { s: 'Kesi çevresinde hafif kızarıklık ve kaşıntı beklenen bir bulgudur.', a: true, why: 'Hafif kızarıklık ve kaşıntı cerrahi yarada beklenen bulgulardandır.' },
          { s: 'Kötü kokulu, sarı-yeşil akıntı beklenen bir bulgudur.', a: false, why: 'Kötü kokulu akıntı ve sarı/yeşil iltihap tehlike bulgusudur.' },
          { s: 'Gerginlik ve sertlik hissi beklenen bir bulgudur.', a: true, why: 'Gerginlik ve sertlik hissi beklenen bulgulardandır.' },
          { s: 'Ateş ve giderek artan kızarıklık beklenen bir bulgudur.', a: false, why: 'Ateş ve artan kızarıklık tehlike bulgusudur; hasta sağlık kuruluşuna başvurmalıdır.' },
          { s: 'Minimal sızıntı ve hafif morluk beklenen bir bulgudur.', a: true, why: 'Minimal sızıntı ve hafif morluk beklenen bulgulardandır.' },
          { s: 'Dikişlerin ayrılması beklenen bir bulgudur.', a: false, why: 'Dikişlerin ayrılması ve yaranın açılması tehlike bulgusudur.' },
        ] },
      { type: 'match', title: 'Beslenme yönetimi', prompt: 'Her besin öğesini yara iyileşmesindeki göreviyle ya da önerilen miktarıyla eşleştir.',
        pairs: [
          { id: 'pro', label: 'Protein', caption: '1,2–1,5 g/kg/gün', reveal: 'Doku onarımı', hint: 'Yara iyileşmesi ve doku onarımı için 1,2–1,5 g/kg/gün protein önerilir.' },
          { id: 'vc', label: 'C vitamini', caption: 'Kollajen sentezi', reveal: 'Mikro besin', hint: 'C vitamini kollajen sentezi için önerilir.' },
          { id: 'zn', label: 'Çinko', caption: 'Hücre bölünmesi ve bağışıklık', reveal: 'Mikro besin', hint: 'Çinko hücre bölünmesi ve bağışıklık için önerilir.' },
          { id: 'va', label: 'A vitamini', caption: 'Epitelizasyon', reveal: 'Mikro besin', hint: 'A vitamini epitelizasyon için önerilir.' },
          { id: 'sv', label: 'Sıvı', caption: '30–35 mL/kg/gün (yanıkta 9’lar kuralına göre)', reveal: 'Doku perfüzyonu', hint: 'Kontrendikasyon yoksa günlük 30–35 mL/kg sıvı desteklenir; yanıkta 9’lar kuralına göre hesaplanır.' },
        ] },
      { type: 'quiz', title: 'Bakım kararları', questions: [
        { q: 'Medial malleol çevresinde düzensiz kenarlı, eksüdalı venöz ülseri olan hastada kompresyon başlamadan önce ne yapılmalıdır?', options: ['Arteriyel dolaşım değerlendirilmeli', 'Bacak aşağı sarkıtılmalı', 'Yara kurutulmalı', 'Hasta yatak istirahatine alınmalı'], why: 'Arteriyel dolaşım değerlendirilmeden kompresyon başlanmamalıdır.' },
        { q: 'Pansuman sırasında ağrıyı azaltmak için hekim istemindeki analjezik ne zaman verilmelidir?', options: ['Pansumandan 30–45 dakika önce', 'Pansumandan hemen sonra', 'Pansuman sırasında', 'Ağrı başladığında'], why: 'Analjezik pansuman değişiminden 30–45 dakika önce uygulanır.' },
        { q: 'Aşağıdakilerden hangisi sistemik enfeksiyon belirtisidir?', options: ['Ateş, titreme, taşikardi, lökositoz', 'Yara çevresinde yayılan kızarıklık', 'Yara bölgesinde ısı artışı', 'Yara çevresinde ödem'], why: 'Ateş, titreme, taşikardi, halsizlik ve lökositoz sistemik belirtilerdir; diğerleri lokal belirtilerdir.' },
        { q: 'Enfeksiyon bulguları olan yarada hangi pansuman ürünü tercih edilir?', options: ['Gümüşlü pansuman', 'Kuru gazlı bez', 'Şeffaf film', 'Koruyucu su geçirmez örtü'], why: 'Enfeksiyon durumuna uygun olarak gümüşlü pansumanlar seçilir.' },
        { q: 'Yara yatağına yapışmış pansuman nasıl çıkarılmalıdır?', options: ['Ilık serum fizyolojik ile yumuşatılarak nazikçe', 'Hızlıca tek hareketle çekilerek', 'Alkolle ıslatılarak', 'Kuru haldeyken makasla kazınarak'], why: 'Yapışan kısımlar ılık serum fizyolojik ile yumuşatılarak nazikçe çıkarılır.' },
        { q: 'Basınç yaralanması olan hastaya en geç ne sıklıkla pozisyon verilmelidir?', options: ['2 saatte bir', '6 saatte bir', '8 saatte bir', 'Günde bir kez'], why: 'Basınç yaralanmalarında hastaya en geç 2 saatte bir pozisyon verilir; havalı yatak ve destek yüzeyleri kullanılır.' },
      ] },
      { type: 'tf', title: 'Enfeksiyon kontrolü ve eğitim', prompt: 'Her ifade için karar ver.',
        items: [
          { s: 'Pansuman değişikliğinden önce el hijyeni sağlanmalıdır.', a: true, why: 'El hijyeni enfeksiyondan korunmanın temelidir.' },
          { s: 'Yara değerlendirmesinde yalnız yaranın boyutu ölçülür, eksüda kaydedilmez.', a: false, why: 'Tip, evre, boyut, eksüda miktarı/niteliği ve yara yatağı düzenli değerlendirilip dokümante edilir.' },
          { s: 'Hastaya kızarıklık, ateş veya kötü kokulu akıntıda ne zaman başvuracağı öğretilmelidir.', a: true, why: 'Komplikasyon belirtilerinde başvuru zamanı hasta ve yakınına öğretilir.' },
          { s: 'Ölü dokuların debridmanla uzaklaştırılması enfeksiyon kontrolüne katkı sağlar.', a: true, why: 'Büyüme ve iyileşmeyi bozan ölü dokular debridmanla uzaklaştırılır.' },
          { s: 'Venöz ülserde ağrı genellikle bacak elevasyonuyla artar.', a: false, why: 'Venöz ülserde ağrı bacak elevasyonuyla azalabilir.' },
        ] },
    ],
  },
];
