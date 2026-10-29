/* ===== v3u: wake up in a dark cave ===== */
SNAME.rockw='';
function caveRel(x,y){const c=S.cave,dx=x-c.x,dy=y-c.y,ca=Math.cos(c.a),sa=Math.sin(c.a);return{t:dx*ca+dy*sa,l:-dx*sa+dy*ca,r:Math.hypot(dx,dy)}}
const caveWind=t=>Math.sin(t*.2)*3;
function caveIn(x,y,m){if(!S.cave)return false;m=m||0;const q=caveRel(x,y);if(q.r<9.5+m)return true;return q.t>0&&q.t<S.cave.L+2&&Math.abs(q.l-caveWind(q.t))<4.2+m}
function caveClear(c){
  if(!S.cave||c.cvid===S.cave.id)return;c.cvid=S.cave.id;
  if(Math.hypot(c.cx*CS+CS/2-S.cave.x,c.cy*CS+CS/2-S.cave.y)>S.cave.L+CS*2)return;
  for(const o of c.objs){if(o.cut&&o.hide)continue;if(caveIn(o.x,o.y,1.6)){o.cut=true;o.cutAt=1e12;o.r=0;o.hide=true}}
}
function caveBuild(){
  let best=0,bs=-1;const L=34;
  for(let k=0;k<12;k++){const a=Math.random()*6.283;let sc=0;
    for(let t=0;t<=L+8;t+=2){const x=S.sx+Math.cos(a)*t,y=S.sy+Math.sin(a)*t;if(waterAt(x,y)!==0)sc-=3;else sc+=1}
    if(sc>bs){bs=sc;best=a}}
  S.cave={x:S.sx,y:S.sy,a:best,L:L,id:Math.random()+'',w:0,dk:1};
  const c=S.cave,ca=Math.cos(c.a),sa=Math.sin(c.a);
  const push=(x,y)=>structs.push({isStruct:true,kind:'rockw',x:x,y:y,r:1,key:0,ph:Math.random()*6.28,built:1,items:[],t:0,T:99,c:false,own:false,camp:1,hh:46+Math.random()*26});
  for(const off of [1.7,3.1])for(const sg of [-1,1])for(let t=-1;t<=L;t+=1.45){
    const l=caveWind(t)+sg*off;push(c.x+ca*t-sa*l,c.y+sa*t+ca*l)}
  for(const R of [7,8.6]){const n=Math.round(6.283*R/1.5);for(let i=0;i<n;i++){const an=i/n*6.283,dd=Math.atan2(Math.sin(an-c.a),Math.cos(an-c.a));
    if(Math.abs(dd)<.5)continue;push(c.x+Math.cos(an)*R,c.y+Math.sin(an)*R)}}
  for(const q of ['stick','stick','stick','fiber','fiber','fiber','resin','flint','flint','tinder','tinder','stone','stone','bone']){
    const an=Math.random()*6.283,rr=1.5+Math.random()*3.8;dropItem(q,1,c.x+Math.cos(an)*rr,c.y+Math.sin(an)*rr)}
  chunks.forEach(caveClear);
  for(let i=ents.length-1;i>=0;i--)if(caveIn(ents[i].x,ents[i].y,2))ents.splice(i,1);
  P.state='live';P.z=0;P.zv=0;P.x=c.x-ca*1.2;P.y=c.y-sa*1.2;cam.wx=P.x;cam.wy=P.y;P.face=c.a;
}
{const _ng=newGame;newGame=function(){S.cave=null;const r=_ng.apply(this,arguments);if(!Net.on||Net.role==='admin'){try{caveBuild()}catch(e){S.cave=null}}return r}}
{const _rs=restoreSnapshot;restoreSnapshot=function(d){const r=_rs.apply(this,arguments);const o=(d&&d.S)||{};if(!o.cave)S.cave=null;else{S.cave.w=99;S.cave.dk=0;chunks.forEach(caveClear)}return r}}
{const _g=getChunk;getChunk=function(cx,cy){const c=_g(cx,cy);if(S.cave)try{caveClear(c)}catch(e){}return c}}
{const _do=drawObj;drawObj=function(o){if(o.hide)return;return _do.apply(this,arguments)}}
{const _sm=spdMul;spdMul=function(){const r=_sm.apply(this,arguments);return(S.cave&&S.cave.w<5)?r*.4:r}}
var cvT=0,cvPur=0;
{const _u=update;update=function(dt){
  _u.apply(this,arguments);
  const c=S.cave;if(!c||!S.alive)return;
  c.w+=dt;
  const q=caveRel(P.x,P.y);let d=0;
  if(q.r<9.5)d=1;else if(q.t>0&&q.t<c.L+6&&Math.abs(q.l-caveWind(q.t))<6)d=1-clamp((q.t-c.L*.4)/(c.L*.6),0,1);
  c.dk+=(d-c.dk)*Math.min(1,dt*2.5);
  cvT-=dt;if(cvT<=0&&c.dk>.3){cvT=2.2+Math.random()*4;try{SFX.drip()}catch(e){}}
  if(c.w<1.4&&!c.hb){c.hb=1;try{SFX.heart&&SFX.heart()}catch(e){}}
  cvPur-=dt;if(cvPur<=0){cvPur=1;for(let i=ents.length-1;i>=0;i--){const e=ents[i];if(e.sp!=='hunter'&&caveIn(e.x,e.y,1))ents.splice(i,1)}}
}}
{const _r=render;render=function(dt){
  _r.apply(this,arguments);
  const c=S.cave;if(!c||!S.alive||P.state==='hidden')return;
  const dk=c.dk,wk=c.w<6;if(dk<.02&&!wk)return;
  ctx.setTransform(DPR,0,0,DPR,0,0);
  if(dk>.02){
    ctx.globalCompositeOperation='multiply';ctx.fillStyle='rgb('+(255-dk*150|0)+','+(255-dk*148|0)+','+(255-dk*135|0)+')';ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='source-over';
    let lt=1;if(S.torchT>0)lt=1.9;else if(fires.some(f=>f.lit&&Math.hypot(f.x-P.x,f.y-P.y)<9))lt=1.6;
    const R0=Math.min(W,H)*.2*lt*(1+Math.sin(time*9)*(lt>1?.03:0));
    const g=ctx.createRadialGradient(W/2,H*.52,R0*.2,W/2,H*.52,R0*2.3);
    g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.4,'rgba(0,0,0,'+(.42*dk).toFixed(3)+')');g.addColorStop(1,'rgba(0,0,0,'+(.985*dk).toFixed(3)+')');
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  }
  if(wk){const a=Math.pow(clamp(1-c.w/5.5,0,1),1.2)*(.8+.2*Math.sin(c.w*6));ctx.fillStyle='rgba(0,0,0,'+a.toFixed(3)+')';ctx.fillRect(0,0,W,H)}
}}
{const _ds=drawStruct;drawStruct=function(o){
  if(o.kind!=='rockw')return _ds.apply(this,arguments);
  const hs=HH/16,h=o.hh||55;
  ctx.save();ctx.translate(o.sx,o.sy);ctx.lineJoin='round';ctx.lineWidth=2.2;ctx.strokeStyle='#14110f';
  ctx.beginPath();ctx.moveTo(-26,2);ctx.lineTo(-23,-h*.6);ctx.lineTo(-14,-h);ctx.lineTo(-3,-h-6);ctx.lineTo(10,-h+2);ctx.lineTo(22,-h*.55);ctx.lineTo(26,2);
  ctx.quadraticCurveTo(0,13*hs,-26,2);ctx.closePath();
  const g=ctx.createLinearGradient(-26,0,26,0);g.addColorStop(0,'#4a4744');g.addColorStop(.55,'#35322f');g.addColorStop(1,'#222020');
  ctx.fillStyle=g;ctx.fill();ctx.stroke();
  ctx.strokeStyle='rgba(120,112,100,.25)';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-8,-6);ctx.lineTo(-6,-h*.7);ctx.moveTo(8,-4);ctx.lineTo(12,-h*.5);ctx.stroke();
  ctx.restore();
}}
