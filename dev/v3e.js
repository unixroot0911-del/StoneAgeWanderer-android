/* ===== V3 (part E): station tools, more food, water look, winter ice ===== */
/* tools required at stations (not consumed) */
const I6={
  hammer:['مطرقة حجرية','أداة. تلزم للحدّادة وللتكسير الدقيق.',{tool:1}],
  saw:['منشار صوّان','أداة. تلزم لورشة النجارة.',{tool:1}],
  tongs:['ملقط خشبي','أداة. تلزم للمصهر والحدّادة.',{tool:1}],
  mortar:['هاون حجري','أداة. تلزم لمختبر الأعشاب.',{tool:1}],
  porridge:['عصيدة','دافئة ومشبعة وتهدّئ العقل.',{eat:{f:36,w:10,hp:4,fed:150,san:5,bt:.4,give:'wooden_bowl'}}],
  veg_stew:['حساء لفت ولحم','وجبة ثقيلة تقاوم البرد.',{eat:{f:58,w:14,hp:10,fed:260,san:6,bt:.7,give:'pot'}}],
  meat_pie:['فطيرة لحم','وجبة غنية تدوم.',{eat:{f:66,hp:8,fed:240,san:5}}],
  mushroom_soup:['حساء فطر','خفيف ودافئ.',{eat:{f:24,w:22,hp:4,san:3,bt:.5,give:'pot'}}],
  berry_jam:['مربى التوت','حلو يدوم طويلاً. يرفع المعنويات.',{eat:{f:22,w:4,san:7}}],
  dried_fruit:['فاكهة مجففة','خفيفة تدوم شهراً.',{eat:{f:26}}],
  pickled_turnip:['لفت مخلل','يدوم ويقي من الإنهاك.',{eat:{f:20,w:3,stam:20}}],
  kebab:['كباب أعشاب','لحم مشوي بالأعشاب على السيخ.',{eat:{f:52,hp:7,fed:120,san:3}}],
  herbal_tea:['شاي أعشاب','يهدّئ ويدفّئ قليلاً.',{eat:{w:18,hp:3,san:9,bt:.8,give:'pot'}}]
};
for(const k in I6){const v=I6[k];IT[k]=Object.assign({n:v[0],d:v[1]},v[2]||{})}
Object.assign(PER,{porridge:700,veg_stew:1100,meat_pie:1800,mushroom_soup:700,berry_jam:4500,dried_fruit:5000,pickled_turnip:6000,kebab:900,herbal_tea:600});
IC.hammer=g=>{dbl(g,[[10,33],[26,12]],3.6,'#a87a46');g.beginPath();g.roundRect(18,5,16,10,2);fs(g,'#8d887a')};
IC.saw=g=>{dbl(g,[[6,26],[34,14]],3,'#9a968c');for(let i=0;i<7;i++)line(g,[[8+i*4,26-i*1.7],[9+i*4,29-i*1.7]],1.4,'#6a6a70');dbl(g,[[6,26],[4,34]],3,'#a87a46')};
IC.tongs=g=>{dbl(g,[[8,34],[24,8]],3,'#a87a46');dbl(g,[[14,34],[30,10]],3,'#a87a46');line(g,[[24,8],[28,5]],2.4,'#3d4650')};
IC.mortar=g=>{g.beginPath();g.moveTo(7,17);g.quadraticCurveTo(20,40,33,17);g.closePath();fs(g,'#9a968c');g.beginPath();g.ellipse(20,17,13,4,0,0,TAU);fs(g,'#6a6a70');dbl(g,[[24,14],[33,4]],3,'#b8b2a4')};
const icBowl=(c1,c2)=>g=>{g.beginPath();g.moveTo(6,18);g.quadraticCurveTo(20,40,34,18);g.closePath();fs(g,'#a8764a');g.beginPath();g.ellipse(20,18,14,4.5,0,0,TAU);fs(g,c1);c2&&[[14,18],[20,17],[26,19]].forEach(p=>{g.beginPath();g.arc(p[0],p[1],2,0,TAU);g.fillStyle=c2;g.fill()})};
IC.porridge=icBowl('#e8d9a8');IC.veg_stew=icBowl('#c9803a','#efe0f0');IC.mushroom_soup=icBowl('#b08a60','#e8d8b0');IC.herbal_tea=icBowl('#8ab04a');
IC.meat_pie=g=>{g.beginPath();g.ellipse(20,24,15,8,0,0,TAU);fs(g,'#c98a42');g.beginPath();g.ellipse(20,20,15,8,0,0,TAU);fs(g,'#e0a85a');[[12,20],[20,17],[28,20]].forEach(p=>line(g,[[p[0]-3,p[1]],[p[0]+3,p[1]-2]],1.6,'#8a5a2e'))};
IC.berry_jam=g=>{g.beginPath();g.roundRect(9,12,22,21,4);fs(g,'#b83a5a');g.beginPath();g.roundRect(8,7,24,7,2);fs(g,'#c9a66a');g.fillStyle='rgba(255,255,255,.3)';g.fillRect(12,17,3,10)};
IC.dried_fruit=g=>{[[12,22],[22,17],[27,27],[16,30]].forEach(p=>{g.beginPath();g.ellipse(p[0],p[1],6,4,.5,0,TAU);fs(g,'#8a4a2a',1.8)})};
IC.pickled_turnip=g=>{g.beginPath();g.roundRect(9,10,22,24,5);fs(g,'rgba(220,235,240,.8)');g.beginPath();g.arc(20,24,7,0,TAU);fs(g,'#efe0f0',1.6);g.beginPath();g.roundRect(8,6,24,6,2);fs(g,'#b9855a')};
IC.kebab=g=>{dbl(g,[[6,32],[34,8]],2.2,'#a87a46');[[13,27],[19,22],[25,17]].forEach(p=>{g.beginPath();g.ellipse(p[0],p[1],5,4,.6,0,TAU);fs(g,'#9a5a2e',1.8)})};
/* extra tool requirement per station recipe */
for(const r of REC){
  const o=r.out;
  if(r.st==='forge'||o==='hammer')r.tool=r.st==='forge'?'hammer':r.tool;
  if(r.st==='carp'&&!r.tool)r.tool='saw';
  if(r.st==='carp'&&o==='plank')r.tool='saw';
  if(r.st==='lab')r.tool='mortar';
  if(r.st==='smelter')r.tool='tongs';
  if(r.st==='forge')r.in=Object.assign({},r.in);
}
const RT=(out,n,inn,st,cat,t,x)=>REC.push(Object.assign({out:out,n:n,in:inn,st:st,cat:cat,t:t,snd:'tap'},x||{}));
RT('hammer',1,{stick:1,stone:2,rope:1},'bench','tool',4);
RT('saw',1,{stick:2,flint_blade:3,rope:2},'bench','tool',6);
RT('tongs',1,{stick:2,rope:1},'bench','tool',3);
RT('mortar',1,{stone:3},'bench','tool',5);
RT('porridge',1,{flour:1,pot_clean:1},'oven','food',24,{bg:1,gives:{pot:1}});
RT('veg_stew',1,{turnip:2,raw_meat:1,pot_clean:1,herb:1},'oven','food',50,{bg:1});
RT('meat_pie',1,{flour:2,raw_meat:1,herb:1},'oven','food',55,{bg:1});
RT('mushroom_soup',1,{mushroom:3,pot_clean:1},'oven','food',36,{bg:1});
RT('berry_jam',2,{berries:6,pot_clean:1},'oven','food',40,{bg:1,gives:{pot:1}});
RT('dried_fruit',2,{apple:2},'smoker','food',90,{bg:1});
RT('pickled_turnip',2,{turnip:3,pot_clean:1},'smoker','food',80,{bg:1,gives:{pot:1}});
RT('kebab',2,{raw_meat:1,herb:1,stick:1},'grill','food',26,{bg:1});
RT('herbal_tea',1,{herb:2,pot_clean:1},'lab','med',8,{tool:'mortar',gives:{pot:1}});
/* ---- winter ice: shallow water freezes and becomes walkable ---- */
const frozen=()=>seas===3&&snowK>.75;
{const _w=wdep;wdep=function(x,y){const d=_w(x,y);return(d>0&&d<.75&&frozen())?0:d}}
/* ---- water look: depth shade, ripples, shoreline foam, ice ---- */
{const _dg=drawGround;drawGround=function(l,r,t,b){
  _dg.apply(this,arguments);
  const bx=worldBox(l,r,t-24,b+24),ix0=Math.floor(bx[0])-1,ix1=Math.floor(bx[1])+1,iy0=Math.floor(bx[2])-1,iy1=Math.floor(bx[3])+1;
  const nx=ix1-ix0+2,ny=iy1-iy0+2,E=1.05,hs=HH/16,fz=frozen(),T=time;
  ctx.lineCap='round';
  for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){
    const a=j*nx+i,c=a+nx,x0=gvx[a],y0=gvy[a],x1=gvx[a+1],y1=gvy[a+1],x2=gvx[c+1],y2=gvy[c+1],x3=gvx[c],y3=gvy[c];
    const cx=(x0+x1+x2+x3)*.25,cy=(y0+y1+y2+y3)*.25;
    if(cx<l-50||cx>r+50||cy<t-30||cy>b+30)continue;
    const ix=ix0+i,iy=iy0+j,tl=tile(ix,iy);if(!tl.w)continue;
    const deep=tl.w===2,ice=fz&&!deep,ph=ix*.9+iy*1.3;
    const path=()=>{ctx.beginPath();ctx.moveTo(cx+(x0-cx)*E,cy+(y0-cy)*E);ctx.lineTo(cx+(x1-cx)*E,cy+(y1-cy)*E);ctx.lineTo(cx+(x2-cx)*E,cy+(y2-cy)*E);ctx.lineTo(cx+(x3-cx)*E,cy+(y3-cy)*E);ctx.closePath()};
    if(ice){path();ctx.fillStyle='rgba(215,235,248,.82)';ctx.fill();ctx.strokeStyle='rgba(120,160,190,.55)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx-6,cy-1);ctx.lineTo(cx+2,cy+2);ctx.lineTo(cx+8,cy-2);ctx.moveTo(cx+2,cy+2);ctx.lineTo(cx,cy+7);ctx.stroke()}
    else{
      const d=deep?clamp(wdep(ix+.5,iy+.5),.75,2.6):.3;
      path();ctx.fillStyle='rgba(8,30,60,'+(deep?(.05+(d-.75)*.2):0).toFixed(3)+')';if(deep)ctx.fill();
      if(!LITE){const w1=Math.sin(T*1.3+ph),w2=Math.sin(T*.9+ph*1.7);
      ctx.strokeStyle='rgba(255,255,255,'+(.10+.10*w1*w1).toFixed(3)+')';ctx.lineWidth=1.1;
      ctx.beginPath();ctx.moveTo(cx-9+w2*3,cy-2);ctx.quadraticCurveTo(cx-3,cy-5*hs+w1*1.4,cx+3,cy-2);ctx.quadraticCurveTo(cx+7,cy+1*hs,cx+11+w2*2,cy-1);ctx.stroke();
      if(((ix*7+iy*13)&7)===0){const s=.5+.5*Math.sin(T*3+ph);ctx.fillStyle='rgba(255,255,255,'+(.25*s).toFixed(2)+')';ctx.fillRect(cx+4,cy-3,2,2)}}
    }
    /* shoreline foam on edges that touch land */
    const nb=[tile(ix,iy-1),tile(ix+1,iy),tile(ix,iy+1),tile(ix-1,iy)];
    const ex=[[x0,y0,x1,y1],[x1,y1,x2,y2],[x2,y2,x3,y3],[x3,y3,x0,y0]];
    for(let q=0;q<4;q++)if(!nb[q].w){
      const e=ex[q],pu=.5+.5*Math.sin(T*1.7+ph*.5+q);
      const mx=(e[0]+e[2])/2,my=(e[1]+e[3])/2,ix2=cx+(mx-cx)*.86,iy2=cy+(my-cy)*.86;
      ctx.strokeStyle='rgba(255,255,255,'+(ice?.5:(.35+.35*pu)).toFixed(2)+')';ctx.lineWidth=ice?1.6:2.2-pu*.8;
      ctx.beginPath();ctx.moveTo(cx+(e[0]-cx)*.93+(ix2-mx)*.1,cy+(e[1]-cy)*.93+(iy2-my)*.1);ctx.lineTo(cx+(e[2]-cx)*.93+(ix2-mx)*.1,cy+(e[3]-cy)*.93+(iy2-my)*.1);ctx.stroke();
    }
  }
}}
