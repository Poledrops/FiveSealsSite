# Five Seals — Official Site

Tanıtım sitesi: **Five Seals · Beş Mühür**, Android için karanlık fantezi 2D aksiyon platform oyunu.

Statik site; derleme adımı ve bağımlılık yok. `index.html` + `assets/` doğrudan herhangi bir statik barındırmada (GitHub Pages, Netlify, Cloudflare Pages) yayınlanabilir.

## Yapı

```
index.html            Tek sayfa: hero, önsöz, beş bölge, Taryan, oynanış, boss'lar, galeri, mobil, sonlar, indir
gizlilik.html         Gizlilik ve Veri Koruma (KVKK aydınlatma metni + GDPR, çerez politikası, saklama ve imha)
404.html              GitHub Pages hata sayfası
assets/css/main.css   Tüm stiller (renk ve tipografi değişkenleri :root içinde)
assets/css/legal.css  Gizlilik sayfasına özel stiller (içindekiler, tablolar, yazdırma)
assets/css/fonts.css  Siteye gömülü yazı tipleri (Cinzel, Cormorant Garamond, Manrope; SIL OFL 1.1)
assets/fonts/         woff2 dosyaları ve OFL lisans metinleri
assets/js/main.js     Etkileşimler: yükleyici, parallax, kıvılcım/şimşek efekti, bölge seçici, lightbox
assets/js/legal.js    Gizlilik sayfası: menü, içindekiler vurgusu, başa dön
assets/img/shots/     Oyundan alınmış gerçek ekran görüntüleri (WebP; 480 / 960 / 1600 px)
assets/img/art/       Başlık ekranı arka planı, logo ve Taryan illüstrasyonu
site.webmanifest, robots.txt, sitemap.xml
```

## Yerelde çalıştırma

Herhangi bir statik sunucu yeterli:

```bash
npx serve .
```

## Yayınlama (GitHub Pages)

Depo ayarlarında **Settings → Pages → Deploy from a branch → `main` / root**. Site
`https://poledrops.github.io/FiveSealsSite/` adresinde yayınlanır.

Özel alan adı kullanılırsa `index.html` içindeki `canonical`, `og:image`, `twitter:image` ve JSON-LD adreslerini,
`robots.txt`, `sitemap.xml` ve `404.html` içindeki `/FiveSealsSite/` yollarını güncelleyin.

## Gizlilik

Site hiçbir üçüncü taraf kaynak yüklemez (yazı tipleri dahil), çerez veya tarayıcı depolaması kullanmaz;
`gizlilik.html` bu duruma dayanır. Siteye analitik, gömülü içerik veya harici yazı tipi eklenirse gizlilik
sayfasındaki çerez ve üçüncü taraf bölümleri de güncellenmelidir. İçerik değiştiğinde sayfanın başındaki
"Son güncelleme" tarihi ve sürüm numarası da güncellenmelidir.

## Ekran görüntüleri

Kareler oyunun kendi debug araçlarıyla (Godot 4.7, `--shots`, `--bot=boss|run`, `--notouch`, `--quality=ultra`)
1920×1080'de alındı, 16:9 kırpıldı ve WebP'ye çevrildi. Yeni kare eklerken aynı üç genişliği (480/960/1600) üretin.

## Lisanslar

© 2026 Poledrops. Karakter, boss ve düşman sanatı **elie automata** paketlerinden; efektler [PixelFX](https://github.com/patch-gg/pixelfx) (MIT);
oyun [Godot Engine](https://godotengine.org) (MIT) ile yapıldı.
