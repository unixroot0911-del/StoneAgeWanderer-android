/* ===== v3w: cave bear, carcass+vultures, wolf stalking, combat juice ===== */
SFX.snore=function(){N(K0,{d:1.5,f0:210,f1:80,type:'lowpass',g:.22,a:.6});O(K0,{d:1.4,f0:62,f1:48,type:'sine',g:.12,a:.5})};
SFX.caw=function(){const f=560+Math.random()*180;O(K0,{d:.22,f0:f,f1:f*.55,type:'sawtooth',g:.07,a:.01});N(K0,{d:.2,f0:1500,f1:900,type:'bandpass',q:2,g:.05})};
/* ---- bear sleeping in the cave (spawned lazily; far ents are culled) ---- */
{const _u0=update;update=function(dt){
  _u0.apply(this,arguments);
  const c=S.cave;if(!c||!c.ends||!c.ends[2]||c.bear===2||!S.alive)return;
  const e=c.ends[2],cb=ents.find(x=>x.cave);
  if(cb){cb.noticed=1;if(cb.dead){c.bear=2;return}return}
  if(c.bear===1)c.bear=0;
  if(Math.hypot(P.x-e[0],P.y-e[1])<40){mkEnt('bear',e[0]-1,e[1],{cave:1,cs:1,noticed:1,sleep:true,hx:e[0],hy:e[1],st:'idle'});c.bear=1;
    const cs=structs.find(s=>s.cid==='cv2');if(cs)cs.tier=1}
}}
{const _a=AI.bear;AI.bear=function(e,dt){
  if(e.cs){
    const pd=Math.hypot(e.x-P.x,e.y-P.y),R=P.speed>3.2?11:(P.stance===1?3:6);
    if(pd>R||!S.alive){halt(e,dt);e.sleep=true;e.st='idle';
      e.snT=(e.snT||0)-dt;if(e.snT<=0&&pd<18){e.snT=3+Math.random()*2;try{SFX.snore()}catch(x){}}return}
    e.cs=0;e.sleep=false;e.st='chase';e.stT=16;e.tgt='player';SFX.roar(e);shake=Math.max(shake,.9);return}
  return _a.apply(this,arguments)}}
