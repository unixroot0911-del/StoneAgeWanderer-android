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
v3=''.join(open(os.path.join(root,'dev/'+n),encoding='utf-8').read()+'\n' for n in ('v3a.js','v3b.js','v3c.js','v3d.js','v3e.js','v3f.js','v3g.js'))
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
open(p,'w',encoding='utf-8').write(s)
print('injected',len(block))
