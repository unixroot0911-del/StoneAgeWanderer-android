#!/usr/bin/env python3
"""Inject dev/fauna_art.js + dev/fauna_sys.js into app/src/main/assets/game.html (idempotent) and apply source patches."""
import re,sys,os
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
p=os.path.join(root,'app/src/main/assets/game.html')
s=open(p,encoding='utf-8').read()
art=open(os.path.join(root,'dev/fauna_art.js'),encoding='utf-8').read()
sysj=open(os.path.join(root,'dev/fauna_sys.js'),encoding='utf-8').read()
B,E='/*FAUNA_BEGIN*/','/*FAUNA_END*/'
block=B+'\n'+art+'\n'+sysj+'\n'+E+'\n'
if B in s:
    s=re.sub(re.escape(B)+r'.*?'+re.escape(E)+r'\n',lambda m:block,s,flags=re.S)
else:
    m='/* auto fullscreen on first touch/click */'
    assert s.count(m)==1
    s=s.replace(m,block+m)

# ---- V3 block (after FAUNA) ----
v3=''.join(open(os.path.join(root,'dev/'+n),encoding='utf-8').read()+'\n' for n in ('v3a.js','v3b.js','v3c.js','v3d.js','v3e.js','v3f.js','v3g.js','v3h.js'))
V1,V2='/*V3_BEGIN*/','/*V3_END*/'
vblock=V1+'\n'+v3+V2+'\n'
if V1 in s:
    s=re.sub(re.escape(V1)+r'.*?'+re.escape(V2)+r'\n',lambda m:vblock,s,flags=re.S)
else:
    assert s.count(E+'\n')==1
    s=s.replace(E+'\n',E+'\n'+vblock)
def patch(old,new):
    global s
    if new in s: return
    if s.count(old)==0:
        print('WARN skipped (already patched?):',old[:50]);return
    assert s.count(old)==1,(old[:60],s.count(old))
    s=s.replace(old,new)
patch("W.dmg*(slam?1.6:1)*(.9+Math.random()*.2)","W.dmg*dmgMul()*(slam?1.6:1)*(.9+Math.random()*.2)")
patch("big=['deer','boar','wolf','bear','mammoth']","big=['deer','boar','wolf','bear','mammoth','sabertooth','bison']")
patch("l.push([e.nid,e.sp[0],","l.push([e.nid,ENTK[e.sp]||e.sp[0],")
patch("S.flag.crafted=1;SFX.done();","S.flag.crafted=1;xpGain((r.cat==='tool'||r.cat==='gear')?9:4);SFX.done();")
patch("  if(d.use==='map'){closeInv();mapToggle();SFX.pop();return}","  if(d.use==='map'){closeInv();mapToggle();SFX.pop();return}\n  if(d.use==='charm'){if(S.charm){toast('ترتدي القلادة بالفعل');return}s.n--;if(s.n<=0)inv[i]=null;S.charm=1;SFX.pop();banner('قلادة الناب: +15% ضرر');invDirty=true;renderInv();return}")
patch("""    else if(d.use==='map')act+='<button class="btn" data-a="use">افتح الخريطة</button>';""","""    else if(d.use==='map')act+='<button class="btn" data-a="use">افتح الخريطة</button>';
    else if(d.use==='charm')act+='<button class="btn" data-a="use">ارتدِ</button>';""")
patch("  if(Net.on)for(const q of Net.peers.values()){const x=px(q.rx)","  for(const q of ents){if(q.ally&&!q.dead){mmg.beginPath();mmg.arc(px(q.x),py(q.y),3.4*sc/1.6,0,6.283);mmg.fillStyle='#d6453a';mmg.fill();mmg.lineWidth=1.3;mmg.strokeStyle='#fff';mmg.stroke()}}\n  if(Net.on)for(const q of Net.peers.values()){const x=px(q.rx)")

# ---- V3 patches ----
patch("tsp*=spdMul()*envSpd();","tsp*=spdMul()*envSpd()*stSpd();")
patch("&&!P.air&&!P.swim;","&&!P.air&&!P.swim&&!P.stance;")
patch("else if(!P.air&&P.atk.n===0)S.stam=Math.min(stCap","else if(!P.air&&P.atk.n===0&&!P.swim)S.stam=Math.min(stCap")
if "  let target=100-night*70" in s:
    a=s.index("  let target=100-night*70");b=s.index("  if(S.torchT>0)S.torchT-=dt;")
    s=s[:a]+"  bodyStep(dt,nf,sh,tribe,run);\n"+s[b:]
