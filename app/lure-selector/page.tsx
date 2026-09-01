"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight, CloudSun, Fish, Gauge, Languages, Moon, Navigation, Sparkles, Sun, Waves, Wind } from "lucide-react";

type Language = "en" | "ar";
type StyleId = "casting" | "shore-jig" | "popping";
type RegionId = "med" | "red" | "suez" | "aqaba";
type DepthId = "very-shallow" | "shallow" | "medium" | "deep" | "very-deep" | "unknown";
type TimeId = "before-sunrise" | "sunrise" | "morning" | "midday" | "afternoon" | "sunset" | "after-sunset" | "night";
type ClarityId = "crystal" | "clear" | "stained" | "murky";
type SkyId = "sunny" | "partly" | "overcast" | "dark";
type Strength = "weak" | "moderate" | "strong";
type ActivityId = "aggressive" | "normal" | "following" | "inactive" | "unknown";
type ColumnId = "surface" | "upper" | "mid" | "bottom" | "unknown";
type WindAngle = "tail" | "cross" | "head";

const regions = [
  {id:"med" as const,en:"Mediterranean",ar:"البحر المتوسط",lat:31.21,lon:29.89},
  {id:"red" as const,en:"Red Sea",ar:"البحر الأحمر",lat:27.26,lon:33.81},
  {id:"suez" as const,en:"Gulf of Suez",ar:"خليج السويس",lat:29.91,lon:32.55},
  {id:"aqaba" as const,en:"Gulf of Aqaba",ar:"خليج العقبة",lat:28.50,lon:34.52},
];
const styles = [
  {id:"casting" as const,en:"Casting / Spinning",ar:"كاستنج / سبيننج"},
  {id:"shore-jig" as const,en:"Shore Jigging",ar:"شور جيجنج"},
  {id:"popping" as const,en:"Popping",ar:"بوبينج"},
];
const fish = [
  {id:"bluefish",en:"Bluefish",ar:"مياس",regions:["med","suez"],styles:["casting","shore-jig"]},
  {id:"barracuda",en:"Barracuda",ar:"براكودا",regions:["med","red","suez","aqaba"],styles:["casting","shore-jig","popping"]},
  {id:"needlefish",en:"Needlefish / Garfish",ar:"خرمان / إبرة",regions:["med","red","suez","aqaba"],styles:["casting"]},
  {id:"seabass",en:"Sea Bass",ar:"قاروص",regions:["med"],styles:["casting"]},
  {id:"bonito",en:"Bonito",ar:"بلاميطة",regions:["med","red","suez"],styles:["casting","shore-jig"]},
  {id:"little-tunny",en:"Little Tunny",ar:"تونة صغيرة",regions:["med","red"],styles:["casting","shore-jig"]},
  {id:"mackerel",en:"Mackerel",ar:"ماكريل",regions:["med","red"],styles:["casting","shore-jig"]},
  {id:"leerfish",en:"Leerfish",ar:"ليتشة",regions:["med"],styles:["casting","shore-jig","popping"]},
  {id:"amberjack",en:"Amberjack",ar:"أمبرجاك",regions:["med","red","suez","aqaba"],styles:["shore-jig","popping"]},
  {id:"grouper",en:"Grouper",ar:"وقار",regions:["med","red","suez","aqaba"],styles:["shore-jig"]},
  {id:"mahi",en:"Mahi Mahi / Dorado",ar:"ماهي ماهي",regions:["med","red","suez"],styles:["casting","popping"]},
  {id:"queenfish",en:"Queenfish",ar:"كوين فيش",regions:["red","suez","aqaba"],styles:["casting","shore-jig","popping"]},
  {id:"gt",en:"Giant Trevally / GT",ar:"جايانت تريفالي",regions:["red","aqaba"],styles:["shore-jig","popping"]},
  {id:"trevally",en:"Trevally",ar:"تريفالي",regions:["red","suez","aqaba"],styles:["casting","shore-jig","popping"]},
  {id:"kingfish",en:"Spanish Mackerel",ar:"دراك / كنعد",regions:["red","suez","aqaba"],styles:["casting","shore-jig","popping"]},
  {id:"yellowfin",en:"Tuna",ar:"تونة",regions:["red"],styles:["shore-jig","popping"]},
  {id:"squid",en:"Squid / Calamari",ar:"سبيط / كاليماري",regions:["med","red","suez","aqaba"],styles:["casting"]},
] as const;

