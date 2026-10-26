/* ===== V3 (part D): full station system — hand crafts only stations + trivial items ===== */
/* ---- new stations ---- */
Object.assign(STN,{
  carp:{n:'ورشة النجارة',kit:'carp_kit',d:'ألواح وأثاث وملاجئ وأدوات خشبية.'},
  smelter:{n:'المصهر',kit:'smelter_kit',d:'يصهر الخامات إلى سبائك (يحتاج فحماً ووقوداً).'},
  forge:{n:'الحدّادة',kit:'forge_kit',d:'تطرق السبائك أسلحة وأدوات معدنية (تحتاج وقوداً).'},
  grill:{n:'الشواية',kit:'grill_kit',d:'تشوي اللحم والسمك بكميات (تحتاج وقوداً).'},
  lab:{n:'مختبر الأعشاب',kit:'lab_kit',d:'أدوية ومقوّيات ومضادات من الأعشاب.'},
  mill:{n:'المطحنة',kit:'mill_kit',d:'تطحن القمح دقيقاً.'},
  farm:{n:'حقل زراعة',kit:'farm_kit',d:'ازرع البذور واحصد المحصول حسب الفصل.'}
});
STN.anvil.n='ورشة الحجارة';STN.anvil.d='تشظّي الصوّان وتصنع السهام.';
STN.bench={n:'طاولة الصناعة',kit:'bench_kit',d:'الأدوات والأسلحة الأساسية.'};
for(const k in STN){STNAME_ALL[k]=STN[k].n;SNAME[k]=STN[k].n}
STNAME_ALL.hand='باليد';
const FUELST={kiln:1,oven:1,smoker:1,smelter:1,forge:1,grill:1};
/* ---- items ---- */
const I5={
  copper_ore:['خام نحاس','يُستخرج من الصخور الكبيرة. يُصهر في المصهر.'],
  tin_ore:['خام قصدير','نادر. يُمزج بالنحاس لصنع البرونز.'],
  iron_ore:['خام حديد','نادر في المناطق الصخرية. يحتاج فحماً كثيراً.'],
  copper_ingot:['سبيكة نحاس','من المصهر.'],tin_ingot:['سبيكة قصدير','من المصهر.'],
  iron_ingot:['سبيكة حديد','صلبة. للحدّادة.'],bronze_ingot:['سبيكة برونز','نحاس + قصدير. للحدّادة.'],
  bronze_axe:['فأس برونزي','يقطع الخشب أسرع ويدوم.',{weapon:'bronze_axe',dur:130,s:1}],
  iron_axe:['فأس حديدي','أقوى فأس.',{weapon:'iron_axe',dur:200,s:1}],
  bronze_spear:['رمح برونزي','يصل بعيداً ويقتل أسرع.',{weapon:'bronze_spear',dur:110,s:1}],
  iron_spear:['رمح حديدي','سلاح الصيد الثقيل.',{weapon:'iron_spear',dur:170,s:1}],
  iron_pick:['معول حديدي','يكسر الصخور بسرعة ويعطي خامات أكثر.',{weapon:'iron_pick',dur:220,s:1}],
  hoe:['مجرفة','تلزم لزراعة الحقل.',{tool:1}],
  wooden_bowl:['وعاء خشبي','للوجبات والعصائد.'],
  shield:['درع خشبي','احمله في الحقيبة: يخفف 20% من الضرر.'],
  seeds:['بذور','من الأعشاب. تُزرع في الحقل.'],
  wheat:['قمح','محصول. يُطحن دقيقاً.'],
  flour:['دقيق','من المطحنة. للخبز.'],
  bread:['خبز','وجبة تشبع طويلاً.',{eat:{f:44,hp:3,fed:200,san:3}}],
  turnip:['لفت','جذر يتحمّل البرد.',{eat:{f:15,w:4}}],
  antidote:['ترياق','يعالج التسمم ويهدّئ العقل.',{eat:{cure:1,hp:6,san:10}}],
  salve:['مرهم أعشاب','يوقف النزيف ويعالج الالتهاب ويشفي.',{eat:{hp:34,cure:1,bleed:1,inf0:1}}],
  tonic_warm:['شراب دافئ','يرفع حرارة جسمك وعقلك.',{eat:{w:20,bt:1.6,san:6,give:'pot'}}],
  tonic_cool:['منقوع مبرّد','يخفض حرارة جسمك المرتفعة.',{eat:{w:30,bt:-1.8,give:'pot'}}],
  tonic_stam:['مقوٍّ للطاقة','يملأ تحملك ويرد النعاس.',{eat:{f:10,w:8,stam:100,energy:25}}],
  carp_kit:['ورشة نجارة (مجموعة)','ضعها لتشتغل بالخشب.',{place:'carp'}],
  smelter_kit:['مصهر (مجموعة)','ضعه لصهر الخامات.',{place:'smelter'}],
  forge_kit:['حدّادة (مجموعة)','ضعها لطرق المعادن.',{place:'forge'}],
  grill_kit:['شواية (مجموعة)','ضعها لشواء كميات.',{place:'grill'}],
  lab_kit:['مختبر أعشاب (مجموعة)','ضعه لتحضير الأدوية.',{place:'lab'}],
  mill_kit:['مطحنة (مجموعة)','ضعها لطحن القمح.',{place:'mill'}],
  farm_kit:['حقل (مجموعة)','ضعه وازرع فيه.',{place:'farm'}]
};
for(const k in I5){const v=I5[k];IT[k]=Object.assign({n:v[0],d:v[1]},v[2]||{})}
Object.assign(PER,{bread:1500,turnip:2000,tonic_warm:700,tonic_cool:700});
Object.assign(WEAP,{
  bronze_axe:{n:'فأس برونزي',dmg:14,reach:1.85,wood:4.2,rock:1.4,arc:1.1,kind:'axe'},
  iron_axe:{n:'فأس حديدي',dmg:18,reach:1.9,wood:5.6,rock:1.8,arc:1.1,kind:'axe'},
  bronze_spear:{n:'رمح برونزي',dmg:21,reach:2.7,wood:.7,rock:.9,arc:.5,kind:'spear'},
  iron_spear:{n:'رمح حديدي',dmg:27,reach:2.8,wood:.8,rock:1,arc:.5,kind:'spear'},
  iron_pick:{n:'معول حديدي',dmg:12,reach:1.8,wood:.9,rock:5.5,arc:1,kind:'axe'}
});
const wk=id=>(WEAP[id]&&WEAP[id].kind)||id;
/* icons */
const tintIc=(base,col)=>g=>{base(g);g.globalCompositeOperation='source-atop';g.fillStyle=col;g.fillRect(0,0,40,40);g.globalCompositeOperation='source-over'};
const icOre=c=>g=>{IC.stone(g);g.fillStyle=c;[[16,18],[24,22],[20,14],[26,15]].forEach(p=>{g.beginPath();g.arc(p[0],p[1],2.6,0,TAU);g.fill()})};
const icIng=c=>g=>{g.beginPath();g.moveTo(6,27);g.lineTo(12,14);g.lineTo(30,14);g.lineTo(35,27);g.closePath();fs(g,c);g.fillStyle='rgba(255,255,255,.4)';g.fillRect(13,16,14,3)};
IC.copper_ore=icOre('#d9803a');IC.tin_ore=icOre('#cfd6dc');IC.iron_ore=icOre('#8a3a2a');
IC.copper_ingot=icIng('#d9803a');IC.tin_ingot=icIng('#c8d0d8');IC.iron_ingot=icIng('#7d8794');IC.bronze_ingot=icIng('#b8873a');
IC.bronze_axe=tintIc(IC.axe,'rgba(205,127,50,.55)');IC.iron_axe=tintIc(IC.axe,'rgba(90,110,130,.6)');
IC.bronze_spear=tintIc(IC.spear,'rgba(205,127,50,.5)');IC.iron_spear=tintIc(IC.spear,'rgba(90,110,130,.55)');IC.iron_pick=g=>{dbl(g,[[9,34],[29,9]],4,'#a87a46');g.beginPath();g.moveTo(14,8);g.quadraticCurveTo(28,4,35,16);g.lineTo(31,18);g.quadraticCurveTo(26,10,14,12);g.closePath();fs(g,'#8d97a4')};
IC.hoe=g=>{dbl(g,[[9,34],[28,8]],3.4,'#a87a46');g.beginPath();g.moveTo(24,8);g.lineTo(35,11);g.lineTo(33,17);g.lineTo(22,13);g.closePath();fs(g,'#9a968c')};
IC.wooden_bowl=g=>{g.beginPath();g.moveTo(6,17);g.quadraticCurveTo(20,40,34,17);g.closePath();fs(g,'#b9855a');g.beginPath();g.ellipse(20,17,14,4,0,0,TAU);fs(g,'#8a5a2e')};
IC.shield=g=>{g.beginPath();g.arc(20,20,14,0,TAU);fs(g,'#b9855a');g.beginPath();g.arc(20,20,5,0,TAU);fs(g,'#8d97a4');for(let i=0;i<4;i++)line(g,[[20,20],[20+Math.cos(i*1.57+.78)*13,20+Math.sin(i*1.57+.78)*13]],1.2,'rgba(60,30,10,.5)')};
IC.seeds=g=>{[[12,24],[20,18],[27,25],[18,29],[25,15],[14,15]].forEach(p=>{g.beginPath();g.ellipse(p[0],p[1],3.2,2.1,.6,0,TAU);fs(g,'#c9a050',1.6)})};
IC.wheat=g=>{for(let i=-1;i<=1;i++){dbl(g,[[20+i*7,35],[20+i*5,8]],2,'#c9a040');for(let j=0;j<4;j++){g.beginPath();g.ellipse(20+i*5.5-2,10+j*5,2.4,1.5,-.6,0,TAU);fs(g,'#e0b84a',1.2);g.beginPath();g.ellipse(20+i*5.5+2,12+j*5,2.4,1.5,.6,0,TAU);fs(g,'#e0b84a',1.2)}}};
IC.flour=g=>{g.beginPath();g.moveTo(9,12);g.lineTo(31,12);g.lineTo(34,32);g.lineTo(6,32);g.closePath();fs(g,'#efe6cc');line(g,[[9,12],[12,6],[28,6],[31,12]],2,OLN);g.fillStyle='#c9b98e';g.fillRect(13,19,14,5)};
IC.bread=g=>{g.beginPath();g.ellipse(20,22,15,10,0,0,TAU);fs(g,'#c98a42');[[13,19],[20,16],[27,19]].forEach(p=>line(g,[[p[0]-2,p[1]+3],[p[0]+2,p[1]-2]],1.6,'rgba(255,230,170,.8)'))};
IC.turnip=g=>{g.beginPath();g.arc(20,24,10,0,TAU);fs(g,'#efe0f0');g.beginPath();g.arc(20,29,6,0,Math.PI);g.fillStyle='#a050a8';g.fill();dbl(g,[[20,15],[16,6]],2,'#4fa13c');dbl(g,[[20,15],[24,6]],2,'#4fa13c')};
const icFlask=c=>g=>{g.beginPath();g.moveTo(16,6);g.lineTo(24,6);g.lineTo(24,15);g.lineTo(32,31);g.quadraticCurveTo(20,37,8,31);g.lineTo(16,15);g.closePath();fs(g,'rgba(220,235,240,.7)');g.beginPath();g.moveTo(13,25);g.lineTo(27,25);g.lineTo(31,31);g.quadraticCurveTo(20,36,9,31);g.closePath();g.fillStyle=c;g.fill()};
IC.antidote=icFlask('#5ac05a');IC.salve=g=>{g.beginPath();g.ellipse(20,24,13,8,0,0,TAU);fs(g,'#8a6a42');g.beginPath();g.ellipse(20,20,13,8,0,0,TAU);fs(g,'#5aa84a');g.beginPath();g.ellipse(20,19,8,4,0,0,TAU);g.fillStyle='#3a7a30';g.fill()};
IC.tonic_warm=icFlask('#e0702a');IC.tonic_cool=icFlask('#4ab0e8');IC.tonic_stam=icFlask('#e8d040');
const icKit2=(fn)=>g=>icKit(g,fn);
IC.carp_kit=icKit2(g=>{g.beginPath();g.rect(8,13,24,10);fs(g,'#c99a62');line(g,[[10,18],[30,18]],1.2,'rgba(100,60,20,.5)');line(g,[[12,23],[10,30]],3,'#7a4c24');line(g,[[28,23],[30,30]],3,'#7a4c24');line(g,[[26,6],[18,14]],2.4,'#9a968c')});
IC.smelter_kit=icKit2(g=>{g.beginPath();g.moveTo(10,28);g.lineTo(13,10);g.lineTo(27,10);g.lineTo(30,28);g.closePath();fs(g,'#8d887a');g.beginPath();g.rect(16,20,8,8);g.fillStyle='#e8742a';g.fill()});
IC.forge_kit=icKit2(g=>{g.beginPath();g.rect(7,14,26,12);fs(g,'#5a5a60');g.beginPath();g.moveTo(10,14);g.lineTo(30,14);g.lineTo(26,8);g.lineTo(14,8);g.closePath();fs(g,'#3d4650');g.fillStyle='#ff9a3a';g.fillRect(15,18,10,4)});
IC.grill_kit=icKit2(g=>{for(let i=0;i<5;i++)line(g,[[9+i*5.5,12],[9+i*5.5,28]],1.8,'#5a5a60');line(g,[[8,14],[32,14]],2,'#3d4650');line(g,[[8,26],[32,26]],2,'#3d4650');g.fillStyle='#e8742a';g.fillRect(12,29,16,3)});
IC.lab_kit=icKit2(g=>{g.beginPath();g.rect(8,16,24,9);fs(g,'#c99a62');IC.antidote&&(g.save(),g.translate(10,2),g.scale(.5,.5),IC.antidote(g),g.restore());g.beginPath();g.arc(27,12,4.5,0,TAU);fs(g,'#4fa13c',1.6)});
IC.mill_kit=icKit2(g=>{g.beginPath();g.ellipse(20,22,13,6,0,0,TAU);fs(g,'#9a968c');g.beginPath();g.ellipse(20,17,11,5,0,0,TAU);fs(g,'#b8b2a4');line(g,[[20,17],[32,8]],2.6,'#7a4c24')});
IC.farm_kit=icKit2(g=>{g.beginPath();g.rect(7,15,26,14);fs(g,'#7a5230');for(let i=0;i<4;i++){line(g,[[11+i*6,28],[11+i*6,16]],1.6,'#4fa13c')}});
/* ---- recipes (rebuilt) ---- */
REC.length=0;
const RR=(out,n,inn,st,cat,t,x)=>REC.push(Object.assign({out:out,n:n,in:inn,st:st,cat:cat,t:t,snd:'tap'},x||{}));
/* by hand: stations + trivial things */
RR('rope',1,{fiber:3},'hand','mat',2.5,{snd:'rope'});
RR('flint_blade',2,{flint:1},'hand','mat',0,{tool:'stone',mg:'knap'});
RR('bandage',2,{herb:2,fiber:1},'hand','mat',2.5,{snd:'rope'});
RR('torch',1,{stick:1,fiber:2,resin:1},'hand','tool',2.5,{snd:'rope'});
RR('firewood',1,{log:2,stick:3},'hand','build',3);
RR('bench_kit',1,{log:4,rope:3,stone:3},'hand','build',7);
RR('carp_kit',1,{plank:6,rope:3,stone:2},'hand','build',8);
RR('kiln_kit',1,{stone:10,clay:6,log:2},'hand','build',9);
RR('grill_kit',1,{stone:6,stick:8,rope:2},'hand','build',6);
RR('smoker_kit',1,{plank:4,stick:6,rope:2,hide:1},'hand','build',7);
RR('tanner_kit',1,{plank:3,stick:4,rope:3,stone:2},'hand','build',6);
RR('loom_kit',1,{plank:5,stick:4,rope:4},'hand','build',8);
RR('anvil_kit',1,{stone:6,log:2,flint:2},'hand','build',7);
RR('oven_kit',1,{brick:8,clay:4},'hand','build',8);
RR('smelter_kit',1,{brick:10,stone:8,clay:4},'hand','build',10);
RR('forge_kit',1,{brick:6,stone:6,plank:4,rope:2},'hand','build',10);
RR('filter_kit',1,{pot:1,charcoal:3,clay:2,stone:3},'hand','build',7);
RR('lab_kit',1,{pot:1,plank:3,clay:3,stick:4},'hand','build',7);
RR('mill_kit',1,{stone:10,plank:4,rope:3},'hand','build',9);
RR('farm_kit',1,{plank:4,stick:6,rope:2},'hand','build',6);
RR('bed_kit',1,{fiber:10,hide:2,rope:2},'hand','build',6,{snd:'rope'});
/* workbench: tools & weapons */
RR('knife',1,{flint_blade:1,stick:1,rope:1},'bench','tool',3.5);
RR('axe',1,{stick:1,stone:1,flint_blade:1,rope:1},'bench','tool',4);
RR('needle',1,{bone:1},'bench','tool',3,{tool:'knife',snd:'knap'});
RR('spear_wood',1,{stick:2},'bench','tool',3.5,{tool:'knife',snd:'saw'});
RR('spear',1,{stick:2,flint_blade:1,rope:1},'bench','tool',5);
RR('bow',1,{stick:3,rope:2,sinew:1},'bench','tool',6,{snd:'saw'});
RR('hoe',1,{stick:2,stone:1,rope:1},'bench','tool',4);
RR('plank',2,{log:1},'bench','mat',4,{tool:'axe',snd:'saw'});
RR('mapbook',1,{hide:1,rope:1,stick:1},'bench','tool',4,{snd:'rope'});
RR('rack_kit',1,{stick:4,rope:2,plank:2},'bench','build',5);
RR('snare_kit',1,{stick:2,rope:2,fiber:2},'bench','build',3.5,{snd:'rope'});
/* carpentry */
RR('plank',3,{log:1},'carp','mat',3,{tool:'axe',snd:'saw'});
RR('wooden_bowl',1,{log:1},'carp','mat',5,{tool:'knife',snd:'saw'});
RR('shield',1,{plank:3,hide:1,rope:1},'carp','gear',8,{snd:'saw'});
RR('shelter_kit',1,{plank:6,stick:8,hide:3,rope:4},'carp','build',10);
/* kiln (background, fuel) */
RR('pot',1,{clay:3,log:1},'kiln','st',26,{bg:1});
RR('brick',3,{clay:4,log:1},'kiln','st',24,{bg:1});
RR('charcoal',2,{log:3},'kiln','st',40,{bg:1});
/* smelter */
RR('copper_ingot',1,{copper_ore:2,charcoal:1},'smelter','st',40,{bg:1});
RR('tin_ingot',1,{tin_ore:2,charcoal:1},'smelter','st',40,{bg:1});
RR('iron_ingot',1,{iron_ore:3,charcoal:2},'smelter','st',80,{bg:1});
RR('bronze_ingot',2,{copper_ingot:2,tin_ingot:1,charcoal:1},'smelter','st',50,{bg:1});
/* forge (manual, fuel) */
RR('bronze_axe',1,{bronze_ingot:3,stick:2,rope:1},'forge','tool',14);
RR('iron_axe',1,{iron_ingot:3,stick:2,rope:1},'forge','tool',18);
RR('bronze_spear',1,{bronze_ingot:2,stick:2,rope:1},'forge','tool',12);
RR('iron_spear',1,{iron_ingot:2,stick:2,rope:1},'forge','tool',16);
RR('iron_pick',1,{iron_ingot:3,stick:2,rope:1},'forge','tool',18);
/* grill (background, fuel) */
RR('cooked_meat',2,{raw_meat:2},'grill','food',30,{bg:1});
RR('cooked_fish',2,{raw_fish:2},'grill','food',24,{bg:1});
/* oven */
RR('roast',1,{raw_meat:2,herb:1,log:1},'oven','food',45,{bg:1});
RR('fish_bake',1,{raw_fish:2,herb:1,log:1},'oven','food',36,{bg:1});
RR('fruit_bar',2,{berries:4,apple:1,log:1},'oven','food',30,{bg:1});
RR('broth',1,{bone:2,pot_clean:1,herb:1},'oven','food',40,{bg:1});
RR('bread',2,{flour:2,pot_clean:1},'oven','food',50,{bg:1,gives:{pot:1}});
/* smoker */
RR('smoked_meat',2,{raw_meat:2,log:1},'smoker','food',120,{bg:1});
RR('smoked_fish',2,{raw_fish:2,log:1},'smoker','food',100,{bg:1});
/* tanner */
RR('leather',2,{hide:2,herb:1},'tanner','st',90,{bg:1});
RR('rope',3,{leather:1},'tanner','st',6,{snd:'rope'});
RR('waterskin',1,{hide:1,rope:1},'tanner','gear',5,{tool:'knife',snd:'rope'});
RR('cloak',1,{hide:4,rope:2},'tanner','gear',8,{tool:'needle',snd:'rope'});
RR('fur_coat',1,{leather:4,hide:2,rope:2},'tanner','gear',12,{tool:'needle',snd:'rope'});
RR('backpack',1,{leather:3,rope:3},'tanner','gear',10,{tool:'needle',snd:'rope'});
/* loom */
RR('cloth',1,{fiber:6},'loom','st',45,{bg:1});
RR('tunic',1,{cloth:3,rope:1},'loom','gear',9,{snd:'rope'});
RR('bandage',3,{cloth:1,herb:1},'loom','st',4,{snd:'rope'});
/* stonework */
RR('flint_blade',3,{flint:1},'anvil','st',4,{tool:'stone',snd:'knap'});
RR('arrow',6,{stick:2,feather:2,flint_blade:2},'anvil','st',6);
RR('fang_charm',1,{fang:2,rope:1},'anvil','gear',6,{snd:'rope'});
/* water filter */
RR('pot_clean',1,{pot_water:1,charcoal:1},'filter','st',24,{bg:1});
RR('waterskin_clean',1,{waterskin_full:1,charcoal:1},'filter','st',24,{bg:1});
/* herb lab */
RR('antidote',1,{herb:2,mushroom:1},'lab','med',8,{snd:'rope'});
RR('salve',1,{herb:3,resin:1},'lab','med',9,{snd:'rope'});
RR('tonic_warm',1,{herb:2,berries:2,pot_clean:1},'lab','med',10,{gives:{pot:1}});
RR('tonic_cool',1,{herb:2,pot_clean:1},'lab','med',8,{gives:{pot:1}});
RR('tonic_stam',1,{berries:3,apple:1},'lab','med',8);
/* mill */
RR('flour',2,{wheat:3},'mill','st',30,{bg:1});
TABS.length=0;TABS.push(['build','محطات'],['mat','مواد'],['tool','أدوات'],['gear','لباس ودروع'],['food','طبخ'],['st','معالجة'],['med','أدوية']);
recTab='build';
/* ---- station runtime ---- */
let recStn=null;
const stObj=k=>nearStruct(k,3.4);
const STN_ICO=k=>STN[k]?STN[k].kit:'bench_kit';
{const _rp=recProblem;recProblem=function(r){
  let p=_rp.apply(this,arguments);
  if(r.bg&&p==='الحقيبة ممتلئة')p='';
  if(!p&&r.st!=='hand'&&FUELST[r.st]){const s=stObj(r.st);if(s&&!(s.fuel>0)&&!(r.bg&&false))p='أضف وقوداً أولاً'}
  return p}}
{const _fa=findAct;findAct=function(){
  _fa.apply(this,arguments);
  if(!S.alive||P.state!=='live'||job||mg||sleeping)return;
  let b=null,bd=2.7;
  for(const s of structs){if(s.built<1||!STN[s.kind])continue;const d=dist(s.x,s.y,P.x,P.y);if(d<bd){bd=d;b=s}}
  if(!b)return;
  if(b.kind==='farm'){
    if(!b.crop&&countItem('seeds')>0&&countItem('hoe')>0&&seas!==3)actC={t:'plant',s:b,lbl:'ازرع',ico:'seeds',x:b.x,y:b.y};
    else if(b.crop&&b.g>=b.G)actC={t:'harvest',s:b,lbl:'احصد',ico:b.crop==='wheat'?'wheat':'turnip',x:b.x,y:b.y};
    else if(!b.crop&&actC==null)actC={t:'stn',s:b,lbl:b.crop?'الحقل':'الحقل: تحتاج بذوراً ومجرفة',ico:'farm_kit',x:b.x,y:b.y};
    return;
  }
  if(actC&&actC.t!=='stn'&&actC.t!=='sleep')return;
  if(actC&&actC.t==='sleep'&&b.kind!=='bed')return;
  if(b.kind==='bed'&&actC&&actC.t==='sleep')return;
  if(b.kind==='bed')return;
  actC={t:'stn',s:b,lbl:'اصنع: '+stName(b.kind),ico:STN_ICO(b.kind),x:b.x,y:b.y};
}}
{const _da=doAct;doAct=function(){
  const c=actC;
  if(c&&!mg&&!job&&P.state==='live'){
    if(c.t==='stn'){aInit();recStn=c.s.kind;openInv();return}
    if(c.t==='plant'){takeItem('seeds',1);c.s.crop=seas===2?'turnip':'wheat';c.s.g=0;c.s.G=720;SFX.pop();playAct('gather',.5);toast('زُرع '+(c.s.crop==='wheat'?'القمح':'اللفت'));return}
    if(c.t==='harvest'){const s=c.s;SFX.pop();playAct('gather',.5);
      if(s.crop==='wheat'){give('wheat',3+((Math.random()*3)|0));give('seeds',1+((Math.random()*2)|0))}else{give('turnip',3+((Math.random()*2)|0));give('seeds',1)}
      toast('حصاد!');s.crop=null;s.g=0;xpGain(10);return}
  }
  return _da.apply(this,arguments);
}}
{const _ci=closeInv;closeInv=function(){recStn=null;return _ci.apply(this,arguments)}}
{const _sc=startCraft;startCraft=function(i){
  const r=REC[i];if(!r||!S.alive||P.state!=='live'||job||mg||sleeping)return;
  if(r.st==='hand')return _sc.apply(this,arguments);
  if(recStn!==r.st){toast('اصنعه عند '+stName(r.st),true);return}
  const s=stObj(r.st);if(!s){toast('اقترب من '+stName(r.st),true);return}
  const pr=recProblem(r);if(pr){toast(pr,true);return}
  if(r.bg){
    for(const k in r.in)takeItem(k,r.in[k]);
    s.q=s.q||[];if(s.q.length>=4){toast('الطابور ممتلئ',true);for(const k in r.in)addItem(k,r.in[k]);return}
    s.q.push({i:i,t:0,T:r.t});SFX.build&&SFX.build();toast('بدأ: '+IT[r.out].n+' (يعمل بالخلفية)');
    if(Net.on&&!Net.mute){}
    invDirty=true;return;
  }
  return _sc.apply(this,arguments);
}}
/* hot flag + gives for manual crafts (hook in craft finish) */
stnHot=function(r){
  if(r&&r.gives)for(const k in r.gives)addItem(k,r.gives[k]);
  if(!r||r.st==='hand')return;const s=nearStruct(r.st,3.4);if(s)s.hot=14;
};
{const _us=updStructs;updStructs=function(dt){
  _us.apply(this,arguments);
  for(const s of structs){
    if(!STN[s.kind])continue;
    if(s.fuel>0&&FUELST[s.kind]){const act=(s.q&&s.q.length)||(job&&job.r&&job.r.st===s.kind);s.fuel-=dt*(act?1:.15);s.hot=Math.max(s.hot||0,.5);if(s.fuel<=0){s.fuel=0;toast(STN[s.kind].n+': انتهى الوقود',true)}}
    if(s.q&&s.q.length){
      const j=s.q[0];
      if(!FUELST[s.kind]||s.fuel>0){
        j.t+=dt*(sleeping?1:1);
        if(j.t>=j.T){
          s.q.shift();const r=REC[j.i];
          for(let k=0;k<r.n;k++);
          const left=r.n;dropItem(r.out,left,s.x+(Math.random()-.5)*1.2,s.y+1.2+Math.random()*.5);
          if(r.gives)for(const k in r.gives)dropItem(k,r.gives[k],s.x+(Math.random()-.5),s.y+1.4);
          SFX.chime&&SFX.chime();toast('جاهز: '+IT[r.out].n+' (عند '+STN[s.kind].n+')');xpGain(6);
        }
      }
    }
    if(s.kind==='farm'&&s.crop&&s.g<s.G){s.g+=dt*(seas===3?0:seas===2?.55:seas===1?1.15:1)*(rain>.3?1.3:1)}
  }
  if(invOpen&&recStn){fuelUiT-=dt;if(fuelUiT<=0){fuelUiT=.6;invDirty=true}}
}}
let fuelUiT=0;
const recPart=r=>Object.keys(r.in).some(k=>countItem(k)>0);
/* ---- panel ---- */
function stnPanel(k){
  const s=stObj(k);if(!s)return'<div style="padding:8px;opacity:.8">ابتعد قليلاً ثم اقترب من المحطة</div>';
  let h='<div class="xr" style="border:0;margin:0 0 6px">';
  if(FUELST[k]){
    h+='<div>الوقود: <b>'+Math.round(s.fuel||0)+' ث</b> <span style="display:inline-block;width:90px;height:6px;background:rgba(0,0,0,.45);border-radius:4px;vertical-align:middle"><i style="display:block;height:100%;width:'+clamp((s.fuel||0)/4,0,100)+'%;background:#e8742a;border-radius:4px"></i></span></div>';
    h+='<div style="margin:4px 0">';
    [['log','جذع +3د',180],['charcoal','فحم +6د',360],['stick','عصا +40ث',40]].forEach(f=>{h+='<button class="btn alt" data-fuel="'+f[0]+'" '+(countItem(f[0])?'':'disabled ')+'style="padding:3px 10px;font-size:12px;margin-left:4px">'+f[1]+' ('+countItem(f[0])+')</button>'});
    h+='</div>';
  }
  if(s.q&&s.q.length){h+='<div>الطابور: '+s.q.map((j,i)=>IT[REC[j.i].out].n+(i===0?' '+Math.round(100*j.t/j.T)+'%':'')).join(' ← ')+'</div>'}
  return h+'</div>';
}
{const _ri=renderInv;renderInv=function(){
  _ri.apply(this,arguments);if(!invOpen)return;
  const tabs=$('tabs'),recs=$('recs'),st=$('stn');
  const row=(r,i,en)=>{const pr=recProblem(r);const lock=!en||pr;
    return '<div class="rec'+(lock?' lock':'')+'"><img alt="" src="'+iconURL(r.out)+'"><div><div class="nm">'+IT[r.out].n+(r.n>1?' ×'+r.n:'')+'</div><div class="ing">'+
    Object.keys(r.in).map(k=>'<span class="'+(countItem(k)>=r.in[k]?'':'no')+'"><img alt="" src="'+iconURL(k)+'">'+countItem(k)+'/'+r.in[k]+'</span>').join('')+
    (r.tool?'<span class="'+(countItem(r.tool)>0?'':'no')+'"><img alt="" src="'+iconURL(r.tool)+'"> أداة</span>':'')+
    '</div><div class="meta">'+stName(r.st)+' · '+(r.mg?'مهارة':r.t+' ث'+(r.bg?' (خلفية)':''))+(en&&pr&&pr!=='المواد ناقصة'?' · '+pr:'')+'</div></div>'+
    (en?'<button class="btn" data-c="'+i+'"'+(pr?' disabled':'')+'>'+(r.bg?'ابدأ':'اصنع')+'</button>':'<span style="font-size:11px;opacity:.7;padding:0 6px">'+(r.st==='hand'?'':'عند المحطة')+'</span>')+'</div>'};
  if(recStn){
    tabs.style.display='none';
    st.textContent=stName(recStn);
    recs.innerHTML=stnPanel(recStn)+(REC.map((r,i)=>[r,i]).filter(o=>o[0].st===recStn&&recPart(o[0])).map(o=>row(o[0],o[1],true)).join('')||'<div style="padding:10px;opacity:.7">لا تملك مواد تُصنع هنا — اجمع مواداً وارجع</div>');
  }else{
    tabs.style.display='';
    st.textContent='دليل الوصفات: المحطات تُصنع هنا بالأيدي، وكل شيء آخر يُصنع عند محطته (اقترب منها واضغط "اصنع")';
    recs.innerHTML=REC.map((r,i)=>[r,i]).filter(o=>o[0].cat===recTab&&o[0].st==='hand'&&recPart(o[0])).map(o=>row(o[0],o[1],true)).join('')||'<div style="padding:10px;opacity:.7">لا شيء تصنعه بيديك من حقيبتك الآن</div>';
  }
}}
document.getElementById('inv').addEventListener('click',e=>{
  const b=e.target.closest('[data-fuel]');if(!b||!recStn||b.disabled)return;
  const s=stObj(recStn);if(!s)return;const id=b.dataset.fuel,add={log:180,charcoal:360,stick:40}[id];
  if(takeItem(id,1)){s.fuel=(s.fuel||0)+add;SFX.fire&&SFX.fire();invDirty=true;renderInv()}
});
/* extra eat effects */
{const _us=useSlot;useSlot=function(i){const s=inv[i],d=s&&IT[s.id],e=d&&d.eat,had=s?s.n:0,id=s&&s.id;const r=_us.apply(this,arguments);
  if(e&&(!inv[i]||inv[i].id!==id||inv[i].n<had)){
    if(e.bt)S.bt=clamp(S.bt+e.bt,28,41);
    if(e.stam)S.stam=Math.min(100,S.stam+e.stam);
    if(e.energy)S.energy=Math.min(100,S.energy+e.energy);
    if(e.inf0){S.inf=0;S.bleedT=0}
  }return r}}
