/* ===== V3 (part F): stealth (sit/crawl), animal perception (sight/hearing/smell), danger-feeling bars ===== */
P.stance=0;
const STAN_N=['واقف','جالس','زاحف'];
function setStance(n){if(n===P.stance||!S.alive||P.state!=='live'||sleeping)return;if(P.swim&&n>0){toast('لا يمكنك ذلك في الماء العميق',true);return}P.stance=n;stBtnUpd();SFX.ui&&SFX.ui()}
function cycleStance(){setStance((P.stance+1)%2)}
const stSpd=()=>[1,.58,.3][P.stance||0];
{const _pj=pressJump;pressJump=function(){if(P.stance){setStance(0);return}return _pj.apply(this,arguments)}}
{const _step=SFX.step;SFX.step=function(){if(P.stance===2)return;if(P.stance===1&&Math.random()<.55)return;return _step.apply(this,arguments)}}
/* ---- noise made by the player ---- */
let noiseBoost=0;
const SN={noise:1,cover:1,motion:1,lit:false,vis:0};
const WV={x:1,y:0};
function bumpNoise(r){noiseBoost=Math.max(noiseBoost,r)}
for(const [k,r] of [['swing',18],['hitwood',26],['hitstone',24],['thud',28],['fell',34],['hurt',22],['build',16],['splash',14],['craft',9]]){
  if(typeof SFX[k]==='function'){const f=SFX[k];SFX[k]=function(){bumpNoise(r);return f.apply(this,arguments)}}
}
function noiseTick(dt){
  noiseBoost=Math.max(0,noiseBoost-dt*13);
  const spd=Math.hypot(P.vx,P.vy);let b;
  if(sleeping)b=1.5;
  else if(P.swim)b=12;
  else if(spd<.35)b=P.stance?1:2;
  else if(P.stance===2)b=2.6;else if(P.stance===1)b=5.5;else b=P.running?22:11;
  if(spd>.35){const t=tile(Math.floor(P.x),Math.floor(P.y));if(snowK>.5)b*=1.25;else if(t.sand)b*=.85;if(seas===2)b*=1.15;if(P.inWater&&!P.swim)b*=1.4}
  b*=1-.3*rain;
  SN.noise=Math.max(b,noiseBoost);
  SN.motion=spd>.35?1:(P.stance?.45:.75);
  const nf=nearFireDist();SN.lit=(nf!==null&&nf<7)||S.torchT>0;
  WV.x=Math.cos(time*.021+1.3);WV.y=Math.sin(time*.021+1.3);
}
let coverT=0;
function coverTick(dt){
  coverT-=dt;if(coverT>0)return;coverT=.25;let cv=1;
  nearObjs(P.x,P.y,1.1,o=>{if(o.cut)return;if(o.k===3&&Math.hypot(o.x-P.x,o.y-P.y)<1.0)cv=Math.min(cv,.5);else if(o.k===0&&o.s>.7&&Math.hypot(o.x-P.x,o.y-P.y)<.9)cv=Math.min(cv,.74)});
  if(cv<1&&P.stance)cv*=.75;SN.cover=cv;
}
/* ---- animal perception ---- */
const SENS={rabbit:{v:16,f:2.4,h:1.3,s:0,nv:.4},deer:{v:22,f:2.2,h:1.5,s:12,nv:.45},boar:{v:10,f:1.1,h:1,s:14,nv:.5},wolf:{v:22,f:1.05,h:1.3,s:24,nv:.75},bear:{v:12,f:1,h:1,s:22,nv:.55},mammoth:{v:10,f:1.2,h:.8,s:14,nv:.4},bison:{v:14,f:1.3,h:1,s:12,nv:.4},sabertooth:{v:24,f:1,h:1.2,s:18,nv:.8},snake:{v:4,f:1.4,h:.5,s:0,nv:.5},bird:{v:22,f:2.5,h:1.4,s:0,nv:.2},frog:{v:6,f:2,h:1,s:0,nv:.4}};
function losClear(ax,ay,bx,by){
  for(let i=1;i<5;i++){const t=i/5,x=ax+(bx-ax)*t,y=ay+(by-ay)*t;let blk=false;nearObjs(x,y,1.2,o=>{if(!o.cut&&(o.k===1||o.k===2)&&Math.hypot(o.x-x,o.y-y)<o.r+.2)blk=true});if(blk)return false}
  return true;
}
function senseEnt(e,dt){
  const c=SENS[e.sp];
  if(!c||e.ally||!S.alive||P.state!=='live'){e.aw=0;e.noticed=false;return}
  e.sT=(e.sT||0)-dt;if(e.sT>0)return;const step=.22+Math.random()*.08;e.sT=step;
  const dx=P.x-e.x,dy=P.y-e.y,d=Math.hypot(dx,dy)||.01;
  if(d>70){e.aw=0;e.noticed=false;return}
  let s=0;
  const hr=SN.noise*c.h;if(d<hr)s=Math.max(s,.55+.9*(1-d/hr));
  const lf=SN.lit?.95:1+(c.nv-1)*night;
  const vr=c.v*lf*[1,.55,.3][P.stance||0]*SN.motion*SN.cover;
  if(d<vr){const diff=Math.abs(angDiff(Math.atan2(dy,dx),e.face));if(diff<c.f&&losClear(e.x,e.y,P.x,P.y))s=Math.max(s,.8+1.7*(1-d/vr))}
  if(c.s){const sr=c.s*(P.stance?.8:1);if(d<sr){const f=(-dx*WV.x-dy*WV.y)/d;if(f>.15)s=Math.max(s,.35+.8*f*(1-d/sr))}}
  if(s>0)e.aw=Math.min(1.3,(e.aw||0)+s*step*1.5);else e.aw=Math.max(0,(e.aw||0)-step*.3);
  if(e.aw>=1&&!e.noticed){e.noticed=true;e.mem=9}
  if(e.noticed){if(s>.3)e.mem=9;else{e.mem-=step;if(e.mem<=0){e.noticed=false;e.aw=.5;if(e.tgt==='player'){e.tgt=null;e.st='idle';e.stT=2.5}}}}
  e.susp=e.aw>.35&&!e.noticed?1:0;
  if(e.susp)e.face+=angDiff(Math.atan2(dy,dx),e.face)*.5;
}
{const _ue=updEnt;updEnt=function(e,dt,full){
  if(!e.dead&&full!==false)senseEnt(e,dt);
  if(!e.dead&&SENS[e.sp]&&!e.ally&&!e.noticed&&e.tgt!=='player'&&S.alive){
    const ox=P.x,oy=P.y;const fp=trkTarget(e);P.x=fp?fp.x:ox+5000;P.y=fp?fp.y:oy+5000;
    try{return _ue.apply(this,arguments)}finally{P.x=ox;P.y=oy}
  }
  return _ue.apply(this,arguments);
}}
{const _me=moveEnt;moveEnt=function(e,dt){if(e.susp){e.vx*=.35;e.vy*=.35}return _me.apply(this,arguments)}}
{const _oh=onHurt;onHurt=function(e,src){if(src==='player'){e.noticed=true;e.mem=14;e.aw=1.3}return _oh.apply(this,arguments)}}
/* sneak attack on unaware animals */
{const _he=hurtEnt;hurtEnt=function(e,dmg,src,kx,ky){
  if(src==='player'&&!e.dead&&!e.noticed&&(e.aw||0)<.5&&SENS[e.sp]){dmg*=P.stance?2.4:1.6;floatText(e.x,e.y,'ضربة غادرة','#ffd27a')}
  return _he.call(this,dmg,src,kx,ky)}}
