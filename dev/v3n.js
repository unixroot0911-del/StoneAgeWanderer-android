/* ===== v3n: storage chest, fishing rod, volume ===== */
SNAME.chest='الصندوق';SNAME.rod='';
IT.chest_kit={n:'صندوق خشبي',d:'خزّن فيه أغراضك. يبقى في مكانه.',place:'chest'};
IT.fishing_rod={n:'صنارة صيد',d:'عصا وخيط وخطّاف عظمي. استعملها عند الماء.',place:'rod'};
IC.chest_kit=g=>{g.beginPath();g.roundRect(6,20,28,16,3);fs(g,'#a8743c');g.beginPath();g.roundRect(6,10,28,12,5);fs(g,'#c18a4c');g.fillStyle='#2b180d';g.fillRect(6,20,28,2.4);g.fillStyle='#e8c14e';g.fillRect(17,18,6,7)};
IC.fishing_rod=g=>{dbl(g,[[8,36],[32,6]],3.2,'#9a6a38');dbl(g,[[32,6],[34,24]],1.1,'#e8e0cc');g.beginPath();g.arc(34,28,3,0,TAU);fs(g,'rgba(0,0,0,0)',2.2)};
RR('chest_kit',1,{plank:5,rope:2},'bench','build',8);
RR('fishing_rod',1,{stick:2,rope:1,bone:1},'hand','tool',6);

/* ---- chest: drawing ---- */
{const _ds=drawStruct;drawStruct=function(o){
  if(o.kind!=='chest')return _ds.apply(this,arguments);
  const hs=HH/16,k=Math.min(1,o.built),e=1-Math.pow(1-k,3);
  ctx.fillStyle='rgba(12,26,10,.26)';ctx.beginPath();ctx.ellipse(o.sx,o.sy+1,20,7*hs,0,0,TAU);ctx.fill();
  ctx.save();ctx.translate(o.sx,o.sy);ctx.scale(1,.25+.75*e);ctx.lineJoin='round';ctx.lineWidth=2.4;ctx.strokeStyle='#2b180d';
  ctx.beginPath();ctx.roundRect(-18,-20,36,20,3);ctx.fillStyle='#a8743c';ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.roundRect(-18,-30,36,12,5);ctx.fillStyle='#c18a4c';ctx.fill();ctx.stroke();
  ctx.strokeStyle='rgba(60,30,10,.45)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-9,-30);ctx.lineTo(-9,0);ctx.moveTo(9,-30);ctx.lineTo(9,0);ctx.stroke();
  ctx.fillStyle='#e8c14e';ctx.strokeStyle='#2b180d';ctx.lineWidth=1.6;ctx.beginPath();ctx.roundRect(-3.5,-22,7,8,1.5);ctx.fill();ctx.stroke();
  ctx.restore();
}}
/* ---- chest: interaction ---- */
const mxChestHtml='<div class="net-shell" dir="rtl" lang="ar" style="width:min(640px,96vw)"><div class="net-head"><div><div class="net-kick">STORAGE</div><h2>الصندوق</h2></div><button id="cbClose" class="net-x" type="button">✕</button></div>'+
  '<div class="admin-h">في الصندوق</div><div id="cbBox" class="cbgrid"></div><div class="admin-h">في حقيبتك</div><div id="cbBag" class="cbgrid"></div></div>';
{const d=document.createElement('div');d.id='cbox';d.hidden=true;d.innerHTML=mxChestHtml;document.body.appendChild(d);
 const st=document.createElement('style');st.textContent='#cbox{position:fixed;inset:0;z-index:66;background:rgba(10,6,3,.78);display:grid;place-items:center}#cbox[hidden]{display:none}.cbgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(54px,1fr));gap:6px;min-height:58px;margin:6px 0}.cbc{position:relative;aspect-ratio:1;border-radius:10px;background:rgba(0,0,0,.3);border:2px solid rgba(241,231,207,.22);padding:0;display:grid;place-items:center;cursor:pointer;touch-action:manipulation}.cbc img{width:80%;height:80%;object-fit:contain;pointer-events:none}.cbc b{position:absolute;right:4px;bottom:2px;font:700 12px system-ui;color:#fff;text-shadow:0 1px 2px #000}#mg .mgt,#mg .mgs{display:none!important}';
 document.head.appendChild(st)}
