/**
 * Artsy Baku - Konfiqurasiya və Məlumat Yükləyici
 * Store və Delivery JSON məlumatlarını dinamik yükləyir.
 */

const FALLBACK_STORE = {
  "business": {
    "name": "Artsy Baku",
    "tagline": "Fərdi Adlı Canlı Gül Aksesuarları",
    "description": "Sevginizi və xatirələrinizi zərif şüşə kapsulda canlı saxlayın. Əl işi, fərdi adlı kulonlar, qolbaqlar və aksesuarlar.",
    "whatsapp": "994516138069",
    "whatsappDisplay": "+994 51 613 80 69",
    "instagram": "https://www.instagram.com/artsybaku?rpxt=MWowZDJzYm9rZ29ocg==",
    "instagramDisplay": "@artsybaku",
    "tiktok": "https://www.tiktok.com/@artsybaku?_r=1&_t=ZS-9BE5eZiRRq8",
    "tiktokDisplay": "@artsybaku",
    "currency": "AZN",
    "currencySymbol": "₼"
  },
  "products": [
    {
      "id": "sep-a",
      "name": "SEP A – QÜMÜŞÜ",
      "price": 23,
      "available": true,
      "badge": "Çox Satılan",
      "image": "assets/images/products/sep-a.jpg",
      "description": "Zərif qümüşü rəngli zəncir və metal qapaqlı şüşə kapsul daxilində canlı quru gül kompozisiyası. Kapsul daxilinə istədiyiniz fərdi ad yazılır."
    },
    {
      "id": "sep-b",
      "name": "SEP B – QIZILI",
      "price": 23,
      "available": true,
      "badge": "Premium",
      "image": "assets/images/products/sep-b.jpg",
      "description": "Parlaq qızılı detal və zəncirlə tamamlanan, daxilində təbii gül və fərdi ad olan xüsusi kulon. Hədiyyə üçün ideal seçimdir."
    },
    {
      "id": "qolbag",
      "name": "QOLBAQ",
      "price": 23,
      "available": true,
      "badge": "Zərif Dizayn",
      "image": "assets/images/products/qolbag.jpg",
      "description": "Ölçüsü asanlıqla tənzimlənən toxunma qara kəndir və qızılı sonluqlara malik kapsulda ad və canlı gül olan fərdi qolbaq."
    },
    {
      "id": "brelok",
      "name": "BRELOK / ASMAQ ÜÇÜN",
      "price": 23,
      "available": true,
      "badge": "Xüsusi Dəst",
      "image": "assets/images/products/brelok.jpg",
      "description": "Zərif mirvari ürək, mirvari muncuq asqısı və möhkəm qızılı karabinlə tamamlanmış, daxilində gül və ad olan estetik brelok."
    }
  ],
  "flowers": [
    { "id": "pink", "name": "Çəhrayı", "number": 1, "hex": "#ED45A5", "available": true },
    { "id": "yellow", "name": "Sarı", "number": 2, "hex": "#F3DF16", "available": true },
    { "id": "orange", "name": "Narıncı", "number": 3, "hex": "#F5A21B", "available": true },
    { "id": "red", "name": "Qırmızı", "number": 4, "hex": "#E52B35", "available": true },
    { "id": "purple", "name": "Bənövşəyi", "number": 5, "hex": "#A52BD1", "available": true },
    { "id": "green", "name": "Yaşıl", "number": 6, "hex": "#399D39", "available": true }
  ]
};

const FALLBACK_DELIVERY = {
  "methods": [
    {
      "id": "metro",
      "name": "Metroda təhvil",
      "price": 0,
      "badge": "PULSUZ",
      "description": "Seçilmiş metro stansiyasında təhvil verilir. Əlavə ödəniş yoxdur.",
      "locations": [
        "Nərimanov metrosu",
        "28 May metrosu",
        "Gənclik metrosu"
      ]
    },
    {
      "id": "taxi",
      "name": "Birbaşa ünvana — Taxi kuryer",
      "price": 0,
      "badge": "Sürətli çatdırılma",
      "description": "Bakı daxilində ünvanınıza taxi kuryer ilə çatdırılır. Kuryer haqqı məhsul çatdırıldıqda birbaşa kuryerə ödənilir.",
      "notice": "Taxi kuryer haqqı saytın sifariş məbləğinə daxil edilmir və kuryerə nağd / kartla birbaşa ödənilir."
    },
    {
      "id": "cargo",
      "name": "Azərpoçt / Karqo",
      "price": 4,
      "badge": "4 AZN",
      "description": "Bakıətrafı qəsəbələr və bütün rayonlara poçt / karqo vasitəsilə çatdırılma.",
      "notice": "Sabit 4 AZN çatdırılma haqqı sifarişin yekun məbləğinə əlavə edilir."
    }
  ],
  "schedule": [
    { "day": "Bazar ertəsi", "hours": "08:00 – 22:00" },
    { "day": "Çərşənbə axşamı", "hours": "16:00 – 22:00" },
    { "day": "Çərşənbə", "hours": "16:00 – 22:00" },
    { "day": "Cümə axşamı", "hours": "16:00 – 22:00" },
    { "day": "Cümə", "hours": "15:00 – 22:00" },
    { "day": "Şənbə", "hours": "08:00 – 22:00" },
    { "day": "Bazar", "hours": "08:00 – 22:00" }
  ],
  "notes": [
    "Bütün saatlar Bakı yerli vaxtı ilə göstərilmişdir.",
    "Sayt vasitəsilə göndərilən çatdırılma vaxtı təklif xarakteri daşıyır. Dəqiq çatdırılma saatı WhatsApp üzərindən biznes sahibi ilə razılaşdırılacaqdır."
  ]
};

const Config = {
  store: null,
  delivery: null,

  async getStore() {
    if (this.store) return this.store;
    try {
      const response = await fetch('./data/store.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error('store.json faylı tapılmadı');
      this.store = await response.json();
    } catch (err) {
      console.warn('store.json faylı fetch edilə bilmədi, daxili nüsxə istifadə edilir:', err);
      this.store = FALLBACK_STORE;
    }
    return this.store;
  },

  async getDelivery() {
    if (this.delivery) return this.delivery;
    try {
      const response = await fetch('./data/delivery.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error('delivery.json faylı tapılmadı');
      this.delivery = await response.json();
    } catch (err) {
      console.warn('delivery.json faylı fetch edilə bilmədi, daxili nüsxə istifadə edilir:', err);
      this.delivery = FALLBACK_DELIVERY;
    }
    return this.delivery;
  },

  formatPrice(amount) {
    return `${amount} AZN`;
  }
};

window.Config = Config;
