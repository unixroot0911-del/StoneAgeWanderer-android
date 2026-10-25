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
const TKS=[];let tkId=1,tkD=0,tkB=0,tkX=0,tkY=0;
const TRK={wolf:1,bear:1,sabertooth:1};
function trkLife(t){return(t.b?150:90)*(snowK>.4?1.5:1)/(1+rain*2.5)}
function trkFresh(t){return(time-t.t)<trkLife(t)}
{const _u=update;update=function(dtRaw){
  const r=_u.apply(this,arguments);
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