/* ! and ? over animals */
{const _de=drawEnt;drawEnt=function(e,sx,sy){
  const r=_de.apply(this,arguments);
  if(!e.dead&&(e.aw||0)>.3&&SENS[e.sp]&&!e.ally){
    const y=sy-(e.z||0)*U-(AN[e.sp].r*48+26),al=clamp(e.aw,.3,1);
    ctx.save();ctx.globalAlpha=al;ctx.font='bold 18px Rubik,sans-serif';ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='rgba(15,8,4,.9)';
    const t=e.noticed?'!':'؟';ctx.strokeText(t,sx,y);ctx.fillStyle=e.noticed?(PRED[e.sp]?'#ff5a4a':'#ffd27a'):'#f2e08a';ctx.fillText(t,sx,y);ctx.restore();
  }
  return r}}
/* player posture */
{const _dp=drawPlayer;drawPlayer=function(){
  const st=P.stance;if(!st||P.state!=='live')return _dp.apply(this,arguments);
  const p=proj(P.x,P.y,P.z||0);ctx.save();
  if(SN.cover<1)ctx.globalAlpha=.78;
  try{_dp.apply(this,arguments)}finally{ctx.restore()}
}}
{const _u=update;update=function(dtRaw){
  if(S.alive&&P.state==='live'){
    if((P.swim||sleeping)&&P.stance)setStance(0);
    noiseTick(Math.min(dtRaw,.1));coverTick(Math.min(dtRaw,.1));
    if(P.stance===1&&Math.hypot(P.vx,P.vy)<.3&&S.stam<100)S.stam=Math.min(100,S.stam+dtRaw*3);
  }
  return _u.apply(this,arguments)}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);P.stance=0;noiseBoost=0;stBtnUpd();return r}}
