export type Copy = { en: string; ar: string };
const copy = (en: string, ar: string): Copy => ({ en, ar });
export const baits = [
  { id: 'shrimp', label: copy('Shrimp / prawn', 'جمبري'), hint: copy('Whole or peeled', 'كامل أو مقشر') },
  { id: 'worm', label: copy('Worms', 'ديدان'), hint: copy('Ragworm, lugworm, earthworm', 'ديدان البحر أو الأرض') },
  { id: 'strip', label: copy('Fish strips', 'شرائح سمك'), hint: copy('Sardine or other cut fish', 'سردين أو سمك مقطع') },
  { id: 'squid', label: copy('Squid / cuttlefish', 'سبيط / سيبيا'), hint: copy('Strips or small pieces', 'شرائح أو قطع صغيرة') },
  { id: 'shell', label: copy('Crab / shellfish', 'كابوريا / محار'), hint: copy('Crab pieces, mussel flesh', 'قطع كابوريا أو لحم محار') },
  { id: 'live', label: copy('Live baitfish', 'سمك طُعم حي'), hint: copy('Keep the bait moving freely', 'اترك الطُعم يتحرك بحرية') },
  { id: 'whole', label: copy('Whole fish / chunks', 'سمكة كاملة / قطع كبيرة'), hint: copy('Dead sardine or fish chunks', 'سردين ميت أو قطع سمك') },
  { id: 'bread', label: copy('Bread / dough / corn', 'خبز / عجين / ذرة'), hint: copy('Freshwater and small-mouth fish', 'مياه عذبة وأسماك صغيرة الفم') },
] as const;
export const baitSizes = [
  { id: 'small', label: copy('Small', 'صغير'), hint: copy('Thin worm, peeled prawn, a kernel', 'دودة رفيعة أو جمبري صغير أو حبة ذرة') },
  { id: 'medium', label: copy('Medium', 'متوسط'), hint: copy('Whole prawn or a fish strip', 'جمبري كامل أو شريحة سمك') },
  { id: 'large', label: copy('Large', 'كبير'), hint: copy('Whole baitfish or a thick chunk', 'سمكة طُعم كاملة أو قطعة سميكة') },
] as const;
export const targets = [
  { id: 'mixed', label: copy('Not sure / mixed catch', 'غير متأكد / صيد متنوع') },
  { id: 'bream', label: copy('Bream / mormora', 'دنيس / مرمار') },
  { id: 'bass', label: copy('Sea bass / queenfish', 'قاروص / كوين فيش') },
  { id: 'reef', label: copy('Grouper / snapper', 'هامور / نهاش') },
  { id: 'pelagic', label: copy('Tuna / amberjack', 'تونة / أمبرجاك') },
  { id: 'toothy', label: copy('Bluefish / barracuda', 'مياس / باراكودا') },
  { id: 'fresh', label: copy('Tilapia / carp', 'بلطي / مبروك') },
  { id: 'catfish', label: copy('Large catfish', 'قرموط كبير') },
] as const;
export type BaitId = typeof baits[number]['id'];
export type BaitSize = typeof baitSizes[number]['id'];
export type TargetId = typeof targets[number]['id'];
export function hookTargetFromSpecies(species: string | null): TargetId {
  const aliases: Record<string, TargetId> = {seabream:'bream',mormora:'bream',seabass:'bass',queenfish:'bass',grouper:'reef',snapper:'reef',tuna:'pelagic',amberjack:'pelagic',bluefish:'toothy',barracuda:'toothy',tilapia:'fresh',carp:'fresh'};
  return targets.some(target=>target.id===species)?species as TargetId:aliases[species??'']??'mixed';
}
export type HookChoice = { bait: BaitId; size: BaitSize; target: TargetId; approach: 'active' | 'steady'; end: 'eye' | 'spade' };
export type BaitHook = { id: string; name: Copy; end: 'eye' | 'spade'; image: string; best: Copy; shape: Copy; tip: Copy; setting: Copy };
const activeSet = copy('Reel in slack, then make a controlled strike. Do not wait for the fish to swallow the bait.', 'لمّ الخيط المرتخي ثم اضرب ضربة متحكم بها. لا تنتظر حتى تبتلع السمكة الطُعم.');
export const baitHooks: BaitHook[] = [
  { id:'chinu-eye', name:copy('Chinu / bream · eyed','شينو / دنيس · بعين'), end:'eye', image:'/assets/hooks/chinu-eyed.svg', best:copy('Prawn, shellfish and compact bream baits.','جمبري ومحار وطُعم مدمج للدنيس.'), shape:copy('Short shank, broad bend and a slightly inward point.','ساق قصيرة وانحناء عريض وسن مائل قليلاً للداخل.'), tip:copy('Keep the gap clear; use an eye knot suited to your line.','اترك الفتحة مكشوفة واستخدم عقدة عين مناسبة للخيط.'), setting:activeSet },
  { id:'chinu-spade', name:copy('Chinu / bream · spade','شينو / دنيس · مفلطح'), end:'spade', image:'/assets/hooks/chinu-spade.svg', best:copy('Compact prawn and shellfish presentations on a snelled leader.','جمبري ومحار بتركيب مدمج على ليدر مربوط حول الساق.'), shape:copy('A flattened head instead of a ring; compact, broad bend.','رأس مفلطح بدلاً من العين مع انحناء عريض مدمج.'), tip:copy('Use a proper spade-end snell around the shank, or buy a pre-tied hook. Check the line cannot slip over the head.','استخدم عقدة خطاف مفلطح حول الساق أو خطافاً مربوطاً مسبقاً. تأكد أن الخيط لا ينزلق فوق الرأس.'), setting:activeSet },
  { id:'fine-spade', name:copy('Fine-wire · spade','سلك رفيع · مفلطح'), end:'spade', image:'/assets/hooks/fine-spade.svg', best:copy('Small worms, bread and delicate small-mouth presentations.','ديدان صغيرة وخبز وطُعم رقيق للأسماك صغيرة الفم.'), shape:copy('Slim wire, round bend and a flat spade head.','سلك رفيع وانحناء دائري ورأس مفلطح.'), tip:copy('Choose a pre-tied version if you are new to spade knots. Not a heavy-drag hook.','اختر خطافاً مربوطاً مسبقاً إن لم تتقن عقدة الساق. ليس للشد الثقيل.'), setting:activeSet },
  { id:'j', name:copy('J-hook / round bend','خطاف J / انحناء دائري'), end:'eye', image:'/assets/hooks/j-hook.webp', best:copy('General natural-bait fishing with the rod in hand.','صيد عام بالطُعم الطبيعي والقصبة في اليد.'), shape:copy('An open J-shaped point and bend.','سن مفتوح وانحناء على شكل J.'), tip:copy('Do not hide the point in a ball of bait.','لا تُخفِ السن داخل كتلة من الطُعم.'), setting:activeSet },
  { id:'long', name:copy('Long shank / Aberdeen','طويل الساق / أبردين'), end:'eye', image:'/assets/hooks/long-shank-hook.webp', best:copy('Worms and narrow strips that need shank support.','ديدان وشرائح رفيعة تحتاج دعماً على الساق.'), shape:copy('An extended shank; Aberdeen patterns usually use finer wire.','ساق طويلة؛ أنواع أبردين غالباً بسلك أرفع.'), tip:copy('Match wire strength to the target. A long shank is not a bite-proof leader.','طابق قوة السلك مع السمكة. الساق الطويلة لا تمنع قطع الليدر بالأسنان.'), setting:activeSet },
  { id:'baitholder', name:copy('Baitholder','حامل الطُعم'), end:'eye', image:'/assets/hooks/baitholder-hook.webp', best:copy('Worms, sardine strips and squid strips for casting.','ديدان وشرائح سردين وسبيط عند الرمي.'), shape:copy('Small retaining barbs on the shank hold bait in place.','نتوءات صغيرة على الساق تساعد في تثبيت الطُعم.'), tip:copy('Shank barbs can tear delicate live bait. Keep the point and gap free.','نتوءات الساق قد تمزق الطُعم الحي الرقيق. اترك السن والفتحة مكشوفين.'), setting:activeSet },
  { id:'octopus', name:copy('Octopus · J-point','أوكتوبس · سن J'), end:'eye', image:'/assets/hooks/octopus-hook.webp', best:copy('Prawn and small fish baits on compact rigs.','جمبري وسمك طُعم صغير بتجهيزات مدمجة.'), shape:copy('Short shank and a turned eye. This is not the circle-point version.','ساق قصيرة وعين مائلة. هذا ليس إصدار السن الدائري.'), tip:copy('Check the actual point shape: octopus and octopus circle need different hook sets.','راجع شكل السن: الأوكتوبس والأوكتوبس الدائري لهما طريقة تثبيت مختلفة.'), setting:activeSet },
  { id:'circle', name:copy('Circle · non-offset','دائري · غير منحرف'), end:'eye', image:'/assets/hooks/circle-hook.webp', best:copy('Natural bait with steady tension; a useful release-minded choice.','طُعم طبيعي مع شد تدريجي؛ اختيار مناسب عند نية إطلاق السمك.'), shape:copy('The point turns inward toward the shank. Choose a non-offset model.','السن متجه للداخل نحو الساق. اختر موديل غير منحرف جانبياً.'), tip:copy('Leave the entire gap open. Verify non-offset construction on the packet; the side image cannot show offset.','اترك الفتحة كاملة مكشوفة. تحقق من عدم الانحراف على العبوة؛ الصورة الجانبية لا تُظهره.'), setting:copy('Do not strike. Let the line tighten, then reel steadily as the rod loads.','لا تضرب. اترك الخيط يشد ثم لفّ البكرة بثبات مع تحميل القصبة.') },
  { id:'live', name:copy('Live-bait · J-point','طُعم حي · سن J'), end:'eye', image:'/assets/hooks/live-bait-hook.webp', best:copy('Live sardine or other baitfish with an active hook set.','سردين حي أو سمك طُعم مع تثبيت نشط.'), shape:copy('Compact, strong pattern that keeps bulk low.','شكل مدمج وقوي يقلل الحجم على الطُعم.'), tip:copy('Use the lightest adequate wire so the bait can swim; leave the point exposed.','استخدم أخف سلك بقوة كافية ليتمكن الطُعم من السباحة واترك السن مكشوفاً.'), setting:activeSet },
  { id:'kahle', name:copy('Kahle / wide bend','كالي / انحناء واسع'), end:'eye', image:'/assets/hooks/kahle-hook.webp', best:copy('Bulky natural baits that need a wider opening.','طُعم طبيعي سميك يحتاج فتحة أوسع.'), shape:copy('A very broad bend with an open point; not a circle hook.','انحناء عريض جداً وسن مفتوح؛ ليس خطافاً دائرياً.'), tip:copy('Do not assume circle-hook release benefits from a wide bend alone.','لا تفترض فوائد الخطاف الدائري لمجرد أن الانحناء عريض.'), setting:copy('Take up slack and use a controlled sweep.','لمّ الارتخاء واسحب سحبة متحكم بها.') },
  { id:'heavy', name:copy('Heavy-duty bait hook','خطاف طُعم شديد التحمل'), end:'eye', image:'/assets/hooks/grouper-hook.webp', best:copy('Larger grouper, snapper, tuna or catfish baits on suitable tackle.','طُعم كبير للهامور والنهاش والتونة والقرموط مع عدة مناسبة.'), shape:copy('A compact, strong-wire J pattern. Heavy circles are another option.','شكل J مدمج بسلك قوي. توجد أيضاً خطافات دائرية ثقيلة.'), tip:copy('Match wire, leader and drag together. X-strength labels vary by manufacturer.','طابق السلك والليدر والفرامل معاً. تصنيفات القوة X تختلف بين الشركات.'), setting:activeSet },
];

