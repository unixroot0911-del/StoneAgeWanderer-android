/* ===== v3q: the hunter tribe — camps, watchers, spear throwers, torch raids, night dread ===== */
AN.hunter={hp:44,r:.4,ref:4.6,cad:10,sh:[11,4],eyes:[6,-42],loot:[['bone',2,.8],['hide',1,.6],['flint',1,.5],['rope',1,.4],['spear',1,.3]]};
if(IT.torch)AN.hunter.loot.push(['torch',1,.35]);
ARN.hunter='صيّاد';ENTK.hunter='H';ENTL.H='hunter';
XP_SRC.hunter=60;

/* ---- sounds ---- */
SFX.drum=function(src){const k=spat(src);if(!k)return;O(k,{d:.42,f0:120,f1:58,type:'sine',g:.6,a:.004});N(k,{d:.07,f0:260,f1:120,type:'lowpass',q:1,g:.15,a:.002})};
SFX.hcall=function(src){const k=spat(src);if(!k)return;O(k,{d:.9,f0:420,f1:760,type:'triangle',g:.16,a:.12,vib:[9,30]});N(k,{d:.5,f0:1800,f1:900,type:'bandpass',q:3,g:.05,a:.1})};
SFX.snap=function(src){const k=spat(src);if(!k)return;N(k,{d:.06,f0:2600,f1:1200,type:'bandpass',q:2,g:.35,a:.001});N(k,{d:.12,f0:900,f1:300,type:'lowpass',q:1,g:.12,a:.002,dl:.05})};

/* ---- camps (persisted in S.camps) ---- */
const campKey=c=>c.cx+','+c.cy;
function campMake(c,key){
  const h=(Math.imul(c.cx,73856093)^Math.imul(c.cy,19349663))>>>0,rnd=mulberry(h);
  for(let t=0;t<14;t++){
    const x=c.cx*CS+4+rnd()*(CS-8),y=c.cy*CS+4+rnd()*(CS-8);
    if(waterAt(x,y)!==0||!freeSpot(x,y,1.4))continue;
    const camp={x:x,y:y,left:3,clr:0,raid:0};
    fires.push({isFire:true,x:x,y:y,fuel:99999,ph:rnd()*6.28,cook:[],key:0,smk:0,lit:true,age:100,used:true,own:false,camp:1});
    for(let i=0;i<2;i++){const a=rnd()*6.28+i*3.1,sx=x+Math.cos(a)*3.8,sy=y+Math.sin(a)*3.8;
      if(waterAt(sx,sy)===0&&freeSpot(sx,sy,1))structs.push({isStruct:true,kind:'shelter',x:sx,y:sy,r:1.15,key:0,ph:rnd()*6.28,built:1,items:[],t:0,T:99,c:false,own:false,camp:1})}
    S.camps[key]=camp;return camp;
  }
  S.camps[key]=null;return null;
}
function campSpawn(camp,key,c){
  const n=camp.left;
  for(let i=0;i<n;i++){
    const a=Math.random()*6.28,r=1.5+Math.random()*3,x=camp.x+Math.cos(a)*r,y=camp.y+Math.sin(a)*r;
    if(!freeSpot(x,y,.5))continue;
    const e=mkEnt('hunter',x,y,{ckey:key,chx:camp.x,chy:camp.y,hx:camp.x,hy:camp.y,mode:'camp',mT:0,role:i%2,cd:1+Math.random()*2});
    if(c){e.ck=c;c.alive++}
  }
}
{const _p=populate;populate=function(c){
  _p.apply(this,arguments);
  try{
    if(Net.on&&Net.role!=='admin')return;
    if(!S.camps)S.camps={};
    const h=(Math.imul(c.cx,73856093)^Math.imul(c.cy,19349663))>>>0;
    if(h%1000>=26)return;
    const mx=c.cx*CS+CS/2,my=c.cy*CS+CS/2;
    if(dist(mx,my,S.sx,S.sy)<130||ents.length>QUAL.ents+8)return;
    const key=campKey(c);let camp=S.camps[key];
    if(camp===undefined)camp=campMake(c,key);
    if(!camp)return;
    if(camp.left<=0){if(S.day-camp.clr>=4)camp.left=3;else return}
    if(dist(camp.x,camp.y,P.x,P.y)<22)return;
    if(ents.some(e=>e.sp==='hunter'&&e.ckey===key&&!e.dead))return;
    campSpawn(camp,key,c);
  }catch(e){}
}}
{const _ng=newGame;newGame=function(){S.camps={};return _ng.apply(this,arguments)}}
{const _rs=restoreSnapshot;restoreSnapshot=function(d){const r=_rs.apply(this,arguments);if(!S.camps||!(d&&d.S&&d.S.camps))S.camps=(d&&d.S&&d.S.camps)||{};return r}}
{const _kl=killEnt;killEnt=function(e,src){
  if(e.sp==='hunter'&&S.camps&&S.camps[e.ckey]){const c=S.camps[e.ckey];c.left=Math.max(0,c.left-1);if(c.left===0)c.clr=S.day}
  return _kl.apply(this,arguments)}}
{const _he=hurtEnt;hurtEnt=function(e,dmg,src,kx,ky){
  if(e&&e.sp==='hunter'&&!e.dead&&src==='player')hAlert(e,'hunt');
  return _he.apply(this,arguments)}}

