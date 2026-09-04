"use client";

import { useState } from "react";
import { ArrowLeft, Backpack, ChevronRight, Fish, Languages, ShieldCheck, Shirt, ShoppingBag, Sun, Waves } from "lucide-react";

type Language = "en" | "ar";

const categories = [
  { icon: Shirt, en: "Apparel", ar: "ملابس", enText: "T-shirts and performance layers made for long days outside.", arText: "تيشيرتات وطبقات عملية لأيام البحر الطويلة.", color: "coral" },
  { icon: Sun, en: "Sun Protection", ar: "الحماية من الشمس", enText: "Hats, sleeves and coverage for exposed sessions.", arText: "قبعات وأكمام وحماية للجلسات تحت الشمس.", color: "gold" },
  { icon: Fish, en: "Fishing Gear", ar: "معدات الصيد", enText: "Selected hooks, lures and practical fishing tools.", arText: "سنار وطعوم صناعية وأدوات صيد مختارة.", color: "mint" },
  { icon: Waves, en: "Water Essentials", ar: "مستلزمات البحر", enText: "Useful accessories for fishing, surfing and kayaking.", arText: "إكسسوارات مفيدة للصيد والسيرف والكاياك.", color: "blue" },
];

const plannedProducts = [
  { en: "AlexFisher performance T-shirt", ar: "تيشيرت AlexFisher رياضي", typeEn: "Apparel", typeAr: "ملابس", icon: Shirt },
  { en: "Sun-protection fishing sleeves", ar: "أكمام حماية للصيد", typeEn: "Sun protection", typeAr: "حماية من الشمس", icon: ShieldCheck },
  { en: "AlexFisher technical cap", ar: "كاب AlexFisher للبحر", typeEn: "Sun protection", typeAr: "حماية من الشمس", icon: Sun },
  { en: "Compact tackle organiser", ar: "منظم عدة صيد صغير", typeEn: "Fishing gear", typeAr: "معدات صيد", icon: Backpack },
  { en: "Curated hook and lure sets", ar: "مجموعات سنار وطعوم مختارة", typeEn: "Fishing gear", typeAr: "معدات صيد", icon: Fish },
  { en: "Dry storage essentials", ar: "مستلزمات حفظ جافة", typeEn: "Water essentials", typeAr: "مستلزمات البحر", icon: Waves },
];

export default function ShopPage() {
  const [language, setLanguage] = useState<Language>("en");
  const rtl = language === "ar";

  return <main dir={rtl ? "rtl" : "ltr"} className={`shop-page ${rtl ? "font-arabic" : ""}`}>
    <header className="learning-topbar">
      <a href="/" className="back-link"><ArrowLeft size={17} className={rtl ? "flip" : ""}/>{rtl ? "العودة لحالة البحر" : "Back to conditions"}</a>
      <a className="brand" href="/"><span className="brand-mark"><Waves size={22}/></span><span>ALEX<strong>FISHER</strong><small>GEAR SHOP</small></span></a>
      <button className="language-button" onClick={() => setLanguage(language === "en" ? "ar" : "en")}><Languages size={16}/>{language === "en" ? "العربية" : "EN"}</button>
    </header>

    <section className="shop-hero">
      <div><p>{rtl ? "متجر ALEXFISHER" : "ALEXFISHER GEAR"}</p><h1>{rtl ? "معدات للبحر. مختارة للمجتمع." : "Gear for the water. Chosen for the community."}</h1><span>{rtl ? "نجهز مجموعة عملية للصيد والسيرف والكاياك. المنتجات والشراء سيكونان متاحين هنا قريباً." : "We are preparing a practical collection for fishing, surfing and kayaking. Products and checkout will become available here soon."}</span></div>
      <div className="shop-status"><ShoppingBag size={25}/><strong>{rtl ? "قريباً" : "Coming soon"}</strong><span>{rtl ? "المتجر قيد التجهيز" : "Shop in preparation"}</span></div>
    </section>

    <section className="shop-categories">{categories.map((category) => { const Icon = category.icon; return <article className={category.color} key={category.en}><span><Icon size={23}/></span><strong>{rtl ? category.ar : category.en}</strong><p>{rtl ? category.arText : category.enText}</p><ChevronRight size={18} className={rtl ? "flip" : ""}/></article>; })}</section>

    <section className="shop-roadmap">
      <div className="shop-section-heading"><div><p>{rtl ? "قائمة الإطلاق" : "LAUNCH COLLECTION"}</p><h2>{rtl ? "منتجات نعمل عليها" : "Products in development"}</h2></div><span>{plannedProducts.length} {rtl ? "منتجات مخططة" : "planned products"}</span></div>
      <div className="planned-products">{plannedProducts.map((product) => { const Icon = product.icon; return <article key={product.en}><span><Icon size={21}/></span><div><small>{rtl ? product.typeAr : product.typeEn}</small><strong>{rtl ? product.ar : product.en}</strong></div><em>{rtl ? "قريباً" : "COMING SOON"}</em></article>; })}</div>
      <div className="shop-community-note"><div><ShoppingBag size={23}/><span><strong>{rtl ? "عايز تقترح منتج؟" : "Want to suggest a product?"}</strong><small>{rtl ? "شارك الأدوات التي تحتاجها مع مجتمع AlexFisher." : "Tell the AlexFisher community what gear would genuinely help you."}</small></span></div><a href="/community">{rtl ? "اذهب للمجتمع" : "Open community"}<ChevronRight size={17} className={rtl ? "flip" : ""}/></a></div>
    </section>
  </main>;
}