patch("(seas===1?.05:0))*sl);","(seas===1?.05:0))*sl*thirstK());")
patch("S.hunger=Math.max(0,S.hunger-dt*(.095+","S.hunger=Math.max(0,S.hunger-dt*(.115+")
patch("S.thirst-dt*(.14+.05*(1-night)","S.thirst-dt*(.17+.05*(1-night)")
patch("    if(waterAt(nx,P.y)!==2)P.x=nx;else P.vx=0;\n    if(waterAt(P.x,ny)!==2)P.y=ny;else P.vy=0;\n    P.inWater=waterAt(P.x,P.y)===1?1:0;","    P.x=nx;P.y=ny;\n    P.wd=wdep(P.x,P.y);P.swim=P.wd>.85?1:0;P.inWater=P.wd>.12?1:0;")
patch("if(P.inWater)tsp*=.65;tsp*=spdMul();","if(P.swim)tsp*=.55;else if(P.inWater)tsp*=1-.5*(P.wd||0);tsp*=spdMul()*envSpd();")
patch("run=inp.m>.88&&!S.exh&&A.n===0&&!P.air;","run=inp.m>.88&&!S.exh&&A.n===0&&!P.air&&!P.swim;")
patch("function moveEnt(e,dt){\n  const nx=e.x+e.vx*dt,ny=e.y+e.vy*dt;","function moveEnt(e,dt){\n  const wm=entWater(e,dt),nx=e.x+e.vx*dt*wm,ny=e.y+e.vy*dt*wm;")
patch("  if(waterAt(nx,e.y)!==2)e.x=nx;else e.vx*=-.3;\n  if(waterAt(e.x,ny)!==2)e.y=ny;else e.vy*=-.3;","  e.x=nx;e.y=ny;")
patch("time-o.cutAt>=rg)reviveObj","time-o.cutAt>=rg*regK(o))reviveObj")
patch("time-o.fruitT>(seas===3?700:seas===0?160:240)","time-o.fruitT>bushRipeT()")
patch("c.pop=false;c.cool=time+60}","c.pop=false;c.cool=time+1500}")
s=s.replace("if(structs.length>24)structs.shift();","if(structs.length>40)structs.shift();")
patch("if(r.st==='bench'&&!stationNear('bench'))return'اقترب من الطاولة';","if(r.st!=='hand'&&!stationNear(r.st))return'اقترب من '+stName(r.st);")
patch("(r.st==='bench'?'طاولة · ':'يدوي · ')","(stName(r.st)+' · ')")
patch("$('stn').textContent=bn?'أنت قرب الطاولة: يمكنك الصناعة المتقدمة':'بلا طاولة: الصناعة اليدوية فقط';","$('stn').textContent=stnText();")
patch("S.flag.crafted=1;xpGain(","S.flag.crafted=1;stnHot(r);xpGain(")
patch("s.kind==='shelter'&&(S.energy<85||night>.45)","(s.kind==='shelter'||s.kind==='bed')&&(S.energy<85||night>.45)")
patch("'أنجزت '+done+' من '+QS.length+' · اليوم '","'اليوم '")
patch("mm.addEventListener('click',()=>{mapOn=false;mm.hidden=true;if(SFX.ui)SFX.ui()});","mm.addEventListener('click',()=>{mapClick()});")
patch("  const all=list.slice();","  const all=list.slice();shadeInject(all);")
patch("toast('جهّزت الموقد. أشعله بحشيش جاف وصوّان')","toast('جُهّز الموقد')")
patch("S.hp-=dmg;S.iT=.55;","S.hp-=dmg*1.15;S.iT=.55;")
patch("rnd()<.07+.09*night","rnd()<.09+.14*night")
patch("AC=ctx||new(window.AudioContext||window.webkitAudioContext)();","AC=ctx||new(window.AudioContext||window.webkitAudioContext)({latencyHint:'playback'});")
patch("master.gain.value=.9;","master.gain.value=.5;")
patch("comp.threshold.value=-16;comp.knee.value=14;comp.ratio.value=5;comp.attack.value=.004;comp.release.value=.25;","comp.threshold.value=-10;comp.knee.value=6;comp.ratio.value=14;comp.attack.value=.002;comp.release.value=.2;")
patch("mkIR(AC,3.4,2.7)","mkIR(AC,1.3,2.4)")
patch("rg.gain.value=.38;","rg.gain.value=.2;")
patch("(.11+.18*env.night+.10*env.danger)","(.05+.09*env.night+.05*env.danger)")
patch("scatter('flint',1,o.x,o.y);SFX.thud()}","scatter('flint',1,o.x,o.y);oreDrop(o);SFX.thud()}")
patch("case'herb':playAct('gather',.5);give('herb',1+(Math.random()<.4?1:0));","case'herb':playAct('gather',.5);give('herb',1+(Math.random()<.4?1:0));if(Math.random()<.3)give('seeds',1);")
s=s.replace("wid==='axe'","wk(wid)==='axe'").replace("wid==='spear_wood'","wk(wid)==='spear_wood'").replace("wid==='spear'","wk(wid)==='spear'") if "wk(wid)" not in s else s
patch("S.weapon!=='spear'&&S.weapon!=='spear_wood'","wk(S.weapon)!=='spear'&&wk(S.weapon)!=='spear_wood'")
s=s.replace("+' · '+SEAS[seas]+(rain>.3","+(rain>.3")
s=s.replace("banner('بدأ '+SEAS[seas]);toast(seas===3?'الشتاء: برد قارس. جهّز النار والطعام':seas===1?'الصيف: الطعام يفسد أسرع':seas===2?'الخريف: تتساقط الأوراق':'الربيع: تزدهر الأرض')","0")
for a,b in [("ents:110,aiRange:48,wildEvery:.14,wildMax:70,wildFar:40","ents:70,aiRange:30,wildEvery:.14,wildMax:45,wildFar:28"),("pcx-6;a<=pcx+6;a++)for(let b=pcy-6;b<=pcy+6;b++)","pcx-4;a<=pcx+4;a++)for(let b=pcy-4;b<=pcy+4;b++)"),("if(d<24||d>46)continue;","if(d<22||d>34)continue;"),(">72)){\n      if(e.tree)",">48)){\n      if(e.tree)")]:
    s=s.replace(a,b)