const bilingual = <T extends string>(items:{id:T,en:string,ar:string}[],rtl:boolean)=>items.map(item=>({...item,label:rtl?item.ar:item.en}));
const timeOptions = [
  {id:"before-sunrise" as const,en:"Before Sunrise",ar:"قبل الشروق"},{id:"sunrise" as const,en:"Sunrise",ar:"الشروق"},{id:"morning" as const,en:"Morning",ar:"الصباح"},{id:"midday" as const,en:"Midday / Noon",ar:"الظهر"},
  {id:"afternoon" as const,en:"Afternoon",ar:"بعد الظهر"},{id:"sunset" as const,en:"Sunset",ar:"الغروب"},{id:"after-sunset" as const,en:"After Sunset",ar:"بعد الغروب"},{id:"night" as const,en:"Night",ar:"الليل"},
];
const clarityOptions = [{id:"crystal" as const,en:"Crystal Clear",ar:"شديدة الصفاء"},{id:"clear" as const,en:"Clear",ar:"صافية"},{id:"stained" as const,en:"Slightly Stained",ar:"عكرة قليلاً"},{id:"murky" as const,en:"Murky / Dark",ar:"عكرة / داكنة"}];
const skyOptions = [{id:"sunny" as const,en:"Bright Sunny",ar:"مشمس بقوة"},{id:"partly" as const,en:"Partly Cloudy",ar:"غائم جزئياً"},{id:"overcast" as const,en:"Overcast",ar:"غائم"},{id:"dark" as const,en:"Rain / Dark Sky",ar:"مطر / سماء داكنة"}];
const depthOptions = [{id:"very-shallow" as const,en:"Very Shallow",ar:"ضحلة جداً"},{id:"shallow" as const,en:"Shallow",ar:"ضحلة"},{id:"medium" as const,en:"Medium",ar:"متوسطة"},{id:"deep" as const,en:"Deep",ar:"عميقة"},{id:"very-deep" as const,en:"Very Deep",ar:"عميقة جداً"},{id:"unknown" as const,en:"Unknown",ar:"غير معروف"}];
const columnOptions = [{id:"surface" as const,en:"Surface",ar:"السطح"},{id:"upper" as const,en:"Upper water",ar:"أعلى المياه"},{id:"mid" as const,en:"Mid-water",ar:"منتصف المياه"},{id:"bottom" as const,en:"Near bottom",ar:"قرب القاع"},{id:"unknown" as const,en:"Unknown",ar:"غير معروف"}];

const resultArabic:Record<string,string> = {
  "Sinking Minnow":"مينو غاطس","Metal Jig":"جيج معدني","Topwater Pencil":"بنسل سطحي","Popper":"بوبر","Floating Minnow":"مينو طافي","Suspending Minnow":"مينو معلق","Sinking Pencil":"بنسل غاطس",
  "Rear-weighted":"موزون من الخلف","Slim / long, rear-weighted":"انسيابي طويل وموزون من الخلف","Wide / center-balanced slow-fall":"عريض ومتوازن من المنتصف وبطيء السقوط","Standard slim, center-balanced":"انسيابي قياسي ومتوازن من المنتصف","Rear-weighted casting profile":"شكل رمي موزون من الخلف","Shallow runner":"سباحة ضحلة","Natural baitfish":"شكل سمكة طُعم طبيعي","Compact rear-weighted":"مدمج وموزون من الخلف",
  "Sinking":"غاطس","Fast sinking":"سريع الغرق","Floating":"طافي","Suspending":"معلق",
  "Steady retrieve":"سحب ثابت","Medium-fast one-pitch jerk":"ون بيتش بسرعة متوسطة إلى سريعة","Long lift + controlled fall":"رفعة طويلة ثم سقوط متحكم","Fast one-pitch jerk":"ون بيتش سريع","Short jerk + fall":"نفضة قصيرة ثم سقوط","Sweep + long pause":"سحبة جانبية ثم توقف طويل","Pop, pause, then accelerate":"فرقعة ثم توقف ثم تسريع","Twitch + long pause":"نفضات ثم توقف طويل","Stop-and-go":"سحب وتوقف","Twitch + pause":"نفضات ثم توقف","Count down, then sweep + pause":"اتركه يغوص بالعد ثم اسحب وتوقف",
  "Near bottom":"قرب القاع","Surface / upper water":"السطح وأعلى المياه","Mid-water":"منتصف المياه","Surface":"السطح","Upper water":"أعلى المياه","Unknown":"غير معروف",
  "Sardine / Silver":"سردين / فضي","Gold / Pink":"ذهبي / وردي","Silver / Gold":"فضي / ذهبي","Gold / Pink Glow":"ذهبي / وردي مضيء","Chartreuse / Orange-Gold":"شارتروز / برتقالي ذهبي","Pink / Gold":"وردي / ذهبي","Green-Gold / Pink-Silver":"أخضر ذهبي / وردي فضي","Sardine / Blue-Silver":"سردين / أزرق فضي","Dark Blue / Black":"أزرق داكن / أسود","Zebra Glow / Pink Glow":"زيبرا مضيء / وردي مضيء",
  "Natural holographic":"هولوجرافي طبيعي","Warm flash":"لمعة دافئة","High contrast / glow accent":"تباين قوي مع لمسة مضيئة","Contrast flash":"لمعة عالية التباين","Subtle natural / transparent":"طبيعي هادئ / شفاف","Glow":"مضيء","Strong silhouette":"ظل واضح",
};