/* ---- brain ---- */
const hMates=e=>ents.filter(o=>o!==e&&o.sp==='hunter'&&!o.dead&&o.ckey===e.ckey);
function hAlert(e,mode){
  e.mode=mode;e.mT=mode==='hunt'?25:7+Math.random()*5;e.sleep=false;
  for(const o of hMates(e))if(o.mode==='camp'||o.mode==='raid'||(mode==='hunt'&&o.mode==='watch')){o.mode=mode;o.mT=mode==='hunt'?25:7+Math.random()*5;o.sleep=false}
}
function hThrow(e){
  const t=Math.max(.2,dist(e.x,e.y,P.x,P.y)/13),tx=P.x+(P.vx||0)*t*.7,ty=P.y+(P.vy||0)*t*.7,a=Math.atan2(ty-e.y,tx-e.x);
  arrows.push({isArrow:true,enemy:1,x:e.x+Math.cos(a)*.5,y:e.y+Math.sin(a)*.5,z:1.25,vx:Math.cos(a)*13,vy:Math.sin(a)*13,t:0,key:0});
  e.cd=5+Math.random()*2.5;e.cast=.5;SFX.bow&&SFX.bow();
}
AI.hunter=function(e,dt){
  const alive=S.alive&&P.state==='live',pd=dist(e.x,e.y,P.x,P.y);
  e.mT-=dt;e.cd=Math.max(0,e.cd-dt);e.cast=Math.max(0,(e.cast||0)-dt);
  if(!e.mode)e.mode='camp';
  if(e.hp<e.max*.3&&e.mode!=='flee'){e.mode='flee';e.mT=9;e.thr={x:P.x,y:P.y};e.st='flee'}
  if(e.mode==='flee'){awayFrom(e,e.thr.x,e.thr.y,5,dt,Math.sin(e.ph)*.3);if(e.mT<=0){e.mode='camp';e.st='idle'}return}
  /* melee / throw wind-up */
  if(e.windup>0){
    e.windup-=dt;halt(e,dt);e.face+=angDiff(Math.atan2(P.y-e.y,P.x-e.x),e.face)*Math.min(1,dt*12);
    if(e.windup<=0){
      if(e.role===1&&pd>3.2)hThrow(e);
      else if(pd<2.5&&alive){hitPlayer(12,e,'hunter',P.x-e.x,P.y-e.y);if(Math.random()<.4)S.bleed=Math.max(S.bleed,12);e.cd=2.5;e.cast=.5}
      else e.cd=.8;
    }
    return;
  }
  /* senses */
  if((e.sn-=dt)<=0){
    e.sn=.4;
    if(alive&&(e.mode==='camp'||e.mode==='raid')){
      const rad=(e.sleep?5:(night>.5?15:22))*(P.speed>3.2?1.3:P.speed<.6?.75:1);
      if(pd<rad){hAlert(e,'watch');SFX.hcall(e)}
    }
  }
  if(!alive&&e.mode!=='camp'){e.mode='camp'}
  e.st=(e.mode==='hunt'||e.mode==='watch')?'hunt':e.st;
  switch(e.mode){
    case'raid':{
      if(e.mT<=0){e.mode='camp';return}
      const d=steer(e,P.x,P.y,2.6,dt,4);if(d<14){e.sn=0}
      return;
    }
    case'watch':{
      e.face+=angDiff(Math.atan2(P.y-e.y,P.x-e.x),e.face)*Math.min(1,dt*6);
      if(pd<5){hAlert(e,'hunt');return}
      if(pd<8)awayFrom(e,P.x,P.y,2.4,dt,0);
      else if(pd>13)steer(e,P.x,P.y,1.9,dt,4);
      else{const a=Math.atan2(e.y-P.y,e.x-P.x)+.5*(e.role?1:-1);steer(e,P.x+Math.cos(a)*10,P.y+Math.sin(a)*10,1.7,dt,4)}
      if(e.mT<=0){if(pd<20&&alive)hAlert(e,'hunt');else{e.mode='camp';e.st='idle'}}
      return;
    }
    case'hunt':{
      if(!alive||e.mT<=0||pd>36){e.mode='camp';e.st='idle';return}
      if(hMates(e).length===0&&e.hp<e.max*.6){e.mode='flee';e.mT=8;e.thr={x:P.x,y:P.y};return}
      if(e.role===1){
        if(pd>10)steer(e,P.x,P.y,4,dt,6);else if(pd<6)awayFrom(e,P.x,P.y,3.2,dt,0);else halt(e,dt);
        if(e.cd<=0&&pd<14){e.windup=.6;halt(e,dt);SFX.hcall(e)}
      }else{
        const a=Math.atan2(e.y-P.y,e.x-P.x)+(e.nid%2?.6:-.6)*clamp((pd-3)/8,0,1);
        steer(e,P.x+Math.cos(a)*1.3,P.y+Math.sin(a)*1.3,4.3,dt,6);
        if(pd<1.9&&e.cd<=0){e.windup=.45;halt(e,dt)}
      }
      return;
    }
    default:{ /* camp life */
      if(night>.7&&e.role===0&&pd>14){halt(e,dt);e.sleep=true;return}
      e.sleep=false;e.hx=e.chx;e.hy=e.chy;
      wander(e,dt,5,1.4,2,6);
    }
  }
};

