/* ===== v3p: head and feet gear ===== */
IT.hide_cap={n:'قلنسوة جلد',d:'تحمي رأسك: ضربات أخف.',use:'charm',slot:'head'};
IT.hide_boots={n:'حذاء جلد',d:'خطوة أسرع، ولدغات الأفاعي أقل أثراً.',use:'charm',slot:'feet'};
IC.hide_cap=g=>{g.beginPath();g.moveTo(8,26);g.quadraticCurveTo(10,8,20,8);g.quadraticCurveTo(30,8,32,26);g.closePath();fs(g,'#a8743c');g.beginPath();g.roundRect(6,24,28,6,3);fs(g,'#7a4c24')};
IC.hide_boots=g=>{g.beginPath();g.moveTo(12,8);g.lineTo(22,8);g.lineTo(23,24);g.lineTo(33,28);g.lineTo(33,34);g.lineTo(10,34);g.closePath();fs(g,'#a8743c');g.fillStyle='#7a4c24';g.fillRect(10,31,23,3)};
RR('hide_cap',1,{hide:2,rope:1},'bench','gear',5,{tool:'needle',snd:'rope'});
RR('hide_boots',1,{hide:3,rope:2},'bench','gear',7,{tool:'needle',snd:'rope'});
{const _us=useSlot;useSlot=function(i){
  const s=inv[i],d=s&&IT[s.id];
  if(!(d&&d.slot))return _us.apply(this,arguments);
  const id=s.id;S.gear=S.gear||{};const old=S.gear[d.slot];
  s.n--;if(s.n<=0)inv[i]=null;S.gear[d.slot]=id;
  if(old){const left=addItem(old,1);if(left>0)dropItem(old,left,P.x,P.y)}
  invDirty=true;if(SFX.pop)SFX.pop();gearRender();
}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);S.gear={};gearRender();return r}}
{const _rs=restoreSnapshot;restoreSnapshot=function(){const r=_rs.apply(this,arguments);gearRender();return r}}
{const _hp=hitPlayer;hitPlayer=function(dmg,src,kind,kx,ky,poison){
  const g=S.gear||{};
  if(g.head)dmg*=.88;
  if(poison&&g.feet&&Math.random()<.7)poison=0;
  return _hp.call(this,dmg,src,kind,kx,ky,poison)}}
{const _sm=spdMul;spdMul=function(){const r=_sm.apply(this,arguments);return(S.gear&&S.gear.feet)?r*1.05:r}}
{const row=document.createElement('div');row.id='gearRow';
 row.style.cssText='position:fixed;z-index:7;top:calc(env(safe-area-inset-top,0px) + 150px);left:calc(env(safe-area-inset-left,0px) + 12px);display:flex;gap:6px';
 document.body.appendChild(row);
 row.addEventListener('click',e=>{const b=e.target.closest('[data-g]');if(!b)return;const k=b.dataset.g,id=S.gear&&S.gear[k];if(!id)return;
  const left=addItem(id,1);if(left>0)dropItem(id,left,P.x,P.y);delete S.gear[k];invDirty=true;if(SFX.pop)SFX.pop();gearRender()})}
function gearRender(){
  const row=$('gearRow');if(!row)return;const g=S.gear||{};
  row.innerHTML=['head','feet'].filter(k=>g[k]).map(k=>'<button data-g="'+k+'" type="button" style="width:30px;height:30px;padding:2px;border-radius:8px;border:2px solid rgba(241,231,207,.35);background:rgba(0,0,0,.35)"><img alt="" style="width:100%;height:100%;pointer-events:none" src="'+dImg(g[k]).src+'"></button>').join('');
}
body_inmenu_fix:{const st=document.createElement('style');st.textContent='body.inmenu #gearRow{display:none}';document.head.appendChild(st)}
