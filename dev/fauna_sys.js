/* ===== FAUNA SYSTEMS: new species, taming, companion, XP/levels, bestiary, extra quests ===== */
AN.sabertooth={hp:80,r:.46,ref:5.6,cad:10,sh:[26,8],eyes:[28,-26],loot:[['raw_meat',4,1],['hide',3,1],['bone',2,.8],['fang',2,.5]]};
AN.bison={hp:72,r:.6,ref:4.4,cad:7,sh:[32,10],loot:[['raw_meat',6,1],['hide',3,1],['bone',3,.9]]};
ARN.sabertooth='نمر سيفي الأنياب';ARN.bison='ثور بري';
PRED.sabertooth=1;
const ENTK={sabertooth:'T',bison:'x'};ENTL.T='sabertooth';ENTL.x='bison';
IT.fang={n:'ناب نمر سيفي',d:'ناب ضخم نادر. اصنع منه قلادة تمنحك الجرأة.'};
IT.fang_charm={n:'قلادة الناب',d:'ترتديها فتضرب أقوى بنسبة 15% دائماً.',use:'charm'};
IC.fang=g=>{g.beginPath();g.moveTo(14,5);g.quadraticCurveTo(27,8,24,22);g.quadraticCurveTo(22,34,18,36);g.quadraticCurveTo(19,22,14,5);g.closePath();fs(g,'#f4ecd4',2);line(g,[[17,10],[21,22]],1.2,'rgba(150,130,90,.5)')};
IC.fang_charm=g=>{line(g,[[8,6],[20,17],[32,6]],2.4,'#8a5a2c');g.save();g.translate(9.5,10);g.scale(.62,.62);IC.fang(g);g.restore()};
REC.push({out:'fang_charm',n:1,in:{fang:2,rope:1},st:'hand',cat:'gear',t:6,snd:'rope'});
const tgOf=e=>(e.tgt==='player'||!e.tgt)?P:e.tgt;
const foodItem=()=>['cooked_meat','raw_meat','jerky','cooked_fish','raw_fish'].find(k=>countItem(k)>0)||null;

/* ---- sabertooth: ambush predator ---- */
AI.sabertooth=function(e,dt){
  e.hunger=Math.min(1,e.hunger+dt*.006);
  const alive=S.alive&&P.state==='live',pd=dist(e.x,e.y,P.x,P.y);
  if(e.leap>0){
    e.leap-=dt;const tg=tgOf(e);
    if(!e.lhit&&dist(e.x,e.y,tg.x,tg.y)<1.5+(tg.r||0)){e.lhit=1;if(tg===P)hitPlayer(24,e,'sabertooth',P.x-e.x,P.y-e.y);else hurtEnt(tg,26,e,0,0);SFX.bite(e)}
    if(e.leap<=0){e.atkT=2.4;e.st='recover';e.stT=1.5}
    return;
  }
  if(e.windup>0){
    e.windup-=dt;halt(e,dt);const tg=tgOf(e);e.face+=angDiff(Math.atan2(tg.y-e.y,tg.x-e.x),e.face)*Math.min(1,dt*12);
    if(e.windup<=0){const a=Math.atan2(tg.y-e.y,tg.x-e.x);e.vx=Math.cos(a)*11.5;e.vy=Math.sin(a)*11.5;e.leap=.38;e.lhit=0;SFX.roar(e)}
    return;
  }
  if(e.st==='recover'){halt(e,dt);if(e.stT<=0)e.st='prowl';return}
  const sc=scary(e.x,e.y,5.2);
  if((sc||e.hp<e.max*.25)&&e.st!=='flee'){e.st='flee';e.stT=5;e.thr=sc||{x:P.x,y:P.y};e.tgt=null}
  if(e.st==='flee'){const t=e.thr||{x:P.x,y:P.y};awayFrom(e,t.x,t.y,6.2,dt,0);if(e.stT<=0)e.st='prowl';return}
  if((e.sn-=dt)<=0){
    e.sn=.35;
    if(e.st!=='stalk'){
      let tg=null;
      if(alive&&pd<14+7*night&&!scary(P.x,P.y,5))tg='player';
      else{for(const o of ents)if(o.ally&&!o.dead&&dist(o.x,o.y,e.x,e.y)<9){tg=o;break}}
      if(tg){e.tgt=tg;e.st='stalk';e.stT=16;e.sleep=false}
    }
  }
  if(e.st==='stalk'){
    const tg=tgOf(e);
    if(!tg||(tg===P&&!alive)||(tg!==P&&tg.dead)||e.stT<=0||dist(e.x,e.y,tg.x,tg.y)>30){e.st='prowl';e.tgt=null;return}
    const d=steer(e,tg.x,tg.y,2.5,dt,5);
    if(d<6.2&&e.atkT<=0){e.windup=.6;halt(e,dt);SFX.growl(e)}
    return;
  }
  if(night<.25&&e.hunger<.55){halt(e,dt);e.sleep=true;return}
  e.sleep=false;
  wander(e,dt,16,1.9,2,6);
};

