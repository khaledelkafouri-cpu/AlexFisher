export type Spot = { id: string; en: string; ar: string; lat: number; lon: number };
export type CoastalCity = { id: string; en: string; ar: string; spots: Spot[] };
export type CoastalCountry = { id: string; en: string; ar: string; cities: CoastalCity[] };

export const coastalCountries: CoastalCountry[] = [
  { id: "egypt", en: "Egypt", ar: "مصر", cities: [
  { id: "alexandria", en: "Alexandria", ar: "الإسكندرية", spots: [
    { id: "alex-corniche", en: "Alexandria Corniche", ar: "كورنيش الإسكندرية", lat: 31.2156, lon: 29.9553 },
    { id: "abu-qir", en: "Abu Qir", ar: "أبو قير", lat: 31.319, lon: 30.06 },
    { id: "montaza", en: "Montaza", ar: "المنتزه", lat: 31.287, lon: 30.016 },
    { id: "stanley", en: "Stanley", ar: "ستانلي", lat: 31.235, lon: 29.949 },
    { id: "anfushi", en: "Anfushi", ar: "الأنفوشي", lat: 31.213, lon: 29.885 },
    { id: "el-max", en: "El Max", ar: "المكس", lat: 31.154, lon: 29.824 },
  ]},
  { id: "north-coast", en: "North Coast", ar: "الساحل الشمالي", spots: [
    { id: "new-alamein", en: "New Alamein", ar: "العلمين الجديدة", lat: 30.852, lon: 28.95 },
    { id: "sidi-abdelrahman", en: "Sidi Abdel Rahman", ar: "سيدي عبد الرحمن", lat: 30.965, lon: 28.705 },
    { id: "el-dabaa", en: "El Dabaa", ar: "الضبعة", lat: 31.03, lon: 28.44 },
    { id: "ras-el-hekma", en: "Ras El Hekma", ar: "رأس الحكمة", lat: 31.083, lon: 28.025 },
  ]},
  { id: "matrouh", en: "Marsa Matrouh", ar: "مرسى مطروح", spots: [
    { id: "matrouh-corniche", en: "Matrouh Corniche", ar: "كورنيش مطروح", lat: 31.354, lon: 27.237 },
    { id: "cleopatra", en: "Cleopatra Bay", ar: "خليج كليوباترا", lat: 31.371, lon: 27.167 },
    { id: "al-obayed", en: "Al Obayed", ar: "الأبيض", lat: 31.384, lon: 27.074 },
    { id: "agiba", en: "Agiba", ar: "عجيبة", lat: 31.414, lon: 26.918 },
  ]},
  { id: "beheira", en: "Rosetta & Edku", ar: "رشيد وإدكو", spots: [
    { id: "rosetta-mouth", en: "Rosetta Nile Mouth", ar: "بوغاز رشيد", lat: 31.465, lon: 30.375 },
    { id: "edku-coast", en: "Edku Coast", ar: "ساحل إدكو", lat: 31.31, lon: 30.30 },
  ]},
  { id: "kafr-el-sheikh", en: "Baltim & Burullus", ar: "بلطيم والبرلس", spots: [
    { id: "baltim", en: "Baltim Resort", ar: "مصيف بلطيم", lat: 31.57, lon: 31.09 },
    { id: "borg-burullus", en: "Borg El Burullus", ar: "برج البرلس", lat: 31.59, lon: 30.98 },
    { id: "burullus-mouth", en: "Burullus Inlet", ar: "بوغاز البرلس", lat: 31.594, lon: 30.94 },
  ]},
  { id: "damietta", en: "Damietta", ar: "دمياط", spots: [
    { id: "ras-el-bar", en: "Ras El Bar", ar: "رأس البر", lat: 31.512, lon: 31.825 },
    { id: "ezbet-el-borg", en: "Ezbet El Borg", ar: "عزبة البرج", lat: 31.505, lon: 31.84 },
    { id: "new-damietta", en: "New Damietta Coast", ar: "ساحل دمياط الجديدة", lat: 31.449, lon: 31.671 },
  ]},
  { id: "port-said", en: "Port Said", ar: "بورسعيد", spots: [
    { id: "port-said-corniche", en: "Port Said Corniche", ar: "كورنيش بورسعيد", lat: 31.265, lon: 32.302 },
    { id: "port-fouad", en: "Port Fouad", ar: "بورفؤاد", lat: 31.248, lon: 32.322 },
    { id: "el-gamil", en: "El Gamil", ar: "الجميل", lat: 31.283, lon: 32.225 },
  ]},
  { id: "north-sinai", en: "North Sinai", ar: "شمال سيناء", spots: [
    { id: "el-arish", en: "El Arish", ar: "العريش", lat: 31.132, lon: 33.803 },
    { id: "rumana", en: "Rumana Coast", ar: "ساحل رمانة", lat: 31.02, lon: 32.65 },
  ]},
  { id: "suez", en: "Suez", ar: "السويس", spots: [
    { id: "suez-bay", en: "Suez Bay", ar: "خليج السويس", lat: 29.94, lon: 32.55 },
    { id: "port-tawfik", en: "Port Tawfik", ar: "بورتوفيق", lat: 29.93, lon: 32.57 },
    { id: "adabiya", en: "Adabiya", ar: "الأدبية", lat: 29.87, lon: 32.47 },
  ]},
  { id: "ain-sokhna", en: "Ain Sokhna", ar: "العين السخنة", spots: [
    { id: "ain-sokhna-main", en: "Ain Sokhna", ar: "العين السخنة", lat: 29.592, lon: 32.338 },
    { id: "el-galala", en: "El Galala Coast", ar: "ساحل الجلالة", lat: 29.43, lon: 32.46 },
    { id: "zaafarana", en: "Zaafarana", ar: "الزعفرانة", lat: 29.113, lon: 32.649 },
  ]},
  { id: "ras-gharib", en: "Ras Gharib", ar: "رأس غارب", spots: [
    { id: "ras-gharib-main", en: "Ras Gharib Coast", ar: "ساحل رأس غارب", lat: 28.36, lon: 33.08 },
    { id: "gemsa-bay", en: "Gemsa Bay", ar: "خليج جمسة", lat: 28.64, lon: 33.04 },
  ]},
  { id: "hurghada", en: "Hurghada", ar: "الغردقة", spots: [
    { id: "hurghada-marina", en: "Hurghada Marina", ar: "مارينا الغردقة", lat: 27.225, lon: 33.842 },
    { id: "el-gouna", en: "El Gouna", ar: "الجونة", lat: 27.396, lon: 33.678 },
    { id: "sahl-hasheesh", en: "Sahl Hasheesh", ar: "سهل حشيش", lat: 27.04, lon: 33.89 },
    { id: "makadi-bay", en: "Makadi Bay", ar: "خليج مكادي", lat: 26.99, lon: 33.90 },
  ]},
  { id: "safaga", en: "Safaga", ar: "سفاجا", spots: [
    { id: "safaga-port", en: "Safaga Coast", ar: "ساحل سفاجا", lat: 26.75, lon: 33.94 },
    { id: "soma-bay", en: "Soma Bay", ar: "سوما باي", lat: 26.84, lon: 33.99 },
  ]},
  { id: "el-quseir", en: "El Quseir", ar: "القصير", spots: [
    { id: "quseir-harbour", en: "El Quseir Harbour", ar: "ميناء القصير", lat: 26.105, lon: 34.28 },
    { id: "marsa-alam-north", en: "Northern Reefs", ar: "الشعاب الشمالية", lat: 25.99, lon: 34.34 },
  ]},
  { id: "marsa-alam", en: "Marsa Alam", ar: "مرسى علم", spots: [
    { id: "marsa-alam-main", en: "Marsa Alam Coast", ar: "ساحل مرسى علم", lat: 25.067, lon: 34.879 },
    { id: "abu-dabbab", en: "Abu Dabbab", ar: "أبو دباب", lat: 25.338, lon: 34.738 },
    { id: "port-ghalib", en: "Port Ghalib", ar: "بورت غالب", lat: 25.535, lon: 34.638 },
    { id: "hamata", en: "Hamata", ar: "حماطة", lat: 24.62, lon: 35.10 },
  ]},
  { id: "sharm", en: "Sharm El Sheikh", ar: "شرم الشيخ", spots: [
    { id: "naama-bay", en: "Naama Bay", ar: "خليج نعمة", lat: 27.91, lon: 34.32 },
    { id: "sharks-bay", en: "Sharks Bay", ar: "خليج القرش", lat: 27.965, lon: 34.39 },
    { id: "nabq", en: "Nabq", ar: "نبق", lat: 28.05, lon: 34.43 },
    { id: "ras-mohammed", en: "Ras Mohammed", ar: "رأس محمد", lat: 27.73, lon: 34.25 },
  ]},
  { id: "dahab", en: "Dahab", ar: "دهب", spots: [
    { id: "dahab-lighthouse", en: "Lighthouse", ar: "اللايت هاوس", lat: 28.50, lon: 34.52 },
    { id: "dahab-laguna", en: "Dahab Lagoon", ar: "لاجونا دهب", lat: 28.48, lon: 34.50 },
    { id: "blue-hole", en: "Blue Hole", ar: "البلو هول", lat: 28.57, lon: 34.54 },
    { id: "abu-galum", en: "Abu Galum", ar: "أبو جالوم", lat: 28.62, lon: 34.55 },
  ]},
  { id: "nuweiba", en: "Nuweiba", ar: "نويبع", spots: [
    { id: "nuweiba-port", en: "Nuweiba Coast", ar: "ساحل نويبع", lat: 29.03, lon: 34.66 },
    { id: "tarabin", en: "Tarabin", ar: "الترابين", lat: 29.05, lon: 34.67 },
    { id: "ras-shitan", en: "Ras Shitan", ar: "رأس شيطان", lat: 29.23, lon: 34.72 },
  ]},
  { id: "taba", en: "Taba", ar: "طابا", spots: [
    { id: "taba-bay", en: "Taba Bay", ar: "خليج طابا", lat: 29.49, lon: 34.90 },
    { id: "fjord-bay", en: "Fjord Bay", ar: "خليج فيورد", lat: 29.38, lon: 34.80 },
    { id: "pharaoh-island", en: "Pharaoh's Island", ar: "جزيرة فرعون", lat: 29.46, lon: 34.86 },
  ]},
  ]},
  { id: "saudi-arabia", en: "Saudi Arabia", ar: "السعودية", cities: [
    { id: "jeddah", en: "Jeddah", ar: "جدة", spots: [
      { id: "jeddah-corniche", en: "Jeddah Corniche", ar: "كورنيش جدة", lat: 21.632, lon: 39.104 },
      { id: "obhur", en: "Obhur Creek", ar: "شرم أبحر", lat: 21.733, lon: 39.095 },
      { id: "thuwal", en: "Thuwal Coast", ar: "ساحل ثول", lat: 22.283, lon: 39.101 },
    ]},
    { id: "yanbu", en: "Yanbu", ar: "ينبع", spots: [
      { id: "yanbu-waterfront", en: "Yanbu Waterfront", ar: "واجهة ينبع البحرية", lat: 24.096, lon: 38.059 },
      { id: "sharm-yanbu", en: "Sharm Yanbu", ar: "شرم ينبع", lat: 24.178, lon: 37.997 },
    ]},
    { id: "dammam-khobar", en: "Dammam & Al Khobar", ar: "الدمام والخبر", spots: [
      { id: "dammam-corniche", en: "Dammam Corniche", ar: "كورنيش الدمام", lat: 26.452, lon: 50.111 },
      { id: "khobar-corniche", en: "Al Khobar Corniche", ar: "كورنيش الخبر", lat: 26.289, lon: 50.224 },
      { id: "half-moon-bay", en: "Half Moon Bay", ar: "شاطئ نصف القمر", lat: 26.139, lon: 50.032 },
    ]},
    { id: "jubail", en: "Jubail", ar: "الجبيل", spots: [
      { id: "fanateer", en: "Fanateer Beach", ar: "شاطئ الفناتير", lat: 27.145, lon: 49.568 },
      { id: "jubail-coast", en: "Jubail Coast", ar: "ساحل الجبيل", lat: 27.004, lon: 49.665 },
    ]},
    { id: "jizan", en: "Jizan", ar: "جازان", spots: [
      { id: "jizan-corniche", en: "Jizan Corniche", ar: "كورنيش جازان", lat: 16.887, lon: 42.548 },
      { id: "farasan", en: "Farasan Islands", ar: "جزر فرسان", lat: 16.704, lon: 42.118 },
    ]},
  ]},
  { id: "uae", en: "United Arab Emirates", ar: "الإمارات العربية المتحدة", cities: [
    { id: "dubai", en: "Dubai", ar: "دبي", spots: [
      { id: "jumeirah", en: "Jumeirah Beach", ar: "شاطئ جميرا", lat: 25.204, lon: 55.238 },
      { id: "kite-beach", en: "Kite Beach", ar: "كايت بيتش", lat: 25.162, lon: 55.208 },
      { id: "jebel-ali", en: "Jebel Ali Coast", ar: "ساحل جبل علي", lat: 24.985, lon: 55.027 },
    ]},
    { id: "abu-dhabi", en: "Abu Dhabi", ar: "أبوظبي", spots: [
      { id: "abu-dhabi-corniche", en: "Abu Dhabi Corniche", ar: "كورنيش أبوظبي", lat: 24.475, lon: 54.329 },
      { id: "yas-coast", en: "Yas Island Coast", ar: "ساحل جزيرة ياس", lat: 24.498, lon: 54.607 },
      { id: "al-sila", en: "Al Sila Coast", ar: "ساحل السلع", lat: 24.063, lon: 51.765 },
    ]},
    { id: "sharjah-ajman", en: "Sharjah & Ajman", ar: "الشارقة وعجمان", spots: [
      { id: "sharjah-corniche", en: "Sharjah Corniche", ar: "كورنيش الشارقة", lat: 25.362, lon: 55.369 },
      { id: "ajman-corniche", en: "Ajman Corniche", ar: "كورنيش عجمان", lat: 25.408, lon: 55.435 },
    ]},
    { id: "fujairah", en: "Fujairah", ar: "الفجيرة", spots: [
      { id: "fujairah-corniche", en: "Fujairah Corniche", ar: "كورنيش الفجيرة", lat: 25.133, lon: 56.357 },
      { id: "al-aqah", en: "Al Aqah", ar: "العقة", lat: 25.498, lon: 56.361 },
      { id: "dibba-fujairah", en: "Dibba Coast", ar: "ساحل دبا", lat: 25.603, lon: 56.272 },
    ]},
    { id: "khor-fakkan-kalba", en: "Khor Fakkan & Kalba", ar: "خورفكان وكلباء", spots: [
      { id: "khor-fakkan", en: "Khor Fakkan Corniche", ar: "كورنيش خورفكان", lat: 25.344, lon: 56.363 },
      { id: "kalba", en: "Kalba Coast", ar: "ساحل كلباء", lat: 25.074, lon: 56.362 },
    ]},
  ]},
  { id: "oman", en: "Oman", ar: "عُمان", cities: [
    { id: "muscat", en: "Muscat", ar: "مسقط", spots: [
      { id: "qurum", en: "Qurum Beach", ar: "شاطئ القرم", lat: 23.615, lon: 58.473 },
      { id: "muttrah", en: "Muttrah Corniche", ar: "كورنيش مطرح", lat: 23.621, lon: 58.565 },
      { id: "seeb", en: "Seeb Coast", ar: "ساحل السيب", lat: 23.67, lon: 58.19 },
    ]},
    { id: "musandam", en: "Musandam", ar: "مسندم", spots: [
      { id: "khasab", en: "Khasab Coast", ar: "ساحل خصب", lat: 26.196, lon: 56.244 },
      { id: "dibba-musandam", en: "Dibba Musandam", ar: "دبا مسندم", lat: 25.617, lon: 56.268 },
    ]},
    { id: "sur", en: "Sur", ar: "صور", spots: [
      { id: "sur-coast", en: "Sur Coast", ar: "ساحل صور", lat: 22.567, lon: 59.528 },
      { id: "ras-al-hadd", en: "Ras Al Hadd", ar: "رأس الحد", lat: 22.526, lon: 59.796 },
    ]},
    { id: "duqm", en: "Duqm", ar: "الدقم", spots: [
      { id: "duqm-coast", en: "Duqm Coast", ar: "ساحل الدقم", lat: 19.657, lon: 57.706 },
      { id: "ras-markaz", en: "Ras Markaz", ar: "رأس مركز", lat: 19.477, lon: 57.744 },
    ]},
    { id: "salalah", en: "Salalah", ar: "صلالة", spots: [
      { id: "dahariz", en: "Dahariz Beach", ar: "شاطئ الدهاريز", lat: 16.993, lon: 54.166 },
      { id: "mughsail", en: "Mughsail Beach", ar: "شاطئ المغسيل", lat: 16.88, lon: 53.768 },
      { id: "mirbat", en: "Mirbat Coast", ar: "ساحل مرباط", lat: 16.992, lon: 54.691 },
    ]},
  ]},
  { id: "yemen", en: "Yemen", ar: "اليمن", cities: [
    { id: "aden", en: "Aden", ar: "عدن", spots: [
      { id: "gold-mohur", en: "Gold Mohur", ar: "جولد مور", lat: 12.77, lon: 44.987 },
      { id: "aden-bay", en: "Aden Bay", ar: "خليج عدن", lat: 12.789, lon: 45.018 },
    ]},
    { id: "hodeidah", en: "Al Hudaydah", ar: "الحديدة", spots: [
      { id: "hodeidah-coast", en: "Al Hudaydah Coast", ar: "ساحل الحديدة", lat: 14.798, lon: 42.949 },
      { id: "al-khawkhah", en: "Al Khawkhah", ar: "الخوخة", lat: 13.802, lon: 43.247 },
    ]},
    { id: "mukalla", en: "Mukalla", ar: "المكلا", spots: [
      { id: "mukalla-corniche", en: "Mukalla Corniche", ar: "كورنيش المكلا", lat: 14.526, lon: 49.133 },
      { id: "bir-ali", en: "Bir Ali Coast", ar: "ساحل بئر علي", lat: 14.014, lon: 48.339 },
    ]},
    { id: "socotra", en: "Socotra", ar: "سقطرى", spots: [
      { id: "hadibo", en: "Hadibo Coast", ar: "ساحل حديبو", lat: 12.65, lon: 54.025 },
      { id: "qalandia", en: "Qalansiyah", ar: "قلنسية", lat: 12.69, lon: 53.49 },
    ]},
  ]},
  { id: "qatar", en: "Qatar", ar: "قطر", cities: [
    { id: "doha", en: "Doha", ar: "الدوحة", spots: [
      { id: "doha-corniche", en: "Doha Corniche", ar: "كورنيش الدوحة", lat: 25.306, lon: 51.526 },
      { id: "katara", en: "Katara Beach", ar: "شاطئ كتارا", lat: 25.36, lon: 51.525 },
    ]},
    { id: "al-khor", en: "Al Khor", ar: "الخور", spots: [
      { id: "al-khor-corniche", en: "Al Khor Corniche", ar: "كورنيش الخور", lat: 25.69, lon: 51.507 },
      { id: "al-thakhira", en: "Al Thakhira", ar: "الذخيرة", lat: 25.735, lon: 51.533 },
    ]},
    { id: "al-wakrah", en: "Al Wakrah", ar: "الوكرة", spots: [
      { id: "wakrah-beach", en: "Al Wakrah Beach", ar: "شاطئ الوكرة", lat: 25.163, lon: 51.606 },
      { id: "mesaieed", en: "Mesaieed Coast", ar: "ساحل مسيعيد", lat: 24.991, lon: 51.553 },
    ]},
    { id: "dukhan", en: "Dukhan", ar: "دخان", spots: [
      { id: "dukhan-beach", en: "Dukhan Beach", ar: "شاطئ دخان", lat: 25.426, lon: 50.785 },
      { id: "zekreet", en: "Zekreet Coast", ar: "ساحل زكريت", lat: 25.49, lon: 50.848 },
    ]},
  ]},
  { id: "bahrain", en: "Bahrain", ar: "البحرين", cities: [
    { id: "manama", en: "Manama", ar: "المنامة", spots: [
      { id: "bahrain-bay", en: "Bahrain Bay", ar: "خليج البحرين", lat: 26.246, lon: 50.587 },
      { id: "nurana", en: "Nurana Coast", ar: "ساحل نورانا", lat: 26.253, lon: 50.516 },
    ]},
    { id: "muharraq", en: "Muharraq", ar: "المحرق", spots: [
      { id: "amwaj", en: "Amwaj Islands", ar: "جزر أمواج", lat: 26.289, lon: 50.666 },
      { id: "hidd", en: "Al Hidd Coast", ar: "ساحل الحد", lat: 26.244, lon: 50.654 },
    ]},
    { id: "sitra", en: "Sitra", ar: "سترة", spots: [
      { id: "sitra-wharf", en: "Sitra Wharf", ar: "فرضـة سترة", lat: 26.154, lon: 50.622 },
      { id: "asry-coast", en: "ASRY Coast", ar: "ساحل أسري", lat: 26.185, lon: 50.657 },
    ]},
    { id: "zallaq", en: "Zallaq", ar: "الزلاق", spots: [
      { id: "zallaq-beach", en: "Zallaq Beach", ar: "شاطئ الزلاق", lat: 26.048, lon: 50.48 },
      { id: "hawar", en: "Hawar Islands", ar: "جزر حوار", lat: 25.65, lon: 50.75 },
    ]},
  ]},
  { id: "kuwait", en: "Kuwait", ar: "الكويت", cities: [
    { id: "kuwait-city", en: "Kuwait City", ar: "مدينة الكويت", spots: [
      { id: "shuwaikh", en: "Shuwaikh Coast", ar: "ساحل الشويخ", lat: 29.354, lon: 47.93 },
      { id: "green-island", en: "Green Island", ar: "الجزيرة الخضراء", lat: 29.363, lon: 48.04 },
      { id: "salmiya", en: "Salmiya Coast", ar: "ساحل السالمية", lat: 29.333, lon: 48.087 },
    ]},
    { id: "fahaheel", en: "Fahaheel", ar: "الفحيحيل", spots: [
      { id: "fahaheel-coast", en: "Fahaheel Coast", ar: "ساحل الفحيحيل", lat: 29.083, lon: 48.142 },
      { id: "mahboula", en: "Mahboula Coast", ar: "ساحل المهبولة", lat: 29.146, lon: 48.13 },
    ]},
    { id: "al-khiran", en: "Al Khiran", ar: "الخيران", spots: [
      { id: "khiran-marina", en: "Al Khiran Marina", ar: "مارينا الخيران", lat: 28.66, lon: 48.37 },
      { id: "al-zour", en: "Al Zour Coast", ar: "ساحل الزور", lat: 28.743, lon: 48.39 },
    ]},
  ]},
  { id: "iraq", en: "Iraq", ar: "العراق", cities: [
    { id: "al-faw", en: "Al Faw", ar: "الفاو", spots: [
      { id: "faw-coast", en: "Al Faw Coast", ar: "ساحل الفاو", lat: 29.975, lon: 48.472 },
      { id: "shatt-al-arab-mouth", en: "Shatt Al-Arab Mouth", ar: "مصب شط العرب", lat: 29.883, lon: 48.62 },
    ]},
    { id: "umm-qasr", en: "Umm Qasr", ar: "أم قصر", spots: [
      { id: "umm-qasr-channel", en: "Umm Qasr Channel", ar: "قناة أم قصر", lat: 30.033, lon: 47.94 },
      { id: "khor-abdullah", en: "Khor Abdullah", ar: "خور عبد الله", lat: 29.86, lon: 48.08 },
    ]},
  ]},
  { id: "iran", en: "Iran", ar: "إيران", cities: [
    { id: "bandar-abbas", en: "Bandar Abbas", ar: "بندر عباس", spots: [
      { id: "bandar-abbas-coast", en: "Bandar Abbas Coast", ar: "ساحل بندر عباس", lat: 27.184, lon: 56.267 },
      { id: "hormuz", en: "Hormuz Island", ar: "جزيرة هرمز", lat: 27.058, lon: 56.46 },
    ]},
    { id: "qeshm", en: "Qeshm", ar: "قشم", spots: [
      { id: "qeshm-town", en: "Qeshm Coast", ar: "ساحل قشم", lat: 26.95, lon: 56.27 },
      { id: "laft", en: "Laft Coast", ar: "ساحل لافت", lat: 26.897, lon: 55.758 },
    ]},
    { id: "kish", en: "Kish Island", ar: "جزيرة كيش", spots: [
      { id: "kish-east", en: "Kish East Coast", ar: "الساحل الشرقي لكيش", lat: 26.532, lon: 54.023 },
      { id: "kish-west", en: "Kish West Coast", ar: "الساحل الغربي لكيش", lat: 26.534, lon: 53.94 },
    ]},
    { id: "bushehr", en: "Bushehr", ar: "بوشهر", spots: [
      { id: "bushehr-coast", en: "Bushehr Coast", ar: "ساحل بوشهر", lat: 28.923, lon: 50.82 },
      { id: "bandar-ganaveh", en: "Bandar Ganaveh", ar: "بندر غناوة", lat: 29.58, lon: 50.517 },
    ]},
    { id: "chabahar", en: "Chabahar", ar: "تشابهار", spots: [
      { id: "chabahar-bay", en: "Chabahar Bay", ar: "خليج تشابهار", lat: 25.292, lon: 60.616 },
      { id: "beris", en: "Beris Coast", ar: "ساحل بيريس", lat: 25.137, lon: 61.171 },
    ]},
    { id: "bandar-anzali", en: "Bandar Anzali", ar: "بندر أنزلي", spots: [
      { id: "anzali-caspian", en: "Anzali Caspian Coast", ar: "ساحل أنزلي على بحر قزوين", lat: 37.478, lon: 49.458 },
      { id: "caspian-breakwater", en: "Anzali Breakwater", ar: "حاجز أمواج أنزلي", lat: 37.486, lon: 49.466 },
    ]},
  ]},
  { id: "turkiye", en: "Türkiye", ar: "تركيا", cities: [
    { id: "istanbul", en: "Istanbul", ar: "إسطنبول", spots: [
      { id: "bosphorus", en: "Bosphorus Shore", ar: "ساحل البوسفور", lat: 41.055, lon: 29.043 },
      { id: "sarayburnu", en: "Sarayburnu", ar: "سراي بورنو", lat: 41.015, lon: 28.986 },
      { id: "buyukcekmece", en: "Büyükçekmece Coast", ar: "ساحل بيوك تشكمجة", lat: 41.005, lon: 28.573 },
    ]},
    { id: "izmir", en: "İzmir", ar: "إزمير", spots: [
      { id: "kordon", en: "Kordon Waterfront", ar: "واجهة كوردون", lat: 38.437, lon: 27.141 },
      { id: "cesme", en: "Çeşme Coast", ar: "ساحل تشيشمي", lat: 38.324, lon: 26.305 },
    ]},
    { id: "antalya", en: "Antalya", ar: "أنطاليا", spots: [
      { id: "konyaalti", en: "Konyaaltı Coast", ar: "ساحل كونيالتي", lat: 36.872, lon: 30.64 },
      { id: "side", en: "Side Coast", ar: "ساحل سيدا", lat: 36.766, lon: 31.39 },
    ]},
    { id: "bodrum", en: "Bodrum", ar: "بودروم", spots: [
      { id: "bodrum-harbour", en: "Bodrum Harbour", ar: "ميناء بودروم", lat: 37.034, lon: 27.431 },
      { id: "gumusluk", en: "Gümüşlük Coast", ar: "ساحل غوموشلوك", lat: 37.053, lon: 27.234 },
    ]},
    { id: "mersin", en: "Mersin", ar: "مرسين", spots: [
      { id: "mersin-marina", en: "Mersin Marina", ar: "مارينا مرسين", lat: 36.773, lon: 34.567 },
      { id: "tasucu", en: "Taşucu Coast", ar: "ساحل طاشوجو", lat: 36.319, lon: 33.881 },
    ]},
    { id: "trabzon", en: "Trabzon", ar: "طرابزون", spots: [
      { id: "trabzon-coast", en: "Trabzon Coast", ar: "ساحل طرابزون", lat: 41.008, lon: 39.72 },
      { id: "akcaabat", en: "Akçaabat Coast", ar: "ساحل أكشابات", lat: 41.019, lon: 39.572 },
    ]},
  ]},
  { id: "cyprus", en: "Cyprus", ar: "قبرص", cities: [
    { id: "limassol", en: "Limassol", ar: "ليماسول", spots: [
      { id: "limassol-molos", en: "Molos Waterfront", ar: "واجهة مولوس", lat: 34.674, lon: 33.044 },
      { id: "akrotiri", en: "Akrotiri Coast", ar: "ساحل أكروتيري", lat: 34.589, lon: 32.989 },
    ]},
    { id: "larnaca", en: "Larnaca", ar: "لارنكا", spots: [
      { id: "finikoudes", en: "Finikoudes", ar: "فينيكودس", lat: 34.913, lon: 33.638 },
      { id: "mackenzie", en: "Mackenzie Beach", ar: "شاطئ ماكنزي", lat: 34.89, lon: 33.637 },
    ]},
    { id: "paphos", en: "Paphos", ar: "بافوس", spots: [
      { id: "paphos-harbour", en: "Paphos Harbour", ar: "ميناء بافوس", lat: 34.755, lon: 32.407 },
      { id: "coral-bay", en: "Coral Bay", ar: "خليج كورال", lat: 34.853, lon: 32.37 },
    ]},
    { id: "ayia-napa", en: "Ayia Napa", ar: "أيا نابا", spots: [
      { id: "cape-greco", en: "Cape Greco", ar: "رأس غريكو", lat: 34.961, lon: 34.07 },
      { id: "ayia-napa-harbour", en: "Ayia Napa Harbour", ar: "ميناء أيا نابا", lat: 34.982, lon: 34.002 },
    ]},
    { id: "kyrenia", en: "Kyrenia", ar: "كيرينيا", spots: [
      { id: "kyrenia-harbour", en: "Kyrenia Harbour", ar: "ميناء كيرينيا", lat: 35.342, lon: 33.322 },
      { id: "lapta", en: "Lapta Coast", ar: "ساحل لابتا", lat: 35.349, lon: 33.179 },
    ]},
  ]},
  { id: "lebanon", en: "Lebanon", ar: "لبنان", cities: [
    { id: "beirut", en: "Beirut", ar: "بيروت", spots: [
      { id: "raouche", en: "Raouche", ar: "الروشة", lat: 33.888, lon: 35.473 },
      { id: "beirut-waterfront", en: "Beirut Waterfront", ar: "واجهة بيروت البحرية", lat: 33.906, lon: 35.509 },
    ]},
    { id: "tripoli-lebanon", en: "Tripoli", ar: "طرابلس", spots: [
      { id: "mina-tripoli", en: "El Mina", ar: "الميناء", lat: 34.454, lon: 35.812 },
      { id: "palm-islands", en: "Palm Islands Coast", ar: "ساحل جزر النخيل", lat: 34.494, lon: 35.786 },
    ]},
    { id: "sidon", en: "Sidon", ar: "صيدا", spots: [
      { id: "sidon-seafront", en: "Sidon Seafront", ar: "واجهة صيدا البحرية", lat: 33.56, lon: 35.367 },
      { id: "zireh-island", en: "Zireh Island", ar: "جزيرة الزيرة", lat: 33.57, lon: 35.352 },
    ]},
    { id: "tyre", en: "Tyre", ar: "صور", spots: [
      { id: "tyre-coast", en: "Tyre Coast", ar: "ساحل صور", lat: 33.267, lon: 35.193 },
      { id: "ras-al-ain", en: "Ras Al Ain", ar: "رأس العين", lat: 33.228, lon: 35.218 },
    ]},
    { id: "byblos", en: "Byblos", ar: "جبيل", spots: [
      { id: "byblos-harbour", en: "Byblos Harbour", ar: "ميناء جبيل", lat: 34.121, lon: 35.643 },
      { id: "amchit", en: "Amchit Coast", ar: "ساحل عمشيت", lat: 34.147, lon: 35.628 },
    ]},
  ]},
  { id: "syria", en: "Syria", ar: "سوريا", cities: [
    { id: "latakia", en: "Latakia", ar: "اللاذقية", spots: [
      { id: "latakia-corniche", en: "Latakia Corniche", ar: "كورنيش اللاذقية", lat: 35.531, lon: 35.776 },
      { id: "blue-beach", en: "Blue Beach", ar: "الشاطئ الأزرق", lat: 35.582, lon: 35.737 },
    ]},
    { id: "tartus", en: "Tartus", ar: "طرطوس", spots: [
      { id: "tartus-corniche", en: "Tartus Corniche", ar: "كورنيش طرطوس", lat: 34.889, lon: 35.875 },
      { id: "arwad", en: "Arwad Island", ar: "جزيرة أرواد", lat: 34.855, lon: 35.858 },
    ]},
  ]},
  { id: "jordan", en: "Jordan", ar: "الأردن", cities: [
    { id: "aqaba", en: "Aqaba", ar: "العقبة", spots: [
      { id: "aqaba-corniche", en: "Aqaba Corniche", ar: "كورنيش العقبة", lat: 29.526, lon: 35.002 },
      { id: "south-beach-aqaba", en: "Aqaba South Beach", ar: "الشاطئ الجنوبي بالعقبة", lat: 29.438, lon: 34.978 },
      { id: "tala-bay", en: "Tala Bay", ar: "تالا باي", lat: 29.408, lon: 34.979 },
    ]},
  ]},
  { id: "palestine", en: "Palestine", ar: "فلسطين", cities: [
    { id: "haifa", en: "Haifa", ar: "حيفا", spots: [
      { id: "bat-galim", en: "Bat Galim", ar: "بات غاليم", lat: 32.836, lon: 34.981 },
      { id: "kishon", en: "Kishon Estuary", ar: "مصب نهر المقطع", lat: 32.814, lon: 35.028 },
    ]},
    { id: "tel-aviv-jaffa", en: "Tel Aviv–Jaffa", ar: "تل أبيب–يافا", spots: [
      { id: "jaffa-port", en: "Jaffa Port", ar: "ميناء يافا", lat: 32.052, lon: 34.75 },
      { id: "reading-breakwater", en: "Reading Breakwater", ar: "حاجز ريدينغ", lat: 32.101, lon: 34.773 },
    ]},
    { id: "ashdod", en: "Ashdod", ar: "أشدود", spots: [
      { id: "ashdod-marina", en: "Ashdod Marina", ar: "مارينا أشدود", lat: 31.795, lon: 34.634 },
      { id: "lachish-estuary", en: "Lachish Estuary", ar: "مصب لخيش", lat: 31.82, lon: 34.642 },
    ]},
    { id: "ashkelon", en: "Ashkelon", ar: "عسقلان", spots: [
      { id: "ashkelon-marina", en: "Ashkelon Marina", ar: "مارينا عسقلان", lat: 31.68, lon: 34.555 },
      { id: "delilah-beach", en: "Delilah Beach", ar: "شاطئ دليلة", lat: 31.675, lon: 34.557 },
    ]},
    { id: "eilat", en: "Eilat", ar: "إيلات", spots: [
      { id: "eilat-north", en: "Eilat North Beach", ar: "شاطئ إيلات الشمالي", lat: 29.552, lon: 34.961 },
      { id: "south-coral-coast", en: "South Coral Coast", ar: "ساحل المرجان الجنوبي", lat: 29.508, lon: 34.921 },
    ]},
    { id: "gaza-city", en: "Gaza City", ar: "مدينة غزة", spots: [
      { id: "gaza-port", en: "Gaza Port", ar: "ميناء غزة", lat: 31.524, lon: 34.429 },
      { id: "gaza-beach", en: "Gaza Beach", ar: "شاطئ غزة", lat: 31.531, lon: 34.435 },
    ]},
    { id: "deir-al-balah", en: "Deir al-Balah", ar: "دير البلح", spots: [
      { id: "deir-al-balah-coast", en: "Deir al-Balah Coast", ar: "ساحل دير البلح", lat: 31.418, lon: 34.338 },
      { id: "wadi-gaza-mouth", en: "Wadi Gaza Mouth", ar: "مصب وادي غزة", lat: 31.45, lon: 34.37 },
    ]},
    { id: "khan-younis", en: "Khan Younis", ar: "خان يونس", spots: [
      { id: "mawasi-khan-younis", en: "Al-Mawasi Coast", ar: "ساحل المواصي", lat: 31.351, lon: 34.267 },
      { id: "rafah-coast", en: "Rafah Coast", ar: "ساحل رفح", lat: 31.296, lon: 34.245 },
    ]},
  ]},
];

