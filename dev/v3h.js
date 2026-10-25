/* ===== v3h: custom weapon carving workshop (carpentry + forge) ===== */
const CGW=48,CGH=80,CPX=5;
const CMAT=[null,
 {k:'wood',n:'خشب',c:'#b9855a',d:1,h:.6,u:1,adj:'خشبي'},
 {k:'bone',n:'عظم',c:'#e6dcc2',d:1.2,h:.9,u:1.3,adj:'عظمي'},
 {k:'stone',n:'حجر',c:'#8d8a84',d:2,h:1.1,u:1.5,adj:'حجري'},
 {k:'flint',n:'صوّان',c:'#4d5663',d:2.2,h:1.5,u:.9,adj:'صوّاني'},
 {k:'copper',n:'نحاس',c:'#d9803a',d:3.4,h:.9,u:1.6,adj:'نحاسي'},
 {k:'bronze',n:'برونز',c:'#b8873a',d:3.8,h:1.4,u:2.6,adj:'برونزي'},
 {k:'iron',n:'حديد',c:'#7d8794',d:4.2,h:2,u:4,adj:'حديدي'}];
/* inventory item -> material + piece shape */
const CSRC={
 stick:{m:1,hw:2.6,hh:22,f:(u,v)=>Math.abs(u)<=2.6-.3*Math.abs(v)/22*0},
 log:{m:1,hw:6.5,hh:27,f:(u,v)=>Math.abs(u)<=6.5-(Math.abs(v)>24?2.5:0)},
 plank:{m:1,hw:4.5,hh:25,f:(u,v)=>Math.abs(u)<=4.5&&(Math.abs(v)<24||Math.abs(u)<3)},
 bone:{m:2,hw:4,hh:14,f:(u,v)=>Math.abs(u)<=(Math.abs(v)>10?4:2.6)},
 stone:{m:3,hw:11,hh:10,f:(u,v)=>{const a=Math.atan2(v,u);return (u*u)/(11*11)+(v*v)/(10*10)<=.85+.14*Math.sin(a*3+1.3)+.08*Math.sin(a*7)}},
 flint:{m:4,hw:6.5,hh:12,f:(u,v)=>Math.abs(u)<=6.5*(1-Math.pow(Math.abs(v)/12,1.6))},
 copper_ingot:{m:5,hw:7,hh:4.6,f:(u,v)=>Math.abs(u)<=7&&Math.abs(v)<=4.6&&!(Math.abs(u)>5.8&&Math.abs(v)>3.4)},
 bronze_ingot:{m:6,hw:7,hh:4.6,f:(u,v)=>Math.abs(u)<=7&&Math.abs(v)<=4.6&&!(Math.abs(u)>5.8&&Math.abs(v)>3.4)},
 iron_ingot:{m:7,hw:7,hh:4.6,f:(u,v)=>Math.abs(u)<=7&&Math.abs(v)<=4.6&&!(Math.abs(u)>5.8&&Math.abs(v)>3.4)}
};
const CST={carp:{t:'ورشة النجارة — نحت الخشب والعظم',mats:['stick','log','plank','bone'],tools:['knife','saw']},
           forge:{t:'ورشة الحدادة — نحت الحجر والمعدن',mats:['stick','log','plank','bone','stone','flint','copper_ingot','bronze_ingot','iron_ingot'],tools:['knife','saw','hammer']}};
