"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown, ArrowUp, ArrowUpRight, Bell, ChevronRight, CloudRain, Compass, Fish, Gauge,
  Languages, MapPin, Navigation, RefreshCw, Search, ShipWheel,
  Sparkles, Sunrise, Thermometer, Waves, Wind,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNav from "@/components/BottomNav";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type Activity = "fishing" | "surfing" | "kayaking";
type Language = "en" | "ar";
type Spot = { id: string; en: string; ar: string; lat: number; lon: number };
type CoastalCity = { id: string; en: string; ar: string; spots: Spot[] };
type CoastalCountry = { id: string; en: string; ar: string; cities: CoastalCity[] };
type TideEvent = { time: string; height: number };
type Metric = { label:string; value:string; sub:string; icon:React.ElementType; emphasis?:"wind"|"wave"; direction?:number; directionFrom?:boolean; iconRotation?:number };
type Conditions = {
  air: number; wind: number; gust: number; windDirection: number; wave: number;
  waveDirection: number; wavePeriod: number; swell: number; swellDirection: number;
  swellPeriod: number; sea: number; current: number; currentDirection: number;
  tide: number; tideState: "rising" | "falling"; highTide: string; lowTide: string;
  highTides: TideEvent[]; lowTides: TideEvent[];
  sunrise: string; sunset: string;
  hourly: Array<{
    time: string; air: number; wind: number; gust: number; windDirection: number; wave: number;
    wavePeriod: number; swell: number; swellPeriod: number; tide: number; sea: number;
    current: number; currentDirection: number; rain: number; visibility: number;
  }>;
};

const coastalCountries: CoastalCountry[] = [
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

const copy = {
  en: {
    nav: ["Conditions", "Fishing Hub", "Learning", "Community", "Shop"], eyebrow: "LIVE MARINE INTELLIGENCE",
    titleA: "Know the sea.", titleB: "Own the day.",
    subtitle: "One clear forecast for fishing, surfing and kayaking — interpreted for the way you move on the water.",
    where: "Where are you heading?", country: "Country", city: "Coastal city", spot: "Fishing spot", live: "LIVE MODEL FORECAST", updated: "Updated",
    activities: { fishing: "Fishing", surfing: "Surfing", kayaking: "Kayaking" }, score: "activity score",
    good: "Good conditions", caution: "Use caution", difficult: "Difficult conditions", window: "Best window",
    insight: "AlexFisher insight", insightText: "The morning offers the cleanest conditions. Wind and waves build after midday, so plan an early session.",
    metrics: ["Wind", "Waves", "Swell", "Tide", "Sea temp", "Current"], rising: "Rising", falling: "Falling",
    hourly: "Plan your day", drag: "Drag the time marker — every chart moves with you", selected: "Selected time", community: "The sea is better together.",
    communitySub: "Local reports, honest answers and people who love the water as much as you do.",
    members: "members", postsToday: "posts today", ask: "Ask the community...",
    launch: "Open the full community to ask questions, publish reports and comment.",
    today: "Today", tomorrow: "Tomorrow", dayThree: "Day 3", chooseDay: "7-day forecast", bestAt: "Best at",
    safety: "Forecast guidance only. Always check local conditions and official safety advice before entering the water.",
  },
  ar: {
    nav: ["حالة البحر", "مركز الصيد", "تعلم", "المجتمع", "المتجر"], eyebrow: "بيانات بحرية مباشرة",
    titleA: "اعرف البحر.", titleB: "واختار يومك.",
    subtitle: "توقعات واضحة للصيد والسيرف والكاياك — متفسرة حسب نشاطك على البحر.", where: "رايح فين؟", country: "الدولة", city: "المدينة الساحلية", spot: "مكان الصيد",
    live: "توقع مباشر", updated: "آخر تحديث", activities: { fishing: "صيد", surfing: "سيرف", kayaking: "كاياك" },
    score: "تقييم النشاط", good: "الظروف جيدة", caution: "توخَّ الحذر", difficult: "الظروف صعبة", window: "أفضل وقت",
    insight: "نصيحة AlexFisher", insightText: "الصباح يقدم أفضل الظروف. الرياح والأمواج تزيد بعد الظهر، لذلك خطط للنزول مبكراً.",
    metrics: ["الرياح", "الأمواج", "السويل", "المد والجزر", "حرارة البحر", "التيار"], rising: "مد صاعد", falling: "جزر",
    hourly: "خطط ليومك", drag: "حرّك مؤشر الوقت — كل الرسوم تتحرك معك", selected: "الوقت المختار", community: "البحر أحلى مع بعض.",
    communitySub: "تقارير محلية، إجابات حقيقية، وناس بتحب البحر زيك.", members: "عضو", postsToday: "منشور اليوم",
    ask: "اسأل المجتمع...", launch: "افتح المجتمع الكامل لطرح الأسئلة ونشر التقارير والتعليق.",
    today: "اليوم", tomorrow: "غداً", dayThree: "اليوم الثالث", chooseDay: "توقعات 7 أيام", bestAt: "الأفضل الساعة",
    safety: "التوقعات للإرشاد فقط. تحقق دائماً من الظروف المحلية وتعليمات السلامة الرسمية قبل النزول إلى المياه.",
  },
};

const fallback: Conditions = {
  air: 27, wind: 12, gust: 18, windDirection: 320, wave: .8, waveDirection: 340, wavePeriod: 6.4,
  swell: .6, swellDirection: 330, swellPeriod: 8.2, sea: 26, current: .4, currentDirection: 70,
  tide: .18, tideState: "rising", highTide: "01:20", lowTide: "07:18",
  highTides: [{ time: "01:20", height: 1.31 }, { time: "13:48", height: 1.42 }],
  lowTides: [{ time: "07:18", height: .26 }, { time: "19:42", height: .22 }], sunrise: "06:31", sunset: "19:28",
  hourly: Array.from({ length: 24 }, (_, index) => ({
    time: `${String(index).padStart(2, "0")}:00`, air: 24 + Math.sin((index - 7) / 8) * 5,
    wind: 9 + Math.max(0, Math.sin((index - 7) / 5) * 8), gust: 15 + Math.max(0, Math.sin((index - 7) / 5) * 9), windDirection: 320,
    wave: .55 + Math.max(0, Math.sin((index - 8) / 5) * .55), wavePeriod: 6.4,
    swell: .42 + Math.max(0, Math.sin((index - 8) / 5) * .35), swellPeriod: 8.2,
    tide: .8 + Math.sin((index - 11) / 2.1) * .55, sea: 26, current: .35 + Math.max(0, Math.sin(index / 4) * .2), currentDirection: 70,
    rain: index > 17 ? 12 : 3, visibility: 18,
  })),
};

const fallbackDays = Array.from({ length: 7 }, (_, day) => ({
  ...fallback,
  air: fallback.air + day,
  hourly: fallback.hourly.map((hour, index) => ({
    ...hour, wind: hour.wind + day * 1.5, gust: hour.gust + day * 2,
    wave: hour.wave + day * .08, swell: hour.swell + day * .06,
    time: `${String(index).padStart(2, "0")}:00`,
  })),
}));

const compass = (degrees: number, rtl = false) => (rtl
  ? ["شمال", "شمال شرقي", "شرق", "جنوب شرقي", "جنوب", "جنوب غربي", "غرب", "شمال غربي"]
  : ["N", "NE", "E", "SE", "S", "SW", "W", "NW"])[Math.round(degrees / 45) % 8];
const shortTime = (value?: string) => value ? new Date(value).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }) : "—";
const arabicLatinLocale = "ar-EG-u-nu-latn";
function tideExtremes(hours: Conditions["hourly"], kind: "high" | "low"): TideEvent[] {
  const isBetter = kind === "high" ? (a: number, b: number) => a > b : (a: number, b: number) => a < b;
  const local = hours.flatMap((hour, index) => {
    const previous = hours[(index + hours.length - 1) % hours.length].tide;
    const next = hours[(index + 1) % hours.length].tide;
    return isBetter(hour.tide, previous) && isBetter(hour.tide, next) ? [index] : [];
  });
  const ranked = hours.map((_, index) => index).sort((a, b) => kind === "high" ? hours[b].tide - hours[a].tide : hours[a].tide - hours[b].tide);
  const chosen = [...local];
  for (const index of ranked) {
    if (chosen.length >= 2) break;
    if (chosen.every((existing) => Math.min(Math.abs(existing - index), 24 - Math.abs(existing - index)) >= 5)) chosen.push(index);
  }
  return chosen.slice(0, 2).sort((a, b) => a - b).map((index) => ({ time: hours[index].time, height: hours[index].tide }));
}
function calculateScore(c: Conditions, activity: Activity) {
  if (activity === "fishing") return Math.round(Math.max(18, Math.min(100, 100 - c.wind * 1.5 - c.wave * 18 + (c.tideState === "rising" ? 9 : 3))));
  if (activity === "surfing") return Math.round(Math.max(20, Math.min(96, 42 + c.swell * 22 + c.swellPeriod * 2.2 - Math.max(0, c.wind - 14) * 1.4)));
  return Math.round(Math.max(10, Math.min(100, 100 - c.wind * 2.2 - c.gust * .7 - c.wave * 27 - c.current * 12)));
}