/* ---- art ---- */
DR.hunter=function(e,sw,m,g){
  const sk='#b98558',sd='#8f6540',cl='#6b4a2a',hunting=(e.mode==='hunt'||e.mode==='watch');
  limb2(-3,-17,-3-sw*7,0,3.8,sd);limb2(3,-17,3+sw*7,0,3.8,sk);
  bean(0,-26,6.2,9.5,sk);bean(0,-17,7,3.4,cl);
  limb2(-1,-31,-6-sw*3,-21,3,sd);
  const hy=-42+g*2;bean(2,hy,5.4,5.6,sk);bean(-.5,hy-4.4,6,3.2,'#241810');
  ctx.strokeStyle='#f2ead2';ctx.lineWidth=1.3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(3,hy-1);ctx.lineTo(8,hy+1);ctx.moveTo(3,hy+2.5);ctx.lineTo(7,hy+4);ctx.stroke();
  ctx.fillStyle='#1b1008';ctx.beginPath();ctx.arc(6,hy-1.6,.9,0,TAU);ctx.fill();
  /* front arm + spear */
  let hx=6,hy2=-26,x0=6,y0=2,x1=9,y1=-58;
  if(e.windup>0){hx=-4;hy2=-34;x0=-12;y0=-26;x1=16;y1=-50}
  else if(e.cast>0||(e.cd>1.3&&hunting)){hx=14;hy2=-30;x0=0;y0=-28;x1=34;y1=-31}
  else if(hunting){hx=9;hy2=-28;x0=0;y0=-18;x1=26;y1=-44}
  limb2(1,-31,hx,hy2,3.2,sk);
  ctx.strokeStyle=OL2;ctx.lineWidth=4.2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.strokeStyle='#a9803f';ctx.lineWidth=2.2;ctx.stroke();
  const ang=Math.atan2(y1-y0,x1-x0);tri(x1+Math.cos(ang)*7,y1+Math.sin(ang)*7,x1+Math.cos(ang+1.9)*3,y1+Math.sin(ang+1.9)*3,x1+Math.cos(ang-1.9)*3,y1+Math.sin(ang-1.9)*3,'#cfc6b0');
  if(night>.45&&!e.sleep){
    const fx=-8,fy=-30;limb2(-4,-30,fx,fy,2.6,sd);ctx.strokeStyle=OL2;ctx.lineWidth=3.6;ctx.beginPath();ctx.moveTo(fx,fy+2);ctx.lineTo(fx-1,fy-10);ctx.stroke();ctx.strokeStyle='#8a5a2e';ctx.lineWidth=2;ctx.stroke();
    const fl=.8+.2*Math.sin(time*19+e.ph);ctx.fillStyle='rgba(255,150,40,.9)';ctx.beginPath();ctx.ellipse(fx-1,fy-14,3*fl,5.5*fl,0,0,TAU);ctx.fill();ctx.fillStyle='rgba(255,230,140,.95)';ctx.beginPath();ctx.ellipse(fx-1,fy-13,1.5,3,0,0,TAU);ctx.fill();
  }
};
{const _nl=netLights;netLights=function(add){
  _nl.apply(this,arguments);
  for(const e of ents)if(e.sp==='hunter'&&!e.dead&&night>.45&&!e.sleep&&Math.abs(e.x-P.x)<40&&Math.abs(e.y-P.y)<40)add(e.x,e.y,1.3,3.8,'255,170,80',.7*(.9+.1*Math.sin(time*21+e.ph)));
}}
/* thrown spears */
{const _ua=updArrows;updArrows=function(dt){
  const en=[];for(let i=arrows.length-1;i>=0;i--)if(arrows[i].enemy)en.push(arrows.splice(i,1)[0]);
  _ua.apply(this,arguments);
  for(const a of en){
    a.t+=dt;a.x+=a.vx*dt;a.y+=a.vy*dt;a.z-=dt*.45;let stop=false;
    if(S.alive&&P.state==='live'&&dist(a.x,a.y,P.x,P.y)<.6&&Math.abs((P.z||0)+1-a.z)<1.4){hitPlayer(11,{x:a.x-a.vx,y:a.y-a.vy,sp:'hunter'},'hunter',a.vx,a.vy);stop=true}
    if(a.z<=0||a.t>1.7)stop=true;
    if(!stop)nearObjs(a.x,a.y,1.4,o=>{if(!stop&&(o.k===1||o.k===2)&&!o.cut&&dist(o.x,o.y,a.x,a.y)<o.r+.1)stop=true});
    if(!stop)arrows.push(a);
  }
}}
{const _da=drawArrow;drawArrow=function(a){if(!a.enemy)return _da.apply(this,arguments);const vx=a.vx,vy=a.vy;a.vx*=2.6;a.vy*=2.6;_da(a);a.vx=vx;a.vy=vy}}