/* ---- UI: stance button + stealth pill ---- */
{const b=document.createElement('button');b.id='stBtn';b.type='button';b.className='act';b.setAttribute('aria-label','وضعية الجسم');document.body.appendChild(b);
  const st=document.createElement('style');
  st.textContent='#stBtn{right:calc(env(safe-area-inset-right,0px) + 205px);bottom:calc(env(safe-area-inset-bottom,0px) + 86px);width:52px;height:52px;color:#2b180d;font-size:10px;font-weight:700;line-height:1}#stBtn svg{width:26px;height:26px;stroke:#2b180d;fill:#2b180d;stroke-width:1.8;stroke-linecap:round;display:block;margin:0 auto 1px}#stBtn.on{background:radial-gradient(circle at 35% 30%,#a9d08a,#4b7a3a 72%)}'
   +'.st em{font-style:normal;font-size:10px;min-width:22px;text-align:left;opacity:.85;font-variant-numeric:tabular-nums}.st[data-lv="1"] b{background:#e0a030!important}.st[data-lv="2"] b{background:#d9402e!important;box-shadow:0 0 8px #d9402e}.st[data-lv="3"] b{background:#ff2a1a!important;box-shadow:0 0 12px #ff2a1a}.st[data-lv="2"] svg,.st[data-lv="3"] svg{animation:stshake .35s infinite}.st[data-lv="3"]{animation:pulse .35s infinite alternate}@keyframes stshake{25%{transform:translate(-1px,1px) scale(1.15)}75%{transform:translate(1px,-1px) scale(1.15)}}.st[data-lv="2"] i,.st[data-lv="3"] i{border-color:#ff7a6a}#stats{width:140px}#v3s{background:var(--ui-bg);border:1px solid var(--ui-line);padding:3px 9px;border-radius:999px;font-size:11.5px}';
  document.head.appendChild(st);
  b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();cycleStance()});
  const v=document.getElementById('v3st');if(v){const s=document.createElement('span');s.id='v3s';v.insertBefore(s,v.firstChild)}
  document.addEventListener('keydown',e=>{if(e.repeat)return;if(e.code==='KeyC')setStance(P.stance===1?0:1);});
}
const STSVG=[
 '<svg viewBox="0 0 24 24"><circle cx="12" cy="4.5" r="2.4"/><path fill="none" d="M12 8v8M12 16l-3 5M12 16l3 5M12 10l-4 4M12 10l4 4"/></svg>',
 '<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="2.4"/><path fill="none" d="M12 12v5M12 17l-4 3M12 17l5 2M12 13l-4 3M12 13l4 3"/></svg>',
 '<svg viewBox="0 0 24 24"><circle cx="4.5" cy="14" r="2.3"/><path fill="none" d="M7 15h11M18 15l3 4M9 15l-1 4M13 15l-1 4"/></svg>'];
