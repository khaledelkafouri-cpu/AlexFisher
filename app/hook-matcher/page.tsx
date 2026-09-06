"use client";
/* eslint-disable @next/next/no-img-element -- Local SVG/WebP reference illustrations use fixed dimensions and lazy loading in the library. */

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Fish, Languages, RotateCcw, ShieldCheck } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import Link from 'next/link';
import { baitHooks, baits, baitSizes, targets, matchBaitHook, hookTargetFromSpecies, type Copy, type HookChoice, type BaitHook } from '@/lib/hook-matcher';
import './hook-matcher.css';

const defaults:HookChoice={bait:'shrimp',size:'medium',target:'mixed',approach:'active',end:'eye'};
function reveal(element: HTMLElement | null) {
  element?.focus({preventScroll:true});
  element?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
}

export default function HookMatcherPage(){
  const [language,setLanguage]=useState<'en'|'ar'>('en');
  const [choice,setChoice]=useState<HookChoice>(defaults);
  const [filter,setFilter]=useState<'all'|'eye'|'spade'>('all');
  const [activeId,setActiveId]=useState('chinu-spade');
  const resultRef=useRef<HTMLElement>(null);
  const detailRef=useRef<HTMLElement>(null);
  const rtl=language==='ar';
  const t=(en:string,ar:string)=>rtl?ar:en;
  const c=(value:Copy)=>value[language];
  useEffect(()=>{
    const stored=window.localStorage.getItem('alexfisher-language');
    // Restore the website's existing language preference after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if(stored==='ar')setLanguage(stored);
    const target=hookTargetFromSpecies(new URLSearchParams(window.location.search).get('fish'));
    setChoice(previous=>({...previous,target}));
  },[]);
  const change=<K extends keyof HookChoice>(key:K,value:HookChoice[K])=>setChoice(previous=>({...previous,[key]:value}));
  const result=matchBaitHook(choice);
  const active=baitHooks.find(h=>h.id===activeId)!;
  const visible=baitHooks.filter(h=>filter==='all'||h.end===filter);
  const inspect=(hook:BaitHook)=>{setActiveId(hook.id);reveal(detailRef.current)};
  const endLabel=(end:'eye'|'spade')=>end==='eye'?t('Eyed / ring','بعين / حلقة'):t('Spade end / no eye','مفلطح / بدون عين');

  return <main className="bait-page" dir={rtl?'rtl':'ltr'}>
    <header className="bait-topbar">
      <a href="/fishing-hub"><ArrowLeft size={18}/>{t('Fishing Hub','مركز الصيد')}</a>
      <Link href="/" className="bait-brand">ALEX<strong>FISHER</strong></Link>
      <button type="button" onClick={()=>{const next=rtl?'en':'ar';setLanguage(next);window.localStorage.setItem('alexfisher-language',next)}}><Languages size={18}/>{rtl?'English':'العربية'}</button>
    </header>
    <div className="bait-content">
      <header className="bait-intro">
        <span className="bait-eyebrow"><Fish size={17}/>{t('NATURAL BAIT · MENA','طُعم طبيعي · الشرق الأوسط وشمال أفريقيا')}</span>
        <h1>{t('The right hook. Less guesswork.','خطاف مناسب. حيرة أقل.')}</h1>
        <p>{t('Start with your bait. Find a hook shape, a sensible size range and the right way to set it.','ابدأ بالطُعم. اختر شكل الخطاف ونطاق الحجم وطريقة التثبيت المناسبة.')}</p>
        <nav aria-label={t('Hook matcher sections','أقسام دليل الخطاف')}><a href="#bait-picker">{t('Find my hook','اختر خطافي')}</a><a href="#bait-library">{t('Browse hook images','تصفح صور الخطافات')}</a><a href="#bait-guide">{t('Quick guide','دليل سريع')}</a></nav>
      </header>
      <div className="bait-workspace">
        <section id="bait-picker" className="bait-form" aria-labelledby="bait-picker-title">
          <header><div><h2 id="bait-picker-title">{t('Build your bait setup','جهّز طُعمك')}</h2><p>{t('Three choices. Your match updates instantly.','ثلاثة اختيارات. اقتراحك يتحدث فوراً.')}</p></div><button className="bait-reset" onClick={()=>setChoice({...defaults})}><RotateCcw size={16}/>{t('Reset','إعادة ضبط')}</button></header>
          <fieldset><legend><span>1</span>{t('What is your bait?','ما نوع الطُعم؟')}</legend>
            <div className="bait-options bait-bait-options">{baits.map(bait=><button key={bait.id} type="button" aria-pressed={choice.bait===bait.id} onClick={()=>change('bait',bait.id)}><strong>{c(bait.label)}</strong><small>{c(bait.hint)}</small>{choice.bait===bait.id&&<Check size={17}/>}</button>)}</div>
          </fieldset>
          <fieldset><legend><span>2</span>{t('How big is the bait piece?','ما حجم قطعة الطُعم؟')}</legend>
            <div className="bait-options bait-size-options">{baitSizes.map(size=><button key={size.id} type="button" aria-pressed={choice.size===size.id} onClick={()=>change('size',size.id)}><strong>{c(size.label)}</strong><small>{c(size.hint)}</small></button>)}</div>
          </fieldset>
          <fieldset><legend><span>3</span>{t('What are you targeting?','ما السمكة المستهدفة؟')}</legend>
            <label className="bait-select-label"><span className="sr-only">{t('Target fish','السمكة المستهدفة')}</span><select value={choice.target} onChange={event=>change('target',event.target.value as HookChoice['target'])}>{targets.map(target=><option key={target.id} value={target.id}>{c(target.label)}</option>)}</select></label>
          </fieldset>
          <details className="bait-preferences"><summary>{t('Fine-tune: hook set & eye type','تخصيص: طريقة التثبيت ونهاية الخطاف')}<ChevronDown size={18}/></summary><div>
            <fieldset><legend>{t('How will you set the hook?','كيف ستثبت الخطاف؟')}</legend><div className="bait-options"><button aria-pressed={choice.approach==='active'} onClick={()=>change('approach','active')}><strong>{t('Controlled strike','ضربة متحكم بها')}</strong><small>{t('Rod in hand; respond to the bite','القصبة في اليد؛ استجب للعضة')}</small></button><button aria-pressed={choice.approach==='steady'} onClick={()=>change('approach','steady')}><strong>{t('Steady pressure / release','ضغط تدريجي / إطلاق')}</strong><small>{t('Reel steadily, without a strike','لفّ البكرة بثبات دون ضربة')}</small></button></div></fieldset>
            <fieldset><legend>{t('Preferred attachment','نهاية الخطاف المفضلة')}</legend><div className="bait-options"><button aria-pressed={choice.end==='eye'} onClick={()=>change('end','eye')}><strong>{t('Eyed / ring','بعين / حلقة')}</strong><small>{t('Familiar knot through an eye','عقدة معتادة عبر العين')}</small></button><button aria-pressed={choice.end==='spade'} onClick={()=>change('end','spade')}><strong>{t('Spade end / no eye','مفلطح / بدون عين')}</strong><small>{t('Snell around the shank or pre-tied','عقدة حول الساق أو مربوط مسبقاً')}</small></button></div></fieldset>
          </div></details>
          <button className="bait-show-result" onClick={()=>{reveal(resultRef.current)}}>{t('See my hook','شاهد خطافي')}<ArrowRight size={18}/></button>
        </section>
        <section className="bait-result" ref={resultRef} tabIndex={-1} aria-labelledby="bait-result-title">
          <div className="bait-result-heading"><span className="bait-eyebrow"><Check size={16}/>{t('YOUR STARTING POINT','نقطة البداية المقترحة')}</span><h2 id="bait-result-title" aria-live="polite" aria-atomic="true">{c(result.hook.name)}</h2><p>{c(baits.find(b=>b.id===choice.bait)!.label)} · {c(baitSizes.find(s=>s.id===choice.size)!.label)} · {c(targets.find(s=>s.id===choice.target)!.label)}</p></div>
          <figure><img src={result.hook.image} alt={c(result.hook.name)} width={360} height={300}/><figcaption>{endLabel(result.hook.end)} · {t('Shape reference, not actual size','مرجع للشكل وليس للحجم الفعلي')}</figcaption></figure>
          <div className="bait-result-body">
            <p>{c(result.why)}</p>
            <dl><div><dt>{t('Approximate sizes to compare','مقاسات تقريبية للمقارنة')}</dt><dd dir="ltr">{result.range}</dd><p>{t('A starting range, not a guaranteed fit. Compare actual gap and bait thickness; circle sizes vary especially widely.','نطاق مبدئي وليس مقاساً مضموناً. قارن الفتحة الفعلية بسمك الطُعم؛ مقاسات الدائري تختلف كثيراً.')}</p></div><div><dt>{t('Wire strength','قوة السلك')}</dt><dd>{c(result.wire)}</dd></div><div className="bait-setting"><dt>{t('How to set it','طريقة التثبيت')}</dt><dd>{c(result.hook.setting)}</dd></div></dl>
            {result.endMismatch&&<p className="bait-caution">{t('Your fishing approach needs an eyed pattern in this guide. A spade-end preference must not override the right point style or strength.','أسلوب صيدك يحتاج نوعاً بعين في هذا الدليل. تفضيل الرأس المفلطح لا يتقدم على شكل السن أو القوة المناسبة.')}</p>}
            {result.toothy&&<p className="bait-caution">{t('Sharp teeth can cut the leader. A long shank is not bite protection; choose an appropriate bite-resistant trace.','الأسنان الحادة قد تقطع الليدر. الساق الطويلة لا تمنع ذلك؛ اختر ليدر مناسباً لمقاومة العض.')}</p>}
            {result.baitWarning&&<p className="bait-caution">{t('This bait–target combination is unusual. Confirm the local feeding pattern before choosing hook size.','هذا الجمع بين الطُعم والسمكة غير معتاد. تحقق من غذاء السمكة محلياً قبل اختيار المقاس.')}</p>}
            <button className="bait-profile-link" onClick={()=>inspect(result.hook)}>{t('View this hook in detail','تفاصيل هذا الخطاف')}<ArrowRight size={16}/></button>
            <details className="bait-alternative"><summary>{t('Another option—and its trade-off','بديل والفرق في الاستخدام')}</summary><strong>{c(result.alternative.name)}</strong><p>{c(result.alternative.setting)}</p><button onClick={()=>inspect(result.alternative)}>{t('View alternative','شاهد البديل')}</button></details>
          </div>
        </section>
      </div>
      <section id="bait-library" className="bait-library" aria-labelledby="bait-library-title">
        <header><span className="bait-eyebrow">{t('LOOK. COMPARE. RECOGNISE.','شاهد. قارن. تعرّف.')}</span><h2 id="bait-library-title">{t('Natural-bait hook library','مكتبة خطافات الطُعم الطبيعي')}</h2><p>{t('Common patterns for MENA coasts and freshwater: Mediterranean, Red Sea, Gulf and inland fishing. Not every brand or regional variant.','أشكال شائعة لسواحل ومياه المنطقة العذبة: المتوسط والبحر الأحمر والخليج والمياه الداخلية. ليست حصراً لكل ماركة أو نوع محلي.')}</p></header>
        <div className="bait-filter" role="group" aria-label={t('Filter by attachment','تصفية حسب نهاية الخطاف')}>{(['all','eye','spade'] as const).map(end=><button key={end} aria-pressed={filter===end} onClick={()=>setFilter(end)}>{end==='all'?t('All hooks','كل الخطافات'):endLabel(end)}</button>)}</div>
        <div className="bait-gallery">{visible.map(hook=><button key={hook.id} aria-pressed={activeId===hook.id} onClick={()=>{setActiveId(hook.id);reveal(detailRef.current)}}><img src={hook.image} alt={c(hook.name)} width={220} height={190} loading="lazy"/><span><small>{endLabel(hook.end)}</small><strong>{c(hook.name)}</strong></span></button>)}</div>
        <article className="bait-profile" ref={detailRef} tabIndex={-1} aria-label={t('Selected hook details','تفاصيل الخطاف المختار')}><figure><img src={active.image} alt={c(active.name)} width={300} height={300} loading="lazy"/><figcaption>{t('Illustrative pattern · not to scale','رسم توضيحي للنوع · ليس بمقياس فعلي')}</figcaption></figure><div><span className="bait-eyebrow">{endLabel(active.end)}</span><h3>{c(active.name)}</h3><p>{c(active.shape)}</p><dl><div><dt>{t('Use it for','استخدامه')}</dt><dd>{c(active.best)}</dd></div><div><dt>{t('Rigging tip','نصيحة التركيب')}</dt><dd>{c(active.tip)}</dd></div><div><dt>{t('Hook set','تثبيت الخطاف')}</dt><dd>{c(active.setting)}</dd></div></dl></div></article>
      </section>
      <section id="bait-guide" className="bait-guide"><h2>{t('Three things worth remembering','ثلاث قواعد تستحق التذكر')}</h2><div className="bait-guide-grid">
        <article><span>01</span><h3>{t('Fit the bait, not the fish weight','طابق الطُعم لا وزن السمكة')}</h3><p>{t('Keep the point exposed and the gap open after baiting. Hook numbers are not standardised across brands.','اترك السن والفتحة مكشوفين بعد تركيب الطُعم. أرقام المقاسات ليست موحدة بين الشركات.')}</p><p className="bait-number-guide" dir="ltr">#10 → #4 → #1 → 1/0 → 4/0 → 8/0</p><small>{t('Smaller → larger. Shape and wire still matter.','من الأصغر إلى الأكبر. الشكل والسلك مهمان أيضاً.')}</small></article>
        <article><span>02</span><h3>{t('An eye is not a hook family','العين ليست نوع الخطاف')}</h3><p>{t('Eyed hooks have a hole for the line. Spade hooks have a flat head and are tied around the shank. Both can be good bait hooks; the knot must match the attachment.','الخطاف بعين له فتحة للخيط. المفلطح له رأس مسطح ويُربط حول الساق. كلاهما مناسب للطُعم بشرط العقدة الصحيحة.')}</p><small>{t('New to spade ends? Start with a correctly pre-tied hook.','مبتدئ مع المفلطح؟ ابدأ بخطاف مربوط مسبقاً بشكل صحيح.')}</small></article>
        <article><span>03</span><h3>{t('Circle means no hard strike','الدائري لا يحتاج ضربة قوية')}</h3><p>{t('A non-offset circle can reduce deep hooking with natural bait. Keep the gap clear, let the line tighten and reel steadily. Do not use a normal J-hook strike.','الدائري غير المنحرف قد يقلل البلع العميق مع الطُعم الطبيعي. اترك الفتحة مكشوفة ودع الخيط يشد ثم لفّ بثبات. لا تضرب كخطاف J.')}</p><small>{t('Barbless options can make release easier.','الأنواع بدون لسان قد تسهّل إطلاق السمكة.')}</small></article>
      </div></section>
      <aside className="bait-responsible"><ShieldCheck size={22}/><p>{t('A practical starting guide—not a catch guarantee. Check local fishing areas, species restrictions, bait rules and hook requirements before fishing. Use tackle suited to landing and releasing the fish promptly.','دليل مبدئي عملي وليس ضماناً للصيد. تحقق محلياً من مناطق الصيد والأنواع وقواعد الطُعم والخطافات. استخدم عدة مناسبة لإخراج السمكة وإطلاقها سريعاً.')}</p></aside>
      <details className="bait-sources"><summary>{t('References & scope','المراجع ونطاق الدليل')}</summary><p>{t('Hook features and handling references; these are not MENA-wide regulations. Recommendations are general starting points, not manufacturer sizing charts. This picker excludes lure hooks, trebles and jig assists.','مراجع لخصائص الخطافات والتعامل معها وليست قوانين موحدة للمنطقة. الاقتراحات نقاط بداية عامة وليست جداول مقاسات الشركات. الدليل يستبعد خطافات الطعوم الصناعية والثلاثي والأسيست.')}</p><a href="https://mustad-fishing.com/eu/products/10116np/" target="_blank" rel="noreferrer">Mustad — Chinu spade-end pattern</a><a href="https://gamakatsu.com/product/octopus-hooks-circle-inline-point/" target="_blank" rel="noreferrer">Gamakatsu — non-offset circle design</a><a href="https://www.fisheries.noaa.gov/national/resources-fishing/catch-and-release-fishing-best-practices" target="_blank" rel="noreferrer">NOAA — catch-and-release handling</a></details>
    </div>
    <BottomNav key={language} active="fishing-hub"/>
  </main>;
}
