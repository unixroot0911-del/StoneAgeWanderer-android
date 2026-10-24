/* ===== V3 (part A): no quests, water/swim/drown, body temperature, seasons, slow regrowth ===== */
/* ---- 0. quests & tutorial hints removed ---- */
QS.length=0;ACTS.length=0;
objective=function(){
  if(!S.alive)return'';
  if(sleeping)return'نائم…';
  if(P.swim&&S.stam<=0)return'تغرق!';
  if(S.air<45)return'نفَسك ينقطع!';
  if(S.bt>=39.5)return'ضربة شمس';
  if(S.bt>=38.4)return'حرارة جسمك مرتفعة';
  if(S.bt<=33.2)return'انخفاض حرارة الجسم';
  if(S.thirst<18)return'عطش شديد';
  if(S.hunger<18)return'جوع شديد';
  if(S.inf>0)return'التهاب في الجرح';
  if(S.bleed>0)return'نزيف';
  if(S.san<22)return'تفقد عقلك';
  return'';
};
Object.assign(S,{bt:37,wet:0,san:100,air:100,inf:0,amb:12});
const CAUSE_ADD={drown:'غرق في الماء ولم يجد من ينقذه.',heat:'قتلته ضربة الشمس.',shade:'مزّقه الظلّ الذي يطارد في العتمة.',infection:'قتله التهاب جرح لم يُعالَج.',sanity:'فقد عقله وسط الظلام.',fire:'احترق.'};
Object.assign(CAUSE,CAUSE_ADD);

/* ---- 1. water: depth, swimming, drowning (player + animals) ---- */
function wdep(x,y){
  const ix=Math.floor(x),iy=Math.floor(y),w=tile(ix,iy).w;if(!w)return 0;
  const n=waterVal(ix,iy);
  if(w===1)return clamp(.2+.5*(.335-n)/.05,.2,.7);
  return Math.min(2.6,.75+Math.max(0,.285-n)*9);
}
const SWIMC={rabbit:{t:14,s:.5},deer:{t:70,s:.7},boar:{t:60,s:.65},wolf:{t:75,s:.7},bear:{t:95,s:.6},mammoth:{t:220,s:.55},bison:{t:65,s:.55},sabertooth:{t:55,s:.62}};
const NOSW={bird:1,butterfly:1,fish:1,frog:1,snake:1};
function shoreVec(x,y){
  let best=null,bd=1e9;
  for(let r=1.5;r<=14;r+=1.5){for(let i=0;i<14;i++){const a=i/14*6.2832,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;if(wdep(px,py)<.3){const d=r;if(d<bd){bd=d;best=[Math.cos(a),Math.sin(a)]}}}if(best)return best}
  return null;
}
function entWater(e,dt){
  if(NOSW[e.sp]||e.dead){e.wd=0;return 1}
  const d=wdep(e.x,e.y);e.wd=d;
  if(d<.2){if(e.swT>0)e.swT=Math.max(0,e.swT-dt*2);return 1}
  const c=SWIMC[e.sp]||{t:40,s:.6};
  if(d<.8)return 1-.3*d;
  e.swT=(e.swT||0)+dt*(.6+d*.5);
  if(e.swT>c.t*.2){const v=shoreVec(e.x,e.y);if(v){const sp=Math.hypot(e.vx,e.vy)||2.5;e.vx=v[0]*Math.max(2,sp);e.vy=v[1]*Math.max(2,sp);e.face=Math.atan2(v[1],v[0])}}
  if(e.swT>c.t){e.dA=(e.dA||0)+dt*(5+d*4);if(e.dA>=3){const k=e.dA;e.dA=0;hurtEnt(e,k,{x:e.x,y:e.y,isDrown:1},0,0)}}
  if(!e.wRip||time-e.wRip>.35){e.wRip=time;emit('puff',e.x,e.y,.05,{col:'rgba(190,225,250,.6)',size:3,vx:(Math.random()-.5)*.7,vy:(Math.random()-.5)*.7})}
  return c.s;
}
function swimStep(dt){
  const d=P.wd||0,deep=P.swim;
  if(deep){
    S.stam=Math.max(0,S.stam-dt*(6+d*3.4));
    if(S.stam<=0){S.air=Math.max(0,S.air-dt*(3+d*5));if(Math.random()<dt*3)emit('puff',P.x,P.y,.3,{col:'rgba(220,240,255,.8)',size:3})}
    else S.air=Math.min(100,S.air+dt*10);
    if(S.air<=0){S.hp-=dt*(7+d*4);S.cause='drown';if(S.hp<=0)die('drown')}
    S.wet=1;
  }else S.air=Math.min(100,S.air+dt*35);
  if(P.inWater)S.wet=Math.min(1,S.wet+dt*(deep?1:.5));
}
/* submerged drawing: top half normal, lower half faded + ripples */
function subDraw(fn,wx,wy,d,sc){
  const p=proj(wx,wy,0),ly=p[1]-Math.min(d*.9,1.7)*U;
  ctx.save();ctx.beginPath();ctx.rect(p[0]-160,p[1]-340,320,ly-(p[1]-340));ctx.clip();fn();ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(p[0]-160,ly,320,200);ctx.clip();ctx.globalAlpha=.22;fn();ctx.restore();
  const t=time*2.2;ctx.save();ctx.lineWidth=1.6;
  for(let i=0;i<2;i++){const k=((t+i*.5)%1);ctx.strokeStyle='rgba(205,235,255,'+(.55*(1-k)).toFixed(2)+')';ctx.beginPath();ctx.ellipse(p[0],ly+3,(10+k*18)*sc,(4+k*7)*sc*HH/16,0,0,TAU);ctx.stroke()}
  ctx.fillStyle='rgba(60,120,160,.22)';ctx.beginPath();ctx.ellipse(p[0],ly+3,14*sc,5.5*sc*HH/16,0,0,TAU);ctx.fill();ctx.restore();
}
{const _dp=drawPlayer;drawPlayer=function(){const d=P.wd||0;if(d>.14&&P.state==='live')return subDraw(()=>_dp(),P.x,P.y,d,1);return _dp()}}
{const _de=drawEnt;drawEnt=function(e,sx,sy){const d=e.wd||0;if(d>.14&&!e.dead&&!NOSW[e.sp])return subDraw(()=>_de(e,sx,sy),e.x,e.y,d,Math.max(.8,AN[e.sp].r*2));return _de(e,sx,sy)}}

