/* ================= bölüm içerikleri ================= */
const LEVELS = [
  /* ---------------- 1. YANIK ---------------- */
  {
    id: 'burn', title: 'Yanık Yarası', icon: 'flame', color: '#D2602A',
    short: 'Yanık derinliği, Dokuzlar Kuralı ile %TBSA, ilk yardım sırası ve yanık evreleri.',
    ref: [
      { t: 'Yanık derinliği', art: () => burnArt('d2s'), b: [
        '<b>1. derece:</b> yalnız epidermis; kırmızı, kuru, ağrılı, bül yok. 3–7 günde iz bırakmadan iyileşir.',
        '<b>Yüzeyel 2. derece:</b> epidermis + üst dermis; bül, nemli, çok ağrılı. 2–3 haftada iyileşir.',
        '<b>Derin 2. derece:</b> dermisin derini; beyaz-kırmızı benekli, ağrı azalmış. 3 haftadan uzun, skar, greft gerekebilir.',
        '<b>3. derece (tam kat):</b> dermisin tamamı; kuru, deri gibi (eskar), beyaz/kahverengi, ağrısız. Greft gerekir.',
        '<b>4. derece:</b> kas, tendon, kemik; kömürleşmiş görünüm.'] },
      { t: 'Dokuzlar Kuralı (yetişkin)', b: [
        'Baş-boyun <b>%9</b> · her bir kol <b>%9</b>',
        'Gövde ön yüz <b>%18</b> · gövde arka yüz <b>%18</b>',
        'Her bir bacak <b>%18</b> · perine <b>%1</b>',
        '<b>1. derece yanıklar %TBSA hesabına katılmaz.</b>',
        'Küçük, dağınık yanıklarda hastanın parmaklarıyla birlikte avuç içi ≈ %1.'] },
      { t: 'Yanık evreleri (fazları)', b: [
        '<b>Acil / resüsitasyon:</b> ilk 24–72 saat; kapiller sızıntı, ödem, hipovolemi, şok riski. Öncelik hava yolu ve sıvı.',
        '<b>Akut:</b> diürezin başlamasıyla başlar, yara kapanana kadar sürer. Enfeksiyon kontrolü, debridman, greft, beslenme.',
        '<b>Rehabilitasyon:</b> yara kapandıktan sonra aylar–yıllar. Kontraktür ve hipertrofik skar önleme, basınçlı giysi, psikososyal destek.'] },
      { t: 'İlk yardım ve Parkland', b: [
        'Yanmayı durdur → ABC → takıları çıkar → <b>20 dk serin akan su</b> → hastayı sıcak tut → streç film ya da temiz örtü → sevk.',
        'Buz, yağ, diş macunu, yoğurt sürülmez; bül patlatılmaz.',
        '<b>Parkland:</b> 4 mL × kg × %TBSA (Ringer laktat) / 24 saat. Yarısı yanık anından itibaren ilk 8 saatte, kalanı sonraki 16 saatte.',
        'Hedef idrar çıkışı yetişkinde <b>0,5 mL/kg/saat</b>.'] },
    ],
    rounds: [
      { type: 'match', title: 'Yanık derinliğini eşleştir', prompt: 'Her deri kesitinde yanığın ulaştığı derinliğe bak ve doğru yanık derecesini yerleştir.',
        pairs: [
          { id: 'd1', label: '1. derece', art: () => burnArt('d1'), caption: 'Kırmızı, kuru, ağrılı; bül yok', reveal: 'Yalnız epidermis · 3–7 günde iz bırakmadan iyileşir', hint: '1. derece yalnızca epidermisi etkiler; bül oluşmaz, deri kuru ve kırmızıdır.' },
          { id: 'd2s', label: 'Yüzeyel 2. derece', art: () => burnArt('d2s'), caption: 'Gergin büller, nemli, çok ağrılı', reveal: 'Epidermis + üst dermis · 2–3 haftada iyileşir', hint: 'Yüzeyel 2. derecede hasar üst dermistedir; sinir uçları sağlam olduğu için çok ağrılıdır ve bül oluşur.' },
          { id: 'd2d', label: 'Derin 2. derece', art: () => burnArt('d2d'), caption: 'Beyaz-kırmızı benekli, ağrı azalmış', reveal: 'Dermisin derini · 3+ hafta, skar, greft gerekebilir', hint: 'Derin 2. derecede hasar dermisin derinine iner; sinir uçlarının bir kısmı hasar gördüğü için ağrı azalır.' },
          { id: 'd3', label: '3. derece', art: () => burnArt('d3'), caption: 'Kuru, deri gibi eskar, ağrısız', reveal: 'Tüm dermis (tam kat) · greft gerekir', hint: '3. derecede dermisin tamamı yıkılır; sinir uçları hasar gördüğü için yara ağrısızdır.' },
          { id: 'd4', label: '4. derece', art: () => burnArt('d4'), caption: 'Kömürleşmiş, derin yapılar etkilenmiş', reveal: 'Kas, tendon, kemik · rekonstrüksiyon/amputasyon', hint: '4. derece yanık deri altını geçip kas, tendon ya da kemiğe ulaşır.' },
        ] },
      { type: 'order', title: 'Yanıkta ilk yardım sırası', prompt: 'Mutfakta kaynar yağ dökülen bir hastaya ulaştın. İlk yardım adımlarını doğru sırayla uygula; yanlış uygulamaları seçme.',
        steps: [
          { text: 'Yanma sürecini durdur (alevi söndür, elektrikte akımı kes)', why: 'Önce yakan kaynak ortadan kaldırılır; aksi halde doku hasarı sürer.' },
          { text: 'Hava yolu, solunum ve dolaşımı değerlendir', why: 'Yanma durdurulduktan sonra yaşamı tehdit eden durumlar (ABC) önceliklidir.' },
          { text: 'Takı, saat ve yanmış giysileri çıkar (yapışanı çekme)', why: 'Ödem gelişmeden önce sıkıştırıcı takılar çıkarılmalıdır; bu soğutmadan önce yapılır.' },
          { text: 'Yanığı 20 dakika serin akan suyla soğut', why: 'Soğutma, takılar çıkarıldıktan sonra yapılır. Serin (15–25 °C) akan su hasarı sınırlar ve ağrıyı azaltır.' },
          { text: 'Yanığı streç film ya da temiz örtüyle ört, hastayı battaniyeyle sıcak tut', why: 'Yara soğutulduktan sonra örtülür ve hipotermi önlenir; streç film yapışmaz, yarayı görmeyi sağlar.' },
          { text: 'Sağlık kuruluşuna ulaştır', why: 'Son adım sevktir; geniş, derin, yüz-el-perine yanıkları yanık merkezinde değerlendirilir.' },
        ],
        distractors: [
          { text: 'Yanığa buz uygula', why: 'Buz damarları daraltarak hasarı derinleştirir ve hipotermiye yol açar.' },
          { text: 'Bülleri patlat', why: 'Bül doğal ve steril bir örtüdür; ilk yardımda patlatılmaz.' },
          { text: 'Diş macunu ya da yoğurt sür', why: 'Ev ilaçları enfeksiyon riskini artırır ve yaranın değerlendirilmesini zorlaştırır.' },
        ] },
      { type: 'tbsa', title: 'Dokuzlar Kuralı ile %TBSA', prompt: 'Vakayı oku, yanık olan bölgeleri ön ve arka görünümde boya, sonra kontrol et.',
        cases: [
          { text: '<b>Vaka 1.</b> 34 yaşında kadın; üzerine kaynar su dökülmüş. Gövdenin <b>ön yüzü</b> (göğüs ve karın) ile <b>sağ kolun tamamında</b> (ön ve arka) 2. derece yanık var.', regions: ['trunk-f', 'armR-f', 'armR-b'], why: 'Gövde ön %18 + sağ kol %9 (ön %4,5 + arka %4,5) = %27.' },
          { text: '<b>Vaka 2.</b> Alev yanığı: <b>her iki bacağın ön yüzü</b> ve <b>perinede</b> derin 2. derece yanık; yüzünde güneşten kaynaklı <b>1. derece</b> kızarıklık var.', regions: ['legR-f', 'legL-f', 'peri'], why: 'Bacak ön yüzleri %9 + %9, perine %1 = %19. Yüzdeki 1. derece yanık %TBSA hesabına katılmaz.' },
          { text: '<b>Vaka 3.</b> 60 kg erkek, yangından kurtarılmış. <b>Sırtın tamamı</b> ile <b>her iki kolun arka yüzünde</b> 3. derece yanık var.', regions: ['trunk-b', 'armR-b', 'armL-b'], why: 'Gövde arka %18 + kolların arka yüzleri %4,5 + %4,5 = %27. Parkland: 4 × 60 × 27 = 6480 mL/24 saat; ilk 8 saatte 3240 mL.' },
        ] },
      { type: 'quiz', title: 'Yanık vakaları', questions: [
        { q: 'Kaynar suyla haşlanan hastanın elinde gergin büller var; yara nemli ve dokunmakla çok ağrılı. En olası yanık derinliği hangisidir?', art: () => burnArt('d2s'), options: ['Yüzeyel 2. derece', '1. derece', '3. derece', '4. derece'], why: 'Bül, nem ve şiddetli ağrı, sinir uçlarının korunduğu yüzeyel 2. derece yanığı gösterir.' },
        { q: '3. derece yanıkta ağrının az olmasının nedeni nedir?', options: ['Dermisteki sinir uçlarının yıkılması', 'Epidermisin kalınlaşması', 'Bül sıvısının ağrıyı baskılaması', 'Bölgeye kan akımının artması'], why: 'Tam kat yanıkta dermisin tamamı ve içindeki sinir uçları hasar gördüğü için yara ağrısızdır. Çevresindeki daha yüzeyel alanlar ise ağrılı olabilir.' },
        { q: '70 kg, %30 TBSA yanığı olan yetişkin. Parkland formülüne göre ilk 8 saatte verilmesi gereken Ringer laktat miktarı nedir?', options: ['4200 mL', '8400 mL', '2100 mL', '6300 mL'], why: '4 × 70 × 30 = 8400 mL/24 saat. Yarısı (4200 mL) yanık anından itibaren ilk 8 saatte verilir.' },
        { q: 'Yanık hastasında sıvı resüsitasyonunun yeterliliğini izlemede en güvenilir göstergelerden biri hangisidir?', options: ['Saatlik idrar çıkışı (≈0,5 mL/kg/saat)', 'Günlük vücut ağırlığı', 'Yaranın rengi', 'Ağrı skoru'], why: 'İdrar çıkışı doku perfüzyonunu yansıtır; yetişkinde 0,5 mL/kg/saat hedeflenir ve sıvı hızı buna göre ayarlanır.' },
        { q: 'Akut faza geçişin göstergesi olarak kabul edilen bulgu hangisidir?', options: ['Diürezin başlaması', 'Kontraktür gelişmesi', 'Bül oluşumu', 'Hipovolemik şok'], why: 'Kapiller bütünlük düzelip ödem sıvısı damar içine dönünce diürez başlar; bu genellikle 48–72. saatte akut fazın başladığını gösterir.' },
      ] },
      { type: 'match', title: 'Yanık evrelerini eşleştir', prompt: 'Yanık bakımının üç fazını özellikleriyle eşleştir.',
        pairs: [
          { id: 'res', label: 'Acil / resüsitasyon', art: () => badgeArt('iv'), caption: 'İlk 24–72 saat: kapiller sızıntı, ödem, hipovolemi', reveal: 'Öncelik: hava yolu, sıvı replasmanı, idrar takibi', hint: 'Acil faz ilk 24–72 saati kapsar; sıvı damar dışına kaçar ve şok riski en yüksektir.' },
          { id: 'acu', label: 'Akut faz', art: () => badgeArt('shield'), caption: 'Diürezle başlar, yara kapanana kadar sürer', reveal: 'Öncelik: enfeksiyon kontrolü, debridman, greft, beslenme', hint: 'Akut faz diürezle başlar ve yaralar kapanana kadar sürer; en büyük tehlike enfeksiyondur.' },
          { id: 'reh', label: 'Rehabilitasyon', art: () => badgeArt('stretch'), caption: 'Yara kapandıktan sonra aylar–yıllar', reveal: 'Öncelik: kontraktür ve skar önleme, basınçlı giysi, psikososyal destek', hint: 'Rehabilitasyon yaralar kapandıktan sonra başlar; hedef fonksiyonu ve görünümü korumaktır.' },
        ] },
    ],
  },

  /* ---------------- 2. BASI YARASI ---------------- */
  {
    id: 'pressure', title: 'Bası Yarası', icon: 'bed', color: '#7E55A8',
    short: 'NPIAP evreleri, risk bölgeleri, Braden ölçeği ve önleme uygulamaları.',
    ref: [
      { t: 'NPIAP evreleri', art: () => ulcerArt('s3'), b: [
        '<b>Evre 1:</b> deri bütün, basınca solmayan eritem.',
        '<b>Evre 2:</b> kısmi kalınlık kaybı; pembe-kırmızı, nemli yatak ya da seröz bül. Yağ dokusu görünmez.',
        '<b>Evre 3:</b> tam kat deri kaybı; yağ dokusu görünür, granülasyon ve epibol olabilir. Kas, tendon, kemik görünmez.',
        '<b>Evre 4:</b> fasya, kas, tendon, kıkırdak ya da kemik görünür veya ele gelir; tünel ve cep sıktır.'] },
      { t: 'Evrelendirilemeyen ve DTI', art: () => ulcerArt('dti'), b: [
        '<b>Evrelendirilemeyen:</b> taban slough ya da eskarla kaplı olduğu için derinlik görülemez. Temizlenince Evre 3 ya da 4 çıkar.',
        '<b>Derin doku hasarı (DTI):</b> bütün ya da bütünlüğü bozulmuş deride solmayan koyu kırmızı, bordo, mor renk ya da kan dolu bül.',
        '<b>Ters evrelendirme yapılmaz:</b> iyileşen Evre 4 "iyileşmekte olan Evre 4" olarak kaydedilir.'] },
      { t: 'Risk değerlendirme: Braden', b: [
        '6 alt boyut: <b>duyusal algı, nem, aktivite, hareket, beslenme, sürtünme-yırtılma</b>.',
        'Puan aralığı <b>6–23</b>; puan düştükçe risk artar.',
        '<b>≤18</b> risk var, <b>≤9</b> çok yüksek risk.',
        'Kabulde ve hastanın durumu değiştikçe tekrarlanır.'] },
      { t: 'Önleme', b: [
        'Yatağa bağımlı hastada <b>en az 2 saatte bir</b> pozisyon (bireyselleştirilerek).',
        '<b>30° lateral</b> yan yatış; yatak başı mümkünse <b>≤30°</b>.',
        'Topuklar yataktan kaldırılır; basınç dağıtan yüzey kullanılır.',
        'Kızarık bölgeye <b>masaj yapılmaz</b>; simit (halka) yastık kullanılmaz.',
        'Nem kontrolü ve bariyer krem; yeterli protein, kalori ve sıvı.'] },
    ],
    rounds: [
      { type: 'match', title: 'Bası yarası evresini eşleştir', prompt: 'Deri kesitlerine bak; her görüntüyü doğru NPIAP sınıfıyla eşleştir.',
        pairs: [
          { id: 's1', label: 'Evre 1', art: () => ulcerArt('s1'), caption: 'Deri bütün, basınca solmayan kızarıklık', reveal: 'Önlem alınırsa geri döner', hint: 'Evre 1’de deri bütündür; parmakla basınca solmayan eritem vardır.' },
          { id: 's2', label: 'Evre 2', art: () => ulcerArt('s2'), caption: 'Sığ, pembe-kırmızı, nemli yara yatağı', reveal: 'Kısmi kalınlık kaybı · yağ dokusu görünmez', hint: 'Evre 2 kısmi kalınlık kaybıdır; yara sığdır, yağ dokusu ve slough görülmez.' },
          { id: 's3', label: 'Evre 3', art: () => ulcerArt('s3'), caption: 'Yağ dokusu görünür, kenarlarda epibol', reveal: 'Tam kat deri kaybı · kas/kemik görünmez', hint: 'Evre 3’te tam kat deri kaybı vardır ve yağ dokusu görünür; kas ya da kemik görünmez.' },
          { id: 's4', label: 'Evre 4', art: () => ulcerArt('s4'), caption: 'Kas ve kemik açıkta, kenar altında tünel', reveal: 'Tam kat doku kaybı · osteomiyelit riski', hint: 'Evre 4’te fasya, kas, tendon ya da kemik açığa çıkar; tünel ve cep sık görülür.' },
          { id: 'un', label: 'Evrelendirilemeyen', art: () => ulcerArt('un'), caption: 'Taban slough ve eskarla örtülü', reveal: 'Derinlik görülemez · debridmandan sonra evrelenir', hint: 'Tabanı slough veya eskarla örtülü yaranın derinliği görülemez; bu yüzden evrelendirilemez.' },
          { id: 'dti', label: 'Derin doku hasarı', art: () => ulcerArt('dti'), caption: 'Deri sağlam, mor-bordo renk, kan dolu bül', reveal: 'Hasar kemik-kas arayüzünde başlar', hint: 'Derin doku hasarında deri bütün olabilir; altta kemik-kas arayüzünde hasar vardır, renk mor-bordodur.' },
        ] },
      { type: 'spots', title: 'Sırtüstü pozisyonda risk bölgeleri', prompt: 'Sırtüstü yatan hastada bası yarası riskinin en yüksek olduğu 5 kemik çıkıntısını bul. Yanlış noktalar eldivene mal olur.',
        how: 'İşaretli noktalardan risk bölgesi olanlara dokun.', counterLabel: 'Bulunan risk bölgesi', fineLabel: 'bu pozisyonda risk bölgesi değil', dots: true, scene: supineScene,
        spots: [
          { x: 27, y: 104, r: 16, err: true, title: 'Oksiput', why: 'Sırtüstü yatışta başın arka kısmı (oksiput) yatağa basınç uygular; özellikle yoğun bakım hastalarında sık görülür.' },
          { x: 96, y: 113, r: 16, err: true, title: 'Skapula', why: 'Kürek kemikleri sırtüstü yatışta yatakla temas eden kemik çıkıntılarıdır.' },
          { x: 176, y: 110, r: 16, err: true, title: 'Dirsek', why: 'Olekranon çıkıntısı yatağa dayanır; dirsekler yastıkla desteklenebilir.' },
          { x: 222, y: 114, r: 16, err: true, title: 'Sakrum', why: 'Sırtüstü pozisyonda en sık bası yarası gelişen bölgedir; yatak başı yükseldikçe sürtünme ve yırtılma artar.' },
          { x: 384, y: 112, r: 16, err: true, title: 'Topuk', why: 'Topuklar ince doku ile kaplıdır; baldır altına yastık konarak topuklar yataktan kaldırılır.' },
          { x: 52, y: 74, r: 16, err: false, title: 'Alın', why: 'Sırtüstü yatışta yüz yukarı bakar. Alın ve yüz, yüzüstü (prone) pozisyonda risklidir.' },
          { x: 130, y: 74, r: 16, err: false, title: 'Sternum', why: 'Göğüs ön yüzü sırtüstü yatışta basınç altında değildir; yüzüstü pozisyonda risklidir.' },
          { x: 300, y: 92, r: 16, err: false, title: 'Patella', why: 'Diz kapağı yüzüstü yatışta risk bölgesidir; sırtüstünde basınç almaz.' },
          { x: 198, y: 74, r: 16, err: false, title: 'Karın', why: 'Karın ön yüzü kemik çıkıntısı değildir ve sırtüstü yatışta basınç almaz.' },
        ] },
      { type: 'quiz', title: 'Bası yarası vakaları', questions: [
        { q: 'Sakral bölgede tabanı tamamen sarı slough ile kaplı, derinliği görülemeyen yara nasıl sınıflandırılır?', art: () => ulcerArt('un'), options: ['Evrelendirilemeyen bası yarası', 'Evre 2', 'Evre 3', 'Derin doku hasarı'], why: 'Taban slough ya da eskarla kaplı olduğunda gerçek derinlik bilinemez. Yara temizlenince Evre 3 ya da 4 olarak evrelenir.' },
        { q: 'Braden ölçeğine göre aşağıdaki puanlardan hangisi en yüksek riski gösterir?', options: ['9', '15', '19', '23'], why: 'Braden puanı 6–23 arasıdır; puan düştükçe risk artar. 9 ve altı çok yüksek risktir.' },
        { q: 'Topukta bütün deride mor-bordo renk değişimi ve kan dolu bül görülüyor. Bu bulgu neyi düşündürür?', art: () => ulcerArt('dti'), options: ['Derin doku hasarı', 'Evre 1', 'Evre 2', 'Evre 4'], why: 'Bütün ya da bütünlüğü bozulmuş deride solmayan mor-bordo renk ve kan dolu bül, derin doku hasarının tipik bulgusudur.' },
        { q: 'Yan yatış pozisyonunda trokanter üzerindeki basıncı azaltmak için önerilen açı hangisidir?', options: ['30° lateral eğim', '90° tam yan yatış', '45° Fowler', 'Yüzüstü 0°'], why: '30° lateral pozisyonda yük trokanter yerine kalça kaslarına dağılır.' },
        { q: 'Braden ölçeğinde yer almayan alt boyut hangisidir?', options: ['Yaş', 'Nem', 'Beslenme', 'Sürtünme ve yırtılma'], why: 'Braden’in 6 alt boyutu: duyusal algı, nem, aktivite, hareket, beslenme, sürtünme-yırtılma. Yaş alt boyut değildir.' },
      ] },
      { type: 'tf', title: 'Önlemede doğru mu, yanlış mı?', prompt: 'Her ifade için karar ver.',
        items: [
          { s: 'Yatağa bağımlı hastaya en az 2 saatte bir pozisyon verilir.', a: true, why: 'Pozisyon sıklığı hastanın riskine ve kullanılan yüzeye göre bireyselleştirilir; genel öneri en az 2 saatte birdir.' },
          { s: 'Kızarık bölgeye masaj yapmak kan dolaşımını artırarak bası yarasını önler.', a: false, why: 'Masaj zaten hasarlı dokuda ek travmaya yol açar; önerilmez.' },
          { s: 'Yatak başı, tıbbi bir engel yoksa 30°’nin üzerine çıkarılmamalıdır.', a: true, why: 'Yatak başı yükseldikçe sakrumda kayma ve yırtılma kuvveti artar.' },
          { s: 'Braden puanı yükseldikçe bası yarası riski artar.', a: false, why: 'Tersi doğrudur: düşük Braden puanı yüksek risk demektir.' },
          { s: 'Bası noktasını korumak için simit şeklinde halka yastık kullanılmalıdır.', a: false, why: 'Halka yastık çevre dokuya basınç uygulayıp dolaşımı bozar; önerilmez.' },
          { s: 'Topuklar, baldır altına yastık konarak yataktan kaldırılır.', a: true, why: 'Topukları yüzer bırakmak (floating) topuk basısını ortadan kaldırır.' },
          { s: 'İnkontinansı olan hastada cilt bariyer krem ve sık bakımla nemden korunur.', a: true, why: 'Nem derinin dayanıklılığını azaltır; bariyer ürünler ve hızlı temizlik riski düşürür.' },
          { s: 'İyileşen Evre 4 bası yarası, iyileştikçe Evre 3 ve Evre 2 olarak yeniden evrelendirilir.', a: false, why: 'Ters evrelendirme yapılmaz; "iyileşmekte olan Evre 4" olarak kaydedilir.' },
        ] },
    ],
  },

  /* ---------------- 3. CERRAHİ KESİ ---------------- */
  {
    id: 'surgical', title: 'Cerrahi Kesi İyileşmesi', icon: 'scalpel', color: '#2C78B8',
    short: 'Hemostazdan maturasyona iyileşme fazları, primer-sekonder-tersiyer iyileşme ve komplikasyonlar.',
    ref: [
      { t: 'Yara iyileşme fazları', art: () => phaseArt('prol'), b: [
        '<b>Hemostaz</b> (dakikalar–saatler): vazokonstriksiyon, trombosit tıkacı, fibrin pıhtı.',
        '<b>İnflamasyon</b> (0–4/6. gün): nötrofil ve makrofajlar debrisi ve bakteriyi temizler; kızarıklık, ısı, ödem, ağrı.',
        '<b>Proliferasyon</b> (4–21. gün): fibroblast, kollajen, granülasyon dokusu, yeni damarlar, epitelizasyon, kontraksiyon.',
        '<b>Maturasyon</b> (21. gün–1-2 yıl): kollajen yeniden düzenlenir, skar solar; gerilim gücü en fazla normalin ≈%80’i.'] },
      { t: 'İyileşme tipleri', art: () => healArt('sekonder'), b: [
        '<b>Primer:</b> kenarlar dikiş, stapler ya da bantla yaklaştırılır; temiz cerrahi kesi, az skar.',
        '<b>Sekonder:</b> yara açık kalır, granülasyonla alttan üste dolar; doku kaybı, enfekte yara, bası yarası. Geniş skar.',
        '<b>Tersiyer (gecikmiş primer):</b> açık bırakılır, enfeksiyon kontrol altına alınınca 3–5 gün içinde kapatılır.'] },
      { t: 'Komplikasyonlar', b: [
        '<b>Cerrahi alan enfeksiyonu</b> çoğunlukla 3–7. gün: artan kızarıklık, ısı, ödem, pürülan akıntı, ateş.',
        '<b>Dehisens:</b> yara kenarlarının ayrılması.',
        '<b>Evisserasyon:</b> organların dışarı çıkması. SF ile ıslatılmış steril gazlı bezle ört, semi-Fowler ve dizler bükük, hemen hekime haber, ağızdan bir şey verme. Organlar geri itilmez.',
        'Hematom ve seroma da izlenir.'] },
      { t: 'İyileşmeyi etkileyenler', b: [
        'Geciktirenler: <b>diyabet, sigara, malnütrisyon, obezite, ileri yaş, kortikosteroid, anemi, enfeksiyon</b>, kesi üzerinde gerilim.',
        'Destekleyenler: yeterli <b>protein, C vitamini, çinko</b>, oksijenlenme ve kan şekeri kontrolü.',
        'Öksürürken ve hareket ederken kesi yastıkla desteklenir.'] },
    ],
    rounds: [
      { type: 'match', title: 'Fazları zaman çizelgesine yerleştir', prompt: 'Cerrahi kesinin iyileşme fazlarını gerçekleştikleri zaman aralığına yerleştir.', layout: 'timeline',
        pairs: [
          { id: 'hemo', label: 'Hemostaz', time: 'dakikalar – saatler', art: () => phaseArt('hemo'), caption: 'Trombosit tıkacı ve fibrin pıhtı', reveal: 'Vazokonstriksiyonla kanama durur', hint: 'Hemostaz ilk dakikalar içinde gerçekleşir: trombositler kümelenir, fibrin ağ pıhtıyı sabitler.' },
          { id: 'infl', label: 'İnflamasyon', time: '0 – 4/6. gün', art: () => phaseArt('infl'), caption: 'Nötrofil ve makrofajlar temizlik yapar', reveal: 'Kızarıklık, ısı, ödem ve ağrı normaldir', hint: 'İnflamasyonda nötrofil ve makrofajlar bakteri ve ölü dokuyu temizler; yaklaşık ilk 4–6 gün sürer.' },
          { id: 'prol', label: 'Proliferasyon', time: '4 – 21. gün', art: () => phaseArt('prol'), caption: 'Fibroblast, kollajen, granülasyon, yeni damar', reveal: 'Epitel kenarlardan yarayı örter', hint: 'Proliferasyonda fibroblastlar kollajen üretir, granülasyon dokusu ve yeni damarlar oluşur.' },
          { id: 'mat', label: 'Maturasyon', time: '21. gün – 1-2 yıl', art: () => phaseArt('mat'), caption: 'Kollajen düzenlenir, skar solar', reveal: 'Gerilim gücü en fazla ≈%80', hint: 'Maturasyon (yeniden şekillenme) en uzun fazdır; kollajen düzenlenir ve skar solar.' },
        ] },
      { type: 'quiz', title: 'Hangi fazdayız?', questions: [
        { q: 'Postop 2. gün: kesi çevresinde 1 cm’i geçmeyen hafif kızarıklık, ısı ve ödem var; akıntı yok, ateş yok. Bu bulgu neyi gösterir?', art: () => phaseArt('infl'), options: ['İnflamasyon fazının normal yanıtı', 'Cerrahi alan enfeksiyonu', 'Dehisens belirtisi', 'Maturasyon fazı'], why: 'İlk günlerdeki sınırlı kızarıklık, ısı ve ödem normal inflamatuvar yanıttır. Artan kızarıklık, pürülan akıntı ve ateş ise enfeksiyonu düşündürür.' },
        { q: 'Sekonder iyileşen bir yarada 10. gün: yara tabanında kırmızı, kabarık, nemli ve kolay kanayan doku var. Bu doku nedir?', art: () => phaseArt('prol'), options: ['Granülasyon dokusu (proliferasyon)', 'Eskar (nekroz)', 'Slough (enfeksiyon)', 'Skar (maturasyon)'], why: 'Parlak kırmızı, granüler ve kolay kanayan doku sağlıklı granülasyon dokusudur; proliferasyon fazının göstergesidir.' },
        { q: 'Kollajenin yeniden düzenlendiği ve skarın solduğu faz hangisidir? Bu fazda yara gerilim gücü en fazla ne kadara ulaşır?', art: () => phaseArt('mat'), options: ['Maturasyon; normal derinin ≈%80’i', 'Proliferasyon; %100', 'İnflamasyon; %50', 'Hemostaz; %20'], why: 'Maturasyon 21. günden 1-2 yıla kadar sürer. Skar dokusu hiçbir zaman normal derinin gücüne ulaşmaz; en fazla ≈%80’i.' },
      ] },
      { type: 'match', title: 'İyileşme tipini eşleştir', prompt: 'Her çizimi doğru iyileşme tipiyle eşleştir.',
        pairs: [
          { id: 'primer', label: 'Primer iyileşme', art: () => healArt('primer'), caption: 'Temiz cerrahi kesi, kenarlar yaklaştırılmış', reveal: 'Hızlı iyileşir, az skar bırakır', hint: 'Primer iyileşmede yara kenarları dikiş, stapler ya da bantla birbirine yaklaştırılır.' },
          { id: 'sekonder', label: 'Sekonder iyileşme', art: () => healArt('sekonder'), caption: 'Doku kaybı olan açık yara', reveal: 'Uzun sürer, geniş skar, enfeksiyon riski yüksek', hint: 'Sekonder iyileşmede yara açık bırakılır ve granülasyon dokusuyla tabandan dolar.' },
          { id: 'tersiyer', label: 'Tersiyer iyileşme', art: () => healArt('tersiyer'), caption: 'Kirli yara önce açık bırakılır', reveal: 'Enfeksiyon kontrol altına alınınca kapatılır', hint: 'Tersiyer (gecikmiş primer) iyileşmede kontamine yara birkaç gün açık bırakılıp sonra kapatılır.' },
        ] },
      { type: 'quiz', title: 'Komplikasyon vakaları', questions: [
        { q: 'Postop 5. gün: insizyonda giderek artan kızarıklık, ısı, pürülan akıntı ve 38,5 °C ateş. Hemşirenin öncelikli girişimi nedir?', options: ['Bulguları hekime bildirmek ve istemle yara kültürü almak', 'Pansumanı kaldırıp yarayı açık havada bırakmak', 'Yarayı alkollü pamukla ovarak temizlemek', 'Planlanan bir sonraki pansuman gününü beklemek'], why: 'Cerrahi alan enfeksiyonu bulguları hekime bildirilir, istemle kültür alınır ve aseptik pansuman sürdürülür.' },
        { q: 'Hasta öksürdükten sonra "içimde bir şey koptu" diyor; batın kesisinden bağırsak ansları görülüyor. İlk girişim nedir?', options: ['Organları SF ile ıslatılmış steril gazlı bezle örtmek', 'Organları yavaşça içeri itmek', 'Kuru gazlı bezle sıkıca bastırmak', 'Hastayı ayağa kaldırıp yürütmek'], why: 'Evisserasyonda organlar asla geri itilmez. SF ile nemlendirilmiş steril örtüyle kapatılır, hasta semi-Fowler ve dizler bükük pozisyona alınır, hemen hekime haber verilir, ağızdan bir şey verilmez.' },
        { q: 'Primer iyileşen temiz cerrahi kesinin pansumanıyla ilgili hangisi doğrudur?', options: ['İlk 24–48 saat steril pansuman korunur; ıslanır ya da kirlenirse değiştirilir', 'Pansuman her saat değiştirilir', 'Kesi ilk gün açık havada bırakılır', 'Kesiye antibiyotikli pudra sürülür'], why: 'Epitelizasyon ilk 24–48 saatte tamamlanana kadar kesi steril örtüyle korunur. Islanan ya da kirlenen pansuman aseptik teknikle değiştirilir.' },
      ] },
      { type: 'tf', title: 'İyileşmeyi etkileyenler', prompt: 'Her ifade için karar ver.',
        items: [
          { s: 'Diyabet ve sigara yara iyileşmesini geciktirir.', a: true, why: 'Hiperglisemi lökosit işlevini bozar; nikotin vazokonstriksiyonla dokuya oksijen gidişini azaltır.' },
          { s: 'C vitamini kollajen sentezi için gereklidir.', a: true, why: 'C vitamini kollajenin yapımında gereklidir; eksikliği iyileşmeyi geciktirir.' },
          { s: 'Kortikosteroidler inflamasyonu baskılayarak yara iyileşmesini hızlandırır.', a: false, why: 'Kortikosteroidler inflamatuvar yanıtı ve kollajen sentezini baskılayarak iyileşmeyi geciktirir.' },
          { s: 'Sekonder iyileşmede yara kenarları dikişle yaklaştırılır.', a: false, why: 'Kenarların yaklaştırılması primer iyileşmenin özelliğidir. Sekonder iyileşmede yara açık kalır.' },
          { s: 'Postop ilk 2–3 günde kesi çevresinde hafif kızarıklık ve ödem normal inflamatuvar yanıttır.', a: true, why: 'Sınırlı kızarıklık ve ödem inflamasyon fazının beklenen bulgusudur.' },
          { s: 'Dehisens riskini azaltmak için öksürürken kesi yastıkla desteklenir.', a: true, why: 'Kesiyi desteklemek karın içi basınç artışında kenarlara binen gerilimi azaltır.' },
        ] },
    ],
  },

  /* ---------------- 4. TEDAVİ ---------------- */
  {
    id: 'treatment', title: 'Tedavi Yolları', icon: 'flask', color: '#2B8F63',
    short: 'Eksüdaya göre örtü seçimi, debridman türleri, yanık tedavisi ve yara değerlendirmesi.',
    ref: [
      { t: 'Örtü seçimi: eksüdaya göre', b: [
        '<b>Kuru / nekrotik:</b> hidrojel (nem verir, otolitik debridman).',
        '<b>Az–orta, enfekte değil:</b> hidrokolloid; eksüdasız koruma için şeffaf film.',
        '<b>Orta–çok:</b> köpük, alginat, hidrofiber.',
        '<b>Enfekte / kritik kolonize:</b> gümüş ya da iyot içerikli örtü.',
        '<b>Derin, çok eksüdalı, temiz:</b> negatif basınçlı yara tedavisi (NPWT).',
        'İlke: yara yatağı nemli, çevre deri kuru.'] },
      { t: 'Debridman türleri', b: [
        '<b>Keskin / cerrahi:</b> en hızlı ve seçici; eğitimli kişi yapar.',
        '<b>Otolitik:</b> vücudun kendi enzimleri; hidrojel ya da hidrokolloid altında. Yavaş, ağrısız.',
        '<b>Enzimatik:</b> kollajenaz gibi topikal ajanlar.',
        '<b>Mekanik:</b> yaş-kuru gazlı bez, irrigasyon; seçici değil, ağrılı.',
        '<b>Biyolojik:</b> steril larva (maggot).',
        'Kuru, stabil topuk eskarı çıkarılmaz.'] },
      { t: 'Yanık tedavisi', b: [
        'Sıvı: Parkland formülü, idrar çıkışı takibi.',
        'Ağrı: IV opioid; pansumandan önce analjezi.',
        'Topikal: <b>gümüş sülfadiazin %1</b> ya da gümüşlü örtüler. Tetanoz profilaksisi.',
        'Yüksek protein ve kalorili beslenme; greft.',
        'Kontraktür: "rahat pozisyon kontraktür pozisyonudur"; boyun hafif ekstansiyonda, eklemler fonksiyonel pozisyonda.',
        'Çevresel 3. derece yanıkta dolaşım için eskarotomi gerekebilir.'] },
      { t: 'Yara değerlendirme (TIME)', b: [
        '<b>T</b> doku: granülasyon, slough, eskar.',
        '<b>I</b> enfeksiyon / inflamasyon.',
        '<b>M</b> nem dengesi (moisture).',
        '<b>E</b> kenar (edge): epitelizasyon, epibol, maserasyon.',
        'Ölçüm: uzunluk × genişlik × derinlik (cm), tünel ve cep, eksüda miktarı ve rengi, koku, çevre deri, ağrı.'] },
    ],
    rounds: [
      { type: 'match', title: 'Örtüyü yaraya göre seç', prompt: 'Her pansuman ürününü en uygun kullanıldığı yara durumuyla eşleştir.',
        pairs: [
          { id: 'hidrojel', label: 'Hidrojel', art: () => dropsArt(0), caption: 'Kuru, sloughlu ya da nekrotik yara; nem gerekiyor', reveal: 'Otolitik debridmanı destekler', hint: 'Hidrojel kuru yaraya nem verir ve nekrotik dokunun otolitik yolla yumuşamasını sağlar.' },
          { id: 'alginat', label: 'Alginat', art: () => dropsArt(3), caption: 'Çok eksüdalı derin kavite, sızıntı tarzı kanama', reveal: 'Eksüdayla jel oluşturur; kuru yarada kullanılmaz', hint: 'Alginat çok emicidir ve hemostatik etkisi vardır; kavite doldurmada kullanılır.' },
          { id: 'hidrokolloid', label: 'Hidrokolloid', art: () => dropsArt(1), caption: 'Az-orta eksüdalı, enfekte olmayan yüzeyel yara', reveal: 'Oklüzivdir; 3–7 gün kalabilir, enfekte yarada kullanılmaz', hint: 'Hidrokolloid az-orta eksüdalı, temiz ve yüzeyel yaralar (ör. Evre 2) içindir.' },
          { id: 'kopuk', label: 'Köpük (foam)', art: () => dropsArt(2), caption: 'Orta-çok eksüda, kemik çıkıntısında yastıklama', reveal: 'Emici, basıncı dağıtır, ikincil örtü olabilir', hint: 'Köpük örtüler orta-çok eksüdayı emer ve kemik çıkıntılarında yastık görevi görür.' },
          { id: 'gumus', label: 'Gümüşlü örtü', art: () => dropsArt(2, 'bac'), caption: 'Enfeksiyon bulguları olan ya da kritik kolonize yara', reveal: 'Antimikrobiyal; enfeksiyon gerileyince kesilir', hint: 'Gümüş içerikli örtüler antimikrobiyaldir; enfekte ya da yüksek bakteri yükü olan yaralarda kullanılır.' },
          { id: 'film', label: 'Şeffaf film', art: () => dropsArt(0), caption: 'Eksüdasız; Evre 1 korunması, sürtünmeyi azaltma', reveal: 'Yarı geçirgen; yara görünür kalır', hint: 'Şeffaf film emici değildir; eksüdası olmayan deriyi sürtünmeden korur.' },
        ] },
      { type: 'match', title: 'Debridman türlerini eşleştir', prompt: 'Her debridman yöntemini tanımıyla eşleştir.',
        pairs: [
          { id: 'keskin', label: 'Keskin / cerrahi', caption: 'Bistüri ve makasla canlı olmayan doku hızla uzaklaştırılır', reveal: 'En hızlı ve seçici yöntem', hint: 'Keskin debridman bistüri, makas ya da küretle yapılır ve en hızlı yöntemdir.' },
          { id: 'otolitik', label: 'Otolitik', caption: 'Nemli örtü altında vücudun kendi enzimleri nekrozu yumuşatır', reveal: 'Yavaş, ağrısız, seçici', hint: 'Otolitik debridmanda hidrojel ya da hidrokolloid nem sağlar, vücudun enzimleri işi yapar.' },
          { id: 'enzimatik', label: 'Enzimatik', caption: 'Kollajenaz gibi topikal bir ajan nekrotik dokuyu çözer', reveal: 'Hekim istemiyle uygulanır', hint: 'Enzimatik debridmanda dışarıdan uygulanan enzim içeren merhem kullanılır.' },
          { id: 'mekanik', label: 'Mekanik', caption: 'Yaş-kuru gazlı bez ya da basınçlı irrigasyon', reveal: 'Seçici değil, sağlıklı dokuya da zarar verebilir, ağrılı', hint: 'Mekanik debridman fiziksel kuvvetle yapılır ve canlı dokuyu da kaldırabilir.' },
          { id: 'biyolojik', label: 'Biyolojik', caption: 'Steril larvalar nekrotik dokuyu sindirir', reveal: 'Larva (maggot) tedavisi', hint: 'Biyolojik debridmanda steril sinek larvaları yalnız ölü dokuyu sindirir.' },
        ] },
      { type: 'quiz', title: 'Tedavi kararları', questions: [
        { q: 'Sakrumda Evre 3, derin kavite ve çok fazla eksüdası olan, enfeksiyon bulgusu olmayan yara. En uygun birincil örtü hangisidir?', art: () => ulcerArt('s3'), options: ['Kaviteyi alginat ya da hidrofiberle gevşekçe doldurmak', 'Şeffaf film', 'Hidrojel', 'Kuru gazlı bezle sıkıca tıkamak'], why: 'Alginat ve hidrofiber eksüdayı emip jel oluşturur. Kavite gevşekçe doldurulur, üzerine köpük gibi ikincil örtü konur.' },
        { q: 'Topukta kuru, sağlam, kızarıklık ve akıntısı olmayan siyah eskar var; ayak nabızları zayıf. Uygun yaklaşım nedir?', options: ['Eskarı korumak, kuru tutmak ve topuğu yükten kaldırmak', 'Hemen keskin debridman yapmak', 'Hidrojelle yumuşatmak', 'Islak pansumanla örtmek'], why: 'Stabil topuk eskarı doğal bir örtüdür. Kanlanması bozuk hastada debride edilmez, nemlendirilmez; basınç kaldırılır.' },
        { q: 'Kuru, sarı slough ile kaplı, enfeksiyon bulgusu olmayan yara için otolitik debridmanda hangi ürün seçilir?', options: ['Hidrojel', 'Alginat', 'Kuru gazlı bez', 'Gümüş nitrat çubuğu'], why: 'Hidrojel kuru yaraya nem verir ve otolitik debridmanı başlatır. Alginat kuru yarayı daha da kurutur.' },
        { q: 'Yanık hastasında pansuman değişimi çok ağrılı. Doğru uygulama hangisidir?', options: ['İstemdeki analjeziği, etki başlama süresini hesaba katarak pansumandan önce vermek', 'Analjeziği pansumandan sonra vermek', 'Pansumanı kuru ve hızlıca çekerek çıkarmak', 'Ağrı olmasın diye pansumanı haftada bir değiştirmek'], why: 'Analjezik, etkisi pansuman sırasında en yüksek olacak şekilde önceden verilir. Yapışan örtü SF ile nemlendirilerek çıkarılır.' },
        { q: 'Boyun ön yüzünde yanığı olan hastada kontraktürü önlemek için hangi pozisyon verilir?', options: ['Boyun hafif ekstansiyonda, baş altında yastık yok', 'Boyun fleksiyonda, iki yastıkla', 'Baş sürekli tek tarafa çevrili', 'Hastanın en rahat ettiği pozisyon'], why: 'Rahat pozisyon genellikle fleksiyondur ve kontraktüre yol açar. Boyun ön yüz yanığında hafif ekstansiyon korunur.' },
        { q: 'Yanık yarasında sık kullanılan topikal antimikrobiyal krem hangisidir?', options: ['Gümüş sülfadiazin %1', 'Hidrokortizon krem', 'Çinko oksit macun', 'Lidokain jel'], why: 'Gümüş sülfadiazin geniş spektrumlu antimikrobiyal etkisi nedeniyle yanık bakımında yaygın kullanılır (sülfonamid alerjisi ve gebelikte dikkat).' },
        { q: 'Negatif basınçlı yara tedavisi (NPWT) için en uygun yara hangisidir?', options: ['Derin, çok eksüdalı, debride edilmiş kronik yara', 'Tedavi edilmemiş osteomiyeliti olan yara', 'Tabanında açıkta kan damarı olan yara', 'Malign (tümörlü) yara'], why: 'NPWT granülasyonu hızlandırır ve eksüdayı uzaklaştırır. Tedavi edilmemiş osteomiyelit, açık damar ve malignite kontrendikasyondur.' },
        { q: 'TIME yaklaşımında "M" harfi neyi ifade eder?', options: ['Nem dengesi (moisture)', 'Mikroorganizma yükü', 'Malnütrisyon', 'Mekanik debridman'], why: 'TIME: doku (tissue), enfeksiyon/inflamasyon, nem dengesi (moisture), kenar (edge).' },
      ] },
    ],
  },

  /* ---------------- 5. PANSUMAN ---------------- */
  {
    id: 'dressing', title: 'Steril Pansuman', icon: 'gauze', color: '#0A7A72',
    short: 'Aseptik tekniğe uygun pansuman sıralaması ve kesiyi temizden kirliye tampon tekniği.',
    ref: [
      { t: 'Aseptik tekniğin temel kuralları', b: [
        'Steril yalnızca sterile değer; <b>şüpheli olan steril değildir</b>.',
        'Steril alanın dış <b>2,5 cm</b>’si steril kabul edilmez.',
        '<b>Bel hizasının altı</b> ve görüş alanının dışı steril değildir.',
        'Steril alana sırt dönülmez, <b>üzerinden uzanılmaz</b>.',
        'Islanan steril alan kapiller etkiyle kontamine olur.',
        'Paketin bütünlüğü ve son kullanma tarihi kontrol edilir.'] },
      { t: 'Steril paket ve solüsyon', b: [
        'Paket açılırken <b>önce en uzak kanat</b>, sonra yanlar, <b>size en yakın kanat en son</b> açılır.',
        'Solüsyon dökülürken etiket avuç içinde tutulur; kapak iç yüzü yukarı bakacak şekilde konur.',
        'Şişenin ağzını temizlemek için az miktar boşa dökülür.',
        'Solüsyon ve malzemeler steril eldiven giyilmeden önce alana eklenir.'] },
      { t: 'Yara temizliği', b: [
        '<b>Temizden kirliye:</b> kesi hattı en temiz bölgedir.',
        'Kesi boyunca <b>baştan ayağa</b>, sonra yanlarda <b>içten dışa</b>.',
        '<b>Her silmede yeni tampon</b>; ileri-geri ovma yapılmaz.',
        'Drenli yarada dren çevresi ayrı tamponla içten dışa dairesel temizlenir.'] },
      { t: 'Eldiven kuralları', b: [
        'Eski pansuman <b>temiz eldivenle</b> çıkarılır.',
        'Yara temizliği steril eldiven ya da steril pensle yapılır.',
        'Eldiven el hijyeninin yerini tutmaz; eldiven çıkarıldıktan sonra el hijyeni yapılır.',
        'Yapışan pansuman SF ile nemlendirilerek çıkarılır.'] },
    ],
    rounds: [
      { type: 'order', title: 'Steril pansuman sıralaması', prompt: 'Batın kesisi olan hastaya pansuman yapacaksın. 16 adımı doğru sırayla uygula; yanlış uygulamaları seçme.',
        steps: [
          { text: 'Hekim istemini kontrol et, hastayı iki tanımlayıcıyla doğrula', why: 'Her işlem doğru hasta ve doğru istemle başlar.' },
          { text: 'El hijyeni sağla', why: 'İstem kontrolünden sonra, hastaya ve malzemeye dokunmadan önce el hijyeni yapılır.' },
          { text: 'İşlemi açıkla, mahremiyeti sağla ve uygun pozisyon ver', why: 'Hastanın iş birliği ve mahremiyeti malzemeler hazırlanmadan önce sağlanır.' },
          { text: 'Steril paketin bütünlüğünü ve son kullanma tarihini kontrol et, malzemeleri hazırla', why: 'Kontrol paket açılmadan önce yapılır; bütünlüğü bozuk ya da tarihi geçmiş paket steril değildir.' },
          { text: 'Atık torbasını steril alandan uzak ama ulaşılabilir yere yerleştir', why: 'Kirli pansuman çıkarılmadan önce atık yeri hazır olmalıdır; böylece steril alanın üzerinden geçilmez.' },
          { text: 'Temiz eldiven giy, eski pansumanı flasteri yaraya doğru çekerek çıkar', why: 'Atık yeri hazırlandıktan sonra eski pansuman temiz eldivenle çıkarılır; flaster yaraya doğru çekilir.' },
          { text: 'Yarayı ve eski pansumandaki akıntıyı değerlendir', why: 'Akıntının miktarı, rengi ve kokusu çıkarılan pansumanda, atılmadan önce değerlendirilir.' },
          { text: 'Eski pansumanı ve eldiveni atığa at, el hijyeni sağla', why: 'Değerlendirmeden sonra kirli malzeme atılır; kirli eldivenle steril sete dokunulmaz.' },
          { text: 'Steril seti aç (önce en uzak kanat) ve steril alan oluştur', why: 'Steril alan kirli pansuman uzaklaştırılıp el hijyeni yapıldıktan sonra hazırlanır.' },
          { text: 'Steril solüsyonu ve malzemeleri steril alana ekle', why: 'Solüsyon ve malzemeler set açıldıktan sonra, steril eldiven giyilmeden önce eklenir.' },
          { text: 'Steril eldiven giy', why: 'Steril eldiven tüm hazırlık bittikten sonra, yaraya dokunmadan hemen önce giyilir.' },
          { text: 'Yarayı temizden kirliye temizle; her silmede yeni tampon kullan', why: 'Temizlik steril eldiven giyildikten sonra, kesi hattından dışa doğru yapılır.' },
          { text: 'Yarayı aynı ilkeyle kurula, istem varsa ürünü uygula', why: 'Kurulama temizlikten sonra ve örtüden önce yapılır.' },
          { text: 'Steril pansuman malzemesini yerleştir ve flasterle sabitle', why: 'Yara temiz ve kuru olduktan sonra örtülür.' },
          { text: 'Eldiveni çıkar, atıkları ayrıştır, el hijyeni sağla', why: 'Pansuman sabitlendikten sonra eldiven çıkarılır ve el hijyeni yapılır.' },
          { text: 'Hastayı rahat ettir; yaranın görünümünü ve işlemi kaydet', why: 'Kayıt işlem tamamlandıktan sonra yapılır; yapılmamış işlem kaydedilmez.' },
        ],
        distractors: [
          { text: 'Eski pansumanı steril eldivenle çıkar', why: 'Kirli pansuman temiz eldivenle çıkarılır; steril eldiven yara temizliği için kullanılır.' },
          { text: 'Aynı tamponla yarayı ileri-geri ovarak temizle', why: 'Her silmede yeni tampon kullanılır; ileri-geri ovma kiri temiz bölgeye taşır.' },
          { text: 'Yapışan pansumanı hızla, kuru olarak çek', why: 'Yapışan pansuman SF ile nemlendirilerek çıkarılır; kuru çekmek yeni oluşan dokuyu koparır.' },
        ] },
      { type: 'swab', title: 'Tampon tekniği: kesiyi temizle', prompt: 'Steril eldivenini giydin, steril tamponlar elinde. Batın kesisini aseptik tekniğe uygun temizle: önce kesi hattı, sonra iki yanda içten dışa doğru, her yanda en az ikişer silme.' },
      { type: 'tf', title: 'Aseptik ilkeler', prompt: 'Her ifade için karar ver.',
        items: [
          { s: 'Steril alanın kenarından itibaren 2,5 cm’lik bölüm steril kabul edilmez.', a: true, why: 'Kenar bölgesi steril olmayan yüzeyle temas ettiği için steril sayılmaz.' },
          { s: 'Steril eldivenli eller gerekirse bel hizasının altına indirilebilir.', a: false, why: 'Bel hizasının altı görüş alanı dışında kaldığı için steril kabul edilmez.' },
          { s: 'Steril alana dokunulmadığı sürece sırt dönülebilir.', a: false, why: 'Görüş alanı dışında kalan steril alanın sterilliğinden emin olunamaz; sırt dönülmez.' },
          { s: 'Steril bir nesnenin sterilliğinden şüphe ediliyorsa steril değil kabul edilir.', a: true, why: 'Şüpheli olan steril değildir; malzeme değiştirilir.' },
          { s: 'Islanan steril örtü kapiller etkiyle kontamine olur.', a: true, why: 'Nem, alttaki steril olmayan yüzeyden mikroorganizmaları örtünün üstüne taşır.' },
          { s: 'Steril paket açılırken size en yakın kanat ilk açılır.', a: false, why: 'En uzak kanat önce açılır; böylece açık steril alanın üzerinden uzanmak gerekmez.' },
          { s: 'Steril solüsyon dökülürken şişe kapağı iç yüzü yukarı bakacak şekilde konur.', a: true, why: 'Kapağın iç yüzü steril kalmalıdır; masaya ters konursa kontamine olur.' },
          { s: 'Eldiven giymek el hijyeni gerekliliğini ortadan kaldırır.', a: false, why: 'Eldivende mikro delikler olabilir; eldiven giymeden önce ve çıkardıktan sonra el hijyeni yapılır.' },
          { s: 'Kesi temizliğinde insizyon hattı en temiz bölge kabul edilir.', a: true, why: 'Temizlik en temiz bölge olan kesi hattından başlar ve dışa doğru ilerler.' },
          { s: 'Drenli yarada dren çevresi içten dışa dairesel hareketle temizlenir.', a: true, why: 'Dren çevresi ayrı tamponla, drenden dışa doğru dairesel temizlenir.' },
        ] },
    ],
  },

  /* ---------------- 6. HATA AVI ---------------- */
  {
    id: 'hunt', title: 'Aseptik Hata Avı', icon: 'search', color: '#B83A33',
    short: 'Hazırlanmış steril sette gizlenen kontaminasyon hatalarını bul, hızlı karar turunu geç.',
    ref: [
      { t: 'Neye bakmalısın?', b: [
        'Malzeme <b>2,5 cm</b> sınırının içinde mi?',
        'Alanda <b>ıslaklık</b> var mı?',
        'Steril olmayan bir nesne alana girmiş mi?',
        'Paketler <b>sağlam</b> ve <b>tarihi geçerli</b> mi?',
        'Biri alanın <b>üzerinden uzanıyor</b> mu?',
        'Kirli malzeme alana konmuş mu?'] },
      { t: 'Doğru yerleşim', b: [
        'El antiseptiği ve solüsyon şişeleri alanın dışında, ulaşılabilir yerde.',
        'Atık torbası steril alandan uzak ama elinin altında.',
        'Steril eldiven paketi temiz, kuru, ayrı bir yüzeyde açılır.',
        'Pens uçları aşağıya bakar; bel hizasının üstünde tutulur.'] },
    ],
    rounds: [
      { type: 'spots', title: 'Steril sette 7 hata', prompt: 'Pansuman için hazırlanmış masaya üstten bakıyorsun. Aseptik tekniği bozan 7 hatayı bul. Doğru yerleştirilmiş bir nesneye dokunursan eldiven kaybedersin.',
        how: 'Hatalı olduğunu düşündüğün nesneye dokun.', counterLabel: 'Bulunan hata', fineLabel: 'bu doğru', scene: trayScene,
        spots: [
          { x: 494, y: 160, r: 32, err: true, title: 'Kenardaki gazlı bez', why: 'Steril alanın dış 2,5 cm’si steril değildir; kenara taşan gazlı bez kontamine sayılır ve kullanılmaz.' },
          { x: 420, y: 302, r: 36, err: true, title: 'Islak leke', why: 'Islanan örtü kapiller etkiyle alttaki steril olmayan yüzeyden mikroorganizma çeker; steril alan yeniden hazırlanır.' },
          { x: 320, y: 300, r: 34, err: true, title: 'Kirli pansuman', why: 'Yaradan çıkarılan pansuman doğrudan atık torbasına atılır; asla steril alana konmaz.' },
          { x: 306, y: 112, r: 34, err: true, title: 'Tükenmez kalem', why: 'Steril olmayan hiçbir nesne steril alana konmaz.' },
          { x: 418, y: 116, r: 34, err: true, title: 'Alanın üzerinden uzanan kol', why: 'Steril alanın üzerinden uzanılmaz; kol, giysi ve deri partikülleri alanı kontamine eder.' },
          { x: 212, y: 126, r: 32, err: true, title: 'SKT’si geçmiş paket', why: 'Son kullanma tarihi geçmiş paket steril kabul edilmez ve kullanılmaz.' },
          { x: 212, y: 300, r: 34, err: true, title: 'Yırtık paket', why: 'Yırtık, delik ya da ıslak paket steril değildir.' },
          { x: 300, y: 214, r: 34, err: false, title: 'Steril pens', why: 'Pens steril alanın içinde, 2,5 cm sınırının içinde duruyor.' },
          { x: 404, y: 216, r: 32, err: false, title: 'Antiseptik küveti', why: 'Küvet steril alanın içinde ve sıvı taşmamış.' },
          { x: 224, y: 218, r: 30, err: false, title: 'Steril gazlı bezler', why: 'Gazlı bezler steril alanın iç bölümünde duruyor.' },
          { x: 572, y: 316, r: 30, err: false, title: 'El antiseptiği', why: 'El antiseptiği steril alanın dışında, ulaşılabilir yerde duruyor.' },
          { x: 572, y: 108, r: 34, err: false, title: 'SF şişesi', why: 'Steril solüsyon şişesi alanın dışında duruyor; dökülürken etiket avuç içinde tutulur.' },
          { x: 76, y: 190, r: 40, err: false, title: 'Steril eldiven paketi', why: 'Eldiven paketi temiz ve kuru ayrı bir yüzeyde açılmış.' },
          { x: 76, y: 346, r: 34, err: false, title: 'Tıbbi atık torbası', why: 'Atık torbası steril alandan uzakta ama ulaşılabilir yerde.' },
        ] },
      { type: 'tf', title: 'Hızlı karar', prompt: 'Klinikte karşılaşabileceğin durumlar. Her biri için karar ver.',
        items: [
          { s: 'Steril pens steril olmayan bir yüzeye değerse yenisiyle değiştirilir.', a: true, why: 'Kontamine olan steril malzeme kullanılmaz; yenisi alınır.' },
          { s: 'Karşı taraftaki malzemeyi almak için steril setin üzerinden kısa süre uzanmak kabul edilebilir.', a: false, why: 'Steril alanın üzerinden uzanılmaz; set etrafında dolaşılır ya da malzeme yeniden yerleştirilir.' },
          { s: 'Steril alanın üzerinde konuşmak, öksürmek ve hapşırmak alanı kontamine edebilir.', a: true, why: 'Damlacıklar steril alana ulaşabilir; gerekirse maske takılır, alan üzerinde konuşulmaz.' },
          { s: 'Son kullanma tarihi geçmiş ama paketi sağlam malzeme kullanılabilir.', a: false, why: 'Tarihi geçmiş malzeme steril kabul edilmez.' },
          { s: 'Steril pensin uçları aşağı bakacak ve bel hizasının üstünde kalacak şekilde tutulur.', a: true, why: 'Uçlar yukarı bakarsa sıvı tutamağa akıp geri dönerek ucu kontamine eder.' },
          { s: 'Kirli pansuman kısa süreliğine steril alanın köşesinde bekletilebilir.', a: false, why: 'Kirli malzeme hiçbir zaman steril alana konmaz; doğrudan atığa atılır.' },
          { s: 'Steril eldiven giyildikten sonra eller bel hizasının üstünde ve görüş alanında tutulur.', a: true, why: 'Görüş alanı dışında kalan eller steril kabul edilmez.' },
          { s: 'Steril eldivenin dış yüzüne yalnız diğer steril eldivenli el ile dokunulur.', a: true, why: 'Steril sterile değer; ikinci eldiven giyilirken steril eldivenli parmaklar manşetin altına sokulur.' },
        ] },
    ],
  },
];
