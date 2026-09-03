"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown, ArrowUp, ArrowUpRight, Bell, ChevronRight, CloudRain, Compass, Fish, Gauge,
  Languages, MapPin, Menu, Navigation, RefreshCw, Search, ShipWheel,
  Sparkles, Sunrise, Thermometer, Waves, Wind,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type Activity = "fishing" | "surfing" | "kayaking";
type Language = "en" | "ar";
type Spot = { id: string; en: string; ar: string; lat: number; lon: number };
type CoastalCity = { id: string; en: string; ar: string; spots: Spot[] };
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

const coastalCities: CoastalCity[] = [
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
];

const copy = {
  en: {
    nav: ["Conditions", "Fishing Hub", "Learning", "Community", "Shop"], eyebrow: "LIVE MARINE INTELLIGENCE",
    titleA: "Know the sea.", titleB: "Own the day.",
    subtitle: "One clear forecast for fishing, surfing and kayaking — interpreted for the way you move on the water.",
    where: "Where are you heading?", city: "City", spot: "Fishing spot", live: "LIVE MODEL FORECAST", updated: "Updated",
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
    subtitle: "توقعات واضحة للصيد والسيرف والكاياك — متفسرة حسب نشاطك على البحر.", where: "رايح فين؟", city: "المدينة", spot: "مكان الصيد",
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

function ForecastChart({
  title, unit, values, secondary, secondaryLabel, selectedHour, onSelect, accent = "cyan", icon: ChartIcon = Waves, direction, directionFrom = false, currentDirection, currentDirectionFrom = false, currentSpeed, tideDetails, nowHour, nowTime, rtl = false, decimals = 1, xLabels, selectedLabel, rangeLabel, children,
}: {
  title: string; unit: string; values: number[]; secondary?: number[]; secondaryLabel?: string;
  selectedHour: number; onSelect: (hour: number) => void; accent?: "cyan" | "coral" | "blue";
  icon?: React.ElementType; direction?: number; directionFrom?: boolean; currentDirection?: number; currentDirectionFrom?: boolean; currentSpeed?: number;
  tideDetails?: { fishingActivity: number; wind: number; windDirection: number; wave: number; current: number; currentDirection: number };
  nowHour?: number; nowTime?: string; rtl?: boolean; decimals?: number;
  xLabels?: Array<{ primary: string; secondary?: string }>; selectedLabel?: string; rangeLabel?: string; children?: React.ReactNode;
}) {
  const value = values[selectedHour] ?? 0;
  const secondaryValue = secondary?.[selectedHour] ?? 0;
  const lastIndex = Math.max(1, values.length - 1);
  const marker = 8 + (selectedHour / lastIndex) * 84;
  const nowMarker = nowHour === undefined ? 0 : 8 + (Math.max(0, Math.min(24, nowHour)) / 24) * 84;
  const selectedTime = selectedLabel ?? formatTime12(`${String(selectedHour).padStart(2, "0")}:00`);
  // Wind bearings name where the wind comes from. Its arrow shows where the
  // air travels, so it points 180 degrees away from the named source.
  const arrowDirection = direction === undefined ? 0 : (direction + (directionFrom ? 180 : 0)) % 360;
  const currentArrowDirection = currentDirection === undefined ? 0 : (currentDirection + (currentDirectionFrom ? 180 : 0)) % 360;
  const tideWindArrowDirection = tideDetails === undefined ? 0 : (tideDetails.windDirection + 180) % 360;
  const tideCurrentArrowDirection = tideDetails === undefined ? 0 : (tideDetails.currentDirection + 180) % 360;
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
    const plotLeft = bounds.left + bounds.width * .08;
    const plotWidth = bounds.width * .84;
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
  return (
    <article className={`forecast-chart chart-${accent} ${tideDetails ? "tide-chart" : ""} ${!tideDetails && (direction !== undefined || currentDirection !== undefined) ? "chart-direction" : ""}`}>
      <div className="chart-heading">
        <div className="chart-primary-heading"><div className="chart-title-line"><span><ChartIcon size={19}/></span><p>{title}</p></div><strong>{value.toFixed(decimals)} <small>{unit}</small></strong>{unit === "/100" && <div className="chart-fish-school">{fishSchool}</div>}</div>
        {secondary && <div className="legend"><span /><b>{secondaryLabel}</b><strong>{secondaryValue.toFixed(1)} {unit}</strong></div>}
      </div>
      <div className={`chart-readout ${tideDetails ? "has-tide-details" : ""} ${!tideDetails && (direction !== undefined || currentDirection !== undefined) ? "has-direction" : ""}`}>
        {tideDetails && <em className="activity-indicator"><strong>{rtl ? "نشاط الصيد" : "Fishing activity"}</strong><b className="activity-score">{Math.round(tideDetails.fishingActivity)}/100</b>{fishSchool}</em>}
        <div className="readout-primary"><b>{value.toFixed(decimals)} {unit}</b><small>{selectedTime}</small></div>
        {tideDetails ? <>
          <em><strong>{rtl ? "الرياح" : "Wind"}</strong><b className="direction-speed">{tideDetails.wind.toFixed(1)} km/h</b><u style={{ transform: `rotate(${tideWindArrowDirection}deg)` }}>↑</u>{compass(tideDetails.windDirection, rtl)}</em>
          <em><strong>{rtl ? "الموج" : "Wave"}</strong><b className="direction-speed">{tideDetails.wave.toFixed(1)} m</b></em>
          <em><strong>{rtl ? "التيار" : "Current"}</strong><b className="direction-speed">{tideDetails.current.toFixed(1)} km/h</b><u style={{ transform: `rotate(${tideCurrentArrowDirection}deg)` }}>↑</u>{compass(tideDetails.currentDirection, rtl)}</em>
        </> : <>{direction !== undefined && <em><strong>{rtl ? "الرياح" : "Wind"}</strong><u style={{ transform: `rotate(${arrowDirection}deg)` }}>↑</u>{compass(direction, rtl)}</em>}{currentDirection !== undefined && <em><strong>{rtl ? "التيار" : "Current"}</strong>{currentSpeed !== undefined && <b className="direction-speed">{currentSpeed.toFixed(1)} km/h</b>}<u style={{ transform: `rotate(${currentArrowDirection}deg)` }}>↑</u>{compass(currentDirection, rtl)}</em>}</>}
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
          <div className="drag-target" style={{ left: `${marker}%`, top: `${markerYPercent}%` }} aria-hidden="true"><i/><i/><i/><i/></div>
        </div>
      </div>
      {xLabels ? <div className="chart-hours week-labels">{xLabels.map((label, index) => <span key={`${label.primary}-${index}`}><b>{label.primary}</b>{label.secondary && <small>{label.secondary}</small>}</span>)}</div> : <div className="chart-hours"><span>12 AM</span><span>4 AM</span><span>8 AM</span><span>12 PM</span><span>4 PM</span><span>8 PM</span><span>11 PM</span></div>}
      {children}
    </article>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [activity, setActivity] = useState<Activity>("fishing");
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
  const city = coastalCities.find((item) => item.id === cityId) ?? coastalCities[0];
  const citySpots = city.spots;
  const spot = citySpots.find((item) => item.id === spotId) ?? citySpots[0];
  const conditions = forecastDays[selectedDay] ?? fallbackDays[0];

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("alexfisher-language");
    if (savedLanguage === "ar" || savedLanguage === "en") setLanguage(savedLanguage);
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
      city: city.en,
      spot: spot.en,
      wind: selectedConditions.wind,
      gust: selectedConditions.gust,
      tideState: selectedConditions.tideState,
      tide: selectedConditions.tide,
      updatedAt: lastUpdated?.toISOString() ?? new Date().toISOString(),
    }));
  }, [city.en, spot.en, selectedConditions.wind, selectedConditions.gust, selectedConditions.tideState, selectedConditions.tide, lastUpdated]);
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
  const weeklyData = useMemo(() => forecastDays.map((day) => {
    const average = (values: number[]) => values.reduce((total, value) => total + value, 0) / Math.max(1, values.length);
    const scoredHours = day.hourly.map((hour, index) => ({
      index,
      score: calculateScore({ ...day, ...hour, tideState: (day.hourly[Math.min(23, index + 1)]?.tide ?? hour.tide) >= hour.tide ? "rising" : "falling" }, activity),
    }));
    const best = scoredHours.reduce((winner, candidate) => candidate.score > winner.score ? candidate : winner, scoredHours[0] ?? { index: 0, score: 0 });
    const representative = day.hourly[best.index] ?? day.hourly[0];
    const tides = day.hourly.map((hour) => hour.tide);
    return {
      score: best.score,
      bestHour: best.index,
      representative,
      tideRange: Math.max(...tides) - Math.min(...tides),
      wind: average(day.hourly.map((hour) => hour.wind)),
      gust: Math.max(...day.hourly.map((hour) => hour.gust)),
      wave: average(day.hourly.map((hour) => hour.wave)),
      swell: average(day.hourly.map((hour) => hour.swell)),
      swellPeriod: average(day.hourly.map((hour) => hour.swellPeriod)),
      current: average(day.hourly.map((hour) => hour.current)),
    };
  }), [forecastDays, activity]);
  const selectedWeek = weeklyData[selectedDay] ?? weeklyData[0];
  const weekLabels = forecastDates.map((date) => ({
    primary: new Date(`${date}T12:00:00`).toLocaleDateString(rtl ? arabicLatinLocale : "en-GB", { weekday: "short" }),
    secondary: new Date(`${date}T12:00:00`).toLocaleDateString(rtl ? arabicLatinLocale : "en-GB", { day: "numeric", month: "short" }),
  }));
  const selectedWeekLabel = new Date(`${forecastDates[selectedDay]}T12:00:00`).toLocaleDateString(rtl ? arabicLatinLocale : "en-GB", { weekday: "short", day: "numeric", month: "short" });
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
  const activityInsight = activity === "fishing"
    ? (rtl ? `أفضل نشاط متوقع الساعة ${conditions.hourly[bestHour.index]?.time}. راقب حركة المد والرياح قبل النزول.` : `Best fishing activity is expected around ${conditions.hourly[bestHour.index]?.time}. Check the tide movement and wind before you go.`)
    : activity === "surfing"
      ? (rtl ? `السويل ${selected.swell.toFixed(1)} متر بفترة ${selected.swellPeriod.toFixed(1)} ثانية. التقييم يتغير مع الرياح والمد.` : `${selected.swell.toFixed(1)} m swell at ${selected.swellPeriod.toFixed(1)} seconds. The rating responds to wind and tide.`)
      : (rtl ? `الهبات ${selected.gust.toFixed(0)} كم/س والتيار ${selected.current.toFixed(1)} كم/س. ارجع قبل زيادة الرياح.` : `Gusts are ${selected.gust.toFixed(0)} km/h and current is ${selected.current.toFixed(1)} km/h. Return before the wind strengthens.`);

  return (
    <main dir={rtl ? "rtl" : "ltr"} className={`site-shell ${rtl ? "font-arabic" : ""}`}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="AlexFisher home"><span className="brand-mark"><Waves size={22} /></span><span>ALEX<strong>FISHER</strong><small>SEA CONDITIONS</small></span></a>
        <nav aria-label="Main navigation">{t.nav.map((item, index) => <a key={item} href={index === 1 ? "/fishing-hub" : index === 2 ? "/learning" : index === 3 ? "/community" : index === 4 ? "/shop" : "#conditions"}>{item}</a>)}</nav>
        <div className="header-actions">
          <Sheet>
            <SheetTrigger asChild><button className="mobile-menu-button" aria-label={rtl ? "افتح قائمة الاستكشاف" : "Open explore menu"}><Menu size={19} /><span>{rtl ? "استكشف" : "Explore"}</span></button></SheetTrigger>
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
          <label htmlFor="city"><MapPin size={18} /> {t.where}</label>
          <div className="location-pickers">
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
            <div><small>{rtl ? "الأسبوع" : "Week"}</small><strong>{selectedWeekLabel}</strong></div>
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
            <div className="sun-times"><span><Sunrise size={16} /> {conditions.sunrise}</span><span>{conditions.sunset} <ArrowUpRight size={16} /></span></div>
          </article>
          <div className="metrics-grid">
            {activityMetrics.map((metric) => { const Icon = metric.icon; const metricArrow = metric.direction === undefined ? 0 : (metric.direction + (metric.directionFrom ? 180 : 0)) % 360; return <article className={`metric-card ${metric.emphasis ? `metric-emphasis metric-${metric.emphasis}` : ""}`} key={metric.label}><div className="metric-icon"><Icon size={20} style={metric.iconRotation === undefined ? undefined : { transform:`rotate(${metric.iconRotation}deg)` }} /></div><div><p>{metric.label}</p><div className="metric-value"><strong>{metric.value}</strong>{metric.direction !== undefined && <u aria-hidden="true" style={{ transform:`rotate(${metricArrow}deg)` }}>↑</u>}</div><span>{metric.sub}</span></div></article>; })}
          </div>
          </div>
        </div>
        <article className="insight-card dashboard-insight"><div><Sparkles size={20} /></div><div><p>{t.insight}</p><strong>{activityInsight}</strong></div></article>
        <div className="forecast-explorer">
          <div className="section-title forecast-title"><div><p>{rtl ? spot.ar : spot.en} · {new Date(`${forecastDates[selectedDay]}T12:00:00`).toLocaleDateString(rtl ? arabicLatinLocale : "en-GB", { weekday: "long", day: "numeric", month: "long" })}</p><h2>{t.hourly}</h2><span>{t.drag}</span></div><div className="selected-time"><small>{t.selected}</small><strong>{formatTime12(selected.time)}</strong></div></div>
          {activity === "fishing" && <>
            <ForecastChart title={rtl ? "المد والجزر" : "Tide"} icon={Waves} unit="m" values={conditions.hourly.map((hour) => hour.tide)} selectedHour={selectedHour} onSelect={setSelectedHour} accent="blue" tideDetails={{ fishingActivity: fishingActivityByHour[selectedHour] ?? 0, wind: selected.wind, windDirection: selected.windDirection, wave: selected.wave, current: selected.current, currentDirection: selected.currentDirection }} nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}>
              <div className="chart-facts tide-facts"><span>{rtl ? "المد العالي" : "High tides"}<strong className="tide-event-list">{conditions.highTides.map((event) => <small key={event.time}>{event.height.toFixed(2)} m · {formatTime12(event.time)}</small>)}</strong></span><span>{rtl ? "الجزر" : "Low tides"}<strong className="tide-event-list">{conditions.lowTides.map((event) => <small key={event.time}>{event.height.toFixed(2)} m · {formatTime12(event.time)}</small>)}</strong></span><span>{selectedConditions.tideState === "rising" ? t.rising : t.falling}<strong>{selected.tide.toFixed(2)} m</strong></span></div>
            </ForecastChart>
            <div className="chart-grid">
              <ForecastChart title={rtl ? "الرياح" : "Wind"} icon={Wind} unit="km/h" values={conditions.hourly.map((hour) => hour.wind)} secondary={conditions.hourly.map((hour) => hour.gust)} secondaryLabel={rtl ? "هبات" : "Gusts"} selectedHour={selectedHour} onSelect={setSelectedHour} accent="coral" direction={selected.windDirection} directionFrom nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "اتجاه الرياح" : "Wind direction"}<strong>{compass(selected.windDirection, rtl)}</strong></span><span>{rtl ? "أفضل نشاط" : "Best activity"}<strong>{formatTime12(conditions.hourly[bestHour.index]?.time)}</strong></span></div></ForecastChart>
              <ForecastChart title={rtl ? "ارتفاع الموج" : "Wave Height"} icon={Waves} unit="m" values={conditions.hourly.map((hour) => hour.wave)} selectedHour={selectedHour} onSelect={setSelectedHour} accent="blue" nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "ارتفاع الموج" : "Wave height"}<strong>{selected.wave.toFixed(1)} m</strong></span><span>{rtl ? "فترة الموج" : "Wave period"}<strong>{selected.wavePeriod.toFixed(1)} s</strong></span></div></ForecastChart>
              <ForecastChart title={rtl ? "نشاط الصيد خلال اليوم" : "Fishing Activity"} icon={Fish} unit="/100" values={fishingActivityByHour} selectedHour={selectedHour} onSelect={setSelectedHour} accent="cyan" decimals={0} nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "النشاط الآن" : "Current activity"}<strong>{fishingActivityLabel(fishingActivityByHour[selectedHour] ?? 0, rtl)}</strong></span><span>{rtl ? "أفضل وقت" : "Best time"}<strong>{formatTime12(conditions.hourly[bestHour.index]?.time)}</strong></span></div></ForecastChart>
            </div>
          </>}
          {activity === "surfing" && <>
            <ForecastChart title={rtl ? "الأمواج والسويل" : "Waves & Swell"} icon={Waves} unit="m" values={conditions.hourly.map((hour) => hour.wave)} secondary={conditions.hourly.map((hour) => hour.swell)} secondaryLabel={rtl ? "السويل" : "Swell"} selectedHour={selectedHour} onSelect={setSelectedHour} accent="cyan" nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts"><span>{rtl ? "فترة السويل" : "Swell period"}<strong>{selected.swellPeriod.toFixed(1)}s</strong></span><span>{rtl ? "مرحلة المد" : "Tide stage"}<strong>{selectedConditions.tideState === "rising" ? t.rising : t.falling}</strong></span><span>{rtl ? "أفضل سيرف" : "Best surf"}<strong>{formatTime12(conditions.hourly[bestHour.index]?.time)}</strong></span></div></ForecastChart>
            <div className="chart-grid">
              <ForecastChart title={rtl ? "فترة السويل" : "Swell Period"} icon={Gauge} unit="s" values={conditions.hourly.map((hour) => hour.swellPeriod)} selectedHour={selectedHour} onSelect={setSelectedHour} accent="blue" nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "الاتجاه" : "Direction"}<strong>{compass(conditions.swellDirection, rtl)}</strong></span><span>{rtl ? "حرارة البحر" : "Sea temp"}<strong>{selected.sea.toFixed(1)}°C</strong></span></div></ForecastChart>
              <ForecastChart title={rtl ? "الرياح" : "Wind"} icon={Wind} unit="km/h" values={conditions.hourly.map((hour) => hour.wind)} secondary={conditions.hourly.map((hour) => hour.gust)} secondaryLabel={rtl ? "هبات" : "Gusts"} selectedHour={selectedHour} onSelect={setSelectedHour} accent="coral" direction={selected.windDirection} directionFrom nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "اتجاه الرياح" : "Wind direction"}<strong>{compass(selected.windDirection, rtl)}</strong></span><span>{rtl ? "السرعة" : "Speed"}<strong>{selected.wind.toFixed(0)} km/h</strong></span></div></ForecastChart>
            </div>
          </>}
          {activity === "kayaking" && <>
            <ForecastChart title={rtl ? "الرياح" : "Wind"} icon={Wind} unit="km/h" values={conditions.hourly.map((hour) => hour.wind)} secondary={conditions.hourly.map((hour) => hour.gust)} secondaryLabel={rtl ? "هبات" : "Gusts"} selectedHour={selectedHour} onSelect={setSelectedHour} accent="coral" direction={selected.windDirection} directionFrom nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts"><span>{rtl ? "اتجاه الرياح" : "Wind direction"}<strong>{compass(selected.windDirection, rtl)}</strong></span><span>{rtl ? "احتمال المطر" : "Rain chance"}<strong>{selected.rain.toFixed(0)}%</strong></span><span>{rtl ? "أفضل وقت آمن" : "Safest window"}<strong>{formatTime12(conditions.hourly[bestHour.index]?.time)}</strong></span></div></ForecastChart>
            <div className="chart-grid">
              <ForecastChart title={rtl ? "ارتفاع الموج" : "Wave Height"} icon={Waves} unit="m" values={conditions.hourly.map((hour) => hour.wave)} selectedHour={selectedHour} onSelect={setSelectedHour} accent="cyan" nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "فترة الموج" : "Wave period"}<strong>{selected.wavePeriod.toFixed(1)}s</strong></span><span>{rtl ? "الرؤية" : "Visibility"}<strong>{selected.visibility.toFixed(0)} km</strong></span></div></ForecastChart>
              <ForecastChart title={rtl ? "التيار" : "Current"} icon={Navigation} unit="km/h" values={conditions.hourly.map((hour) => hour.current)} selectedHour={selectedHour} onSelect={setSelectedHour} accent="blue" direction={selected.currentDirection} directionFrom nowHour={liveNowHour} nowTime={currentTime} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "اتجاه التيار" : "Current direction"}<strong>{compass(selected.currentDirection, rtl)}</strong></span><span>{rtl ? "درجة الصعوبة" : "Difficulty"}<strong>{score > 76 ? (rtl ? "سهل" : "Easy") : score > 50 ? (rtl ? "متوسط" : "Moderate") : (rtl ? "صعب" : "Difficult")}</strong></span></div></ForecastChart>
            </div>
          </>}
        </div>
        <div className="forecast-explorer weekly-explorer">
          <div className="section-title forecast-title"><div><p>{rtl ? spot.ar : spot.en} · {rtl ? "توقعات 7 أيام" : "7-day forecast"}</p><h2>{rtl ? "خطط لأسبوعك" : "Plan your week"}</h2><span>{rtl ? "حرّك مؤشر اليوم — كل الرسوم تتحرك معك" : "Drag the day marker — all charts move with you"}</span></div><div className="selected-time selected-day"><small>{rtl ? "اليوم المختار" : "Selected day"}</small><strong>{selectedWeekLabel}</strong></div></div>
          {activity === "fishing" && <>
            <ForecastChart title={rtl ? "المد والجزر" : "Tide"} icon={Waves} unit="m" values={weeklyData.map((day) => day.representative.tide)} selectedHour={selectedDay} onSelect={selectWeekDay} accent="blue" tideDetails={{ fishingActivity: selectedWeek.score, wind: selectedWeek.representative.wind, windDirection: selectedWeek.representative.windDirection, wave: selectedWeek.representative.wave, current: selectedWeek.representative.current, currentDirection: selectedWeek.representative.currentDirection }} xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم المد والجزر" : "Select tide forecast day"} rtl={rtl}>
              <div className="chart-facts compact"><span>{rtl ? "المد عند أفضل وقت" : "Tide at best time"}<strong>{selectedWeek.representative.tide.toFixed(2)} m</strong></span><span>{rtl ? "أفضل وقت صيد" : "Best fishing time"}<strong>{formatTime12(selectedWeek.representative.time)}</strong></span></div>
            </ForecastChart>
            <div className="chart-grid">
              <ForecastChart title={rtl ? "الرياح الأسبوعية" : "Weekly Wind"} icon={Wind} unit="km/h" values={weeklyData.map((day) => day.wind)} secondary={weeklyData.map((day) => day.gust)} secondaryLabel={rtl ? "أقصى هبات" : "Max gusts"} selectedHour={selectedDay} onSelect={selectWeekDay} accent="coral" direction={selectedWeek.representative.windDirection} directionFrom xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم الرياح" : "Select wind forecast day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "متوسط الرياح" : "Average wind"}<strong>{selectedWeek.wind.toFixed(1)} km/h</strong></span><span>{rtl ? "الاتجاه" : "Direction"}<strong>{compass(selectedWeek.representative.windDirection, rtl)}</strong></span></div></ForecastChart>
              <ForecastChart title={rtl ? "ارتفاع الموج" : "Wave Height"} icon={Waves} unit="m" values={weeklyData.map((day) => day.wave)} selectedHour={selectedDay} onSelect={selectWeekDay} accent="blue" xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم الموج" : "Select wave forecast day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "متوسط الموج" : "Average wave"}<strong>{selectedWeek.wave.toFixed(1)} m</strong></span><span>{rtl ? "فترة الموج" : "Wave period"}<strong>{selectedWeek.representative.wavePeriod.toFixed(1)} s</strong></span></div></ForecastChart>
              <ForecastChart title={rtl ? "نشاط الصيد الأسبوعي" : "Weekly Fishing Activity"} icon={Fish} unit="/100" values={weeklyData.map((day) => day.score)} selectedHour={selectedDay} onSelect={selectWeekDay} accent="cyan" decimals={0} xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم نشاط الصيد" : "Select fishing activity day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "تقييم اليوم" : "Day rating"}<strong>{fishingActivityLabel(selectedWeek.score, rtl)}</strong></span><span>{rtl ? "أفضل وقت" : "Best time"}<strong>{formatTime12(selectedWeek.representative.time)}</strong></span></div></ForecastChart>
            </div>
          </>}
          {activity === "surfing" && <>
            <ForecastChart title={rtl ? "الأمواج والسويل" : "Waves & Swell"} icon={Waves} unit="m" values={weeklyData.map((day) => day.wave)} secondary={weeklyData.map((day) => day.swell)} secondaryLabel={rtl ? "السويل" : "Swell"} selectedHour={selectedDay} onSelect={selectWeekDay} accent="cyan" xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم الأمواج" : "Select wave forecast day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "متوسط الموج" : "Average wave"}<strong>{selectedWeek.wave.toFixed(1)} m</strong></span><span>{rtl ? "أفضل وقت" : "Best time"}<strong>{formatTime12(selectedWeek.representative.time)}</strong></span></div></ForecastChart>
            <div className="chart-grid">
              <ForecastChart title={rtl ? "فترة السويل الأسبوعية" : "Weekly Swell Period"} icon={Gauge} unit="s" values={weeklyData.map((day) => day.swellPeriod)} selectedHour={selectedDay} onSelect={selectWeekDay} accent="blue" xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم السويل" : "Select swell forecast day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "متوسط الفترة" : "Average period"}<strong>{selectedWeek.swellPeriod.toFixed(1)} s</strong></span><span>{rtl ? "ارتفاع السويل" : "Swell height"}<strong>{selectedWeek.swell.toFixed(1)} m</strong></span></div></ForecastChart>
              <ForecastChart title={rtl ? "الرياح الأسبوعية" : "Weekly Wind"} icon={Wind} unit="km/h" values={weeklyData.map((day) => day.wind)} secondary={weeklyData.map((day) => day.gust)} secondaryLabel={rtl ? "أقصى هبات" : "Max gusts"} selectedHour={selectedDay} onSelect={selectWeekDay} accent="coral" direction={selectedWeek.representative.windDirection} directionFrom xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم الرياح" : "Select wind forecast day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "متوسط الرياح" : "Average wind"}<strong>{selectedWeek.wind.toFixed(1)} km/h</strong></span><span>{rtl ? "الاتجاه" : "Direction"}<strong>{compass(selectedWeek.representative.windDirection, rtl)}</strong></span></div></ForecastChart>
            </div>
          </>}
          {activity === "kayaking" && <>
            <ForecastChart title={rtl ? "الرياح الأسبوعية" : "Weekly Wind"} icon={Wind} unit="km/h" values={weeklyData.map((day) => day.wind)} secondary={weeklyData.map((day) => day.gust)} secondaryLabel={rtl ? "أقصى هبات" : "Max gusts"} selectedHour={selectedDay} onSelect={selectWeekDay} accent="coral" direction={selectedWeek.representative.windDirection} directionFrom xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم الرياح" : "Select wind forecast day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "متوسط الرياح" : "Average wind"}<strong>{selectedWeek.wind.toFixed(1)} km/h</strong></span><span>{rtl ? "أفضل وقت آمن" : "Safest time"}<strong>{formatTime12(selectedWeek.representative.time)}</strong></span></div></ForecastChart>
            <div className="chart-grid">
              <ForecastChart title={rtl ? "ارتفاع الموج" : "Wave Height"} icon={Waves} unit="m" values={weeklyData.map((day) => day.wave)} selectedHour={selectedDay} onSelect={selectWeekDay} accent="cyan" xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم الموج" : "Select wave forecast day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "متوسط الموج" : "Average wave"}<strong>{selectedWeek.wave.toFixed(1)} m</strong></span><span>{rtl ? "أفضل وقت" : "Best time"}<strong>{formatTime12(selectedWeek.representative.time)}</strong></span></div></ForecastChart>
              <ForecastChart title={rtl ? "التيار الأسبوعي" : "Weekly Current"} icon={Navigation} unit="km/h" values={weeklyData.map((day) => day.current)} selectedHour={selectedDay} onSelect={selectWeekDay} accent="blue" direction={selectedWeek.representative.currentDirection} directionFrom xLabels={weekLabels} selectedLabel={selectedWeekLabel} rangeLabel={rtl ? "اختر يوم التيار" : "Select current forecast day"} rtl={rtl}><div className="chart-facts compact"><span>{rtl ? "متوسط التيار" : "Average current"}<strong>{selectedWeek.current.toFixed(1)} km/h</strong></span><span>{rtl ? "الاتجاه" : "Direction"}<strong>{compass(selectedWeek.representative.currentDirection, rtl)}</strong></span></div></ForecastChart>
            </div>
          </>}
        </div>
      </section>

      <footer><div className="brand"><span className="brand-mark"><Waves size={22} /></span><span>ALEX<strong>FISHER</strong></span></div><p>{t.safety}</p><span>© 2026 AlexFisher</span></footer>
    </main>
  );
}
