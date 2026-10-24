/* ===== V3 (part D): crafting ONLY at stations (inventory = recipe guide) ===== */
{const M={knife:'bench',axe:'bench',spear_wood:'bench',torch:'bench',needle:'bench',plank:'bench',spear:'bench',bow:'bench',mapbook:'bench',waterskin:'tanner',cloak:'tanner',fur_coat:'tanner',backpack:'tanner',raw_pot:'kiln',bandage:'loom',arrow:'anvil',fang_charm:'anvil',oven_kit:'kiln',filter_kit:'kiln',bed_kit:'loom',firewood:'hand'};
  for(const r of REC){if((r.st==='hand'||r.st==='bench')&&M[r.out])r.st=M[r.out]}
  const bk=REC.find(r=>r.out==='bench_kit');if(bk)bk.in={log:4,rope:3,stone:3};
  const sk=REC.find(r=>r.out==='shelter_kit');if(sk)sk.in={plank:6,stick:8,hide:3,rope:4};
}
STNAME_ALL.hand='بالأيدي (بدائي)';
let recStn=null;
const STN_ICO=k=>k==='bench'?'bench_kit':STN[k].kit;
{const _fa=findAct;findAct=function(){
  _fa.apply(this,arguments);
  if(actC||!S.alive||P.state!=='live'||job||mg||sleeping)return;
  let b=null,bd=2.7;
  for(const s of structs){if(s.built<1||!(s.kind==='bench'||STN[s.kind]))continue;const d=dist(s.x,s.y,P.x,P.y);if(d<bd){bd=d;b=s}}
  if(b)actC={t:'stn',s:b,lbl:'اصنع: '+stName(b.kind),ico:STN_ICO(b.kind),x:b.x,y:b.y};
}}
{const _da=doAct;doAct=function(){
  const c=actC;
  if(c&&c.t==='stn'&&!mg&&!job&&P.state==='live'){aInit();recStn=c.s.kind;openInv();return}
  return _da.apply(this,arguments);
}}
{const _ci=closeInv;closeInv=function(){recStn=null;return _ci.apply(this,arguments)}}
{const _sc=startCraft;startCraft=function(i){const r=REC[i];if(r&&r.st!=='hand'&&recStn!==r.st){toast('اصنعه عند '+stName(r.st),true);return}return _sc.apply(this,arguments)}}
{const _ri=renderInv;renderInv=function(){
  _ri.apply(this,arguments);if(!invOpen)return;
  const tabs=$('tabs'),recs=$('recs'),st=$('stn');
  const row=(r,i,en)=>{const pr=recProblem(r);const lock=!en||pr;
    return '<div class="rec'+(lock?' lock':'')+'"><img alt="" src="'+iconURL(r.out)+'"><div><div class="nm">'+IT[r.out].n+(r.n>1?' ×'+r.n:'')+'</div><div class="ing">'+
    Object.keys(r.in).map(k=>'<span class="'+(countItem(k)>=r.in[k]?'':'no')+'"><img alt="" src="'+iconURL(k)+'">'+countItem(k)+'/'+r.in[k]+'</span>').join('')+
    (r.tool?'<span class="'+(countItem(r.tool)>0?'':'no')+'"><img alt="" src="'+iconURL(r.tool)+'"> أداة</span>':'')+
    '</div><div class="meta">'+stName(r.st)+' · '+(r.mg?'مهارة':r.t+' ث')+(en&&pr&&pr!=='المواد ناقصة'?' · '+pr:'')+'</div></div>'+
    (en?'<button class="btn" data-c="'+i+'"'+(pr?' disabled':'')+'>اصنع</button>':'<span style="font-size:11px;opacity:.7;padding:0 6px">'+(r.st==='hand'?'':'في المحطة')+'</span>')+'</div>'};
  if(recStn){
    tabs.style.display='none';
    const d=recStn==='bench'?'اصنع الأدوات والأسلحة وأدوات البناء هنا.':STN[recStn].d;
    st.textContent=stName(recStn)+' — '+d;
    recs.innerHTML=REC.map((r,i)=>[r,i]).filter(o=>o[0].st===recStn).map(o=>row(o[0],o[1],true)).join('')||'<div style="padding:10px;opacity:.7">لا وصفات هنا</div>';
  }else{
    tabs.style.display='';
    st.textContent='دليل الوصفات — الصناعة تتم عند المحطات فقط (اقترب من محطة واضغط "اصنع")';
    recs.innerHTML=REC.map((r,i)=>[r,i]).filter(o=>o[0].cat===recTab).map(o=>row(o[0],o[1],o[0].st==='hand')).join('');
  }
}}
