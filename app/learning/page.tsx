"use client";

import { useState } from "react";
import { ArrowLeft, Check, ChevronRight, CircleDot, Fish, Languages, Layers3, Ruler, Sparkles, Waves } from "lucide-react";
import BottomNav from "@/components/BottomNav";

type CategoryId = "reels" | "rods" | "hooks" | "lures" | "braid" | "species";
type Language = "en" | "ar";

const fishSpecies = [
  { en: "Striped seabream (Mormora)", ar: "المرمار", enSeason: "Spring to autumn", arSeason: "من الربيع إلى الخريف", enMethod: "Light bottom fishing from shore", arMethod: "صيد قاع خفيف من الشاطئ", enBait: "Worms, shrimp or small shellfish", arBait: "دود أو جمبري أو محار صغير", enWater: "Sandy and mixed bottoms", arWater: "القاع الرملي والمختلط" },
  { en: "European seabass", ar: "القاروص", enSeason: "Autumn and winter", arSeason: "الخريف والشتاء", enMethod: "Spinning near surf, rocks and harbour mouths", arMethod: "سبيننج قرب الأمواج والصخور ومداخل الموانئ", enBait: "Minnow lures, soft plastics or live bait", arBait: "مينو أو سيليكون أو طُعم حي", enWater: "White water and current lines", arWater: "المياه المتكسرة وخطوط التيار" },
  { en: "Bluefish", ar: "الأنش", enSeason: "Late summer to autumn", arSeason: "أواخر الصيف والخريف", enMethod: "Fast spinning or trolling", arMethod: "سبيننج سريع أو جر", enBait: "Metal lures, minnows or oily fish", arBait: "معدن أو مينو أو سمك زيتي", enWater: "Open water around baitfish", arWater: "المياه المفتوحة حول أسراب السمك الصغير" },
  { en: "Garfish", ar: "الإبرة", enSeason: "Autumn to early spring", arSeason: "من الخريف إلى بداية الربيع", enMethod: "Float fishing close to the surface", arMethod: "صيد بالعوامة قرب سطح المياه", enBait: "Small fish strips or shrimp", arBait: "شرائح سمك صغيرة أو جمبري", enWater: "Calm surface water and harbour edges", arWater: "سطح هادئ وحواف الموانئ" },
  { en: "Grey mullet", ar: "البوري", enSeason: "Available most of the year", arSeason: "متوفر أغلب شهور السنة", enMethod: "Fine float rig with patient feeding", arMethod: "عدة عوامة خفيفة مع التزفير والصبر", enBait: "Bread mix, dough or algae", arBait: "عجينة خبز أو طحالب", enWater: "Harbours, rocks and sheltered coast", arWater: "الموانئ والصخور والسواحل الهادئة" },
  { en: "Dusky grouper", ar: "الوقار", enSeason: "Spring to autumn", arSeason: "من الربيع إلى الخريف", enMethod: "Strong bottom tackle near structure", arMethod: "عدة قاع قوية قرب الصخور والحواجز", enBait: "Live bait, squid or large soft lure", arBait: "طُعم حي أو سبيط أو سيليكون كبير", enWater: "Rocky reefs and deep structure", arWater: "الشعاب الصخرية والأماكن العميقة" },
];

