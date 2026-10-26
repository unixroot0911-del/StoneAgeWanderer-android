/* ===== v3l: no on-screen text hints, visible poisoning, survival handbook ===== */
/* ---- 1) silence every hint / alert / notification text ---- */
SFX.deny=function(){try{O(K0,{d:.2,f0:140,f1:95,type:'square',lp:420,g:.1,a:.01});N(K0,{d:.06,f0:300,f1:200,type:'lowpass',g:.1})}catch(e){}};
{const _t=toast;toast=function(t,bad){
  if(typeof t==='string'&&(t.indexOf('تم حفظ')===0||t.indexOf('تعذر')===0))return _t.apply(this,arguments);
  if(bad){const n=performance.now();if(n-(toast._d||0)>350){toast._d=n;SFX.deny()}}
}}
banner=function(){};
floatText=function(){};
objective=function(){return''};
updChips=function(){};
stnText=function(){return''};
{const st=document.createElement('style');st.textContent='#chips,#toasts,#banner,#obj,#bkdmg,#bkthr,.v3l-tip,.v3l-st{display:none!important}#actLbl{display:none!important}';document.head.appendChild(st)}
{const p=document.querySelector('.v3p');if(p)p.innerHTML='<svg viewBox="0 0 48 48" width="46" height="46" style="display:block;margin:0 auto"><circle cx="24" cy="24" r="21" fill="none" stroke="#f4e3bd" stroke-width="2"/><path d="M19 15 34 24 19 33z" fill="#f4e3bd"/></svg>'}
if(typeof cwMsg==='function'){const _cm=cwMsg;cwMsg=function(t){if(t)SFX.deny();if(CW)CW.warn=t||''}}
/* ---- 2) poisoning: slower, but impossible to miss, and curable ---- */
if(IT.herb)IT.herb.eat={hp:6,pcut:6};
if(IT.bandage&&IT.bandage.eat)IT.bandage.eat.cure=0;
if(IT.charcoal){IT.charcoal.eat={f:1,pcut:14};IT.charcoal.d='فحم نباتي: يمتصّ السموم في المعدة. امضغه إن تسمّمت.'}
{const _us=useSlot;useSlot=function(i){const s=inv[i],d=s&&IT[s.id],e=d&&d.eat,had=s?s.n:0,id=s&&s.id;if(e&&e.pcut&&S.poison>0&&S.hunger>97)S.hunger=97;const r=_us.apply(this,arguments);
  if(e&&(!inv[i]||inv[i].id!==id||inv[i].n<had)){
    if(S.poison>0){if(e.pcut)S.poison=Math.max(0,S.poison-e.pcut);else if(e.w)S.poison=Math.max(0,S.poison-3)}
  }return r}}
SFX.retch=function(){N(K0,{d:.5,f0:380,f1:180,type:'lowpass',q:.9,g:.35,a:.05});O(K0,{d:.45,f0:95,f1:70,type:'sawtooth',lp:260,g:.16,a:.08,vib:[18,12]});N(K0,{d:.2,f0:900,f1:400,type:'bandpass',q:2,g:.12,dl:.45})};
const v3tox=document.createElement('div');v3tox.id='v3tox';
v3tox.style.cssText='position:fixed;inset:0;z-index:5;pointer-events:none;opacity:0;background:radial-gradient(ellipse at 50% 50%,rgba(70,120,20,0) 25%,rgba(70,130,20,.55) 70%,rgba(30,70,10,.85) 100%)';document.body.appendChild(v3tox);
{const st=document.createElement('style');st.textContent='#s-hp i u.tx{position:absolute;top:0;bottom:0;z-index:2;border-radius:7px;background:repeating-linear-gradient(135deg,#7fd23a 0 4px,#2f5a12 4px 8px);opacity:.95}#s-hp.tox svg{filter:hue-rotate(95deg) saturate(1.6)!important}#c.v3sick{transition:transform .15s}';document.head.appendChild(st)}
let toxT=8,toxU=null;
{const _u=update;update=function(dtRaw){const r=_u.apply(this,arguments);
  try{
    const p=S.alive?S.poison:0,k=clamp(p/14,0,1);
    v3tox.style.opacity=(k*(.55+.35*Math.sin(time*(1.5+k*3)))).toFixed(2);
    const cv=document.getElementById('c');
    if(cv){if(k>.15){const a=k*(.5+.5*Math.sin(time*1.3));cv.style.transform='translate('+(Math.sin(time*1.7)*3*k).toFixed(1)+'px,'+(Math.cos(time*1.1)*2*k).toFixed(1)+'px) rotate('+(Math.sin(time*.9)*.7*k).toFixed(2)+'deg) scale('+(1.02+.015*a).toFixed(3)+')'}else if(cv.style.transform)cv.style.transform=''}
    /* bar: pending toxin damage drawn on the heart bar */
    const hp=bars.hp;
    if(hp){hp.classList.toggle('tox',p>0);const i=hp.querySelector('i');if(!toxU){toxU=document.createElement('u');toxU.className='tx';i.appendChild(toxU)}
      const pend=Math.min(S.hp,p*.65);toxU.style.display=p>0?'block':'none';toxU.style.left=Math.max(0,S.hp-pend)+'%';toxU.style.width=pend+'%'}
    if(p>0){toxT-=dtRaw;if(toxT<=0){toxT=6+Math.random()*6-k*3;SFX.retch();S.thirst=Math.max(0,S.thirst-2);S.hunger=Math.max(0,S.hunger-1.2);shake=Math.max(shake,.5)}}
  }catch(e){}
  return r}}
