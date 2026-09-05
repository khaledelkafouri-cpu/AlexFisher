"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, CircleDot, Fish, Gauge, Languages, Layers3, MapPin, Navigation, Ruler, Search, ShieldCheck, Sparkles, Waves } from "lucide-react";
import { coastalCountries, seasForLocation } from "@/lib/coastal-locations";
import BottomNav from "@/components/BottomNav";
import { fish, type FishProfile, type StyleId } from "@/lib/fish-species";

type Language = "en" | "ar";
type Mode = "build" | "reel" | "rod";
type EnvironmentId = "sand" | "open" | "rocks" | "reef" | "harbour" | "structure" | "deep";

const styles = [
  { id:"surf" as const, en:"Surf Fishing", ar:"صيد الشاطئ", note:"Long casting rods · bait & sinker" },
  { id:"casting" as const, en:"Casting / Spinning", ar:"كاستنج / سبيننج", note:"Lures · mobile shore fishing" },
  { id:"popping" as const, en:"Popping", ar:"بوبينج", note:"Poppers · stickbaits · strong drag" },
  { id:"shore-jig" as const, en:"Shore Jigging", ar:"شور جيجنج", note:"Metal jigs · distance · powerful fish" },
  { id:"boat-jig" as const, en:"Boat Jigging", ar:"بوت جيجنج", note:"Vertical jigs · depth & current" },
];
const environments = [
  { id:"sand" as const, en:"Sandy beach", ar:"شاطئ رملي" }, { id:"open" as const, en:"Open water", ar:"مياه مفتوحة" },
  { id:"rocks" as const, en:"Rocks", ar:"صخور" }, { id:"reef" as const, en:"Reef", ar:"شعاب" },
  { id:"harbour" as const, en:"Harbour / breakwater", ar:"ميناء / حاجز أمواج" }, { id:"structure" as const, en:"Heavy structure", ar:"عوائق قوية" },
  { id:"deep" as const, en:"Deep water", ar:"مياه عميقة" },
];
const sizeBands = ["Under 1 kg","1–3 kg","3–5 kg","5–10 kg","10–20 kg","20–40 kg","40–60 kg","60 kg+"];
const sizeMidpoints = [0.7,2,4,7.5,15,30,50,70];
const peValues = [0.6,0.8,1,1.2,1.5,2,2.5,3,4,5,6,8,10];
const fightBands = [
  { id:"low" as const, value:3, en:"Light fighter", ar:"مقاومة خفيفة" },
  { id:"medium" as const, value:6, en:"Medium fighter", ar:"مقاومة متوسطة" },
  { id:"high" as const, value:9, en:"Hard fighter", ar:"مقاومة قوية" },
];

const nearestPe = (value:number) => peValues.reduce((best, item) => Math.abs(item-value)<Math.abs(best-value)?item:best,peValues[0]);
const peLb = (pe:number) => Math.round(pe * 18);
const styleIndex = (id:StyleId) => styles.findIndex((item)=>item.id===id);
const reelRangeFor = (required:number) => required<=.8?"2500–3000":required<=1.2?"3000–4000":required<=1.5?"4000–5000":required<=2?"5000–6000":required<=3?"6000–8000":required<=4?"8000–10000":required<=6?"10000–14000":"14000–18000";

