/* ===== v3r: tablets of the ancestors and the far altar — a reason to cross the world ===== */
const HBT_DIRS=['الشرق','الجنوب الشرقي','الجنوب','الجنوب الغربي','الغرب','الشمال الغربي','الشمال','الشمال الشرقي'];
function altarInit(){
  const a=Math.random()*6.28,d=650+Math.random()*250;
  S.altar={x:S.sx+Math.cos(a)*d,y:S.sy+Math.sin(a)*d,px:null,py:null};
}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);S.tab={};S.tsites={};S.altarDone=0;altarInit();return r}}
{const _rs=restoreSnapshot;restoreSnapshot=function(d){const r=_rs.apply(this,arguments);const o=(d&&d.S)||{};if(!o.tab)S.tab={};if(!o.tsites)S.tsites={};if(!o.altar)altarInit();return r}}
HB.push({k:'tablets',t:'ألواح الأسلاف',h:'<p>ألواح حجرية نقشها من سبقوك. كل لوح تقرؤه يقرّبك من مكان بعيد: مذبحٌ تُضاء عنده النار القديمة. كلما قرأت ألواحاً أكثر صارت إشاراتها أدقّ.</p>',flag:'tablets',dyn:'tablets'});
function hbTablets(){
  const ks=Object.keys(S.tab||{});if(!ks.length)return '';
  let h='<h4>ما قرأتَه</h4>';ks.forEach((k,i)=>{h+='<p><b>لوح '+(i+1)+':</b> '+S.tab[k].txt+'</p>'});
  if(S.altarDone)h+='<p><b>أُضيء المذبح.</b></p>';
  return h;
}
function tabHint(x,y,n){
  const al=S.altar;let dx=al.x-x,dy=al.y-y;const d=Math.hypot(dx,dy);
  let ang=Math.atan2(dy,dx);
  const err=n>=5?0:(Math.random()-.5)*(n<=2?1.6:.7);ang+=err;
  const q=n<=2?2:1;                         /* coarse: 4 directions, fine: 8 */
  let idx=Math.round(((ang+6.2832)%6.2832)/(Math.PI/4))%8;if(q===2)idx=Math.round(idx/2)*2%8;
  const dir=HBT_DIRS[idx];
  const far=d<150?'ليس بعيداً':d<400?'مسيرة نصف يوم':d<700?'مسيرة يوم كامل':'مسيرة أيام';
  if(n>=5)return 'المذبح نحو '+dir+'، على بعد نحو '+(Math.round(d/50)*50)+' خطوة.';
  if(n>=3)return 'المذبح نحو '+dir+'، '+far+'.';
  return 'يقال إن النار القديمة تُضاء بعيداً نحو '+dir+'.';
}
function mxTablet(s){
  const id=s.tid||(s.x.toFixed(0)+','+s.y.toFixed(0));
  if(!S.tab[id]){S.tab[id]={x:s.x,y:s.y,txt:tabHint(s.x,s.y,Object.keys(S.tab).length+1)};(S.dis||(S.dis={})).tablets=1}
  if(SFX.chime)SFX.chime();
  setTimeout(()=>{hbCur='tablets';hbShow()},500);
}
function mxAltar(s){
  if(S.altarDone){if(SFX.chime)SFX.chime();return}
  if(!(S.torchT>0)){if(SFX.deny)SFX.deny();return}
  S.altarDone=1;S.won=1;
  fires.push({isFire:true,x:s.x,y:s.y-1,fuel:99999,ph:0,cook:[],key:0,smk:0,lit:true,age:100,used:true,own:false,camp:1});
  for(let i=0;i<26;i++)emit('spark',s.x+(Math.random()-.5)*2,s.y+(Math.random()-.5)*2,.4+Math.random(),{});
  shake=Math.max(shake,.8);if(SFX.quest)SFX.quest();
  const w=$('win');w.querySelector('h1').textContent='أضأتَ النار القديمة';w.querySelector('p').textContent='عند المذبح البعيد، بعد ما قرأت من ألواح الأسلاف، اشتعلت نار لم تُشعل منذ عصور. وصلتَ إلى ما لم يصل إليه أحد.';
  setTimeout(()=>{w.hidden=false},1200);
}
/* drawing */
{const _ds=drawStruct;drawStruct=function(o){
  if(o.kind!=='tablet'&&o.kind!=='altar')return _ds.apply(this,arguments);
  const hs=HH/16;
  ctx.fillStyle='rgba(12,26,10,.28)';ctx.beginPath();ctx.ellipse(o.sx,o.sy+1,o.kind==='altar'?34:18,(o.kind==='altar'?11:6)*hs,0,0,TAU);ctx.fill();
  ctx.save();ctx.translate(o.sx,o.sy);ctx.lineJoin='round';ctx.strokeStyle='#1d1a16';ctx.lineWidth=2.4;
  if(o.kind==='tablet'){
    ctx.beginPath();ctx.moveTo(-11,0);ctx.lineTo(-13,-34);ctx.quadraticCurveTo(0,-44,13,-34);ctx.lineTo(11,0);ctx.closePath();ctx.fillStyle='#8c8a82';ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(30,28,24,.7)';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(-6,-27);ctx.lineTo(6,-27);ctx.moveTo(-6,-21);ctx.lineTo(4,-21);ctx.moveTo(-6,-15);ctx.lineTo(6,-15);ctx.moveTo(0,-34);ctx.lineTo(0,-30);ctx.stroke();
    const gl=.5+.5*Math.sin(time*1.6+o.ph);ctx.fillStyle='rgba(255,210,120,'+(.08+.12*gl).toFixed(2)+')';ctx.beginPath();ctx.ellipse(0,-22,14,24,0,0,TAU);ctx.fill();
  }else{
    for(let i=0;i<7;i++){const a=i/7*TAU,x=Math.cos(a)*26,y=Math.sin(a)*10*hs;ctx.beginPath();ctx.roundRect(x-5,y-30,10,30,3);ctx.fillStyle='#8c8a82';ctx.fill();ctx.stroke()}
    ctx.beginPath();ctx.ellipse(0,-10,12,5,0,0,TAU);ctx.fillStyle='#6e6c64';ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(-8,-10);ctx.lineTo(-6,-20);ctx.lineTo(6,-20);ctx.lineTo(8,-10);ctx.closePath();ctx.fillStyle='#55534c';ctx.fill();ctx.stroke();
  }
  ctx.restore();
}}
/* placement, once per generated chunk */
const tabHash=c=>(Math.imul(c.cx,2654435761)^Math.imul(c.cy,40503)^0x9e3779b1)>>>0;
function altarPlace(c){
  const a=S.altar;if(!a||a.px!==null)return;
  if(Math.floor(a.x/CS)!==c.cx||Math.floor(a.y/CS)!==c.cy)return;
  for(let r=0;r<14;r+=1.5)for(let t=0;t<8;t++){const x=a.x+Math.cos(t)*r,y=a.y+Math.sin(t)*r;
    if(waterAt(x,y)===0&&freeSpot(x,y,1.6)){a.px=x;a.py=y;structs.push({isStruct:true,kind:'altar',x:x,y:y,r:1.2,key:0,ph:0,built:1,items:[],t:0,T:99,c:false,own:false,camp:1});return}}
}
{const _g=getChunk;getChunk=function(cx,cy){const c=_g(cx,cy);
  if(c.tbd===undefined){c.tbd=1;
    try{
      if(S.altar&&S.alive){altarPlace(c)}
      if(S.tsites&&(!Net.on||Net.role==='admin')&&tabHash(c)%1000<14&&Math.hypot(c.cx*CS-S.sx,c.cy*CS-S.sy)>70){
        const key=cx+','+cy;
        if(!S.tsites[key]){S.tsites[key]=1;const rnd=mulberry(tabHash(c));
          for(let t=0;t<10;t++){const x=c.cx*CS+4+rnd()*(CS-8),y=c.cy*CS+4+rnd()*(CS-8);
            if(waterAt(x,y)===0&&freeSpot(x,y,1)){structs.push({isStruct:true,kind:'tablet',tid:key,x:x,y:y,r:.7,key:0,ph:rnd()*6.28,built:1,items:[],t:0,T:99,c:false,own:false,camp:1});break}}}
      }
    }catch(e){}
  }
  return c}}
