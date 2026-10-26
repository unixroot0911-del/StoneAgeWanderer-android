/* ===== v3j: cinematic title splash + loading screen ===== */
const V3A={stars:[],sparks:[],t0:performance.now()};
for(let i=0;i<110;i++)V3A.stars.push([Math.random(),Math.random()*.55,Math.random()*6.28,.4+Math.random()*.9]);
function v3ridge(g,w,h,base,amp,seed,off,col,u){
  g.beginPath();g.moveTo(0,h);
  for(let x=0;x<=w+8;x+=8){
    const X=x+off,y=base-amp*(.55*Math.sin(X*.004+seed)+.3*Math.sin(X*.011+seed*2.1)+.15*Math.sin(X*.029+seed*3.7))-amp*.3;
    g.lineTo(x,y)}
  g.lineTo(w,h);g.closePath();g.fillStyle=col;g.fill();
}
function v3conifer(g,x,y,s,col){
  g.fillStyle=col;g.beginPath();g.moveTo(x-s*.07,y);g.lineTo(x-s*.07,y-s*.25);
  for(let i=0;i<5;i++){const yy=y-s*(.2+i*.17),ww=s*(.34-i*.06);g.lineTo(x-ww,yy);g.lineTo(x-ww*.45,yy-s*.05)}
  g.lineTo(x,y-s*1.08);
  for(let i=4;i>=0;i--){const yy=y-s*(.2+i*.17),ww=s*(.34-i*.06);g.lineTo(x+ww*.45,yy-s*.05);g.lineTo(x+ww,yy)}
  g.lineTo(x+s*.07,y-s*.25);g.lineTo(x+s*.07,y);g.closePath();g.fill();
}
function v3mammoth(g,x,y,s,t,col){
  const w=Math.sin(t*2.2)*s*.04;g.fillStyle=col;g.strokeStyle=col;g.lineCap='round';
  /* legs */
  g.lineWidth=s*.11;[[-.22,0],[-.1,Math.PI],[.12,.6],[.24,Math.PI+.6]].forEach(l=>{const ph=Math.sin(t*2.2+l[1]);g.beginPath();g.moveTo(x+l[0]*s,y-s*.3);g.lineTo(x+l[0]*s+ph*s*.06,y)  ;g.stroke()});
  /* body */
  g.beginPath();g.ellipse(x,y-s*.45+w,s*.38,s*.26,0,0,6.2832);g.fill();
  g.beginPath();g.ellipse(x+s*.34,y-s*.6+w,s*.24,s*.26,0,0,6.2832);g.fill();
  /* hump + fur */
  g.beginPath();g.moveTo(x+s*.1,y-s*.7);g.quadraticCurveTo(x+s*.3,y-s*.98,x+s*.5,y-s*.72);g.fill();
  /* trunk + tusk */
  g.lineWidth=s*.09;g.beginPath();g.moveTo(x+s*.52,y-s*.55+w);g.quadraticCurveTo(x+s*.66,y-s*.25,x+s*.58+Math.sin(t*1.3)*s*.04,y-s*.1);g.stroke();
  g.lineWidth=s*.035;g.beginPath();g.moveTo(x+s*.48,y-s*.5+w);g.quadraticCurveTo(x+s*.72,y-s*.42,x+s*.7,y-s*.7);g.stroke();
  /* tail */
  g.lineWidth=s*.03;g.beginPath();g.moveTo(x-s*.38,y-s*.55);g.quadraticCurveTo(x-s*.5,y-s*.4,x-s*.46,y-s*.25+Math.sin(t*3)*s*.03);g.stroke();
}
function v3wanderer(g,x,y,s,col,t){
  g.fillStyle=col;g.strokeStyle=col;g.lineCap='round';
  g.beginPath();g.arc(x,y-s*.82,s*.11,0,6.2832);g.fill();                          /* head */
  g.beginPath();g.moveTo(x-s*.16,y-s*.7);g.quadraticCurveTo(x,y-s*.78,x+s*.16,y-s*.7);g.lineTo(x+s*.2,y-s*.08);g.lineTo(x-s*.2,y-s*.08);g.closePath();g.fill(); /* furs */
  g.lineWidth=s*.07;g.beginPath();g.moveTo(x+s*.15,y-s*.62);g.lineTo(x+s*.4,y-s*.45+Math.sin(t*1.6)*s*.02);g.stroke(); /* arm to fire */
  g.lineWidth=s*.05;g.beginPath();g.moveTo(x-s*.14,y-s*.6);g.lineTo(x-s*.34,y-s*1.0);g.stroke();                       /* spear */
  g.beginPath();g.moveTo(x-s*.34,y-s*1.0);g.lineTo(x-s*.37,y-s*1.12);g.lineTo(x-s*.31,y-s*1.0);g.fill();
}
function v3art(c,g,time,mode){
  const w=c.width,h=c.height,u=h/540,t=time;
  g.setTransform(1,0,0,1,0,0);
  let gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#04050e');gr.addColorStop(.38,'#140f2c');gr.addColorStop(.66,'#4a2236');gr.addColorStop(.8,'#a4502a');gr.addColorStop(1,'#1a0c06');
  g.fillStyle=gr;g.fillRect(0,0,w,h);
  /* stars */
  for(const s of V3A.stars){const a=(.35+.65*Math.abs(Math.sin(t*s[3]+s[2])))*(1-s[1]*1.3);if(a<=0)continue;g.fillStyle='rgba(255,246,225,'+a.toFixed(2)+')';g.fillRect(s[0]*w,s[1]*h,u*1.4,u*1.4)}
  /* moon */
  const mx=w*(mode==='title'?.76:mode==='menu'?.8:.2),my=h*.2,mr=h*.075;
  gr=g.createRadialGradient(mx,my,mr*.5,mx,my,mr*5);gr.addColorStop(0,'rgba(255,238,200,.55)');gr.addColorStop(1,'rgba(255,238,200,0)');g.fillStyle=gr;g.fillRect(mx-mr*5,my-mr*5,mr*10,mr*10);
  g.fillStyle='#f4e6c4';g.beginPath();g.arc(mx,my,mr,0,6.2832);g.fill();
  g.fillStyle='rgba(150,130,100,.28)';[[-.3,-.2,.22],[.25,.15,.3],[-.1,.4,.15],[.35,-.35,.12]].forEach(k=>{g.beginPath();g.arc(mx+k[0]*mr,my+k[1]*mr,k[2]*mr,0,6.2832);g.fill()});
  /* far ridges, parallax */
  v3ridge(g,w,h,h*.62,h*.16,1.3,t*5*u,'#2a1d3a',u);
  /* mammoth herd on the second ridge */
  const mmx=((t*11*u)%(w+420*u))-210*u;
  v3ridge(g,w,h,h*.68,h*.13,4.1,t*9*u,'#1a1228',u);
  v3mammoth(g,mmx,h*.675,70*u,t,'#0b0713');
  v3mammoth(g,mmx-130*u,h*.685,46*u,t+1.7,'#0b0713');
  v3ridge(g,w,h,h*.76,h*.1,7.7,t*16*u,'#0d0813',u);
  /* mist */
  for(let i=0;i<4;i++){const mx2=((t*(6+i*3)*u+i*w*.3)%(w*1.4))-w*.2;gr=g.createRadialGradient(mx2,h*(.7+i*.03),0,mx2,h*(.7+i*.03),w*.28);gr.addColorStop(0,'rgba(190,170,200,.10)');gr.addColorStop(1,'rgba(190,170,200,0)');g.fillStyle=gr;g.fillRect(mx2-w*.28,h*.55,w*.56,h*.35)}
  /* ground */
  gr=g.createLinearGradient(0,h*.82,0,h);gr.addColorStop(0,'#120a07');gr.addColorStop(1,'#050302');g.fillStyle=gr;g.beginPath();g.moveTo(0,h*.86);g.quadraticCurveTo(w*.3,h*.82,w*.55,h*.85);g.quadraticCurveTo(w*.8,h*.88,w,h*.84);g.lineTo(w,h);g.lineTo(0,h);g.closePath();g.fill();
  /* conifers */
  const fx=w*(mode==='title'?.34:mode==='menu'?.17:.5),fy=h*.9;
  [[.04,.88,200],[.1,.9,150],[.92,.87,230],[.97,.9,170],[.84,.9,130],[.18,.91,110]].forEach(k=>v3conifer(g,w*k[0],h*k[1]+Math.sin(k[0]*9)*4,k[2]*u,'#06040a'));
  /* fire */
  const fl=.85+.15*Math.sin(t*17)+.08*Math.sin(t*29+1);
  gr=g.createRadialGradient(fx,fy-20*u,0,fx,fy-20*u,h*.5*fl);gr.addColorStop(0,'rgba(255,170,70,.55)');gr.addColorStop(.35,'rgba(210,90,30,.22)');gr.addColorStop(1,'rgba(120,40,10,0)');
  g.globalCompositeOperation='lighter';g.fillStyle=gr;g.fillRect(fx-h*.55,fy-h*.6,h*1.1,h*1.1);g.globalCompositeOperation='source-over';
  /* logs + flames */
  g.strokeStyle='#1a0e07';g.lineWidth=7*u;g.lineCap='round';g.beginPath();g.moveTo(fx-26*u,fy+4*u);g.lineTo(fx+22*u,fy-4*u);g.moveTo(fx+26*u,fy+4*u);g.lineTo(fx-22*u,fy-4*u);g.stroke();
  for(let i=0;i<3;i++){const k=i-1,hh=(40+14*Math.sin(t*9+i*2))*u*(i===1?1.25:1);
    g.fillStyle=i===1?'#ffd36a':'#ff8a2a';g.beginPath();g.moveTo(fx+k*13*u-10*u,fy-2*u);g.quadraticCurveTo(fx+k*13*u+Math.sin(t*11+i)*5*u,fy-hh*.6,fx+k*13*u+Math.sin(t*7+i*2)*4*u,fy-hh);g.quadraticCurveTo(fx+k*13*u+9*u,fy-hh*.5,fx+k*13*u+10*u,fy-2*u);g.closePath();g.fill()}
  /* wanderer silhouette by the fire */
  v3wanderer(g,fx-70*u,fy+6*u,100*u,'#050308',t);
  /* sparks */
  if(Math.random()<.5)V3A.sparks.push({x:fx+(Math.random()-.5)*20*u,y:fy-30*u,vx:(Math.random()-.5)*20*u,vy:-(30+Math.random()*50)*u,l:0,m:1.4+Math.random()*1.6});
  g.globalCompositeOperation='lighter';
  for(let i=V3A.sparks.length-1;i>=0;i--){const s=V3A.sparks[i];s.l+=.016;s.x+=s.vx*.016+Math.sin(t*3+i)*.4*u;s.y+=s.vy*.016;if(s.l>s.m){V3A.sparks.splice(i,1);continue}
    const a=1-s.l/s.m;g.fillStyle='rgba(255,'+(140+90*a|0)+',60,'+a.toFixed(2)+')';g.fillRect(s.x,s.y,2*u,2*u)}
  g.globalCompositeOperation='source-over';
  /* vignette */
  gr=g.createRadialGradient(w/2,h*.55,h*.3,w/2,h*.55,Math.max(w,h)*.75);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.72)');g.fillStyle=gr;g.fillRect(0,0,w,h);
}
/* ---- DOM ---- */
const v3css=document.createElement('style');v3css.textContent=
'#v3boot,#v3load{position:fixed;inset:0;z-index:200;background:#000;overflow:hidden;font-family:var(--f-display),Rubik,sans-serif;color:#f4e3bd;transition:opacity .9s ease;user-select:none;-webkit-user-select:none;touch-action:none}'
+'#v3boot canvas,#v3load canvas{position:absolute;inset:0;width:100%;height:100%}#v3boot[hidden],#v3load[hidden]{display:none}.v3off{opacity:0;pointer-events:none}'
+'#v3boot canvas{opacity:0;animation:v3in 1.4s .15s forwards}@keyframes v3in{to{opacity:1}}'
+'.v3t{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding-top:9vh;text-align:center;pointer-events:none}'
+'.v3t .k{font:600 clamp(9px,1.9vh,13px) Rubik,sans-serif;letter-spacing:.5em;color:#e8b878;opacity:0;animation:v3k 1.2s .9s forwards}@keyframes v3k{to{opacity:.9;letter-spacing:.42em}}'
+'.v3t h1{margin:1.2vh 0 0;font-weight:400;line-height:.92;display:flex;flex-direction:column;align-items:center}'
+'.v3t h1 span,.v3t h1 b{font-weight:400;background:linear-gradient(180deg,#fff4d0 0%,#e8bd6a 38%,#a8651f 70%,#5a300c 100%);background-size:100% 200%;-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-stroke:1.2px rgba(25,10,2,.85);filter:drop-shadow(0 0 22px rgba(255,140,40,.45)) drop-shadow(0 5px 0 #200d03);opacity:0;direction:ltr}'
+'.v3t h1 span{font-size:clamp(30px,10vh,86px);letter-spacing:.7em;animation:v3h 1.6s .45s forwards}.v3t h1 b{font-size:clamp(40px,15vh,128px);letter-spacing:.9em;animation:v3h 1.7s .75s forwards}'
+'@keyframes v3h{0%{opacity:0;transform:scale(1.12);filter:blur(10px) drop-shadow(0 0 40px rgba(255,140,40,.9))}60%{opacity:1}100%{opacity:1;letter-spacing:.08em;transform:scale(1)}}'
+'.v3t .ar{margin-top:1.6vh;font-size:clamp(15px,3.4vh,28px);color:#f0cf93;text-shadow:0 0 14px rgba(255,150,50,.6),0 2px 0 #1a0c04;opacity:0;animation:v3a 1.2s 1.5s forwards}@keyframes v3a{to{opacity:1}}'
+'.v3t .line{width:min(52vw,420px);height:2px;margin-top:1.4vh;background:linear-gradient(90deg,transparent,#e8b878,transparent);opacity:0;transform:scaleX(0);animation:v3l 1.1s 1.4s forwards}@keyframes v3l{to{opacity:.9;transform:scaleX(1)}}'
+'.v3p{position:absolute;left:0;right:0;bottom:6vh;text-align:center;font:600 clamp(12px,2.6vh,17px) Rubik,sans-serif;letter-spacing:.22em;color:#f4e3bd;opacity:0;animation:v3p 1.2s 2.2s infinite alternate;pointer-events:none}@keyframes v3p{from{opacity:.25}to{opacity:.95}}'
+'#v3load{background:#05040a}.v3l-top{position:absolute;top:5vh;left:0;right:0;text-align:center;font-size:clamp(14px,3.4vh,26px);letter-spacing:.32em;color:#e8c27a;text-shadow:0 0 14px rgba(255,140,40,.5);direction:ltr}'
+'.v3l-tip{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);width:min(86vw,560px);text-align:center;direction:rtl;font-family:Rubik,sans-serif;background:linear-gradient(rgba(10,6,12,.62),rgba(10,6,12,.5));border:1px solid rgba(232,184,120,.35);border-radius:14px;padding:14px 18px;backdrop-filter:blur(3px)}'
+'.v3l-tip small{display:block;font-size:11px;letter-spacing:.2em;color:#e8b878;margin-bottom:6px}.v3l-tip p{margin:0;font-size:clamp(14px,2.8vh,19px);line-height:1.7;color:#fbeed0;transition:opacity .5s}'
+'.v3l-bar{position:absolute;left:50%;bottom:9vh;transform:translateX(-50%);width:min(70vw,460px);height:7px;border-radius:5px;background:rgba(255,255,255,.12);overflow:hidden;box-shadow:0 0 0 1px rgba(232,184,120,.3)}.v3l-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#a8441c,#ffb347,#fff0b8);border-radius:5px;transition:width .35s ease}'
+'.v3l-st{position:absolute;left:0;right:0;bottom:5vh;text-align:center;font:500 13px Rubik,sans-serif;letter-spacing:.12em;color:#d9c49a}'
+'body.v3b #splash .menu-actions button,body.v3b #splash .menu-mark{opacity:0;transform:translateY(14px)}#splash .menu-actions button,#splash .menu-mark{transition:opacity .7s ease,transform .7s ease}'
+'body.v3in #splash .menu-actions button:nth-child(1){transition-delay:.15s}body.v3in #splash .menu-actions button:nth-child(2){transition-delay:.3s}body.v3in #splash .menu-actions button:nth-child(3){transition-delay:.45s}body.v3in #splash .menu-actions button:nth-child(4){transition-delay:.6s}body.v3in #splash .menu-mark{transition-delay:.9s}';
v3css.textContent+='#v3mbg{position:fixed;inset:0;width:100%;height:100%;z-index:1;display:none;background:#05040a}body.inmenu #splash{background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,.18),rgba(0,0,0,.5) 85%)!important}#v3load{transition-duration:.45s}';
document.head.appendChild(v3css);
const v3boot=document.getElementById('v3boot')||document.createElement('div');v3boot.id='v3boot';
v3boot.innerHTML='<canvas></canvas><div class="v3t"><div class="k">WILD • ANCIENT • UNTAMED</div><h1><span>STONE AGE</span><b>WANDERER</b></h1><div class="line"></div><div class="ar">رَحّال العصر الحجري</div></div><div class="v3p">المس الشاشة لتبدأ الرحلة</div>';
v3boot.removeAttribute('style');if(!v3boot.parentNode)document.body.insertBefore(v3boot,document.body.firstChild);
document.body.classList.add('v3b');
const v3load=document.createElement('div');v3load.id='v3load';v3load.hidden=true;
v3load.innerHTML='<canvas></canvas><div class="v3l-top">STONE AGE WANDERER</div><div class="v3l-tip"><small>نصيحة البقاء</small><p id="v3tip"></p></div><div class="v3l-bar"><i></i></div><div class="v3l-st" id="v3ls">نبني الأرض…</div>';
document.body.appendChild(v3load);
const V3TIPS=['الجلوس يقلّل ضجيجك — والذئاب تشمّ الريح قبل أن ترى.','الجرح النازف يترك أثراً تتبعه المفترسات. اربطه بسرعة.','الثياب المبللة تسرق دفء جسمك. جفّف نفسك قرب النار.','الشتاء لا يرحم: جهّز الطعام والوقود قبل أن يحلّ.','في الظلام يضعف العقل. ابقَ قرب النار وتجنّب الأماكن المظلمة.','المعدن البارد لا يُطرق — أشعل الحدّادة أولاً.','الحزم توفّر المكان، لكن الوزن الزائد يبطئك.','لا تشرب من الماء الراكد دون تنقية.','ما ترميه لا تلتقطه فوراً، فكّر قبل أن تتخلّى عن شيء.','السلاح الذي تنحته بيديك يحمل شكل أفكارك.','المفترس الذي لم يلحظك يتتبّع أثرك — امسح وجودك بالماء.','النهر العميق يغرق، والجليد في الشتاء يحملك.'];
const V3ST=['نشعل النار الأولى…','نرسم الجبال…','نوقظ الحيوانات…','نزرع الغابة…','نستعيد ما قطعته…'];
let v3raf=0,v3mode='boot',v3busy=false,v3bootDone=false;
function v3size(c){if(innerWidth<2||innerHeight<2)throw 0;const d=Math.min(window.devicePixelRatio||1,1.5),w=Math.round(innerWidth*d*.6),h=Math.round(innerHeight*d*.6);if(c.width!==w||c.height!==h){c.width=w;c.height=h}}
const v3mbg=document.createElement('canvas');v3mbg.id='v3mbg';document.body.insertBefore(v3mbg,document.body.children[1]||null);
function v3tick(){
  v3raf=requestAnimationFrame(v3tick);
  try{v3tick2()}catch(e){}
}
function v3tick2(){
  const t=(performance.now()-V3A.t0)/1000;
  if(!v3bootDone){if(!v3boot.hidden){const c=v3boot.querySelector('canvas');v3size(c);v3art(c,c.getContext('2d'),t,'title')}return}
  if(!v3load.hidden){const c=v3load.querySelector('canvas');v3size(c);v3art(c,c.getContext('2d'),t,'load')}
  if(document.body.classList.contains('inmenu')&&v3load.hidden){v3mbg.style.display='block';v3size(v3mbg);v3art(v3mbg,v3mbg.getContext('2d'),t,'menu')}
  else v3mbg.style.display='none';
}
SFX.titleHit=function(){
  O(K0,{d:3,f0:68,f1:34,g:.95,a:.02});N(K0,{d:2.4,f0:180,f1:1400,type:'lowpass',q:.8,g:.35,a:1.6});
  O(K0,{d:5,f0:110,f1:110,type:'sawtooth',lp:520,g:.07,a:1.6});O(K0,{d:5,f0:165,f1:165,type:'sawtooth',lp:600,g:.05,a:2});
  N(K0,{d:3.5,f0:900,f1:300,type:'bandpass',q:1.2,g:.1,a:1.2,dl:.6});
};
function v3bootEnd(){
  if(v3bootDone)return;v3bootDone=true;
  try{aInit();SFX.titleHit()}catch(e){}
  v3boot.classList.add('v3off');document.body.classList.add('v3in');document.body.classList.remove('v3b');
  setTimeout(()=>{v3boot.hidden=true;v3mode='load'},950);
}
const v3t0=performance.now();
const v3tap=e=>{if(!v3bootDone&&performance.now()-v3t0>350){try{e.preventDefault()}catch(_){}v3bootEnd()}};
v3boot.addEventListener('pointerdown',v3tap);v3boot.addEventListener('touchstart',v3tap,{passive:false});v3boot.addEventListener('click',v3tap);
document.addEventListener('pointerdown',v3tap,true);
document.addEventListener('keydown',e=>{if(!v3bootDone&&performance.now()-v3t0>350)v3bootEnd()});
/* ---- loading overlay: shown around the (synchronous) world build ---- */
{const _lf=loadFinish;loadFinish=function(fn){
  if(v3busy||v3mode==='boot'){return _lf.apply(this,arguments)}
  v3busy=true;const args=arguments,self=this,t0=performance.now();
  v3mode='load';v3load.hidden=false;v3load.classList.remove('v3off');
  const bar=v3load.querySelector('.v3l-bar i'),st=document.getElementById('v3ls'),tip=document.getElementById('v3tip');
  tip.textContent=V3TIPS[Math.floor(Math.random()*V3TIPS.length)];bar.style.width='6%';st.textContent=V3ST[0];
  try{SFX.fire&&SFX.fire()}catch(e){}
  let k=0;const si=setInterval(()=>{k=(k+1)%V3ST.length;st.textContent=V3ST[k];bar.style.width=Math.min(78,10+k*16)+'%'},150);
  setTimeout(()=>{
    clearInterval(si);bar.style.width='86%';st.textContent='نكاد نصل…';
    requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(()=>{
      let r;try{r=_lf.apply(self,args)}catch(e){console.error(e)}
      bar.style.width='100%';st.textContent='انطلق!';
      const wait=Math.max(250,1100-(performance.now()-t0));
      setTimeout(()=>{v3load.classList.add('v3off');setTimeout(()=>{v3load.hidden=true;v3busy=false},480)},wait);
    },60)));
  },200);
}}
/* the gameplay HUD must never show on the main menu */
{const st=document.createElement('style');
 st.textContent='body.inmenu #stats,body.inmenu #chips,body.inmenu #clock,body.inmenu #top,body.inmenu #zone,body.inmenu #orbit,body.inmenu #swap,body.inmenu #jmp,body.inmenu #act,body.inmenu #actLbl,body.inmenu #atk,body.inmenu #xpPill,body.inmenu #stBtn,body.inmenu .st,body.inmenu #s-energy,body.inmenu #mmap,body.inmenu #toasts{display:none!important}';
 document.head.appendChild(st);
 const sp=document.getElementById('splash'),upd=()=>document.body.classList.toggle('inmenu',!!sp&&!sp.hidden);
 new MutationObserver(upd).observe(sp,{attributes:true,attributeFilter:['hidden','style','class']});upd();}
v3tick();