/* shield */
{const _hp=hitPlayer;hitPlayer=function(dmg,src,kind,kx,ky,poison){if(countItem('shield')>0)dmg*=.8;return _hp.call(this,dmg,src,kind,kx,ky,poison)}}
/* ore from rocks, seeds from herbs */
function oreDrop(o){
  const b=biome(o.x,o.y),k=S.weapon==='iron_pick'?2:1,r=Math.random();
  if(r<.24*k)scatter('copper_ore',1,o.x,o.y);
  else if(r<.34*k)scatter('tin_ore',1,o.x,o.y);
  else if(b.rocky>.45&&r<.46*k)scatter('iron_ore',1,o.x,o.y);
}
/* extra station drawings */
{const _dsn=drawStn;drawStn=function(o){
  const k=o.kind;
  if(k!=='carp'&&k!=='smelter'&&k!=='forge'&&k!=='grill'&&k!=='lab'&&k!=='mill'&&k!=='farm')return _dsn(o);
  const e=1-Math.pow(1-Math.min(1,o.built),3),hs=HH/16,hot=o.hot>0,fk=hot?.7+.3*Math.sin(time*13+o.ph):0;
  ctx.fillStyle='rgba(12,26,10,.26)';ctx.beginPath();ctx.ellipse(o.sx,o.sy+1,k==='farm'?34:24,(k==='farm'?12:8)*hs,0,0,TAU);ctx.fill();
  ctx.save();ctx.translate(o.sx,o.sy);ctx.scale(1,.25+.75*e);ctx.lineCap='round';ctx.lineJoin='round';
  const OL='#2b180d',wd=(x1,y1,x2,y2,w,c)=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=OL;ctx.lineWidth=w+2.6;ctx.stroke();ctx.strokeStyle=c||'#9a6a38';ctx.lineWidth=w;ctx.stroke()};
  const fl=(c,w)=>{ctx.fillStyle=c;ctx.fill();ctx.lineWidth=w||2.4;ctx.strokeStyle=OL;ctx.stroke()};
  if(k==='carp'){
    wd(-20,0,-18,-18,4.4);wd(20,0,18,-18,4.4);ctx.beginPath();ctx.roundRect(-26,-28,52,11,2.5);fl('#c99a62');
    ctx.strokeStyle='rgba(100,60,20,.45)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-22,-24);ctx.lineTo(20,-24);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-16,-29);ctx.lineTo(8,-37);ctx.lineTo(10,-32);ctx.lineTo(-14,-26);ctx.closePath();fl('#9a968c',1.6);
    for(let i=0;i<3;i++){ctx.beginPath();ctx.roundRect(14,-6-i*4,18,3.6,1);fl('#d9b27a',1.2)}
  }else if(k==='smelter'){
    ctx.beginPath();ctx.ellipse(0,-2,20,7,0,0,TAU);fl('#6f6a5e');
    ctx.beginPath();ctx.moveTo(-17,-3);ctx.lineTo(-12,-46);ctx.lineTo(12,-46);ctx.lineTo(17,-3);ctx.closePath();fl('#8d887a');
    ctx.beginPath();ctx.rect(-7,-16,14,13);fl(hot?'#e8742a':'#1a0f08');
    if(hot){ctx.fillStyle='rgba(255,220,120,'+fk+')';ctx.fillRect(-4,-13,8,7)}
    wd(0,-46,0,-58,6,'#6f6a5e');
  }else if(k==='forge'){
    ctx.beginPath();ctx.roundRect(-24,-20,30,18,3);fl('#5a5a60');
    ctx.beginPath();ctx.rect(-19,-16,20,8);fl(hot?'#ff9a3a':'#22201e',1.6);
    if(hot){ctx.fillStyle='rgba(255,230,140,'+fk+')';ctx.fillRect(-15,-14,12,4)}
    ctx.beginPath();ctx.ellipse(18,-2,10,4,0,0,TAU);fl('#5a3a1a',1.8);
    ctx.beginPath();ctx.moveTo(8,-12);ctx.lineTo(28,-12);ctx.lineTo(25,-20);ctx.lineTo(10,-22);ctx.closePath();fl('#9a96a0');
    wd(-24,-20,-24,-40,5,'#5a5a60');
  }else if(k==='grill'){
    ctx.beginPath();ctx.ellipse(0,-3,22,7,0,0,TAU);fl('#5a4a3a',2);
    ctx.fillStyle=hot?'rgba(255,150,40,'+fk+')':'#2a1a10';ctx.beginPath();ctx.ellipse(0,-5,16,5,0,0,TAU);ctx.fill();
    for(let i=-3;i<=3;i++)wd(i*5,-8,i*5,-16,1.6,'#6a6a70');
    wd(-18,-8,-20,-18,3.2,'#4a4a50');wd(18,-8,20,-18,3.2,'#4a4a50');wd(-20,-17,20,-17,2.4,'#6a6a70');
  }else if(k==='lab'){
    ctx.beginPath();ctx.roundRect(-24,-22,48,10,2.5);fl('#c99a62');wd(-19,-12,-18,0,4);wd(19,-12,18,0,4);
    [['#5ac05a',-14],['#e0702a',-4],['#4ab0e8',6]].forEach(f=>{ctx.beginPath();ctx.moveTo(f[1]-2,-36);ctx.lineTo(f[1]+2,-36);ctx.lineTo(f[1]+2,-30);ctx.lineTo(f[1]+6,-22);ctx.lineTo(f[1]-6,-22);ctx.lineTo(f[1]-2,-30);ctx.closePath();fl(f[0],1.4)});
    ctx.beginPath();ctx.ellipse(18,-26,5,2.6,0,0,TAU);fl('#9a968c',1.4);
    for(let i=0;i<3;i++){wd(-22+i*3,-36,-22+i*3,-44,1.2,'#4fa13c')}
  }else if(k==='mill'){
    ctx.beginPath();ctx.ellipse(0,-3,20,7,0,0,TAU);fl('#8a8478');
    ctx.beginPath();ctx.ellipse(0,-12,17,6,0,0,TAU);fl('#b8b2a4');
    ctx.beginPath();ctx.ellipse(0,-17,14,5,0,0,TAU);fl('#9a968c');
    const a=time*(o.q&&o.q.length?1.8:0)+o.ph;wd(0,-17,Math.cos(a)*22,-17+Math.sin(a)*8,3.4,'#7a4c24');
    wd(0,-17,0,-40,4);ctx.fillStyle='#efe6cc';ctx.fillRect(-4,-42,8,6);
  }else if(k==='farm'){
    ctx.beginPath();ctx.moveTo(-34,-4);ctx.lineTo(0,-16);ctx.lineTo(34,-4);ctx.lineTo(0,8);ctx.closePath();fl('#6a4a2a',2);
    ctx.strokeStyle='rgba(30,16,6,.55)';ctx.lineWidth=1.6;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(-34+(i+3)*5,-2-(i+3)*2.4+4);ctx.lineTo((i+3)*5+0-6,-2+(i+3)*2.4-9);ctx.stroke()}
    if(o.crop){const gr=clamp((o.g||0)/(o.G||1),0,1),h=4+gr*18,col=o.crop==='wheat'?(gr>=1?'#e0b84a':'#7acb55'):(gr>=1?'#efe0f0':'#4fa13c');
      for(let i=-3;i<=3;i++)for(let j=0;j<2;j++){const x=i*8,y=-4+j*5-Math.abs(i)*1.2;wd(x,y,x,y-h,1.8,col)}}
    wd(-34,-4,-34,-14,2.4);wd(34,-4,34,-14,2.4);
  }
  ctx.restore();
}}
/* ---- audio: voice limiter + rate limit (fixes crackle / dropouts) ---- */
{let act=0;const lastAt={};
  const lim=(fn,nm,cap,dur)=>function(k,o){
    if(!AC)return;
    const now=performance.now(),key=nm+Math.round(((o&&o.f0)||0)/80);
    if(act>=cap)return;
    if(now-(lastAt[key]||0)<26)return;lastAt[key]=now;
    act++;const ms=(((o&&o.d)||dur)+((o&&o.a)||0)+((o&&o.hold)||0)+((o&&o.dl)||0))*1000+40;
    setTimeout(()=>{act--},Math.min(ms,3500));
    return fn.apply(this,arguments);
  };
  N=lim(N,'N',22,.3);O=lim(O,'O',22,.3);
  if(typeof F==='function')F=lim(F,'F',8,.4);
  if(typeof R==='function')R=lim(R,'R',8,.4);
}
