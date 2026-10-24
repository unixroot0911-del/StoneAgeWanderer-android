/* ===== V3 (part C): sanity & horror, fog, new minimap, HUD ===== */
/* ---- sanity ---- */
function sanStep(dt){
  const dark=night>.5,nf=nearFireDist(),lit=nf!==null&&nf<=6;
  let dr=0;
  if(dark&&!lit&&!(S.torchT>0)&&!sheltered())dr+=.28*night;
  if(dark&&lit)dr-=.2;
  if(!dark)dr-=.12;
  if(S.hp<30)dr+=.08;if(S.warmth<25)dr+=.08;if(S.hunger<15||S.thirst<15)dr+=.08;
  let dead=0;for(const e of ents)if(e.dead&&!e.fish&&dist(e.x,e.y,P.x,P.y)<5){dead=1;break}
  if(dead)dr+=.1;
  if(sleeping)dr-=.5;
  if(Net.on)for(const q of Net.peers.values())if(q.st==='live'&&Math.hypot(q.rx-P.x,q.ry-P.y)<5){dr-=.2;break}
  S.san=clamp(S.san-dr*dt,0,100);
  if(S.san<=0){S.hp-=dt*.8;S.cause='sanity';if(S.hp<=0)die('sanity')}
}
{const _us=updSurvival;updSurvival=function(dt){if(S.alive&&P.state==='live'){sanStep(dt);shadeStep(dt)}return _us.apply(this,arguments)}}
/* sounds */
SFX.heart=function(){O(K0,{d:.16,f0:64,f1:40,g:.8});O(K0,{d:.2,f0:58,f1:36,g:.6,dl:.2})};
SFX.whisper=function(){N(K0,{d:1.1,f0:2600,f1:1500,q:3.5,g:.08,a:.35});N(K0,{d:.8,f0:3300,f1:2100,q:4,g:.05,a:.3,dl:.35})};
SFX.shade=function(){O(K0,{d:1.4,f0:70,f1:46,type:'sawtooth',lp:260,vib:[9,6],g:.22,a:.4});N(K0,{d:1.2,f0:900,f1:300,q:2,g:.12,a:.4})};
/* ---- the shade: a stalker that only moves when you are not looking ---- */
const SH={o:null,cool:90};
function shadeStep(dt){
  if(!S.alive||P.state!=='live'){SH.o=null;return}
  const nf=nearFireDist(),safe=(nf!==null&&nf<7)||S.torchT>0||sheltered();
  if(!SH.o){
    SH.cool-=dt;
    if(night>.6&&!safe&&SH.cool<=0&&S.age>200&&Math.random()<dt*.06*(1+(100-S.san)/45)){
      const a=Math.random()*6.2832,r=24+Math.random()*6;
      SH.o={isShade:true,x:P.x+Math.cos(a)*r,y:P.y+Math.sin(a)*r,life:0,a:0,ph:Math.random()*9,key:0,sx:0,sy:0,hit:0};
      SFX.shade();
    }
    return;
  }
  const o=SH.o;o.life+=dt;
  const dx=P.x-o.x,dy=P.y-o.y,d=Math.hypot(dx,dy)||1;
  const looked=Math.abs(angDiff(Math.atan2(o.y-P.y,o.x-P.x),P.face))<.95;
  if(night<.4||o.life>150||safe&&d>14||(Net.on&&false)){o.a-=dt*.6;if(o.a<=0){SH.o=null;SH.cool=70+Math.random()*120}return}
  o.a=Math.min(1,o.a+dt*.5);
  let sp=0;
  if(safe){sp=-3.2}else if(looked){sp=d>12?1:.15}else sp=d>8?5.4:3.4;
  o.x+=dx/d*sp*dt;o.y+=dy/d*sp*dt;
  if(d<20&&!safe)S.san=Math.max(0,S.san-dt*(.3+(20-d)*.1));
  if(d<14&&Math.random()<dt*.25)SFX.whisper();
  if(d<1.3&&!safe&&!o.hit){
    o.hit=1;hitPlayer(15,{x:o.x,y:o.y},'shade',P.x-o.x,P.y-o.y);S.san=Math.max(0,S.san-22);SFX.shade();shake=1;
    const a=Math.random()*6.2832;o.x=P.x+Math.cos(a)*18;o.y=P.y+Math.sin(a)*18;o.life=999;
  }
}
function shadeInject(all){
  const o=SH.o;if(!o||o.a<=.02)return;
  const p=proj(o.x,o.y,0);o.sx=p[0];o.sy=p[1];o.key=vkey(o.x,o.y);all.push(o);
}
function drawShade(o){
  const t=time,fl=.65+.35*Math.sin(t*23+o.ph)*Math.sin(t*7.1),jx=(Math.random()-.5)*(o.life>1?1.2:0);
  ctx.save();ctx.translate(o.sx+jx,o.sy);ctx.globalAlpha=Math.max(0,o.a*fl);
  const s=1.15;ctx.scale(s,s);
  ctx.fillStyle='rgba(2,2,6,1)';
  ctx.beginPath();ctx.ellipse(0,0,14,5,0,0,TAU);ctx.fill();
  ctx.beginPath();ctx.moveTo(-6,0);ctx.quadraticCurveTo(-9,-34,-4,-56);ctx.lineTo(4,-56);ctx.quadraticCurveTo(9,-34,6,0);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.ellipse(0,-62,6.5,8,0,0,TAU);ctx.fill();
  const sw=Math.sin(t*2+o.ph)*3;
  ctx.lineWidth=3;ctx.strokeStyle='rgba(2,2,6,1)';ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-5,-50);ctx.quadraticCurveTo(-18,-32+sw,-17,-6);ctx.moveTo(5,-50);ctx.quadraticCurveTo(18,-32-sw,17,-6);ctx.stroke();
  ctx.fillStyle='rgba(235,245,255,'+(.8*fl).toFixed(2)+')';ctx.beginPath();ctx.ellipse(-2.8,-63,1.6,2.6,0,0,TAU);ctx.ellipse(2.8,-63,1.6,2.6,0,0,TAU);ctx.fill();
  ctx.restore();
}
{const _do=drawObj;drawObj=function(o){if(o&&o.isShade){drawShade(o);return}return _do.apply(this,arguments)}}

