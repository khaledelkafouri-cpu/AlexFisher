"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Anchor, ArrowDown, ArrowUpRight, Bell, ChevronRight, Compass, Fish, Gauge,
  Heart, Languages, MapPin, MessageCircle, Navigation, Search, Send, ShipWheel,
  Sparkles, Sunrise, Thermometer, Users, Waves, Wind,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Activity = "fishing" | "surfing" | "kayaking";
type Language = "en" | "ar";
type Spot = { id: string; en: string; ar: string; lat: number; lon: number };
type Conditions = {
  air: number; wind: number; gust: number; windDirection: number; wave: number;
  waveDirection: number; wavePeriod: number; swell: number; swellDirection: number;
  swellPeriod: number; sea: number; current: number; currentDirection: number;
  tide: number; tideState: "rising" | "falling"; highTide: string; lowTide: string;
  sunrise: string; sunset: string;
  hourly: Array<{ time: string; wind: number; wave: number; swell: number }>;
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
    nav: ["Conditions", "Explore", "Community", "Shop"], eyebrow: "LIVE MARINE INTELLIGENCE",
    titleA: "Know the sea.", titleB: "Own the day.",
    subtitle: "One clear forecast for fishing, surfing and kayaking — interpreted for the way you move on the water.",
    where: "Where are you heading?", live: "LIVE", updated: "Updated just now",
    activities: { fishing: "Fishing", surfing: "Surfing", kayaking: "Kayaking" }, score: "activity score",
    good: "Good conditions", caution: "Use caution", difficult: "Difficult conditions", window: "Best window",
    insight: "Alex Fisher insight", insightText: "The morning offers the cleanest conditions. Wind and waves build after midday, so plan an early session.",
    metrics: ["Wind", "Waves", "Swell", "Tide", "Sea temp", "Current"], rising: "Rising", falling: "Falling",
    hourly: "Today, hour by hour", community: "The sea is better together.",
    communitySub: "Local reports, honest answers and people who love the water as much as you do.",
    members: "members", postsToday: "posts today", ask: "Ask the community...",
    launch: "Community accounts and posting are the next build stage.",
    safety: "Forecast guidance only. Always check local conditions and official safety advice before entering the water.",
  },
  ar: {
    nav: ["حالة البحر", "استكشف", "المجتمع", "المتجر"], eyebrow: "بيانات بحرية مباشرة",
    titleA: "اعرف البحر.", titleB: "واختار يومك.",
    subtitle: "توقعات واضحة للصيد والسيرف والكاياك — متفسرة حسب نشاطك على البحر.", where: "رايح فين؟",
    live: "مباشر", updated: "تم التحديث الآن", activities: { fishing: "صيد", surfing: "سيرف", kayaking: "كاياك" },
    score: "تقييم النشاط", good: "الظروف جيدة", caution: "توخَّ الحذر", difficult: "الظروف صعبة", window: "أفضل وقت",
    insight: "نصيحة أليكس فيشر", insightText: "الصباح يقدم أفضل الظروف. الرياح والأمواج تزيد بعد الظهر، لذلك خطط للنزول مبكراً.",
    metrics: ["الرياح", "الأمواج", "السويل", "المد والجزر", "حرارة البحر", "التيار"], rising: "مد صاعد", falling: "جزر",
    hourly: "حالة اليوم بالساعة", community: "البحر أحلى مع بعض.",
    communitySub: "تقارير محلية، إجابات حقيقية، وناس بتحب البحر زيك.", members: "عضو", postsToday: "منشور اليوم",
    ask: "اسأل المجتمع...", launch: "الحسابات والنشر في المجتمع هي المرحلة التالية من التطوير.",
    safety: "التوقعات للإرشاد فقط. تحقق دائماً من الظروف المحلية وتعليمات السلامة الرسمية قبل النزول إلى المياه.",
  },
};

const fallback: Conditions = {
  air: 27, wind: 12, gust: 18, windDirection: 320, wave: .8, waveDirection: 340, wavePeriod: 6.4,
  swell: .6, swellDirection: 330, swellPeriod: 8.2, sea: 26, current: .4, currentDirection: 70,
  tide: .18, tideState: "rising", highTide: "18:42", lowTide: "11:16", sunrise: "06:31", sunset: "19:28",
  hourly: [
    { time: "06:00", wind: 8, wave: .5, swell: .4 }, { time: "09:00", wind: 10, wave: .6, swell: .5 },
    { time: "12:00", wind: 14, wave: .8, swell: .6 }, { time: "15:00", wind: 18, wave: 1.1, swell: .8 },
    { time: "18:00", wind: 15, wave: .9, swell: .7 }, { time: "21:00", wind: 11, wave: .7, swell: .5 },
  ],
};