patch("    if(wk(wid)==='axe'||wk(wid)==='spear'||wk(wid)==='spear_wood'){\n      const sp=","    if(CWIMG[wid]&&cwDrawHand(wid,c0,c4))return;\n    if(wk(wid)==='axe'||wk(wid)==='spear'||wk(wid)==='spear_wood'){\n      const sp=")

def rep(a,b):
    global s
    if a in s: s=s.replace(a,b)
    elif b not in s: print('WARN rep miss:',a[:60])
rep("document.addEventListener('touchmove',e=>{if(e.target.closest&&(e.target.closest('#recs')||e.target.closest('#roster')||e.target.closest('.net-shell')))return;e.preventDefault()},{passive:false});",
    "document.addEventListener('touchmove',e=>{let n=e.target;while(n&&n!==document.body){if(n.nodeType===1&&n.scrollHeight>n.clientHeight+2){const oy=getComputedStyle(n).overflowY;if(oy==='auto'||oy==='scroll')return}n=n.parentNode}e.preventDefault()},{passive:false});")
s=re.sub(r"(\.panel\{width:min\(100%,780px\);[^\n]*?position:relative;)overflow:hidden\}",r"\1overflow-y:auto;overflow-x:hidden;touch-action:pan-y;-webkit-overflow-scrolling:touch}",s,count=1)
rep("const stackOf=id=>(IT[id].dur?1:20);",
    "const STK={log:4,stick:12,plank:6,stone:6,flint:8,clay:8,brick:6,fiber:16,rope:6,resin:8,herb:10,berries:10,apple:8,mushroom:8,raw_meat:3,raw_fish:4,cooked_meat:3,cooked_fish:4,smoked_meat:4,smoked_fish:4,bone:8,hide:3,leather:4,feather:20,fang:8,sinew:8,charcoal:8,firewood:6,tinder:12,arrow:12,seeds:20,wheat:10,flour:6,turnip:6,bread:4,copper_ore:6,tin_ore:6,iron_ore:5,copper_ingot:4,tin_ingot:4,iron_ingot:4,bronze_ingot:4,flint_blade:10,cloth:6,bandage:8,pot:3,raw_pot:3,pot_water:2,pot_clean:2,waterskin:1};\nconst stackOf=id=>(IT[id].dur?1:(STK[id]||(/_kit$/.test(id)?2:8)));")
rep("dropItem(s.id,s.n,P.x,P.y,s.d,s.f);inv[i]=null;","dropItem(s.id,s.n,P.x,P.y,s.d,s.f);drops[drops.length-1].nl=5+Math.random()*5;inv[i]=null;")
rep("if(live&&d.t>.55){","if(live&&d.t>(d.nl||.55)){")
rep("const rk=(keys.KeyE?1:0)-(keys.KeyQ?1:0);","const rk=0;")
rep("if(op.size===1){camA-=dx*.0085;camAT=camA;elev=","if(op.size===1){elev=")
rep("if(pinch){zoomK=clamp(zoomK*n.d/pinch.d,ZMIN,ZMAX);camA+=angDiff(n.a,pinch.a);camAT=camA}","if(pinch){zoomK=clamp(zoomK*n.d/pinch.d,ZMIN,ZMAX)}")
rep("camA=camAT=+j.a||0;","camA=camAT=0;")
rep("camA=d.cam.a;camAT=d.cam.at;","camA=camAT=0;")
rep("ZMIN=.72","ZMIN=.85")
rep("o.sx=sx;o.sy=sy;o.key=(vx+vy)*KD;list.push(o);\n    }\n  }\n  const hsc","if(o.k===0&&lodR2<1e8){const ddx=o.x-P.x,ddy=o.y-P.y;if(ddx*ddx+ddy*ddy>lodR2)continue}o.sx=sx;o.sy=sy;o.key=(vx+vy)*KD;list.push(o);\n    }\n  }\n  const hsc")
rep("  const pk=vkey(P.x,P.y),pp=proj(P.x,P.y,0);\n  const bx=worldBox(","  const lodR2=(zoomK<1.05||(typeof LITE!=='undefined'&&LITE))?(zoomK<.95?110:190):1e9;\n  const pk=vkey(P.x,P.y),pp=proj(P.x,P.y,0);\n  const bx=worldBox(")
open(p,'w',encoding='utf-8').write(s)
print('injected',len(block))