function stBtnUpd(){const b=document.getElementById('stBtn');if(!b)return;b.innerHTML=STSVG[P.stance||0]+STAN_N[P.stance||0];b.classList.toggle('on',!!P.stance)}
stBtnUpd();
/* ---- bars: levels, numbers, danger ---- */
let hb=0;const gT={pant:0,stomach:6,thirst:9,heart:0};
{const _h=hud;hud=function(dt){
  _h.apply(this,arguments);
  hb-=dt;if(hb>0)return;hb=.12;
  const v=barV();
  for(const k in bars){const el=bars[k],pc=clamp(v[k],0,100);
    el.dataset.lv=!S.alive?0:pc<12?3:pc<25?2:pc<40?1:0;
    let em=el.querySelector('em');if(!em){em=document.createElement('em');el.appendChild(em)}
    em.textContent=Math.round(pc);
  }
  const sp=document.getElementById('v3s');
  if(sp){const n=SN.noise,lvl=n<4?'هادئ جداً':n<8?'هادئ':n<15?'مسموع':'صاخب';sp.textContent=STAN_N[P.stance||0]+' · '+lvl+(SN.cover<1?' · مستتر':'')}
}}
SFX.pant=function(){N(K0,{d:.4,f0:1100,f1:600,q:1.4,g:.16,a:.12});N(K0,{d:.3,f0:700,f1:420,q:1.2,g:.1,a:.1,dl:.45})};
SFX.stomach=function(){O(K0,{d:.8,f0:95,f1:55,type:'sawtooth',lp:220,vib:[12,9],g:.13,a:.15})};
SFX.drycough=function(){N(K0,{d:.1,f0:1700,q:2,g:.2});N(K0,{d:.1,f0:1500,q:2,g:.16,dl:.16})};
{const _hf=horrorFx;horrorFx=function(dt){
  _hf.apply(this,arguments);
  if(!S.alive||P.state!=='live'||hzT!==0)return;
  const w=hz.width,h=hz.height,tm=time;
  const vig=(r,g,b,a)=>{if(a<.03)return;const gr=hzg.createRadialGradient(w/2,h/2,Math.min(w,h)*.3,w/2,h/2,Math.max(w,h)*.6);gr.addColorStop(0,'rgba('+r+','+g+','+b+',0)');gr.addColorStop(1,'rgba('+r+','+g+','+b+','+a.toFixed(2)+')');hzg.fillStyle=gr;hzg.fillRect(0,0,w,h)};
  if(S.thirst<30)vig(190,140,40,(30-S.thirst)/30*.4);
  if(S.hunger<25)vig(110,70,30,(25-S.hunger)/25*.38);
  if(S.stam<18)vig(240,240,240,(18-S.stam)/18*(.18+.1*Math.sin(tm*9)));
  if(S.warmth<25)vig(120,170,230,(25-S.warmth)/25*.35);
  if(S.energy<18){const e=(18-S.energy)/18,hh=h*.28*e*(.55+.45*Math.sin(tm*1.4));hzg.fillStyle='rgba(0,0,0,.92)';hzg.fillRect(0,0,w,hh);hzg.fillRect(0,h-hh,w,hh)}
  gT.pant-=.05;gT.stomach-=.05;gT.thirst-=.05;gT.heart-=.05;
  if(S.stam<14&&gT.pant<=0){gT.pant=1.1;SFX.pant()}
  if(S.hunger<22&&gT.stomach<=0){gT.stomach=12+Math.random()*8;SFX.stomach()}
  if(S.thirst<22&&gT.thirst<=0){gT.thirst=14+Math.random()*8;SFX.drycough()}
  if(S.hp<30&&gT.heart<=0){gT.heart=.55+S.hp/30*.7;SFX.heart()}
}}
