"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Anchor, ArrowDown, ArrowUpRight, Bell, ChevronRight, Compass, Fish, Gauge,
  Heart, Languages, MapPin, Menu, MessageCircle, Navigation, Search, Send, ShipWheel,
  Sparkles, Sunrise, Thermometer, Users, Waves, Wind,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type Activity = "fishing" | "surfing" | "kayaking";
type Language = "en" | "ar";
type Spot = { id: string; en: string; ar: string; lat: number; lon: number };
type Conditions = {
  air: number; wind: number; gust: number; windDirection: number; wave: number;
  waveDirection: number; wavePeriod: number; swell: number; swellDirection: number;
  swellPeriod: number; sea: number; current: number; currentDirection: number;
  tide: number; tideState: "rising" | "falling"; highTide: string; lowTide: string;
  sunrise: string; sunset: string;
  hourly: Array<{
    time: string; wind: number; gust: number; windDirection: number; wave: number;
    wavePeriod: number; swell: number; swellPeriod: number; tide: number; sea: number;
    current: number; currentDirection: number; rain: number; visibility: number;
  }>;
};

const spots: Spot[] = [
  { id: "alex", en: "Alexandria", ar: "الإسكندرية", lat: 31.2001, lon: 29.9187 },
  { id: "aboukir", en: "Abu Qir", ar: "أبو قير", lat: 31.319, lon: 30.06 },
  { id: "sahel", en: "North Coast", ar: "الساحل الشمالي", lat: 30.966, lon: 28.72 },
  { id: "portsaid", en: "Port Said", ar: "بورسعيد", lat: 31.2653, lon: 32.3019 },
  { id: "sokhna", en: "Ain Sokhna", ar: "العين السخنة", lat: 29.592, lon: 32.338 },
  { id: "hurghada", en: "Hurghada", ar: "الغردقة", lat: 27.2579, lon: 33.8116 },
  { id: "dahab", en: "Dahab", ar: "دهب", lat: 28.509, lon: 34.513 },
];

const copy = {
  en: {
    nav: ["Conditions", "Learning", "Community", "Shop"], eyebrow: "LIVE MARINE INTELLIGENCE",
    titleA: "Know the sea.", titleB: "Own the day.",
    subtitle: "One clear forecast for fishing, surfing and kayaking — interpreted for the way you move on the water.",
    where: "Where are you heading?", live: "LIVE MODEL FORECAST", updated: "Updated",
    activities: { fishing: "Fishing", surfing: "Surfing", kayaking: "Kayaking" }, score: "activity score",
    good: "Good conditions", caution: "Use caution", difficult: "Difficult conditions", window: "Best window",
    insight: "AlexFisher insight", insightText: "The morning offers the cleanest conditions. Wind and waves build after midday, so plan an early session.",
    metrics: ["Wind", "Waves", "Swell", "Tide", "Sea temp", "Current"], rising: "Rising", falling: "Falling",
    hourly: "Plan your day", drag: "Drag the time marker — every chart moves with you", selected: "Selected time", community: "The sea is better together.",
    communitySub: "Local reports, honest answers and people who love the water as much as you do.",
    members: "members", postsToday: "posts today", ask: "Ask the community...",
    launch: "Open the full community to ask questions, publish reports and comment.",
    today: "Today", tomorrow: "Tomorrow", dayThree: "Day 3", chooseDay: "3-day forecast", bestAt: "Best at",
    safety: "Forecast guidance only. Always check local conditions and official safety advice before entering the water.",
  },
  ar: {
    nav: ["حالة البحر", "تعلم", "المجتمع", "المتجر"], eyebrow: "بيانات بحرية مباشرة",
    titleA: "اعرف البحر.", titleB: "واختار يومك.",
    subtitle: "توقعات واضحة للصيد والسيرف والكاياك — متفسرة حسب نشاطك على البحر.", where: "رايح فين؟",
    live: "توقع مباشر", updated: "آخر تحديث", activities: { fishing: "صيد", surfing: "سيرف", kayaking: "كاياك" },
    score: "تقييم النشاط", good: "الظروف جيدة", caution: "توخَّ الحذر", difficult: "الظروف صعبة", window: "أفضل وقت",
    insight: "نصيحة AlexFisher", insightText: "الصباح يقدم أفضل الظروف. الرياح والأمواج تزيد بعد الظهر، لذلك خطط للنزول مبكراً.",
    metrics: ["الرياح", "الأمواج", "السويل", "المد والجزر", "حرارة البحر", "التيار"], rising: "مد صاعد", falling: "جزر",
    hourly: "خطط ليومك", drag: "حرّك مؤشر الوقت — كل الرسوم تتحرك معك", selected: "الوقت المختار", community: "البحر أحلى مع بعض.",
    communitySub: "تقارير محلية، إجابات حقيقية، وناس بتحب البحر زيك.", members: "عضو", postsToday: "منشور اليوم",
    ask: "اسأل المجتمع...", launch: "افتح المجتمع الكامل لطرح الأسئلة ونشر التقارير والتعليق.",
    today: "اليوم", tomorrow: "غداً", dayThree: "اليوم الثالث", chooseDay: "توقعات ٣ أيام", bestAt: "الأفضل الساعة",
    safety: "التوقعات للإرشاد فقط. تحقق دائماً من الظروف المحلية وتعليمات السلامة الرسمية قبل النزول إلى المياه.",
  },
};