/* ---- screen-space horror layer ---- */
const hz=document.createElement('canvas');hz.id='v3fx';
hz.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:6;pointer-events:none';document.body.appendChild(hz);
const hzg=hz.getContext('2d');
const fogEl=document.createElement('div');fogEl.id='v3fog';
fogEl.style.cssText='position:fixed;inset:0;z-index:5;pointer-events:none;opacity:0;background:radial-gradient(circle at 50% 55%,rgba(205,215,225,0) 14%,rgba(190,200,212,.88) 78%)';document.body.appendChild(fogEl);
let hzT=0,hzBeat=0,hzWhis=8,fogK=0,eyes=[];
function hzSize(){const w=Math.max(2,Math.round(innerWidth/3)),h=Math.max(2,Math.round(innerHeight/3));if(hz.width!==w||hz.height!==h){hz.width=w;hz.height=h}}
function horrorFx(dt){
  /* fog: autumn/winter mornings, wet nights, and dread */
  const morn=(tod<.38||tod>.9)?1:0;
  const goal=clamp((seas>=2?.5:.18)*morn+(night>.6&&S.san<60?.35:0)+rain*.18+(SH.o?.15:0),0,.8);
  fogK+=(goal-fogK)*Math.min(1,dt*.4);fogEl.style.opacity=(S.alive?fogK:0).toFixed(2);
  if(!S.alive||P.state==='hidden'){if(hzT<9){hzSize();hzg.clearRect(0,0,hz.width,hz.height);hzT=9}return}
  const san=S.san,shadeNear=SH.o?clamp(1-Math.hypot(SH.o.x-P.x,SH.o.y-P.y)/20,0,1):0;
  if(san<45){hzBeat-=dt;if(hzBeat<=0){hzBeat=.5+san/45*.9;SFX.heart()}}
  if(san<62){hzWhis-=dt;if(hzWhis<=0){hzWhis=6+Math.random()*10*(san/62+.3);SFX.whisper()}}
  hzT+=dt;if(hzT<.05)return;const k=hzT;hzT=0;
  hzSize();const w=hz.width,h=hz.height;hzg.clearRect(0,0,w,h);
  const lowSan=clamp((70-san)/70,0,1),cold=clamp((33.8-S.bt)/3,0,1),pul=.5+.5*Math.sin(time*(2+lowSan*5));
  const a=clamp(lowSan*.65+shadeNear*.4+cold*.25+(S.hp<30?.25*pul:0),0,.9);
  if(a>.02){
    const g=hzg.createRadialGradient(w/2,h/2,Math.min(w,h)*.22,w/2,h/2,Math.max(w,h)*.62);
    g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,(S.hp<30||shadeNear>.4?'rgba(40,0,0,':'rgba(0,0,12,')+(a*(.85+.15*pul)).toFixed(2)+')');
    hzg.fillStyle=g;hzg.fillRect(0,0,w,h);
  }
  if(S.bt>38.4){hzg.fillStyle='rgba(255,170,60,'+clamp((S.bt-38.4)/3,0,.4).toFixed(2)+')';hzg.fillRect(0,0,w,h)}
  /* phantom eyes in the dark */
  if(san<55&&night>.4&&Math.random()<k*(1.4*lowSan)){const e={x:Math.random()<.5?w*(.05+Math.random()*.25):w*(.7+Math.random()*.25),y:h*(.2+Math.random()*.6),life:0,max:.7+Math.random()*1.4,s:1.2+Math.random()*1.6};eyes.push(e);if(eyes.length>5)eyes.shift()}
  for(let i=eyes.length-1;i>=0;i--){const e=eyes[i];e.life+=k;if(e.life>e.max){eyes.splice(i,1);continue}
    const u=e.life/e.max,al=Math.sin(u*3.1416)*(.4+.5*Math.random());hzg.fillStyle='rgba(235,235,190,'+al.toFixed(2)+')';
    hzg.beginPath();hzg.ellipse(e.x-e.s*2,e.y,e.s*1.2,e.s*.7,0,0,6.2832);hzg.ellipse(e.x+e.s*2,e.y,e.s*1.2,e.s*.7,0,0,6.2832);hzg.fill()}
  /* hallucinated figure at the edge when almost mad */
  if(san<28&&Math.random()<k*.5){const x=Math.random()<.5?w*.04:w*.9,y=h*.7;hzg.fillStyle='rgba(0,0,0,.75)';hzg.beginPath();hzg.ellipse(x,y,w*.025,h*.28,0,0,6.2832);hzg.fill();hzg.beginPath();hzg.arc(x,y-h*.3,w*.03,0,6.2832);hzg.fill()}
}
{const _u=update;update=function(dtRaw){const r=_u.apply(this,arguments);try{horrorFx(Math.min(dtRaw,.1))}catch(e){}return r}}