export default function TackleMatcherPage(){
  const [language,setLanguage]=useState<Language>("en");
  const [step,setStep]=useState(0);
  const [mode,setMode]=useState<Mode>("build");
  const [countryId,setCountryId]=useState(coastalCountries[0].id);
  const [cityId,setCityId]=useState(coastalCountries[0].cities[0].id);
  const [spotId,setSpotId]=useState(coastalCountries[0].cities[0].spots[0].id);
  const [style,setStyle]=useState<StyleId>("casting");
  const [fishId,setFishId]=useState("bluefish");
  const [fishSearch,setFishSearch]=useState("");
  const [customFishName,setCustomFishName]=useState("");
  const [customFight,setCustomFight]=useState(6);
  const [sizeIndex,setSizeIndex]=useState(2);
  const [environment,setEnvironment]=useState<EnvironmentId[]>(["open"]);
  const [ownedReel,setOwnedReel]=useState(4000);
  const [rodLength,setRodLength]=useState(2.7);
  const [rodPeMin,setRodPeMin]=useState(1);
  const [rodPeMax,setRodPeMax]=useState(2);
  const [depth,setDepth]=useState("20–40 m");
  const [current,setCurrent]=useState("Medium");
  const rtl=language==="ar";
  const country=coastalCountries.find((item)=>item.id===countryId)??coastalCountries[0];
  const city=country.cities.find((item)=>item.id===cityId)??country.cities[0];
  const seas=useMemo(()=>seasForLocation(country.id,city.id),[country.id,city.id]);
  useEffect(()=>{const saved=window.localStorage.getItem("alexfisher-language");if(saved==="ar"||saved==="en")setLanguage(saved);const params=new URLSearchParams(window.location.search);const nextStyle=params.get("style");const nextFish=params.get("fish");const nextSize=params.get("size");const nextCountry=params.get("country");const nextCity=params.get("city");if(styles.some(item=>item.id===nextStyle))setStyle(nextStyle as StyleId);if(nextFish)setFishId(nextFish);if(nextSize){const index=sizeBands.indexOf(nextSize);if(index>=0)setSizeIndex(index)}if(nextCountry){const foundCountry=coastalCountries.find(item=>item.id===nextCountry);if(foundCountry){setCountryId(foundCountry.id);const foundCity=nextCity?foundCountry.cities.find(item=>item.id===nextCity):undefined;const useCity=foundCity??foundCountry.cities[0];setCityId(useCity.id);setSpotId(useCity.spots[0].id)}}},[]);
  const toggleLanguage=()=>{const next=language==="en"?"ar":"en";setLanguage(next);window.localStorage.setItem("alexfisher-language",next)};
  const availableFish=useMemo(()=>fish.filter((item)=>item.regions.some(r=>seas.includes(r))&&item.styles.includes(style)&&(`${item.en} ${item.ar}`).toLowerCase().includes(fishSearch.toLowerCase())),[seas,style,fishSearch]);
  useEffect(()=>{if(fishId==="other")return;const valid=fish.find((item)=>item.id===fishId&&item.regions.some(r=>seas.includes(r))&&item.styles.includes(style));if(!valid){const first=fish.find((item)=>item.regions.some(r=>seas.includes(r))&&item.styles.includes(style));if(first)setFishId(first.id)}},[seas,style,fishId]);
  const target:FishProfile=fishId==="other"
    ? {id:"other",en:customFishName.trim()||(rtl?"سمكة أخرى":"Custom fish"),ar:customFishName.trim()||"سمكة أخرى",scientific:"",regions:[],styles:[],fight:customFight,tackle:rtl?"يعتمد على نوع السمكة — استشر متجر الصيد المحلي":"Depends on the species — check with a local tackle shop"}
    : fish.find((item)=>item.id===fishId)??fish[0];
  const recommendation=useMemo(()=>{
    const weight=sizeMidpoints[sizeIndex];
    const harsh=environment.filter((item)=>["rocks","reef","structure"].includes(item)).length;
    const styleBoost={surf:0,casting:0,popping:1.2,"shore-jig":.8,"boat-jig":1}[style];
    const required=nearestPe(Math.max(.6,Math.min(10,.45+weight/13+target.fight/7+styleBoost+harsh*.35)));
    const reelRange=reelRangeFor(required);
    const recommendedReel=required<=.8?2500:required<=1.2?3000:required<=1.5?4000:required<=2?5000:required<=3?6000:required<=4?8000:required<=6?10000:14000;
    const rod={surf:"3.6–4.2 m",casting:"2.4–3.0 m",popping:"2.4–2.7 m","shore-jig":"2.7–3.3 m","boat-jig":"1.5–1.9 m"}[style];
    const weights={surf:"80–160 g casting / sinker",casting:"15–50 g lure",popping:"50–120 g popper / stickbait","shore-jig":"30–80 g jig","boat-jig":current==="Strong"?"150–300 g jig":depth.includes("100")?"180–300 g jig":"80–180 g jig"}[style];
    const braid=peLb(required), leader=Math.round((braid*(target.abrasion||harsh?1.55:1.2))/5)*5;
    const leaderLow=Math.max(5,Math.round((leader*0.85)/5)*5), leaderHigh=Math.round((leader*1.15)/5)*5;
    let score=96; const notes:string[]=[];
    if(mode==="reel"&&ownedReel<recommendedReel){score-=18;notes.push(`Your ${ownedReel} reel may have limited capacity and drag for this target.`)}
    if(mode==="rod"&&(required<rodPeMin||required>rodPeMax)){score-=22;notes.push(`PE ${required} sits outside your rod's PE ${rodPeMin}–${rodPeMax} rating.`)}
    if(target.id==="other")notes.push(rtl?"لم نحدد قوة مقاومة دقيقة لهذه السمكة — استخدم وزنها المتوقع وخبرتك المحلية لضبط الاختيار.":"We don't have an exact fight rating for this fish — use its expected weight and local knowledge to fine-tune this.");
    if(target.toothed)notes.push("Use heavy fluorocarbon or an optional short wire trace because this fish has sharp teeth.");
    if(harsh)notes.push("Leader strength is increased because rocks, reef or heavy structure add abrasion risk.");
    return {required,reelRange,recommendedReel,rod,weights,braid,leader,leaderLow,leaderHigh,score:Math.max(55,score),notes};
  },[sizeIndex,environment,style,target,mode,ownedReel,rodPeMin,rodPeMax,depth,current,rtl]);
  const steps=rtl?["ابدأ","الموقع","الطريقة","السمكة","الحجم","البيئة","النتيجة"]:["Start","Location","Style","Fish","Size","Environment","Result"];
  const canNext=step!==3||Boolean(target);
  const pickEnvironment=(id:EnvironmentId)=>setEnvironment((items)=>items.includes(id)?items.filter((item)=>item!==id):[...items,id]);
  const status=recommendation.score>=90?(rtl?"تطابق ممتاز":"Excellent Match"):recommendation.score>=75?(rtl?"جيد / قابل للاستخدام":"Good / Usable"):(rtl?"غير مثالي":"Not Ideal");

  return <main dir={rtl?"rtl":"ltr"} className={`matcher-page ${rtl?"font-arabic":""}`}>
    <header className="matcher-topbar"><a href="/fishing-hub" className="back-link"><ArrowLeft size={17}/>{rtl?"العودة لمركز الصيد":"Back to Fishing Hub"}</a><a className="brand" href="/"><span className="brand-mark"><Waves size={22}/></span><span>ALEX<strong>FISHER</strong><small>TACKLE MATCHER</small></span></a><nav><a href="/fishing-hub">{rtl?"مركز الصيد":"Fishing Hub"}</a><a href="/learning">{rtl?"تعلم":"Learning"}</a><a href="/community">{rtl?"المجتمع":"Community"}</a></nav><button className="language-button" onClick={toggleLanguage}><Languages size={16}/>{language==="en"?"العربية":"EN"}</button></header>
    <section className="matcher-hero"><div><p>{rtl?"أداة ذكية لمطابقة معدات الصيد":"SMART FISHING GEAR COMPATIBILITY"}</p><h1>{rtl?"ابنِ عدة متوازنة.":"Build a balanced setup."}</h1><span>{rtl?"اربط طريقة الصيد والسمكة والبيئة بالقصبة والماكينة والخيط والليدر والطُعم المناسب.":"Match your style, target fish and environment with the right rod, reel, braid, leader and terminal tackle."}</span></div><div className="matcher-hero-score"><Gauge size={28}/><strong>0–100%</strong><span>{rtl?"تقييم التوافق":"compatibility score"}</span></div></section>
    <section className="matcher-shell">
      <div className="matcher-progress"><div className="matcher-progress-line"><i style={{width:`${(step/(steps.length-1))*100}%`}}/></div>{steps.map((item,index)=><button key={item} className={step===index?"active":step>index?"done":""} onClick={()=>index<=step&&setStep(index)}><span>{step>index?<Check size={13}/>:index+1}</span><small>{item}</small></button>)}</div>
      <div className="matcher-stage">
        {step===0&&<><div className="stage-heading"><p>01</p><h2>{rtl?"كيف تريد استخدام الأداة؟":"How do you want to start?"}</h2><span>{rtl?"اختر نقطة البداية، وسنبني باقي العدة حولها.":"Choose your starting point and we will build the rest around it."}</span></div><div className="mode-grid">{[
          {id:"build" as const,icon:Sparkles,en:"Build My Setup",ar:"ابنِ عدتي",desc:"Start with location, style and target fish"},
          {id:"reel" as const,icon:CircleDot,en:"I Already Have a Reel",ar:"لدي ماكينة",desc:"Build a compatible setup around your reel"},
          {id:"rod" as const,icon:Ruler,en:"I Already Have a Rod",ar:"لدي قصبة",desc:"Match reel, braid and targets to your rod"},
        ].map((item)=>{const Icon=item.icon;return <button key={item.id} className={mode===item.id?"selected":""} onClick={()=>setMode(item.id)}><span><Icon size={25}/></span><strong>{rtl?item.ar:item.en}</strong><small>{item.desc}</small><Check size={18}/></button>})}</div></>}
        {step===1&&<><div className="stage-heading"><p>02</p><h2>{rtl?"أين ستصطاد؟":"Where will you fish?"}</h2><span>{rtl?"اختر دولتك ومدينتك لنعرض الأسماك المتاحة في مياهك.":"Pick your country and city so we can show the fish actually available in your waters."}</span></div><div className="location-pickers">
          <div className="location-country"><small>{rtl?"الدولة":"Country"}</small><div className="location-select-wrap"><MapPin size={19}/><select value={countryId} onChange={(e)=>{const nextCountry=coastalCountries.find((item)=>item.id===e.target.value)??coastalCountries[0];const nextCity=nextCountry.cities[0];setCountryId(nextCountry.id);setCityId(nextCity.id);setSpotId(nextCity.spots[0].id)}}>{coastalCountries.map((item)=><option key={item.id} value={item.id}>{rtl?item.ar:item.en}</option>)}</select><ChevronRight size={19} className={rtl?"flip":""}/></div></div>
          <div><small>{rtl?"المدينة":"City"}</small><div className="location-select-wrap"><Search size={19}/><select value={cityId} onChange={(e)=>{const nextCity=country.cities.find((item)=>item.id===e.target.value)??country.cities[0];setCityId(nextCity.id);setSpotId(nextCity.spots[0].id)}}>{country.cities.map((item)=><option key={item.id} value={item.id}>{rtl?item.ar:item.en}</option>)}</select><ChevronRight size={19} className={rtl?"flip":""}/></div></div>
          <div><small>{rtl?"المكان":"Spot"}</small><div className="location-select-wrap"><Navigation size={19}/><select value={spotId} onChange={(e)=>setSpotId(e.target.value)}>{city.spots.map((item)=><option key={item.id} value={item.id}>{rtl?item.ar:item.en}</option>)}</select><ChevronRight size={19} className={rtl?"flip":""}/></div></div>
        </div></>}
        {step===2&&<><div className="stage-heading"><p>03</p><h2>{rtl?"اختر طريقة الصيد":"Choose your fishing style"}</h2><span>{rtl?"كل طريقة تغير القصبة والماكينة وأوزان الطعوم المقترحة.":"Each style changes the rod, reel and terminal-tackle logic."}</span></div><div className="choice-grid style-grid">{styles.map((item)=><button key={item.id} className={style===item.id?"selected":""} onClick={()=>setStyle(item.id)}><Fish size={22}/><strong>{rtl?item.ar:item.en}</strong><small>{item.note}</small></button>)}</div></>}
        {step===3&&<><div className="stage-heading"><p>04</p><h2>{rtl?"اختر السمكة المستهدفة":"Choose your target fish"}</h2><span>{rtl?"نعتمد على الوزن وقوة مقاومة السمكة، وليس الوزن وحده.":"We use both weight and fight power—not weight alone."}</span></div><div className="fish-search"><Search size={18}/><input value={fishSearch} onChange={(e)=>setFishSearch(e.target.value)} placeholder={rtl?"ابحث عن السمكة...":"Search fish..."}/></div><div className="fish-choice-grid">{availableFish.map((item)=><button key={item.id} className={fishId===item.id?"selected":""} onClick={()=>setFishId(item.id)}><span><Fish size={21}/></span><div><strong>{rtl?item.ar:item.en}</strong><small>{item.scientific}</small><em>{rtl?"قوة المقاومة":"Fight power"} {item.fight}/10</em></div></button>)}<button className={fishId==="other"?"selected":""} onClick={()=>setFishId("other")}><span><Fish size={21}/></span><div><strong>{rtl?"سمكة أخرى / غير مدرجة":"Other / not listed"}</strong><small>{rtl?"اكتب اسم السمكة وقدّر قوة مقاومتها":"Type its name and estimate its fight power"}</small></div></button></div>{fishId==="other"&&<div className="advanced-inputs"><label>{rtl?"اسم السمكة":"Fish name"}<input type="text" value={customFishName} onChange={(e)=>setCustomFishName(e.target.value)} placeholder={rtl?"مثال: هامور":"e.g. Hamour"}/></label><label>{rtl?"قوة المقاومة":"Fight power"}<select value={customFight} onChange={(e)=>setCustomFight(Number(e.target.value))}>{fightBands.map((item)=><option key={item.id} value={item.value}>{rtl?item.ar:item.en} ({item.value}/10)</option>)}</select></label></div>}</>}
        {step===4&&<><div className="stage-heading"><p>05</p><h2>{rtl?"ما هو الوزن المتوقع؟":"What size do you expect?"}</h2><span>{rtl?"استخدم الكيلوجرام. سنجمع الحجم مع قوة السمكة وطريقة الصيد.":"Use kilograms. Size is combined with fight power and fishing style."}</span></div><div className="size-grid">{sizeBands.map((item,index)=><button key={item} className={sizeIndex===index?"selected":""} onClick={()=>setSizeIndex(index)}><strong>{item}</strong><small>{rtl?target.ar:target.en} · {target.fight}/10</small></button>)}</div></>}
        {step===5&&<><div className="stage-heading"><p>06</p><h2>{rtl?"حدد بيئة الصيد":"Select the environment"}</h2><span>{rtl?"يمكنك اختيار أكثر من بيئة. الصخور والشعاب ترفع مقاومة الليدر.":"Choose more than one. Rocks and reef increase leader abrasion requirements."}</span></div><div className="environment-grid">{environments.map((item)=><button key={item.id} className={environment.includes(item.id)?"selected":""} onClick={()=>pickEnvironment(item.id)}><ShieldCheck size={18}/>{rtl?item.ar:item.en}</button>)}</div>{style==="boat-jig"&&<div className="advanced-inputs"><label>{rtl?"العمق":"Depth"}<select value={depth} onChange={(e)=>setDepth(e.target.value)}>{["Under 20 m","20–40 m","40–70 m","70–100 m","100 m+"].map(item=><option key={item}>{item}</option>)}</select></label><label>{rtl?"قوة التيار":"Current strength"}<select value={current} onChange={(e)=>setCurrent(e.target.value)}>{["Low","Medium","Strong"].map(item=><option key={item}>{item}</option>)}</select></label></div>}{mode==="reel"&&<div className="advanced-inputs"><label>{rtl?"حجم الماكينة الموجودة":"Your reel size"}<select value={ownedReel} onChange={(e)=>setOwnedReel(Number(e.target.value))}>{[1000,2000,2500,3000,4000,5000,6000,8000,10000,14000,18000].map(item=><option key={item}>{item}</option>)}</select></label></div>}{mode==="rod"&&<div className="advanced-inputs three"><label>{rtl?"طول القصبة بالمتر":"Rod length (m)"}<input type="number" step="0.1" value={rodLength} onChange={(e)=>setRodLength(Number(e.target.value))}/></label><label>PE min<input type="number" step="0.1" value={rodPeMin} onChange={(e)=>setRodPeMin(Number(e.target.value))}/></label><label>PE max<input type="number" step="0.1" value={rodPeMax} onChange={(e)=>setRodPeMax(Number(e.target.value))}/></label></div>}</>}
        {step===6&&<div className="matcher-result"><div className="result-head"><div><p>{rtl?"إعداد الصيد الخاص بك":"YOUR FISHING SETUP"}</p><h2>{rtl?target.ar:target.en}</h2><span>{rtl?styles[styleIndex(style)].ar:styles[styleIndex(style)].en} · {sizeBands[sizeIndex]} · {rtl?city.ar:city.en}, {rtl?country.ar:country.en}</span></div><div className={recommendation.score>=90?"excellent":"good"}><strong>{recommendation.score}%</strong><span>{status}</span></div></div><p className="result-plain-summary">{rtl?`باختصار: قصبة ${mode==="rod"?`${rodLength.toFixed(1)} م`:recommendation.rod} مع ماكينة ${mode==="reel"?ownedReel:recommendation.reelRange} وخيط مجدول PE ${recommendation.required} وليدر تقريبي ${recommendation.leaderLow}–${recommendation.leaderHigh} رطل — عدة متوازنة لصيد ${target.ar} بطريقة ${styles[styleIndex(style)].ar}.`:`In short: a ${mode==="rod"?`${rodLength.toFixed(1)} m`:recommendation.rod} rod with a ${mode==="reel"?ownedReel:recommendation.reelRange} reel, PE ${recommendation.required} braid and roughly a ${recommendation.leaderLow}–${recommendation.leaderHigh} lb leader — a balanced, flexible setup for ${target.en} using ${styles[styleIndex(style)].en}.`}</p><div className="result-equipment-grid">
          <article><span><Ruler size={21}/></span><p>{rtl?"القصبة":"Rod"}</p><h3>{mode==="rod"?`${rodLength.toFixed(1)} m`:recommendation.rod}</h3><dl><div><dt>PE</dt><dd>{mode==="rod"?`${rodPeMin}–${rodPeMax}`:`${Math.max(.6,recommendation.required-0.5)}–${Math.min(10,recommendation.required+0.5)}`}</dd></div><div><dt>{rtl?"الوزن":"Rating"}</dt><dd>{recommendation.weights}</dd></div><div><dt>{rtl?"الأكشن":"Action"}</dt><dd>Fast / Moderate Fast</dd></div></dl></article>
          <article><span><CircleDot size={21}/></span><p>{rtl?"الماكينة":"Reel"}</p><h3>{mode==="reel"?ownedReel:recommendation.reelRange}</h3><small className="pe-hint">{rtl?"نطاق مرن — اختر أقرب مقاس متاح من هذه الفئة عند شركتك المفضلة.":"A flexible range — pick the closest size your preferred brand offers within it."}</small><dl><div><dt>{rtl?"السحب":"Drag"}</dt><dd>{Math.max(4,Math.round(recommendation.braid*.22))}–{Math.max(6,Math.round(recommendation.braid*.32))} kg</dd></div><div><dt>{rtl?"السعة":"Capacity"}</dt><dd>PE {recommendation.required} · ≈{(recommendation.required*.105).toFixed(2)} mm · ≈{recommendation.braid} lb · 200–300 m</dd></div></dl></article>
          <article><span><Layers3 size={21}/></span><p>{rtl?"الخيط المجدول":"Braid"}</p><h3>PE {recommendation.required}</h3><small className="pe-hint">{rtl?"PE مقياس ياباني لسمك الخيط — كلما زاد الرقم زاد السُمك والقوة. فكر فيه كبديل للرطل.":"PE is a line-thickness rating — higher numbers mean thicker, stronger braid. Think of it like a stand-in for lb test."}</small><dl><div><dt>{rtl?"القوة التقريبية":"Approx. strength"}</dt><dd>{recommendation.braid} lb</dd></div><div><dt>{rtl?"الطول":"Length"}</dt><dd>200–300 m</dd></div><div><dt>{rtl?"القطر":"Diameter"}</dt><dd>≈ {(recommendation.required*.105).toFixed(2)} mm</dd></div></dl></article>
          <article><span><ShieldCheck size={21}/></span><p>{rtl?"الليدر":"Leader"}</p><h3>{rtl?"مفضّل":"Preferred"} {recommendation.leaderLow}–{recommendation.leaderHigh} lb</h3><dl><div><dt>{rtl?"الخامة":"Material"}</dt><dd>{target.toothed?"Heavy fluorocarbon / wire option":"Fluorocarbon"}</dd></div><div><dt>{rtl?"الطول":"Length"}</dt><dd>{style==="surf"?"1.5–3 m":"0.8–1.5 m"}</dd></div></dl></article>
          <article className="terminal-card"><span><Sparkles size={21}/></span><p>{rtl?"الطُعم / الجيج / الثقل":"Terminal tackle"}</p><h3>{recommendation.weights}</h3><strong>{target.tackle}</strong></article>
        </div><div className="compatibility-panel"><div><p>{rtl?"توافق الإعداد":"SETUP COMPATIBILITY"}</p><h3>{recommendation.score}% — {status}</h3></div>{[["Rod / Braid",mode==="rod"&&(recommendation.required<rodPeMin||recommendation.required>rodPeMax)?68:100],["Reel / Braid",mode==="reel"&&ownedReel<recommendation.recommendedReel?72:95],["Target strength",92],["Leader",95],["Terminal weight",96]].map(([label,value])=><div className="compat-row" key={String(label)}><span>{label}</span><i><b style={{width:`${value}%`}}/></i><strong>{value}%</strong></div>)}</div><div className="why-panel"><p>{rtl?"لماذا هذه العدة؟":"WHY THIS SETUP?"}</p><h3>{rtl?"التوصية مبنية على التداخل بين كل المكونات.":"The recommendation uses the compatible overlap between every component."}</h3><ul><li>{rtl?`تم اختيار PE ${recommendation.required} لأنه يناسب قوة ${target.ar} ووزنها المتوقع وطريقة الصيد.`:`PE ${recommendation.required} balances the ${target.en}'s ${target.fight}/10 fight power, expected size and your fishing style.`}</li><li>{rtl?"تمت مطابقة الخيط مع تصنيف القصبة وسعة الماكينة، وليس مع حجم الماكينة فقط.":"Braid is matched against rod rating, reel capacity and target strength—not reel size alone."}</li>{recommendation.notes.map((item)=><li key={item}>{item}</li>)}</ul><small>{rtl?"تحويل PE إلى lb تقريبي ويختلف حسب الشركة المصنعة. راجع مواصفات المنتج الفعلية قبل الشراء.":"PE-to-lb conversion is approximate and varies by manufacturer. Check the exact product specifications before buying."}</small></div><div className="tool-connection"><div><strong>{rtl?"اختر أفضل طُعم لهذه العدة":"Choose the best lure for this setup"}</strong><span>{rtl?"سننقل طريقة الصيد والسمكة والحجم والمنطقة وتصنيف القصبة تلقائياً.":"Your style, target, size, region and rod rating will carry across automatically."}</span></div><a href={`/lure-selector?style=${style}&country=${country.id}&city=${city.id}&fish=${target.id}&size=${encodeURIComponent(sizeBands[sizeIndex])}&rating=${encodeURIComponent(recommendation.weights)}`}>{rtl?"اختر الطُعم أو الجيج":"Choose my lure"}<ChevronRight size={16} className={rtl?"flip":""}/></a></div><button className="restart-button" onClick={()=>setStep(0)}>{rtl?"ابدأ إعداداً جديداً":"Build another setup"}</button></div>}
      </div>
      <div className="matcher-actions">{step>0&&<button className="previous" onClick={()=>setStep(step-1)}>{rtl?<ChevronRight size={18}/>:<ChevronLeft size={18}/>} {rtl?"السابق":"Previous"}</button>}<span/>{step<6&&<button className="next" disabled={!canNext} onClick={()=>setStep(step+1)}>{step===5?(rtl?"اعرض النتيجة":"Show my setup"):(rtl?"التالي":"Next")} {rtl?<ChevronLeft size={18}/>:<ChevronRight size={18}/>}</button>}</div>
    </section>
    <BottomNav active="fishing-hub" />
  </main>;
}