/* ---- bison: herd, charges when provoked ---- */
AI.bison=function(e,dt){
  const pd=dist(e.x,e.y,P.x,P.y),L=e.leader&&!e.leader.dead?e.leader:null;
  if(e.windup>0){e.windup-=dt;halt(e,dt);if(e.windup<=0){e.st='charge';e.stT=4.5}return}
  if(e.st==='charge'){
    const tg=tgOf(e),d=steer(e,tg.x,tg.y,5.4,dt,5);
    if(e.stT<=0||pd>22||scary(e.x,e.y,3)){e.st='idle';e.stT=3;e.tgt=null;return}
    if(d<1.5+(tg.r||0)&&e.atkT<=0){e.atkT=1.8;e.vx*=-.3;e.vy*=-.3;if(tg===P)hitPlayer(16,e,'bison',P.x-e.x,P.y-e.y);else hurtEnt(tg,18,e,0,0);SFX.thud&&SFX.thud(e)}
    return;
  }
  if(L&&L.st==='charge'&&pd<26){e.tgt=L.tgt;e.st='charge';e.stT=7;return}
  if(night>.8){halt(e,dt);e.sleep=true;return}
  e.sleep=false;
  if(L&&dist(e.x,e.y,L.x,L.y)>4.5){steer(e,L.x+Math.cos(e.ph*.1)*2.4,L.y+Math.sin(e.ph*.1)*2.4,2.6,dt,4);e.st='walk';return}
  wander(e,dt,10,1.4,3,8);
};
{const _oh=onHurt;onHurt=function(e,src){
  const t=src==='player'?'player':src;
  if(e.sp==='sabertooth'){e.tgt=t;e.st='stalk';e.stT=14;if(!e.windup&&!e.leap)e.windup=.35;SFX.roar(e);return}
  if(e.sp==='bison'){e.tgt=t;e.windup=.45;SFX.growl(e);if(e.leader)e.leader.tgt=t;
    ents.forEach(o=>{if(o.sp==='bison'&&!o.dead&&o!==e&&dist(o.x,o.y,e.x,e.y)<14&&Math.random()<.7){o.tgt=t;o.st='charge';o.stT=4.5}});return}
  if(e.sp==='wolf'&&e.young&&!e.ally){e.st='flee';e.stT=4;e.thr={x:P.x,y:P.y,d:2};return}
  return _oh.apply(this,arguments)}}