/* ---- HUD: temperature, sanity, breath ---- */
{const c=$('clock'),d=document.createElement('div');d.id='v3st';
  d.innerHTML='<span id="v3t"></span><span class="v3b" id="v3san" title="العقل"><i></i></span><span class="v3b air" id="v3air" hidden title="النفَس"><i></i></span>';c.appendChild(d);
  const st=document.createElement('style');st.textContent='#v3st{display:flex;gap:8px;align-items:center;justify-content:center;margin-top:5px;font-size:11.5px;direction:rtl}#v3t{background:var(--ui-bg);border:1px solid var(--ui-line);padding:3px 9px;border-radius:999px;font-variant-numeric:tabular-nums}.v3b{width:54px;height:7px;border-radius:5px;background:rgba(0,0,0,.45);border:1px solid var(--ui-line);overflow:hidden;display:inline-block}.v3b i{display:block;height:100%;background:#9a7ad8;width:100%}.v3b.air i{background:#5ab8e8}';document.head.appendChild(st)}
let v3h=0;
{const _h=hud;hud=function(dt){_h.apply(this,arguments);v3h-=dt;if(v3h>0)return;v3h=.25;
  const t=$('v3t');if(!t)return;
  const col=S.bt<34.2?'#7ec8ff':S.bt>38.4?'#ff9a6a':'#e8e0cc';
  t.style.color=col;t.textContent='الجو '+Math.round(S.amb)+'° · جسمك '+S.bt.toFixed(1)+'°'+(S.wet>.5?' · مبلل':'');
  $('v3san').firstElementChild.style.width=clamp(S.san,0,100)+'%';
  const ar=$('v3air');ar.hidden=!(S.air<99.5);ar.firstElementChild.style.width=clamp(S.air,0,100)+'%';
}}

