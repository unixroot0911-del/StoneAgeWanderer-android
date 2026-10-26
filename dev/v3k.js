/* ===== v3k: living survival bars — ghost trail, hit flash, trend arrows, damage counter, threat chip ===== */
const BK={};
const BKEYS=['hp','food','water','warm','stam','energy'];
{const st=document.createElement('style');st.textContent=
'#stats{width:176px!important;gap:7px!important}.st i{height:13px!important;border-radius:7px!important;position:relative;overflow:hidden;box-shadow:0 1px 0 rgba(0,0,0,.5)}#s-hp i{height:18px!important}.st svg{width:19px!important;height:19px!important;filter:drop-shadow(0 1px 1px rgba(0,0,0,.7))}#s-hp svg{width:23px!important;height:23px!important}'
+'#s-energy{top:calc(env(safe-area-inset-top,0px) + 146px)!important;width:176px!important}#chips{top:calc(env(safe-area-inset-top,0px) + 206px)!important}'
+'.st i b{position:relative;z-index:2;transition:none!important}.st i u{position:absolute;left:0;top:0;bottom:0;z-index:1;background:linear-gradient(90deg,#ffe9a0,#fff7d2);opacity:.9;border-radius:7px;text-decoration:none}'
+'.st i::after{content:"";position:absolute;inset:0;z-index:3;border-radius:7px;background:linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,0) 55%,rgba(0,0,0,.18));pointer-events:none}'
+'.st.hit i{animation:bkhit .32s}@keyframes bkhit{0%{filter:brightness(2.4);transform:translateX(-3px)}30%{transform:translateX(3px)}60%{transform:translateX(-2px)}100%{filter:none;transform:none}}'
+'.st.gain i{animation:bkgain .5s}@keyframes bkgain{0%{filter:brightness(1.9) drop-shadow(0 0 5px #9dffb0)}100%{filter:none}}'
+'.st[data-lv="1"] svg{animation:bkpulse 1.4s infinite}.st[data-lv="2"] svg,.st[data-lv="3"] svg{animation:bkpulse .6s infinite}@keyframes bkpulse{50%{transform:scale(1.35)}}'
+'.st[data-lv="2"] i,.st[data-lv="3"] i{animation:bkglow .7s infinite alternate}@keyframes bkglow{from{box-shadow:0 0 0 1px rgba(255,60,40,.3)}to{box-shadow:0 0 12px 3px rgba(255,50,30,.95)}}'
+'.st s{text-decoration:none;font-size:12px;font-weight:700;min-width:12px;opacity:0;transition:opacity .25s}.st s.up{color:#8dff9a;opacity:1}.st s.dn{color:#ff6a58;opacity:1}'
+'#bkdmg{position:fixed;z-index:8;left:calc(env(safe-area-inset-left,0px) + 186px);top:calc(env(safe-area-inset-top,0px) + 8px);font:800 24px Rubik,sans-serif;color:#ff4a3a;text-shadow:0 2px 0 #300,0 0 10px rgba(255,60,40,.8);opacity:0;transition:opacity .4s;pointer-events:none}'
+'#bkthr{position:fixed;z-index:8;left:calc(env(safe-area-inset-left,0px) + 12px);top:calc(env(safe-area-inset-top,0px) + 176px);padding:4px 10px;border-radius:9px;font:700 13px Rubik,sans-serif;background:rgba(160,20,10,.85);color:#fff;border:1px solid #ff9a8a;display:none;pointer-events:none;animation:bkpulse2 .7s infinite alternate;direction:rtl}@keyframes bkpulse2{from{transform:scale(1)}to{transform:scale(1.08);box-shadow:0 0 14px #ff3a2a}}'
+'body.bkcrit::after{content:"";position:fixed;inset:0;z-index:5;pointer-events:none;box-shadow:inset 0 0 90px 24px rgba(200,0,0,.55);animation:bkcrit .8s infinite alternate}@keyframes bkcrit{from{opacity:.25}to{opacity:1}}'
+'body.inmenu #bkdmg,body.inmenu #bkthr{display:none!important}';
document.head.appendChild(st)}
const bkDmg=document.createElement('div');bkDmg.id='bkdmg';document.body.appendChild(bkDmg);
const bkThr=document.createElement('div');bkThr.id='bkthr';document.body.appendChild(bkThr);
function bkInit(){
  for(const k of BKEYS){const el=bars[k];if(!el||el.dataset.bk)continue;el.dataset.bk=1;
    const i=el.querySelector('i'),b=i.querySelector('b'),u=document.createElement('u');i.insertBefore(u,b);
    const ar=document.createElement('s');el.insertBefore(ar,i.nextSibling);
    BK[k]={el:el,b:b,u:u,ar:ar,v:null,g:null,gT:0,rate:0,prev:null,hitT:0}}
}
let bkAcc=0,bkDmgSum=0,bkDmgT=0,bkRateT=0,bkThrN=0,bkLastHp=null;
function bkFrame(dt){
  bkInit();if(!S.alive){document.body.classList.remove('bkcrit');return}
  const v=barV();
  bkRateT+=dt;
  for(const k of BKEYS){const o=BK[k];if(!o)continue;const x=clamp(v[k]===undefined?100:v[k],0,100);
    if(o.v===null){o.v=o.g=o.prev=x}
    const old=o.v;o.v+=(x-o.v)*Math.min(1,dt*(x<o.v?22:7));
    /* ghost trail: waits then chases */
    if(x<o.g){if(x<old-.2)o.gT=.65;o.gT-=dt;if(o.gT<=0)o.g=Math.max(x,o.g-dt*(18+(o.g-x)*.6))}else o.g=o.v;
    o.b.style.width=o.v.toFixed(1)+'%';o.u.style.width=Math.max(o.g,o.v).toFixed(1)+'%';
    if(bkRateT>=.4){o.rate=(x-o.prev)/bkRateT;
      const big=k==='hp'?.5:k==='stam'?4:.25;
      if(o.rate<-big){o.ar.textContent='▼';o.ar.className='dn'}else if(o.rate>big){o.ar.textContent='▲';o.ar.className='up'}else o.ar.className='';
      if(x<o.prev-(k==='hp'?1.2:k==='stam'?10:2)){o.el.classList.remove('hit');void o.el.offsetWidth;o.el.classList.add('hit')}
      else if(x>o.prev+(k==='hp'?3:k==='stam'?12:6)){o.el.classList.remove('gain');void o.el.offsetWidth;o.el.classList.add('gain')}
      if(k==='hp'&&x<o.prev-.5){bkDmgSum+=o.prev-x;bkDmgT=1.4}
      o.prev=x}
  }
  if(bkRateT>=.4)bkRateT=0;
  /* recent damage counter next to the heart */
  bkDmgT-=dt;if(bkDmgT>0&&bkDmgSum>=1){bkDmg.textContent='−'+Math.round(bkDmgSum);bkDmg.style.opacity=1}else{bkDmg.style.opacity=0;if(bkDmgT<=-.3)bkDmgSum=0}
  document.body.classList.toggle('bkcrit',S.hp<28);
}
/* threat chip: how many hunters have noticed you */
let bkTT=0;
function bkThreat(){
  let n=0,pred=0;
  for(const e of ents){if(e.dead||e.ally)continue;
    const hostile=e.sp==='wolf'||e.sp==='bear'||e.sp==='sabertooth'||e.sp==='boar'||e.sp==='snake';if(!hostile)continue;
    const d=Math.hypot(e.x-P.x,e.y-P.y);
    if(d<24&&(e.noticed||e.tgt==='player'||e.st==='hunt'||e.st==='chase'||e.st==='charge'||e.st==='rage')){n++;if(e.sp!=='boar'&&e.sp!=='snake')pred++}}
  if(n!==bkThrN){
    if(n>bkThrN&&n>=2){try{O(K0,{d:.7,f0:150,f1:105,type:'sawtooth',lp:700,g:.2,a:.05});O(K0,{d:.7,f0:158,f1:112,type:'sawtooth',lp:700,g:.12,a:.05})}catch(e){}}
    bkThrN=n}
  if(n>0){bkThr.style.display='block';bkThr.textContent=(n>=3?'⚠ خطر! ':'⚠ ')+n+(n===1?' مهاجم':' مهاجمين')+(n>=3?' — اهرب!':'');bkThr.style.background=n>=3?'rgba(190,10,0,.92)':'rgba(160,70,10,.88)'}
  else bkThr.style.display='none';
}
{const _u=update;update=function(dtRaw){const r=_u.apply(this,arguments);
  try{bkFrame(Math.min(dtRaw,.1));bkTT-=dtRaw;if(bkTT<=0){bkTT=.3;if(S.alive)bkThreat();else bkThr.style.display='none'}}catch(e){}
  return r}}
