/* ===== V3 (part B): crafting stations, new items/recipes, inventory helpers ===== */
const STN={
  kiln:{n:'فرن الفخار',kit:'kiln_kit',d:'يخبز الطين والفخار ويحوّل الخشب فحماً.'},
  oven:{n:'الفرن الطيني',kit:'oven_kit',d:'يخبز الوجبات الغنية والمرق والحلوى.'},
  smoker:{n:'مدخنة التجفيف',kit:'smoker_kit',d:'تدخّن اللحم والسمك فيدومان طويلاً.'},
  tanner:{n:'حامل الدباغة',kit:'tanner_kit',d:'يدبغ الجلود ويفتل الحبال الجلدية.'},
  loom:{n:'النَّول',kit:'loom_kit',d:'ينسج القماش والملابس والضمادات.'},
  anvil:{n:'سندان حجري',kit:'anvil_kit',d:'يشظّي الصوّان ويصنع السهام بسرعة ودقة.'},
  filter:{n:'مرشّح الماء',kit:'filter_kit',d:'ينقّي الماء بالفحم والرمل.'},
  bed:{n:'فراش العشب',kit:'bed_kit',d:'تنام عليه وتستعيد عقلك ودفئك أسرع.'}
};
const STNAME_ALL=Object.assign({hand:'يدوي',bench:'الطاولة'},Object.fromEntries(Object.entries(STN).map(([k,v])=>[k,v.n])));
const stName=k=>STNAME_ALL[k]||'يدوي';
for(const k in STN){SNAME[k]=STN[k].n}
function stnText(){
  const near=[];if(stationNear('bench'))near.push('الطاولة');for(const k in STN)if(stationNear(k))near.push(STN[k].n);
  return near.length?'قربك: '+near.join(' · '):'لا محطة قربك: الصناعة اليدوية فقط';
}
/* items */
const I3={
  brick:['لبنة طينية','طين مخبوز. لبناء الفرن الطيني.'],
  charcoal:['فحم','وقود نظيف ومرشّح للماء. من الخشب المحروق في الفرن.'],
  cloth:['قماش','ينسج من الألياف على النول. للملابس والضمادات.'],
  tunic:['قميص قماشي','ملابس خفيفة: عزل بسيط مع تهوية صيفاً.',{wear:1}],
  roast:['لحم محمّر بالأعشاب','وجبة دسمة جداً تشبع وتشفي.',{eat:{f:70,hp:12,fed:200,san:6}}],
  fish_bake:['سمك مخبوز','سمك بالأعشاب. مغذٍّ وآمن.',{eat:{f:52,hp:8,fed:140,san:4}}],
  fruit_bar:['قرص الفاكهة','توت وتفاح مضغوط: يدوم ويروي قليلاً.',{eat:{f:38,w:12,fed:120}}],
  broth:['مرق العظام','دافئ ومقوٍّ: يشفي ويروي ويعالج الالتهاب.',{eat:{f:26,w:32,hp:22,fed:220,san:8,give:'pot'}}],
  smoked_meat:['لحم مدخّن','يدوم طويلاً. آمن ومشبع.',{eat:{f:42}}],
  smoked_fish:['سمك مدخّن','يدوم طويلاً.',{eat:{f:32}}],
  waterskin_clean:['قربة ماء نقي','ماء مرشّح وآمن.',{eat:{w:52,give:'waterskin'},snd:'drink'}],
  kiln_kit:['فرن الفخار (مجموعة)','ضعه على الأرض لتخبز الفخار والفحم.',{place:'kiln'}],
  oven_kit:['الفرن الطيني (مجموعة)','ضعه لتخبز الوجبات الغنية.',{place:'oven'}],
  smoker_kit:['مدخنة (مجموعة)','ضعها لتدخّن اللحم والسمك.',{place:'smoker'}],
  tanner_kit:['حامل دباغة (مجموعة)','ضعه لتدبغ الجلود.',{place:'tanner'}],
  loom_kit:['نول (مجموعة)','ضعه لتنسج القماش.',{place:'loom'}],
  anvil_kit:['سندان حجري (مجموعة)','ضعه لتشظّي الصوّان وتصنع السهام.',{place:'anvil'}],
  filter_kit:['مرشّح ماء (مجموعة)','ضعه لتنقّي الماء.',{place:'filter'}],
  bed_kit:['فراش عشب (مجموعة)','ضعه لتنام مرتاحاً وتستعيد عقلك.',{place:'bed'}]
};
for(const k in I3){const v=I3[k];IT[k]=Object.assign({n:v[0],d:v[1]},v[2]||{})}
IT.waterskin_clean.eat.give='waterskin';
Object.assign(PER,{roast:1300,fish_bake:1100,fruit_bar:2600,broth:900,smoked_meat:4200,smoked_fish:3600});
/* icons: compact painters */
const icR=(g,c1,c2)=>{g.beginPath();g.roundRect(7,12,26,20,5);fs(g,c1);g.beginPath();g.roundRect(10,15,20,6,3);g.fillStyle=c2;g.fill()};
IC.brick=g=>{g.beginPath();g.roundRect(5,13,30,16,2);fs(g,'#b5603a');line(g,[[5,21],[35,21]],1.6,'rgba(0,0,0,.35)');line(g,[[16,13],[16,21]],1.6,'rgba(0,0,0,.35)');line(g,[[26,21],[26,29]],1.6,'rgba(0,0,0,.35)')};
IC.charcoal=g=>{[[12,24,7],[24,22,8],[19,13,6]].forEach(p=>{g.beginPath();g.arc(p[0],p[1],p[2],0,TAU);fs(g,'#2b2b30')});g.fillStyle='rgba(255,255,255,.18)';g.fillRect(22,17,4,2)};
IC.cloth=g=>{g.beginPath();g.moveTo(6,10);g.lineTo(34,8);g.lineTo(33,32);g.lineTo(7,31);g.closePath();fs(g,'#d9cdb0');for(let i=0;i<4;i++)line(g,[[8+i*7,10],[8+i*7,31]],1,'rgba(120,100,60,.45)');for(let i=0;i<3;i++)line(g,[[7,14+i*7],[33,13+i*7]],1,'rgba(120,100,60,.45)')};
IC.tunic=g=>{g.beginPath();g.moveTo(6,12);g.lineTo(15,7);g.lineTo(25,7);g.lineTo(34,12);g.lineTo(30,18);g.lineTo(28,16);g.lineTo(28,33);g.lineTo(12,33);g.lineTo(12,16);g.lineTo(10,18);g.closePath();fs(g,'#c9b98e');line(g,[[16,7],[20,12],[24,7]],1.6,OLN)};
const icPlate=(g,food)=>{g.beginPath();g.ellipse(20,26,15,7,0,0,TAU);fs(g,'#a8764a');food(g)};
IC.roast=g=>icPlate(g,g=>{g.beginPath();g.moveTo(8,24);g.quadraticCurveTo(10,10,22,11);g.quadraticCurveTo(33,13,31,24);g.quadraticCurveTo(20,30,8,24);g.closePath();fs(g,'#8a4a22');line(g,[[13,18],[24,22]],1.8,'#d9a05a');g.fillStyle='#4fa13c';g.beginPath();g.arc(27,15,3.2,0,TAU);g.fill()});
IC.fish_bake=g=>icPlate(g,g=>{fishIcon(g,'#c98a4a','#7a4a22')});
IC.fruit_bar=g=>{g.beginPath();g.roundRect(6,14,28,14,4);fs(g,'#8a3a4a');[[12,20],[20,19],[28,21]].forEach(p=>{g.beginPath();g.arc(p[0],p[1],2.4,0,TAU);g.fillStyle='#e8a050';g.fill()})};
IC.broth=g=>{g.beginPath();g.moveTo(7,16);g.quadraticCurveTo(8,34,20,34);g.quadraticCurveTo(32,34,33,16);g.closePath();fs(g,'#9a5a30');g.beginPath();g.ellipse(20,16,13,4.5,0,0,TAU);fs(g,'#d8a24a');line(g,[[13,9],[15,4]],1.6,'rgba(255,255,255,.6)');line(g,[[23,9],[25,3]],1.6,'rgba(255,255,255,.6)')};
IC.smoked_meat=g=>{IC.cooked_meat(g);g.fillStyle='rgba(30,20,10,.38)';g.fillRect(6,9,28,24)};
IC.smoked_fish=g=>{fishIcon(g,'#8a6a3a','#3a2a14')};
IC.waterskin_clean=g=>{IC.waterskin_full(g);g.fillStyle='rgba(180,240,255,.5)';g.beginPath();g.arc(28,12,4,0,TAU);g.fill()};
const icKit=(g,fn)=>{g.beginPath();g.moveTo(5,27);g.lineTo(20,34);g.lineTo(35,27);g.lineTo(20,20);g.closePath();fs(g,'#c9a66a',2);fn(g);line(g,[[14,29],[26,29]],1.4,'rgba(60,30,10,.5)')};
IC.kiln_kit=g=>icKit(g,g=>{g.beginPath();g.arc(20,24,11,Math.PI,0);g.closePath();fs(g,'#8a8478');g.beginPath();g.arc(20,24,5,Math.PI,0);g.closePath();g.fillStyle='#1a0f08';g.fill()});
IC.oven_kit=g=>icKit(g,g=>{g.beginPath();g.moveTo(8,25);g.quadraticCurveTo(10,7,20,7);g.quadraticCurveTo(30,7,32,25);g.closePath();fs(g,'#c4683c');g.beginPath();g.arc(20,24,4.5,Math.PI,0);g.closePath();g.fillStyle='#1a0f08';g.fill()});
IC.smoker_kit=g=>icKit(g,g=>{line(g,[[9,27],[11,9]],3,'#7a4c24');line(g,[[31,27],[29,9]],3,'#7a4c24');line(g,[[8,10],[32,10]],3,'#8a5a2e');line(g,[[16,10],[16,18]],1.6,'#c9a66a');g.beginPath();g.ellipse(16,21,3.4,4.4,0,0,TAU);fs(g,'#9a4a3a',1.6)});
IC.tanner_kit=g=>icKit(g,g=>{line(g,[[8,28],[8,8]],3,'#7a4c24');line(g,[[32,28],[32,8]],3,'#7a4c24');g.beginPath();g.rect(11,10,18,15);fs(g,'#d6aa72',1.8)});
IC.loom_kit=g=>icKit(g,g=>{line(g,[[8,28],[8,6]],3,'#7a4c24');line(g,[[32,28],[32,6]],3,'#7a4c24');line(g,[[8,8],[32,8]],3,'#8a5a2e');for(let i=0;i<5;i++)line(g,[[12+i*4,9],[12+i*4,23]],1.2,'#efe6cc');g.fillStyle='#d9cdb0';g.fillRect(11,19,18,5)});
IC.anvil_kit=g=>icKit(g,g=>{g.beginPath();g.moveTo(8,20);g.lineTo(32,20);g.lineTo(28,28);g.lineTo(12,28);g.closePath();fs(g,'#8d8a82');g.beginPath();g.moveTo(14,20);g.lineTo(18,12);g.lineTo(26,14);g.lineTo(27,20);g.closePath();fs(g,'#3d4650')});
IC.filter_kit=g=>icKit(g,g=>{[[20,24,8],[20,16,7]].forEach(p=>{g.beginPath();g.ellipse(p[0],p[1],p[2],5,0,0,TAU);fs(g,'#a8764a',1.8)});g.fillStyle='#d8c48a';g.fillRect(13,18,14,3);g.fillStyle='#2b2b30';g.fillRect(13,22,14,3)});
IC.bed_kit=g=>icKit(g,g=>{g.beginPath();g.ellipse(20,22,14,7,0,0,TAU);fs(g,'#8fb04c');g.beginPath();g.ellipse(12,19,5,3,0,0,TAU);fs(g,'#efe0b8',1.6)});
/* recipes (cat: food / st = station work) */
const R3=(out,n,inn,st,cat,t,extra)=>REC.push(Object.assign({out:out,n:n,in:inn,st:st,cat:cat,t:t,snd:'tap'},extra||{}));
R3('kiln_kit',1,{stone:10,clay:6,log:2},'bench','build',8);
R3('oven_kit',1,{brick:8,clay:4},'bench','build',8);
R3('smoker_kit',1,{plank:4,stick:6,rope:2,hide:1},'bench','build',7);
R3('tanner_kit',1,{plank:3,stick:4,rope:3,stone:2},'bench','build',6);
R3('loom_kit',1,{plank:5,stick:4,rope:4},'bench','build',8);
R3('anvil_kit',1,{stone:6,log:2,flint:2},'bench','build',7);
R3('filter_kit',1,{pot:1,charcoal:3,clay:2,stone:3},'bench','build',7);
R3('bed_kit',1,{fiber:10,hide:2,rope:2},'hand','build',6,{snd:'rope'});
R3('pot',1,{raw_pot:1,log:1},'kiln','st',8);
R3('brick',3,{clay:4,log:1},'kiln','st',10);
R3('charcoal',2,{log:3},'kiln','st',12);
R3('roast',1,{raw_meat:2,herb:1,log:1},'oven','food',12);
R3('fish_bake',1,{raw_fish:2,herb:1,log:1},'oven','food',10);
R3('fruit_bar',2,{berries:4,apple:1,log:1},'oven','food',9);
R3('broth',1,{bone:2,pot_clean:1,herb:1},'oven','food',11);
R3('smoked_meat',2,{raw_meat:2,log:1},'smoker','food',14);
R3('smoked_fish',2,{raw_fish:2,log:1},'smoker','food',12);
R3('leather',2,{hide:2,herb:1},'tanner','st',10,{snd:'rope'});
R3('rope',3,{leather:1},'tanner','st',4,{snd:'rope'});
R3('cloth',1,{fiber:6},'loom','st',9,{snd:'rope'});
R3('tunic',1,{cloth:3,rope:1},'loom','gear',8,{snd:'rope'});
R3('bandage',3,{cloth:1,herb:1},'loom','st',4,{snd:'rope'});
R3('flint_blade',3,{flint:1},'anvil','st',4,{tool:'stone',snd:'knap'});
R3('arrow',6,{stick:2,feather:2,flint_blade:2},'anvil','st',5);
R3('pot_clean',1,{pot_water:1,charcoal:1},'filter','st',6,{snd:'rope'});
R3('waterskin_clean',1,{waterskin_full:1,charcoal:1},'filter','st',6,{snd:'rope'});
TABS.push(['food','طبخ'],['st','محطات']);
/* wearable tunic: wear level 1 works through the existing S.cloak mechanic */
/* eating hooks: sanity */
{const _us=useSlot;useSlot=function(i){const s=inv[i],e=s&&IT[s.id].eat,san=e&&e.san;const had=s?s.n:0;const r=_us.apply(this,arguments);if(san&&(!inv[i]||inv[i].n<had||inv[i].id!==s.id))S.san=Math.min(100,S.san+san);return r}}
/* generic station drawing */
function stnHot(r){if(!r||r.st==='hand'||r.st==='bench')return;const s=nearStruct(r.st,3.2);if(s)s.hot=22}
function drawStn(o){
  const k=Math.min(1,o.built),e=1-Math.pow(1-k,3),hs=HH/16;
  ctx.fillStyle='rgba(12,26,10,.26)';ctx.beginPath();ctx.ellipse(o.sx,o.sy+1,24,8*hs,0,0,TAU);ctx.fill();
  ctx.save();ctx.translate(o.sx,o.sy);ctx.scale(1,.25+.75*e);ctx.lineCap='round';ctx.lineJoin='round';
  const OL='#2b180d',wd=(x1,y1,x2,y2,w,c)=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=OL;ctx.lineWidth=w+2.6;ctx.stroke();ctx.strokeStyle=c||'#9a6a38';ctx.lineWidth=w;ctx.stroke()};
  const fl=(c,w)=>{ctx.fillStyle=c;ctx.fill();ctx.lineWidth=w||2.4;ctx.strokeStyle=OL;ctx.stroke()};
  const hot=o.hot>0,fk=hot?.7+.3*Math.sin(time*13+o.ph):0;
  switch(o.kind){
  case'kiln':
    ctx.beginPath();ctx.ellipse(0,-2,25,9,0,0,TAU);fl('#6f6a5e');
    ctx.beginPath();ctx.moveTo(-23,-3);ctx.quadraticCurveTo(-22,-40,0,-40);ctx.quadraticCurveTo(22,-40,23,-3);ctx.closePath();fl('#8d887a');
    ctx.strokeStyle='rgba(40,35,28,.4)';ctx.lineWidth=1.2;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-20+i*3,-10-i*9);ctx.lineTo(20-i*3,-10-i*9);ctx.stroke()}
    ctx.beginPath();ctx.moveTo(-8,-3);ctx.quadraticCurveTo(-8,-22,0,-22);ctx.quadraticCurveTo(8,-22,8,-3);ctx.closePath();fl(hot?'#e8742a':'#1a0f08');
    if(hot){ctx.fillStyle='rgba(255,220,120,'+fk+')';ctx.beginPath();ctx.ellipse(0,-9,4,6,0,0,TAU);ctx.fill()}
    wd(10,-40,10,-52,5,'#6f6a5e');break;
  case'oven':
    ctx.beginPath();ctx.ellipse(0,-2,22,8,0,0,TAU);fl('#8a4a2a');
    ctx.beginPath();ctx.moveTo(-20,-3);ctx.bezierCurveTo(-24,-46,24,-46,20,-3);ctx.closePath();fl('#c4683c');
    ctx.fillStyle='rgba(255,230,190,.2)';ctx.beginPath();ctx.ellipse(-7,-26,5,11,.4,0,TAU);ctx.fill();
    ctx.beginPath();ctx.moveTo(-8,-3);ctx.quadraticCurveTo(-8,-20,0,-20);ctx.quadraticCurveTo(8,-20,8,-3);ctx.closePath();fl(hot?'#e8742a':'#1a0f08');
    if(hot){ctx.fillStyle='rgba(255,220,120,'+fk+')';ctx.beginPath();ctx.ellipse(0,-8,4,5.5,0,0,TAU);ctx.fill()}
    wd(0,-44,0,-52,4,'#8a4a2a');break;
  case'smoker':
    wd(-22,0,-19,-40,4.4);wd(22,0,19,-40,4.4);wd(-24,-39,24,-39,4,'#8a5a2e');wd(-20,-20,20,-20,2.6,'#7a4c24');
    for(let i=0;i<4;i++){const x=-14+i*9;wd(x,-38,x,-30,1.2,'#c9a66a');ctx.beginPath();ctx.ellipse(x,-24,3.4,6,0,0,TAU);fl('#8a3a2a',1.6)}
    ctx.beginPath();ctx.ellipse(0,-3,13,4,0,0,TAU);fl(hot?'#e8742a':'#3a2a1a',1.6);break;
  case'tanner':
    wd(-20,0,-18,-36,4.4);wd(20,0,18,-36,4.4);wd(-21,-35,21,-35,3.6,'#8a5a2e');
    ctx.beginPath();ctx.moveTo(-16,-33);ctx.lineTo(16,-33);ctx.lineTo(13,-8);ctx.lineTo(-13,-8);ctx.closePath();fl('#d6aa72',2);
    ctx.strokeStyle='rgba(90,50,20,.4)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-10,-26);ctx.lineTo(8,-20);ctx.moveTo(-8,-16);ctx.lineTo(10,-14);ctx.stroke();
    ctx.beginPath();ctx.ellipse(26,-2,7,3,0,0,TAU);fl('#6a4a2a',1.6);break;
  case'loom':
    wd(-22,0,-20,-44,4.4);wd(22,0,20,-44,4.4);wd(-22,-43,22,-43,4,'#8a5a2e');wd(-21,-12,21,-12,3.4,'#8a5a2e');
    ctx.strokeStyle='#efe6cc';ctx.lineWidth=1.3;for(let i=0;i<9;i++){const x=-17+i*4.3;ctx.beginPath();ctx.moveTo(x,-42);ctx.lineTo(x,-12);ctx.stroke()}
    ctx.fillStyle='#d9cdb0';ctx.fillRect(-17,-24,34,11);ctx.strokeStyle='rgba(120,100,60,.5)';ctx.lineWidth=1;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-17,-22+i*4);ctx.lineTo(17,-22+i*4);ctx.stroke()}break;
  case'anvil':
    ctx.beginPath();ctx.ellipse(0,-2,16,6,0,0,TAU);fl('#5a3a1a',2);
    ctx.beginPath();ctx.rect(-12,-14,24,12);fl('#7a4c24',2);
    ctx.beginPath();ctx.moveTo(-20,-14);ctx.lineTo(20,-14);ctx.lineTo(16,-24);ctx.lineTo(-14,-26);ctx.closePath();fl('#9a968c');
    ctx.fillStyle='rgba(255,255,255,.22)';ctx.fillRect(-12,-24,20,2);
    ctx.beginPath();ctx.moveTo(24,-3);ctx.lineTo(28,-9);ctx.lineTo(33,-4);ctx.closePath();fl('#3d4650',1.6);break;
  case'filter':
    wd(-14,0,-12,-30,3.6);wd(14,0,12,-30,3.6);
    for(let i=0;i<3;i++){const y=-6-i*10;ctx.beginPath();ctx.ellipse(0,y,15-i,6,0,0,TAU);fl(i===0?'#2b2b30':i===1?'#d8c48a':'#a8764a',1.8)}
    ctx.beginPath();ctx.ellipse(0,-36,14,5,0,0,TAU);fl('#a8764a',1.8);
    if(((time*1.5+o.ph)%1)<.1){ctx.fillStyle='rgba(120,200,255,.8)';ctx.beginPath();ctx.arc(0,-1,2,0,TAU);ctx.fill()}break;
  case'bed':
    ctx.beginPath();ctx.ellipse(0,-4,30,12,0,0,TAU);fl('#8fb04c');
    ctx.strokeStyle='rgba(60,90,30,.5)';ctx.lineWidth=1.2;for(let i=-4;i<=4;i++){ctx.beginPath();ctx.moveTo(i*6,-12);ctx.lineTo(i*6+3,2);ctx.stroke()}
    ctx.beginPath();ctx.ellipse(-16,-11,9,5,0,0,TAU);fl('#efe0b8',1.8);
    ctx.beginPath();ctx.ellipse(8,-4,15,6,0,0,TAU);fl('#b9855a',1.6);break;
  }
  ctx.restore();
}
{const _ds=drawStruct;drawStruct=function(o){if(STN[o.kind])return drawStn(o);return _ds(o)}}
/* hot stations emit smoke */
{const _us=updStructs;updStructs=function(dt){_us.apply(this,arguments);
  for(const s of structs){if(s.hot>0){s.hot-=dt;if(Math.random()<dt*5)emit('puff',s.x+(Math.random()-.5)*.3,s.y,1.6,{col:'rgba(120,110,100,.5)',size:4,vx:.2,vy:-.1})}}
  const bd=nearStruct('bed',2.2);if(bd&&S.alive&&P.state==='live'){S.san=Math.min(100,S.san+dt*.6);if(sleeping)S.energy=Math.min(100,S.energy+dt*.4)}
}}
/* inventory: crafting references in item info + sort button */
{const _ri=renderInv;renderInv=function(){_ri.apply(this,arguments);
  if(!invOpen)return;
  const s=inv[invSel];const info=$('info');
  if(s){
    const id=s.id,mk=REC.filter(r=>r.out===id),us=REC.filter(r=>r.in[id]);
    let h='';
    if(IT[id].cook)h+='<div>على النار → <b>'+(IT[IT[id].cook]?IT[IT[id].cook].n:'')+'</b></div>';
    for(const r of mk.slice(0,3))h+='<div>يُصنع من: '+Object.keys(r.in).map(k=>IT[k].n+' ×'+r.in[k]).join(' + ')+' · '+stName(r.st)+'</div>';
    if(us.length)h+='<div>يدخل في: '+us.slice(0,6).map(r=>IT[r.out].n).join('، ')+'</div>';
    if(IT[id].place&&STN[IT[id].place])h+='<div>'+STN[IT[id].place].d+'</div>';
    if(h)info.insertAdjacentHTML('beforeend','<div class="xr">'+h+'</div>');
  }
  const st=$('stn');if(st)st.textContent=stnText();
  if(!$('invSort')){const b=document.createElement('button');b.id='invSort';b.type='button';b.className='btn alt';b.textContent='ترتيب';b.style.cssText='position:absolute;top:8px;left:50px;padding:4px 12px;font-size:13px';b.addEventListener('click',sortInv);$('inv').firstElementChild.appendChild(b)}
}}
function sortInv(){
  const rank=id=>{const d=IT[id];return d.weapon?0:d.wear||d.use?1:d.eat?2:d.place?4:3};
  const items=inv.filter(Boolean).sort((a,b)=>rank(a.id)-rank(b.id)||(a.id<b.id?-1:a.id>b.id?1:0));
  inv.fill(null);items.forEach((x,i)=>{inv[i]=x});invSel=-1;invDirty=true;SFX.ui&&SFX.ui();renderInv();
}
{const st=document.createElement('style');st.textContent='#info .xr{font-size:11.5px;opacity:.85;line-height:1.6;margin-top:6px;border-top:1px solid rgba(255,255,255,.15);padding-top:5px}#inv>*:first-child{position:relative}';document.head.appendChild(st)}
