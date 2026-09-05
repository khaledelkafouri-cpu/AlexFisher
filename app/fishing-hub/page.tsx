"use client";

import { useEffect, useState } from "react";
import { Anchor, ArrowLeft, ChevronRight, Fish, Languages, ScanLine, Sparkles, Target, Waves } from "lucide-react";
import BottomNav from "@/components/BottomNav";

type Language = "en" | "ar";

export default function FishingHubPage() {
  const [language, setLanguage] = useState<Language>("en");
  const rtl = language === "ar";

  useEffect(() => {
    const saved = window.localStorage.getItem("alexfisher-language");
    if (saved === "ar" || saved === "en") setLanguage(saved);
  }, []);

  const toggleLanguage = () => {
    const next = rtl ? "en" : "ar";
    setLanguage(next);
    window.localStorage.setItem("alexfisher-language", next);
  };

  const tools = [
    {
      href: "/tackle-matcher",
      icon: Target,
      number: "01",
      title: rtl ? "مطابقة العدة" : "Tackle Matcher",
      description: rtl
        ? "طابق القصبة والماكينة والخيط والليدر مع طريقة الصيد والسمكة المستهدفة."
        : "Match your rod, reel, braid and leader to your fishing style and target fish.",
      action: rtl ? "ابنِ عدتك" : "Build your setup",
    },
    {
      href: "/lure-selector",
      icon: Fish,
      number: "02",
      title: rtl ? "اختيار الطُعم والجيج" : "Lure & Jig Selector",
      description: rtl
        ? "اختر نوع الطُعم أو الجيج والوزن واللون والحركة حسب الظروف."
        : "Choose the lure or jig type, weight, color and action for the conditions.",
      action: rtl ? "اختر الطُعم" : "Choose your lure",
    },
    {
      href: "/hook-matcher",
      icon: Anchor,
      number: "03",
      title: rtl ? "دليل اختيار الخطاف" : "Hook Matcher",
      description: rtl
        ? "اختر نوع الخطاف وحجمه وقوته وموضعه، وافهم لماذا يناسب طريقتك والسمكة المستهدفة."
        : "Choose the hook type, size, strength and position—and understand why it fits your target and technique.",
      action: rtl ? "اختر الخطاف" : "Match your hook",
    },
    {
      href: "/read-my-spot",
      icon: ScanLine,
      number: "04",
      title: rtl ? "حلّل مكان الصيد" : "Read My Fishing Spot",
      description: rtl
        ? "ارفع صورة للمكان وحدد مناطق الرمي المحتملة والعوائق وطريقة الصيد والطُعم الذي تبدأ به."
        : "Upload a spot photo to explore possible cast zones, snags, fishing styles and what to try first.",
      action: rtl ? "حلّل المكان" : "Read my spot",
    },
  ];

  return (
    <main dir={rtl ? "rtl" : "ltr"} className={`fishing-hub-page ${rtl ? "font-arabic" : ""}`}>
      <header className="matcher-topbar">
        <a href="/" className="back-link"><ArrowLeft size={17}/>{rtl ? "العودة لحالة البحر" : "Back to conditions"}</a>
        <a className="brand" href="/"><span className="brand-mark"><Waves size={22}/></span><span>ALEX<strong>FISHER</strong><small>FISHING HUB</small></span></a>
        <nav><a href="/learning">{rtl ? "تعلم" : "Learning"}</a><a href="/community">{rtl ? "المجتمع" : "Community"}</a><a href="/shop">{rtl ? "المتجر" : "Shop"}</a></nav>
        <button className="language-button" onClick={toggleLanguage}><Languages size={16}/>{rtl ? "EN" : "العربية"}</button>
      </header>

      <section className="fishing-hub-head">
        <p><Sparkles size={15}/>{rtl ? "أدوات الصيد" : "FISHING TOOLS"}</p>
        <h1>{rtl ? "مركز الصيد" : "Fishing Hub"}</h1>
        <span>{rtl ? "اختر الأداة التي تحتاجها الآن." : "Choose the tool you need now."}</span>
      </section>

      <section className="fishing-hub-tools" aria-label={rtl ? "أدوات الصيد" : "Fishing tools"}>
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <a href={tool.href} key={tool.href} className="fishing-tool-card">
              <div className="fishing-tool-icon"><Icon size={29}/></div>
              <span className="fishing-tool-number">{tool.number}</span>
              <h2>{tool.title}</h2>
              <p>{tool.description}</p>
              <strong>{tool.action}<ChevronRight size={18} className={rtl ? "flip" : ""}/></strong>
            </a>
          );
        })}
      </section>
      <BottomNav active="fishing-hub" />
    </main>
  );
}