let cbS=null;
function cbIcon(id){try{const im=dImg(id);return im&&im.src?im.src:''}catch(e){return ''}}
function cbRender(){
  if(!cbS)return;const box=cbS.box=cbS.box||{};
  const cell=(id,n,a)=>'<button class="cbc" data-'+a+'="'+id+'" type="button"><img alt="" src="'+cbIcon(id)+'"><b>'+n+'</b></button>';
  $('cbBox').innerHTML=Object.keys(box).filter(k=>box[k]>0).map(k=>cell(k,box[k],'out')).join('');
  const bag={};for(const s of inv)if(s)bag[s.id]=(bag[s.id]||0)+s.n;
  $('cbBag').innerHTML=Object.keys(bag).map(k=>cell(k,bag[k],'in')).join('');
}
function mxChestOpen(s){cbS=s;s.box=s.box||{};$('cbox').hidden=false;cbRender();if(SFX.ui)SFX.ui()}
function cbSync(){if(Net.on&&cbS)netSend('cx',{x:+cbS.x.toFixed(2),y:+cbS.y.toFixed(2),b:cbS.box})}
$('cbox').addEventListener('click',e=>{
  if(e.target===$('cbox')||e.target.id==='cbClose'){$('cbox').hidden=true;cbS=null;return}
  const b=e.target.closest('.cbc');if(!b||!cbS)return;const box=cbS.box;
  if(b.dataset.in){const id=b.dataset.in,n=countItem(id);if(n>0){takeItem(id,n);box[id]=(box[id]||0)+n;if(SFX.pop)SFX.pop()}}
  else if(b.dataset.out){const id=b.dataset.out,n=box[id]||0;if(n>0){const left=addItem(id,n);box[id]=left;if(left<n&&SFX.pop)SFX.pop();else if(SFX.deny)SFX.deny();if(!box[id])delete box[id]}}
  invDirty=true;cbRender();cbSync();
});
setInterval(()=>{if(cbS&&!$('cbox').hidden&&Math.hypot(cbS.x-P.x,cbS.y-P.y)>3.4){$('cbox').hidden=true;cbS=null}},500);
{const _h=netHandle;netHandle=function(m){
  if(m&&m.t==='cx'){const s=structs.find(q=>q.kind==='chest'&&Math.hypot(q.x-m.x,q.y-m.y)<.6);if(s){s.box=m.b||{};if(cbS===s)cbRender()}return}
  return _h.apply(this,arguments)}}
/* ---- fishing ---- */
{const _ps=placeStruct;placeStruct=function(kind){if(kind==='rod'){mxFishStart();return false}return _ps.apply(this,arguments)}}
function mxFishStart(){
  const w=nearWater();
  if(!w||job||mg||!S.alive||P.state!=='live'){if(SFX.deny)SFX.deny();return}
  P.vx=P.vy=0;P.faceT=Math.atan2(w[1]-P.y,w[0]-P.x);
  job={t:0,T:5+Math.random()*10,nx:0,x:P.x,y:P.y,title:'',snd:'rope',fin(){
    SFX.drink();for(let i=0;i<6;i++)emit('puff',w[0],w[1],.15,{col:'rgba(150,200,240,.8)',size:3});
    startMG({title:'',tries:1,need:1,w:.3,sp:1.7,snd:'knap',done(n){if(n>0){give('raw_fish',1+(Math.random()<.25?1:0));if(SFX.done)SFX.done()}else if(SFX.deny)SFX.deny()}});
  }};
}
/* ---- volume slider in the pause menu ---- */
{let v=1;try{v=+(localStorage.getItem('saw-vol')||1)}catch(e){}
 const pa=document.querySelector('#pauseMenu .pause-actions');
 if(pa){const r=document.createElement('input');r.type='range';r.min=0;r.max=100;r.value=Math.round(v*100);r.style.cssText='width:100%;margin:6px 0';r.setAttribute('aria-label','الصوت');
  r.addEventListener('input',()=>{v=r.value/100;try{localStorage.setItem('saw-vol',v)}catch(e){}});pa.insertBefore(r,pa.firstChild)}
 setInterval(()=>{try{if(typeof master!=='undefined'&&master)master.gain.value=.5*v}catch(e){}},400)}