function OptionCards<T extends string>({items,value,onChange,rtl}:{items:{id:T,en:string,ar:string}[];value:T;onChange:(value:T)=>void;rtl:boolean}){
  return <div className="lure-option-grid">{bilingual(items,rtl).map(item=><button type="button" key={item.id} className={value===item.id?"selected":""} onClick={()=>onChange(item.id)}><span>{item.label}</span>{value===item.id&&<Check size={16}/>}</button>)}</div>;
}

export default function LureSelectorPage(){
  const [language,setLanguage]=useState<Language>("en");
  const [mode,setMode]=useState<"quick"|"advanced">("quick");
  const [step,setStep]=useState(0);
  const [style,setStyle]=useState<StyleId>("shore-jig");
  const [region,setRegion]=useState<RegionId>("med");
  const [fishId,setFishId]=useState("bluefish");
  const [fishSize,setFishSize]=useState("3–5 kg");
  const [rodMin,setRodMin]=useState(20);
  const [rodMax,setRodMax]=useState(60);
  const [depth,setDepth]=useState<DepthId>("medium");
  const [time,setTime]=useState<TimeId>("sunrise");
  const [clarity,setClarity]=useState<ClarityId>("clear");
  const [sky,setSky]=useState<SkyId>("partly");
  const [windStrength,setWindStrength]=useState<Strength>("moderate");
  const [windAngle,setWindAngle]=useState<WindAngle>("cross");
  const [current,setCurrent]=useState<Strength>("moderate");
  const [activity,setActivity]=useState<ActivityId>("unknown");
  const [column,setColumn]=useState<ColumnId>("unknown");
  const [live,setLive]=useState<{wind:number;cloud:number;rain:number;sunrise:string;sunset:string}|null>(null);
  const [useLive,setUseLive]=useState(true);
  const rtl=language==="ar";
  const lastStep=mode==="quick"?3:7;

  useEffect(()=>{
    const saved=window.localStorage.getItem("alexfisher-language"); if(saved==="ar"||saved==="en")setLanguage(saved);
    const params=new URLSearchParams(window.location.search);
    const qStyle=params.get("style"); if(qStyle&&styles.some(item=>item.id===qStyle))setStyle(qStyle as StyleId);
    const qRegion=params.get("region"); if(qRegion&&regions.some(item=>item.id===qRegion))setRegion(qRegion as RegionId);
    if(params.get("fish"))setFishId(params.get("fish")!);
    if(params.get("size"))setFishSize(params.get("size")!);
    const rating=params.get("rating")?.match(/(\d+)[^\d]+(\d+)/); if(rating){setRodMin(Number(rating[1]));setRodMax(Number(rating[2]));}
  },[]);
  useEffect(()=>{
    const point=regions.find(item=>item.id===region)??regions[0];
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${point.lat}&longitude=${point.lon}&current=wind_speed_10m,cloud_cover,precipitation&daily=sunrise,sunset&timezone=auto&forecast_days=1`)
      .then(response=>response.json()).then(data=>setLive({wind:data.current?.wind_speed_10m??10,cloud:data.current?.cloud_cover??25,rain:data.current?.precipitation??0,sunrise:data.daily?.sunrise?.[0]?.slice(11,16)??"06:00",sunset:data.daily?.sunset?.[0]?.slice(11,16)??"18:00"})).catch(()=>setLive(null));
  },[region]);
  useEffect(()=>{const valid=fish.find(item=>item.id===fishId&&item.regions.includes(region as never)&&item.styles.includes(style as never));if(!valid){const first=fish.find(item=>item.regions.includes(region as never)&&item.styles.includes(style as never));if(first)setFishId(first.id)}},[region,style,fishId]);
  const availableFish=fish.filter(item=>item.regions.includes(region as never)&&item.styles.includes(style as never));
  const target=fish.find(item=>item.id===fishId)??availableFish[0]??fish[0];
  const toggleLanguage=()=>{const next=rtl?"en":"ar";setLanguage(next);window.localStorage.setItem("alexfisher-language",next)};
  const resultText=(value:string)=>rtl?(resultArabic[value]??value):value;
  const useCurrentConditions=()=>{
    if(!live)return;
    const hour=new Date().getHours(); const sunrise=Number(live.sunrise.slice(0,2)); const sunset=Number(live.sunset.slice(0,2));
    setTime(hour<sunrise-1?"before-sunrise":hour<=sunrise+1?"sunrise":hour<12?"morning":hour<15?"midday":hour<sunset-1?"afternoon":hour<=sunset+1?"sunset":"night");
    setSky(live.rain>0?"dark":live.cloud>75?"overcast":live.cloud>35?"partly":"sunny");
    setWindStrength(live.wind<8?"weak":live.wind<22?"moderate":"strong"); setUseLive(true);
  };

  const result=useMemo(()=>{
    const lowLight=["before-sunrise","sunrise","sunset","after-sunset","night"].includes(time)||["overcast","dark"].includes(sky);
    const surface=column==="surface"||depth==="very-shallow";
    const deep=["deep","very-deep"].includes(depth)||column==="bottom";
    let type="Sinking Minnow", profile="Rear-weighted", buoyancy="Sinking", action="Steady retrieve", waterColumn=column==="unknown"?(deep?"Near bottom":surface?"Surface / upper water":"Mid-water"):columnOptions.find(item=>item.id===column)?.en??"Mid-water";
    if(style==="shore-jig"){
      type="Metal Jig"; buoyancy="Fast sinking";
      if(current==="strong"||windStrength==="strong"||windAngle==="head"){profile="Slim / long, rear-weighted";action="Medium-fast one-pitch jerk";}
      else if(activity==="inactive"||activity==="following"){profile="Wide / center-balanced slow-fall";action="Long lift + controlled fall";}
      else {profile="Standard slim, center-balanced";action=activity==="aggressive"?"Fast one-pitch jerk":"Short jerk + fall";}
    } else if(style==="popping"){
      type=activity==="following"?"Topwater Pencil":"Popper"; profile="Rear-weighted casting profile";buoyancy="Floating";action=activity==="inactive"?"Sweep + long pause":"Pop, pause, then accelerate";waterColumn="Surface";
    } else if(surface){type=activity==="following"?"Suspending Minnow":"Floating Minnow";profile="Shallow runner";buoyancy=activity==="following"?"Suspending":"Floating";action=activity==="following"?"Twitch + long pause":"Stop-and-go";}
    else if(activity==="following"){type="Suspending Minnow";profile="Natural baitfish";buoyancy="Suspending";action="Twitch + pause";}
    else if(deep||current==="strong"){type="Sinking Pencil";profile="Compact rear-weighted";buoyancy="Sinking";action="Count down, then sweep + pause";}

    let color="Sardine / Silver", finish="Natural holographic";
    if(time==="night"){color=clarity==="crystal"?"Dark Blue / Black":"Zebra Glow / Pink Glow";finish=clarity==="crystal"?"Strong silhouette":"Glow";}
    else if(clarity==="murky"){color=lowLight?"Gold / Pink Glow":"Chartreuse / Orange-Gold";finish="High contrast / glow accent";}
    else if(clarity==="stained"){color=lowLight?"Pink / Gold":"Green-Gold / Pink-Silver";finish="Contrast flash";}
    else if(lowLight){color=time==="sunrise"?"Gold / Pink":"Silver / Gold";finish="Warm flash";}
    else if(sky==="sunny"){color="Sardine / Blue-Silver";finish=clarity==="crystal"?"Subtle natural / transparent":"Natural holographic";}
    const alternative=color.includes("Gold")?"Sardine / Silver":"Pink / Gold";
    const base=style==="shore-jig"?(depth==="very-shallow"?20:depth==="shallow"?30:depth==="medium"?40:depth==="deep"?60:80):(style==="popping"?50:25);
    const force=(current==="strong"?15:current==="moderate"?5:0)+(windStrength==="strong"?10:0)+(windAngle==="head"?5:0);
    const ideal=Math.round((base+force)/5)*5; const safe=Math.max(rodMin,Math.min(rodMax,ideal)); const low=Math.max(rodMin,Math.round((safe-5)/5)*5); const high=Math.min(rodMax,Math.round((safe+5)/5)*5);
    const weight=low===high?`${low} g`:`${low}–${high} g`;
    const why=rtl
      ? `${lowLight?"الإضاءة منخفضة، لذلك نرفع وضوح اللون":"الإضاءة جيدة، لذلك نحافظ على شكل طبيعي"}. ${current==="strong"||windStrength==="strong"?"التيار أو الرياح القوية تحتاج شكلاً انسيابياً ووزناً أكثر ثباتاً.":"الظروف تسمح ببقاء الطُعم فترة أطول في منطقة الضرب."} الوزن داخل تصنيف القصبة ${rodMin}–${rodMax} جم.`
      : `${lowLight?"Low light calls for more visible color and contrast":"Good visibility favors a convincing natural baitfish pattern"}. ${current==="strong"||windStrength==="strong"?"Wind or current favors a streamlined profile that holds its path.":"These conditions let the lure spend longer in the strike zone."} The weight stays inside your ${rodMin}–${rodMax} g rod rating.`;
    return {type,profile,buoyancy,action,waterColumn,color,finish,alternative,weight,why};
  },[style,time,sky,clarity,column,depth,current,windStrength,windAngle,activity,rodMin,rodMax,rtl]);
  const lureImage=result.type==="Metal Jig"?"/assets/lure-jig-gold-pink.png":["Popper","Topwater Pencil"].includes(result.type)?"/assets/lure-popper-gold-pink.png":"/assets/lure-minnow-gold-pink.png";

  const steps=mode==="quick"?(rtl?["الأسلوب","الهدف","العمق","النتيجة"]:["Style","Target","Depth","Result"]):(rtl?["الأسلوب","الهدف","الوقت","المياه","الرياح","التيار","النشاط","النتيجة"]:["Style","Target","Light","Water","Wind","Current","Activity","Result"]);
  const next=()=>setStep(value=>Math.min(lastStep,value+1)); const previous=()=>setStep(value=>Math.max(0,value-1));
  const resetMode=(nextMode:"quick"|"advanced")=>{setMode(nextMode);setStep(0)};

  return <main dir={rtl?"rtl":"ltr"} className={`lure-page ${rtl?"font-arabic":""}`}>
    <header className="matcher-topbar"><a href="/" className="back-link"><ArrowLeft size={17}/>{rtl?"العودة لحالة البحر":"Back to conditions"}</a><a className="brand" href="/"><span className="brand-mark"><Waves size={22}/></span><span>ALEX<strong>FISHER</strong><small>LURE &amp; JIG SELECTOR</small></span></a><nav><a href="/tackle-matcher">{rtl?"مطابقة العدة":"Tackle Matcher"}</a><a href="/learning">{rtl?"تعلم":"Learning"}</a></nav><button className="language-button" onClick={toggleLanguage}><Languages size={16}/>{rtl?"EN":"العربية"}</button></header>
    <section className="lure-tool-head"><div><p>{rtl?"أدوات الصيد · اختيار ذكي":"FISHING TOOLS · CONDITION ENGINE"}</p><h1>{rtl?"ماذا ترمي الآن؟":"What should you throw now?"}</h1><span>{rtl?"اختر الطُعم أو الجيج والوزن واللون والحركة المناسبة للسمكة والظروف الحالية.":"Choose a lure or jig, weight, color and action matched to your target and the conditions."}</span></div><div className="mode-switch"><button className={mode==="quick"?"active":""} onClick={()=>resetMode("quick")}><Sparkles size={17}/>{rtl?"اختيار سريع":"Quick Mode"}</button><button className={mode==="advanced"?"active":""} onClick={()=>resetMode("advanced")}><Gauge size={17}/>{rtl?"ظروف متقدمة":"Advanced Conditions"}</button></div></section>
    <section className="lure-shell">
      <div className="lure-live-strip"><div><span className={live?"live-dot":"sample-dot"}/><strong>{live?(rtl?"الظروف المباشرة جاهزة":"Live conditions ready"):(rtl?"إدخال يدوي":"Manual conditions")}</strong>{live&&<small><Wind size={13}/>{live.wind.toFixed(0)} km/h · <CloudSun size={13}/>{live.cloud}% · <Sun size={13}/>{live.sunrise} · <Moon size={13}/>{live.sunset}</small>}</div><button onClick={useCurrentConditions} disabled={!live}>{rtl?"استخدم الظروف الحالية":"Use Current Conditions"}</button></div>
      <div className="lure-progress">{steps.map((item,index)=><button key={item} onClick={()=>index<=step&&setStep(index)} className={index===step?"active":index<step?"done":""}><span>{index<step?<Check size={12}/>:index+1}</span><small>{item}</small></button>)}</div>
      <div className="lure-stage">
        {step===0&&<><div className="stage-heading"><p>01</p><h2>{rtl?"كيف ستصطاد؟":"Choose your fishing style"}</h2><span>{rtl?"ابدأ بالطريقة؛ فهي تغيّر نوع الطُعم وشكله وحركته.":"Style changes the lure category, profile and retrieve."}</span></div><div className="lure-style-grid">{styles.map(item=><button key={item.id} className={style===item.id?"selected":""} onClick={()=>setStyle(item.id)}><span>{item.id==="shore-jig"?<Navigation size={25}/>:item.id==="popping"?<Waves size={25}/>:<Fish size={25}/>}</span><strong>{rtl?item.ar:item.en}</strong><small>{item.id==="shore-jig"?(rtl?"مسافة · عمق · جيج معدني":"Distance · depth · metal jigs"):item.id==="popping"?(rtl?"سطح · صوت · مفترسات قوية":"Surface · sound · aggressive fish"):(rtl?"مينو · بنسل · سوفت بلاستيك":"Minnow · pencil · soft plastic")}</small></button>)}</div></>}
        {step===1&&<><div className="stage-heading"><p>02</p><h2>{rtl?"ما هي السمكة المستهدفة؟":"Choose your target fish"}</h2><span>{rtl?"لا تظهر إلا الأسماك المتوافقة مع المنطقة والطريقة.":"Only species compatible with your region and style are shown."}</span></div><div className="lure-target-controls"><label>{rtl?"المنطقة":"Region"}<select value={region} onChange={event=>setRegion(event.target.value as RegionId)}>{regions.map(item=><option key={item.id} value={item.id}>{rtl?item.ar:item.en}</option>)}</select></label><label>{rtl?"الحجم المتوقع":"Target size"}<select value={fishSize} onChange={event=>setFishSize(event.target.value)}>{["Under 1 kg","1–3 kg","3–5 kg","5–10 kg","10–20 kg","20 kg+"].map(item=><option key={item}>{item}</option>)}</select></label><label>{rtl?"تصنيف القصبة (جم)":"Rod rating (g)"}<span className="rating-pair"><input type="number" min="1" value={rodMin} onChange={event=>setRodMin(Math.max(1,Number(event.target.value)))}/><b>—</b><input type="number" min={rodMin} value={rodMax} onChange={event=>setRodMax(Math.max(rodMin,Number(event.target.value)))}/></span></label></div><div className="lure-fish-grid">{availableFish.map(item=><button key={item.id} className={fishId===item.id?"selected":""} onClick={()=>setFishId(item.id)}><Fish size={18}/><strong>{rtl?item.ar:item.en}</strong></button>)}</div></>}
        {((mode==="quick"&&step===2)||(mode==="advanced"&&step===5))&&<><div className="stage-heading"><p>{mode==="quick"?"03":"06"}</p><h2>{rtl?"العمق والتيار":"Depth and current"}</h2><span>{rtl?"هذا يحدد سرعة الغرق والشكل والوزن.":"These choices set sink speed, profile and weight."}</span></div><h3 className="field-title">{rtl?"العمق التقريبي":"Approximate depth"}</h3><OptionCards items={depthOptions} value={depth} onChange={setDepth} rtl={rtl}/><h3 className="field-title">{rtl?"قوة التيار":"Current strength"}</h3><OptionCards items={[{id:"weak" as const,en:"Weak",ar:"ضعيف"},{id:"moderate" as const,en:"Moderate",ar:"متوسط"},{id:"strong" as const,en:"Strong",ar:"قوي"}]} value={current} onChange={setCurrent} rtl={rtl}/></>}
        {mode==="advanced"&&step===2&&<><div className="stage-heading"><p>03</p><h2>{rtl?"الوقت وحالة السماء":"Time and light"}</h2><span>{rtl?"الإضاءة تغيّر اللون واللمعة والتباين.":"Light changes color, flash and contrast."}</span></div><h3 className="field-title">{rtl?"متى ستصطاد؟":"When are you fishing?"}</h3><OptionCards items={timeOptions} value={time} onChange={value=>{setTime(value);setUseLive(false)}} rtl={rtl}/><h3 className="field-title">{rtl?"حالة السماء":"Sky condition"}</h3><OptionCards items={skyOptions} value={sky} onChange={value=>{setSky(value);setUseLive(false)}} rtl={rtl}/></>}
        {mode==="advanced"&&step===3&&<><div className="stage-heading"><p>04</p><h2>{rtl?"صفاء المياه وطبقة الصيد":"Water visibility and feeding layer"}</h2><span>{rtl?"الصفاء يوجه اللون؛ والطبقة تحدد الطفو أو سرعة الغرق.":"Clarity drives color while the feeding layer drives buoyancy."}</span></div><h3 className="field-title">{rtl?"صفاء المياه":"Water clarity"}</h3><OptionCards items={clarityOptions} value={clarity} onChange={setClarity} rtl={rtl}/><h3 className="field-title">{rtl?"أين تتغذى السمكة؟":"Where are fish feeding?"}</h3><OptionCards items={columnOptions} value={column} onChange={setColumn} rtl={rtl}/></>}
        {mode==="advanced"&&step===4&&<><div className="stage-heading"><p>05</p><h2>{rtl?"الرياح بالنسبة للرمي":"Wind and casting direction"}</h2><span>{rtl?"الرياح المواجهة تحتاج شكلاً أكثر انسيابية ووزناً خلفياً.":"A headwind favors compact, aerodynamic, rear-weighted profiles."}</span></div><OptionCards items={[{id:"weak" as const,en:"Calm / Light",ar:"هادئة / خفيفة"},{id:"moderate" as const,en:"Moderate",ar:"متوسطة"},{id:"strong" as const,en:"Strong",ar:"قوية"}]} value={windStrength} onChange={value=>{setWindStrength(value);setUseLive(false)}} rtl={rtl}/><h3 className="field-title">{rtl?"اتجاهها بالنسبة للرمي":"Relative to your cast"}</h3><OptionCards items={[{id:"tail" as const,en:"Tailwind",ar:"خلفية"},{id:"cross" as const,en:"Crosswind",ar:"جانبية"},{id:"head" as const,en:"Headwind",ar:"مواجهة"}]} value={windAngle} onChange={setWindAngle} rtl={rtl}/></>}
        {mode==="advanced"&&step===6&&<><div className="stage-heading"><p>07</p><h2>{rtl?"كيف تتصرف الأسماك؟":"How are the fish behaving?"}</h2><span>{rtl?"النشاط يغير سرعة الحركة ومدة التوقف وشكل الجيج.":"Activity changes retrieve speed, pause length and jig profile."}</span></div><OptionCards items={[{id:"aggressive" as const,en:"Aggressively Feeding",ar:"تتغذى بقوة"},{id:"normal" as const,en:"Normal",ar:"طبيعي"},{id:"following" as const,en:"Following, Not Biting",ar:"تتبع ولا تضرب"},{id:"inactive" as const,en:"Slow / Inactive",ar:"بطيئة / خاملة"},{id:"unknown" as const,en:"Unknown",ar:"غير معروف"}]} value={activity} onChange={setActivity} rtl={rtl}/></>}
      {step===lastStep&&<div className="lure-result"><div className="lure-result-title"><div><p>{rtl?"توصية الطُعم الخاصة بك":"YOUR LURE RECOMMENDATION"}</p><h2>{rtl?target.ar:target.en}</h2><span>{rtl?styles.find(item=>item.id===style)?.ar:styles.find(item=>item.id===style)?.en} · {rtl?regions.find(item=>item.id===region)?.ar:regions.find(item=>item.id===region)?.en} · {useLive?(rtl?"ظروف مباشرة":"Live conditions"):(rtl?"ظروف يدوية":"Manual conditions")}</span></div><div><Sparkles size={22}/><strong>{result.weight}</strong><small>{rtl?"داخل تصنيف القصبة":"within rod rating"}</small></div></div><div className="best-lure-card"><div className="lure-visual"><img src={lureImage} alt={rtl?`صورة واقعية لشكل طُعم ${resultText(result.type)}`:`Realistic ${result.type} profile example`}/><small>{rtl?"مثال واقعي للشكل":"Realistic shape example"}</small></div><div><p>{rtl?"أفضل اختيار":"BEST CHOICE"}</p><h3>{resultText(result.profile)} {resultText(result.type)}</h3><span>{resultText(result.color)}</span></div><dl><div><dt>{rtl?"الطفو":"Buoyancy"}</dt><dd>{resultText(result.buoyancy)}</dd></div><div><dt>{rtl?"التشطيب":"Finish"}</dt><dd>{resultText(result.finish)}</dd></div><div><dt>{rtl?"الحركة":"Action"}</dt><dd>{resultText(result.action)}</dd></div><div><dt>{rtl?"طبقة المياه":"Water column"}</dt><dd>{resultText(result.waterColumn)}</dd></div></dl></div><div className="lure-result-grid"><article><p>{rtl?"لماذا هذا الطُعم؟":"WHY THIS LURE?"}</p><h3>{result.why}</h3><details><summary>{rtl?"اعرض منطق التوصية":"Show recommendation logic"}<ChevronDown size={16}/></summary><span>{rtl?`توازن التوصية بين صفاء المياه (${clarityOptions.find(item=>item.id===clarity)?.ar})، ووقت الصيد (${timeOptions.find(item=>item.id===time)?.ar})، وقوة التيار (${current==="weak"?"ضعيف":current==="moderate"?"متوسط":"قوي"})، والرياح، ونشاط السمكة، وتصنيف القصبة.`:`The engine balances ${clarity} water, ${time.replaceAll("-"," ")}, ${current} current, wind, target behavior and the rod rating.`}</span></details></article><article><p>{rtl?"البديل الأول":"ALTERNATIVE"}</p><h3>{resultText(result.alternative)}</h3><span>{rtl?"استخدمه إذا تغير الضوء أو لم تحصل على ضربة بعد عدة رميات.":"Use it when the light strengthens or the first choice gets no response."}</span></article></div><div className="no-bites"><div><p>{rtl?"لا توجد ضربات؟":"NO BITES?"}</p><h3>{rtl?"غيّر شيئاً واحداً في كل مرة.":"Change one variable at a time."}</h3></div><ol><li>{rtl?`اللون: ${resultText(result.color)} ← ${resultText(result.alternative)}`:`Color: ${result.color} → ${result.alternative}`}</li><li>{rtl?"العمق: منتصف المياه ← قرب القاع":"Depth: mid-water → near bottom"}</li><li>{rtl?"الحركة: متوسطة السرعة ← سقوط بطيء":"Action: medium-fast → slow fall"}</li><li>{rtl?"الشكل: انسيابي ← عريض ومتوازن من المنتصف":"Profile: slim → wide / center-balanced"}</li></ol></div><div className="tool-connection"><div><strong>{rtl?"أكمل عدة الصيد":"Complete your fishing setup"}</strong><span>{rtl?"اربط القصبة والماكينة والخيط والليدر بهذه التوصية.":"Match a rod, reel, braid and leader to this recommendation."}</span></div><a href={`/tackle-matcher?style=${style}&region=${region}&fish=${target.id}&size=${encodeURIComponent(fishSize)}`}>{rtl?"ابنِ العدة الكاملة":"Build the full tackle setup"}<ChevronRight size={16} className={rtl?"flip":""}/></a></div><button className="restart-button" onClick={()=>setStep(0)}>{rtl?"ابدأ اختياراً جديداً":"Start another selection"}</button></div>}
      </div>
      <div className="matcher-actions">{step>0&&<button className="previous" onClick={previous}>{rtl?<ChevronRight size={18}/>:<ChevronLeft size={18}/>} {rtl?"السابق":"Previous"}</button>}<span/>{step<lastStep&&<button className="next" onClick={next}>{step===lastStep-1?(rtl?"اعرض التوصية":"Show recommendation"):(rtl?"التالي":"Next")} {rtl?<ChevronLeft size={18}/>:<ChevronRight size={18}/>}</button>}</div>
    </section>
  </main>;
}