/* ---- minimap: cheap cached cells, explored-only, two sizes ---- */
const MMC=new Map(),MMS=3;let mmBig=false,mmKey='',mmLast=0;
const mmImg=document.createElement('canvas');
function mmColor(x,y){
  const t=tile(Math.floor(x),Math.floor(y));
  if(t.w){const d=wdep(x,y);return t.w===2?(d>1.6?[28,68,104]:[38,88,128]):[84,156,184]}
  if(snowK>.6)return[236,240,244];
  if(t.sand)return[222,202,144];
  const b=biome(x,y);
  if(b.rocky>.55)return[132,128,120];
  if(b.forest>.55)return[34,84,44];
  if(b.forest>.3)return[58,110,56];
  if(b.meadow>.4)return[150,190,84];
  return[96,150,70];
}
function mmReveal(){
  const pcx=Math.floor(P.x/MMS),pcy=Math.floor(P.y/MMS),R=13;let n=0;
  for(let r=0;r<=R&&n<160;r++)for(let j=-r;j<=r&&n<160;j++)for(let i=-r;i<=r;i++){
    if(Math.max(Math.abs(i),Math.abs(j))!==r)continue;
    const k=(pcx+i)+','+(pcy+j);if(MMC.has(k))continue;
    if(i*i+j*j>R*R)continue;
    MMC.set(k,mmColor((pcx+i+.5)*MMS,(pcy+j+.5)*MMS));n++;if(n>=160)break;
  }
}
function mapToggle(){mapOn=!mapOn;mm.hidden=!mapOn;if(mapOn){mmBig=false;mmSize();mmT=0;mapDraw()}}
function mmSize(){const css=mmBig?300:150,dpr=Math.min(2,window.devicePixelRatio||1);mm.style.width=mm.style.height=css+'px';mm.style.top=mmBig?'50%':'98px';mm.style.right=mmBig?'50%':'10px';mm.style.transform=mmBig?'translate(50%,-50%)':'none';mm.width=mm.height=Math.round(css*dpr);mmKey=''}
function mapClick(){if(!mmBig){mmBig=true;mmSize();mapDraw()}else{mapOn=false;mm.hidden=true}SFX.ui&&SFX.ui()}
function mapDraw(){
  if(!mapOn)return;
  const vis=S.alive&&P.state!=='hidden'&&$('splash').hidden;
  mm.hidden=!vis;if(!vis)return;
  mmReveal();
  const N=mmBig?54:34,pcx=Math.floor(P.x/MMS),pcy=Math.floor(P.y/MMS);
  mmImg.width=mmImg.height=N;
  const c=mmImg.getContext('2d'),im=c.createImageData(N,N),h=N>>1;
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){
    const col=MMC.get((pcx+i-h)+','+(pcy+j-h)),k=(j*N+i)*4;
    if(col){const sh=((i+j)&1)?0:6;im.data[k]=col[0]+sh;im.data[k+1]=col[1]+sh;im.data[k+2]=col[2]+sh}else{im.data[k]=34;im.data[k+1]=28;im.data[k+2]=22}
    im.data[k+3]=255}
  c.putImageData(im,0,0);
  const W=mm.width,sc=W/(N*MMS);
  mmg.clearRect(0,0,W,W);mmg.imageSmoothingEnabled=false;
  const ox=(P.x/MMS-pcx)*(W/N),oy=(P.y/MMS-pcy)*(W/N);
  mmg.drawImage(mmImg,-ox,-oy,W,W);
  const px=x=>W/2+(x-P.x)*sc,py=y=>W/2+(y-P.y)*sc,u=W/150;
  const dot=(x,y,r,col,ring)=>{const X=px(x),Y=py(y);if(X<2||Y<2||X>W-2||Y>W-2)return;mmg.beginPath();mmg.arc(X,Y,r*u,0,6.283);mmg.fillStyle=col;mmg.fill();if(ring){mmg.lineWidth=1.3*u;mmg.strokeStyle='#fff';mmg.stroke()}};
  for(const f of fires)dot(f.x,f.y,3,f.fuel>0?'#ff8a1c':'#7a5a3a');
  for(const q of structs)dot(q.x,q.y,q.kind==='shelter'?3.6:2.6,q.kind==='shelter'?'#d9a05a':'#5b3216');
  for(const q of ents)if(q.ally&&!q.dead)dot(q.x,q.y,3.4,'#d6453a',1);
  if(Net.on)for(const q of Net.peers.values())dot(q.rx,q.ry,4,q.col||'#4aa3d9',1);
  mmg.save();mmg.translate(W/2,W/2);mmg.rotate((P.face||0)+Math.PI/2);
  const a=6*u;mmg.beginPath();mmg.moveTo(0,-a*1.2);mmg.lineTo(a*.8,a);mmg.lineTo(0,a*.45);mmg.lineTo(-a*.8,a);mmg.closePath();
  mmg.fillStyle='#fff';mmg.fill();mmg.lineWidth=1.6*u;mmg.strokeStyle='#2b180d';mmg.stroke();mmg.restore();
  mmg.fillStyle='rgba(20,12,6,.85)';mmg.font='bold '+Math.round(11*u)+'px sans-serif';mmg.textAlign='center';mmg.fillText('N',W/2,12*u);
}
/* ---- new game resets ---- */
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);Object.assign(S,{bt:37,wet:0,san:100,air:100,inf:0,amb:12,bleedT:0});SH.o=null;SH.cool=90;MMC.clear();evK=0;evL=0;evT=300;eyes.length=0;return r}}
