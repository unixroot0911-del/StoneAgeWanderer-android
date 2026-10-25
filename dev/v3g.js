/* ===== v3g: real sit/crawl pose, positional animal sound, tracks & blood trails ===== */
/* ---- 1) pose ---- */
let pk1=0,pk2=0;
{const _up=updPlayer;updPlayer=function(dt,dtRaw){
  const r=_up.apply(this,arguments);
  const k=Math.min(1,(dtRaw||dt||.016)*7),st=P.state==='live'&&!P.swim?P.stance||0:0;
  pk1+=((st===1?1:0)-pk1)*k;pk2+=((st===2?1:0)-pk2)*k;
  const R=P.rig;if(!R||(pk1<.01&&pk2<.01))return r;
  const pv=R.pv,ph=P.phase,mv=clamp(P.speed/2,0,1),sn=Math.sin(ph),cs=Math.cos(ph);
  const L=(a,b,t)=>a+(b-a)*t;
  if(pk1>.01){
    pv[12]=L(pv[12],1.15,pk1);pv[10]=L(pv[10],.3,pk1);pv[11]=L(pv[11],-.03,pk1);
    pv[2]=L(pv[2],.72,pk1);pv[8]=L(pv[8],.72,pk1);pv[0]=L(pv[0],.5,pk1);pv[6]=L(pv[6],.5,pk1);
    R.hipZ=L(R.hipZ,.5+.02*cs*mv,pk1);
    R.fR[0]=L(R.fR[0],R.fR[0]*.6+.12,pk1);R.fL[0]=L(R.fL[0],R.fL[0]*.6+.1,pk1);
  }
  if(pk2>.01){
    pv[12]=L(pv[12],1.9,pk2);pv[10]=L(pv[10],.75,pk2);pv[11]=L(pv[11],-.25,pk2);
    pv[0]=L(pv[0],.5+.22*sn*mv,pk2);pv[1]=L(pv[1],.24,pk2);pv[2]=L(pv[2],.07+Math.max(0,cs)*.12*mv,pk2);
    pv[6]=L(pv[6],.5-.22*sn*mv,pk2);pv[7]=L(pv[7],-.24,pk2);pv[8]=L(pv[8],.07+Math.max(0,-cs)*.12*mv,pk2);
    R.hipZ=L(R.hipZ,.26+.01*cs*mv,pk2);
    R.fR[0]=L(R.fR[0],-.5-.18*sn*mv,pk2);R.fR[1]=L(R.fR[1],.2,pk2);R.fR[2]=L(R.fR[2],.07+Math.max(0,sn)*.1*mv,pk2);
    R.fL[0]=L(R.fL[0],-.55+.18*sn*mv,pk2);R.fL[1]=L(R.fL[1],-.2,pk2);R.fL[2]=L(R.fL[2],.07+Math.max(0,-sn)*.1*mv,pk2);
  }
  return r}}
/* ---- 3) tracks & blood ---- */
let LITE=0,fAvg=.016;
const TKS=[];let tkId=1,tkD=0,tkB=0,tkX=0,tkY=0;
const TRK={wolf:1,bear:1,sabertooth:1};
function trkLife(t){return(t.b?150:90)*(snowK>.4?1.5:1)/(1+rain*2.5)}
function trkFresh(t){return(time-t.t)<trkLife(t)}
{const _u=update;update=function(dtRaw){
  const r=_u.apply(this,arguments);
  fAvg+=(Math.min(dtRaw,.2)-fAvg)*.03;if(fAvg>.027)LITE=1;else if(fAvg<.02)LITE=0;
  if(S.alive&&P.state==='live'&&!sleeping){
    const d=Math.hypot(P.x-tkX,P.y-tkY);
    if(d>[.9,1.7,2.8][P.stance||0]&&!P.swim){tkX=P.x;tkY=P.y;TKS.push({id:tkId++,x:P.x,y:P.y,t:time,b:0})}
    if(S.bleed>0){tkB-=dtRaw;if(tkB<=0){tkB=.55;TKS.push({id:tkId++,x:P.x+(Math.random()-.5)*.3,y:P.y+(Math.random()-.5)*.3,t:time,b:1})}}
    if(TKS.length>220)TKS.splice(0,TKS.length-220);
  }
  return r}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);TKS.length=0;pk1=pk2=0;return r}}