const compass = (degrees: number) => ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(degrees / 45) % 8];
const shortTime = (value?: string) => value ? new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }) : "—";
function calculateScore(c: Conditions, activity: Activity) {
  if (activity === "fishing") return Math.round(Math.max(18, 100 - c.wind * 1.5 - c.wave * 18 + (c.tideState === "rising" ? 9 : 3)));
  if (activity === "surfing") return Math.round(Math.max(20, Math.min(96, 42 + c.swell * 22 + c.swellPeriod * 2.2 - Math.max(0, c.wind - 14) * 1.4)));
  return Math.round(Math.max(10, 100 - c.wind * 2.2 - c.gust * .7 - c.wave * 27 - c.current * 12));
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [activity, setActivity] = useState<Activity>("fishing");
  const [spotId, setSpotId] = useState("alex");
  const [conditions, setConditions] = useState<Conditions>(fallback);
  const [loading, setLoading] = useState(true);
  const [dataStatus, setDataStatus] = useState<"live" | "sample">("sample");
  const t = copy[language];
  const rtl = language === "ar";
  const spot = spots.find((item) => item.id === spotId) ?? spots[0];

  useEffect(() => {
    const controller = new AbortController();
    async function loadConditions() {
      setLoading(true);
      try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${spot.lat}&longitude=${spot.lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=wind_speed_10m&daily=sunrise,sunset&timezone=auto&forecast_days=2`;
        const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${spot.lat}&longitude=${spot.lon}&current=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_direction,swell_wave_period,sea_surface_temperature,ocean_current_velocity,ocean_current_direction,sea_level_height_msl&hourly=wave_height,swell_wave_height,sea_level_height_msl&timezone=auto&forecast_days=2`;
        const [weatherRes, marineRes] = await Promise.all([fetch(weatherUrl, { signal: controller.signal }), fetch(marineUrl, { signal: controller.signal })]);
        if (!weatherRes.ok || !marineRes.ok) throw new Error("Forecast unavailable");
        const weather = await weatherRes.json();
        const marine = await marineRes.json();
        const currentIndex = Math.max(0, weather.hourly.time.findIndex((x: string) => x >= weather.current.time));
        const tideValues: number[] = marine.hourly.sea_level_height_msl ?? [];
        const dayValues = tideValues.slice(currentIndex, currentIndex + 24);
        const highIndex = dayValues.indexOf(Math.max(...dayValues));
        const lowIndex = dayValues.indexOf(Math.min(...dayValues));
        const tideNow = marine.current.sea_level_height_msl ?? tideValues[currentIndex] ?? 0;
        const tideNext = tideValues[currentIndex + 1] ?? tideNow;
        const hours = [0, 3, 6, 9, 12, 15].map((offset) => ({
          time: shortTime(weather.hourly.time[currentIndex + offset]), wind: weather.hourly.wind_speed_10m[currentIndex + offset] ?? 0,
          wave: marine.hourly.wave_height[currentIndex + offset] ?? 0, swell: marine.hourly.swell_wave_height[currentIndex + offset] ?? 0,
        }));
        setConditions({
          air: weather.current.temperature_2m ?? 0, wind: weather.current.wind_speed_10m ?? 0,
          gust: weather.current.wind_gusts_10m ?? 0, windDirection: weather.current.wind_direction_10m ?? 0,
          wave: marine.current.wave_height ?? 0, waveDirection: marine.current.wave_direction ?? 0,
          wavePeriod: marine.current.wave_period ?? 0, swell: marine.current.swell_wave_height ?? 0,
          swellDirection: marine.current.swell_wave_direction ?? 0, swellPeriod: marine.current.swell_wave_period ?? 0,
          sea: marine.current.sea_surface_temperature ?? 0, current: marine.current.ocean_current_velocity ?? 0,
          currentDirection: marine.current.ocean_current_direction ?? 0, tide: tideNow,
          tideState: tideNext >= tideNow ? "rising" : "falling",
          highTide: shortTime(marine.hourly.time[currentIndex + Math.max(0, highIndex)]),
          lowTide: shortTime(marine.hourly.time[currentIndex + Math.max(0, lowIndex)]),
          sunrise: shortTime(weather.daily.sunrise?.[0]), sunset: shortTime(weather.daily.sunset?.[0]), hourly: hours,
        });
        setDataStatus("live");
      } catch (error) {
        if ((error as Error).name !== "AbortError") { setConditions(fallback); setDataStatus("sample"); }
      } finally { setLoading(false); }
    }
    loadConditions();
    return () => controller.abort();
  }, [spot.lat, spot.lon]);

  const score = useMemo(() => calculateScore(conditions, activity), [conditions, activity]);
  const rating = score >= 72 ? t.good : score >= 48 ? t.caution : t.difficult;
  const scoreClass = score >= 72 ? "score-good" : score >= 48 ? "score-caution" : "score-poor";
  const metricValues = [`${conditions.wind.toFixed(0)} km/h`, `${conditions.wave.toFixed(1)} m`, `${conditions.swell.toFixed(1)} m`, conditions.tideState === "rising" ? t.rising : t.falling, `${conditions.sea.toFixed(0)}°`, `${conditions.current.toFixed(1)} km/h`];
  const metricSubs = [`${compass(conditions.windDirection)} · ${conditions.gust.toFixed(0)} gust`, `${conditions.wavePeriod.toFixed(1)}s · ${compass(conditions.waveDirection)}`, `${conditions.swellPeriod.toFixed(1)}s · ${compass(conditions.swellDirection)}`, `H ${conditions.highTide} · L ${conditions.lowTide}`, `${conditions.air.toFixed(0)}° ${rtl ? "هواء" : "air"}`, `${compass(conditions.currentDirection)} ${rtl ? "الاتجاه" : "direction"}`];
  const metricIcons = [Wind, Waves, Waves, ArrowDown, Thermometer, Navigation];

  return (
    <main dir={rtl ? "rtl" : "ltr"} className={`site-shell ${rtl ? "font-arabic" : ""}`}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Alex Fisher home"><span className="brand-mark"><Waves size={22} /></span><span>ALEX <strong>FISHER</strong><small>SEA CONDITIONS</small></span></a>
        <nav aria-label="Main navigation">{t.nav.map((item, index) => <a key={item} href={index === 2 ? "#community" : index === 3 ? "#shop" : "#conditions"}>{item}</a>)}</nav>
        <div className="header-actions"><button className="icon-button" aria-label="Notifications"><Bell size={18} /></button><button className="language-button" onClick={() => setLanguage(language === "en" ? "ar" : "en")}><Languages size={17} /> {language === "en" ? "العربية" : "EN"}</button></div>
      </header>

      <section id="top" className="hero">
        <div className="hero-copy"><p className="eyebrow"><span /> {t.eyebrow}</p><h1>{t.titleA}<br /><em>{t.titleB}</em></h1><p className="hero-subtitle">{t.subtitle}</p></div>
        <div className="location-panel">
          <label htmlFor="location"><MapPin size={18} /> {t.where}</label>
          <div className="location-select-wrap"><Search size={19} /><select id="location" value={spotId} onChange={(event) => setSpotId(event.target.value)}>{spots.map((item) => <option key={item.id} value={item.id}>{rtl ? item.ar : item.en}</option>)}</select><ChevronRight size={19} className={rtl ? "flip" : ""} /></div>
          <p><span className={dataStatus === "live" ? "live-dot" : "sample-dot"} /> {dataStatus === "live" ? `${t.live} · ${t.updated}` : "Preview data"}</p>
        </div>
      </section>

      <section id="conditions" className="dashboard-wrap">
        <Tabs value={activity} onValueChange={(value) => setActivity(value as Activity)} className="activity-tabs"><TabsList><TabsTrigger value="fishing"><Fish size={19} /> {t.activities.fishing}</TabsTrigger><TabsTrigger value="surfing"><Waves size={19} /> {t.activities.surfing}</TabsTrigger><TabsTrigger value="kayaking"><ShipWheel size={19} /> {t.activities.kayaking}</TabsTrigger></TabsList></Tabs>
        <div className={`condition-board ${loading ? "is-loading" : ""}`}>
          <article className="score-card">
            <div className="score-head"><span>{t.activities[activity]} {t.score}</span><Gauge size={20} /></div>
            <div className={`score-ring ${scoreClass}`} style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}><div><strong>{score}</strong><span>/100</span></div></div>
            <h2>{rating}</h2><p>{t.window}</p><strong className="best-time">06:00 — 10:00</strong>
            <div className="sun-times"><span><Sunrise size={16} /> {conditions.sunrise}</span><span>{conditions.sunset} <ArrowUpRight size={16} /></span></div>
          </article>
          <div className="metrics-grid">
            {t.metrics.map((label, index) => { const Icon = metricIcons[index]; return <article className="metric-card" key={label}><div className="metric-icon"><Icon size={20} /></div><div><p>{label}</p><strong>{metricValues[index]}</strong><span>{metricSubs[index]}</span></div></article>; })}
            <article className="insight-card"><div><Sparkles size={20} /></div><div><p>{t.insight}</p><strong>{t.insightText}</strong></div></article>
          </div>
        </div>
        <div className="hourly-card"><div className="section-title"><div><p>{rtl ? spot.ar : spot.en}</p><h2>{t.hourly}</h2></div><Compass size={27} /></div><div className="hourly-row">{conditions.hourly.map((hour, index) => <div className={`hour ${index === 0 ? "active" : ""}`} key={`${hour.time}-${index}`}><span>{index === 0 ? (rtl ? "الآن" : "NOW") : hour.time}</span><Wind size={18} style={{ transform: `rotate(${conditions.windDirection}deg)` }} /><strong>{hour.wind.toFixed(0)}<small> km/h</small></strong><div className="wave-line" style={{ height: `${Math.max(8, hour.wave * 24)}px` }} /><p>{hour.wave.toFixed(1)}m · {hour.swell.toFixed(1)}m</p></div>)}</div></div>
      </section>

      <section id="community" className="community-section">
        <div className="community-heading"><p className="eyebrow"><span /> ALEX FISHER COMMUNITY</p><h2>{t.community}</h2><p>{t.communitySub}</p></div>
        <div className="community-layout">
          <div className="group-list">{[
            { icon: Fish, name: t.activities.fishing, members: "12.4K", posts: 84, color: "cyan" },
            { icon: Waves, name: t.activities.surfing, members: "4.8K", posts: 31, color: "coral" },
            { icon: ShipWheel, name: t.activities.kayaking, members: "3.1K", posts: 22, color: "mint" },
          ].map((group) => <article className="group-card" key={group.name}><div className={`group-icon ${group.color}`}><group.icon size={25} /></div><div><h3>{group.name}</h3><p><Users size={14} /> {group.members} {t.members} · {group.posts} {t.postsToday}</p></div><ChevronRight size={20} className={rtl ? "flip" : ""} /></article>)}</div>
          <article className="conversation-card">
            <div className="post-author"><div className="avatar">AF</div><div><strong>Alex Fisher</strong><span><MapPin size={12} /> Alexandria · 18 min</span></div><span className="verified">✓</span></div>
            <p>{rtl ? "الجو في المكس دلوقتي هادي والرياح أخف من التوقعات. حد نازل يجرب الصيد قبل الغروب؟" : "The water at El Max is calmer than forecast right now. Anyone heading out for a sunset fishing session?"}</p>
            <div className="forecast-chip"><Wind size={15} /> 10 km/h <Waves size={15} /> 0.6 m <span>78/100</span></div>
            <div className="post-actions"><button><Heart size={17} /> 128</button><button><MessageCircle size={17} /> 24</button><button><Send size={17} /></button></div>
            <div className="ask-bar"><div className="avatar small">YOU</div><input aria-label={t.ask} placeholder={t.ask} disabled /><button disabled><Send size={16} /></button></div><p className="launch-note">{t.launch}</p>
          </article>
        </div>
      </section>

      <section id="shop" className="shop-strip"><div><Anchor size={26} /><span><small>ALEX FISHER GEAR</small><strong>{rtl ? "المتجر قريباً" : "Built for days on the water. Coming soon."}</strong></span></div><button disabled>{rtl ? "قريباً" : "SHOP COMING SOON"}</button></section>
      <footer><div className="brand"><span className="brand-mark"><Waves size={22} /></span><span>ALEX <strong>FISHER</strong></span></div><p>{t.safety}</p><span>© 2026 Alex Fisher</span></footer>
    </main>
  );
}