function fishingActivityLabel(score: number, rtl: boolean) {
  if (score >= 82) return rtl ? "نشاط صيد ممتاز" : "Excellent fishing activity";
  if (score >= 65) return rtl ? "نشاط صيد جيد" : "Good fishing activity";
  if (score >= 42) return rtl ? "نشاط صيد متوسط" : "Moderate fishing activity";
  return rtl ? "نشاط صيد منخفض" : "Low fishing activity";
}

function moonCondition(dateValue: string, rtl: boolean) {
  const lunarCycle = 29.53058867;
  const date = new Date(`${dateValue}T12:00:00Z`);
  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14);
  const elapsedDays = (date.getTime() - knownNewMoon) / 86400000;
  const age = ((elapsedDays % lunarCycle) + lunarCycle) % lunarCycle;
  const fraction = age / lunarCycle;
  const phaseIndex = Math.round(fraction * 8) % 8;
  const illumination = Math.round((1 - Math.cos(2 * Math.PI * fraction)) * 50);
  const phases = rtl
    ? ["محاق", "هلال متزايد", "التربيع الأول", "أحدب متزايد", "بدر", "أحدب متناقص", "التربيع الأخير", "هلال متناقص"]
    : ["New moon", "Waxing crescent", "First quarter", "Waxing gibbous", "Full moon", "Waning gibbous", "Last quarter", "Waning crescent"];
  return { emoji: ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"][phaseIndex], name: phases[phaseIndex], illumination };
}