const CTOOL={knife:{n:'السكين',r:2.1,ok:[1,2],hint:'تنحت الخشب والعظم'},saw:{n:'المنشار',r:1.15,ok:[1],hint:'قطع رفيع مستقيم في الخشب'},hammer:{n:'المطرقة',r:3.1,ok:[3,4,5,6,7],hint:'تهشّم الحجر وتطرق المعدن الساخن'}};
let CW=null; /* active session */
const CWG=()=>CW.g;
function cwNew(st){
  CW={st:st,M:new Uint8Array(CGW*CGH),B:new Uint8Array(CGW*CGH),used:{},tool:'move',cur:null,undo:[],chips:[],last:null,lastSnd:0,warn:'',rot:0};
}
function cwSnap(){CW.undo.push({M:CW.M.slice(),B:CW.B.slice(),used:Object.assign({},CW.used)});if(CW.undo.length>40)CW.undo.shift()}
function cwUse(id,n){if(takeItem(id,n)<n)return false;CW.used[id]=(CW.used[id]||0)+n;return true}
function cwRefund(to){ /* give back what is not in `to` */
  for(const k in CW.used){const left=CW.used[k]-((to&&to[k])||0);if(left>0){const r=addItem(k,left);if(r>0)dropItem(k,r,P.x,P.y)}}
}
/* ---- shape placement ---- */
function cwShape(id,cx,cy,rot){
  const d=CSRC[id],c=Math.cos(rot),s=Math.sin(rot),R=Math.ceil(Math.hypot(d.hw,d.hh))+1,out=[];
  for(let dy=-R;dy<=R;dy++)for(let dx=-R;dx<=R;dx++){
    const u=dx*c+dy*s,v=-dx*s+dy*c;
    if(Math.abs(u)<=d.hw+.5&&Math.abs(v)<=d.hh+.5&&d.f(u,v)){const x=Math.round(cx+dx),y=Math.round(cy+dy);if(x>=0&&y>=0&&x<CGW&&y<CGH)out.push(y*CGW+x)}
  }
  return out;
}
function cwStamp(cur){
  const M=CW.M;
  if(cur.placed)for(const i of cur.placed)if(M[i]===cur.m)M[i]=0;
  cur.full=cwShape(cur.id,cur.cx,cur.cy,cur.rot);cur.placed=[];cur.set=null;
  for(const i of cur.full)if(!M[i]){M[i]=cur.m;cur.placed.push(i)}
}
function cwDrop(id,cx,cy){
  if(!CSRC[id])return;
  if(countItem(id)<1){cwMsg('لا تملك '+IT[id].n);return}
  cwSnap();cwCommit();
  if(!cwUse(id,1))return;
  CW.cur={id:id,m:CSRC[id].m,cx:cx,cy:cy,rot:0,full:[],placed:[]};cwStamp(CW.cur);
  CW.tool='move';cwUI();cwDraw();cwStats();
  SFX.pop&&SFX.pop();
}
function cwCommit(){CW.cur=null}
/* ---- carving ---- */
function cwHot(){const s=stObj('forge');return !!(s&&s.fuel>0)}
function cwHas(t){return countItem(t)>0||(t==='knife'&&countItem('flint_blade')>0)}
function cwCarve(x0,y0,x1,y1){
  const T=CTOOL[CW.tool];if(!T)return;
  const M=CW.M,B=CW.B;let n=0,blocked=0;const steps=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)*1.5));
  for(let s=0;s<=steps;s++){
    const cx=x0+(x1-x0)*s/steps,cy=y0+(y1-y0)*s/steps,r=T.r;
    const ya=Math.max(0,Math.floor(cy-r-1)),yb=Math.min(CGH-1,Math.ceil(cy+r+1)),xa=Math.max(0,Math.floor(cx-r-1)),xb=Math.min(CGW-1,Math.ceil(cx+r+1));
    for(let y=ya;y<=yb;y++)for(let x=xa;x<=xb;x++){
      const d=Math.hypot(x-cx,y-cy);if(d>r)continue;const i=y*CGW+x,m=M[i];if(!m)continue;
      if(CW.tool==='hammer'&&d>r-1&&Math.random()<.45)continue;           /* chipped, ragged edge */
      if(T.ok.indexOf(m)<0){blocked=1;continue}
      if(m>=5&&!cwHot()){blocked=2;continue}
      if(m>=5&&!cwHas('tongs')){blocked=3;continue}
      M[i]=0;B[i]=0;n++;
      if(CW.chips.length<90&&Math.random()<.5)CW.chips.push({x:x+.5,y:y+.5,vx:(Math.random()-.5)*14,vy:-Math.random()*10-2,l:0,m:m});
    }
  }
  if(n){
    const t=performance.now();
    if(t-CW.lastSnd>(CW.tool==='knife'?70:CW.tool==='saw'?90:140)){CW.lastSnd=t;cwSound(CW.tool)}
    const f=stObj('forge');if(f&&n&&CW.tool==='hammer'&&f.fuel>0)f.fuel=Math.max(0,f.fuel-n*.02);
  }
  if(blocked===1)cwMsg(CW.tool==='hammer'?'':'هذه الأداة لا تؤثر في هذه المادة — '+(CW.tool==='knife'?'الحجر والمعدن يحتاجان المطرقة':'جرّب أداة أخرى'));
  if(blocked===2)cwMsg('المعدن بارد! أضف وقوداً إلى الحدّادة ثم اطرقه');
  if(blocked===3)cwMsg('تحتاج ملقطاً (Tongs) لإمساك المعدن الساخن');
  return n;
}
function cwSound(t){
  try{
    if(t==='knife')N(K0,{d:.09,f0:2600,f1:1500,type:'bandpass',q:2.2,g:.14,a:.01});
    else if(t==='saw'){N(K0,{d:.12,f0:1800,f1:1300,type:'bandpass',q:3,g:.12});O(K0,{d:.12,f0:210,f1:180,type:'sawtooth',lp:900,g:.05})}
    else{const m=CW&&CW.lastMat;if(m>=5){O(K0,{d:.4,f0:1180,f1:1090,type:'triangle',g:.16});O(K0,{d:.3,f0:2210,f1:2150,g:.05});N(K0,{d:.04,f0:4200,type:'highpass',g:.2})}else SFX.hitstone()}
  }catch(e){}
}
function cwClean(){ /* remove splinters that fell off the main body */
  const M=CW.M,B=CW.B,lab=new Int16Array(CGW*CGH),sizes=[0];let L=0;
  for(let i=0;i<M.length;i++){if(!M[i]||lab[i])continue;L++;let n=0;const st=[i];lab[i]=L;
    while(st.length){const c=st.pop();n++;const x=c%CGW,y=(c/CGW)|0;
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=CGW||yy>=CGH)continue;const j=yy*CGW+xx;if(M[j]&&!lab[j]){lab[j]=L;st.push(j)}}}
    sizes[L]=n}
  if(L<2)return L;
  let big=1;for(let i=2;i<=L;i++)if(sizes[i]>sizes[big])big=i;
  for(let i=0;i<M.length;i++){if(M[i]&&lab[i]!==big&&sizes[lab[i]]<14){M[i]=0;B[i]=0}}
  return L;
}
/* ---- binding with rope ---- */
function cwJoints(){
  const M=CW.M,B=CW.B,j=new Uint8Array(CGW*CGH);let un=0,tot=0;
  for(let y=0;y<CGH;y++)for(let x=0;x<CGW;x++){const i=y*CGW+x,m=M[i];if(!m)continue;
    [[1,0],[0,1]].forEach(d=>{const xx=x+d[0],yy=y+d[1];if(xx>=CGW||yy>=CGH)return;const k=yy*CGW+xx,n=M[k];if(n&&n!==m&&!(m===1&&n===1)){j[i]=1;j[k]=1}})}
  for(let i=0;i<j.length;i++)if(j[i]){tot++;if(!B[i])un++}
  return {j:j,un:un,tot:tot};
}
function cwBind(){
  const J=cwJoints();if(!J.un){cwMsg(J.tot?'كل المفاصل مربوطة':'لا توجد أجزاء مختلفة متلامسة لتربطها');return}
  const cost=Math.max(1,Math.ceil(J.un/16));
  if(countItem('rope')<cost){cwMsg('تحتاج '+cost+' حبل للربط (تملك '+countItem('rope')+')');return}
  cwSnap();cwCommit();cwUse('rope',cost);
  const M=CW.M,B=CW.B;
  for(let i=0;i<J.j.length;i++)if(J.j[i]){const x=i%CGW,y=(i/CGW)|0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=CGW||yy>=CGH)continue;const k=yy*CGW+xx;if(M[k])B[k]=1}}
  try{N(K0,{d:.25,f0:1800,f1:900,type:'bandpass',q:1,g:.12});SFX.rope&&SFX.rope()}catch(e){}
  cwMsg('رُبطت الأجزاء (استُهلك '+cost+' حبل)');cwUI();cwDraw();cwStats();
}
/* ---- statistics from the shape ---- */
function cwAnalyze(M,B){
  let minY=1e9,maxY=-1,n=0,mass=0,durS=0,cm=0;const rowW=new Int16Array(CGH),rowX=new Float32Array(CGH);
  for(let y=0;y<CGH;y++)for(let x=0;x<CGW;x++){const m=M[y*CGW+x];if(!m)continue;n++;const c=CMAT[m];mass+=c.d;durS+=c.u;cm+=c.d*y;rowW[y]++;rowX[y]+=x;if(y<minY)minY=y;if(y>maxY)maxY=y}
  if(n<12)return null;
  const len=maxY-minY+1,gy=Math.round(maxY-.14*len),cmY=cm/mass;
  const hy1=minY+Math.round(.38*len);
  let Mh=0,Hh=0,hn=0,maxHW=0;const mats={};
  for(let y=minY;y<=hy1;y++){maxHW=Math.max(maxHW,rowW[y]);for(let x=0;x<CGW;x++){const m=M[y*CGW+x];if(!m)continue;const c=CMAT[m];Mh+=c.d;Hh+=c.d*c.h;hn++;mats[m]=(mats[m]||0)+1}}
  Hh=Mh?Hh/Mh:.6;
  const tipRows=Math.max(1,Math.round(len*.1));let tw=0,tn=0;for(let y=minY;y<minY+tipRows;y++){tw+=rowW[y];tn++}tw/=tn;
  const p=maxHW>0?clamp(1-tw/Math.max(2,maxHW),0,1)*(len>14?1:.5):0;
  const hs=[];for(let y=minY+Math.round(.55*len);y<=maxY;y++)if(rowW[y])hs.push(rowW[y]);hs.sort((a,b)=>a-b);
  const shaft=hs.length?hs[hs.length>>1]:1;
  const wide=clamp((maxHW/Math.max(1.5,shaft)-1.2)/3,0,1);
  const bal=(gy-cmY)/len;
  let dom=1,best=0;for(const k in mats)if(mats[k]>best){best=mats[k];dom=+k}
  /* joints weaken it */
  let bound=0;for(let i=0;i<B.length;i++)if(B[i])bound++;
  const Lw=len/CGH*2.4;
  const dmg=2+.3*Math.sqrt(Mh)*(.45+.95*Hh)*(.85+.5*clamp(bal,0,.6))*(1+.4*p);
  const spd=clamp(.85+mass/1500+Math.max(0,bal-.25)*.5,.8,2.2);
  const reach=.9+.75*Lw;
  const arc=clamp(1.1-.6*p*(1-wide),.5,1.1);
  const wood=clamp(.5+2.6*wide*clamp(Hh,0,1.5),.5,4.5);
  const rock=clamp(.4+1.0*(.5*p+.5*wide)*Hh,.4,3);
  let dur=clamp(30+.1*durS,20,260)*(shaft<4?.7:1)*(bound?.85:1);
  /* name */
  let type;const hard=Hh>=.85;
  if(len<.42*CGH)type=hard&&p>.35?'خنجر':'هراوة قصيرة';
  else if(p>.5&&wide<.5&&len>=.5*CGH)type=hard?'رمح':'حربة';
  else if(wide>.5&&p<.4)type=Mh>900&&Hh<1.3?'مطرقة':'فأس';
  else if(wide>.5)type='معول';
  else if(Mh>520)type='هراوة ثقيلة';else if(hn&&Mh<170&&shaft<5)type='عصا';else type='هراوة';
  const name=type+((dom>1||type==='فأس'||type==='رمح'||type==='خنجر'||type==='معول'||type==='مطرقة')?' '+CMAT[dom].adj:'');
  return {n:n,len:len,gx:rowW[gy]?rowX[gy]/rowW[gy]:CGW/2,gy:gy,minY:minY,dmg:+dmg.toFixed(1),spd:+spd.toFixed(2),reach:+reach.toFixed(2),arc:+arc.toFixed(2),wood:+wood.toFixed(2),rock:+rock.toFixed(2),dur:Math.round(dur),mass:Math.round(mass),bal:+bal.toFixed(2),pt:+p.toFixed(2),wide:+wide.toFixed(2),name:name,Lw:+Lw.toFixed(2)};
}
/* ---- rendering ---- */
const cwc=document.createElement('canvas');
function cwPaint(g,M,B,S,opts){
  opts=opts||{};const hot=opts.hot,cur=opts.cur;
  g.clearRect(0,0,CGW*S,CGH*S);
  /* dark rim: every filled cell widened by one pixel */
  g.fillStyle='#1d1209';
  for(let y=0;y<CGH;y++)for(let x=0;x<CGW;x++)if(M[y*CGW+x])g.fillRect(x*S-1,y*S-1,S+2,S+2);
  for(let y=0;y<CGH;y++)for(let x=0;x<CGW;x++){
    const i=y*CGW+x,m=M[i];if(!m)continue;const c=CMAT[m];
    let col=c.c;
    const h=(x*73856093^y*19349663)>>>0,nz=(h%100)/100;
    g.fillStyle=col;g.fillRect(x*S,y*S,S,S);
    /* material texture */
    if(m===1){if((x+((y/9)|0)*3)%5===0){g.fillStyle='rgba(80,45,20,.28)';g.fillRect(x*S,y*S,S,S)}else if(nz>.9){g.fillStyle='rgba(255,230,190,.14)';g.fillRect(x*S,y*S,S,S)}}
    else if(m===2){if(nz>.82){g.fillStyle='rgba(150,130,90,.25)';g.fillRect(x*S,y*S,S,S)}}
    else if(m===3){g.fillStyle='rgba('+(nz>.5?'255,255,255,':'0,0,0,')+(.08+nz*.12).toFixed(2)+')';g.fillRect(x*S,y*S,S,S)}
    else if(m===4){if(nz>.7){g.fillStyle='rgba(170,200,230,.25)';g.fillRect(x*S,y*S,S,S)}}
    else{g.fillStyle='rgba(255,255,255,'+(.04+(y%7===0?.1:0)).toFixed(2)+')';g.fillRect(x*S,y*S,S,S)}
    if(hot&&m>=5){g.fillStyle='rgba(255,110,30,.22)';g.fillRect(x*S,y*S,S,S)}
    /* lit top-left edge / shaded bottom-right edge */
    if(!M[i-CGW]||y===0){g.fillStyle='rgba(255,255,255,.28)';g.fillRect(x*S,y*S,S,1.5)}
    if(!M[i-1]||x===0){g.fillStyle='rgba(255,255,255,.18)';g.fillRect(x*S,y*S,1.5,S)}
    if(y===CGH-1||!M[i+CGW]){g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x*S,y*S+S-1.5,S,1.5)}
    if(x===CGW-1||!M[i+1]){g.fillStyle='rgba(0,0,0,.22)';g.fillRect(x*S+S-1.5,y*S,1.5,S)}
    if(B[i]){const dgn=(x+y)%4;g.fillStyle=dgn<2?'#d9c58a':'#a98f54';g.fillRect(x*S,y*S,S,S);if(dgn===0){g.fillStyle='rgba(60,40,10,.5)';g.fillRect(x*S,y*S,S,1.4)}}
  }
  if(cur&&cur.placed&&cur.placed.length){
    g.strokeStyle='rgba(120,200,255,.95)';g.lineWidth=1.6;g.setLineDash([4,3]);
    for(const i of cur.placed){const x=i%CGW,y=(i/CGW)|0;
      if(!cur.set)cur.set=new Set(cur.placed);
      g.beginPath();
      if(!cur.set.has(i-CGW)){g.moveTo(x*S,y*S);g.lineTo(x*S+S,y*S)}
      if(!cur.set.has(i+CGW)){g.moveTo(x*S,y*S+S);g.lineTo(x*S+S,y*S+S)}
      if(!cur.set.has(i-1)){g.moveTo(x*S,y*S);g.lineTo(x*S,y*S+S)}
      if(!cur.set.has(i+1)){g.moveTo(x*S+S,y*S);g.lineTo(x*S+S,y*S+S)}
      g.stroke()}
    g.setLineDash([]);
  }
}
/* ---- UI ---- */
const cwEl=document.createElement('div');cwEl.id='cwin';cwEl.hidden=true;
cwEl.innerHTML='<div class="cw-box"><div class="cw-h"><b id="cwT"></b><button id="cwX" type="button">✕</button></div><div class="cw-body">'
 +'<div class="cw-mat"><div class="cw-lbl">المواد — اسحبها إلى اللوح</div><div id="cwMat"></div></div>'
 +'<div class="cw-mid"><div class="cw-wrap"><canvas id="cwC"></canvas><canvas id="cwF"></canvas></div><div id="cwMsg"></div></div>'
 +'<div class="cw-side"><div class="cw-lbl">الأدوات</div><div id="cwTools"></div><div id="cwAct"></div><div class="cw-lbl">خصائص السلاح</div><div id="cwSt"></div><input id="cwName" maxlength="22" placeholder="اسم السلاح"><div class="cw-fin"><button id="cwOk" type="button" class="cwb pri">اصنع السلاح</button></div></div>'
 +'</div></div>';
