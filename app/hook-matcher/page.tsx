"use client";
/* eslint-disable @next/next/no-img-element -- Local SVG/WebP reference illustrations use fixed dimensions and lazy loading in the library. */

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Fish, Languages, RotateCcw, ShieldCheck } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import Link from 'next/link';
import { baitHooks, baits, baitSizes, targets, hookTerms, matchBaitHook, hookTargetFromSpecies, type Copy, type HookChoice, type BaitHook } from '@/lib/hook-matcher';
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
  const endLabel=(end:'eye'|'spade')=>end==='eye'?t('Eyed / ringed','بعين / حلقة'):t('Spade-end / no eye','رأس مفلطح / بدون عين');

  return <main className="bait-page" dir={rtl?'rtl':'ltr'}>
    <header className="bait-topbar">
      <a href="/fishing-hub"><ArrowLeft size={18}/>{t('Fishing Hub','مركز الصيد')}</a>
      <Link href="/" className="bait-brand">ALEX<strong>FISHER</strong></Link>
      <button type="button" onClick={()=>{const next=rtl?'en':'ar';setLanguage(next);window.localStorage.setItem('alexfisher-language',next)}}><Languages size={18}/>{rtl?'English':'العربية'}</button>
    </header>
    <div className="bait-content">
      <header className="bait-intro">
        <span className="bait-eyebrow"><Fish size={17}/>{t('NATURAL BAIT · MENA','طُعم طبيعي · الشرق الأوسط وشمال أفريقيا')}</span>
        <h1>{t('Match your hook to your bait.','اختر سنارة الصيد المناسبة.')}</h1>
        <p>{t('Pick your bait, bait size and target fish. Get a hook pattern, size guide and hook-set tips for your next session.','اختر الطُعم وحجم التطعيمة والسمكة المستهدفة. نرشّح لك السنارة (الخطاف) ومقاسها وطريقة تثبيت السن في طلعتك القادمة.')}</p>
        <nav aria-label={t('Hook matcher sections','أقسام دليل الخطاف')}><a href="#bait-picker">{t('Find my hook','اختر خطافي')}</a><a href="#bait-library">{t('Browse hook images','تصفح صور الخطافات')}</a><a href="#bait-guide">{t('Quick guide','دليل سريع')}</a></nav>
      </header>
      <div className="bait-workspace">
        <section id="bait-picker" className="bait-form" aria-labelledby="bait-picker-title">
          <header><div><h2 id="bait-picker-title">{t('Build your bait rig','جهّز عدّة الطُعم')}</h2><p>{t('Change any choice to update your result.','غيّر أي اختيار لتظهر النتيجة الجديدة فوراً.')}</p></div><button className="bait-reset" onClick={()=>setChoice({...defaults})}><RotateCcw size={16}/>{t('Reset','إعادة ضبط')}</button></header>
          <fieldset><legend><span>1</span>{t('What are you baiting up with?','بماذا ستطعّم الخطاف؟')}</legend>
            <div className="bait-options bait-bait-options">{baits.map(bait=><button key={bait.id} type="button" aria-pressed={choice.bait===bait.id} onClick={()=>change('bait',bait.id)}><strong>{c(bait.label)}</strong><small>{c(bait.hint)}</small>{choice.bait===bait.id&&<Check size={17}/>}</button>)}</div>
          </fieldset>
          <fieldset><legend><span>2</span>{t('What size is your bait?','ما حجم التطعيمة؟')}</legend>
            <div className="bait-options bait-size-options">{baitSizes.map(size=><button key={size.id} type="button" aria-pressed={choice.size===size.id} onClick={()=>change('size',size.id)}><strong>{c(size.label)}</strong><small>{c(size.hint)}</small></button>)}</div>
          </fieldset>
          <fieldset><legend><span>3</span>{t('What is your target fish?','ما السمكة المستهدفة؟')}</legend>
            <label className="bait-select-label"><span className="sr-only">{t('Target fish','السمكة المستهدفة')}</span><select value={choice.target} onChange={event=>change('target',event.target.value as HookChoice['target'])}>{targets.map(target=><option key={target.id} value={target.id}>{c(target.label)}</option>)}</select></label>
          </fieldset>
          <details className="bait-preferences"><summary>{t('Rig options: hook-set & attachment','تفاصيل العدة: تثبيت السن وربط الخطاف')}<ChevronDown size={18}/></summary><div>
            <fieldset><legend>{t('How do you set the hook?','كيف ستثبّت السن عند العضة؟')}</legend><div className="bait-options"><button aria-pressed={choice.approach==='active'} onClick={()=>change('approach','active')}><strong>{t('Strike / hook-set','ضربة تثبيت بالقصبة')}</strong><small>{t('Reel down, then lift the rod firmly','ألمّ الخيط ثم أرفع القصبة بثبات')}</small></button><button aria-pressed={choice.approach==='steady'} onClick={()=>change('approach','steady')}><strong>{t('Reel into the bite','ألفّ البكرة على شدّ السمكة')}</strong><small>{t('Let the rod load; no hard strike','أترك السمكة تحمّل القصبة دون ضربة')}</small></button></div></fieldset>
            <fieldset><legend>{t('How do you want to tie the hook?','كيف تريد ربط الخطاف؟')}</legend><div className="bait-options"><button aria-pressed={choice.end==='eye'} onClick={()=>change('end','eye')}><strong>{t('Eyed / ringed','بعين / حلقة')}</strong><small>{t('Tie the line through the hole','أربط الخيط من فتحة الحلقة')}</small></button><button aria-pressed={choice.end==='spade'} onClick={()=>change('end','spade')}><strong>{t('Spade-end / no eye','رأس مفلطح / بدون عين')}</strong><small>{t('Snell around the shank, or buy ready-tied','أربط حول الساق أو أشتريه مربوطاً')}</small></button></div></fieldset>
          </div></details>
          <button className="bait-show-result" onClick={()=>{reveal(resultRef.current)}}>{t('See my hook','شاهد خطافي')}<ArrowRight size={18}/></button>
        </section>
        <section className="bait-result" ref={resultRef} tabIndex={-1} aria-labelledby="bait-result-title">
          <div className="bait-result-heading"><span className="bait-eyebrow"><Check size={16}/>{t('SUGGESTED HOOK','الخطاف المقترح')}</span><h2 id="bait-result-title" aria-live="polite" aria-atomic="true">{c(result.hook.name)}</h2><p>{c(baits.find(b=>b.id===choice.bait)!.label)} · {c(baitSizes.find(s=>s.id===choice.size)!.label)} · {c(targets.find(s=>s.id===choice.target)!.label)}</p></div>
          <figure><img src={result.hook.image} alt={c(result.hook.name)} width={360} height={300}/><figcaption>{endLabel(result.hook.end)} · {t('Picture shows the shape, not the size','الصورة للشكل وليست للحجم الحقيقي')}</figcaption></figure>
          <div className="bait-result-body">
            <p>{c(result.why)}</p>
            <dl><div><dt>{t('Sizes to try','مقاسات مقترحة للتجربة')}</dt><dd dir="ltr">{result.range}</dd><p>{t('These sizes are a guide only. Leave room between the bait and the hook point. Sizes differ by brand, especially circle hooks.','هذه المقاسات للتجربة وليست مقاساً مؤكداً. اترك مساحة بين الطُعم وسن الخطاف. المقاسات تختلف بين الشركات، خاصة الخطاف الدائري.')}</p></div><div><dt>{t('Hook wire','قوة سلك الخطاف')}</dt><dd>{c(result.wire)}</dd></div><div className="bait-setting"><dt>{t('Hook-set','تثبيت السن عند العضة')}</dt><dd>{c(result.hook.setting)}</dd></div></dl>
            {result.endMismatch&&<p className="bait-caution">{t('You chose a hook without an eye, but the better match in this guide has an eye. The right shape and strength come first.','اخترت خطافاً بدون حلقة، لكن الأنسب لاختياراتك في هذا الدليل له حلقة. الشكل والقوة المناسبان أهم.')}</p>}
            {result.toothy&&<p className="bait-caution">{t('Watch for bite-offs. Use a leader suited to toothy fish; a long-shank hook alone will not protect your line.','احذر قطع الليدر بالأسنان. استخدم ليدر مناسباً للأسماك المسنّنة؛ الخطاف طويل الساق وحده لا يحمي الخيط.')}</p>}
            {result.baitWarning&&<p className="bait-caution">{t('This bait is not a usual choice for this fish. Ask local anglers which bait works before choosing the hook size.','هذا الطُعم ليس اختياراً معتاداً لهذه السمكة. اسأل الصيادين في منطقتك عن الطُعم المناسب قبل اختيار المقاس.')}</p>}
            <button className="bait-profile-link" onClick={()=>inspect(result.hook)}>{t('View this hook in detail','تفاصيل هذا الخطاف')}<ArrowRight size={16}/></button>
            <details className="bait-alternative"><summary>{t('Another hook you can try','خطاف آخر يمكنك تجربته')}</summary><strong>{c(result.alternative.name)}</strong><p>{c(result.alternative.setting)}</p><button onClick={()=>inspect(result.alternative)}>{t('View alternative','شاهد البديل')}</button></details>
          </div>
        </section>
      </div>
      <section id="bait-library" className="bait-library" aria-labelledby="bait-library-title">
        <header><span className="bait-eyebrow">{t('LOOK. COMPARE. RECOGNISE.','شاهد. قارن. تعرّف.')}</span><h2 id="bait-library-title">{t('Hook pictures & uses','صور الخطافات واستخداماتها')}</h2><p>{t('Natural-bait hooks for fishing in the Middle East and North Africa: the Mediterranean, Red Sea, Gulf, rivers and lakes. Names can differ by country; use the picture to recognise the shape.','خطافات للطُعم الطبيعي في الشرق الأوسط وشمال أفريقيا: المتوسط والبحر الأحمر والخليج والأنهار والبحيرات. الأسماء قد تختلف بين البلدان؛ تعرّف على الشكل من الصورة.')}</p></header>
        <div className="bait-filter" role="group" aria-label={t('Filter by attachment','تصفية حسب نهاية الخطاف')}>{(['all','eye','spade'] as const).map(end=><button key={end} aria-pressed={filter===end} onClick={()=>setFilter(end)}>{end==='all'?t('All hooks','كل الخطافات'):endLabel(end)}</button>)}</div>
        <div className="bait-gallery">{visible.map(hook=><button key={hook.id} aria-pressed={activeId===hook.id} onClick={()=>{setActiveId(hook.id);reveal(detailRef.current)}}><img src={hook.image} alt={c(hook.name)} width={220} height={190} loading="lazy"/><span><small>{endLabel(hook.end)}</small><strong>{c(hook.name)}</strong></span></button>)}</div>
        <article className="bait-profile" ref={detailRef} tabIndex={-1} aria-label={t('Selected hook details','تفاصيل الخطاف المختار')}><figure><img src={active.image} alt={c(active.name)} width={300} height={300} loading="lazy"/><figcaption>{t('Example shape · not actual size','شكل توضيحي · ليس بالحجم الحقيقي')}</figcaption></figure><div><span className="bait-eyebrow">{endLabel(active.end)}</span><h3>{c(active.name)}</h3><p>{c(active.shape)}</p><dl><div><dt>{t('Use it for','استخدامه')}</dt><dd>{c(active.best)}</dd></div><div><dt>{t('Rigging tip','نصيحة للربط والتطعيم')}</dt><dd>{c(active.tip)}</dd></div><div><dt>{t('Hook-set','تثبيت السن عند العضة')}</dt><dd>{c(active.setting)}</dd></div></dl></div></article>
      </section>
      <section id="bait-guide" className="bait-guide"><h2>{t('Three simple tips','ثلاث نصائح بسيطة')}</h2>
        <details className="bait-sources"><summary>{t('Angler terms, made simple','مصطلحات الصيادين ببساطة')}</summary><p>{t('Names vary between countries and tackle shops. These short explanations help you follow the guide.','الأسماء تختلف بين البلدان ومحلات الصيد. هذه معاني المصطلحات المستخدمة في الدليل.')}</p><dl>{hookTerms.map(term=><div key={term.name.en}><dt>{c(term.name)}</dt><dd>{c(term.meaning)}</dd></div>)}</dl></details>
        <div className="bait-guide-grid">
        <article><span>01</span><h3>{t('Choose the size to fit your bait','اختر المقاس حسب الطُعم')}</h3><p>{t('Do not cover the point or fill the opening with bait. The same size number can mean different sizes in different brands.','لا تغطِّ السن ولا تملأ الفتحة بالطُعم. رقم المقاس نفسه قد يختلف في الحجم من شركة لأخرى.')}</p><p className="bait-number-guide" dir="ltr">#10 → #4 → #1 → 1/0 → 4/0 → 8/0</p><small>{t('Smaller → larger. Shape and wire still matter.','من الأصغر إلى الأكبر. الشكل والسلك مهمان أيضاً.')}</small></article>
        <article><span>02</span><h3>{t('With a hole, or without?','بعين / حلقة أم بدون حلقة؟')}</h3><p>{t('An eyed hook has a hole for the line. A spade-end hook has a flat head with no hole: tie the line around its straight shaft. Each type needs the right knot.','الخطاف بعين / حلقة له فتحة لربط الخيط. الخطاف بدون حلقة له رأس مسطح، ويُربط الخيط حول ساقه المستقيمة. لكل نوع عقدة مناسبة.')}</p><small>{t('Not sure how to tie a flat-head hook? Buy one already tied to line.','لا تعرف عقدة الرأس المسطح؟ اشترِ خطافاً مربوطاً بخيط وجاهزاً للاستخدام.')}</small></article>
        <article><span>03</span><h3>{t('Circle hook: reel into the bite','الخطاف الدائري: لفّ على شدّ السمكة')}</h3><p>{t('A circle hook with no sideways bend can reduce deep hooking. Keep the opening clear. Let the rod load; no hard strike without jerking the rod.','الخطاف الدائري الذي لا يميل سنّه جانبياً قد يقلل تعلق الخطاف عميقاً داخل السمكة. اترك الفتحة مكشوفة، وانتظر شد الخيط ثم لفّ البكرة بثبات دون سحب القصبة فجأة.')}</p><small>{t('Hooks without a barb (the small backward spike) can be easier to remove.','الخطاف بدون لسان (البروز الصغير خلف السن) قد يكون أسهل في النزع.')}</small></article>
      </div></section>
      <aside className="bait-responsible"><ShieldCheck size={22}/><p>{t('This guide helps you choose; it does not guarantee a catch. Check the fishing rules in your area before you go. Use suitable gear so you can land and release fish quickly.','هذا الدليل يساعدك في الاختيار ولا يضمن الصيد. راجع قواعد الصيد في منطقتك قبل الخروج. استخدم أدوات مناسبة لإخراج السمكة وإعادتها للماء بسرعة.')}</p></aside>
      <details className="bait-sources"><summary>{t('About this guide & sources','عن الدليل والمصادر')}</summary><p>{t('This guide covers common natural-bait hooks, not every model. It does not cover hooks for artificial lures or jigs. The sources explain hook designs and fish care; local fishing rules and brand sizes may differ.','يعرض الدليل خطافات شائعة للطُعم الطبيعي، وليس كل الموديلات. لا يشمل خطافات الطُعم الصناعي أو الجيج. المصادر تشرح الأشكال والتعامل مع السمك؛ قوانين الصيد والمقاسات تختلف حسب المكان والشركة.')}</p><a href="https://mustad-fishing.com/eu/products/10116np/" target="_blank" rel="noreferrer">Mustad — Chinu spade-end pattern</a><a href="https://gamakatsu.com/product/octopus-hooks-circle-inline-point/" target="_blank" rel="noreferrer">Gamakatsu — non-offset circle design</a><a href="https://www.fisheries.noaa.gov/national/resources-fishing/catch-and-release-fishing-best-practices" target="_blank" rel="noreferrer">NOAA — catch-and-release handling</a></details>
    </div>
    <BottomNav key={language} active="fishing-hub"/>
  </main>;
}