/* ---- the tribe's night: drums, raids, and things in the dark ---- */
const HR={drT:0,raidT:5,dreadT:12};
function hRaid(key,camp){
  const ang0=Math.atan2(camp.y-P.y,camp.x-P.x);let made=0;
  for(let t=0;t<16&&made<2;t++){
    const a=ang0+(Math.random()-.5)*1.0,r=27+Math.random()*2,x=P.x+Math.cos(a)*r,y=P.y+Math.sin(a)*r;
    if(waterAt(x,y)!==0||!freeSpot(x,y,.5))continue;
    mkEnt('hunter',x,y,{ckey:key,chx:camp.x,chy:camp.y,mode:'raid',mT:130,role:made%2,cd:2});made++;
  }
  if(made)camp.raid=S.day;
}
{const _u=update;update=function(dt){
  const r=_u.apply(this,arguments);
  try{
    if(!S.alive||P.state!=='live'||!S.camps)return r;
    const solo=!Net.on||Net.role==='admin';
    HR.drT-=dt;
    if(HR.drT<=0){
      let act=false;
      if(night>.35)for(const k in S.camps){const c=S.camps[k];if(c&&c.left>0&&dist(c.x,c.y,P.x,P.y)<80){act=true;SFX.drum({x:c.x,y:c.y});setTimeout(()=>SFX.drum({x:c.x,y:c.y}),240)}}
      HR.drT=ents.some(e=>e.sp==='hunter'&&e.mode==='raid')?1.1:(act?2.6:3)
    }
    HR.raidT-=dt;
    if(solo&&HR.raidT<=0){
      HR.raidT=6;
      if(night>.6&&S.day>=3){
        const base=fires.some(f=>!f.camp&&f.fuel>0&&dist(f.x,f.y,P.x,P.y)<14)||S.torchT>0;
        if(base)for(const k in S.camps){const c=S.camps[k];if(c&&c.left>=2&&c.raid!==S.day&&dist(c.x,c.y,P.x,P.y)<95&&dist(c.x,c.y,P.x,P.y)>50&&Math.random()<.5){hRaid(k,c);break}}
      }
    }
    /* things in the dark: a snapped branch, out of sight */
    HR.dreadT-=dt;
    if(HR.dreadT<=0){HR.dreadT=14+Math.random()*18;if(night>.6&&!scary(P.x,P.y,7)){const a=Math.random()*6.28,d=11+Math.random()*9;SFX.snap({x:P.x+Math.cos(a)*d,y:P.y+Math.sin(a)*d})}}
  }catch(e){}
  return r}}