/* ---- wolf cub: tame it with meat, it becomes your companion ---- */
function cubAI(e,dt){
  const pd=dist(e.x,e.y,P.x,P.y),meat=!!foodItem();
  if((e.sn-=dt)<=0){
    e.sn=.25;e.thr=null;
    if(S.alive&&P.state==='live'){if((pd<9&&P.speed>2.8)||(pd<3.2&&P.speed>1.2))e.thr={x:P.x,y:P.y,d:pd}}
    const f=scary(e.x,e.y,4);if(f&&!e.thr)e.thr={x:f.x,y:f.y,d:f.d};
  }
  if(e.thr){awayFrom(e,e.thr.x,e.thr.y,4.6,dt,Math.sin(e.ph*2)*.6);e.st='flee';e.stT=1.2;return}
  if(S.alive&&meat&&pd<10&&pd>1.8&&P.speed<1.1){steer(e,P.x,P.y,1.6,dt,4);e.st='walk';return}
  if(S.alive&&meat&&pd<=1.8&&P.speed<1.1){halt(e,dt);e.st='sit';return}
  if(e.st==='sit'||e.st==='flee'){e.st='idle';e.stT=1}
  wander(e,dt,6,1.5,2,6);
}
function tameWolf(e){
  const names=['رماد','ظلّ','فجر','غبار','ريح','جمرة'];
  e.ally=true;e.young=false;e.born=S.age;e.nm=names[(Math.random()*names.length)|0];e.st='idle';e.hp=e.max;e.tgt=null;
  S.flag.tamed=1;banner('رفيق جديد: '+e.nm);toast('صار الجرو '+e.nm+' رفيقك. يتبعك ويقاتل معك');SFX.quest&&SFX.quest();xpGain(40);
  for(let i=0;i<10;i++)emit('puff',e.x,e.y,.6,{col:'rgba(255,170,190,.8)',size:3});
}
function allyAI(e,dt){
  if(e.born===undefined)e.born=S.age;
  const gr=clamp((S.age-e.born)/1200,0,1);
  e.sc=.62+.42*gr;e.r=AN.wolf.r*e.sc;e.max=34+22*gr;if(e.hp>e.max)e.hp=e.max;
  e.atkT=Math.max(0,e.atkT-dt);e.sleep=false;
  const pd=dist(e.x,e.y,P.x,P.y);
  if(pd>34&&S.alive&&P.state==='live'){const a=Math.random()*6.28;e.x=P.x+Math.cos(a)*3;e.y=P.y+Math.sin(a)*3;e.vx=e.vy=0;return}
  if((e.sn-=dt)<=0){
    e.sn=.3;let best=null,bd=99;
    for(const o of ents){
      if(o===e||o.dead||o.ally||o.gone)continue;
      const hostile=PRED[o.sp]||(o.sp==='snake'&&dist(o.x,o.y,P.x,P.y)<4)||((o.st==='chase'||o.st==='rage'||o.st==='charge'||o.st==='hunt'||o.st==='stalk'||o.windup>0)&&(o.tgt==='player'||o.tgt===e));
      if(!hostile)continue;
      if(dist(o.x,o.y,P.x,P.y)>12)continue;
      const dd=dist(o.x,o.y,e.x,e.y);if(dd<bd){bd=dd;best=o}
    }
    e.tgt=best;
  }
  if(!e.tgt)e.hp=Math.min(e.max,e.hp+dt*.8);
  if(e.tgt&&!e.tgt.dead&&e.hp>e.max*.3){
    const tg=e.tgt,d=steer(e,tg.x,tg.y,5.6,dt,7);e.st='hunt';
    if(d<1.1+(tg.r||0)&&e.atkT<=0){e.atkT=1;SFX.bite(e);hurtEnt(tg,7+7*gr,e,(tg.x-e.x)*.3,(tg.y-e.y)*.3);if(tg.sp!=='snake'&&Math.random()<.35)tg.tgt=e}
    return;
  }
  e.tgt=null;
  if(pd>3.4){steer(e,P.x+Math.cos(e.ph*.2)*1.6,P.y+Math.sin(e.ph*.2)*1.6,pd>10?5.4:pd>6?4:2.6,dt,5);e.st='walk'}
  else{halt(e,dt);if(e.st!=='idle'){e.st='idle';e.stT=1}}
}
{const _w=AI.wolf;AI.wolf=function(e,dt){if(e.ally)return allyAI(e,dt);if(e.young)return cubAI(e,dt);return _w.call(this,e,dt)}}
{const _he=hurtEnt;hurtEnt=function(e,dmg,src,kx,ky){
  if(e&&e.ally){dmg*=.35;if(e.hp-dmg<2){e.hp=2;e.flash=.16;return}}
  return _he.call(this,e,dmg,src,kx,ky)}}
{const _fa=findAct;findAct=function(){
  _fa.apply(this,arguments);
  if(!S.alive||P.state!=='live'||job||mg||sleeping)return;
  const it=foodItem();if(!it)return;
  for(const e of ents){
    if(e.dead||e.sp!=='wolf')continue;
    const d=dist(e.x,e.y,P.x,P.y);
    if(e.young&&!e.ally&&d<2.4)actC={t:'tame',e:e,lbl:'أطعم الجرو',ico:it,x:e.x,y:e.y};
    else if(e.ally&&d<2.6&&e.hp<e.max-.5&&(!actC||d<1.4))actC={t:'feedally',e:e,lbl:'أطعم '+(e.nm||'رفيقك'),ico:it,x:e.x,y:e.y};
  }
}}
{const _da=doAct;doAct=function(){
  const c=actC;
  if(c&&(c.t==='tame'||c.t==='feedally')&&!mg&&!job&&P.state==='live'&&P.atk.n===0&&!P.air){
    aInit();const it=foodItem();if(!it||!c.e||c.e.dead)return;
    takeItem(it,1);playAct('gather',.5);P.faceT=Math.atan2(c.y-P.y,c.x-P.x);SFX.pop();
    for(let i=0;i<5;i++)emit('puff',c.e.x,c.e.y,.7,{col:'rgba(255,170,190,.8)',size:3});
    if(c.t==='tame'){c.e.tame=(c.e.tame||0)+1;if(c.e.tame>=3)tameWolf(c.e);else toast('الجرو يأكل بحذر… ('+c.e.tame+'/3)')}
    else{c.e.hp=Math.min(c.e.max,c.e.hp+c.e.max*.3);toast((c.e.nm||'رفيقك')+' استعاد قوته')}
    return;
  }
  return _da.apply(this,arguments)}}

