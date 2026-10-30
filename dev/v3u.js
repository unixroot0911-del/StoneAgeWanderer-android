/* ===== v3u: wake up in a real cave (massif + carved passages + lighting) ===== */
SNAME.rockw='';SNAME.cdeco='';
const cvH=(a,b)=>{const s=Math.sin(a*12.9898+b*78.233)*43758.5453;return s-Math.floor(s)};
const CV_N=14,CV_WH=2.3;
function cvJ(i,k){return .9+.2*cvH(i,k)}
function cvDisc(c,i){return c.d[i]}
/* ---------- generation ---------- */
function caveGen(){
  let best=0,bs=-1e9;
  for(let k=0;k<16;k++){const a=Math.random()*6.283;let sc=0;
    for(let t=0;t<=100;t+=3){const x=S.sx+Math.cos(a)*t,y=S.sy+Math.sin(a)*t;sc+=waterAt(x,y)!==0?-4:1}
    if(sc>bs){bs=sc;best=a}}
  const d=[],m=[],deco=[],caches=[];
  const add=(x,y,r,mass)=>{d.push([+x.toFixed(2),+y.toFixed(2),+r.toFixed(2)]);if(mass!==false)m.push([+x.toFixed(2),+y.toFixed(2),+(r+6+Math.random()*2.5).toFixed(2)])};
  let x=S.sx,y=S.sy,h=best;
  add(x,y,4.6);
  let nodes=0;const mainN=40;const nodesList=[];
  const walk=(x0,y0,h0,n,w0,branch)=>{
    let px=x0,py=y0,ph=h0;
    for(let i=0;i<n;i++){
      ph+=(Math.random()-.5)*.7+(branch?0:(best-ph)*.1);
      px+=Math.cos(ph)*2.1;py+=Math.sin(ph)*2.1;
      const w=w0+Math.sin(i*.8+w0)*.5+Math.random()*.6;
      let r=w;
      if(!branch&&i>3&&i<mainN-6&&i%9===5)r=3.8+Math.random()*2;
      add(px,py,r);nodesList.push([px,py,r,branch,i]);
    }
    return [px,py,ph];
  };
  /* main passage */
  const E=walk(x,y,h,mainN,1.9,false);
  /* mouth: widen without massif */
  add(E[0]+Math.cos(E[2])*3,E[1]+Math.sin(E[2])*3,3.6,false);
  add(E[0]+Math.cos(E[2])*6,E[1]+Math.sin(E[2])*6,4.6,false);
  const mouth={x:E[0]+Math.cos(E[2])*6,y:E[1]+Math.sin(E[2])*6,a:E[2]};
  /* branches from main nodes */
  const mains=nodesList.filter(n=>!n[3]);
  const bA=mains[11],bB=mains[23],bC=mains[31];
  const ends=[];
  for(const [b,len,side,big] of [[bA,12,1,1],[bB,8,-1,0],[bC,11,1,1]]){
    if(!b)continue;const sd=Math.atan2(mains[Math.min(mains.length-1,mains.indexOf(b)+1)][1]-b[1],mains[Math.min(mains.length-1,mains.indexOf(b)+1)][0]-b[0]);
    const r2=walk(b[0],b[1],sd+side*(1.2+Math.random()*.5),len,1.5,true);
    const cr=big?4.4+Math.random():3;add(r2[0]+Math.cos(r2[2])*cr*.7,r2[1]+Math.sin(r2[2])*cr*.7,cr);
    ends.push([r2[0]+Math.cos(r2[2])*cr*.7,r2[1]+Math.sin(r2[2])*cr*.7,cr,big]);
  }
  /* skylight in the first large chamber of main passage */
  const big=nodesList.find(n=>!n[3]&&n[2]>3.6&&n[4]>8);
  const sky=big?{x:big[0],y:big[1]}:null;
  const bbx=[1e9,1e9,-1e9,-1e9];for(const q of m){bbx[0]=Math.min(bbx[0],q[0]-q[2]);bbx[1]=Math.min(bbx[1],q[1]-q[2]);bbx[2]=Math.max(bbx[2],q[0]+q[2]);bbx[3]=Math.max(bbx[3],q[1]+q[2])}
  /* deco inside chambers */
  for(const n of nodesList){if(n[2]>3.4){for(let i=0;i<3;i++){const a=Math.random()*6.283,rr=n[2]*(.35+Math.random()*.5);deco.push([n[0]+Math.cos(a)*rr,n[1]+Math.sin(a)*rr,(Math.random()*3)|0])}}}
  for(const e of ends)for(let i=0;i<3;i++){const a=Math.random()*6.283,rr=e[2]*(.3+Math.random()*.5);deco.push([e[0]+Math.cos(a)*rr,e[1]+Math.sin(a)*rr,(Math.random()*3)|0])}
  return {x:S.sx,y:S.sy,a:best,d:d,m:m,deco:deco,ends:ends,mouth:mouth,sky:sky,bb:bbx,id:Math.random()+'',w:0,dk:1};
}
/* ---------- geometry tests ---------- */
function cvInD(c,x,y,k){k=k||.9;for(const q of c.d){const dx=x-q[0],dy=y-q[1],r=q[2]*k;if(dx*dx+dy*dy<r*r)return true}return false}
function cvInM(c,x,y,k){k=k||.985;for(const q of c.m){const dx=x-q[0],dy=y-q[1],r=q[2]*k;if(dx*dx+dy*dy<r*r)return true}return false}
function caveBlocked(x,y){const c=S.cave;if(!c)return false;const b=c.bb;if(x<b[0]||x>b[2]||y<b[1]||y>b[3])return false;return cvInM(c,x,y)&&!cvInD(c,x,y)}
const caveIn=(x,y,m)=>{const c=S.cave;if(!c)return false;const b=c.bb;if(x<b[0]-3||x>b[2]+3||y<b[1]-3||y>b[3]+3)return false;return cvInM(c,x,y,1+(m||0)*.1)||cvInD(c,x,y,1.05)};
function caveClear(ch){
  const c=S.cave;if(!c||ch.cvid===c.id)return;ch.cvid=c.id;
  const b=c.bb,x0=ch.cx*CS,y0=ch.cy*CS;if(x0>b[2]+4||x0+CS<b[0]-4||y0>b[3]+4||y0+CS<b[1]-4)return;
  for(const o of ch.objs){if(o.hide)continue;if(caveIn(o.x,o.y,1.5)){o.cut=true;o.cutAt=1e12;o.r=0;o.hide=true}}
}
function caveBuild(){
  const c=caveGen();S.cave=c;
  chunks.forEach(caveClear);
  for(let i=ents.length-1;i>=0;i--)if(caveIn(ents[i].x,ents[i].y,2))ents.splice(i,1);
  /* starter items near start */
  for(const q of ['stick','stick','stick','fiber','fiber','fiber','resin','flint','flint','tinder','tinder','stone','stone','bone']){
    const an=Math.random()*6.283,rr=1+Math.random()*2.8;dropItem(q,1,c.x+Math.cos(an)*rr,c.y+Math.sin(an)*rr)}
  /* decor */
  for(const q of c.deco)structs.push({isStruct:true,kind:'cdeco',v:q[2],x:q[0],y:q[1],r:q[2]===0?.35:q[2]===2?.5:0,key:0,ph:Math.random()*6.283,built:1,items:[],t:0,T:99,c:false,own:false,camp:1});
  /* loot at dead ends */
  S.csites=S.csites||{};
  c.ends.forEach((e,i)=>{const cid='cv'+i;S.csites[cid]=1;structs.push({isStruct:true,kind:'cache',cid:cid,v:(i%3),x:e[0],y:e[1],r:.6,key:0,ph:Math.random()*6.283,built:1,items:[],t:0,T:99,c:false,own:false,camp:1})});
  P.state='live';P.z=0;P.zv=0;P.x=c.x;P.y=c.y;cam.wx=P.x;cam.wy=P.y;P.face=c.a+3.14;
}
{const _ng=newGame;newGame=function(){S.cave=null;const r=_ng.apply(this,arguments);if(!Net.on||Net.role==='admin'){try{caveBuild()}catch(e){S.cave=null}}return r}}
{const _rs=restoreSnapshot;restoreSnapshot=function(d){const r=_rs.apply(this,arguments);const o=(d&&d.S)||{};if(!o.cave||!o.cave.d)S.cave=null;else{S.cave.w=99;S.cave.dk=0;chunks.forEach(caveClear)}return r}}
{const _g=getChunk;getChunk=function(cx,cy){const c=_g(cx,cy);if(S.cave)try{caveClear(c)}catch(e){}return c}}
{const _do=drawObj;drawObj=function(o){if(o.hide)return;return _do.apply(this,arguments)}}
{const _sm=spdMul;spdMul=function(){const r=_sm.apply(this,arguments);return(S.cave&&S.cave.w<5)?r*.4:r}}
/* ---------- collision ---------- */
{const _me=moveEnt;moveEnt=function(e,dt){
  const ox=e.x,oy=e.y;_me.apply(this,arguments);
  if(S.cave&&e.sp!=='butterfly'&&!(e.sp==='bird'&&e.st==='fly')&&caveBlocked(e.x,e.y)){
    if(!caveBlocked(e.x,oy)){e.y=oy}else if(!caveBlocked(ox,e.y)){e.x=ox}else{e.x=ox;e.y=oy}}
}}
var cvT=0,cvPur=0;
{const _u=update;update=function(dt){
  const c=S.cave,ox=P.x,oy=P.y;
  _u.apply(this,arguments);
  if(!c||!S.alive)return;
  if(caveBlocked(P.x,P.y)){const nx=P.x,ny=P.y;if(!caveBlocked(nx,oy)){P.y=oy}else if(!caveBlocked(ox,ny)){P.x=ox}else{P.x=ox;P.y=oy;P.vx=P.vy=0}}
  c.w+=dt;
  const inside=cvInM(c,P.x,P.y,.9)&&cvInD(c,P.x,P.y,1.05);
  /* darkness proximity: fade with distance to mouth */
  const mo=c.mouth,dm=Math.hypot(P.x-mo.x,P.y-mo.y);
  const d=inside?clamp((dm-7)/16,0,1):0;
  c.dk+=(d-c.dk)*Math.min(1,dt*2.5);c.inn=(c.inn||0)+((inside?1:0)-(c.inn||0))*Math.min(1,dt*4);
  cvT-=dt;if(cvT<=0&&c.dk>.3){cvT=2.2+Math.random()*4;try{SFX.drip()}catch(e){}}
  if(c.w<1.4&&!c.hb){c.hb=1;try{SFX.heart&&SFX.heart()}catch(e){}}
  cvPur-=dt;if(cvPur<=0){cvPur=1;for(let i=ents.length-1;i>=0;i--){const e=ents[i];if(e.sp!=='hunter'&&!e.cave&&caveIn(e.x,e.y,1))ents.splice(i,1)}}
}}
/* ---------- textures ---------- */
const CVT={};
function cvMkPat(w,h,fn){const cv=document.createElement('canvas');cv.width=w;cv.height=h;const g=cv.getContext('2d');fn(g,w,h);return cv}
function cvPats(){
  if(CVT.top)return;
  const rnd=mulberry(77);
  CVT.top=cvMkPat(96,96,(g,w,h)=>{g.fillStyle='#6f695c';g.fillRect(0,0,w,h);for(let i=0;i<260;i++){const v=rnd(),s=2+rnd()*7;g.fillStyle=v<.4?'rgba(40,36,30,.22)':v<.8?'rgba(150,142,125,.18)':'rgba(70,92,52,.16)';g.fillRect(rnd()*w,rnd()*h,s,s*.7)}});
  CVT.face=cvMkPat(80,120,(g,w,h)=>{g.fillStyle='#4b453d';g.fillRect(0,0,w,h);for(let i=0;i<44;i++){const x=rnd()*w,l=20+rnd()*60;g.strokeStyle=rnd()<.5?'rgba(20,16,12,.35)':'rgba(120,110,95,.14)';g.lineWidth=1+rnd()*3;g.beginPath();g.moveTo(x,rnd()*h);g.lineTo(x+(rnd()-.5)*6,rnd()*h+l);g.stroke()}});
  CVT.floor=cvMkPat(80,80,(g,w,h)=>{g.fillStyle='#38332d';g.fillRect(0,0,w,h);for(let i=0;i<150;i++){const s=1+rnd()*4;g.fillStyle=rnd()<.5?'rgba(15,12,10,.35)':'rgba(120,110,96,.2)';g.beginPath();g.ellipse(rnd()*w,rnd()*h,s,s*.6,0,0,6.3);g.fill()}});
  CVT.L=document.createElement('canvas');CVT.T=document.createElement('canvas');CVT.K=document.createElement('canvas');
}
/* ---------- rendering ---------- */
let CVc=[0,0];
const cvPr=(x,y,z)=>{const p=proj(x,y,z||0);return[(p[0]-CVc[0])*Z+W/2,(p[1]-CVc[1])*Z+H/2]};
function cvPath(g,arr,dy,mk,skipMouth,nMouth){
  g.beginPath();
  const b=S.cave.bb;
  for(let i=0;i<arr.length;i++){
    if(skipMouth&&i>=arr.length-nMouth)break;
    const q=arr[i],rr=q[2],p0=cvPr(q[0],q[1],0);
    if(p0[0]<-rr*Z*70||p0[0]>W+rr*Z*70||p0[1]<-rr*Z*70-200||p0[1]>H+rr*Z*70+200)continue;
    for(let k=0;k<CV_N;k++){const an=k/CV_N*6.2832,r=rr*cvJ(i*7+(mk||0),k);const p=cvPr(q[0]+Math.cos(an)*r,q[1]+Math.sin(an)*r,0);
      if(k===0)g.moveTo(p[0],p[1]+dy);else g.lineTo(p[0],p[1]+dy)}
    g.closePath();
  }
}
{const _dg=drawGround;drawGround=function(l,r,t,b){
  _dg.apply(this,arguments);
  const c=S.cave;if(!c)return;
  try{cvLayer(c)}catch(e){}
}}
function cvLayer(c){
  const bb=c.bb;
  const cpp=proj(cam.wx,cam.wy,.9);CVc=cpp;
  /* quick reject: massif far from view */
  const pc=cvPr((bb[0]+bb[2])/2,(bb[1]+bb[3])/2,0);const ext=(Math.max(bb[2]-bb[0],bb[3]-bb[1])/2+10)*HW*Z;
  if(pc[0]<-ext||pc[0]>W+ext||pc[1]<-ext||pc[1]>H+ext)return;
  cvPats();
  const q=.7,w=Math.ceil(W*q),h=Math.ceil(H*q);
  const L=CVT.L,T=CVT.T;if(L.width!==w||L.height!==h){L.width=w;L.height=h;T.width=w;T.height=h}
  const g=L.getContext('2d'),t=T.getContext('2d');
  const hpx=(proj(0,0,CV_WH)[1]-proj(0,0,0)[1])*Z;   /* negative: up */
  const mk=(pat,ox,oy)=>{const p=g.createPattern(CVT[pat],'repeat');return p};
  const tx=(-CVc[0]*Z)*q,ty=(-CVc[1]*Z)*q;
  const setP=(ctx,name,off)=>{const p=ctx.createPattern(CVT[name],'repeat');try{p.setTransform(new DOMMatrix([q,0,0,q,tx,ty+(off||0)]))}catch(e){}return p};
  g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-over';g.clearRect(0,0,w,h);
  t.setTransform(1,0,0,1,0,0);t.globalCompositeOperation='source-over';t.clearRect(0,0,w,h);
  g.setTransform(q,0,0,q,0,0);t.setTransform(q,0,0,q,0,0);
  /* face layer: massif footprint minus floor */
  g.fillStyle=setP(g,'face');cvPath(g,c.m,0,0);g.fill();
  g.globalCompositeOperation='destination-out';cvPath(g,c.d,0,3);g.fill();
  /* top layer: same footprint shifted up */
  t.fillStyle=setP(t,'top',hpx*q);cvPath(t,c.m,hpx,0);t.fill();
  t.globalCompositeOperation='destination-out';cvPath(t,c.d,hpx,3);t.fill();
  if((c.inn||0)>.02){t.globalCompositeOperation='source-atop';t.setTransform(1,0,0,1,0,0);t.fillStyle='rgba(10,9,10,'+(.62*c.inn).toFixed(3)+')';t.fillRect(0,0,w,h);t.setTransform(q,0,0,q,0,0);t.globalCompositeOperation='source-over'}
  g.globalCompositeOperation='source-over';g.setTransform(1,0,0,1,0,0);g.drawImage(T,0,0);g.setTransform(q,0,0,q,0,0);
  /* rock edge shading: darken top rim */
  g.globalCompositeOperation='destination-out';cvPath(g,c.d,0,3);g.fill();
  /* floor underneath */
  g.globalCompositeOperation='destination-over';g.fillStyle=setP(g,'floor');cvPath(g,c.d,0,3,true,2);g.fill();
  g.globalCompositeOperation='source-over';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.drawImage(L,0,0,W,H);
  /* faces get a gradient: darker toward floor line */
  /* restore world transform for the sprites that follow */
  const WT=[DPR*Z,0,0,DPR*Z,DPR*(W/2-CVc[0]*Z),DPR*(H/2-CVc[1]*Z)];
  ctx.setTransform(WT[0],WT[1],WT[2],WT[3],WT[4],WT[5]);
}
/* lighting mask after everything */
{const _r=render;render=function(dt){
  _r.apply(this,arguments);
  const c=S.cave;if(!c||!S.alive||P.state==='hidden')return;
  try{cvLight(c)}catch(e){}
  if(c.w<6){ctx.setTransform(DPR,0,0,DPR,0,0);const a=Math.pow(clamp(1-c.w/5.5,0,1),1.2)*(.8+.2*Math.sin(c.w*6));ctx.fillStyle='rgba(0,0,0,'+a.toFixed(3)+')';ctx.fillRect(0,0,W,H)}
}}
function cvLight(c){
  const bb=c.bb;CVc=proj(cam.wx,cam.wy,.9);
  const pc=cvPr((bb[0]+bb[2])/2,(bb[1]+bb[3])/2,0);const ext=(Math.max(bb[2]-bb[0],bb[3]-bb[1])/2+10)*HW*Z;
  if(pc[0]<-ext||pc[0]>W+ext||pc[1]<-ext||pc[1]>H+ext)return;
  const q=.5,w=Math.ceil(W*q),h=Math.ceil(H*q),K=CVT.K;if(K.width!==w||K.height!==h){K.width=w;K.height=h}
  const k=K.getContext('2d');k.setTransform(1,0,0,1,0,0);k.globalCompositeOperation='source-over';k.clearRect(0,0,w,h);k.setTransform(q,0,0,q,0,0);
  const hpx=(proj(0,0,CV_WH)[1]-proj(0,0,0)[1])*Z;
  k.fillStyle='rgba(2,3,7,.975)';
  if((c.inn||0)>.02){k.globalAlpha=Math.min(1,c.inn);for(const s of [0,.25,.5,.75,1]){cvPath(k,c.m,hpx*s,0,true,0);k.fill()}k.globalAlpha=1}
  for(const s of [0,.3,.62,1]){cvPath(k,c.d,hpx*s,3,true,2);k.fill()}
  const a0=cvPr(0,0,0),a1=cvPr(1,0,0),a2=cvPr(0,1,0),u=(Math.hypot(a1[0]-a0[0],a1[1]-a0[1])+Math.hypot(a2[0]-a0[0],a2[1]-a0[1]))/2;
  k.globalCompositeOperation='destination-out';
  const light=(x,y,R,a)=>{const g=k.createRadialGradient(x,y,0,x,y,R);g.addColorStop(0,'rgba(0,0,0,'+a+')');g.addColorStop(.35,'rgba(0,0,0,'+(a*.72)+')');g.addColorStop(.7,'rgba(0,0,0,'+(a*.22)+')');g.addColorStop(1,'rgba(0,0,0,0)');k.fillStyle=g;k.fillRect(x-R,y-R,R*2,R*2)};
  const pp=cvPr(P.x,P.y,.9);
  const fl=1+Math.sin(time*11)*.04+Math.sin(time*5.3)*.03;
  let warm=[];
  light(pp[0],pp[1],u*3.2,.55);
  if(S.torchT>0){light(pp[0],pp[1],u*10.5*fl,1);warm.push([pp[0],pp[1],u*7*fl,.16])}
  for(const f of fires){if(!f.lit)continue;const fp=cvPr(f.x,f.y,.5);if(fp[0]<-300||fp[0]>W+300||fp[1]<-300||fp[1]>H+300)continue;light(fp[0],fp[1],u*8.5*fl,.95);warm.push([fp[0],fp[1],u*6*fl,.14])}
  const dl=clamp((1-night)*(1-(typeof rain==='number'?rain:0)*.35)+.05,0,1);
  const mo=c.mouth,dx=Math.cos(mo.a),dy=Math.sin(mo.a);
  for(let i=0;i<8;i++){const p=cvPr(mo.x-dx*i*3.2,mo.y-dy*i*3.2,.5);const f=1-i/8;light(p[0],p[1],u*(10-i*.9),dl*(.15+.85*f*f))}
  let beam=null;
  if(c.sky){const p=cvPr(c.sky.x,c.sky.y,.2);light(p[0],p[1],u*5.2,dl*.8);beam=[p[0],p[1]]}
  k.globalCompositeOperation='source-over';
  ctx.setTransform(DPR,0,0,DPR,0,0);ctx.globalCompositeOperation='source-over';
  ctx.drawImage(K,0,0,W,H);
  ctx.globalCompositeOperation='lighter';
  for(const wv of warm){const g=ctx.createRadialGradient(wv[0],wv[1],0,wv[0],wv[1],wv[2]);g.addColorStop(0,'rgba(255,150,60,'+wv[3]+')');g.addColorStop(1,'rgba(255,120,30,0)');ctx.fillStyle=g;ctx.fillRect(wv[0]-wv[2],wv[1]-wv[2],wv[2]*2,wv[2]*2)}
  ctx.globalCompositeOperation='source-over';
  const WT=[DPR*Z,0,0,DPR*Z,DPR*(W/2-CVc[0]*Z),DPR*(H/2-CVc[1]*Z)];ctx.setTransform(WT[0],WT[1],WT[2],WT[3],WT[4],WT[5]);
}
/* ---------- decor sprites ---------- */
{const _ds=drawStruct;drawStruct=function(o){
  if(o.kind!=='cdeco')return _ds.apply(this,arguments);
  const v=o.v|0,hs=HH/16;
  ctx.fillStyle='rgba(8,8,8,.3)';ctx.beginPath();ctx.ellipse(o.sx,o.sy+1,14,5*hs,0,0,TAU);ctx.fill();
  ctx.save();ctx.translate(o.sx,o.sy);ctx.lineJoin='round';ctx.lineWidth=2;ctx.strokeStyle='#15110e';
  if(v===0){ctx.beginPath();ctx.moveTo(-9,0);ctx.lineTo(-3,-30);ctx.lineTo(0,-38);ctx.lineTo(4,-28);ctx.lineTo(10,0);ctx.closePath();const g=ctx.createLinearGradient(-9,0,10,0);g.addColorStop(0,'#6a645a');g.addColorStop(1,'#34302b');ctx.fillStyle=g;ctx.fill();ctx.stroke()}
  else if(v===1){for(const r of [[-6,-3,9,5],[5,-4,8,5],[0,-9,6,4]]){ctx.beginPath();ctx.ellipse(r[0],r[1],r[2],r[3],0,0,TAU);ctx.fillStyle='#4f4a42';ctx.fill();ctx.stroke()}}
  else{ctx.beginPath();ctx.moveTo(-8,0);ctx.lineTo(-7,-50);ctx.lineTo(7,-50);ctx.lineTo(8,0);ctx.closePath();const g=ctx.createLinearGradient(-8,0,8,0);g.addColorStop(0,'#756e62');g.addColorStop(1,'#2f2b27');ctx.fillStyle=g;ctx.fill();ctx.stroke()}
  ctx.restore();
}}