/* ---- 2. body temperature (°C) + seasons ---- */
const TK=[[0,8],[3,12],[9,27],[12,22],[15,12],[18,2],[21,-9],[24,8]];
function seasonalT(d){d=((d%24)+24)%24;for(let i=1;i<TK.length;i++)if(d<=TK[i][0]){const a=TK[i-1],b=TK[i];return a[1]+(b[1]-a[1])*(d-a[0])/(b[0]-a[0])}return 8}
let evT=200,evK=0,evL=0;
function ambTemp(){
  const d=(S.day-1)+tod,s=seasonalT(d),amp=3+clamp(s,0,27)/27*3.5;
  return s+amp*Math.cos(6.2832*(tod-.625))+evK-rain*(seas===3?1:3.5);
}
function seaEvents(dt){
  evT-=dt;
  if(evL>0){evL-=dt;if(evL<=0){evK=0;banner('عاد الطقس إلى طبيعته')}}
  else if(evT<=0&&S.alive){
    evT=500+Math.random()*700;
    if(seas===1&&Math.random()<.7){evK=9;evL=330;banner('موجة حر');toast('الحرّ لا يُطاق: ابقَ في الظل واشرب')}
    else if(seas!==1){evK=-9;evL=330;banner('موجة برد');toast('الصقيع يشتد: أبقِ النار مشتعلة')}
  }
}
function bodyStep(dt,nf,sh,tribe,run){
  const amb=ambTemp();S.amb=amb;
  let eff=amb;
  if(nf!==null)eff+=22*Math.max(0,1-nf/5.5);
  if(sh)eff+=5;
  if(S.torchT>0)eff+=3;
  if(tribe)eff+=3;
  if(run)eff+=3;
  if(!sh)eff-=wind*(seas===3?4:2.5);
  const wetting=P.inWater?(P.swim?1.2:.6):(rain>.2&&!sh?rain*.05:0);
  const dry=.006+(nf!==null?.08*Math.max(0,1-nf/5.5):0)+(amb>22?.012:0);
  S.wet=clamp(S.wet+(wetting-(P.inWater?0:dry))*dt,0,1);
  eff-=S.wet*(seas===3?16:9);
  const ins=(1+(S.cloak===2?1.5:S.cloak===1?.6:0))*(1-.45*S.wet);
  const D=21-eff;let Teq;
  if(D>=0)Teq=37-D*.19/ins;else Teq=37+(-D)*.085*(1+.3*(ins-1));
  Teq=clamp(Teq,27,41.5);
  const tau=Teq<S.bt?75:(nf!==null?25:55);
  S.bt+=(Teq-S.bt)*(1-Math.exp(-dt/tau));
  S.warmth=clamp((S.bt-32)/5*100,0,100);
}
const thirstK=()=>1+clamp((S.bt-37.3)/1.5,0,1.2)+(S.amb>30?.15:0);
function envSpd(){return(1-.2*snowK)*(S.bt<34.2?.85:1)*(S.bt>39?.85:1)*(S.san<15?.9:1)*(S.inf>0?.92:1)}
/* extra damage layers on top of the original survival tick */
{const _us=updSurvival;updSurvival=function(dt){
  if(S.alive&&P.state==='live'){
    seaEvents(dt);
    if(S.bt>=39.5){S.hp-=(S.bt-39)*1.5*dt;S.cause='heat';if(S.hp<=0)die('heat')}
    if(S.bt>=38.4&&Math.random()<dt*2)emit('puff',P.x,P.y,1.5,{col:'rgba(220,235,255,.5)',size:2,vy:.4});
    if(S.bleed>0){S.bleedT=(S.bleedT||0)+dt;if(S.bleedT>50&&!S.inf){S.inf=1;toast('الجرح يلتهب!',true)}}else S.bleedT=0;
    if(S.inf>0){S.inf+=dt;S.hp-=dt*(.25+Math.min(.6,S.inf/160));S.cause='infection';if(S.hp<=0)die('infection')}
  }
  const r=_us.apply(this,arguments);
  if(S.alive&&P.state==='live')swimStep(dt);
  return r;
}}
/* herbs/bandages cure infection too */
{const _us=useSlot;useSlot=function(i){const s=inv[i],id=s&&s.id,had=countItem(id||'');const r=_us.apply(this,arguments);
  if(id&&(id==='bandage'||id==='herb'||id==='broth')&&countItem(id)<had&&S.inf>0){S.inf=0;S.bleedT=0;toast('هدأ الالتهاب')}return r}}