const categories = [
  {
    id: "reels" as const, icon: CircleDot, color: "cyan", en: "Reels", ar: "ماكينات الصيد",
    enDesc: "Choose, set up and maintain the right reel.", arDesc: "اختار ماكينة الصيد المناسبة، جهزها وحافظ عليها.",
    enLessons: ["Reel types explained", "Reel size and line capacity", "Setting the drag correctly", "Cleaning and maintenance"],
    arLessons: ["شرح أنواع ماكينات الصيد", "حجم الماكينة وسعة الخيط", "ضبط الفرامل بشكل صحيح", "التنظيف والصيانة"],
    enGuide: ["Match reel size to rod and target fish", "Set drag to protect line and hooks", "Rinse gently after saltwater use"],
    arGuide: ["طابق حجم الماكينة مع القصبة والسمك المستهدف", "اضبط الفرامل لحماية الخيط والسنار", "اغسل الماكينة برفق بعد البحر"],
  },
  {
    id: "rods" as const, icon: Ruler, color: "coral", en: "Rods", ar: "قصبات الصيد",
    enDesc: "Understand length, power, action and casting weight.", arDesc: "افهم الطول والقوة والأكشن ووزن الرمي.",
    enLessons: ["Rod parts and terminology", "Length and casting distance", "Power versus action", "Reading the casting-weight rating"],
    arLessons: ["أجزاء القصبة والمصطلحات", "الطول ومسافة الرمي", "الفرق بين القوة والأكشن", "قراءة وزن الرمي المكتوب"],
    enGuide: ["Longer rods usually help shore casting", "Action describes where the rod bends", "Stay inside the printed casting range"],
    arGuide: ["القصبات الأطول تساعد غالباً في الرمي من الشاطئ", "الأكشن يوضح مكان انحناء القصبة", "التزم بوزن الرمي المكتوب"],
  },
  {
    id: "hooks" as const, icon: Fish, color: "mint", en: "Hooks", ar: "السنار",
    enDesc: "Select hook shape and size for bait and species.", arDesc: "اختار شكل وحجم السن المناسب للطُعم ونوع السمك.",
    enLessons: ["Hook anatomy and sizes", "J-hooks and circle hooks", "Matching hook to bait", "Checking sharpness and strength"],
    arLessons: ["أجزاء السن ومقاساته", "السن العادي والسن الدائري", "مطابقة السن مع الطُعم", "اختبار الحدة والقوة"],
    enGuide: ["Hook size must suit the bait, not only the fish", "Keep the hook point exposed when needed", "Replace rusty or damaged hooks"],
    arGuide: ["حجم السن يناسب الطُعم وليس السمكة فقط", "اترك طرف السن مكشوفاً عند الحاجة", "غير السن الصدئ أو التالف"],
  },
  {
    id: "lures" as const, icon: Sparkles, color: "gold", en: "Lures", ar: "الطعوم الصناعية",
    enDesc: "Pick lure type, colour, depth and retrieval style.", arDesc: "اختار نوع ولون وعمق الطُعم الصناعي وطريقة السحب.",
    enLessons: ["Hard lures and soft plastics", "Choosing lure colour", "Depth and water layers", "Retrieval speed and action"],
    arLessons: ["الطعوم الصلبة والسيليكون", "اختيار لون الطُعم", "العمق وطبقات المياه", "سرعة وطريقة السحب"],
    enGuide: ["Choose depth before choosing colour", "Natural colours suit clear water", "Change retrieval before changing lure"],
    arGuide: ["اختار العمق قبل اللون", "الألوان الطبيعية تناسب المياه الصافية", "غير طريقة السحب قبل تغيير الطُعم"],
  },
  {
    id: "braid" as const, icon: Layers3, color: "blue", en: "Braided Line", ar: "الخيط المجدول",
    enDesc: "Choose diameter, strength, leader and spool setup.", arDesc: "اختار القطر والقوة والليدر وطريقة تجهيز البكرة.",
    enLessons: ["Braid diameter and PE ratings", "Strength and target species", "Backing and filling the spool", "Connecting braid to leader"],
    arLessons: ["قطر الخيط وتصنيف PE", "القوة والسمك المستهدف", "الباكينج وملء البكرة", "ربط الخيط المجدول بالليدر"],
    enGuide: ["Thin braid casts farther but needs care", "Use backing to stop spool slip", "Inspect the first metres for abrasion"],
    arGuide: ["الخيط الرفيع يرمي أبعد لكنه يحتاج عناية", "استخدم باكينج لمنع دوران الخيط", "افحص أول أمتار بحثاً عن التآكل"],
  },
  {
    id: "species" as const, icon: Fish, color: "species", en: "Fish Species", ar: "أنواع الأسماك",
    enDesc: "Identify local fish, their seasons and the best way to catch them.", arDesc: "تعرف على الأسماك المحلية ومواسمها وأفضل طرق صيدها.",
    enLessons: ["Identify common Mediterranean species", "Understand seasonal movement", "Match method and tackle to each fish", "Choose bait and productive habitat"],
    arLessons: ["التعرف على أشهر أسماك البحر المتوسط", "فهم حركة الأسماك حسب الموسم", "اختيار الطريقة والعدة لكل نوع", "اختيار الطُعم والمكان المناسب"],
    enGuide: ["Seasons are a local guide, not a guarantee", "Minimum sizes and closed seasons can change", "Release undersized fish carefully"],
    arGuide: ["المواسم دليل محلي وليست ضماناً", "المقاسات القانونية ومواسم المنع قد تتغير", "أعد الأسماك الصغيرة للمياه بحرص"],
  },
];

