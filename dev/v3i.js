/* ===== v3i: realistic bundles + carry weight ===== */
const BUN={stick:{n:10,rope:1},log:{n:4,rope:1},plank:{n:6,rope:1},firewood:{n:6,rope:1},bone:{n:8,rope:1},fiber:{n:20,rope:0},herb:{n:10,rope:0},feather:{n:20,rope:0},arrow:{n:12,rope:0},tinder:{n:10,rope:0},seeds:{n:20,rope:0},wheat:{n:10,rope:0},reed:{n:10,rope:0}};
for(const id in BUN){
  if(!IT[id])continue;const b=BUN[id];
  IT['pk_'+id]={n:'حزمة '+IT[id].n,d:'حزمة من '+b.n+' '+IT[id].n+' مربوطة (تشغل خانة واحدة). اضغط «فكّ» لتعيدها.',pk:id,pn:b.n};
  STK['pk_'+id]=8;
  const base=IC[id]||IC.stone;
  IC['pk_'+id]=g=>{base(g);g.strokeStyle='#e6d29a';g.lineWidth=2.6;g.lineCap='round';g.beginPath();g.moveTo(10,14);g.lineTo(31,30);g.moveTo(10,30);g.lineTo(31,14);g.stroke();g.strokeStyle='#8a6a2a';g.lineWidth=1;g.stroke()};
}
/* weights (kg per unit) */
const WTK={stick:.4,log:5,plank:2.5,stone:2,flint:.8,clay:1.2,brick:2,fiber:.1,rope:.3,resin:.2,herb:.1,berries:.1,apple:.3,mushroom:.15,raw_meat:1,raw_fish:.7,cooked_meat:.6,cooked_fish:.5,bone:.5,hide:2,leather:1.2,feather:.02,fang:.1,charcoal:.4,firewood:1.2,copper_ore:2.5,tin_ore:2.5,iron_ore:3,copper_ingot:3,tin_ingot:3,iron_ingot:3.5,bronze_ingot:3.5,arrow:.1,flour:.8,bread:.4,wheat:.1,seeds:.02,pot:1.5,raw_pot:1.5,pot_water:2.5,pot_clean:2.5,waterskin_full:1.2,tinder:.05,flint_blade:.2,cloth:.3,turnip:.5};
function itemKg(s){
  const d=IT[s.id];if(!d)return 0;
  if(d.pk)return s.n*d.pn*(WTK[d.pk]||.5);
  if(/_kit$/.test(s.id))return s.n*8;
  return s.n*(WTK[s.id]!==undefined?WTK[s.id]:(d.dur?1.5:.5));
}
function carryKg(){let w=0;for(const s of inv)if(s)w+=itemKg(s);return w}
function carryCap(){return 45+Math.max(0,INV_N-15)*3}
{const _sm=spdMul;spdMul=function(){const r=_sm.apply(this,arguments),w=carryKg(),c=carryCap();return w>c?r*clamp(1-(w-c)/c*.9,.4,1):r}}
/* inventory UI: weight line + pack / unpack buttons */
{const _ri=renderInv;renderInv=function(){
  _ri.apply(this,arguments);if(!invOpen)return;
  const h=document.querySelector('#inv .col h2');
  if(h){let w=document.getElementById('v3w');if(!w){w=document.createElement('span');w.id='v3w';w.style.cssText='font:600 11px Rubik,sans-serif;margin-right:10px;color:#f1e7cf';h.appendChild(w)}
    const k=carryKg(),c=carryCap();w.textContent='الحمولة '+Math.round(k)+' / '+c+' كغ';w.style.color=k>c?'#ff8a6a':k>c*.8?'#ffd27a':'#cfe6b0'}
  const info=$('info'),s=inv[invSel];if(!s||!info)return;
  const row=info.querySelector('.row');if(!row)return;const b=BUN[s.id],d=IT[s.id];
  if(b&&s.n>=b.n){const bt=document.createElement('button');bt.className='btn alt';bt.dataset.pk=s.id;bt.textContent='احزم ×'+b.n+(b.rope?' (حبل)':'');row.appendChild(bt)}
  if(d&&d.pk){const bt=document.createElement('button');bt.className='btn';bt.dataset.unpk=s.id;bt.textContent='فكّ الحزمة';row.appendChild(bt)}
}}
document.getElementById('info').addEventListener('click',e=>{
  const p=e.target.closest('[data-pk]'),u=e.target.closest('[data-unpk]');
  if(p){const id=p.dataset.pk,b=BUN[id];
    if(countItem(id)<b.n){toast('تحتاج '+b.n+' '+IT[id].n,true);return}
    if(b.rope&&countItem('rope')<b.rope){toast('تحتاج حبلاً للربط',true);return}
    takeItem(id,b.n);if(b.rope)takeItem('rope',b.rope);
    const left=addItem('pk_'+id,1);if(left>0){addItem(id,b.n);if(b.rope)addItem('rope',b.rope);toast('لا مكان للحزمة',true);return}
    SFX.rope&&SFX.rope();SFX.pop&&SFX.pop();invSel=inv.findIndex(x=>x&&x.id==='pk_'+id);invDirty=true;renderInv()}
  else if(u){const id=u.dataset.unpk,d=IT[id];if(takeItem(id,1)<1)return;
    const left=addItem(d.pk,d.pn);if(left>0){dropItem(d.pk,left,P.x,P.y);drops[drops.length-1].nl=4+Math.random()*3;toast('سقط بعضها لضيق المكان')}
    SFX.pop&&SFX.pop();invSel=inv.findIndex(x=>x&&x.id===d.pk);invDirty=true;renderInv()}
});
