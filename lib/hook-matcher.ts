export type Copy = { en: string; ar: string };
const copy = (en: string, ar: string): Copy => ({ en, ar });
export const hookTerms = [
  {name:copy('Bait rig','عدّة الطُعم'),meaning:copy('The hook, leader and other parts used to present your bait.','الخطاف والليدر وباقي الأجزاء التي تحمل الطُعم وتقدّمه للسمكة.')},
  {name:copy('Hook-set','تثبيت السن'),meaning:copy('The action that makes the hook point grip. Open-point hooks usually need a strike; circle hooks need steady reeling instead.','الحركة التي تجعل السن يشبك. الخطاف المفتوح يحتاج عادةً ضربة تثبيت، والدائري يحتاج لفّ البكرة بثبات دون ضربة.')},
  {name:copy('Leader','الليدر'),meaning:copy('The length of line between your main line and the hook.','جزء الخيط بين الخيط الرئيسي والخطاف.')},
  {name:copy('Drag','الدراج — فرامل البكرة'),meaning:copy('The reel setting that lets line out under pressure. Match it to your tackle strength.','ضبط البكرة الذي يسمح بخروج الخيط عند الشد. اضبطه حسب قوة العدة.')},
  {name:copy('Shank & gape','ساق الخطاف وفتحته'),meaning:copy('The shank is the straight part. The gape is the space between the shank and the point; keep it clear of bait.','الساق هي الجزء المستقيم. الفتحة هي المسافة بين الساق والسن؛ لا تملأها بالطُعم.')},
  {name:copy('Snell / spade-end knot','عقدة الساق للرأس المفلطح'),meaning:copy('A knot wrapped around the hook shank. Use a knot suited to your hook, or buy a ready-tied hooklength.','عقدة تُلف حول ساق الخطاف. استخدم عقدة مناسبة لنوعه، أو اشترِ خطافاً مربوطاً بخيط وجاهزاً.')},
  {name:copy('Reel down / reel into the bite','لمّ الخيط / لفّ على شدّ السمكة'),meaning:copy('Reel down means take up slack before setting a J-hook. With a circle hook, let the fish tighten the line and reel steadily without a strike.','لمّ الخيط يعني جمع الارتخاء قبل تثبيت خطاف J. مع الدائري، اترك السمكة تشد الخيط ثم لفّ بثبات دون ضربة.')},
];
export const baits = [
  { id: 'shrimp', label: copy('Shrimp / prawn', 'جمبري / روبيان'), hint: copy('Whole or peeled', 'كامل أو مقشر') },
  { id: 'worm', label: copy('Worms', 'ديدان'), hint: copy('Sea worms or earthworms', 'ديدان البحر أو الأرض') },
  { id: 'strip', label: copy('Cut bait / fish strips', 'شرائح سمك للطُعم'), hint: copy('Sardine or other cut fish', 'سردين أو سمك مقطع') },
  { id: 'squid', label: copy('Squid / cuttlefish', 'حبار / سبيط / سيبيا'), hint: copy('Strips or small pieces', 'شرائح أو قطع صغيرة') },
  { id: 'shell', label: copy('Crab / shellfish', 'سلطعون / كابوريا / محار'), hint: copy('Crab pieces or shellfish meat', 'قطع كابوريا أو لحم محار') },
  { id: 'live', label: copy('Live bait', 'طُعم حي (سمك صغير)'), hint: copy('Keep the bait moving freely', 'اترك الطُعم يتحرك بحرية') },
  { id: 'whole', label: copy('Whole fish / chunks', 'سمكة كاملة / قطع كبيرة'), hint: copy('Dead sardine or fish chunks', 'سردين ميت أو قطع سمك') },
  { id: 'bread', label: copy('Bread / dough / corn', 'خبز / عجين / ذرة'), hint: copy('For fish with small mouths', 'للأسماك ذات الفم الصغير') },
] as const;
export const baitSizes = [
  { id: 'small', label: copy('Small', 'صغير'), hint: copy('A thin worm, small shrimp or corn', 'دودة رفيعة أو جمبري صغير أو حبة ذرة') },
  { id: 'medium', label: copy('Medium', 'متوسط'), hint: copy('Whole prawn or a fish strip', 'جمبري كامل أو شريحة سمك') },
  { id: 'large', label: copy('Large', 'كبير'), hint: copy('Whole baitfish or a thick chunk', 'سمكة طُعم كاملة أو قطعة سميكة') },
] as const;
export const targets = [
  { id: 'mixed', label: copy('Any fish / not sure', 'أي سمكة / غير متأكد') },
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
const activeSet = copy('Reel down to take up slack, then make a firm hook-set. Do not wait for the fish to swallow the bait.', 'لمّ الخيط المرتخي، ثم اعمل ضربة تثبيت بالقصبة ليشبك السن. لا تنتظر حتى تبتلع السمكة الطُعم.');
export const baitHooks: BaitHook[] = [
  { id:'chinu-eye', name:copy('Chinu / bream hook · eyed','خطاف دنيس (شينو) · بحلقة'), end:'eye', image:'/assets/hooks/chinu-eyed.svg', best:copy('Shrimp, shellfish and small pieces of bait for bream.','جمبري أو روبيان ومحار وقطع طُعم صغيرة للدنيس.'), shape:copy('Short shank, broad bend and a slightly inward point.','ساق قصيرة وانحناء عريض وسن مائل قليلاً للداخل.'), tip:copy('Keep the gape—the space between point and shank—clear of bait. Tie through the eye with a suitable hook knot.','اترك فتحة الخطاف، بين السن والساق، خالية من الطُعم. اربط الخيط في العين بعقدة مناسبة.'), setting:activeSet },
  { id:'chinu-spade', name:copy('Chinu / bream hook · spade-end','خطاف دنيس (شينو) · بدون حلقة'), end:'spade', image:'/assets/hooks/chinu-spade.svg', best:copy('Shrimp and shellfish on a snelled hook, with the leader tied around the shank.','جمبري أو روبيان ومحار، مع ربط الليدر حول ساق الخطاف بعقدة مناسبة.'), shape:copy('A flat head instead of a hole for the line, with a wide bend.','رأس مسطح بدون حلقة للخيط، وانحناء واسع.'), tip:copy('Use a spade-end snell around the shank, or a ready-tied hooklength. Check the knot cannot slip over the flat head.','استخدم عقدة مخصصة للرأس المسطح حول ساق الخطاف، أو اشترِ خطافاً مربوطاً بخيط. تأكد أن العقدة لا تنزلق.'), setting:activeSet },
  { id:'fine-spade', name:copy('Fine-wire hook · spade-end','خطاف رفيع · بدون حلقة'), end:'spade', image:'/assets/hooks/fine-spade.svg', best:copy('Small worms or bread for fish with small mouths.','ديدان صغيرة أو خبز للأسماك ذات الفم الصغير.'), shape:copy('Slim wire, round bend and a flat spade head.','سلك رفيع وانحناء دائري ورأس مفلطح.'), tip:copy('New to hooks without an eye? Buy one already tied to line. Thin wire is not for heavy pulling.','إذا لم تعرف عقدة الخطاف بدون حلقة، اشترِ واحداً مربوطاً بخيط. السلك الرفيع لا يناسب الشد القوي.'), setting:activeSet },
  { id:'j', name:copy('J-hook / round bend','خطاف J / انحناء دائري'), end:'eye', image:'/assets/hooks/j-hook.webp', best:copy('General natural-bait fishing with the rod in hand.','صيد عام بالطُعم الطبيعي والقصبة في اليد.'), shape:copy('An open J-shaped point and bend.','سن مفتوح وانحناء على شكل J.'), tip:copy('Do not hide the point in a ball of bait.','لا تُخفِ السن داخل كتلة من الطُعم.'), setting:activeSet },
  { id:'long', name:copy('Long shank / Aberdeen','طويل الساق / أبردين'), end:'eye', image:'/assets/hooks/long-shank-hook.webp', best:copy('Worms and thin strips of bait that fit along a long hook.','ديدان وشرائح طُعم رفيعة تُثبت على ساق طويلة.'), shape:copy('A long, straight shaft. Aberdeen hooks usually have thinner wire.','ساق طويلة ومستقيمة. خطافات أبردين غالباً بسلك أرفع.'), tip:copy('Choose wire strong enough for your fish. A long hook does not stop sharp teeth cutting the line.','اختر سلكاً بقوة تناسب السمكة. الخطاف الطويل لا يمنع الأسنان الحادة من قطع الخيط.'), setting:activeSet },
  { id:'baitholder', name:copy('Baitholder','حامل الطُعم'), end:'eye', image:'/assets/hooks/baitholder-hook.webp', best:copy('Worms, sardine strips and squid strips for casting.','ديدان وشرائح سردين وسبيط عند الرمي.'), shape:copy('Bait-holding barbs on the shank stop the bait sliding down.','ألسنة صغيرة على ساق الخطاف تثبّت الطُعم وتمنعه من الانزلاق.'), tip:copy('Shank barbs can tear delicate live bait. Keep the point exposed and the gape clear.','ألسنة الساق قد تمزق الطُعم الحي الرقيق. اترك السن ظاهراً وفتحة الخطاف مكشوفة.'), setting:activeSet },
  { id:'octopus', name:copy('Octopus hook · open point','أوكتوبس · سن مفتوح'), end:'eye', image:'/assets/hooks/octopus-hook.webp', best:copy('Shrimp or small baitfish on a short hook.','جمبري أو روبيان وسمك طُعم صغير على خطاف قصير.'), shape:copy('A short shaft and an angled eye. This version has an open point, not a circle point.','ساق قصيرة وعين مائلة. هذا ليس إصدار السن الدائري.'), tip:copy('Check the point before fishing. Open-point hooks and circle hooks need different rod movements.','راجع شكل السن قبل الصيد. الخطاف المفتوح والدائري يحتاجان حركات مختلفة بالقصبة.'), setting:activeSet },
  { id:'circle', name:copy('Circle hook','خطاف دائري'), end:'eye', image:'/assets/hooks/circle-hook.webp', best:copy('Natural bait when you reel steadily instead of striking. Useful if you plan to release the fish.','طُعم طبيعي مع لفّ البكرة بثبات دون ضربة. مناسب إذا كنت ستعيد السمكة للماء.'), shape:copy('The point curves in toward the shaft. Choose a non-offset hook: the point must not bend sideways.','السن ينحني للداخل نحو الساق. اختر نوعاً لا يميل سنّه إلى الجانب.'), tip:copy('Keep bait out of the opening. Check the packet says non-offset; a side picture cannot show a sideways bend.','لا تملأ الفتحة بالطُعم. ابحث عن non-offset على العبوة؛ الصورة الجانبية لا تُظهر ميل السن إلى الجانب.'), setting:copy('Do not strike. Let the fish load the rod, then reel steadily to hook up.','لا تعمل ضربة تثبيت. اترك السمكة تشد الخيط وتحمّل القصبة، ثم لفّ البكرة بثبات حتى يشبك السن.') },
  { id:'live', name:copy('Live-bait hook · open point','خطاف طُعم حي · سن مفتوح'), end:'eye', image:'/assets/hooks/live-bait-hook.webp', best:copy('Live sardine or other small fish. Set the hook with a firm lift of the rod.','سردين حي أو سمك صغير. ثبّت الخطاف برفع القصبة بحركة ثابتة.'), shape:copy('A small, strong hook that does not take up much space on the bait.','خطاف صغير وقوي لا يشغل مساحة كبيرة على الطُعم.'), tip:copy('Use wire that is light enough for the bait to swim, but strong enough for the fish. Keep the point showing.','اختر سلكاً يسمح للطُعم بالسباحة ويتحمل السمكة. اترك السن ظاهراً.'), setting:activeSet },
  { id:'kahle', name:copy('Kahle / wide bend','كالي / انحناء واسع'), end:'eye', image:'/assets/hooks/kahle-hook.webp', best:copy('Bulky natural baits that need a wider opening.','طُعم طبيعي سميك يحتاج فتحة أوسع.'), shape:copy('A very broad bend with an open point; not a circle hook.','انحناء عريض جداً وسن مفتوح؛ ليس خطافاً دائرياً.'), tip:copy('A wide bend does not make this a circle hook. Use the setting method below.','الانحناء الواسع لا يجعله خطافاً دائرياً. اتبع طريقة التثبيت أدناه.'), setting:copy('Reel down, then use a smooth sweep-set to the side.','لمّ الخيط المرتخي، ثم ثبّت السن بسحبة جانبية سلسة بالقصبة.') },
  { id:'heavy', name:copy('Heavy-duty bait hook','خطاف طُعم شديد التحمل'), end:'eye', image:'/assets/hooks/grouper-hook.webp', best:copy('Larger grouper, snapper, tuna or catfish baits on suitable tackle.','طُعم كبير للهامور والنهاش والتونة والقرموط مع عدة مناسبة.'), shape:copy('A short J-hook made from strong wire. Strong circle hooks are another option.','خطاف J قصير بسلك قوي. يمكن أيضاً استخدام خطاف دائري قوي.'), tip:copy('Balance hook strength, leader and drag. Strength labels such as 2X differ between brands.','وازن بين قوة الخطاف والليدر والدراج (فرامل البكرة). رموز القوة مثل 2X تختلف بين الشركات.'), setting:activeSet },
];

export function matchBaitHook(choice: HookChoice) {
  const {bait,size,target,approach,end}=choice;
  const powerful=['reef','pelagic','catfish'].includes(target);
  let id='j';
  let why=copy('An all-round bait hook for a firm, controlled hook-set.','خطاف عملي للتطعيم بالطُعم الطبيعي، مع ضربة تثبيت متحكم بها.');
  if(bait==='shrimp'||bait==='shell'||target==='bream'){
    id=end==='spade'?'chinu-spade':'chinu-eye';
    why=copy('The wide bend gives shrimp or shellfish room on a short hook.','الانحناء الواسع يترك مساحة للجمبري والمحار على خطاف قصير.');
  }
  if(bait==='worm'||bait==='bread'){
    id=end==='spade'?(size==='small'?'fine-spade':'chinu-spade'):(bait==='worm'?'long':'j');
    why=copy('A light hook keeps the bait presentation natural. Match wire strength to your target fish.','الخطاف الخفيف يحافظ على حركة الطُعم وشكله بعد التطعيم. اختر سلكاً يتحمل السمكة.');
  }
  if(bait==='strip'||bait==='squid'){
    id=end==='spade'?'chinu-spade':'baitholder';
    why=end==='spade'?copy('This short hook without an eye can hold a bait strip. Leave the opening clear.','هذا الخطاف القصير بدون حلقة يناسب شريحة الطُعم. اترك الفتحة مكشوفة.'):copy('Small bumps on the hook help hold the bait strip when you cast.','نتوءات الساق تساعد في إبقاء الشريحة ثابتة أثناء الرمي.');
  }
  if(bait==='live'||bait==='whole'){
    id=bait==='live'?'live':'octopus';
    why=copy('A short-shank bait hook keeps the rig compact and the point exposed.','هذا الخطاف القصير يحمل سمكة الطُعم مع إبقاء السن ظاهراً.');
  }
  if(powerful){
    id='heavy';why=copy('Strong fish need strong wire. Choose the hook size to fit your bait, not just the fish weight.','السمك القوي يحتاج سلكاً قوياً. اختر حجم الخطاف حسب الطُعم، وليس وزن السمكة فقط.');
  }
  if(approach==='steady'){
    id='circle';why=copy('You chose to reel without striking. Start with a circle hook whose point does not bend sideways.','اخترت لفّ البكرة دون ضربة. ابدأ بخطاف دائري لا يميل سنّه إلى الجانب.');
  }
  const hook=baitHooks.find(h=>h.id===id)!;
  const alternative=baitHooks.find(h=>h.id===(id==='circle'?(powerful?'heavy':bait==='worm'?'long':bait==='live'?'live':'j'):'circle'))!;
  const ranges={small:'#10–#4',medium:'#4–2/0',large:'3/0–8/0'};
  return {hook,alternative,why,range:ranges[size],powerful,
    wire: powerful?copy('Strong wire. Match your leader and drag setting to the tackle.','سلك قوي، مع ليدر وضبط دراج مناسبين لقوة العدة.'):size==='large'?copy('Medium or strong wire that does not stop the bait moving.','سلك متوسط إلى قوي دون إثقال الطُعم.'):copy('Thin or medium wire that is strong enough for your fish.','سلك رفيع إلى متوسط بقوة كافية للسمكة.'),
    endMismatch:end==='spade'&&hook.end!=='spade',
    toothy:target==='toothy',
    baitWarning:(target==='fresh'&&['live','whole'].includes(bait))||(bait==='bread'&&['reef','pelagic','toothy'].includes(target)),
  };
}
