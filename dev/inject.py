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
def patch(old,new):
    global s
    if new in s: return
    assert s.count(old)==1,(old[:60],s.count(old))
    s=s.replace(old,new)
patch("W.dmg*(slam?1.6:1)*(.9+Math.random()*.2)","W.dmg*dmgMul()*(slam?1.6:1)*(.9+Math.random()*.2)")
patch("if(P.inWater)tsp*=.65;","if(P.inWater)tsp*=.65;tsp*=spdMul();")
patch("big=['deer','boar','wolf','bear','mammoth']","big=['deer','boar','wolf','bear','mammoth','sabertooth','bison']")
patch("l.push([e.nid,e.sp[0],","l.push([e.nid,ENTK[e.sp]||e.sp[0],")
patch("S.flag.crafted=1;SFX.done();","S.flag.crafted=1;xpGain((r.cat==='tool'||r.cat==='gear')?9:4);SFX.done();")
patch("  if(d.use==='map'){closeInv();mapToggle();SFX.pop();return}","  if(d.use==='map'){closeInv();mapToggle();SFX.pop();return}\n  if(d.use==='charm'){if(S.charm){toast('ترتدي القلادة بالفعل');return}s.n--;if(s.n<=0)inv[i]=null;S.charm=1;SFX.pop();banner('قلادة الناب: +15% ضرر');invDirty=true;renderInv();return}")
patch("""    else if(d.use==='map')act+='<button class="btn" data-a="use">افتح الخريطة</button>';""","""    else if(d.use==='map')act+='<button class="btn" data-a="use">افتح الخريطة</button>';
    else if(d.use==='charm')act+='<button class="btn" data-a="use">ارتدِ</button>';""")
patch("  if(Net.on)for(const q of Net.peers.values()){const x=px(q.rx)","  for(const q of ents){if(q.ally&&!q.dead){mmg.beginPath();mmg.arc(px(q.x),py(q.y),3.4*sc/1.6,0,6.283);mmg.fillStyle='#d6453a';mmg.fill();mmg.lineWidth=1.3;mmg.strokeStyle='#fff';mmg.stroke()}}\n  if(Net.on)for(const q of Net.peers.values()){const x=px(q.rx)")
open(p,'w',encoding='utf-8').write(s)
print('injected',len(block))