const fallback: Conditions = {
  air: 27, wind: 12, gust: 18, windDirection: 320, wave: .8, waveDirection: 340, wavePeriod: 6.4,
  swell: .6, swellDirection: 330, swellPeriod: 8.2, sea: 26, current: .4, currentDirection: 70,
  tide: .18, tideState: "rising", highTide: "18:42", lowTide: "11:16", sunrise: "06:31", sunset: "19:28",
  hourly: Array.from({ length: 24 }, (_, index) => ({
    time: `${String(index).padStart(2, "0")}:00`,
    wind: 9 + Math.max(0, Math.sin((index - 7) / 5) * 8), gust: 15 + Math.max(0, Math.sin((index - 7) / 5) * 9), windDirection: 320,
    wave: .55 + Math.max(0, Math.sin((index - 8) / 5) * .55), wavePeriod: 6.4,
    swell: .42 + Math.max(0, Math.sin((index - 8) / 5) * .35), swellPeriod: 8.2,
    tide: .8 + Math.sin((index - 11) / 2.1) * .55, sea: 26, current: .35 + Math.max(0, Math.sin(index / 4) * .2), currentDirection: 70,
    rain: index > 17 ? 12 : 3, visibility: 18,
  })),
};

const fallbackDays = Array.from({ length: 3 }, (_, day) => ({
  ...fallback,
  air: fallback.air + day,
  hourly: fallback.hourly.map((hour, index) => ({
    ...hour, wind: hour.wind + day * 1.5, gust: hour.gust + day * 2,
    wave: hour.wave + day * .08, swell: hour.swell + day * .06,
    time: `${String(index).padStart(2, "0")}:00`,
  })),
}));

const compass = (degrees: number) => ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(degrees / 45) % 8];
const shortTime = (value?: string) => value ? new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }) : "—";
function calculateScore(c: Conditions, activity: Activity) {
  if (activity === "fishing") return Math.round(Math.max(18, 100 - c.wind * 1.5 - c.wave * 18 + (c.tideState === "rising" ? 9 : 3)));
  if (activity === "surfing") return Math.round(Math.max(20, Math.min(96, 42 + c.swell * 22 + c.swellPeriod * 2.2 - Math.max(0, c.wind - 14) * 1.4)));
  return Math.round(Math.max(10, 100 - c.wind * 2.2 - c.gust * .7 - c.wave * 27 - c.current * 12));
}