document.body.appendChild(cwEl);
{const st=document.createElement('style');st.textContent=
'#cwin{position:fixed;inset:0;z-index:40;display:grid;place-items:center;padding:6px;background:rgba(10,6,2,.78);font-family:Rubik,sans-serif;color:#f1e3c4;direction:rtl;touch-action:none}'
+'#cwin[hidden]{display:none}.cw-box{width:min(980px,100%);height:min(430px,100%);background:linear-gradient(#3a2815,#2a1b0d);border:2px solid #8a6a3a;border-radius:14px;display:flex;flex-direction:column;box-shadow:0 10px 40px rgba(0,0,0,.6);overflow:hidden}'
+'.cw-h{display:flex;justify-content:space-between;align-items:center;padding:6px 12px;background:rgba(0,0,0,.28);border-bottom:1px solid rgba(255,220,150,.18);font-size:15px}#cwX{background:none;border:0;color:#f1e3c4;font-size:20px;cursor:pointer;padding:2px 8px}'
+'.cw-body{flex:1;display:flex;gap:8px;padding:8px;min-height:0}.cw-mat,.cw-side{width:150px;display:flex;flex-direction:column;gap:5px;min-height:0;overflow:auto}.cw-side{width:168px}'
+'.cw-lbl{font-size:11px;opacity:.7;margin-top:2px}.cw-mid{flex:1;display:flex;flex-direction:column;align-items:center;min-width:0;min-height:0}'
+'.cw-wrap{position:relative;flex:1;min-height:0;aspect-ratio:48/80;max-width:100%;background:#4a3320;border:2px solid #20130a;border-radius:8px;overflow:hidden;'
+'background-image:linear-gradient(rgba(255,230,180,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,230,180,.06) 1px,transparent 1px),repeating-linear-gradient(90deg,rgba(0,0,0,.14) 0 2px,transparent 2px 14px);background-size:10% 6.25%,10% 6.25%,auto}'
+'.cw-wrap canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none}#cwF{pointer-events:none}'
+'#cwMsg{font-size:12px;min-height:30px;text-align:center;color:#ffd9a0;padding:3px 6px;line-height:1.35}'
+'.cwm{display:flex;align-items:center;gap:6px;padding:4px 6px;background:rgba(0,0,0,.28);border:1px solid rgba(255,220,150,.2);border-radius:8px;font-size:12px;cursor:grab;user-select:none;touch-action:none}.cwm img{width:30px;height:30px}.cwm.no{opacity:.35;cursor:default}.cwm b{margin-right:auto;font-size:11px;opacity:.85}'
+'.cwb{background:rgba(0,0,0,.3);color:#f1e3c4;border:1px solid rgba(255,220,150,.3);border-radius:8px;padding:5px 8px;font-size:12px;cursor:pointer;font-family:inherit}.cwb.on{background:#7a4f20;border-color:#ffd27a;color:#fff}.cwb.no{opacity:.35}.cwb.pri{background:#3f7a35;border-color:#9be07e;width:100%;padding:8px;font-size:14px}'
+'#cwTools{display:grid;grid-template-columns:1fr 1fr;gap:4px}#cwAct{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:2px}'
+'.cws{font-size:11px;display:grid;grid-template-columns:auto 1fr auto;gap:3px 6px;align-items:center}.cws i{display:block;height:6px;border-radius:4px;background:rgba(0,0,0,.4);overflow:hidden}.cws i s{display:block;height:100%;background:#d9a441}'
+'#cwName{background:rgba(0,0,0,.35);border:1px solid rgba(255,220,150,.3);color:#f1e3c4;border-radius:8px;padding:5px 8px;font-size:12px;font-family:inherit;direction:rtl}#cwin .cw-ghost{position:fixed;z-index:60;pointer-events:none;width:46px;height:46px;opacity:.85;transform:translate(-50%,-50%)}';
document.head.appendChild(st)}
const $cw=id=>document.getElementById(id);
function cwMsg(t){CW.warn=t;const m=$cw('cwMsg');if(m)m.textContent=t||''}
function cwUI(){
  const st=CST[CW.st];
  $cw('cwT').textContent=st.t;
  $cw('cwMat').innerHTML=st.mats.map(id=>{const n=countItem(id);return '<div class="cwm'+(n?'':' no')+'" data-m="'+id+'"><img alt="" src="'+iconURL(id)+'"><span>'+IT[id].n+'</span><b>×'+n+'</b></div>'}).join('');
  const tl=['move'].concat(st.tools);
  $cw('cwTools').innerHTML=tl.map(t=>{if(t==='move')return '<button class="cwb'+(CW.tool==='move'?' on':'')+'" data-t="move" type="button">✋ تحريك</button>';
    const has=cwHas(t==='knife'?'knife':t);return '<button class="cwb'+(CW.tool===t?' on':'')+(has?'':' no')+'" data-t="'+t+'" type="button" title="'+CTOOL[t].hint+'">'+CTOOL[t].n+(has?'':' ✕')+'</button>'}).join('');
  $cw('cwAct').innerHTML='<button class="cwb" data-a="rl" type="button"'+(CW.cur?'':' disabled style="opacity:.35"')+'>↺ تدوير</button><button class="cwb" data-a="rr" type="button"'+(CW.cur?'':' disabled style="opacity:.35"')+'>↻ تدوير</button><button class="cwb" data-a="bind" type="button">🪢 اربط بالحبل</button><button class="cwb" data-a="undo" type="button">↶ تراجع</button><button class="cwb" data-a="clear" type="button" style="grid-column:1/3">أفرغ اللوح</button>';
}
function cwStats(){
  const a=cwAnalyze(CW.M,CW.B);CW.a=a;const el=$cw('cwSt');
  if(!a){el.innerHTML='<div style="opacity:.6;font-size:12px">ضع مادة على اللوح لتبدأ</div>';return}
  const bar=(l,v,max)=>'<span>'+l+'</span><i><s style="width:'+clamp(v/max*100,3,100)+'%"></s></i><span>'+(Math.round(v*10)/10)+'</span>';
  el.innerHTML='<div class="cws">'+bar('الضرر',a.dmg,34)+bar('المدى',a.reach,3.4)+bar('السرعة',1/a.spd*1.4,1.7)+bar('المتانة',a.dur,200)+'</div><div style="font-size:11px;opacity:.8;margin-top:3px">'+a.name+(a.bal>.42?' · ثقيل الرأس':a.bal<.1?' · خفيف الرأس':'')+'</div>';
  const nm=$cw('cwName');if(!nm.dataset.u)nm.placeholder=a.name;
}
function cwDraw(){
  const c=$cw('cwC'),S=CPX;if(c.width!==CGW*S){c.width=CGW*S;c.height=CGH*S;$cw('cwF').width=CGW*S;$cw('cwF').height=CGH*S}
  const g=c.getContext('2d');cwPaint(g,CW.M,CW.B,S,{hot:cwHot(),cur:CW.cur});
}
function cwFx(){
  const f=$cw('cwF');if(!f||cwEl.hidden)return;const g=f.getContext('2d'),S=CPX;g.clearRect(0,0,f.width,f.height);
  for(let i=CW.chips.length-1;i>=0;i--){const c=CW.chips[i];c.l+=.03;c.vy+=60*.03;c.x+=c.vx*.03;c.y+=c.vy*.03;if(c.l>.8||c.y>CGH){CW.chips.splice(i,1);continue}
    g.fillStyle=CMAT[c.m].c;g.globalAlpha=1-c.l/.8;g.fillRect(c.x*S,c.y*S,S*.8,S*.8)}
  g.globalAlpha=1;
  if(CW.tool!=='move'&&CW.mx!==undefined){const T=CTOOL[CW.tool];g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=1.2;g.beginPath();g.arc(CW.mx*S,CW.my*S,T.r*S,0,TAU);g.stroke()}
  if(CW.chips.length||CW.mx!==undefined)CW.raf=requestAnimationFrame(cwFx);else CW.raf=0;
}
function cwPtr(e){const r=$cw('cwC').getBoundingClientRect();return [(e.clientX-r.left)/r.width*CGW,(e.clientY-r.top)/r.height*CGH]}
function cwOpen(st){
  if(!S.alive)return;
  cwNew(st);cwEl.hidden=false;$cw('cwName').value='';delete $cw('cwName').dataset.u;
  cwMsg('اسحب مادة إلى اللوح (أو المسها)، ثم اختر الأداة وانحت بحرية.');
  cwUI();cwDraw();cwStats();cwFx();
}
function cwClose(refund){
  if(refund!==false&&CW)cwRefund(null);
  cwEl.hidden=true;CW=null;invDirty=true;try{renderInv()}catch(e){}
}
{ /* events */
  cwEl.addEventListener('click',e=>{
    if(!CW)return;
    const t=e.target.closest('[data-t]');
    if(t){const id=t.dataset.t;if(id!=='move'&&!cwHas(id==='knife'?'knife':id)){cwMsg('لا تملك '+CTOOL[id].n+' — اصنعها على طاولة الصناعة');return}CW.tool=id;cwCommit();cwMsg(id==='move'?'اسحب القطعة الأخيرة لتحرّكها':CTOOL[id].hint);cwUI();cwDraw();return}
    const a=e.target.closest('[data-a]');
    if(a){const k=a.dataset.a;
      if(k==='rl'||k==='rr'){if(CW.cur){cwSnap();CW.cur.rot+=(k==='rl'?-1:1)*Math.PI/12;CW.cur.set=null;cwStamp(CW.cur);cwDraw();cwStats()}}
      else if(k==='bind')cwBind();
      else if(k==='undo'){const s=CW.undo.pop();if(!s){cwMsg('لا شيء للتراجع');return}CW.M.set(s.M);CW.B.set(s.B);const refundTo=s.used;cwRefund(refundTo);CW.used=Object.assign({},refundTo);CW.cur=null;cwUI();cwDraw();cwStats()}
      else if(k==='clear'){cwSnap();cwRefund(null);CW.used={};CW.M.fill(0);CW.B.fill(0);CW.cur=null;cwUI();cwDraw();cwStats();cwMsg('أُفرغ اللوح وأُعيدت المواد')}
      return}
    if(e.target.id==='cwX'){cwClose(true);return}
    if(e.target.id==='cwOk'){cwFinish();return}
    const mm=e.target.closest('.cwm');
    if(mm&&!CW.dragged){cwDrop(mm.dataset.m,Math.round(CGW/2),Math.round(CGH/2)-0);cwUI();}
  });
  /* drag from the material list */
  let ghost=null,dragId=null,sx=0,sy=0;
  cwEl.addEventListener('pointerdown',e=>{
    if(!CW)return;
    const mm=e.target.closest('.cwm');
    if(mm&&!mm.classList.contains('no')){dragId=mm.dataset.m;sx=e.clientX;sy=e.clientY;CW.dragged=false;return}
    if(e.target.id==='cwC')cwDown(e);
  });
  window.addEventListener('pointermove',e=>{
    if(!CW||cwEl.hidden)return;
    if(dragId){
      if(!ghost&&Math.hypot(e.clientX-sx,e.clientY-sy)>8){CW.dragged=true;ghost=document.createElement('img');ghost.className='cw-ghost';ghost.src=iconURL(dragId);cwEl.appendChild(ghost)}
      if(ghost){ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px'}return}
    if(e.target&&e.target.id==='cwC'||CW.down)cwMove(e);
  });
  window.addEventListener('pointerup',e=>{
    if(!CW||cwEl.hidden){dragId=null;return}
    if(dragId){
      if(ghost){ghost.remove();ghost=null;const r=$cw('cwC').getBoundingClientRect();
        if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom){const p=cwPtr(e);cwDrop(dragId,Math.round(p[0]),Math.round(p[1]));cwUI()}
        setTimeout(()=>{if(CW)CW.dragged=false},0)}
      dragId=null;return}
    if(CW.down)cwUp(e);
  });
}
function cwDown(e){
  const p=cwPtr(e);CW.down=true;CW.lx=p[0];CW.ly=p[1];CW.mx=p[0];CW.my=p[1];
  if(CW.tool==='move'){
    const c=CW.cur;
    if(c&&c.set===undefined)c.set=new Set(c.placed);
    const i=Math.floor(p[1])*CGW+Math.floor(p[0]);
    if(c&&c.set&&c.set.has(i)){CW.mv={ox:p[0]-c.cx,oy:p[1]-c.cy,snap:false}}
    else CW.mv=null;
  }else{
    const T=CTOOL[CW.tool];
    if(!cwHas(CW.tool==='knife'?'knife':CW.tool)){cwMsg('لا تملك '+T.n);CW.down=false;return}
    cwSnap();cwCommit();CW.carved=0;
    const i=Math.floor(p[1])*CGW+Math.floor(p[0]);CW.lastMat=CW.M[i]||CW.lastMat;
    CW.carved+=cwCarve(p[0],p[1],p[0],p[1])||0;cwDraw();
  }
  if(!CW.raf)cwFx();
}
function cwMove(e){
  const p=cwPtr(e);CW.mx=p[0];CW.my=p[1];if(!CW.raf)cwFx();
  if(!CW.down)return;
  if(CW.tool==='move'){
    if(CW.mv&&CW.cur){if(!CW.mv.snap){cwSnap();CW.mv.snap=true}CW.cur.cx=Math.round(p[0]-CW.mv.ox);CW.cur.cy=Math.round(p[1]-CW.mv.oy);CW.cur.set=null;cwStamp(CW.cur);cwDraw();cwStats()}
  }else{
    const i=Math.floor(p[1])*CGW+Math.floor(p[0]);if(CW.M[i])CW.lastMat=CW.M[i];
    CW.carved+=cwCarve(CW.lx,CW.ly,p[0],p[1])||0;CW.lx=p[0];CW.ly=p[1];cwDraw();
  }
}
function cwUp(){
  CW.down=false;
  if(CW.tool!=='move'){
    cwClean();if(!CW.carved&&CW.undo.length)CW.undo.pop();
    cwDraw();cwStats();cwUI();
  }
}
/* ---- finish ---- */
function cwFinish(){
  const a=cwAnalyze(CW.M,CW.B);
  if(!a){cwMsg('اللوح شبه فارغ — اصنع شيئاً أكبر');return}
  if(a.n<40){cwMsg('القطعة صغيرة جداً لتكون سلاحاً');return}
  /* one body? */
  const M=CW.M;let comps=0;const seen=new Uint8Array(M.length);
  for(let i=0;i<M.length;i++){if(!M[i]||seen[i])continue;comps++;const st=[i];seen[i]=1;while(st.length){const c=st.pop(),x=c%CGW,y=(c/CGW)|0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=CGW||yy>=CGH)continue;const j=yy*CGW+xx;if(M[j]&&!seen[j]){seen[j]=1;st.push(j)}}}}
  if(comps>1){cwMsg('القطع منفصلة — اجعلها متلامسة ثم اربطها');return}
  const J=cwJoints();if(J.un>0){cwMsg('هناك مفاصل غير مربوطة — اضغط «اربط بالحبل»');return}
  if(a.dmg<1){cwMsg('هذا الشكل لا يصلح سلاحاً');return}
  if(!S.cust)S.cust={n:0};
  const id='cw'+(++S.cust.n),nm=$cw('cwName').value.trim()||a.name;
  const hex='0123456789abcdef';let enc='';for(let i=0;i<M.length;i++)enc+=hex[M[i]|(CW.B[i]?8:0)];
  S.cust[id]={n:nm,g:enc};
  cwRegister(id);
  const left=addItem(id,1);if(left>0)dropItem(id,left,P.x,P.y);
  CW.used={};cwEl.hidden=true;CW=null;
  SFX.chime&&SFX.chime();toast('نحتّ «'+nm+'» — جاهز في حقيبتك');xpGain&&xpGain(14);
  invDirty=true;try{renderInv()}catch(e){}
}
const CWIMG={};
function cwRegister(id){
  const d=S.cust[id];if(!d)return;
  const M=new Uint8Array(CGW*CGH),B=new Uint8Array(CGW*CGH);
  for(let i=0;i<M.length;i++){const v=parseInt(d.g[i],16)||0;M[i]=v&7;B[i]=v&8?1:0}
  const a=cwAnalyze(M,B);if(!a)return;
  /* sprite for the player's hand */
  const c=document.createElement('canvas');c.width=CGW*4;c.height=CGH*4;cwPaint(c.getContext('2d'),M,B,4,{});
  CWIMG[id]={img:c,gx:a.gx*4+2,gy:a.gy*4+2,len:a.len,Lw:a.Lw};
  IT[id]={n:d.n,d:'سلاح نُحت بيديك — ضرر '+a.dmg+' · مدى '+a.reach+' · متانة '+a.dur,weapon:id,dur:a.dur,s:1,cust:1};
  WEAP[id]={n:d.n,dmg:a.dmg,reach:a.reach,wood:a.wood,rock:a.rock,arc:a.arc,spd:a.spd,kind:'cust'};
  /* icon: fit the weapon into 40x40 diagonally */
  IC[id]=g=>{const s=36/Math.max(a.len*4,CGW*4*.5);g.save();g.translate(20,20);g.rotate(.785);g.scale(s,s);g.drawImage(c,-CGW*2,-(a.minY*4+a.len*2));g.restore()};
  delete iconCache[id];
}
function cwRebuild(){if(S.cust)for(const k in S.cust)if(k!=='n')cwRegister(k)}
{const _rs=restoreSnapshot;restoreSnapshot=function(d){try{if(d&&d.S&&d.S.cust){S.cust=d.S.cust;cwRebuild()}}catch(e){console.error(e)}return _rs.apply(this,arguments)}}
{const _ng=newGame;newGame=function(){const r=_ng.apply(this,arguments);S.cust={n:0};return r}}
/* attack speed follows the weapon's mass and balance */
{const _sa=startAtk;startAtk=function(n){const r=_sa.apply(this,arguments);const W=WEAP[S.weapon];if(W&&W.spd){P.atk.dur*=W.spd;if(typeof S!=='undefined')S.stam=Math.max(0,S.stam-(W.spd-1)*4)}return r}}
/* player's hand */
function cwDrawHand(wid,c0,c4){
  const o=CWIMG[wid];if(!o){return false}
  const vx=c4.x-c0.x,vy=c4.y-c0.y,D=Math.hypot(vx,vy)||1,ppu=D/1.66,sc=ppu*o.Lw/(o.len*4);
  const hx=c0.x+vx*(.16/1.66),hy=c0.y+vy*(.16/1.66),ang=Math.atan2(vy,vx)+Math.PI/2;
  ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);ctx.scale(sc,sc);
  ctx.drawImage(o.img,-o.gx,-o.gy);ctx.restore();return true;
}
/* ---- station entry button ---- */
{const _sp=stnPanel;stnPanel=function(k){
  let h=_sp.apply(this,arguments);
  if(CST[k]&&stObj(k))h+='<div style="margin:6px 0"><button class="btn" data-cust="'+k+'" style="padding:6px 14px;font-size:13px">🔨 صنع سلاح مخصّص (نحت حر)</button></div>';
  return h}}
document.getElementById('inv').addEventListener('click',e=>{const b=e.target.closest('[data-cust]');if(!b)return;const k=b.dataset.cust;if(!stObj(k)){toast('ابتعدت عن المحطة',true);return}cwOpen(k)});
/* realism tweaks */
{const r=REC.find(r=>r.out==='firewood');if(r){r.in={log:1};r.n=3;r.tool='axe'}}
