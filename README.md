# Artsy Baku — Fərdi Canlı Gül Aksesuarları Rəsmi Veb-Saytı

Artsy Baku əl işi məhsullarının təqdimatı və WhatsApp üzərindən birbaşa sifarişi üçün hazırlanmış zərif, müasir, mobil uyğun və server tələb etməyən (GitHub Pages uyğun) rəsmi veb-sayt.

---

## 🌟 Əsas Xüsusiyyətlər

1. **Klassik səbətsiz, birbaşa çoxməhsullu sifariş forması**:
   - Müştəri eyni sifariş daxilində birdən çox fərqli məhsul əlavə edə bilər.
   - Hər məhsul üçün 6 canlı gül rəngindən birini ayrıca seçə bilər.
   - Kapsul daxilinə yazılacaq fərdi adı və sayını sərbəst təyin edə bilər.
2. **Dinamik Qiymət Hesablanması**:
   - Bütün məhsullar sabit 23 AZN qiymətlə hesablanır.
   - Metro təhvili (Nərimanov, 28 May, Gənclik) — **0 AZN (PULSUZ)**.
   - Taxi kuryer — **0 AZN** (sayt hesabına daxil edilmir, kuryerə birbaşa ödənilir).
   - Azərpoçt / Karqo — **4 AZN** yekun məbləğə avtomatik əlavə edilir.
3. **Avtomatlaşdırılmış WhatsApp Sifariş İnteqrasiyası**:
   - Sifariş məlumatları Azərbaycan dilində səliqəli şəkildə formalaşdırılır.
   - Rəsmi `wa.me/994516138069` ünvanına yönləndirilir. Mesaj müştəri tərəfindən göndərilir.
4. **Mərkəzi JSON İdarəetməsi**:
   - Məhsul qiyməti, mövcudluğu, gül rəngləri, əlaqə nömrələri və çatdırılma saatları kod dəyişmədən sadəcə `data/store.json` və `data/delivery.json` fayllarından idarə olunur.
5. **100% Statik & GitHub Pages Uyğun**:
   - Heç bir backend, verilənlər bazası və ya əlavə framework tələb olunmur (Pure HTML5, CSS3, Vanilla JavaScript ES6+).

---

## 📁 Layihə Strukturu

```
artsy-baku/
├── index.html              # Əsas ana səhifə (Hero, Üstünlüklər, Vitrin, Əlaqə)
├── products.html           # Məhsul kataloqu və Gül rəngləri vizual lövhəsi
├── order.html              # Çoxməhsullu sifariş və hesablama forması
├── delivery.html           # Çatdırılma üsulları və həftəlik saat cədvəli
├── css/
│   ├── style.css           # Əsas rəng sistemi, tipografiya və baza stillər
│   ├── components.css      # Header, kartlar, sifariş forması, footer komponentləri
│   └── responsive.css      # Mobil, planşet və desktop ekran uyğunlaşması
├── js/
│   ├── config.js           # store.json və delivery.json məlumat yükləyicisi
│   ├── main.js             # Mobil menyu, ümumi animasiyalar, dinamik biznes datası
│   ├── products.js         # Məhsullar və gül rənglərinin dinamik renderi
│   ├── order.js            # Çoxməhsullu form məntiqi, canlı hesablama və validasiya
│   ├── delivery.js         # Çatdırılma cədvəli və qaydaları
│   └── whatsapp.js         # Azərbaycan dilində WhatsApp mesaj formatlayıcısı
├── data/
│   ├── store.json          # Biznes əlaqələri, məhsullar, qiymətlər, gül rəngləri
│   └── delivery.json       # Çatdırılma üsulları, tariflər və iş saatları
├── assets/
│   ├── images/
│   │   ├── products/
│   │   │   ├── sep-a.jpg   # SEP A – QÜMÜŞÜ orijinal şəkli
│   │   │   ├── sep-b.jpg   # SEP B – QIZILI orijinal şəkli
│   │   │   ├── qolbag.jpg  # QOLBAQ orijinal şəkli
│   │   │   └── brelok.jpg  # BRELOK / ASMAQ ÜÇÜN orijinal şəkli
│   │   ├── branding/
│   │   │   └── logo.png    # Loqo şəkli (yerləşdirildikdə avtomatik aktivləşir)
│   │   └── flower-colors.jpg # 6 canlı gül rəngi vizual istinad şəkli
│   └── icons/
│       └── favicon.svg     # Saytın brauzer ikonu (favicon)
├── README.md               # Layihə sənədi və istifadə təlimatı
├── sitemap.xml             # Axtarış sistemləri üçün xəritə
├── robots.txt              # Axtarış botları tənzimləməsi
└── .gitignore              # Git izlənməyəcək fayllar siyahısı
```

---