/* predators follow the trail while they have not noticed the player */
function trkTarget(e){
  if(!TRK[e.sp]||e.ally||e.dead)return null;
  e.tracking=false;e.tkT=(e.tkT||0)-.016;
  if(e.tkOn===undefined)e.tkOn=Math.random()<.7;
  if(!e.tkOn)return null;
  if(e.tkT<=0){
    e.tkT=.5;e.trkP=null;
    const wf=1+Math.max(0,-(((e.x-P.x)*WV.x+(e.y-P.y)*WV.y))/Math.max(1,Math.hypot(e.x-P.x,e.y-P.y)))*.0;
    let best=null,bd=1e9;
    for(let i=0;i<TKS.length;i++){const t=TKS[i];if(!trkFresh(t))continue;
      const d=Math.hypot(t.x-e.x,t.y-e.y),R=(t.b?26:12)*(e.sp==='wolf'?1.25:1)*wf;
      if(d>R)continue;
      if(e.tkId&&t.id<=e.tkId)continue;
      const sc=d-(t.b?6:0)+(e.tkId?(t.id-e.tkId)*.02:0);
      if(sc<bd){bd=sc;best=t}}
    if(best){if(bd<1.7||Math.hypot(best.x-e.x,best.y-e.y)<1.7)e.tkId=best.id;e.trkP=best;e.trkS=time}
  }
  const t=e.trkP;if(!t||time-(e.trkS||0)>3)return null;
  const dx=t.x-e.x,dy=t.y-e.y,d=Math.hypot(dx,dy)||1;
  if(d<1.7){e.tkId=t.id;e.trkP=null;return null}
  e.tracking=true;
  return{x:e.x+dx/d*7,y:e.y+dy/d*7};
}
{const _me=moveEnt;moveEnt=function(e,dt){if(e.tracking&&!e.noticed){e.vx*=.7;e.vy*=.7}return _me.apply(this,arguments)}}
/* draw tracks */
{const _dg=drawGround;drawGround=function(l,r,t,b){
  const x=_dg.apply(this,arguments);
  if(LITE>0&&TKS.length>40)return x;
  for(let i=0;i<TKS.length;i++){
    const k=TKS[i],age=time-k.t;if(age>trkLife(k)||(!k.b&&age<7))continue;
    const p=proj(k.x,k.y,0),u=1-age/trkLife(k);
    if(p[0]<-30||p[0]>W+30||p[1]<-30||p[1]>H+30)continue;
    if(k.b){ctx.fillStyle='rgba(110,18,14,'+(.55*u+.15).toFixed(3)+')';ctx.beginPath();ctx.ellipse(p[0],p[1],3.2,1.8,0,0,TAU);ctx.fill();ctx.beginPath();ctx.ellipse(p[0]+3,p[1]+1,1.5,.9,0,0,TAU);ctx.fill()}
    else{ctx.fillStyle=snowK>.4?'rgba(90,110,140,'+(.3*u).toFixed(3)+')':'rgba(38,28,14,'+(.2*u).toFixed(3)+')';ctx.beginPath();ctx.ellipse(p[0],p[1],3.2,1.8,0,0,TAU);ctx.fill()}
  }
  return x}}
/* ---- 2) positional animal sound ---- */
const ESZ={rabbit:.1,deer:.5,boar:.6,wolf:.55,bear:1,mammoth:1.6,bison:1,sabertooth:.8,snake:0,bird:0,frog:0,fish:0,butterfly:0};
function eSnd(e,kind){
  const k=spat(e);if(!k)return;const z=ESZ[e.sp]||0,q={g:k.g*(kind==='step'?.3:.2),p:k.p,w:k.w};
  if(kind==='step'){
    if(z>=.5)O(q,{d:.28,f0:90+40/z,f1:40,g:.4*z});
    N(q,{d:.12,f0:z>=.5?500:2200,f1:z>=.5?150:900,type:z>=.5?'lowpass':'bandpass',q:1,g:.12+.1*z,buf:'p'});
  }else if(kind==='rustle'){N(q,{d:.35,f0:3200,f1:6500,type:'highpass',q:.7,g:.3,a:.08})}
}
{const _ue=updEnt;updEnt=function(e,dt,full){
  const r=_ue.apply(this,arguments);
  if(e.dead||e.ally||!S.alive)return r;
  const z=ESZ[e.sp];if(!z)return r;
  const d=Math.hypot(e.x-P.x,e.y-P.y);if(d>45)return r;
  const sp=Math.hypot(e.vx||0,e.vy||0);
  if(sp>.9){
    e.sdT=(e.sdT||0)-dt*sp;
    if(e.sdT<=0){e.sdT=2.2;eSnd(e,'step');
      if(z>=.5&&d<20&&biome(e.x,e.y).forest>.2&&Math.random()<.35)eSnd(e,'rustle');
      if(d<30)SN.heard=(SN.heard||0)+1}
  }
  /* distant cues from hostile animals that are tracking / hunting you */
  if((e.noticed||e.tracking)&&TRK[e.sp]&&d>9){
    e.cueT=(e.cueT||4)-dt;
    if(e.cueT<=0){e.cueT=5+Math.random()*5;
      if(e.sp==='wolf')SFX.howl(e);else if(e.sp==='bear')SFX.roar(e);else SFX.growl(e)}
  }
  return r}}