/* ---- carcass with circling vultures ---- */
function evCarcass(){
  for(let t=0;t<14;t++){const a=Math.random()*6.283,r=34+Math.random()*16,x=P.x+Math.cos(a)*r,y=P.y+Math.sin(a)*r;
    if(waterAt(x,y)!==0||!freeSpot(x,y,1.5)||caveIn(x,y,4))continue;
    structs.push({isStruct:true,kind:'cache',v:3,cid:'cz'+(Math.random()*1e9|0),carc:1,tier:1,meat:1,x:x,y:y,r:.6,key:0,ph:Math.random()*6.28,built:1,items:[],t:0,T:99,c:false,own:false,camp:1});return true}
  return false}
{const _u=update;update=function(dt){
  _u.apply(this,arguments);
  if(!S.alive||P.state!=='live')return;
  let near=1e9;
  for(const s of structs){if(!s.carc||s.open)continue;const d=Math.hypot(s.x-P.x,s.y-P.y);near=Math.min(near,d);
    if(!s.g&&d<30){s.g=1;const r=Math.random();
      if(r<.4){for(let i=0;i<2;i++)mkEnt('wolf',s.x+(i?3:-3),s.y+2,{hx:s.x,hy:s.y})}
      else if(r<.6&&S.day>=3&&AN.sabertooth)mkEnt('sabertooth',s.x+3,s.y-3,{hx:s.x,hy:s.y})}}
  window.__cawT=(window.__cawT||0)-dt;if(near<55&&window.__cawT<=0){window.__cawT=2.5+Math.random()*3;try{SFX.caw()}catch(e){}}
  /* far carcass scheduler: piggyback on event timer */
  window.__crcT=(window.__crcT===undefined?160:window.__crcT)-dt;
  if(window.__crcT<=0){window.__crcT=240+Math.random()*180;if(S.age>200&&!(S.cave&&S.cave.dk>.3)&&structs.filter(s=>s.carc&&!s.open).length<2)evCarcass()}
}}
{const _r=render;render=function(dt){
  _r.apply(this,arguments);
  if(S.cave&&S.cave.dk>.3)return;
  const cp=proj(cam.wx,cam.wy,.9);
  for(const s of structs){if(!s.carc||s.open)continue;
    const p=proj(s.x,s.y,0),sx=(p[0]-cp[0])*Z+W/2,sy=(p[1]-cp[1])*Z+H/2;
    if(sx<-150||sx>W+150||sy<-250||sy>H+150)continue;
    ctx.setTransform(DPR,0,0,DPR,0,0);ctx.strokeStyle='rgba(18,14,12,.85)';ctx.lineWidth=2.2*Z;ctx.lineCap='round';
    for(let i=0;i<4;i++){const an=time*.5+i*1.57+s.ph,rx=(58+i*9)*Z,ry=(26+i*4)*Z,x=sx+Math.cos(an)*rx,y=sy-170*Z-i*14*Z+Math.sin(an)*ry,fl=Math.sin(time*3+i)*4*Z;
      ctx.beginPath();ctx.moveTo(x-10*Z,y+fl);ctx.quadraticCurveTo(x-4*Z,y-5*Z,x,y);ctx.quadraticCurveTo(x+4*Z,y-5*Z,x+10*Z,y+fl);ctx.stroke()}
  }
  const WT=[DPR*Z,0,0,DPR*Z,DPR*(W/2-cp[0]*Z),DPR*(H/2-cp[1]*Z)];ctx.setTransform(WT[0],WT[1],WT[2],WT[3],WT[4],WT[5]);
}}
/* ---- wolf stalking ---- */
function evStalk(){
  const a=Math.random()*6.283,n=3+((Math.random()*2)|0);let lead=null;
  for(let i=0;i<n;i++){const an=a+i*.5,x=P.x+Math.cos(an)*24,y=P.y+Math.sin(an)*24;if(waterAt(x,y)!==0)continue;
    const w=mkEnt('wolf',x,y,{noticed:1,stalk:{T:22+Math.random()*8,a:an,dir:Math.random()<.5?1:-1,howl:0}});if(!lead)lead=w;else w.leader=lead}
  if(lead)try{SFX.howl(lead)}catch(e){}
}
{const _a=AI.wolf;AI.wolf=function(e,dt){
  const s=e.stalk;if(s){
    s.T-=dt;s.a+=dt*.32*s.dir;
    if(scary(e.x,e.y,4)||S.torchT>0&&Math.hypot(e.x-P.x,e.y-P.y)<9){e.stalk=null;e.st='flee';e.stT=6;e.thr={x:P.x,y:P.y,d:2};return}
    if(s.T<=0||e.hp<e.max*.9){e.stalk=null;e.tgt='player';e.st='hunt';e.stT=14;e.sta=1;return}
    e.sleep=false;steer(e,P.x+Math.cos(s.a)*14,P.y+Math.sin(s.a)*14,3.6,dt,6);e.st='walk';
    s.howl-=dt;if(s.howl<=0){s.howl=7+Math.random()*6;try{SFX.howl(e)}catch(x){}}
    return}
  return _a.apply(this,arguments)}}
/* ---- combat juice ---- */
let HS=0;
{const _he=hurtEnt;hurtEnt=function(e,dmg,src,kx,ky){
  const hp0=e.hp;_he.apply(this,arguments);
  if(src==='player'){const kill=e.dead&&hp0>0;HS=Math.max(HS,kill?.1:(dmg>8?.055:.03));shake=Math.max(shake,kill?.6:.22);
    if(kill)for(let i=0;i<8;i++){const a=Math.random()*6.28;emit('puff',e.x,e.y,.4,{col:'rgba(190,50,45,.8)',size:4,vx:Math.cos(a)*2.4,vy:Math.sin(a)*2.4})}}
}}
{const _u3=update;update=function(dt){if(HS>0){HS-=dt;return _u3.call(this,dt*.08)}return _u3.apply(this,arguments)}}
let HV=0;
{const _hp=hitPlayer;hitPlayer=function(){const h0=S.hp;const r=_hp.apply(this,arguments);if(S.hp<h0){HV=1;shake=Math.max(shake,.5);HS=Math.max(HS,.05)}return r}}
{const _r=render;render=function(dt){
  _r.apply(this,arguments);
  if(HV>.02){HV=Math.max(0,HV-dt*1.6);ctx.setTransform(DPR,0,0,DPR,0,0);const g=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*.3,W/2,H/2,Math.max(W,H)*.75);g.addColorStop(0,'rgba(160,0,0,0)');g.addColorStop(1,'rgba(160,10,10,'+(.55*HV).toFixed(3)+')');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
}}