## 🛠️ İdarəetmə və Tənzimləmə Təlimatları

Bütün biznes parametrləri `data/` qovluğundakı iki fayldan idarə olunur. HTML və ya JavaScript koduna toxunmağa ehtiyac yoxdur.

### 1. Qiymətləri və Məhsul Mövcudluğunu Dəyişmək (`data/store.json`)

Məsələn, hər hansı məhsul bitibsə və ya qiyməti dəyişibsə:

```json
{
  "id": "sep-a",
  "name": "SEP A – QÜMÜŞÜ",
  "price": 23,
  "available": true
}
```

- Məhsul bitdikdə: `"available": false` edin. Saytda avtomatik "Mövcud deyil" kimi görünəcək və sifariş edilməsi bloklanacaq.
- Qiymət dəyişdikdə: `"price": 25` yazmağınız kifayətdir.

### 2. Gül Rənglərinin Statusunu Dəyişmək (`data/store.json`)

Hər hansı gül rəngi bitdikdə:

```json
{
  "id": "pink",
  "name": "Çəhrayı",
  "hex": "#ED45A5",
  "available": false
}
```

`"available": false` edildikdə həmin rəng həm məhsul səhifəsində "Bitib" kimi görünür, həm də sifariş formasında seçilməsi avtomatik qadağan edilir.

### 3. WhatsApp Nömrəsini və Sosial Şəbəkələri Dəyişmək (`data/store.json`)

```json
"business": {
  "name": "Artsy Baku",
  "whatsapp": "994516138069",
  "whatsappDisplay": "+994 51 613 80 69",
  "instagram": "https://www.instagram.com/artsybaku?rpxt=MWowZDJzYm9rZ29ocg==",
  "tiktok": "https://www.tiktok.com/@artsybaku?_r=1&_t=ZS-9BE5eZiRRq8"
}
```

Yalnız nömrəni dəyişməklə bütün səhifələrdəki WhatsApp düymələri, üzən əlaqə düyməsi və sifariş göndərişi avtomatik yeni nömrəyə yönələcəkdir.

### 4. Çatdırılma Məlumatlarını Dəyişmək (`data/delivery.json`)

Çatdırılma günləri, saatları və ya stansiyalar dəyişdikdə `data/delivery.json` faylını redaktə etmək kifayətdir:

```json
{
  "methods": [...],
  "schedule": [
    { "day": "Bazar ertəsi", "hours": "08:00 – 22:00" },
    ...
  ]
}
```

---

## 🎨 Loqonun Əlavə Edilməsi

Layihədə zərif mətn əsaslı brend loqosu quraşdırılmışdır. Öz hazırladığınız rəsmi loqo şəklini:
`assets/images/branding/logo.png`
faylı kimi yerləşdirdikdə, saytın bütün səhifələrində mətn loqosu avtomatik olaraq sizin rəsmi şəkilli loqonuzla əvəzlənəcəkdir.

---

## 🚀 GitHub Pages-də Yayımlama (Deployment)

Layihə heç bir server tələb etmədiyi üçün GitHub Pages-də birbaşa və ödənişsiz yayımlana bilir:

1. **Git Repositoriyası Yaratmaq**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Artsy Baku production website"
   ```

2. **GitHub-a Göndərmək**:
   - GitHub.com saytında yeni bir public və ya private repository yaradın (məsələn: `artsy-baku`).
   - Aşağıdakı əmrlərlə kodu göndərin:
   ```bash
   git remote add origin https://github.com/İSTİFADƏÇİ_ADINIZ/artsy-baku.git
   git branch -M main
   git push -u origin main
   ```

3. **GitHub Pages-i Aktivləşdirmək**:
   - GitHub-da həmin repository-nin **Settings** bölməsinə keçin.
   - Sol menyudan **Pages** bölməsini seçin.
   - **Branch** hissəsində `main` (və ya `root`) seçib **Save** düyməsinə basın.
   - 1-2 dəqiqə ərzində saytınız bu ünvanda canlı yayımlanacaq:  
     `https://istifadeci-adiniz.github.io/artsy-baku/`

---

## 💻 Lokal Test (Kompüterinizdə Yoxlamaq)

Saytın bütün nisbi keçidləri və JSON oxuma mexanizmləri lokal HTTP serverdə problemsiz işləyir:

Node.js ilə:
```bash
npx serve
```
və ya Python ilə:
```bash
python -m http.server 8000
```
Brauzerdə `http://localhost:8000` və ya `http://localhost:3000` ünvanına daxil olaraq saytı dərhal sınaqdan keçirə bilərsiniz.

---

## 📄 Lisenziya və Müəllif Hüququ

© 2026 Artsy Baku. Bütün hüquqlar qorunur.
Bakıda fərdi sevgi və sənətkarlıqla hazırlanmışdır. ✨