function chartPath(values: number[], width = 1000, height = 220, padding = 24) {
  const finite = values.map((value) => Number.isFinite(value) ? value : 0);
  const min = Math.min(...finite);
  const max = Math.max(...finite);
  const range = Math.max(.01, max - min);
  return finite.map((value, index) => {
    const x = padding + (index / Math.max(1, finite.length - 1)) * (width - padding * 2);
    const y = padding + (1 - (value - min) / range) * (height - padding * 2);
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function ForecastChart({
  title, unit, values, secondary, secondaryLabel, selectedHour, onSelect, accent = "cyan", children,
}: {
  title: string; unit: string; values: number[]; secondary?: number[]; secondaryLabel?: string;
  selectedHour: number; onSelect: (hour: number) => void; accent?: "cyan" | "coral" | "blue"; children?: React.ReactNode;
}) {
  const value = values[selectedHour] ?? 0;
  const secondaryValue = secondary?.[selectedHour] ?? 0;
  const marker = 2.4 + (selectedHour / 23) * 95.2;
  return (
    <article className={`forecast-chart chart-${accent}`}>
      <div className="chart-heading">
        <div><p>{title}</p><strong>{value.toFixed(1)} <small>{unit}</small></strong></div>
        {secondary && <div className="legend"><span /><b>{secondaryLabel}</b><strong>{secondaryValue.toFixed(1)} {unit}</strong></div>}
      </div>
      <div className="chart-canvas">
        <div className="daylight-band" />
        <svg viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id={`fill-${accent}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".24"/><stop offset="1" stopColor="currentColor" stopOpacity=".01"/></linearGradient></defs>
          <path className="area" d={`${chartPath(values)} L976,220 L24,220 Z`} fill={`url(#fill-${accent})`} />
          <path className="primary-line" d={chartPath(values)} />
          {secondary && <path className="secondary-line" d={chartPath(secondary)} />}
        </svg>
        <div className="time-cursor" style={{ left: `${marker}%` }}><span>{value.toFixed(1)} {unit}</span><i /></div>
        <input dir="ltr" aria-label={`Select hour for ${title}`} type="range" min="0" max="23" step="1" value={selectedHour} onChange={(event) => onSelect(Number(event.target.value))} />
      </div>
      <div className="chart-hours"><span>00</span><span>04</span><span>08</span><span>12</span><span>16</span><span>20</span><span>23</span></div>
      {children}
    </article>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [activity, setActivity] = useState<Activity>("fishing");
  const [spotId, setSpotId] = useState("alex");
  const [forecastDays, setForecastDays] = useState<Conditions[]>(fallbackDays);
  const [forecastDates, setForecastDates] = useState<string[]>(Array.from({ length: 3 }, (_, day) => new Date(Date.now() + day * 86400000).toISOString().slice(0, 10)));
  const [selectedDay, setSelectedDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dataStatus, setDataStatus] = useState<"live" | "sample">("sample");
  const [selectedHour, setSelectedHour] = useState(9);
  const [communityGroup, setCommunityGroup] = useState<Activity>("fishing");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const t = copy[language];
  const rtl = language === "ar";
  const spot = spots.find((item) => item.id === spotId) ?? spots[0];
  const conditions = forecastDays[selectedDay] ?? fallbackDays[0];

  useEffect(() => {
    const controller = new AbortController();
    async function loadConditions() {
      setLoading(true);
      try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${spot.lat}&longitude=${spot.lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,wind_speed_10m,wind_gusts_10m,wind_direction_10m,precipitation_probability,visibility&daily=sunrise,sunset&timezone=auto&forecast_days=3`;
        const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${spot.lat}&longitude=${spot.lon}&current=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_direction,swell_wave_period,sea_surface_temperature,ocean_current_velocity,ocean_current_direction,sea_level_height_msl&hourly=wave_height,wave_period,swell_wave_height,swell_wave_period,sea_surface_temperature,ocean_current_velocity,ocean_current_direction,sea_level_height_msl&timezone=auto&forecast_days=3`;
        const [weatherRes, marineRes] = await Promise.all([fetch(weatherUrl, { signal: controller.signal }), fetch(marineUrl, { signal: controller.signal })]);
        if (!weatherRes.ok || !marineRes.ok) throw new Error("Forecast unavailable");
        const weather = await weatherRes.json();
        const marine = await marineRes.json();
        const dates: string[] = weather.daily.time.slice(0, 3);
        const days = dates.map((date, day) => {
          const start = weather.hourly.time.findIndex((value: string) => value.slice(0, 10) === date);
          const hours = Array.from({ length: 24 }, (_, offset) => {
            const index = Math.max(0, start) + offset;
            return {
              time: shortTime(weather.hourly.time[index]), wind: weather.hourly.wind_speed_10m[index] ?? 0,
              gust: weather.hourly.wind_gusts_10m[index] ?? 0, windDirection: weather.hourly.wind_direction_10m[index] ?? 0,
              wave: marine.hourly.wave_height[index] ?? 0, wavePeriod: marine.hourly.wave_period[index] ?? 0,
              swell: marine.hourly.swell_wave_height[index] ?? 0, swellPeriod: marine.hourly.swell_wave_period[index] ?? 0,
              tide: marine.hourly.sea_level_height_msl[index] ?? 0, sea: marine.hourly.sea_surface_temperature[index] ?? 0,
              current: marine.hourly.ocean_current_velocity[index] ?? 0, currentDirection: marine.hourly.ocean_current_direction[index] ?? 0,
              rain: weather.hourly.precipitation_probability[index] ?? 0, visibility: (weather.hourly.visibility[index] ?? 0) / 1000,
            };
          });
          const tideValues = hours.map((hour) => hour.tide);
          const highIndex = tideValues.indexOf(Math.max(...tideValues));
          const lowIndex = tideValues.indexOf(Math.min(...tideValues));
          const first = hours[0];
          return {
            air: weather.hourly.temperature_2m[Math.max(0, start) + 12] ?? weather.current.temperature_2m ?? 0,
            wind: first.wind, gust: first.gust, windDirection: first.windDirection,
            wave: first.wave, waveDirection: marine.current.wave_direction ?? 0, wavePeriod: first.wavePeriod,
            swell: first.swell, swellDirection: marine.current.swell_wave_direction ?? 0, swellPeriod: first.swellPeriod,
            sea: first.sea, current: first.current, currentDirection: first.currentDirection, tide: first.tide,
            tideState: (hours[1].tide >= first.tide ? "rising" : "falling") as "rising" | "falling",
            highTide: hours[highIndex].time, lowTide: hours[lowIndex].time,
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
    return () => controller.abort();
  }, [spot.lat, spot.lon]);

  const selected = conditions.hourly[selectedHour] ?? conditions.hourly[0];
  const selectedConditions = useMemo(() => ({
    ...conditions, wind: selected.wind, gust: selected.gust, windDirection: selected.windDirection,
    wave: selected.wave, wavePeriod: selected.wavePeriod, swell: selected.swell, swellPeriod: selected.swellPeriod,
    tide: selected.tide, sea: selected.sea, current: selected.current, currentDirection: selected.currentDirection,
    tideState: ((conditions.hourly[Math.min(23, selectedHour + 1)]?.tide ?? selected.tide) >= selected.tide ? "rising" : "falling") as "rising" | "falling",
  }), [conditions, selected, selectedHour]);
  const score = useMemo(() => calculateScore(selectedConditions, activity), [selectedConditions, activity]);
  const rating = score >= 72 ? t.good : score >= 48 ? t.caution : t.difficult;
  const scoreClass = score >= 72 ? "score-good" : score >= 48 ? "score-caution" : "score-poor";
  const bestHour = conditions.hourly.reduce((best, hour, index) => {
    const hourScore = calculateScore({ ...conditions, ...hour, tideState: (conditions.hourly[Math.min(23, index + 1)]?.tide ?? hour.tide) >= hour.tide ? "rising" : "falling" }, activity);
    return hourScore > best.score ? { index, score: hourScore } : best;
  }, { index: 0, score: -1 });
  const activityMetrics = activity === "fishing" ? [
    { label: rtl ? "نشاط السمك" : "Fish activity", value: `${score}/100`, sub: rating, icon: Fish },
    { label: rtl ? "حركة المد" : "Tide movement", value: selectedConditions.tideState === "rising" ? t.rising : t.falling, sub: `H ${conditions.highTide} · L ${conditions.lowTide}`, icon: ArrowDown },
    { label: rtl ? "الرياح للصيد" : "Fishing wind", value: `${selected.wind.toFixed(0)} km/h`, sub: `${compass(selected.windDirection)} · ${selected.gust.toFixed(0)} gust`, icon: Wind },
    { label: rtl ? "ارتفاع الموج" : "Wave height", value: `${selected.wave.toFixed(1)} m`, sub: `${selected.wavePeriod.toFixed(1)}s period`, icon: Waves },
    { label: rtl ? "حرارة المياه" : "Water temperature", value: `${selected.sea.toFixed(1)}°C`, sub: rtl ? "مؤشر نشاط الأسماك" : "Fish comfort indicator", icon: Thermometer },
    { label: rtl ? "أفضل فرصة" : "Best bite window", value: conditions.hourly[bestHour.index]?.time ?? "—", sub: `${t.bestAt} ${conditions.hourly[bestHour.index]?.time ?? "—"}`, icon: Gauge },
  ] : activity === "surfing" ? [
    { label: rtl ? "جودة السيرف" : "Surf quality", value: `${score}/100`, sub: rating, icon: Waves },
    { label: rtl ? "ارتفاع السويل" : "Swell height", value: `${selected.swell.toFixed(1)} m`, sub: `${selected.swellPeriod.toFixed(1)}s period`, icon: Waves },
    { label: rtl ? "ارتفاع الموج" : "Wave height", value: `${selected.wave.toFixed(1)} m`, sub: `${selected.wavePeriod.toFixed(1)}s period`, icon: Gauge },
    { label: rtl ? "رياح السيرف" : "Surf wind", value: `${selected.wind.toFixed(0)} km/h`, sub: `${compass(selected.windDirection)} · ${selected.gust.toFixed(0)} gust`, icon: Wind },
    { label: rtl ? "مرحلة المد" : "Tide stage", value: selectedConditions.tideState === "rising" ? t.rising : t.falling, sub: `${selected.tide.toFixed(2)} m`, icon: ArrowDown },
    { label: rtl ? "المستوى المقترح" : "Suggested level", value: score > 78 ? (rtl ? "متوسط+" : "Intermediate+") : (rtl ? "مبتدئ" : "Beginner"), sub: rtl ? "حسب الظروف المختارة" : "For selected conditions", icon: Gauge },
  ] : [
    { label: rtl ? "أمان الكاياك" : "Kayak safety", value: `${score}/100`, sub: rating, icon: ShipWheel },
    { label: rtl ? "الرياح والهبات" : "Wind & gusts", value: `${selected.wind.toFixed(0)} km/h`, sub: `${selected.gust.toFixed(0)} km/h gusts`, icon: Wind },
    { label: rtl ? "حالة سطح البحر" : "Surface state", value: `${selected.wave.toFixed(1)} m`, sub: `${selected.wavePeriod.toFixed(1)}s period`, icon: Waves },
    { label: rtl ? "سرعة التيار" : "Current speed", value: `${selected.current.toFixed(1)} km/h`, sub: `${compass(selected.currentDirection)} direction`, icon: Navigation },
    { label: rtl ? "مدى الرؤية" : "Visibility", value: `${selected.visibility.toFixed(0)} km`, sub: `${selected.rain.toFixed(0)}% ${rtl ? "احتمال مطر" : "rain chance"}`, icon: Gauge },
    { label: rtl ? "درجة الصعوبة" : "Difficulty", value: score > 76 ? (rtl ? "سهل" : "Easy") : score > 50 ? (rtl ? "متوسط" : "Moderate") : (rtl ? "صعب" : "Difficult"), sub: rtl ? "حسب خبرة المستخدم" : "Experience still matters", icon: ShipWheel },
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
        <nav aria-label="Main navigation">{t.nav.map((item, index) => <a key={item} href={index === 1 ? "/learning" : index === 2 ? "/community" : index === 3 ? "#shop" : "#conditions"}>{item}</a>)}</nav>
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
                {t.nav.map((item, index) => <SheetClose asChild key={item}><a href={index === 1 ? "/learning" : index === 2 ? "/community" : index === 3 ? "#shop" : "#conditions"}><span>{String(index + 1).padStart(2, "0")}</span>{item}<ChevronRight size={18} className={rtl ? "flip" : ""} /></a></SheetClose>)}
              </nav>
            </SheetContent>
          </Sheet>
          <button className="icon-button" aria-label="Notifications"><Bell size={18} /></button>
          <button className="language-button" onClick={() => setLanguage(language === "en" ? "ar" : "en")}><Languages size={17} /> {language === "en" ? "العربية" : "EN"}</button>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="hero-copy"><p className="eyebrow"><span /> {t.eyebrow}</p><h1>{t.titleA}<br /><em>{t.titleB}</em></h1><p className="hero-subtitle">{t.subtitle}</p></div>
        <div className="location-panel">
          <label htmlFor="location"><MapPin size={18} /> {t.where}</label>
          <div className="location-select-wrap"><Search size={19} /><select id="location" value={spotId} onChange={(event) => setSpotId(event.target.value)}>{spots.map((item) => <option key={item.id} value={item.id}>{rtl ? item.ar : item.en}</option>)}</select><ChevronRight size={19} className={rtl ? "flip" : ""} /></div>
          <p><span className={dataStatus === "live" ? "live-dot" : "sample-dot"} /> {dataStatus === "live" ? `${t.live} · ${t.updated} ${lastUpdated?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) ?? "now"}` : "Preview data"}</p>
        </div>
      </section>

      <section id="conditions" className="dashboard-wrap">
        <Tabs value={activity} onValueChange={(value) => setActivity(value as Activity)} className="activity-tabs"><TabsList><TabsTrigger value="fishing"><Fish size={19} /> {t.activities.fishing}</TabsTrigger><TabsTrigger value="surfing"><Waves size={19} /> {t.activities.surfing}</TabsTrigger><TabsTrigger value="kayaking"><ShipWheel size={19} /> {t.activities.kayaking}</TabsTrigger></TabsList></Tabs>
        <div className="day-selector">
          <div><small>{t.chooseDay}</small><strong>{new Date(`${forecastDates[selectedDay]}T12:00:00`).toLocaleDateString(language === "ar" ? "ar-EG" : "en-GB", { weekday: "long", day: "numeric", month: "long" })}</strong></div>
          <div className="day-buttons">{forecastDates.map((date, index) => {
            const dayConditions = forecastDays[index] ?? fallbackDays[index];
            const dayBest = Math.max(...dayConditions.hourly.map((hour, hourIndex) => calculateScore({ ...dayConditions, ...hour, tideState: (dayConditions.hourly[Math.min(23, hourIndex + 1)]?.tide ?? hour.tide) >= hour.tide ? "rising" : "falling" }, activity)));
            return <button key={date} type="button" className={selectedDay === index ? "active" : ""} onClick={() => { setSelectedDay(index); setSelectedHour(index === 0 ? Math.max(0, new Date().getHours()) : 9); }}><span>{index === 0 ? t.today : index === 1 ? t.tomorrow : t.dayThree}</span><strong>{new Date(`${date}T12:00:00`).toLocaleDateString(language === "ar" ? "ar-EG" : "en-GB", { day: "numeric", month: "short" })}</strong><em>{dayBest}/100</em></button>;
          })}</div>
        </div>
        <div className={`condition-board ${loading ? "is-loading" : ""}`}>
          <article className="score-card">
            <div className="score-head"><span>{t.activities[activity]} {t.score}</span><b>{selectedDay === 0 ? t.today : selectedDay === 1 ? t.tomorrow : t.dayThree}</b><Gauge size={20} /></div>
            <div className={`score-ring ${scoreClass}`} style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}><div><strong>{score}</strong><span>/100</span></div></div>
            <h2>{rating}</h2><p>{t.bestAt}</p><strong className="best-time">{conditions.hourly[bestHour.index]?.time ?? selected.time}</strong>
            <div className="sun-times"><span><Sunrise size={16} /> {conditions.sunrise}</span><span>{conditions.sunset} <ArrowUpRight size={16} /></span></div>
          </article>
          <div className="metrics-grid">
            {activityMetrics.map((metric) => { const Icon = metric.icon; return <article className="metric-card" key={metric.label}><div className="metric-icon"><Icon size={20} /></div><div><p>{metric.label}</p><strong>{metric.value}</strong><span>{metric.sub}</span></div></article>; })}
            <article className="insight-card"><div><Sparkles size={20} /></div><div><p>{t.insight}</p><strong>{activityInsight}</strong></div></article>
          </div>
        </div>
        <div className="forecast-explorer">
          <div className="section-title forecast-title"><div><p>{rtl ? spot.ar : spot.en} · {new Date(`${forecastDates[selectedDay]}T12:00:00`).toLocaleDateString(language === "ar" ? "ar-EG" : "en-GB", { weekday: "long", day: "numeric", month: "long" })}</p><h2>{t.hourly}</h2><span>{t.drag}</span></div><div className="selected-time"><small>{t.selected}</small><strong>{selected.time}</strong></div></div>
          <div className="time-scrubber"><span>00:00</span><input dir="ltr" aria-label="Select time of day" type="range" min="0" max="23" step="1" value={selectedHour} onChange={(event) => setSelectedHour(Number(event.target.value))} /><span>23:00</span></div>
          {activity === "fishing" && <>
            <ForecastChart title={rtl ? "المد والجزر للصيد" : "Fishing tide"} unit="m" values={conditions.hourly.map((hour) => hour.tide)} selectedHour={selectedHour} onSelect={setSelectedHour} accent="blue">
              <div className="chart-facts"><span>{rtl ? "أعلى مد" : "High tide"}<strong>{conditions.highTide}</strong></span><span>{rtl ? "أقل جزر" : "Low tide"}<strong>{conditions.lowTide}</strong></span><span>{selectedConditions.tideState === "rising" ? t.rising : t.falling}<strong>{selected.tide.toFixed(2)} m</strong></span></div>
            </ForecastChart>
            <div className="chart-grid">
              <ForecastChart title={rtl ? "الرياح وتأثيرها على الصيد" : "Fishing wind"} unit="km/h" values={conditions.hourly.map((hour) => hour.wind)} secondary={conditions.hourly.map((hour) => hour.gust)} secondaryLabel={rtl ? "هبات" : "Gusts"} selectedHour={selectedHour} onSelect={setSelectedHour} accent="coral"><div className="chart-facts compact"><span>{rtl ? "الاتجاه" : "Direction"}<strong>{compass(selected.windDirection)}</strong></span><span>{rtl ? "أفضل نشاط" : "Best activity"}<strong>{conditions.hourly[bestHour.index]?.time}</strong></span></div></ForecastChart>
              <ForecastChart title={rtl ? "حالة البحر للصيد" : "Fishing sea state"} unit="m" values={conditions.hourly.map((hour) => hour.wave)} selectedHour={selectedHour} onSelect={setSelectedHour} accent="cyan"><div className="chart-facts compact"><span>{rtl ? "حرارة المياه" : "Water temp"}<strong>{selected.sea.toFixed(1)}°C</strong></span><span>{rtl ? "فترة الموج" : "Wave period"}<strong>{selected.wavePeriod.toFixed(1)}s</strong></span></div></ForecastChart>
            </div>
          </>}
          {activity === "surfing" && <>
            <ForecastChart title={rtl ? "الأمواج والسويل للسيرف" : "Surf waves & swell"} unit="m" values={conditions.hourly.map((hour) => hour.wave)} secondary={conditions.hourly.map((hour) => hour.swell)} secondaryLabel={rtl ? "السويل" : "Swell"} selectedHour={selectedHour} onSelect={setSelectedHour} accent="cyan"><div className="chart-facts"><span>{rtl ? "فترة السويل" : "Swell period"}<strong>{selected.swellPeriod.toFixed(1)}s</strong></span><span>{rtl ? "مرحلة المد" : "Tide stage"}<strong>{selectedConditions.tideState === "rising" ? t.rising : t.falling}</strong></span><span>{rtl ? "أفضل سيرف" : "Best surf"}<strong>{conditions.hourly[bestHour.index]?.time}</strong></span></div></ForecastChart>
            <div className="chart-grid">
              <ForecastChart title={rtl ? "فترة السويل" : "Swell period"} unit="s" values={conditions.hourly.map((hour) => hour.swellPeriod)} selectedHour={selectedHour} onSelect={setSelectedHour} accent="blue"><div className="chart-facts compact"><span>{rtl ? "الاتجاه" : "Direction"}<strong>{compass(conditions.swellDirection)}</strong></span><span>{rtl ? "حرارة البحر" : "Sea temp"}<strong>{selected.sea.toFixed(1)}°C</strong></span></div></ForecastChart>
              <ForecastChart title={rtl ? "رياح السيرف" : "Surf wind"} unit="km/h" values={conditions.hourly.map((hour) => hour.wind)} secondary={conditions.hourly.map((hour) => hour.gust)} secondaryLabel={rtl ? "هبات" : "Gusts"} selectedHour={selectedHour} onSelect={setSelectedHour} accent="coral"><div className="chart-facts compact"><span>{rtl ? "الاتجاه" : "Direction"}<strong>{compass(selected.windDirection)}</strong></span><span>{rtl ? "السرعة" : "Speed"}<strong>{selected.wind.toFixed(0)} km/h</strong></span></div></ForecastChart>
            </div>
          </>}
          {activity === "kayaking" && <>
            <ForecastChart title={rtl ? "الرياح والهبات للكاياك" : "Kayak wind & gusts"} unit="km/h" values={conditions.hourly.map((hour) => hour.wind)} secondary={conditions.hourly.map((hour) => hour.gust)} secondaryLabel={rtl ? "هبات" : "Gusts"} selectedHour={selectedHour} onSelect={setSelectedHour} accent="coral"><div className="chart-facts"><span>{rtl ? "الاتجاه" : "Direction"}<strong>{compass(selected.windDirection)}</strong></span><span>{rtl ? "احتمال المطر" : "Rain chance"}<strong>{selected.rain.toFixed(0)}%</strong></span><span>{rtl ? "أفضل وقت آمن" : "Safest window"}<strong>{conditions.hourly[bestHour.index]?.time}</strong></span></div></ForecastChart>
            <div className="chart-grid">
              <ForecastChart title={rtl ? "ارتفاع الموج للكاياك" : "Kayak wave height"} unit="m" values={conditions.hourly.map((hour) => hour.wave)} selectedHour={selectedHour} onSelect={setSelectedHour} accent="cyan"><div className="chart-facts compact"><span>{rtl ? "فترة الموج" : "Wave period"}<strong>{selected.wavePeriod.toFixed(1)}s</strong></span><span>{rtl ? "الرؤية" : "Visibility"}<strong>{selected.visibility.toFixed(0)} km</strong></span></div></ForecastChart>
              <ForecastChart title={rtl ? "سرعة التيار" : "Current speed"} unit="km/h" values={conditions.hourly.map((hour) => hour.current)} selectedHour={selectedHour} onSelect={setSelectedHour} accent="blue"><div className="chart-facts compact"><span>{rtl ? "اتجاه التيار" : "Current direction"}<strong>{compass(selected.currentDirection)}</strong></span><span>{rtl ? "درجة الصعوبة" : "Difficulty"}<strong>{score > 76 ? (rtl ? "سهل" : "Easy") : score > 50 ? (rtl ? "متوسط" : "Moderate") : (rtl ? "صعب" : "Difficult")}</strong></span></div></ForecastChart>
            </div>
          </>}
        </div>
      </section>

      <section id="community" className="community-section">
        <div className="community-heading"><p className="eyebrow"><span /> ALEX FISHER COMMUNITY</p><h2>{t.community}</h2><p>{t.communitySub}</p></div>
        <div className="community-layout">
          <div className="group-list">{[
            { id: "fishing" as Activity, icon: Fish, name: t.activities.fishing, members: "12.4K", posts: 84, color: "cyan" },
            { id: "surfing" as Activity, icon: Waves, name: t.activities.surfing, members: "4.8K", posts: 31, color: "coral" },
            { id: "kayaking" as Activity, icon: ShipWheel, name: t.activities.kayaking, members: "3.1K", posts: 22, color: "mint" },
          ].map((group) => <button type="button" onClick={() => setCommunityGroup(group.id)} className={`group-card ${communityGroup === group.id ? "selected" : ""}`} key={group.name}><div className={`group-icon ${group.color}`}><group.icon size={25} /></div><div><h3>{group.name}</h3><p><Users size={14} /> {group.members} {t.members} · {group.posts} {t.postsToday}</p></div><ChevronRight size={20} className={rtl ? "flip" : ""} /></button>)}</div>
          <article className="conversation-card">
            <div className="post-author"><div className="avatar">AF</div><div><strong>AlexFisher</strong><span><MapPin size={12} /> Alexandria · 18 min</span></div><span className="verified">✓</span></div>
            <p>{communityGroup === "fishing"
              ? (rtl ? "الجو في المكس دلوقتي هادي والرياح أخف من التوقعات. حد نازل يجرب الصيد قبل الغروب؟" : "The water at El Max is calmer than forecast right now. Anyone heading out for a sunset fishing session?")
              : communityGroup === "surfing"
                ? (rtl ? "السويل بيتحسن بعد الظهر. مين جرّب الظروف النهارده في الساحل؟" : "The swell improves this afternoon. Has anyone checked the North Coast conditions today?")
                : (rtl ? "الرياح هتزيد بعد ١١ صباحاً. أنصح المبتدئين يبدأوا بدري ويرجعوا قبلها." : "Wind builds after 11 AM. Beginners should launch early and be back before it strengthens.")}</p>
            <div className="forecast-chip"><Wind size={15} /> 10 km/h <Waves size={15} /> 0.6 m <span>78/100</span></div>
            <div className="post-actions"><button><Heart size={17} /> 128</button><button><MessageCircle size={17} /> 24</button><button><Send size={17} /></button></div>
            <a className="community-open" href="/community"><MessageCircle size={17}/>{t.ask}<ChevronRight size={16}/></a><p className="launch-note">{t.launch}</p>
          </article>
        </div>
      </section>

      <section id="shop" className="shop-strip"><div><Anchor size={26} /><span><small>ALEX FISHER GEAR</small><strong>{rtl ? "المتجر قريباً" : "Built for days on the water. Coming soon."}</strong></span></div><button disabled>{rtl ? "قريباً" : "SHOP COMING SOON"}</button></section>
      <footer><div className="brand"><span className="brand-mark"><Waves size={22} /></span><span>ALEX<strong>FISHER</strong></span></div><p>{t.safety}</p><span>© 2026 AlexFisher</span></footer>
    </main>
  );
}
