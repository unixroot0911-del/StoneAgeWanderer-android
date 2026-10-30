/* ===== v3v: ambient events: storms, tremors, stampedes, meteors ===== */
SFX.thunder=function(){N(K0,{d:3.4,f0:460,f1:55,type:'lowpass',q:.8,g:.6,a:.06});N(K0,{d:1.5,f0:200,f1:45,type:'lowpass',g:.45,a:.02})};
SFX.rumble=function(){N(K0,{d:2.8,f0:150,f1:48,type:'lowpass',g:.5,a:.5});O(K0,{d:2.8,f0:46,f1:32,type:'sine',g:.4,a:.4})};
SFX.meteor=function(){N(K0,{d:1.6,f0:3200,f1:900,type:'bandpass',q:2,g:.12,a:.3})};
const EV={t:200,flash:0,fT:12,thr:[],met:[]};
const evOK=()=>S.alive&&P.state==='live'&&!sleeping&&!(S.cave&&S.cave.dk>.3);
function evTremor(){
  shake=Math.max(shake,1.3);SFX.rumble();
  for(let i=0;i<18;i++){const a=Math.random()*6.28,r=1+Math.random()*7;emit('puff',P.x+Math.cos(a)*r,P.y+Math.sin(a)*r,.2,{col:'rgba(150,130,100,.7)',size:7,vx:0,vy:0})}
  setTimeout(()=>{if(!evOK())return;const n=2+((Math.random()*3)|0);for(let i=0;i<n;i++){const a=Math.random()*6.28,r=3+Math.random()*5,x=P.x+Math.cos(a)*r,y=P.y+Math.sin(a)*r;if(waterAt(x,y)===0)scatter(Math.random()<.3?'flint':'stone',1,x,y)}},1600);
}
function evStampede(){
  const sp=Math.random()<.65?'deer':'boar',a=Math.random()*6.28,dx=Math.cos(a),dy=Math.sin(a),px=-dy,py=dx,n=6+((Math.random()*4)|0);
  const sx=P.x-dx*25+px*(Math.random()*14-7),sy=P.y-dy*25+py*(Math.random()*14-7);
  for(let i=0;i<n;i++){const x=sx+px*(i%4)*2.2-dx*Math.floor(i/4)*2.5,y=sy+py*(i%4)*2.2-dy*Math.floor(i/4)*2.5;
    if(waterAt(x,y)!==0)continue;const e=mkEnt(sp,x,y,{});e.stamp={dx:dx,dy:dy,T:11}}
  SFX.rumble();
}
for(const sp of ['deer','boar']){const _a=AI[sp];if(_a)AI[sp]=function(e,dt){
  if(e.stamp){e.stamp.T-=dt;if(e.stamp.T<=0)e.stamp=null;else{e.sleep=false;steer(e,e.x+e.stamp.dx*10,e.y+e.stamp.dy*10,7.6,dt,10);e.stamp.T-=0;e.st='flee';return}}
  return _a.apply(this,arguments)}}
function evMeteors(){
  SFX.meteor();const n=3+((Math.random()*4)|0);
  for(let i=0;i<n;i++)setTimeout(()=>{EV.met.push({x:Math.random()*.7+.1,y:Math.random()*.3,vx:.5+Math.random()*.4,vy:.25+Math.random()*.2,l:1})},i*350+Math.random()*300);
}
{const _u=update;update=function(dt){
  _u.apply(this,arguments);
  if(!evOK()){return}
  const rn=typeof rain==='number'?rain:0;
  if(rn>.35){EV.fT-=dt;if(EV.fT<=0){EV.fT=7+Math.random()*18;EV.flash=1;setTimeout(()=>{try{SFX.thunder()}catch(e){}},400+Math.random()*2600)}}
  EV.flash=Math.max(0,EV.flash-dt*2.2);
  if(rn>.5){EV.sT=(EV.sT===undefined?50:EV.sT)-dt;if(EV.sT<=0){EV.sT=40+Math.random()*50;evStrike()}}
  if(S.age<240)return;
  EV.t-=dt;if(EV.t>0)return;EV.t=Math.max(55,115-S.day*3)+Math.random()*Math.max(60,130-S.day*3);
  const r=Math.random();
  if(night>.3&&night<.9&&r<.5&&typeof evStalk==='function')evStalk();
  else if(night>.75&&r<.4)evMeteors();
  else if(r<.4)evTremor();
  else if(night<.5&&r<.8)evStampede();
  else evTremor();
  /* trample */
}}
{const _u2=update;update=function(dt){
  _u2.apply(this,arguments);
  if(!S.alive)return;
  for(const e of ents)if(e.stamp&&!e.dead&&Math.abs(e.x-P.x)<1&&Math.abs(e.y-P.y)<1&&Math.hypot(e.x-P.x,e.y-P.y)<.9){hitPlayer(10,e,'trample',e.x,e.y);break}
}}
{const _r=render;render=function(dt){
  _r.apply(this,arguments);
  if(S.cave&&S.cave.dk>.3)return;
  ctx.setTransform(DPR,0,0,DPR,0,0);
  if(EV.flash>.02){ctx.fillStyle='rgba(235,240,255,'+(Math.min(.8,EV.flash*.8)*(Math.random()<.5?1:.7)).toFixed(3)+')';ctx.fillRect(0,0,W,H)}
  for(let i=EV.met.length-1;i>=0;i--){const m=EV.met[i];m.x+=m.vx*dt*1.1;m.y+=m.vy*dt*1.1;m.l-=dt*.9;if(m.l<=0){EV.met.splice(i,1);continue}
    const x=m.x*W,y=m.y*H,g=ctx.createLinearGradient(x,y,x-m.vx*W*.22,y-m.vy*H*.22);g.addColorStop(0,'rgba(255,250,230,'+m.l+')');g.addColorStop(1,'rgba(255,250,230,0)');
    ctx.strokeStyle=g;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-m.vx*W*.22,y-m.vy*H*.22);ctx.stroke()}
}}

function evStrike(){
  const a=Math.random()*6.283,r=5+Math.random()*9,x=P.x+Math.cos(a)*r,y=P.y+Math.sin(a)*r;
  EV.flash=1.2;shake=Math.max(shake,.7);try{SFX.thunder()}catch(e){}
  if(waterAt(x,y)!==0)return;
  if(Math.hypot(x-P.x,y-P.y)<1.6)hitPlayer(25,null,'lightning',0,0);
  fires.push({isFire:true,x:x,y:y,fuel:35,ph:Math.random()*6.28,cook:[],key:0,smk:0,lit:true,age:0,own:true});
  for(let i=0;i<14;i++){const b=Math.random()*6.28;emit('puff',x,y,.3,{col:'rgba(255,230,160,.85)',size:5,vx:Math.cos(b)*3,vy:Math.sin(b)*3})}
}