/* ---- hidden stats: no numbers, the player reads symptoms ---- */
{const st=document.createElement('style');st.textContent='#v3t,#v3san,#v3s{display:none!important}';document.head.appendChild(st)}
SFX.chatter=function(){for(let i=0;i<6;i++)N(K0,{d:.03,f0:rr(2200,3400),q:5,g:.16,dl:i*.055+Math.random()*.02});O(K0,{d:.4,f0:130,f1:110,type:'triangle',g:.04,a:.1})};
SFX.shivBreath=function(){N(K0,{d:.7,f0:2600,f1:1400,q:.9,g:.12,a:.2});N(K0,{d:.5,f0:900,f1:500,q:1,g:.08,a:.1,dl:.1})};
SFX.gasp=function(){N(K0,{d:.5,f0:700,f1:2200,q:1.2,g:.2,a:.12});N(K0,{d:.5,f0:1200,f1:500,q:1.2,g:.16,a:.05,dl:.6})};
SFX.drip=function(){const f=rr(1100,1800);O(K0,{d:.09,f0:f,f1:f*.5,g:.14});N(K0,{d:.04,f0:4000,q:3,g:.05})};
SFX.tinnitus=function(){O(K0,{d:2.2,f0:6800,f1:6600,g:.03,a:.5})};
SFX.phantomStep=function(){const p=Math.random()<.5?-.7:.7;const k={g:.5,p:p,w:.5};for(let i=0;i<4;i++){O(k,{d:.2,f0:80,f1:40,g:.4,dl:i*.42});N(k,{d:.1,f0:600,f1:200,type:'lowpass',g:.2,dl:i*.42})}};
SFX.windGust=function(){const d=3+Math.random()*3;N(K0,{d:d,f0:300,f1:900,type:'bandpass',q:1.6,g:.28,a:d*.45});N(K0,{d:d,f0:1100,f1:500,type:'bandpass',q:2,g:.12,a:d*.5})};
SFX.leafRustle=function(){for(let i=0;i<9;i++)N(K0,{d:.12,f0:rr(3500,6500),type:'highpass',q:.7,g:.07,dl:Math.random()*1.6,a:.03})};
SFX.cicada=function(){O(K0,{d:2.5,f0:4300,f1:4400,type:'square',lp:5200,am:[75,.9],g:.018,a:.5})};
let gfx={chat:3,breath:5,pant:1,drip:2,tin:20,ph:30,seas:6,flick:9};
{const _h=hud;hud=function(dt){
  _h.apply(this,arguments);
  if(!S.alive||P.state!=='live')return;
  for(const k in gfx)gfx[k]-=dt;
  const bt=S.bt,cold=clamp((35.8-bt)/3,0,1),hot=clamp((bt-37.9)/1.8,0,1),sn=S.san;
  if(S.amb<6||bt<35.4){if(gfx.fog===undefined||(gfx.fog-=dt)<=0){gfx.fog=2.3;emit('puff',P.x+Math.cos(P.face)*.3,P.y+Math.sin(P.face)*.3,.95,{col:'rgba(235,242,255,.6)',size:3.5+cold*2,vx:Math.cos(P.face)*.4,vy:Math.sin(P.face)*.4})}}
  if(cold>0){
    shake=Math.max(shake,.1+.22*cold);
    if(gfx.chat<=0){gfx.chat=cold>.5?2.2:5;SFX.chatter()}
    if(gfx.breath<=0){gfx.breath=3.5;SFX.shivBreath()}
  }
  if(hot>0){
    if(gfx.pant<=0){gfx.pant=1.4-hot*.6;SFX.pant()}
    if(Math.random()<dt*2*hot)emit('puff',P.x+(Math.random()-.5)*.3,P.y+(Math.random()-.5)*.3,1.3,{col:'rgba(150,200,240,.8)',size:2})}
  if(S.wet>.5&&gfx.drip<=0){gfx.drip=1.2+Math.random()*2;SFX.drip();emit('puff',P.x,P.y,.5,{col:'rgba(150,200,240,.7)',size:2})}
  if(sn<30&&gfx.tin<=0){gfx.tin=25+Math.random()*20;SFX.tinnitus()}
  if(sn<50&&gfx.ph<=0){gfx.ph=18+Math.random()*25;SFX.phantomStep()}
  if(sn<35&&gfx.flick<=0){gfx.flick=8+Math.random()*12;const f=$('flash');if(f){f.style.transition='none';f.style.background='rgba(0,0,0,.85)';f.style.opacity=1;setTimeout(()=>{f.style.transition='opacity .25s';f.style.opacity=0;f.style.background=''},90)}}
  if(gfx.seas<=0){gfx.seas=9+Math.random()*9;
    if(seas===3)SFX.windGust();else if(seas===2)SFX.leafRustle();else if(seas===1&&night<.3)SFX.cicada();}
}}
/* shivering / trembling body */
{const _up=updPlayer;updPlayer=function(){
  const r=_up.apply(this,arguments);const R=P.rig;if(!R||!S.alive)return r;
  const cold=clamp((35.8-S.bt)/3,0,1),sick=clamp((S.hp<30?1:0)+(S.bt>38.6?.6:0),0,1),a=Math.max(cold,sick*.5);
  if(a>.02){const t=time*(cold?38:14),j=Math.sin(t)*.03*a;R.pv[0]+=j;R.pv[6]-=j;R.pv[1]+=Math.cos(t*1.3)*.025*a;R.pv[9]+=Math.sin(t*.9)*.05*a;R.hipZ+=Math.sin(t*1.7)*.008*a}
  return r}}
