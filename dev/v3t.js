/* ===== v3t: ruins / caches to discover ===== */
SNAME.cache='';
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);S.csites={};return r}}
{const _rs=restoreSnapshot;restoreSnapshot=function(d){const r=_rs.apply(this,arguments);const o=(d&&d.S)||{};if(!o.csites)S.csites={};return r}}
const CLOOT=[
 [[['stone',3],['flint',2],['stick',4],['fiber',3]],[['rope',2],['hide',2],['torch',1],['bone',3],['tinder',2]]],
 [[['spear',1],['flint_blade',1],['leather',2],['needle',1],['bandage',2],['jerky',3]],[['rope',3],['sinew',2],['resin',2],['dried_fish',3],['pot',1]]],
 [[['bronze_spear',1],['bronze_axe',1],['iron_axe',1],['iron_spear',1],['cloak',1]],[['leather',3],['bandage',3],['jerky',4],['torch',2]]]
];
function cacheOpen(s){
  if(s.open)return;s.open=1;S.csites=S.csites||{};if(s.cid)S.csites[s.cid]=2;
  const d=Math.hypot(s.x-S.sx,s.y-S.sy),tier=s.tier!=null?s.tier:(d<160?0:d<420?1:2),rnd=Math.random;
  const T=CLOOT[tier],main=T[0][(rnd()*T[0].length)|0],ex=T[1];
  const give=(it)=>{const id=it[0];if(!IT[id])return;const left=addItem(id,it[1]);if(left>0)dropItem&&dropItem(id,left,s.x,s.y)};
  if(s.meat){give(['raw_meat',4]);give(['hide',2]);give(['bone',3]);if(rnd()<.3&&IT.fang)give(['fang',1])}
  give(main);for(let i=0;i<2;i++)give(ex[(rnd()*ex.length)|0]);
  if(tier<2&&rnd()<.5)give(T[0][(rnd()*T[0].length)|0]);
  SFX.build&&SFX.build();xpGain&&xpGain(8+tier*6);
  for(let i=0;i<12;i++){const a=Math.random()*6.28;emit('puff',s.x+Math.cos(a)*.4,s.y+Math.sin(a)*.4,.3,{col:'rgba(190,170,130,.7)',size:6,vx:Math.cos(a)*1.8,vy:Math.sin(a)*1.8})}
  if(S.day>=2&&rnd()<.22){const a=rnd()*6.28,x=s.x+Math.cos(a)*11,y=s.y+Math.sin(a)*11;if(waterAt(x,y)===0){const e=mkEnt('wolf',x,y,{});SFX.heart&&SFX.heart()}}
}
{const _ds=drawStruct;drawStruct=function(o){
  if(o.kind!=='cache')return _ds.apply(this,arguments);
  const hs=HH/16,v=o.v|0,op=o.open;
  ctx.fillStyle='rgba(12,26,10,.26)';ctx.beginPath();ctx.ellipse(o.sx,o.sy+1,20,7*hs,0,0,TAU);ctx.fill();
  ctx.save();ctx.translate(o.sx,o.sy);ctx.scale(1.4,1.4);ctx.lineJoin='round';ctx.lineWidth=2.2;ctx.strokeStyle='#2b180d';
  if(v===0){ /* bone pile */
    for(let i=0;i<5;i++){const a=i*1.3+o.ph;ctx.beginPath();ctx.moveTo(Math.cos(a)*10-5,-3+Math.sin(a)*3);ctx.lineTo(Math.cos(a)*10+5,-3+Math.sin(a)*3-2);ctx.lineWidth=5;ctx.strokeStyle='#2b180d';ctx.stroke();ctx.lineWidth=2.6;ctx.strokeStyle=op?'#b9ab90':'#efe3c8';ctx.stroke()}
    ctx.lineWidth=2.2;ctx.strokeStyle='#2b180d';ctx.beginPath();ctx.ellipse(0,-9,8,7,0,0,TAU);ctx.fillStyle=op?'#b9ab90':'#efe3c8';ctx.fill();ctx.stroke();
    ctx.fillStyle='#2b180d';ctx.fillRect(-4,-11,3,4);ctx.fillRect(1,-11,3,4);
  }else if(v===1){ /* cairn */
    const R=[[0,-3,15,8],[-3,-12,11,7],[2,-20,7,5]];for(const r of R){ctx.beginPath();ctx.ellipse(r[0],r[1],r[2],r[3],0,0,TAU);ctx.fillStyle=op?'#6e6a60':'#8f8a7c';ctx.fill();ctx.stroke()}
  }else if(v===3){ /* ribcage */
    ctx.lineCap='round';for(let i=-3;i<=3;i++){const x=i*5.2;ctx.beginPath();ctx.moveTo(x,-2);ctx.quadraticCurveTo(x+(i<0?-5:5),-24,x*.55,-30);ctx.lineWidth=5.4;ctx.strokeStyle='#2b180d';ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle=op?'#b9ab90':'#efe3c8';ctx.stroke()}
    ctx.lineWidth=2.2;ctx.strokeStyle='#2b180d';ctx.beginPath();ctx.ellipse(-22,-5,9,6,0,0,TAU);ctx.fillStyle=op?'#b9ab90':'#efe3c8';ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(26,-3);ctx.lineTo(22,5);ctx.closePath();ctx.fillStyle=op?'#6b4a2a':'#8a6238';ctx.fill();ctx.stroke();
  }else{ /* hide bundle on stakes */
    ctx.beginPath();ctx.moveTo(-14,0);ctx.lineTo(-12,-30);ctx.moveTo(14,0);ctx.lineTo(12,-30);ctx.lineWidth=4;ctx.strokeStyle='#5a3a1c';ctx.stroke();
    ctx.lineWidth=2.2;ctx.strokeStyle='#2b180d';ctx.beginPath();ctx.moveTo(-13,-30);ctx.lineTo(13,-30);ctx.lineTo(10,-6);ctx.lineTo(-10,-6);ctx.closePath();ctx.fillStyle=op?'#7d6340':'#a68458';ctx.fill();ctx.stroke();
  }
  ctx.restore();
  if(!op&&Math.sin(time*2.2+o.ph)>.6){ctx.fillStyle='rgba(255,236,170,.9)';ctx.beginPath();ctx.arc(o.sx+Math.sin(time+o.ph)*6,o.sy-30,1.8,0,TAU);ctx.fill()}
}}
{const _g=getChunk;getChunk=function(cx,cy){const c=_g(cx,cy);
  if(c.cbd===undefined){c.cbd=1;
    try{
      const h=tabHash({cx:cx*7+3,cy:cy*5+1});
      if(S.alive&&(S.csites||(S.csites={}))&&(!Net.on||Net.role==='admin')&&h%1000<42&&Math.hypot(cx*CS-S.sx,cy*CS-S.sy)>45){
        const key=cx+','+cy;
        if(!S.csites[key]){S.csites[key]=1;const rnd=mulberry(h);
          for(let t=0;t<10;t++){const x=cx*CS+4+rnd()*(CS-8),y=cy*CS+4+rnd()*(CS-8);
            if(waterAt(x,y)===0&&freeSpot(x,y,1)){structs.push({isStruct:true,kind:'cache',cid:key,v:(rnd()*3)|0,x:x,y:y,r:.6,key:0,ph:rnd()*6.28,built:1,items:[],t:0,T:99,c:false,own:false,camp:1});break}}}
      }
    }catch(e){}
  }
  return c}}