/* ---- spawning ---- */
{const _po=populate;populate=function(c){
  _po.apply(this,arguments);
  if(ents.length>QUAL.ents)return;
  const rnd=mulberry((Math.imul(c.cx,6271)^Math.imul(c.cy,92821)^((time*1000)|0)^0x5bd1)>>>0);
  const B=c.biome,mx=c.cx*CS+CS/2,my=c.cy*CS+CS/2,safe=S.age<170&&dist(mx,my,S.sx,S.sy)<38;
  if(!safe){
    if(B.forest>.35&&B.danger>.3&&rnd()<.05+.05*night)spawnLand(c,rnd,'sabertooth',1,2);
    if(B.meadow>.3&&B.danger<.6&&rnd()<.09){const hd=spawnLand(c,rnd,'bison',3+((rnd()*3)|0),5);hd.forEach((h,i)=>{if(i)h.leader=hd[0]})}
    if(B.danger>.3&&B.forest>.2&&rnd()<.045)spawnLand(c,rnd,'wolf',1,2,{young:true,sc:.62,r:AN.wolf.r*.62,hp:18,max:18});
  }
  if(c.alive>0)c.pop=true;
}}

/* ---- experience, levels, perks ---- */
const XP_SRC={rabbit:4,deer:12,boar:16,wolf:22,snake:7,bear:55,mammoth:120,sabertooth:90,bison:34,bird:3,fish:3,frog:2};
const PERK=[null,null,{t:'قبضة قوية',d:'+8% ضرر السلاح'},{t:'ساقا ظبي',d:'+6% سرعة الحركة'},{t:'معدة حجرية',d:'الجوع والعطش أبطأ 12%'},{t:'عين الصياد',d:'غنيمة لحم إضافية من الصيد'},{t:'جلد سميك',d:'-12% ضرر مستلم'},{t:'رئتان واسعتان',d:'القدرة تعود أسرع'},{t:'غضب الصياد',d:'+8% ضرر إضافي'},{t:'عزيمة',d:'تجدد بطيء للصحة عند الشبع'},{t:'أسطورة البرية',d:'+10% سرعة و-10% ضرر مستلم'}];
const LV_MAX=10,xpNeed=l=>Math.round(60+34*l+7*l*l),lv=()=>S.lvl||1;
function dmgMul(){return 1+(S.charm?.15:0)+(lv()>=2?.08:0)+(lv()>=8?.08:0)}
function takeMul(){return 1-(lv()>=6?.12:0)-(lv()>=10?.1:0)}
function spdMul(){return 1+(lv()>=3?.06:0)+(lv()>=10?.1:0)}
function xpGain(n){
  if(!S.alive||!n)return;
  S.lvl=S.lvl||1;S.xp=(S.xp||0)+n;floatText(P.x,P.y,'+'+n+' خبرة','#ffd98a');
  while(S.lvl<LV_MAX&&S.xp>=xpNeed(S.lvl)){
    S.xp-=xpNeed(S.lvl);S.lvl++;const p=PERK[S.lvl];
    banner('المستوى '+S.lvl+(p?' · '+p.t:''));if(p)toast('✦ '+p.d);SFX.quest&&SFX.quest();
    for(let i=0;i<14;i++)emit('spark',P.x,P.y,.9+Math.random()*.8,{});
  }
  if(S.lvl>=LV_MAX)S.xp=0;
  xpHud();
}
{const _hp=hitPlayer;hitPlayer=function(dmg){const a=Array.prototype.slice.call(arguments);a[0]=dmg*takeMul();return _hp.apply(this,a)}}
{const _us=updSurvival;updSurvival=function(dt){
  const h0=S.hunger,t0=S.thirst;_us.apply(this,arguments);
  if(!S.alive)return;
  if(lv()>=4){if(S.hunger<h0)S.hunger+=(h0-S.hunger)*.12;if(S.thirst<t0)S.thirst+=(t0-S.thirst)*.12}
  if(lv()>=7&&!P.running&&S.stam<100&&P.atk.n===0)S.stam=Math.min(100,S.stam+dt*2.2);
  if(lv()>=9&&S.hp<100&&S.hunger>35&&S.thirst>35&&!(S.bleed>0)&&!(S.poison>0))S.hp=Math.min(100,S.hp+dt*.22);
}}
{const _hv=harvest;harvest=function(e){
  const mt=e.meat;_hv.apply(this,arguments);
  if(lv()>=5&&mt>0&&Math.random()<.5){const l=addItem('raw_meat',1);if(l)dropItem('raw_meat',l,P.x,P.y);toast('+ لحم إضافي (عين الصياد)')}
}}
{const _ke=killEnt;killEnt=function(e,src){
  const was=e.dead;_ke.apply(this,arguments);
  if(!was&&e.dead&&src==='player'){S.kc=S.kc||{};S.kc[e.sp]=(S.kc[e.sp]||0)+1;xpGain(XP_SRC[e.sp]||5)}
}}
{const _ng=newGame;newGame=function(){_ng.apply(this,arguments);S.xp=0;S.lvl=1;S.charm=0;S.kc={};S.seen={};xpHud()}}
{const _uq=updQuests;updQuests=function(dt){
  const n0=QS.filter(q=>S.q[q.id]).length;_uq.apply(this,arguments);
  const n1=QS.filter(q=>S.q[q.id]).length;if(n1>n0)xpGain(25*(n1-n0));
}}