/* ---- 3) survival handbook ---- */
if(!S.dis)S.dis={};
const HB=[
 {k:'start',t:'البداية',open:1,h:'<p>أنت مسافر وحيد في برية قاسية لا تنتظر أحداً. لا مهمّات ولا أسهم: كل ما تعرفه هو ما تراه وتجرّبه.</p><ul><li><b>الحركة:</b> العصا اليسرى. السحب الأفقي على اليمين يدير الكاميرا، والقرص بإصبعين يقرّب ويبعّد.</li><li><b>الجمع والعمل:</b> اقترب من شجرة أو صخرة أو عشبة وسيتغيّر زر الفعل. الضرب يقطع الأشجار ويكسر الحجارة ويقاتل.</li><li><b>الشرائط:</b> القلب صحتك، الثمرة جوعك، القطرة عطشك، اللهب دفؤك، البرق قوّتك، والهلال نومك. أي شريط يفرغ يبدأ بقتلك.</li><li><b>الجسم:</b> زر الوضعية يبدّل بين الوقوف والجلوس. الجلوس يخفّف ضجيجك ويصعب رؤيتك.</li></ul>'},
 {k:'bag',t:'الحقيبة والحمولة',open:1,h:'<p>خانات الحقيبة قليلة والحمولة لها وزن. فوق الحد تبطؤ.</p><ul><li>الخشب والحجر ثقيلان. الريش والليف خفيفان.</li><li>اضغط على عنصر لترى ما يفعله. زر «احزم» يجمع عدداً من المواد في حزمة واحدة (يحتاج حبلاً أحياناً).</li><li>ما ترميه لا تلتقطه قبل بضع ثوانٍ.</li><li>الطعام يفسد مع الوقت، والمطبوخ أبطأ من النيء، والمدخّن أبطأ منهما.</li></ul>'},
 {k:'craft',t:'الصناعة والمحطات',open:1,dyn:'recipes',h:'<p>بيديك تصنع الحبل والشفرة الصوّانية والضمادة والمشعل وأطقم المحطات. كل شيء آخر يُصنع عند محطّته:</p><ul><li><b>طاولة الصناعة:</b> أدوات وأسلحة بسيطة.</li><li><b>ورشة النجارة:</b> ألواح وأوعية وأسلحة خشبية، ونحت سلاح مخصّص.</li><li><b>الفرن الفخاري:</b> فخار وطوب وفحم. <b>المصهر:</b> سبائك من الخام. <b>الحدّادة:</b> أسلحة معدنية ونحت المعادن.</li><li><b>الشواية والفرن والمدخنة:</b> طبخ وحفظ الطعام. تحتاج وقوداً وتعمل في الخلفية.</li><li><b>المدبغة والنول:</b> جلد وقماش وملابس. <b>المختبر:</b> أدوية. <b>المطحنة والحقل:</b> قمح ودقيق.</li></ul><p>الوصفات تُدوَّن هنا حين تحصل على أحد مكوّناتها لأول مرة.</p>'},
 {k:'food',t:'الطعام والماء',open:1,h:'<p>الجوع والعطش يتناقصان دائماً، أسرع مع الركض والبرد والصيف.</p><ul><li>الماء الراكد قد يمرضك. رشّحه بالفحم في محطة الترشيح أو اشرب من ماء جارٍ نظيف.</li><li>اللحم النيء يمرض أحياناً. اطبخه.</li><li>الفطر الأحمر سام. الأعشاب والتوت أغلبها آمن لكن بعضها يخدع.</li></ul>'},
 {k:'body',t:'الجسم والنوم',open:1,h:'<p>جسمك له حرارة، وله طاقة تنفد. بلا نوم تبطؤ قوّتك وتضعف رؤيتك. النوم قرب النار أو في سرير أو ملجأ أعمق وأدفأ.</p>'},
 {k:'poison',t:'التسمم وعلاجه',h:'<p>السمّ لا يقتلك فجأة بل ينهشك ببطء. تعرفه من:</p><ul><li>الجزء الأخضر المخطّط على شريط القلب: هو الضرر الذي سيصلك إن لم تعالج نفسك.</li><li>اخضرار الشاشة وترنّح الرؤية، وسعال وتقيّؤ يسحب منك الماء والطعام.</li></ul><p><b>العلاج:</b></p><ul><li>الترياق (مختبر الأعشاب): يشفي كلياً.</li><li>الفحم النباتي: يمتصّ السمّ، امضغه.</li><li>العشبة الطبية: تخفّف قليلاً. الماء النظيف يخفّف قليلاً أيضاً.</li><li>الراحة والنار وعدم الركض تبطئ الضرر.</li></ul>',flag:'poison'},
 {k:'bleed',t:'النزيف والعدوى',h:'<p>الجرح العميق ينزف، ويترك أثر دم تتبعه المفترسات. الضمادة توقف النزيف. الجرح غير المعالج والماء القذر يجلبان العدوى: حرارة ثم ضعف. نظّفه بالأعشاب واسترح.</p>',flag:'bleed'},
 {k:'cold',t:'البرد والحرّ',h:'<p>جسمك يحافظ على حرارته بالملابس والنار والحركة. تعرفه من: ارتجاف وأسنان تصطك وبخار الأنفاس (برد)، لهاث وعرق وبرتقالية الشاشة (حرّ).</p><ul><li>البلل يسرق الدفء. جفّف نفسك قرب النار.</li><li>الفرو والمعطف يحميان في الشتاء. ظلّ الأشجار والماء النظيف يخفّفان الحر.</li></ul>',flag:'temp'},
 {k:'water',t:'السباحة والغرق',h:'<p>الماء الضحل يُمشى فيه ببطء. العميق يُسبح فيه: تستنزف قوّتك ثم أنفاسك. حين ينفد النفَس تغرق. اعرف عمق الماء من لونه: الأغمق أعمق. في الشتاء يتجمّد السطح الضحل.</p>',flag:'swim'},
 {k:'mind',t:'العقل والظلام',h:'<p>العزلة والظلام والجوع تفتّت عقلك: همسات وخطوات وراءك وعيون في العتمة. النار والضوء والنوم الجيد يعيدون صفاءك. لا تثق بكل ما تراه حين تتعب.</p>',flag:'mind'},
 {k:'stealth',t:'التسلّل والأثر',h:'<p>الحيوانات تراك بالعين وتسمعك بالأذن وتشمّك مع الريح. الجلوس والمشي البطيء يقلّلان كل ذلك، والعشب العالي يخفيك. من لم يلحظك لا يهاجمك، وضربة غادرة تضاعف الضرر.</p><p>أقدامك تترك أثراً، ودمك أكثر. المفترس الجائع يتبع الأثر حتى يجدك. المطر يمحوه أسرع، والثلج يبقيه.</p>',flag:'sneak'},
 {k:'carve',t:'نحت الأسلحة',h:'<p>في النجارة والحدادة اختر «سلاح مخصّص»، اسحب مواد إلى اللوح وانحتها بالسكين أو المنشار أو المطرقة. المعدن لا يُطرق إلا ساخناً بملقط. اربط الأجزاء المختلفة بالحبل. الرأس الثقيل يضرب أقوى وأبطأ، والرأس المدبّب يخترق.</p>',flag:'carve'},
 {k:'season',t:'الفصول',h:'<p>الربيع يزهر والصيف يفسد الطعام والخريف يقصّر النهار والشتاء يجمّد كل شيء. لا أحد يخبرك متى يبدأ فصل: انظر إلى الأرض والأشجار والسماء. النبات ينمو ببطء ويستعيد نفسه بعد أسابيع.</p>',flag:'season'},
 {k:'wolf',t:'الذئب',h:'<p>يصطاد في جماعات ويتتبع الأثر والريح. يخاف النار. ضع ظهرك لجدار صخري وقاتل واحداً واحداً.</p>',flag:'a_wolf'},
 {k:'bear',t:'الدبّ',h:'<p>بطيء الاستدارة هائل الضربة. لا تركض إليه. اشتبك بالرمح من بعيد أو ابتعد.</p>',flag:'a_bear'},
 {k:'sabertooth',t:'النمر ذو الأنياب',h:'<p>يتربّص في العتمة ويقفز. أنيابه تنزفك. لا تدر له ظهرك.</p>',flag:'a_sabertooth'},
 {k:'boar',t:'الخنزير البري',h:'<p>يندفع مستقيماً. اخطُ جانباً عند اقترابه ثم اضرب.</p>',flag:'a_boar'},
 {k:'mammoth',t:'الماموث',h:'<p>لا يهاجم ما لم تُستفزّ. ضخم وقوي. جلده ولحمه غنيمة عظيمة لكن ثمنها غالٍ.</p>',flag:'a_mammoth'},
 {k:'snake',t:'الأفعى',h:'<p>لدغتها تسمّمك. تحبّ العشب والحجارة الدافئة. انتبه لخطواتك.</p>',flag:'a_snake'}
];
function hbFlags(){
  const d=S.dis||(S.dis={});
  if(S.poison>0)d.poison=1;if(S.bleed>0||S.inf>0)d.bleed=1;if(S.bt<35.4||S.bt>38.3)d.temp=1;if(P.swim)d.swim=1;if(S.san<62)d.mind=1;if(P.stance)d.sneak=1;
  if(S.flag&&(S.flag.has_carp_kit||S.flag.has_forge_kit||S.flag.has_hammer))d.carve=1;
  if(typeof seas!=='undefined'&&hbFlags.s!==undefined&&hbFlags.s!==seas)d.season=1;hbFlags.s=seas;
  for(const e of ents){if(e.dead)continue;const f='a_'+e.sp;if(AN[e.sp]&&Math.hypot(e.x-P.x,e.y-P.y)<22)d[f]=1}
}
function hbOpen(k){return HB.find(c=>c.k===k)}
function hbUnlocked(c){if(c.open)return true;const d=S.dis||{};return !!d[c.flag]}
let hbSeen={};
function hbRecipes(){
  const f=S.flag||{},g={};
  for(const r of REC){if(!Object.keys(r.in).some(k=>f['has_'+k]))continue;(g[r.st]=g[r.st]||[]).push(r)}
  let h='<h4>وصفاتك المدوَّنة</h4>';
  const ks=Object.keys(g);if(!ks.length)return h+'<p style="opacity:.7">لا شيء بعد. اجمع مواد وسيُسجَّل ما تعرفه.</p>';
  for(const st of ks){h+='<div class="hb-st">'+stName(st)+'</div>';for(const r of g[st])h+='<div class="hb-r"><img alt="" src="'+iconURL(r.out)+'"><b>'+IT[r.out].n+(r.n>1?' ×'+r.n:'')+'</b><span>'+Object.keys(r.in).map(k=>'<i>'+IT[k].n+' '+r.in[k]+'</i>').join('')+(r.tool?'<i class="tl">'+IT[r.tool].n+'</i>':'')+'</span></div>'}
  return h;
}
const hbEl=document.createElement('div');hbEl.id='hbook';hbEl.hidden=true;
hbEl.innerHTML='<div class="hb-box"><div class="hb-h"><b>كتيّب المسافر</b><button id="hbX" type="button">✕</button></div><div class="hb-body"><div class="hb-tabs" id="hbTabs"></div><div class="hb-page" id="hbPage"></div></div></div>';
document.body.appendChild(hbEl);
{const st=document.createElement('style');st.textContent=
'#hbook{position:fixed;inset:0;z-index:41;display:grid;place-items:center;padding:6px;background:rgba(10,6,2,.8);direction:rtl;font-family:Rubik,sans-serif;color:#3a2410}#hbook[hidden]{display:none}'
+'.hb-box{width:min(900px,100%);height:min(400px,100%);background:#e9d9b4;background-image:repeating-linear-gradient(0deg,rgba(120,80,30,.05) 0 2px,transparent 2px 26px);border:3px solid #5a3a1a;border-radius:12px;display:flex;flex-direction:column;box-shadow:0 10px 40px rgba(0,0,0,.65);overflow:hidden}'
+'.hb-h{display:flex;justify-content:space-between;align-items:center;padding:6px 14px;background:#5a3a1a;color:#f1e3c4;font-size:15px}#hbX{background:none;border:0;color:#f1e3c4;font-size:20px;cursor:pointer}'
+'.hb-body{flex:1;display:flex;min-height:0}.hb-tabs{width:190px;overflow:auto;border-left:2px solid rgba(90,58,26,.35);padding:6px;display:flex;flex-direction:column;gap:3px;touch-action:pan-y;-webkit-overflow-scrolling:touch}'
+'.hb-tabs button{text-align:right;background:rgba(90,58,26,.1);border:1px solid rgba(90,58,26,.25);border-radius:7px;padding:6px 8px;font:600 12.5px Rubik,sans-serif;color:#3a2410;cursor:pointer}.hb-tabs button.on{background:#5a3a1a;color:#f1e3c4}.hb-tabs button.lock{opacity:.4;font-style:italic}.hb-tabs button.new::after{content:"●";color:#c0392b;margin-right:5px}'
+'.hb-page{flex:1;overflow:auto;padding:10px 16px;font-size:13.5px;line-height:1.75;touch-action:pan-y;-webkit-overflow-scrolling:touch}.hb-page h3{margin:0 0 6px;font-size:18px;color:#6b3a10}.hb-page h4{margin:12px 0 4px;font-size:14px;color:#6b3a10}.hb-page ul{padding-right:18px;margin:4px 0}.hb-page p{margin:5px 0}'
+'.hb-st{margin:8px 0 3px;font-weight:700;color:#7a4a18;border-bottom:1px solid rgba(90,58,26,.3)}.hb-r{display:flex;align-items:center;gap:6px;padding:2px 0;font-size:12.5px}.hb-r img{width:26px;height:26px}.hb-r span{margin-right:auto;opacity:.85}.hb-r i{font-style:normal;background:rgba(90,58,26,.12);border-radius:5px;padding:0 5px;margin-right:4px}.hb-r i.tl{background:rgba(60,100,40,.2)}';
document.head.appendChild(st)}
let hbCur='start';
function hbRender(){
  hbFlags();
  const tabs=$('hbTabs'),pg=$('hbPage');
  tabs.innerHTML=HB.map(c=>{const u=hbUnlocked(c);return '<button data-k="'+c.k+'" class="'+(c.k===hbCur?'on ':'')+(u?'':'lock ')+(u&&!c.open&&!hbSeen[c.k]?'new':'')+'" type="button">'+(u?c.t:'؟؟؟ لم تكتشفه بعد')+'</button>'}).join('');
  const c=hbOpen(hbCur);
  if(!hbUnlocked(c)){pg.innerHTML='<h3>؟؟؟</h3><p style="opacity:.7">لم تواجه هذا بعد. بعض المعارف تأتي بالتجربة فقط.</p>';return}
  hbSeen[c.k]=1;pg.innerHTML='<h3>'+c.t+'</h3>'+c.h+(c.dyn==='recipes'?hbRecipes():'');
}
function hbShow(){setTimeout(()=>{const q=$('qp');if(q)q.hidden=true},0);hbEl.hidden=false;SFX.bag&&SFX.bag();hbRender()}
hbEl.addEventListener('click',e=>{
  if(e.target.id==='hbX'||e.target===hbEl){hbEl.hidden=true;return}
  const b=e.target.closest('[data-k]');if(b){hbCur=b.dataset.k;hbRender();$('hbPage').scrollTop=0}
});
$('qbtn').addEventListener('click',e=>{e.stopImmediatePropagation();e.preventDefault();hbShow()},true);
/* discovering a new page makes the book icon glow and plays a soft sound */
let hbT=0,hbKnown=0;
{const st=document.createElement('style');st.textContent='#qbtn.hbnew{animation:hbglow 1.2s infinite alternate}@keyframes hbglow{from{box-shadow:0 0 0 0 rgba(255,210,120,0)}to{box-shadow:0 0 14px 5px rgba(255,210,120,.95)}}';document.head.appendChild(st)}
{const _u=update;update=function(dtRaw){const r=_u.apply(this,arguments);
  hbT-=dtRaw;if(hbT<=0&&S.alive){hbT=1;try{hbFlags();let n=0;for(const c of HB)if(hbUnlocked(c)&&!c.open)n++;
    if(n>hbKnown){hbKnown=n;SFX.chime&&SFX.chime();document.getElementById('qbtn').classList.add('hbnew')}
    const unseen=HB.some(c=>!c.open&&hbUnlocked(c)&&!hbSeen[c.k]);if(!unseen)document.getElementById('qbtn').classList.remove('hbnew')}catch(e){}}
  return r}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);S.dis={};hbKnown=0;hbSeen={};document.getElementById('qbtn').classList.remove('hbnew');return r}}
