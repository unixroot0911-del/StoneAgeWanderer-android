/* ===== v3s: base defense: wall stakes + spike traps ===== */
SNAME.wall='';SNAME.spikes='';
IT.wall_kit={n:'سياج خشبي',d:'وتد غليظ يحجب الطريق. الأعداء يكسرونه.',place:'wall'};
IT.spikes_kit={n:'فخ أوتاد',d:'أوتاد مسنّنة تجرح من يمرّ عليها.',place:'spikes'};
IC.wall_kit=g=>{for(let i=0;i<4;i++){g.beginPath();g.roundRect(5+i*8,10+(i%2)*3,6,26,2);fs(g,i%2?'#a8743c':'#c18a4c')}};
IC.spikes_kit=g=>{for(let i=0;i<4;i++){g.beginPath();g.moveTo(6+i*9,36);g.lineTo(10+i*9,12);g.lineTo(14+i*9,36);g.closePath();fs(g,'#b98a52')}};
RR('wall_kit',2,{plank:2,rope:1},'bench','build',6);
RR('spikes_kit',1,{stick:6,rope:1},'hand','build',5);
{const _ps=placeStruct;placeStruct=function(kind){
  if(kind!=='wall'&&kind!=='spikes')return _ps.apply(this,arguments);
  const fx=P.x+Math.cos(P.face)*1.7,fy=P.y+Math.sin(P.face)*1.7;
  if(waterAt(fx,fy)!==0||!freeSpot(fx,fy,.5)){SFX.deny&&SFX.deny();return false}
  if(structs.some(s=>dist(s.x,s.y,fx,fy)<(s.kind==='wall'||s.kind==='spikes'?.95:1.8))||fires.some(f=>dist(f.x,f.y,fx,fy)<1.4)){SFX.deny&&SFX.deny();return false}
  const s={isStruct:true,kind:kind,x:fx,y:fy,r:kind==='wall'?.6:0,key:0,ph:Math.random()*6.28,built:0,items:[],t:0,T:1,c:false,own:true,camp:1,hp:kind==='wall'?70:14,mhp:kind==='wall'?70:14,wcd:0};
  structs.push(s);
  if(Net.on&&!Net.mute)netSend('s+',{k:kind,x:+fx.toFixed(2),y:+fy.toFixed(2)});
  SFX.build();playAct('craft',.5);
  for(let i=0;i<8;i++){const a=Math.random()*6.28;emit('puff',fx+Math.cos(a)*.4,fy+Math.sin(a)*.4,.1,{col:'rgba(160,130,90,.6)',size:5,vx:Math.cos(a)*1.3,vy:Math.sin(a)*1.3})}
  return true;
}}
function wdInit(s){if(s.hp==null){const w=s.kind==='wall';s.hp=s.mhp=w?70:14;s.wcd=0;if(w)s.r=.6;s.camp=1}}
function wdHit(s,d){
  s.hp-=d;s.flash=.15;
  for(let i=0;i<4;i++){const a=Math.random()*6.28;emit('puff',s.x,s.y,.5,{col:'rgba(170,125,70,.8)',size:4,vx:Math.cos(a)*2,vy:Math.sin(a)*2})}
  if(s.hp<=0){const i=structs.indexOf(s);if(i>=0)structs.splice(i,1);SFX.snap&&SFX.snap(s)}
}
/* block ground ents */
{const _me=moveEnt;moveEnt=function(e,dt){
  _me.apply(this,arguments);
  if(e.sp==='butterfly'||e.sp==='fish'||(e.sp==='bird'&&e.st==='fly'))return;
  for(const s of structs){if(s.kind!=='wall')continue;
    const dx=e.x-s.x,dy=e.y-s.y;if(Math.abs(dx)>2||Math.abs(dy)>2)continue;
    const d=Math.hypot(dx,dy),R=.6+e.r*.7;if(d<R&&d>1e-4){e.x+=dx/d*(R-d);e.y+=dy/d*(R-d)}}
}}
/* hunters chop walls; spikes hurt */
{const _ah=AI.hunter;AI.hunter=function(e,dt){
  _ah.apply(this,arguments);
  if(e.mode!=='hunt'&&e.mode!=='raid')return;
  e.wc=Math.max(0,(e.wc||0)-dt);if(e.wc>0)return;
  for(const s of structs){if(s.kind!=='wall')continue;
    if(Math.abs(s.x-e.x)<1.6&&Math.abs(s.y-e.y)<1.6&&dist(s.x,s.y,e.x,e.y)<1.35){wdInit(s);wdHit(s,9);e.wc=1.3;halt(e,dt);break}}
}}
{const _u=update;update=function(dt){
  _u.apply(this,arguments);
  for(const s of structs){if((s.kind==='wall'||s.kind==='spikes')&&s.hp==null)wdInit(s)}
  if(S.alive){
    const T=(WD_T=(typeof WD_T==='number'?WD_T:0)-dt);
    if(T<=0){WD_T=.7;
      for(const s of structs){if(s.kind!=='spikes'||s.built<1)continue;
        for(const e of ents){if(e.dead||e.sp==='butterfly'||e.sp==='bird'||e.sp==='fish')continue;
          if(Math.abs(e.x-s.x)<.8&&Math.abs(e.y-s.y)<.8&&dist(e.x,e.y,s.x,s.y)<.75){
            hurtEnt(e,8,null,0,0);s.hp-=1;SFX.snap&&SFX.snap(s);
            if(s.hp<=0){const i=structs.indexOf(s);if(i>=0)structs.splice(i,1);break}}}}}
  }
}}
var WD_T=0;
/* drawing */
{const _ds=drawStruct;drawStruct=function(o){
  if(o.kind!=='wall'&&o.kind!=='spikes')return _ds.apply(this,arguments);
  const k=Math.min(1,o.built),e=1-Math.pow(1-k,3),hs=HH/16,dm=o.hp!=null?o.hp/o.mhp:1;
  ctx.fillStyle='rgba(12,26,10,.24)';ctx.beginPath();ctx.ellipse(o.sx,o.sy+1,o.kind==='wall'?22:16,6*hs,0,0,TAU);ctx.fill();
  ctx.save();ctx.translate(o.sx,o.sy);ctx.lineJoin='round';ctx.lineWidth=2;ctx.strokeStyle='#2b180d';
  if(o.kind==='wall'){
    for(let i=-1;i<=1;i++){const h=(34+((i+o.ph*3|0)&1)*6-(1-dm)*10)*e,x=i*10;
      ctx.beginPath();ctx.moveTo(x-6,0);ctx.lineTo(x-6,-h+5);ctx.lineTo(x,-h-3);ctx.lineTo(x+6,-h+5);ctx.lineTo(x+6,0);ctx.closePath();
      ctx.fillStyle=i%2?'#a8743c':'#c18a4c';ctx.fill();ctx.stroke()}
    if(o.flash>0){o.flash-=.016;ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(-16,-34,32,34)}
  }else{
    for(let i=-1;i<=1;i++)for(let j=0;j<2;j++){const x=i*9+j*4-2,y=-j*5,h=16*e;
      ctx.beginPath();ctx.moveTo(x-3.5,y);ctx.lineTo(x,y-h);ctx.lineTo(x+3.5,y);ctx.closePath();ctx.fillStyle='#c9a064';ctx.fill();ctx.stroke()}
  }
  ctx.restore();
}}