/* ---- extra quests ---- */
ACTS.push('الفصل الخامس: سيّد البرية');
QS.push(
 {id:'bison',a:5,t:'اصطد ثوراً بريّاً',d:'القطعان الضخمة في المروج. أذِ واحداً فتهاجمك كلها، فاستعد.',ok:()=>S.flag.k_bison},
 {id:'cub',a:5,t:'روّض جرو ذئب',d:'جراء ضائعة في الغابات. قف ساكناً ومعك لحم ودعه يقترب، ثم أطعمه.',ok:()=>S.flag.tamed},
 {id:'saber',a:5,t:'اقتل نمراً سيفياً',d:'صياد كمين يتسلل ثم يقفز. النار والمشاعل تخيفه.',ok:()=>S.flag.k_sabertooth},
 {id:'charm',a:5,t:'اصنع قلادة الناب',d:'ناب نمر سيفي + حبل. تمنحك ضرباً أقوى.',ok:()=>S.charm},
 {id:'lvl5',a:5,t:'بلغ المستوى 5',d:'الخبرة من الصيد والصناعة والإنجازات.',ok:()=>lv()>=5}
);

/* ---- HUD + journal ---- */
const xpPill=document.createElement('div');xpPill.id='xpPill';
xpPill.innerHTML='<span id="xpLv">1</span><i><b id="xpFill"></b></i>';
document.body.appendChild(xpPill);
{const st=document.createElement('style');st.textContent='#xpPill{position:fixed;z-index:7;left:calc(env(safe-area-inset-left,0px) + 12px);top:calc(env(safe-area-inset-top,0px) + 124px);width:118px;height:13px;display:flex;align-items:center;gap:5px;pointer-events:none}#xpPill span{font:700 10px/1 var(--f-display,system-ui);color:#ffd98a;text-shadow:0 1px 2px #000;min-width:18px}#xpPill i{flex:1;height:5px;border-radius:3px;background:#0008;border:1px solid #d8c49a44;overflow:hidden}#xpPill b{display:block;height:100%;width:0;background:linear-gradient(90deg,#e0902e,#ffd98a);transition:width .4s}';document.head.appendChild(st)}
function xpHud(){
  const vis=S.alive&&P.state!=='hidden'&&$('splash').hidden;xpPill.style.display=vis?'flex':'none';
  if(!vis)return;
  $('xpLv').textContent='Lv '+lv();
  $('xpFill').style.width=(lv()>=LV_MAX?100:Math.round(100*(S.xp||0)/xpNeed(lv())))+'%';
}
setInterval(xpHud,700);
setInterval(()=>{if(!S.alive||P.state==='hidden')return;S.seen=S.seen||{};for(const e of ents)if(!e.dead&&AN[e.sp]&&dist(e.x,e.y,P.x,P.y)<16)S.seen[e.sp]=1},1000);
const BEST=[['rabbit','سريع وخجول. لحمه وجلده مفيدان.'],['deer','قطيع هادئ يهرب عند أول خطر.'],['boar','يهجم إذا اقتربت منه.'],['bison','قطيع ضخم: أذِ واحداً فيهاجمك الجميع.'],['wolf','يصطاد في جماعات ويزداد جرأة ليلاً. الجراء الضائعة يمكن ترويضها.'],['snake','لدغتها سامّة. راقب العشب الطويل.'],['sabertooth','صياد كمين: يتسلل ثم يقفز. النار تخيفه.'],['bear','ضخم وبطيء الغضب. احذر ضربته.'],['mammoth','عملاق مسالم حتى تؤذيه.']];
{const _rj=renderJournal;renderJournal=function(){
  _rj.apply(this,arguments);
  const need=lv()>=LV_MAX?'الحد الأقصى':(S.xp||0)+' / '+xpNeed(lv());
  let h='<div style="font-family:var(--f-display);font-size:15px;margin:12px 0 3px;color:var(--ember)">الخبرة والمهارات</div><div class="q cur"><div class="ck">'+lv()+'</div><div><b>المستوى '+lv()+'</b><span>'+need+'</span></div></div>';
  for(let l=2;l<=LV_MAX;l++){const p=PERK[l];h+='<div class="q'+(lv()>=l?' done':'')+'"><div class="ck">'+(lv()>=l?'✓':l)+'</div><div><b>'+p.t+'</b><span>'+p.d+'</span></div></div>'}
  h+='<div style="font-family:var(--f-display);font-size:15px;margin:12px 0 3px;color:var(--ember)">سجل الحيوانات</div>';
  for(const b of BEST){const sn=S.seen&&S.seen[b[0]],k=(S.kc&&S.kc[b[0]])||0;
    h+='<div class="q'+(k?' done':'')+'"><div class="ck">'+(k?'✓':sn?'•':'؟')+'</div><div><b>'+(sn||k?ARN[b[0]]:'مجهول')+(k?' ×'+k:'')+'</b><span>'+(sn||k?b[1]:'لم تره بعد.')+'</span></div></div>'}
  $('ql').insertAdjacentHTML('beforeend',h);
}}
/* ---- breath fog in winter + dust when running ---- */
{const _ue=updEnt;updEnt=function(e,dt,full){
  _ue.apply(this,arguments);
  if(e.dead||e.sp==='fish'||e.sp==='bird'||e.sp==='butterfly'||e.sp==='frog')return;
  const s=Math.hypot(e.vx,e.vy);
  if(s>3.4&&Math.random()<dt*7)emit('puff',e.x,e.y,.05,{col:'rgba(176,152,110,.5)',size:2.2});
  if(seas===3&&e.sp!=='snake'&&Math.random()<dt*.5){const r=AN[e.sp].r*1.7;emit('puff',e.x+Math.cos(e.face)*r,e.y+Math.sin(e.face)*r,.9,{col:'rgba(255,255,255,.55)',size:3})}
}}