/** Which sea(s) a coastal city or (as fallback) country borders, for filtering species that only make sense in that water. */
const citySeas: Record<string, string[]> = {
  alexandria: ["med"], "north-coast": ["med"], matrouh: ["med"], beheira: ["med"], "kafr-el-sheikh": ["med"], damietta: ["med"], "port-said": ["med"], "north-sinai": ["med"],
  suez: ["suez"], "ain-sokhna": ["suez"],
  "ras-gharib": ["red"], hurghada: ["red"], safaga: ["red"], "el-quseir": ["red"], "marsa-alam": ["red"],
  sharm: ["aqaba"], dahab: ["aqaba"], nuweiba: ["aqaba"], taba: ["aqaba"],
  jeddah: ["red"], yanbu: ["red"], jizan: ["red"],
  "dammam-khobar": ["gulf"], jubail: ["gulf"],
  dubai: ["gulf"], "abu-dhabi": ["gulf"], "sharjah-ajman": ["gulf"],
  fujairah: ["gulf-oman"], "khor-fakkan-kalba": ["gulf-oman"],
  muscat: ["gulf-oman"], musandam: ["gulf-oman"],
  sur: ["arabian-sea"], duqm: ["arabian-sea"], salalah: ["arabian-sea"],
  hodeidah: ["red"],
  aden: ["arabian-sea"], mukalla: ["arabian-sea"], socotra: ["arabian-sea"],
  doha: ["gulf"], "al-khor": ["gulf"], "al-wakrah": ["gulf"], dukhan: ["gulf"],
  manama: ["gulf"], muharraq: ["gulf"], sitra: ["gulf"], zallaq: ["gulf"],
  "kuwait-city": ["gulf"], fahaheel: ["gulf"], "al-khiran": ["gulf"],
  "al-faw": ["gulf"], "umm-qasr": ["gulf"],
  "bandar-abbas": ["gulf"], qeshm: ["gulf"], kish: ["gulf"], bushehr: ["gulf"],
  chabahar: ["gulf-oman", "arabian-sea"],
  "bandar-anzali": [],
  istanbul: ["aegean"], izmir: ["aegean"], bodrum: ["aegean"],
  antalya: ["med"], mersin: ["med"],
  trabzon: ["black-sea"],
  limassol: ["med"], larnaca: ["med"], paphos: ["med"], "ayia-napa": ["med"], kyrenia: ["med"],
  beirut: ["med"], "tripoli-lebanon": ["med"], sidon: ["med"], tyre: ["med"], byblos: ["med"],
  latakia: ["med"], tartus: ["med"],
  aqaba: ["aqaba"],
  haifa: ["med"], "tel-aviv-jaffa": ["med"], ashdod: ["med"], ashkelon: ["med"], "gaza-city": ["med"], "deir-al-balah": ["med"], "khan-younis": ["med"],
  eilat: ["aqaba"],
};
const countrySeas: Record<string, string[]> = {
  egypt: ["med", "red", "suez", "aqaba"],
  "saudi-arabia": ["red", "gulf"],
  uae: ["gulf", "gulf-oman"],
  oman: ["gulf-oman", "arabian-sea"],
  yemen: ["red", "arabian-sea"],
  qatar: ["gulf"], bahrain: ["gulf"], kuwait: ["gulf"], iraq: ["gulf"],
  iran: ["gulf", "gulf-oman"],
  turkiye: ["med", "aegean", "black-sea"],
  cyprus: ["med"], lebanon: ["med"], syria: ["med"], palestine: ["med"],
  jordan: ["aqaba"],
};

export function seasForLocation(countryId: string, cityId: string): string[] {
  const fromCity = citySeas[cityId];
  if (fromCity && fromCity.length) return fromCity;
  return countrySeas[countryId] ?? ["med"];
}
