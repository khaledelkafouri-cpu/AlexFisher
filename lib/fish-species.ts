export type RegionId = "med" | "red" | "suez" | "aqaba" | "gulf" | "gulf-oman" | "arabian-sea" | "black-sea" | "aegean";
export type StyleId = "surf" | "casting" | "popping" | "shore-jig" | "boat-jig";
export type FishProfile = { id:string; en:string; ar:string; scientific:string; regions:RegionId[]; styles:StyleId[]; fight:number; toothed?:boolean; abrasion?:boolean; tackle:string };

export const fish: FishProfile[] = [
  {id:"bluefish",en:"Bluefish",ar:"مياس",scientific:"Pomatomus saltatrix",regions:["med","suez","aegean","black-sea"],styles:["casting","shore-jig","surf"],fight:7,toothed:true,tackle:"Minnow · metal lure · pencil"},
  {id:"barracuda",en:"Barracuda",ar:"براكودا",scientific:"Sphyraena spp.",regions:["med","red","suez","aqaba","aegean","gulf","gulf-oman","arabian-sea"],styles:["casting","popping","shore-jig"],fight:7,toothed:true,tackle:"Minnow · stickbait · metal jig"},
  {id:"needlefish",en:"Needlefish / Garfish",ar:"خرمان / إبرة",scientific:"Belonidae",regions:["med","red","suez","aqaba","aegean","black-sea"],styles:["casting","surf"],fight:3,tackle:"Small minnow · float bait"},
  {id:"seabass",en:"Sea Bass",ar:"قاروص",scientific:"Dicentrarchus labrax",regions:["med","aegean"],styles:["casting","surf"],fight:5,tackle:"Minnow · soft plastic"},
  {id:"seabream",en:"Sea Bream",ar:"دنيس",scientific:"Sparus aurata",regions:["med","suez","aegean"],styles:["surf","casting"],fight:4,abrasion:true,tackle:"Bait rig · small soft lure"},
  {id:"mormora",en:"Mormora",ar:"مرمار",scientific:"Lithognathus mormyrus",regions:["med","aegean"],styles:["surf"],fight:3,tackle:"Bottom bait rig"},
  {id:"bonito",en:"Bonito",ar:"بلاميطة",scientific:"Sarda sarda",regions:["med","red","suez","aegean","black-sea"],styles:["casting","shore-jig","boat-jig"],fight:8,tackle:"Metal jig · fast minnow"},
  {id:"little-tunny",en:"Little Tunny",ar:"تونة صغيرة",scientific:"Euthynnus alletteratus",regions:["med","red","aegean","black-sea"],styles:["casting","shore-jig","boat-jig"],fight:9,tackle:"Metal jig · stickbait"},
  {id:"mackerel",en:"Mackerel",ar:"ماكريل",scientific:"Scomber spp.",regions:["med","red","aegean","black-sea"],styles:["casting","shore-jig","boat-jig"],fight:4,tackle:"Small jig · sabiki"},
  {id:"leerfish",en:"Leerfish",ar:"ليتشة",scientific:"Lichia amia",regions:["med","aegean"],styles:["casting","popping","shore-jig"],fight:8,tackle:"Pencil · popper · minnow"},
  {id:"meagre",en:"Meagre / Corvina",ar:"لوت",scientific:"Argyrosomus regius",regions:["med","suez","aegean"],styles:["surf","casting","shore-jig"],fight:7,tackle:"Large soft plastic · bait"},
  {id:"grouper",en:"Grouper",ar:"وقار",scientific:"Epinephelinae",regions:["med","red","suez","aqaba","aegean","gulf","gulf-oman","arabian-sea"],styles:["shore-jig","boat-jig"],fight:8,abrasion:true,tackle:"Heavy jig · live bait"},
  {id:"amberjack",en:"Amberjack",ar:"أمبرجاك",scientific:"Seriola dumerili",regions:["med","red","suez","aqaba","aegean","gulf","gulf-oman","arabian-sea"],styles:["popping","shore-jig","boat-jig"],fight:10,abrasion:true,tackle:"Speed jig · stickbait"},
  {id:"mahi",en:"Mahi Mahi / Dorado",ar:"ماهي ماهي",scientific:"Coryphaena hippurus",regions:["med","red","suez","gulf","gulf-oman","arabian-sea"],styles:["casting","popping","boat-jig"],fight:8,tackle:"Pencil · popper · jig"},
  {id:"squid",en:"Squid / Calamari",ar:"سبيط / كاليماري",scientific:"Teuthida",regions:["med","red","suez","aqaba","aegean"],styles:["casting"],fight:2,tackle:"Egi #2.5–#3.5"},
  {id:"queenfish",en:"Queenfish",ar:"كوين فيش",scientific:"Scomberoides spp.",regions:["red","suez","aqaba","gulf","gulf-oman","arabian-sea"],styles:["casting","popping","shore-jig"],fight:8,tackle:"Pencil · popper · metal jig"},
  {id:"gt",en:"Giant Trevally / GT",ar:"جايانت تريفالي",scientific:"Caranx ignobilis",regions:["red","aqaba","gulf","gulf-oman","arabian-sea"],styles:["popping","shore-jig","boat-jig"],fight:10,abrasion:true,tackle:"Heavy popper · stickbait"},
  {id:"snapper",en:"Snapper",ar:"نهاش",scientific:"Lutjanidae",regions:["red","suez","aqaba","gulf","gulf-oman","arabian-sea"],styles:["shore-jig","boat-jig"],fight:7,abrasion:true,tackle:"Jig · bait"},
  {id:"kingfish",en:"Spanish Mackerel / Kingfish",ar:"دراك / كنعد",scientific:"Scomberomorus commerson",regions:["red","suez","aqaba","gulf","gulf-oman","arabian-sea"],styles:["casting","popping","shore-jig","boat-jig"],fight:9,toothed:true,tackle:"Long minnow · jig · stickbait"},
  {id:"dogtooth",en:"Dogtooth Tuna",ar:"تونة دوج توث",scientific:"Gymnosarda unicolor",regions:["red","aqaba","gulf-oman","arabian-sea"],styles:["popping","boat-jig"],fight:10,toothed:true,abrasion:true,tackle:"Heavy jig · popper"},
  {id:"yellowfin",en:"Yellowfin Tuna",ar:"تونة صفراء الزعنفة",scientific:"Thunnus albacares",regions:["red","gulf-oman","arabian-sea"],styles:["popping","boat-jig"],fight:10,tackle:"Heavy popper · jig"},
  {id:"cobia",en:"Cobia",ar:"كوبيـا",scientific:"Rachycentron canadum",regions:["red","suez","gulf","gulf-oman","arabian-sea"],styles:["popping","shore-jig","boat-jig"],fight:9,tackle:"Jig · large soft plastic"},
  {id:"emperor",en:"Emperor",ar:"شعري",scientific:"Lethrinidae",regions:["red","suez","aqaba","gulf","gulf-oman","arabian-sea"],styles:["shore-jig","boat-jig"],fight:6,abrasion:true,tackle:"Jig · bait"},
];
