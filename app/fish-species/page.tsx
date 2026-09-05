"use client";

import Link from "next/link";
import {useMemo,useState} from "react";
import {ArrowLeft,Fish,Languages,MapPin,Search,Shell,SunMedium,Waves} from "lucide-react";
import BottomNav from "@/components/BottomNav";

type Language="en"|"ar";
const species=[
  {en:"Striped seabream (Mormora)",ar:"المرمار",enSeason:"Spring to autumn",arSeason:"من الربيع إلى الخريف",enMethod:"Light bottom fishing from shore",arMethod:"صيد قاع خفيف من الشاطئ",enBait:"Worms, shrimp or small shellfish",arBait:"دود أو جمبري أو محار صغير",enWater:"Sandy and mixed bottoms",arWater:"القاع الرملي والمختلط"},
  {en:"European seabass",ar:"القاروص",enSeason:"Autumn and winter",arSeason:"الخريف والشتاء",enMethod:"Spinning near surf, rocks and harbour mouths",arMethod:"سبيننج قرب الأمواج والصخور ومداخل الموانئ",enBait:"Minnow lures, soft plastics or live bait",arBait:"مينو أو سيليكون أو طُعم حي",enWater:"White water and current lines",arWater:"المياه المتكسرة وخطوط التيار"},
  {en:"Bluefish",ar:"الأنش",enSeason:"Late summer to autumn",arSeason:"أواخر الصيف والخريف",enMethod:"Fast spinning or trolling",arMethod:"سبيننج سريع أو جر",enBait:"Metal lures, minnows or oily fish",arBait:"معدن أو مينو أو سمك زيتي",enWater:"Open water around baitfish",arWater:"المياه المفتوحة حول أسراب السمك الصغير"},
  {en:"Garfish",ar:"الإبرة",enSeason:"Autumn to early spring",arSeason:"من الخريف إلى بداية الربيع",enMethod:"Float fishing close to the surface",arMethod:"صيد بالعوامة قرب سطح المياه",enBait:"Small fish strips or shrimp",arBait:"شرائح سمك صغيرة أو جمبري",enWater:"Calm surface water and harbour edges",arWater:"سطح هادئ وحواف الموانئ"},
  {en:"Grey mullet",ar:"البوري",enSeason:"Available most of the year",arSeason:"متوفر أغلب شهور السنة",enMethod:"Fine float rig with patient feeding",arMethod:"عدة عوامة خفيفة مع التزفير والصبر",enBait:"Bread mix, dough or algae",arBait:"عجينة خبز أو طحالب",enWater:"Harbours, rocks and sheltered coast",arWater:"الموانئ والصخور والسواحل الهادئة"},
  {en:"Dusky grouper",ar:"الوقار",enSeason:"Spring to autumn",arSeason:"من الربيع إلى الخريف",enMethod:"Strong bottom tackle near structure",arMethod:"عدة قاع قوية قرب الصخور والحواجز",enBait:"Live bait, squid or large soft lure",arBait:"طُعم حي أو سبيط أو سيليكون كبير",enWater:"Rocky reefs and deep structure",arWater:"الشعاب الصخرية والأماكن العميقة"},
];

export default function FishSpeciesPage(){
  const[language,setLanguage]=useState<Language>("en"),[query,setQuery]=useState("");
  const rtl=language==="ar",filtered=useMemo(()=>species.filter(item=>`${item.en} ${item.ar} ${item.enWater} ${item.arWater}`.toLowerCase().includes(query.toLowerCase())),[query]);
  return <main dir={rtl?"rtl":"ltr"} className={`species-page ${rtl?"font-arabic":""}`}>
    <header className="matcher-topbar"><Link href="/fishing-hub" className="back-link"><ArrowLeft/>{rtl?"العودة لمركز الصيد":"Back to Fishing Hub"}</Link><Link className="brand" href="/"><span className="brand-mark"><Waves/></span><span>ALEX<strong>FISHER</strong><small>SPECIES GUIDE</small></span></Link><button className="language-button" onClick={()=>setLanguage(rtl?"en":"ar")}><Languages/>{rtl?"EN":"العربية"}</button></header>
    <section className="species-hero"><div><p>{rtl?"أداة التعرف على الأسماك":"FISHING HUB TOOL"}</p><h1>{rtl?"اعرف السمكة قبل أن تصطادها.":"Know your target before you cast."}</h1><span>{rtl?"دليل سريع لأسماك البحر المتوسط الشائعة ومواسمها وبيئتها والعدة التي تبدأ بها.":"A practical guide to common Mediterranean species, their seasons, habitat, bait and the method to try first."}</span></div><Fish/></section>
    <section className="species-tool"><header><div><p>{rtl?"دليل الأسماك":"SPECIES LIBRARY"}</p><h2>{rtl?"أسماك الساحل المحلي":"Local coastal fish"}</h2></div><label><Search/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={rtl?"ابحث عن سمكة أو بيئة":"Search fish or habitat"}/></label></header><div className="species-tool-grid">{filtered.map(item=><article key={item.en}><div><span><Fish/></span><small>{rtl?"سمك البحر المتوسط":"MEDITERRANEAN FISH"}</small><h3>{rtl?item.ar:item.en}</h3></div><dl><div><dt><SunMedium/>{rtl?"الموسم":"Season"}</dt><dd>{rtl?item.arSeason:item.enSeason}</dd></div><div><dt><Waves/>{rtl?"الطريقة":"Method"}</dt><dd>{rtl?item.arMethod:item.enMethod}</dd></div><div><dt><Shell/>{rtl?"الطُعم":"Bait"}</dt><dd>{rtl?item.arBait:item.enBait}</dd></div><div><dt><MapPin/>{rtl?"البيئة":"Habitat"}</dt><dd>{rtl?item.arWater:item.enWater}</dd></div></dl></article>)}</div>{!filtered.length&&<div className="species-empty"><Search/><h3>{rtl?"لا توجد نتيجة":"No matching species"}</h3><button onClick={()=>setQuery("")}>{rtl?"مسح البحث":"Clear search"}</button></div>}</section>
    <aside className="species-note"><strong>{rtl?"ملاحظة مهمة":"Responsible fishing note"}</strong><span>{rtl?"المواسم هنا دليل محلي وليست ضماناً. راجع المقاسات القانونية ومواسم المنع الحالية وأعد الأسماك الصغيرة للمياه بحرص.":"These seasons are a local guide, not a guarantee. Check current minimum sizes and closed seasons, and release undersized fish carefully."}</span></aside>
    <BottomNav active="fishing-hub"/>
  </main>
}