export default function LearningPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [selected, setSelected] = useState<CategoryId>("reels");
  const rtl = language === "ar";
  const category = categories.find((item) => item.id === selected) ?? categories[0];
  const lessons = rtl ? category.arLessons : category.enLessons;
  const guide = rtl ? category.arGuide : category.enGuide;
  const Icon = category.icon;

  return <main dir={rtl ? "rtl" : "ltr"} className={`learning-page ${rtl ? "font-arabic" : ""}`}>
    <header className="learning-topbar">
      <a href="/" className="back-link"><ArrowLeft size={17}/>{rtl ? "العودة لحالة البحر" : "Back to conditions"}</a>
      <a className="brand" href="/"><span className="brand-mark"><Waves size={22}/></span><span>ALEX<strong>FISHER</strong><small>LEARNING HUB</small></span></a>
      <button className="language-button" onClick={() => setLanguage(language === "en" ? "ar" : "en")}><Languages size={16}/>{language === "en" ? "العربية" : "EN"}</button>
    </header>

    <section className="learning-hero">
      <div><p>{rtl ? "تعلم الصيد خطوة بخطوة" : "LEARN FISHING, STEP BY STEP"}</p><h1>{rtl ? "افهم أدواتك. اصطاد بثقة." : "Know your gear. Fish with confidence."}</h1><span>{rtl ? "دروس واضحة تساعدك على اختيار وتجهيز واستخدام معدات الصيد بشكل صحيح." : "Clear learning paths to help you choose, set up and use fishing equipment correctly."}</span></div>
      <div className="learning-stat"><strong>6</strong><span>{rtl ? "مسارات تعليمية" : "learning paths"}</span></div>
    </section>

    <section className="learning-categories">
      {categories.map((item) => { const ItemIcon = item.icon; return <button key={item.id} className={`${item.color} ${selected === item.id ? "active" : ""}`} onClick={() => setSelected(item.id)}><span><ItemIcon size={23}/></span><strong>{rtl ? item.ar : item.en}</strong><small>{rtl ? item.arDesc : item.enDesc}</small><ChevronRight size={18} className={rtl ? "flip" : ""}/></button>; })}
    </section>

    <section className="learning-detail">
      <div className={`course-summary ${category.color}`}><div className="course-icon"><Icon size={32}/></div><p>{rtl ? "مسار تعليمي" : "LEARNING PATH"}</p><h2>{rtl ? category.ar : category.en}</h2><span>{rtl ? category.arDesc : category.enDesc}</span><div className="course-progress"><div><i style={{ width: "0%" }}/></div><small>{rtl ? "جاهز لإضافة فيديوهات AlexFisher" : "Ready for AlexFisher videos"}</small></div></div>
      <div className={`lessons-panel ${selected === "species" ? "species-panel" : ""}`}>
        <div className="lessons-heading"><div><p>{selected === "species" ? (rtl ? "دليل الأسماك" : "FISH GUIDE") : (rtl ? "محتوى المسار" : "COURSE CONTENT")}</p><h2>{selected === "species" ? (rtl ? "اعرف السمكة قبل ما تصطادها" : "Know your target fish") : (rtl ? "ابدأ من الأساسيات" : "Start with the essentials")}</h2></div><span>{selected === "species" ? fishSpecies.length : lessons.length} {selected === "species" ? (rtl ? "أنواع" : "species") : (rtl ? "دروس" : "lessons")}</span></div>
        {selected === "species" ? <div className="species-grid">{fishSpecies.map((fish) => <article key={fish.en}>
          <div className="species-card-head"><span><Fish size={17}/></span><div><small>{rtl ? "سمك البحر المتوسط" : "MEDITERRANEAN FISH"}</small><h3>{rtl ? fish.ar : fish.en}</h3></div></div>
          <dl><div><dt>{rtl ? "الموسم" : "Season"}</dt><dd>{rtl ? fish.arSeason : fish.enSeason}</dd></div><div><dt>{rtl ? "طريقة الصيد" : "Method"}</dt><dd>{rtl ? fish.arMethod : fish.enMethod}</dd></div><div><dt>{rtl ? "الطُعم" : "Bait"}</dt><dd>{rtl ? fish.arBait : fish.enBait}</dd></div><div><dt>{rtl ? "المكان" : "Habitat"}</dt><dd>{rtl ? fish.arWater : fish.enWater}</dd></div></dl>
        </article>)}</div> : <div className="lesson-list">{lessons.map((lesson, index) => <article key={lesson}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{lesson}</strong><small>{rtl ? "درس أساسي" : "Essential lesson"}</small></div><em>{rtl ? "قريباً" : "COMING SOON"}</em></article>)}</div>}
        <div className="quick-guide"><p>{rtl ? "دليل سريع" : "QUICK GUIDE"}</p>{guide.map((tip) => <div key={tip}><Check size={15}/><span>{tip}</span></div>)}</div>
      </div>
    </section>
    <BottomNav active="learning" />
  </main>;
}