/* day length follows the season */
{const _tl=todLook;todLook=function(){const t0=tod,d=(S.day-1)+tod,f=1-.2*Math.cos(6.2832*(d-9)/24);tod=clamp(.5+(t0-.5)*f,0,1);try{_tl()}finally{tod=t0}}}
/* hibernation / migration when the season turns */
{const _us=updSeason;updSeason=function(dt){const old=lastSeas;_us.apply(this,arguments);
  if(old!==lastSeas&&old>=0){
    for(let i=ents.length-1;i>=0;i--){const e=ents[i];if(e.ally||dist(e.x,e.y,P.x,P.y)<16)continue;
      if(seas===3&&(e.sp==='bear'||e.sp==='butterfly'||e.sp==='frog'||e.sp==='snake'||(e.sp==='bird'&&Math.random()<.7))||seas===2&&e.sp==='butterfly'){ents.splice(i,1)}}
  }}}
{const _pop=populate;populate=function(c){
  const n0=ents.length;_pop.apply(this,arguments);
  if(seas===3||seas===2)for(let i=ents.length-1;i>=n0;i--){const e=ents[i];
    if(seas===3&&(e.sp==='bear'||e.sp==='butterfly'||e.sp==='frog'||e.sp==='snake'||(e.sp==='bird'&&Math.random()<.7))||seas===2&&e.sp==='butterfly'){ents.splice(i,1);c.alive--}}
  if(seas===1&&Math.random()<.3&&c.biome.meadow>.3)try{spawnLand(c,Math.random,'snake',1,4)}catch(_){}
}}

/* ---- 3. slow, seasonal regrowth ---- */
REGROW[0]=90;REGROW[1]=3000;REGROW[2]=4800;REGROW[4]=1800;REGROW[5]=1800;
const regK=o=>seas===3?(o.k===0?1.6:3):seas===1?1.25:seas===0?.8:1;
const bushRipeT=()=>seas===3?1e9:seas===0?800:seas===1?520:430;