export function matchBaitHook(choice: HookChoice) {
  const {bait,size,target,approach,end}=choice;
  const powerful=['reef','pelagic','catfish'].includes(target);
  let id='j';
  let why=copy('An open-point all-rounder for natural bait and a controlled hook set.','خطاف عام بسن مفتوح للطُعم الطبيعي والتثبيت المتحكم به.');
  if(bait==='shrimp'||bait==='shell'||target==='bream'){
    id=end==='spade'?'chinu-spade':'chinu-eye';
    why=copy('A compact, broad bend leaves room for prawn or shellfish without a long shank.','انحناء مدمج وعريض يترك مساحة للجمبري والمحار دون ساق طويلة.');
  }
  if(bait==='worm'||bait==='bread'){
    id=end==='spade'?(size==='small'?'fine-spade':'chinu-spade'):(bait==='worm'?'long':'j');
    why=copy('A light, unobtrusive presentation suits this bait. Match the actual wire to the fish.','تركيب خفيف وقليل الظهور يناسب هذا الطُعم. طابق السلك الفعلي مع السمكة.');
  }
  if(bait==='strip'||bait==='squid'){
    id=end==='spade'?'chinu-spade':'baitholder';
    why=end==='spade'?copy('A compact spade-end pattern can present a strip; secure soft bait without filling the gap.','خطاف مفلطح مدمج لعرض الشريحة؛ ثبّت الطُعم اللين دون ملء الفتحة.'):copy('Shank barbs help keep a strip in place during casting.','نتوءات الساق تساعد في إبقاء الشريحة ثابتة أثناء الرمي.');
  }
  if(bait==='live'||bait==='whole'){
    id=bait==='live'?'live':'octopus';
    why=copy('A compact bait pattern leaves room for the fish bait while keeping the point exposed.','خطاف طُعم مدمج يترك مساحة لسمكة الطُعم مع إبقاء السن مكشوفاً.');
  }
  if(powerful){
    id='heavy';why=copy('Use a stronger bait pattern for powerful fish, but keep its size matched to the bait—not just fish weight.','استخدم خطاف طُعم أقوى للسمك القوي، لكن طابق حجمه مع الطُعم وليس وزن السمكة فقط.');
  }
  if(approach==='steady'){
    id='circle';why=copy('You chose steady pressure, so a non-offset circle is the better starting point. It must be fished without a strike.','اخترت الضغط التدريجي، لذا الدائري غير المنحرف نقطة بداية أنسب. يجب استخدامه دون ضربة.');
  }
  const hook=baitHooks.find(h=>h.id===id)!;
  const alternative=baitHooks.find(h=>h.id===(id==='circle'?(powerful?'heavy':bait==='worm'?'long':bait==='live'?'live':'j'):'circle'))!;
  const ranges={small:'#10–#4',medium:'#4–2/0',large:'3/0–8/0'};
  return {hook,alternative,why,range:ranges[size],powerful,
    wire: powerful?copy('Strong wire; verify leader and drag compatibility.','سلك قوي؛ تحقق من توافق الليدر والفرامل.'):size==='large'?copy('Medium to strong wire without weighing down the bait.','سلك متوسط إلى قوي دون إثقال الطُعم.'):copy('Fine to medium wire with enough strength for the target.','سلك رفيع إلى متوسط بقوة كافية للسمكة.'),
    endMismatch:end==='spade'&&hook.end!=='spade',
    toothy:target==='toothy',
    baitWarning:(target==='fresh'&&['live','whole'].includes(bait))||(bait==='bread'&&['reef','pelagic','toothy'].includes(target)),
  };
}