function chartPath(values: number[], width = 1000, height = 220, xPadding = 80, scaleMin?: number, scaleMax?: number, yPadding = 24) {
  const finite = values.map((value) => Number.isFinite(value) ? value : 0);
  const min = scaleMin ?? Math.min(...finite);
  const max = scaleMax ?? Math.max(...finite);
  const range = Math.max(.01, max - min);
  return finite.map((value, index) => {
    const x = xPadding + (index / Math.max(1, finite.length - 1)) * (width - xPadding * 2);
    const y = yPadding + (1 - (value - min) / range) * (height - yPadding * 2);
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function formatTime12(value?: string) {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return value ?? "—";
  const [hourText, minute] = value.split(":");
  const hour = Number(hourText);
  return `${hour % 12 || 12}:${minute} ${hour < 12 ? "AM" : "PM"}`;
}

const chartPlotStartPercent = 8;
const chartPlotWidthPercent = 84;
const dailyAxisHours = [0, 4, 8, 12, 16, 20, 23] as const;

function chartXPercent(index: number, lastIndex: number) {
  return chartPlotStartPercent + (index / Math.max(1, lastIndex)) * chartPlotWidthPercent;
}

function ForecastChart({
  title, unit, values, secondary, secondaryLabel, headingDetail, selectedHour, onSelect, accent = "cyan", icon: ChartIcon = Waves, direction, directionFrom = false, currentDirection, currentDirectionFrom = false, currentSpeed, tideDetails, nowHour, nowTime, rtl = false, decimals = 1, xLabels, selectedLabel, rangeLabel, className = "", children,
}: {
  title: string; unit: string; values: number[]; secondary?: number[]; secondaryLabel?: string; headingDetail?: string;
  selectedHour: number; onSelect: (hour: number) => void; accent?: "cyan" | "coral" | "blue";
  icon?: React.ElementType; direction?: number; directionFrom?: boolean; currentDirection?: number; currentDirectionFrom?: boolean; currentSpeed?: number;
  tideDetails?: { fishingActivity: number; wind: number; windDirection: number; wave: number; current: number; currentDirection: number };
  nowHour?: number; nowTime?: string; rtl?: boolean; decimals?: number;
  xLabels?: Array<{ primary: string; secondary?: string }>; selectedLabel?: string; rangeLabel?: string; className?: string; children?: React.ReactNode;
}) {
  const value = values[selectedHour] ?? 0;
  const secondaryValue = secondary?.[selectedHour] ?? 0;
  const lastIndex = Math.max(1, values.length - 1);
  const marker = chartXPercent(selectedHour, lastIndex);
  const nowMarker = nowHour === undefined ? 0 : chartXPercent(Math.max(0, Math.min(lastIndex, nowHour)), lastIndex);
  const selectedTime = selectedLabel ?? formatTime12(`${String(selectedHour).padStart(2, "0")}:00`);
  // The Navigation icon points 45 degrees clockwise from north. Wind/current
  // bearings name the source, so add 180 degrees to show where they travel.
  const directionIconRotation = direction === undefined ? 0 : (direction + (directionFrom ? 135 : -45) + 360) % 360;
  const currentIconRotation = currentDirection === undefined ? 0 : (currentDirection + (currentDirectionFrom ? 135 : -45) + 360) % 360;
  const scaleValues = [...values, ...(secondary ?? [])].filter(Number.isFinite);
  const dataMin = Math.min(...scaleValues);
  const dataMax = Math.max(...scaleValues);
  const naturalRange = Math.max(Math.abs(dataMax), Math.abs(dataMin), unit === "/100" ? 100 : 1);
  const scalePadding = dataMax === dataMin ? naturalRange * .1 : (dataMax - dataMin) * .08;
  const axisMin = unit === "/100" ? 0 : dataMin >= 0 ? Math.max(0, dataMin - scalePadding) : dataMin - scalePadding;
  const axisMax = unit === "/100" ? 100 : dataMax + scalePadding;
  const axisDecimals = unit === "/100" || axisMax >= 10 ? 0 : decimals;
  const yTicks = Array.from({ length: 5 }, (_, index) => axisMax - ((axisMax - axisMin) * index) / 4);
  const yTickTop = (index: number) => (24 / 220) * 100 + index * ((220 - 48) / 220) * 25;
  const axisLabel = (tick: number) => `${tick.toFixed(axisDecimals)}${unit === "/100" ? "/100" : ` ${unit}`}`;
  const markerY = 24 + (1 - (value - axisMin) / Math.max(.01, axisMax - axisMin)) * (220 - 48);
  const markerYPercent = (markerY / 220) * 100;
  const selectFromClientX = (clientX: number, element: HTMLDivElement) => {
    const bounds = element.getBoundingClientRect();
    const plotLeft = bounds.left + bounds.width * (chartPlotStartPercent / 100);
    const plotWidth = bounds.width * (chartPlotWidthPercent / 100);
    const ratio = Math.max(0, Math.min(1, (clientX - plotLeft) / Math.max(1, plotWidth)));
    onSelect(Math.round(ratio * lastIndex));
  };
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    selectFromClientX(event.clientX, event.currentTarget);
  };
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) selectFromClientX(event.clientX, event.currentTarget);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") { event.preventDefault(); onSelect(Math.max(0, selectedHour - 1)); }
    if (event.key === "ArrowRight" || event.key === "ArrowUp") { event.preventDefault(); onSelect(Math.min(lastIndex, selectedHour + 1)); }
    if (event.key === "Home") { event.preventDefault(); onSelect(0); }
    if (event.key === "End") { event.preventDefault(); onSelect(lastIndex); }
  };
  const activityScore = tideDetails?.fishingActivity ?? (unit === "/100" ? value : undefined);
  const fishCount = activityScore === undefined ? 0 : activityScore >= 94 ? 5 : activityScore >= 88 ? 4 : activityScore >= 78 ? 3 : activityScore >= 65 ? 2 : 1;
  const fishSchool = fishCount > 0 && <span className="fish-school" aria-label={rtl ? `${fishCount} أسماك تمثل مستوى النشاط` : `${fishCount} fish representing the activity level`}>{Array.from({ length: fishCount }, (_, index) => <Fish aria-hidden="true" key={index} size={16}/>)}</span>;
  const edgeClass = selectedHour === 0 ? "edge-start" : selectedHour === lastIndex ? "edge-end" : "";
  return (
    <article className={`forecast-chart chart-${accent} ${tideDetails ? "tide-chart" : ""} ${!tideDetails && (direction !== undefined || currentDirection !== undefined) ? "chart-direction" : ""} ${className}`}>
      <div className="chart-heading">
        <div className="chart-primary-heading"><div className="chart-title-line"><span><ChartIcon size={19}/></span><p>{title}</p></div><strong>{value.toFixed(decimals)} <small>{unit}</small></strong>{unit === "/100" && <div className="chart-fish-school">{fishSchool}</div>}</div>
        <div className="chart-heading-meta">
          {secondary && <div className="legend"><span /><b>{secondaryLabel}</b><strong>{secondaryValue.toFixed(1)} {unit}</strong></div>}
          {headingDetail && <span className="heading-detail">{headingDetail}</span>}
          {direction !== undefined && <div className="heading-direction"><Navigation size={20} style={{ transform:`rotate(${directionIconRotation}deg)` }}/><span><small>{rtl ? "الاتجاه" : "Direction"}</small><b>{compass(direction, rtl)}</b></span></div>}
          {currentDirection !== undefined && <div className="heading-direction"><Navigation size={20} style={{ transform:`rotate(${currentIconRotation}deg)` }}/><span><small>{rtl ? "اتجاه التيار" : "Current direction"}</small><b>{currentSpeed !== undefined ? `${currentSpeed.toFixed(1)} km/h · ` : ""}{compass(currentDirection, rtl)}</b></span></div>}
        </div>
      </div>
      <div className="chart-canvas">
        {!xLabels && <div className="daylight-band" />}
        <div className="chart-y-axis" aria-hidden="true">{yTicks.map((tick, index) => <span key={`${tick}-${index}`} style={{ top: `${yTickTop(index)}%` }}>{axisLabel(tick)}</span>)}</div>
        <svg viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id={`fill-${accent}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".24"/><stop offset="1" stopColor="currentColor" stopOpacity=".01"/></linearGradient></defs>
          <path className="area" d={`${chartPath(values, 1000, 220, 80, axisMin, axisMax)} L920,220 L80,220 Z`} fill={`url(#fill-${accent})`} />
          <path className="primary-line" d={chartPath(values, 1000, 220, 80, axisMin, axisMax)} />
          {secondary && <path className="secondary-line" d={chartPath(secondary, 1000, 220, 80, axisMin, axisMax)} />}
        </svg>
        {nowHour !== undefined && <div className="now-cursor" style={{ left: `${nowMarker}%` }}><span>{rtl ? "الآن" : "NOW"}<b>{nowTime}</b></span></div>}
        <div className="time-cursor" style={{ left: `${marker}%` }} />
        <div className="chart-drag-surface" role="slider" tabIndex={0} aria-label={rangeLabel ?? `Select hour for ${title}`} aria-valuemin={0} aria-valuemax={lastIndex} aria-valuenow={selectedHour} aria-valuetext={`${selectedTime}, ${value.toFixed(decimals)} ${unit}`} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={(event) => event.currentTarget.hasPointerCapture(event.pointerId) && event.currentTarget.releasePointerCapture(event.pointerId)} onPointerCancel={(event) => event.currentTarget.hasPointerCapture(event.pointerId) && event.currentTarget.releasePointerCapture(event.pointerId)} onKeyDown={handleKeyDown}>
          <div className={`drag-target ${edgeClass}`} style={{ left: `${marker}%`, top: `${markerYPercent}%` }} aria-hidden="true"><span className="drag-target-label">{selectedTime}</span><i/><i/><i/><i/></div>
        </div>
      </div>
      {xLabels ? <div className="chart-hours week-labels">{xLabels.map((label, index) => <span key={`${label.primary}-${index}`} style={{ left: `${chartXPercent(index, xLabels.length - 1)}%` }}><b>{label.primary}</b>{label.secondary && <small>{label.secondary}</small>}</span>)}</div> : <div className="chart-hours daily-labels">{dailyAxisHours.map((hour) => <span key={hour} style={{ left: `${chartXPercent(hour, 23)}%` }}>{formatTime12(`${String(hour).padStart(2, "0")}:00`).replace(":00", "")}</span>)}</div>}
      {children}
    </article>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [activity, setActivity] = useState<Activity>("fishing");
  const [countryId, setCountryId] = useState("egypt");
  const [cityId, setCityId] = useState("alexandria");
  const [spotId, setSpotId] = useState("alex-corniche");
  const [forecastDays, setForecastDays] = useState<Conditions[]>(fallbackDays);
  const [forecastDates, setForecastDates] = useState<string[]>(Array.from({ length: 7 }, (_, day) => new Date(Date.now() + day * 86400000).toISOString().slice(0, 10)));
  const [selectedDay, setSelectedDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dataStatus, setDataStatus] = useState<"live" | "sample">("sample");
  const [selectedHour, setSelectedHour] = useState(9);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshRequest, setRefreshRequest] = useState(0);
  const [clockNow, setClockNow] = useState(() => Date.now());
  const [utcOffsetSeconds, setUtcOffsetSeconds] = useState(3 * 60 * 60);
  const t = copy[language];
  const rtl = language === "ar";
  const country = coastalCountries.find((item) => item.id === countryId) ?? coastalCountries[0];
  const coastalCities = country.cities;
  const city = coastalCities.find((item) => item.id === cityId) ?? coastalCities[0];
  const citySpots = city.spots;
  const spot = citySpots.find((item) => item.id === spotId) ?? citySpots[0];
  const conditions = forecastDays[selectedDay] ?? fallbackDays[0];

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("alexfisher-language");
    if (savedLanguage === "ar" || savedLanguage === "en") setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const navigation = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const legacyNavigation = window.performance as Performance & { navigation?: { type: number } };
    const isReload = navigation?.type === "reload" || legacyNavigation.navigation?.type === 1;
    if (!isReload) return;

    const previousRestoration = window.history.scrollRestoration;
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    window.history.scrollRestoration = "manual";
    document.documentElement.style.scrollBehavior = "auto";

    if (window.location.hash) {
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }

    const resetToHero = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    resetToHero();
    const firstFrame = window.requestAnimationFrame(() => {
      resetToHero();
      window.requestAnimationFrame(resetToHero);
    });
    const finalReset = window.setTimeout(() => {
      resetToHero();
      window.history.scrollRestoration = previousRestoration;
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    }, 400);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.clearTimeout(finalReset);
      window.history.scrollRestoration = previousRestoration;
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    };
  }, []);

  const toggleLanguage = () => {
    const nextLanguage: Language = language === "en" ? "ar" : "en";
    setLanguage(nextLanguage);
    window.localStorage.setItem("alexfisher-language", nextLanguage);
  };

  useEffect(() => {
    const controller = new AbortController();
    async function loadConditions() {
      setLoading(true);
      try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${spot.lat}&longitude=${spot.lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,wind_speed_10m,wind_gusts_10m,wind_direction_10m,precipitation_probability,visibility&daily=sunrise,sunset&timezone=auto&forecast_days=7`;
        const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${spot.lat}&longitude=${spot.lon}&current=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_direction,swell_wave_period,sea_surface_temperature,ocean_current_velocity,ocean_current_direction,sea_level_height_msl&hourly=wave_height,wave_period,swell_wave_height,swell_wave_period,sea_surface_temperature,ocean_current_velocity,ocean_current_direction,sea_level_height_msl&timezone=auto&forecast_days=7`;
        const [weatherRes, marineRes] = await Promise.all([fetch(weatherUrl, { signal: controller.signal }), fetch(marineUrl, { signal: controller.signal })]);
        if (!weatherRes.ok || !marineRes.ok) throw new Error("Forecast unavailable");
        const weather = await weatherRes.json();
        const marine = await marineRes.json();
        const dates: string[] = weather.daily.time.slice(0, 7);
        setUtcOffsetSeconds(weather.utc_offset_seconds ?? 3 * 60 * 60);
        const days = dates.map((date, day) => {
          const start = weather.hourly.time.findIndex((value: string) => value.slice(0, 10) === date);
          const hours = Array.from({ length: 24 }, (_, offset) => {
            const index = Math.max(0, start) + offset;
            return {
              time: shortTime(weather.hourly.time[index]), air: weather.hourly.temperature_2m[index] ?? 0, wind: weather.hourly.wind_speed_10m[index] ?? 0,
              gust: weather.hourly.wind_gusts_10m[index] ?? 0, windDirection: weather.hourly.wind_direction_10m[index] ?? 0,
              wave: marine.hourly.wave_height[index] ?? 0, wavePeriod: marine.hourly.wave_period[index] ?? 0,
              swell: marine.hourly.swell_wave_height[index] ?? 0, swellPeriod: marine.hourly.swell_wave_period[index] ?? 0,
              tide: marine.hourly.sea_level_height_msl[index] ?? 0, sea: marine.hourly.sea_surface_temperature[index] ?? 0,
              current: marine.hourly.ocean_current_velocity[index] ?? 0, currentDirection: marine.hourly.ocean_current_direction[index] ?? 0,
              rain: weather.hourly.precipitation_probability[index] ?? 0, visibility: (weather.hourly.visibility[index] ?? 0) / 1000,
            };
          });
          const highTides = tideExtremes(hours, "high");
          const lowTides = tideExtremes(hours, "low");
          const first = hours[0];
          return {
            air: weather.hourly.temperature_2m[Math.max(0, start) + 12] ?? weather.current.temperature_2m ?? 0,
            wind: first.wind, gust: first.gust, windDirection: first.windDirection,
            wave: first.wave, waveDirection: marine.current.wave_direction ?? 0, wavePeriod: first.wavePeriod,
            swell: first.swell, swellDirection: marine.current.swell_wave_direction ?? 0, swellPeriod: first.swellPeriod,
            sea: first.sea, current: first.current, currentDirection: first.currentDirection, tide: first.tide,
            tideState: (hours[1].tide >= first.tide ? "rising" : "falling") as "rising" | "falling",
            highTide: highTides[0]?.time ?? "—", lowTide: lowTides[0]?.time ?? "—", highTides, lowTides,
            sunrise: shortTime(weather.daily.sunrise?.[day]), sunset: shortTime(weather.daily.sunset?.[day]), hourly: hours,
          };
        });
        setForecastDates(dates);
        setForecastDays(days);
        setLastUpdated(new Date());
        setDataStatus("live");
      } catch (error) {
        if ((error as Error).name !== "AbortError") { setForecastDays(fallbackDays); setDataStatus("sample"); }
      } finally { setLoading(false); }
    }
    loadConditions();
    const refreshInterval = window.setInterval(loadConditions, 15 * 60 * 1000);
    return () => { window.clearInterval(refreshInterval); controller.abort(); };
  }, [spot.lat, spot.lon, refreshRequest]);

  useEffect(() => {
    const syncClock = () => setClockNow(Date.now());
    const handleVisibility = () => { if (document.visibilityState === "visible") syncClock(); };
    const clock = window.setInterval(syncClock, 30 * 1000);
    window.addEventListener("focus", syncClock);
    window.addEventListener("pageshow", syncClock);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearInterval(clock);
      window.removeEventListener("focus", syncClock);
      window.removeEventListener("pageshow", syncClock);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const selected = conditions.hourly[selectedHour] ?? conditions.hourly[0];
  const selectedConditions = useMemo(() => ({
    ...conditions, air: selected.air, wind: selected.wind, gust: selected.gust, windDirection: selected.windDirection,
    wave: selected.wave, wavePeriod: selected.wavePeriod, swell: selected.swell, swellPeriod: selected.swellPeriod,
    tide: selected.tide, sea: selected.sea, current: selected.current, currentDirection: selected.currentDirection,
    tideState: ((conditions.hourly[Math.min(23, selectedHour + 1)]?.tide ?? selected.tide) >= selected.tide ? "rising" : "falling") as "rising" | "falling",
  }), [conditions, selected, selectedHour]);
  useEffect(() => {
    window.localStorage.setItem("alexfisher-current-conditions", JSON.stringify({
      country: country.en,
      city: city.en,
      spot: spot.en,
      wind: selectedConditions.wind,
      gust: selectedConditions.gust,
      tideState: selectedConditions.tideState,
      tide: selectedConditions.tide,
      updatedAt: lastUpdated?.toISOString() ?? new Date().toISOString(),
    }));
  }, [country.en, city.en, spot.en, selectedConditions.wind, selectedConditions.gust, selectedConditions.tideState, selectedConditions.tide, lastUpdated]);
  const score = useMemo(() => calculateScore(selectedConditions, activity), [selectedConditions, activity]);
  const fishingRating = fishingActivityLabel(score, rtl);
  const rating = activity === "fishing" ? fishingRating : score >= 72 ? t.good : score >= 48 ? t.caution : t.difficult;
  const scoreClass = activity === "fishing" ? (score >= 65 ? "score-good" : score >= 42 ? "score-caution" : "score-poor") : score >= 72 ? "score-good" : score >= 48 ? "score-caution" : "score-poor";
  const mascotMood = activity === "fishing" ? (score >= 65 ? "happy" : score >= 42 ? "neutral" : "sad") : score >= 72 ? "happy" : score >= 48 ? "neutral" : "sad";
  const scoreTitle = rtl
    ? activity === "fishing" ? "تقييم نشاط الصيد" : activity === "surfing" ? "تقييم جودة السيرف" : "تقييم أمان الكاياك"
    : `${t.activities[activity]} ${t.score}`;
  const moon = moonCondition(forecastDates[selectedDay], rtl);
  const bestHour = conditions.hourly.reduce((best, hour, index) => {
    const hourScore = calculateScore({ ...conditions, ...hour, tideState: (conditions.hourly[Math.min(23, index + 1)]?.tide ?? hour.tide) >= hour.tide ? "rising" : "falling" }, activity);
    return hourScore > best.score ? { index, score: hourScore } : best;
  }, { index: 0, score: -1 });
  const fishingActivityByHour = conditions.hourly.map((hour, index) => calculateScore({ ...conditions, ...hour, tideState: (conditions.hourly[Math.min(23, index + 1)]?.tide ?? hour.tide) >= hour.tide ? "rising" : "falling" }, "fishing"));
  const surfingActivityByHour = conditions.hourly.map((hour, index) => calculateScore({ ...conditions, ...hour, tideState: (conditions.hourly[Math.min(23, index + 1)]?.tide ?? hour.tide) >= hour.tide ? "rising" : "falling" }, "surfing"));
  const kayakingActivityByHour = conditions.hourly.map((hour, index) => calculateScore({ ...conditions, ...hour, tideState: (conditions.hourly[Math.min(23, index + 1)]?.tide ?? hour.tide) >= hour.tide ? "rising" : "falling" }, "kayaking"));
  const weeklyData = useMemo(() => forecastDays.map((day) => {
    const scoredHours = day.hourly.map((hour, index) => ({
      index,
      score: calculateScore({ ...day, ...hour, tideState: (day.hourly[Math.min(23, index + 1)]?.tide ?? hour.tide) >= hour.tide ? "rising" : "falling" }, activity),
    }));
    const best = scoredHours.reduce((winner, candidate) => candidate.score > winner.score ? candidate : winner, scoredHours[0] ?? { index: 0, score: 0 });
    const hour = day.hourly[selectedHour] ?? day.hourly[0];
    const tideState = ((day.hourly[Math.min(23, selectedHour + 1)]?.tide ?? hour.tide) >= hour.tide ? "rising" : "falling") as "rising" | "falling";
    const representative = { ...hour, tideState };
    const tides = day.hourly.map((hour) => hour.tide);
    return {
      score: calculateScore({ ...day, ...representative }, activity),
      bestHour: best.index,
      representative,
      tideRange: Math.max(...tides) - Math.min(...tides),
      wind: representative.wind,
      gust: representative.gust,
      wave: representative.wave,
      swell: representative.swell,
      swellPeriod: representative.swellPeriod,
      current: representative.current,
    };
  }), [forecastDays, activity, selectedHour]);
  const selectedWeek = weeklyData[selectedDay] ?? weeklyData[0];
  const weekLabels = forecastDates.map((date) => ({
    primary: new Date(`${date}T12:00:00`).toLocaleDateString(rtl ? arabicLatinLocale : "en-GB", { weekday: "short" }),
    secondary: new Date(`${date}T12:00:00`).toLocaleDateString(rtl ? arabicLatinLocale : "en-GB", { day: "numeric", month: "short" }),
  }));
  const selectedWeekDayLabel = new Date(`${forecastDates[selectedDay]}T12:00:00`).toLocaleDateString(rtl ? arabicLatinLocale : "en-GB", { weekday: "short", day: "numeric", month: "short" });
  const selectedWeekTime = formatTime12(selected.time);
  const selectedWeekLabel = selectedWeekTime;
  const selectWeekDay = (index: number) => {
    setSelectedDay(index);
  };
  const setHourFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = event.currentTarget.getBoundingClientRect();
    const position = Math.max(0, Math.min(track.height, event.clientY - track.top));
    setSelectedHour(Math.round((position / track.height) * 23));
  };
  const startHourDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setHourFromPointer(event);
  };
  const moveHourDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) setHourFromPointer(event);
  };
  const handleHourKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowUp") { event.preventDefault(); setSelectedHour((hour) => Math.max(0, hour - 1)); }
    if (event.key === "ArrowDown") { event.preventDefault(); setSelectedHour((hour) => Math.min(23, hour + 1)); }
    if (event.key === "Home") { event.preventDefault(); setSelectedHour(0); }
    if (event.key === "End") { event.preventDefault(); setSelectedHour(23); }
  };
  const localNow = new Date(clockNow + utcOffsetSeconds * 1000);
  const currentDecimalHour = localNow.getUTCHours() + localNow.getUTCMinutes() / 60;
  const currentTime = formatTime12(`${String(localNow.getUTCHours()).padStart(2, "0")}:${String(localNow.getUTCMinutes()).padStart(2, "0")}`);
  const liveNowHour = currentDecimalHour;
  const currentDirectionMetric: Metric = { label: rtl ? "التيار" : "Current", value: `${selected.current.toFixed(1)} km/h`, sub: `${compass(selected.currentDirection, rtl)} · ${rtl ? "اتجاه التيار" : "current direction"}`, icon: Navigation, iconRotation:(selected.currentDirection + 135) % 360 };
  const waterTemperatureMetric: Metric = { label: rtl ? "درجة حرارة المياه" : "Water temperature", value: `${selected.sea.toFixed(1)}°C`, sub: rtl ? "حرارة سطح البحر" : "Sea-surface temperature", icon: Thermometer };
  const airTemperatureMetric: Metric = { label: rtl ? "درجة حرارة الهواء" : "Air temperature", value: `${selected.air.toFixed(1)}°C`, sub: rtl ? `الساعة ${formatTime12(selected.time)}` : `At ${formatTime12(selected.time)}`, icon: Thermometer };
  const rainMetric = { label: rtl ? "احتمال المطر" : "Rain chance", value: `${selected.rain.toFixed(0)}%`, sub: rtl ? "خلال الساعة المختارة" : "During the selected hour", icon: CloudRain };
  const windMetric: Metric = { label: rtl ? "الرياح" : "Wind", value: `${selected.wind.toFixed(0)} km/h`, sub: `${compass(selected.windDirection, rtl)} · ${selected.gust.toFixed(0)} ${rtl ? "هبات" : "gust"}`, icon: Navigation, emphasis:"wind", iconRotation:(selected.windDirection + 135) % 360 };
  const waveMetric: Metric = { label: rtl ? "ارتفاع الموج" : "Wave height", value: `${selected.wave.toFixed(1)} m`, sub: `${selected.wavePeriod.toFixed(1)}s ${rtl ? "فترة الموج" : "period"}`, icon: Waves, emphasis:"wave" };
  const activityMetrics: Metric[] = [
    windMetric,
    waveMetric,
    { label: rtl ? "المد والجزر" : "Tide", value: selectedConditions.tideState === "rising" ? t.rising : t.falling, sub: `H ${formatTime12(conditions.highTide)} · L ${formatTime12(conditions.lowTide)}`, icon: ArrowUp, iconRotation:selectedConditions.tideState === "rising" ? 0 : 180 },
    currentDirectionMetric,
    waterTemperatureMetric,
    airTemperatureMetric,
    rainMetric,
  ];
  const bestWindowStart = Math.max(0, bestHour.index - 1);
  const bestWindowEnd = Math.min(23, bestHour.index + 1);
  const bestWindow = `${formatTime12(conditions.hourly[bestWindowStart]?.time)}–${formatTime12(conditions.hourly[bestWindowEnd]?.time)}`;
  const insightDay = selectedDay === 0 ? (rtl ? "اليوم" : "Today") : selectedWeekDayLabel;
  const highWind = selected.wind > 15;
  const activityInsight = activity === "fishing"
    ? highWind
      ? (rtl ? `${insightDay} قد يكون صعباً للصيد من الصخور المكشوفة أو للرميات الطويلة؛ سرعة الرياح ${selected.wind.toFixed(0)} كم/س والهبات تصل إلى ${selected.gust.toFixed(0)} كم/س. الفترة الأهدأ المتاحة من ${bestWindow}.` : `${insightDay} may be difficult for exposed rock fishing or long casting: wind is ${selected.wind.toFixed(0)} km/h with gusts up to ${selected.gust.toFixed(0)} km/h. The calmer available window is ${bestWindow}.`)
      : mascotMood === "happy"
      ? (rtl ? `${insightDay} مناسب للصيد. أفضل فترة من ${bestWindow} حيث تكون الرياح والأمواج أكثر ملاءمة.` : `${insightDay} looks good for fishing. The best window is ${bestWindow}, when wind and waves are more manageable.`)
      : mascotMood === "neutral"
        ? (rtl ? `${insightDay} مناسب للصيد بحذر. جرّب الفترة من ${bestWindow} وراقب تغيّر الرياح وارتفاع الموج.` : `${insightDay} is workable for fishing with caution. Try ${bestWindow} and watch for changes in wind and wave height.`)
        : (rtl ? `${insightDay} غير مثالي للصيد. أفضل فترة متاحة من ${bestWindow}، وقد تظل الأماكن المكشوفة صعبة.` : `${insightDay} is not ideal for fishing. The best available window is ${bestWindow}, although exposed spots may remain difficult.`)
    : activity === "surfing"
      ? highWind
        ? (rtl ? `الرياح مرتفعة ${selected.wind.toFixed(0)} كم/س وقد تجعل التحكم وجودة الموج أصعب. الفترة الأفضل للسيرف من ${bestWindow}.` : `Wind is high at ${selected.wind.toFixed(0)} km/h and may make board control and wave quality more difficult. The better surfing window is ${bestWindow}.`)
        : mascotMood === "happy"
        ? (rtl ? `${insightDay} مناسب للسيرف. أفضل فترة من ${bestWindow} مع سويل ${selected.swell.toFixed(1)} متر وفترة ${selected.swellPeriod.toFixed(1)} ثانية.` : `${insightDay} looks good for surfing. The best window is ${bestWindow}, with ${selected.swell.toFixed(1)} m swell at ${selected.swellPeriod.toFixed(1)} seconds.`)
        : mascotMood === "neutral"
          ? (rtl ? `${insightDay} مناسب للسيرف بحذر. جودة الموج قد تتغير؛ جرّب الفترة من ${bestWindow}.` : `${insightDay} is workable for surfing, but wave quality may vary. Try the ${bestWindow} window.`)
          : (rtl ? `${insightDay} غير مثالي للسيرف بسبب ضعف السويل أو ظروف الرياح. أفضل فرصة متاحة من ${bestWindow}.` : `${insightDay} is not ideal for surfing because of limited swell or wind conditions. The best available chance is ${bestWindow}.`)
      : highWind
        ? (rtl ? `الرياح مرتفعة ${selected.wind.toFixed(0)} كم/س والهبات تصل إلى ${selected.gust.toFixed(0)} كم/س؛ الكاياك غير مناسب للمبتدئين في هذه الفترة. الفترة الأهدأ المتاحة من ${bestWindow}.` : `Wind is high at ${selected.wind.toFixed(0)} km/h with gusts up to ${selected.gust.toFixed(0)} km/h; kayaking is not recommended for beginners at this time. The calmer available window is ${bestWindow}.`)
        : mascotMood === "happy"
        ? (rtl ? `${insightDay} مناسب للكاياك. أفضل فترة من ${bestWindow} مع رياح وموج وتيار أكثر هدوءاً.` : `${insightDay} looks good for kayaking. The best window is ${bestWindow}, with more manageable wind, waves and current.`)
        : mascotMood === "neutral"
          ? (rtl ? `${insightDay} يحتاج إلى الحذر للكاياك. الفترة الأفضل من ${bestWindow}؛ راقب الرياح والهبات والتيار قبل النزول.` : `${insightDay} requires caution for kayaking. The better window is ${bestWindow}; check wind, gusts and current before launching.`)
          : (rtl ? `${insightDay} غير مناسب للكاياك، خاصة للمبتدئين. راجع الفترة من ${bestWindow} أو اختر يوماً أهدأ.` : `${insightDay} is not recommended for kayaking, especially for beginners. Check the ${bestWindow} window or choose a calmer day.`);

  return (
    <main dir={rtl ? "rtl" : "ltr"} className={`site-shell ${rtl ? "font-arabic" : ""}`}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="AlexFisher home"><span className="brand-mark"><Waves size={22} /></span><span>ALEX<strong>FISHER</strong><small>SEA CONDITIONS</small></span></a>
        <nav aria-label="Main navigation">{t.nav.map((item, index) => <a key={item} href={index === 1 ? "/fishing-hub" : index === 2 ? "/learning" : index === 3 ? "/community" : index === 4 ? "/shop" : "#conditions"}>{item}</a>)}</nav>
        <div className="header-actions">
          <Sheet>
            <SheetTrigger asChild><button className="mobile-menu-button" aria-label={rtl ? "افتح قائمة الاستكشاف" : "Open explore menu"}><span className="explore-wave-mark" aria-hidden="true"><Waves size={18} /></span><span>{rtl ? "استكشف" : "Explore"}</span></button></SheetTrigger>
            <SheetContent side={rtl ? "right" : "left"} dir={rtl ? "rtl" : "ltr"} className="mobile-nav-sheet">
              <SheetHeader className="mobile-nav-header">
                <span className="brand-mark"><Waves size={22} /></span>
                <SheetTitle>{rtl ? "استكشف AlexFisher" : "Explore AlexFisher"}</SheetTitle>
                <SheetDescription>{rtl ? "اختر القسم الذي تريد الذهاب إليه." : "Choose where you want to go."}</SheetDescription>
              </SheetHeader>
              <nav className="mobile-nav-links" aria-label={rtl ? "التنقل الرئيسي" : "Main navigation"}>
                {t.nav.map((item, index) => <SheetClose asChild key={item}><a href={index === 1 ? "/fishing-hub" : index === 2 ? "/learning" : index === 3 ? "/community" : index === 4 ? "/shop" : "#conditions"}><span>{String(index + 1).padStart(2, "0")}</span>{item}<ChevronRight size={18} className={rtl ? "flip" : ""} /></a></SheetClose>)}
              </nav>
            </SheetContent>
          </Sheet>
          <button className="icon-button" aria-label="Notifications"><Bell size={18} /></button>
          <button className="language-button" onClick={toggleLanguage}><Languages size={17} /> {language === "en" ? "العربية" : "EN"}</button>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="hero-copy"><p className="eyebrow"><span /> {t.eyebrow}</p><h1>{t.titleA}<br /><em>{t.titleB}</em></h1><p className="hero-subtitle">{t.subtitle}</p></div>
        <div className="location-panel">
          <label htmlFor="country"><MapPin size={18} /> {t.where}</label>
          <div className="location-pickers">
            <div className="location-country"><small>{t.country}</small><div className="location-select-wrap"><MapPin size={19} /><select id="country" value={countryId} onChange={(event) => { const nextCountry = coastalCountries.find((item) => item.id === event.target.value) ?? coastalCountries[0]; const nextCity = nextCountry.cities[0]; setCountryId(nextCountry.id); setCityId(nextCity.id); setSpotId(nextCity.spots[0].id); setSelectedDay(0); }}><option value="" disabled>{t.country}</option>{coastalCountries.map((item) => <option key={item.id} value={item.id}>{rtl ? item.ar : item.en}</option>)}</select><ChevronRight size={19} className={rtl ? "flip" : ""} /></div></div>
            <div><small>{t.city}</small><div className="location-select-wrap"><Search size={19} /><select id="city" value={cityId} onChange={(event) => { const nextCity = coastalCities.find((item) => item.id === event.target.value) ?? coastalCities[0]; setCityId(nextCity.id); setSpotId(nextCity.spots[0].id); setSelectedDay(0); }}><option value="" disabled>{t.city}</option>{coastalCities.map((item) => <option key={item.id} value={item.id}>{rtl ? item.ar : item.en}</option>)}</select><ChevronRight size={19} className={rtl ? "flip" : ""} /></div></div>
            <div><small>{t.spot}</small><div className="location-select-wrap"><Navigation size={19} /><select id="spot" value={spotId} onChange={(event) => { setSpotId(event.target.value); setSelectedDay(0); }}>{citySpots.map((item) => <option key={item.id} value={item.id}>{rtl ? item.ar : item.en}</option>)}</select><ChevronRight size={19} className={rtl ? "flip" : ""} /></div></div>
          </div>
          <div className="live-status-row"><p><span className={dataStatus === "live" ? "live-dot" : "sample-dot"} /> {dataStatus === "live" ? `${t.live} · ${t.updated} ${lastUpdated?.toLocaleTimeString(rtl ? arabicLatinLocale : "en-GB", { hour: "2-digit", minute: "2-digit" }) ?? (rtl ? "الآن" : "now")}` : (rtl ? "بيانات تجريبية" : "Preview data")}</p><button type="button" className="refresh-button" disabled={loading} onClick={() => setRefreshRequest((value) => value + 1)} aria-label={rtl ? "تحديث التوقعات الآن" : "Refresh forecast now"} title={rtl ? "تحديث الآن" : "Refresh now"}><RefreshCw size={14} className={loading ? "is-spinning" : ""}/><span>{rtl ? "تحديث" : "Refresh"}</span></button></div>
        </div>
      </section>

      <section id="conditions" className="dashboard-wrap">
        <Tabs value={activity} onValueChange={(value) => setActivity(value as Activity)} className="activity-tabs"><TabsList><TabsTrigger value="fishing"><Fish size={19} /> {t.activities.fishing}</TabsTrigger><TabsTrigger value="surfing"><Waves size={19} /> {t.activities.surfing}</TabsTrigger><TabsTrigger value="kayaking"><ShipWheel size={19} /> {t.activities.kayaking}</TabsTrigger></TabsList></Tabs>
        <div className="dashboard-control-frame">
          <div className="week-axis-control">
            <div><small>{rtl ? "الأسبوع" : "Week"}</small><strong>{selectedWeekDayLabel}</strong></div>
            <div className="axis-range-row"><span>{weekLabels[0]?.primary}</span><input dir="ltr" aria-label={rtl ? "اختر يوماً من الأسبوع" : "Select day of the week"} type="range" min="0" max="6" step="1" value={selectedDay} onChange={(event) => selectWeekDay(Number(event.target.value))} /><span>{weekLabels[6]?.primary}</span></div>
          </div>
          <aside className="time-axis-control" aria-label={rtl ? "التحكم في وقت اليوم" : "Time-of-day control"}>
            <small>{rtl ? "الوقت" : "Time"}</small><span>12 AM</span>
            <div className="time-range-shell" role="slider" tabIndex={0} aria-label={rtl ? "اختر ساعة اليوم" : "Select hour of the day"} aria-valuemin={0} aria-valuemax={23} aria-valuenow={selectedHour} aria-valuetext={formatTime12(selected.time)} onPointerDown={startHourDrag} onPointerMove={moveHourDrag} onKeyDown={handleHourKey} style={{ "--time-position": `${(selectedHour / 23) * 100}%` } as React.CSSProperties}>
              <output aria-hidden="true">{formatTime12(selected.time)}</output>
            </div>
            <span>11 PM</span>
          </aside>
          <div className={`condition-board ${loading ? "is-loading" : ""}`}>
          <article className="score-card">
            <div className="score-head">
              <span>{scoreTitle}</span>
              <b className="score-day">{new Date(`${forecastDates[selectedDay]}T12:00:00`).toLocaleDateString(rtl ? arabicLatinLocale : "en-GB", { weekday: "short" })}</b>
            </div>
            <div className={`activity-mascot mascot-${activity} mascot-${mascotMood}`} role="img" aria-label={`${t.activities[activity]} — ${rating}`} />
            <div className={`score-ring ${scoreClass}`} style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}><div dir="ltr"><strong>{score}</strong><span>/100</span></div></div>
            <h2>{rating}</h2><p>{t.bestAt}</p><strong className="best-time">{formatTime12(conditions.hourly[bestHour.index]?.time ?? selected.time)}</strong>
            <div className="moon-condition"><span className="moon-icon" aria-hidden="true">{moon.emoji}</span><div><small>{rtl ? "حالة القمر" : "Moon condition"}</small><strong>{moon.name}</strong><em>{moon.illumination}% {rtl ? "إضاءة" : "illuminated"}</em></div></div>
            <div className="sun-times">
              <span className="sun-time-item"><span className="sun-time-value"><Sunrise size={16} /> {conditions.sunrise}</span><small>{rtl ? "الشروق" : "Sunrise"}</small></span>
              <span className="sun-time-item"><span className="sun-time-value">{conditions.sunset} <ArrowUpRight size={16} /></span><small>{rtl ? "الغروب" : "Sunset"}</small></span>
            </div>
          </article>
          <div className="metrics-grid">
            {activityMetrics.map((metric) => { const Icon = metric.icon; const metricArrow = metric.direction === undefined ? 0 : (metric.direction + (metric.directionFrom ? 180 : 0)) % 360; return <article className={`metric-card ${metric.emphasis ? `metric-emphasis metric-${metric.emphasis}` : ""}`} key={metric.label}><div className="metric-icon"><Icon size={20} style={metric.iconRotation === undefined ? undefined : { transform:`rotate(${metric.iconRotation}deg)` }} /></div><div><p>{metric.label}</p><div className="metric-value"><strong>{metric.value}</strong>{metric.direction !== undefined && <u aria-hidden="true" style={{ transform:`rotate(${metricArrow}deg)` }}>↑</u>}</div><span>{metric.sub}</span></div></article>; })}
          </div>
          </div>
        </div>
        <article className="insight-card dashboard-insight"><div><Sparkles size={20} /></div><div><p>{t.insight}</p><strong>{activityInsight}</strong><span className="insight-plan">{rtl ? "اضغط على أحد الخيارين لتحديد أنسب وقت قبل النزول." : "Tap an option below to choose the right time before you go."}</span><div className="insight-actions"><a className="insight-cta primary" href="#plan-your-day"><span><b>{rtl ? "خطط ليومك" : "Plan your day"}</b><small>{rtl ? "قارن الظروف ساعة بساعة" : "Compare conditions hour by hour"}</small></span><ChevronRight size={17} className={rtl ? "flip" : ""} /></a><a className="insight-cta" href="#plan-your-week"><span><b>{rtl ? "خطط لأسبوعك" : "Plan your week"}</b><small>{rtl ? "اختر أفضل يوم خلال 7 أيام" : "Choose the best of the next 7 days"}</small></span><ChevronRight size={17} className={rtl ? "flip" : ""} /></a></div></div></article>
        <div className="forecast-explorer" id="plan-your-day">
          <div className="section-title forecast-title"><div><p>{rtl ? spot.ar : spot.en} · {new Date(`${forecastDates[selectedDay]}T12:00:00`).toLocaleDateString(rtl ? arabicLatinLocale : "en-GB", { weekday: "long", day: "numeric", month: "long" })}</p><h2>{t.hourly}</h2><span>{t.drag}</span></div><div className="selected-time"><small>{t.selected}</small><strong>{formatTime12(selected.time)}</strong></div></div>
          <div className="time-scrubber"><span>12 AM</span><input dir="ltr" aria-label={rtl ? "اختر ساعة اليوم لكل الرسوم" : "Select an hour for all daily charts"} type="range" min="0" max="23" step="1" value={selectedHour} onChange={(event) => setSelectedHour(Number(event.target.value))}/><span>11 PM</span></div>
          {activity === "fishing" && <>
            <div className="chart-grid">
              <ForecastChart title={rtl ? "ارتفاع الموج اليومي" : "Daily Wave Height"} icon={Waves} unit="m" values={conditions.hourly.map((hour) => hour.wave)} headingDetail={`${selected.wavePeriod.toFixed(1)}s ${rtl ? "فترة الموج" : "period"}`} selectedHour={selectedHour} onSelect={setSelectedHour} accent="blue" nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "ارتفاع الموج" : "Wave height"}<strong>{selected.wave.toFixed(1)} m</strong></span><span>{rtl ? "فترة الموج" : "Wave period"}<strong>{selected.wavePeriod.toFixed(1)} s</strong></span></div></ForecastChart>
              <ForecastChart title={rtl ? "الرياح اليومية" : "Daily Wind"} icon={Wind} unit="km/h" values={conditions.hourly.map((hour) => hour.wind)} secondary={conditions.hourly.map((hour) => hour.gust)} secondaryLabel={rtl ? "هبات" : "Gusts"} selectedHour={selectedHour} onSelect={setSelectedHour} accent="coral" direction={selected.windDirection} directionFrom nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "اتجاه الرياح" : "Wind direction"}<strong>{compass(selected.windDirection, rtl)}</strong></span><span>{rtl ? "أفضل نشاط" : "Best activity"}<strong>{formatTime12(conditions.hourly[bestHour.index]?.time)}</strong></span></div></ForecastChart>
              <ForecastChart className="chart-span-full" title={rtl ? "المد والجزر اليومي" : "Daily Tide"} icon={Waves} unit="m" values={conditions.hourly.map((hour) => hour.tide)} headingDetail={selectedConditions.tideState === "rising" ? t.rising : t.falling} currentDirection={selected.currentDirection} currentSpeed={selected.current} selectedHour={selectedHour} onSelect={setSelectedHour} accent="blue" tideDetails={{ fishingActivity: fishingActivityByHour[selectedHour] ?? 0, wind: selected.wind, windDirection: selected.windDirection, wave: selected.wave, current: selected.current, currentDirection: selected.currentDirection }} nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}>
                <div className="chart-facts tide-facts"><span>{rtl ? "المد العالي" : "High tides"}<strong className="tide-event-list">{conditions.highTides.map((event) => <small key={event.time}>{event.height.toFixed(2)} m · {formatTime12(event.time)}</small>)}</strong></span><span>{rtl ? "الجزر" : "Low tides"}<strong className="tide-event-list">{conditions.lowTides.map((event) => <small key={event.time}>{event.height.toFixed(2)} m · {formatTime12(event.time)}</small>)}</strong></span><span>{selectedConditions.tideState === "rising" ? t.rising : t.falling}<strong>{selected.tide.toFixed(2)} m</strong></span></div>
              </ForecastChart>
              <ForecastChart className="chart-span-full" title={rtl ? "نشاط الصيد اليومي" : "Daily Fishing Activity"} icon={Fish} unit="/100" values={fishingActivityByHour} selectedHour={selectedHour} onSelect={setSelectedHour} accent="cyan" decimals={0} nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "النشاط الآن" : "Current activity"}<strong>{fishingActivityLabel(fishingActivityByHour[selectedHour] ?? 0, rtl)}</strong></span><span>{rtl ? "أفضل وقت" : "Best time"}<strong>{formatTime12(conditions.hourly[bestHour.index]?.time)}</strong></span></div></ForecastChart>
            </div>
          </>}
          {activity === "surfing" && <>
            <ForecastChart className="chart-span-full" title={rtl ? "تقييم السيرف اليومي" : "Daily Surfing Activity"} icon={Waves} unit="/100" values={surfingActivityByHour} selectedHour={selectedHour} onSelect={setSelectedHour} accent="cyan" decimals={0} nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "النشاط الآن" : "Current conditions"}<strong>{(surfingActivityByHour[selectedHour] ?? 0) >= 72 ? t.good : (surfingActivityByHour[selectedHour] ?? 0) >= 48 ? t.caution : t.difficult}</strong></span><span>{rtl ? "أفضل سيرف" : "Best time"}<strong>{formatTime12(conditions.hourly[bestHour.index]?.time)}</strong></span></div></ForecastChart>
            <ForecastChart title={rtl ? "الأمواج والسويل اليومي" : "Daily Waves & Swell"} icon={Waves} unit="m" values={conditions.hourly.map((hour) => hour.wave)} secondary={conditions.hourly.map((hour) => hour.swell)} secondaryLabel={rtl ? "السويل" : "Swell"} headingDetail={`${selected.swellPeriod.toFixed(1)}s ${rtl ? "فترة السويل" : "swell period"}`} selectedHour={selectedHour} onSelect={setSelectedHour} accent="cyan" nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts"><span>{rtl ? "فترة السويل" : "Swell period"}<strong>{selected.swellPeriod.toFixed(1)}s</strong></span><span>{rtl ? "مرحلة المد" : "Tide stage"}<strong>{selectedConditions.tideState === "rising" ? t.rising : t.falling}</strong></span><span>{rtl ? "أفضل سيرف" : "Best surf"}<strong>{formatTime12(conditions.hourly[bestHour.index]?.time)}</strong></span></div></ForecastChart>
            <div className="chart-grid">
              <ForecastChart title={rtl ? "فترة السويل اليومية" : "Daily Swell Period"} icon={Gauge} unit="s" values={conditions.hourly.map((hour) => hour.swellPeriod)} headingDetail={compass(conditions.swellDirection, rtl)} selectedHour={selectedHour} onSelect={setSelectedHour} accent="blue" nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "الاتجاه" : "Direction"}<strong>{compass(conditions.swellDirection, rtl)}</strong></span><span>{rtl ? "حرارة البحر" : "Sea temp"}<strong>{selected.sea.toFixed(1)}°C</strong></span></div></ForecastChart>
              <ForecastChart title={rtl ? "الرياح اليومية" : "Daily Wind"} icon={Wind} unit="km/h" values={conditions.hourly.map((hour) => hour.wind)} secondary={conditions.hourly.map((hour) => hour.gust)} secondaryLabel={rtl ? "هبات" : "Gusts"} selectedHour={selectedHour} onSelect={setSelectedHour} accent="coral" direction={selected.windDirection} directionFrom nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "اتجاه الرياح" : "Wind direction"}<strong>{compass(selected.windDirection, rtl)}</strong></span><span>{rtl ? "السرعة" : "Speed"}<strong>{selected.wind.toFixed(0)} km/h</strong></span></div></ForecastChart>
            </div>
          </>}
          {activity === "kayaking" && <>
            <ForecastChart className="chart-span-full" title={rtl ? "تقييم الكاياك اليومي" : "Daily Kayaking Activity"} icon={ShipWheel} unit="/100" values={kayakingActivityByHour} selectedHour={selectedHour} onSelect={setSelectedHour} accent="cyan" decimals={0} nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "النشاط الآن" : "Current conditions"}<strong>{(kayakingActivityByHour[selectedHour] ?? 0) >= 72 ? t.good : (kayakingActivityByHour[selectedHour] ?? 0) >= 48 ? t.caution : t.difficult}</strong></span><span>{rtl ? "أفضل وقت آمن" : "Best time"}<strong>{formatTime12(conditions.hourly[bestHour.index]?.time)}</strong></span></div></ForecastChart>
            <ForecastChart title={rtl ? "الرياح اليومية" : "Daily Wind"} icon={Wind} unit="km/h" values={conditions.hourly.map((hour) => hour.wind)} secondary={conditions.hourly.map((hour) => hour.gust)} secondaryLabel={rtl ? "هبات" : "Gusts"} selectedHour={selectedHour} onSelect={setSelectedHour} accent="coral" direction={selected.windDirection} directionFrom nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts"><span>{rtl ? "اتجاه الرياح" : "Wind direction"}<strong>{compass(selected.windDirection, rtl)}</strong></span><span>{rtl ? "احتمال المطر" : "Rain chance"}<strong>{selected.rain.toFixed(0)}%</strong></span><span>{rtl ? "أفضل وقت آمن" : "Safest window"}<strong>{formatTime12(conditions.hourly[bestHour.index]?.time)}</strong></span></div></ForecastChart>
            <div className="chart-grid">
              <ForecastChart title={rtl ? "ارتفاع الموج اليومي" : "Daily Wave Height"} icon={Waves} unit="m" values={conditions.hourly.map((hour) => hour.wave)} headingDetail={`${selected.wavePeriod.toFixed(1)}s ${rtl ? "فترة الموج" : "period"}`} selectedHour={selectedHour} onSelect={setSelectedHour} accent="cyan" nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "فترة الموج" : "Wave period"}<strong>{selected.wavePeriod.toFixed(1)}s</strong></span><span>{rtl ? "الرؤية" : "Visibility"}<strong>{selected.visibility.toFixed(0)} km</strong></span></div></ForecastChart>
              <ForecastChart title={rtl ? "التيار اليومي" : "Daily Current"} icon={Navigation} unit="km/h" values={conditions.hourly.map((hour) => hour.current)} selectedHour={selectedHour} onSelect={setSelectedHour} accent="blue" direction={selected.currentDirection} directionFrom nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "اتجاه التيار" : "Current direction"}<strong>{compass(selected.currentDirection, rtl)}</strong></span><span>{rtl ? "درجة الصعوبة" : "Difficulty"}<strong>{score > 76 ? (rtl ? "سهل" : "Easy") : score > 50 ? (rtl ? "متوسط" : "Moderate") : (rtl ? "صعب" : "Difficult")}</strong></span></div></ForecastChart>
            </div>
          </>}
        </div>
        <div className="forecast-explorer weekly-explorer" id="plan-your-week">
          <div className="section-title forecast-title"><div><p>{rtl ? spot.ar : spot.en} · {rtl ? "توقعات 7 أيام" : "7-day forecast"}</p><h2>{rtl ? "خطط لأسبوعك" : "Plan your week"}</h2><span>{rtl ? "اختر اليوم، ويُطبّق الوقت المختار نفسه على كل الرسوم" : "Choose a day — the selected time is applied to every chart"}</span></div><div className="selected-time selected-day"><small>{rtl ? "اليوم المختار" : "Selected day"}</small><strong>{selectedWeekDayLabel}</strong></div></div>
          <div className="week-scrubber"><span>{weekLabels[0]?.primary}</span><input dir="ltr" aria-label={rtl ? "اختر يوماً لكل الرسوم الأسبوعية" : "Select a day for all weekly charts"} type="range" min="0" max="6" step="1" value={selectedDay} onChange={(event) => selectWeekDay(Number(event.target.value))}/><span>{weekLabels[6]?.primary}</span></div>
          {activity === "fishing" && <>
            <div className="chart-grid">
              <ForecastChart title={rtl ? "ارتفاع الموج الأسبوعي" : "Weekly Wave Height"} icon={Waves} unit="m" values={weeklyData.map((day) => day.wave)} headingDetail={`${selectedWeek.representative.wavePeriod.toFixed(1)}s ${rtl ? "فترة الموج" : "period"}`} selectedHour={selectedDay} onSelect={selectWeekDay} accent="blue" xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم الموج" : "Select wave forecast day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "الموج في الوقت المختار" : "Wave at selected time"}<strong>{selectedWeek.wave.toFixed(1)} m</strong></span><span>{rtl ? "فترة الموج" : "Wave period"}<strong>{selectedWeek.representative.wavePeriod.toFixed(1)} s</strong></span></div></ForecastChart>
              <ForecastChart title={rtl ? "الرياح الأسبوعية" : "Weekly Wind"} icon={Wind} unit="km/h" values={weeklyData.map((day) => day.wind)} secondary={weeklyData.map((day) => day.gust)} secondaryLabel={rtl ? "هبات" : "Gusts"} selectedHour={selectedDay} onSelect={selectWeekDay} accent="coral" direction={selectedWeek.representative.windDirection} directionFrom xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم الرياح" : "Select wind forecast day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "الرياح في الوقت المختار" : "Wind at selected time"}<strong>{selectedWeek.wind.toFixed(1)} km/h</strong></span><span>{rtl ? "الاتجاه" : "Direction"}<strong>{compass(selectedWeek.representative.windDirection, rtl)}</strong></span></div></ForecastChart>
              <ForecastChart className="chart-span-full" title={rtl ? "المد والجزر الأسبوعي" : "Weekly Tide"} icon={Waves} unit="m" values={weeklyData.map((day) => day.representative.tide)} headingDetail={selectedWeek.representative.tideState === "rising" ? t.rising : t.falling} currentDirection={selectedWeek.representative.currentDirection} currentSpeed={selectedWeek.representative.current} selectedHour={selectedDay} onSelect={selectWeekDay} accent="blue" tideDetails={{ fishingActivity: selectedWeek.score, wind: selectedWeek.representative.wind, windDirection: selectedWeek.representative.windDirection, wave: selectedWeek.representative.wave, current: selectedWeek.representative.current, currentDirection: selectedWeek.representative.currentDirection }} xLabels={weekLabels} selectedLabel={selectedWeekTime} rangeLabel={rtl ? "اختر يوم المد والجزر" : "Select tide forecast day"} rtl={rtl}>
                <div className="chart-facts compact"><span>{rtl ? "المد في الوقت المختار" : "Tide at selected time"}<strong>{selectedWeek.representative.tide.toFixed(2)} m</strong></span><span>{rtl ? "الوقت المختار" : "Selected time"}<strong>{selectedWeekTime}</strong></span></div>
              </ForecastChart>
              <ForecastChart className="chart-span-full" title={rtl ? "نشاط الصيد الأسبوعي" : "Weekly Fishing Activity"} icon={Fish} unit="/100" values={weeklyData.map((day) => day.score)} selectedHour={selectedDay} onSelect={selectWeekDay} accent="cyan" decimals={0} xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم نشاط الصيد" : "Select fishing activity day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "تقييم الوقت المختار" : "Selected-time rating"}<strong>{fishingActivityLabel(selectedWeek.score, rtl)}</strong></span><span>{rtl ? "الوقت المختار" : "Selected time"}<strong>{selectedWeekTime}</strong></span></div></ForecastChart>
            </div>
          </>}
          {activity === "surfing" && <>
            <ForecastChart className="chart-span-full" title={rtl ? "تقييم السيرف الأسبوعي" : "Weekly Surfing Activity"} icon={Waves} unit="/100" values={weeklyData.map((day) => day.score)} selectedHour={selectedDay} onSelect={selectWeekDay} accent="cyan" decimals={0} xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم تقييم السيرف" : "Select surfing activity day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "تقييم الوقت المختار" : "Selected-time rating"}<strong>{selectedWeek.score >= 72 ? t.good : selectedWeek.score >= 48 ? t.caution : t.difficult}</strong></span><span>{rtl ? "الوقت المختار" : "Selected time"}<strong>{selectedWeekTime}</strong></span></div></ForecastChart>
            <ForecastChart title={rtl ? "الأمواج والسويل الأسبوعي" : "Weekly Waves & Swell"} icon={Waves} unit="m" values={weeklyData.map((day) => day.wave)} secondary={weeklyData.map((day) => day.swell)} secondaryLabel={rtl ? "السويل" : "Swell"} headingDetail={`${selectedWeek.representative.swellPeriod.toFixed(1)}s ${rtl ? "فترة السويل" : "swell period"}`} selectedHour={selectedDay} onSelect={selectWeekDay} accent="cyan" xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم الأمواج" : "Select wave forecast day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "متوسط الموج" : "Average wave"}<strong>{selectedWeek.wave.toFixed(1)} m</strong></span><span>{rtl ? "أفضل وقت" : "Best time"}<strong>{formatTime12(selectedWeek.representative.time)}</strong></span></div></ForecastChart>
            <div className="chart-grid">
              <ForecastChart title={rtl ? "فترة السويل الأسبوعية" : "Weekly Swell Period"} icon={Gauge} unit="s" values={weeklyData.map((day) => day.swellPeriod)} selectedHour={selectedDay} onSelect={selectWeekDay} accent="blue" xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم السويل" : "Select swell forecast day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "متوسط الفترة" : "Average period"}<strong>{selectedWeek.swellPeriod.toFixed(1)} s</strong></span><span>{rtl ? "ارتفاع السويل" : "Swell height"}<strong>{selectedWeek.swell.toFixed(1)} m</strong></span></div></ForecastChart>
              <ForecastChart title={rtl ? "الرياح الأسبوعية" : "Weekly Wind"} icon={Wind} unit="km/h" values={weeklyData.map((day) => day.wind)} secondary={weeklyData.map((day) => day.gust)} secondaryLabel={rtl ? "أقصى هبات" : "Max gusts"} selectedHour={selectedDay} onSelect={selectWeekDay} accent="coral" direction={selectedWeek.representative.windDirection} directionFrom xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم الرياح" : "Select wind forecast day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "متوسط الرياح" : "Average wind"}<strong>{selectedWeek.wind.toFixed(1)} km/h</strong></span><span>{rtl ? "الاتجاه" : "Direction"}<strong>{compass(selectedWeek.representative.windDirection, rtl)}</strong></span></div></ForecastChart>
            </div>
          </>}
          {activity === "kayaking" && <>
            <ForecastChart className="chart-span-full" title={rtl ? "تقييم الكاياك الأسبوعي" : "Weekly Kayaking Activity"} icon={ShipWheel} unit="/100" values={weeklyData.map((day) => day.score)} selectedHour={selectedDay} onSelect={selectWeekDay} accent="cyan" decimals={0} xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم تقييم الكاياك" : "Select kayaking activity day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "تقييم الوقت المختار" : "Selected-time rating"}<strong>{selectedWeek.score >= 72 ? t.good : selectedWeek.score >= 48 ? t.caution : t.difficult}</strong></span><span>{rtl ? "الوقت المختار" : "Selected time"}<strong>{selectedWeekTime}</strong></span></div></ForecastChart>
            <ForecastChart title={rtl ? "الرياح الأسبوعية" : "Weekly Wind"} icon={Wind} unit="km/h" values={weeklyData.map((day) => day.wind)} secondary={weeklyData.map((day) => day.gust)} secondaryLabel={rtl ? "أقصى هبات" : "Max gusts"} selectedHour={selectedDay} onSelect={selectWeekDay} accent="coral" direction={selectedWeek.representative.windDirection} directionFrom xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم الرياح" : "Select wind forecast day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "متوسط الرياح" : "Average wind"}<strong>{selectedWeek.wind.toFixed(1)} km/h</strong></span><span>{rtl ? "أفضل وقت آمن" : "Safest time"}<strong>{formatTime12(selectedWeek.representative.time)}</strong></span></div></ForecastChart>
            <div className="chart-grid">
              <ForecastChart title={rtl ? "ارتفاع الموج الأسبوعي" : "Weekly Wave Height"} icon={Waves} unit="m" values={weeklyData.map((day) => day.wave)} headingDetail={`${selectedWeek.representative.wavePeriod.toFixed(1)}s ${rtl ? "فترة الموج" : "period"}`} selectedHour={selectedDay} onSelect={selectWeekDay} accent="cyan" xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم الموج" : "Select wave forecast day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "متوسط الموج" : "Average wave"}<strong>{selectedWeek.wave.toFixed(1)} m</strong></span><span>{rtl ? "أفضل وقت" : "Best time"}<strong>{formatTime12(selectedWeek.representative.time)}</strong></span></div></ForecastChart>
              <ForecastChart title={rtl ? "التيار الأسبوعي" : "Weekly Current"} icon={Navigation} unit="km/h" values={weeklyData.map((day) => day.current)} selectedHour={selectedDay} onSelect={selectWeekDay} accent="blue" direction={selectedWeek.representative.currentDirection} directionFrom xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم التيار" : "Select current forecast day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "متوسط التيار" : "Average current"}<strong>{selectedWeek.current.toFixed(1)} km/h</strong></span><span>{rtl ? "الاتجاه" : "Direction"}<strong>{compass(selectedWeek.representative.currentDirection, rtl)}</strong></span></div></ForecastChart>
            </div>
          </>}
        </div>
      </section>

      <footer>
        <div className="brand"><span className="brand-mark"><Waves size={22} /></span><span>ALEX<strong>FISHER</strong></span></div>
        <p>{t.safety}</p>
        <div className="footer-social">
          <a href="https://www.instagram.com/alexfisher_khaled/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor"><path d="M12 0C8.74 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.74 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.058-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.014 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
          </a>
          <a href="https://www.youtube.com/@alexfisher_khaled" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
          <a href="https://www.facebook.com/AlexFisher.Fishing.Vlogs" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.191.348-.271.816-.271 1.418v1.63h3.999l-.615 3.667h-3.384v7.98H9.101z"/></svg>
          </a>
          <a href="https://www.tiktok.com/@alexfisher_khaled" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
          </a>
        </div>
        <span>© 2026 AlexFisher</span>
      </footer>
      <BottomNav active="conditions" />
    </main>
  );
}
