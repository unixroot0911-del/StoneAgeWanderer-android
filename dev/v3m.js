/* ===== v3m: no temperature/sleep, delta saves, LAN multiplayer rebuilt ===== */

/* ---- 1) body temperature and sleep are gone (bars hidden by v3l css) ---- */
{const _u=update;update=function(){
  S.bt=37;S.energy=100;S.warmth=100;if(sleeping){sleeping=false;if(P.act==='sleep')P.act=null}
  const r=_u.apply(this,arguments);S.bt=37;S.energy=100;S.warmth=100;return r}}
startSleep=function(){};

/* ---- 2) world modifications: small delta instead of a 2 MB dump of every chunk ---- */
const WMOD=new Map();
const mxIsMod=o=>o.cut||o.hp!==o.maxhp||o.fruit===false||o.grow!==undefined||o.fruitT>0;
const mxObjDelta=o=>[o.oi,o.cut?1:0,o.cut?Math.max(0,+(time-(o.cutAt||0)).toFixed(1)):0,+(o.hp||0).toFixed(2),+(o.s||1).toFixed(3),o.fruit===false?0:1,o.fruitT||0,o.grow==null?-1:+(+o.grow).toFixed(3),o.birdy?1:0];
function mxApplyObj(o,e){
  o.cut=!!e[1];o.cutAt=time-e[2];o.hp=e[3];o.s=e[4];
  if(o.k===3){o.fruit=!!e[5];o.fruitT=e[6];if(SPR.bush&&SPR.bush[o.fruit?1:0])o.sp=SPR.bush[o.fruit?1:0][o.vi]}
  if(e[7]>=0)o.grow=e[7];o.birdy=!!e[8];if(o.cut)o.shake=0;
}
function wmStash(k,c){const a=[];for(const o of c.objs)if(mxIsMod(o))a.push(mxObjDelta(o));if(a.length)WMOD.set(k,a);else WMOD.delete(k)}
function mxWM(){
  const out=[];
  for(const [k,c] of chunks){const a=[];for(const o of c.objs)if(mxIsMod(o))a.push(mxObjDelta(o));if(a.length)out.push([k,a])}
  for(const [k,a] of WMOD)if(!chunks.has(k))out.push([k,a]);
  return out;
}
function mxReviveLoaded(){chunks.forEach(c=>c.objs.forEach(o=>{if(o.cut||o.hp!==o.maxhp)reviveObj(o,true)}))}
function mxSetWM(list){
  WMOD.clear();
  for(const [k,a] of (list||[])){const c=chunks.get(k);if(c){for(const e of a){const o=c.objs[e[0]];if(o)mxApplyObj(o,e)}c.wmd=1}else WMOD.set(k,a)}
}
{const _g=getChunk;getChunk=function(cx,cy){const c=_g(cx,cy);
  if(c.wmd===undefined){c.wmd=1;if(WMOD.size){const k=cx+','+cy,a=WMOD.get(k);if(a){for(const e of a){const o=c.objs[e[0]];if(o)mxApplyObj(o,e)}WMOD.delete(k)}}}
  return c}}
makeSnapshot=function(){
  return {v:1,when:Date.now(),S:saveClone(S),P:saveClone(P),inv:saveClone(inv),invSel,cam:{a:camA,at:camAT,e:elev,z:zoomK,wx:cam.wx,wy:cam.wy},time,tod,rain,rainGoal,rainT,seas,snowK,wind,frame,spawnT,sleeping:false,sleepQ,fireflies:saveClone(fireflies),ents:saveClone(ents),structs:saveClone(structs),fires:saveClone(fires),drops:saveClone(drops),falls:saveClone(falls),arrows:saveClone(arrows),floats:saveClone(floats),chunks:[],wm:mxWM()};
};
{const _r=restoreSnapshot;restoreSnapshot=function(d){
  if(d&&d.wm)mxReviveLoaded();
  const r=_r.apply(this,arguments);
  if(d&&d.wm)mxSetWM(d.wm);
  if(Net.on&&Net.host)setTimeout(()=>{try{mxPushAll()}catch(e){}},700);
  return r}}
{const _n=newGame;newGame=function(){WMOD.clear();return _n.apply(this,arguments)}}

/* ---- 3) multiplayer: every phone hosts on ITS OWN server; guests join a remote one ---- */
const MX={open:(()=>{try{return localStorage.getItem('saw-open')!=='0'}catch(e){return true}})(),rooms:[],scanning:false,conn:false,noAuto:0,scanAt:0,inWorld:false,waitW:false,url:'',asPeer:null,seenRooms:0,panel:false};
const mxLocalURL=()=>location.protocol==='http:'?'ws://'+location.host:'ws://127.0.0.1:8787';
const mxOwnIp=()=>{try{return window.Android?Android.ip():''}catch(e){return ''}};
netNameGet=function(){
  const el=$('mxName');let v=el?(el.value||'').trim().slice(0,14):'';
  if(!v){try{v=localStorage.getItem('sa-net-name')||''}catch(e){}}
  Net.name=v||'رَحّال';try{localStorage.setItem('sa-net-name',Net.name)}catch(e){}return Net.name;
};
/* single timer: positions only (clock/fire/wildlife pushes live in netUpdate) */
netStartTimers=function(){
  clearInterval(Net.tA);clearInterval(Net.tB);clearInterval(Net.tC);Net.tB=Net.tC=0;
  Net.tA=setInterval(()=>{if(Net.on&&Net.ready)netPush()},1000/20);
};
QUAL.wildEvery=.2;
{const _s=netSend;netSend=function(t,d){
  if(!Net.on||!Net.ready)return;
  if(Net.host&&!Net.peers.size&&t!=='W'&&t!=='hi')return;
  return _s.apply(this,arguments)}}
netBroadcastStart=function(){};netGuestStart=function(){};netInviteRender=function(){};

function mxConnect(url,asHost){
  return new Promise(res=>{
    if(MX.conn){res(false);return}
    MX.conn=true;
    if(Net.on||Net.ws)netTeardown(false);
    let ws,done=false,tm=0;
    const fin=ok=>{if(done)return;done=true;clearTimeout(tm);MX.conn=false;
      if(!ok){if(Net.ws===ws){Net.ws=null;Net.on=false;Net.ready=false;Net.host=false;Net.waiting=false}try{ws.close()}catch(e){}}
      res(ok)};
    try{ws=new WebSocket(url)}catch(e){MX.conn=false;res(false);return}
    Net.ws=ws;Net.mode='ws';Net.host=!!asHost;Net.role='';Net.ready=false;Net.waiting=!asHost;Net.id='';netNameGet();MX.url=url;
    tm=setTimeout(()=>fin(false),asHost?3500:6000);
    ws.onopen=()=>{try{ws.send(JSON.stringify(asHost?{t:'hi',n:Net.name}:{t:'join',n:Net.name}))}catch(e){}};
    ws.onmessage=e=>{
      let m;try{m=JSON.parse(e.data)}catch(_){return}
      if(!done){
        if(m.t==='welcome'){
          if(asHost&&m.role==='admin'){Net.id=m.id;Net.role='admin';Net.host=true;Net.on=true;Net.ready=true;Net.waiting=false;netClaimWorld();netStartTimers();netUI();netBar();fin(true)}
          else fin(false);
        }else if(m.t==='joined'){
          Net.id=m.id;Net.role='player';Net.host=false;Net.on=true;Net.ready=true;Net.waiting=false;netStartTimers();netUI();netBar();fin(true);mxOnJoined();
        }else if(m.t==='full'||m.t==='denied')fin(false);
        return;
      }
      switch(m.t){
        case 'joined':
          if(Net.host&&m.id&&m.id!==Net.id){const r=(m.roster||[]).find(x=>x.id===m.id);peerGet(m.id,r&&r.n);if(SFX.chime)SFX.chime();setTimeout(()=>{try{mxSendWorld(m.id)}catch(e){}},200)}
          return;
        case 'admin':
          if(!m.id){Net.role='admin';Net.host=true;netUI();netBar()}return;
        case 'roster':case 'welcome':case 'ask':case 'full':case 'denied':return;
        default:netRecv(e.data);
      }
    };
    ws.onerror=()=>fin(false);
    ws.onclose=()=>{if(!done)fin(false);else if(Net.ws===ws&&Net.on)mxLost()};
  });
}
function mxLost(){
  const was=Net.host;
  netTeardown(true);MX.inWorld=false;MX.waitW=false;MX.noAuto=Date.now()+2500;
  if(SFX.deny)SFX.deny();
}
async function mxHost(){
  if(Net.on||MX.conn)return false;
  MX.noAuto=Date.now()+8000;
  const ok=await mxConnect(mxLocalURL(),true);
  if(ok)MX.noAuto=0;
  mxRender();return ok;
}
async function mxJoin(h){
  h=String(h||'').trim().replace(/^https?:\/\//,'').replace(/\/.*$/,'');if(!h)return false;
  if(!/:\d+$/.test(h))h+=':8787';
  if(Net.on&&!Net.host)netTeardown(false);
  MX.waitW=true;
  const ok=await mxConnect('ws://'+h,false);
  if(!ok){MX.waitW=false;if(SFX.deny)SFX.deny();mxRender();return false}
  try{localStorage.setItem('saw-host',h)}catch(e){}
  mxRender();return true;
}
function mxLeave(){
  const wasGuest=Net.on&&!Net.host;
  netTeardown(false);MX.inWorld=false;MX.waitW=false;MX.noAuto=Date.now()+3000;mxRender();
}
function mxClose(){MX.open=false;try{localStorage.setItem('saw-open','0')}catch(e){}if(Net.on&&Net.host)netTeardown(false);mxRender()}
function mxOpenRoom(){MX.open=true;try{localStorage.setItem('saw-open','1')}catch(e){}MX.noAuto=0;mxRender()}

/* world transfer ------------------------------------------------------ */
function mxWorldPack(){
  return {tod:tod,day:S.day,seas:seas,rain:rain,rg:rainGoal,wm:mxWM(),st:saveClone(structs),fi:saveClone(fires),dr:saveClone(drops),hx:P.x,hy:P.y};
}
function mxSendWorld(to){
  const w=mxWorldPack();if(to)w.to=to;netSend('W',w);
}
function mxPushAll(){if(Net.on&&Net.host&&Net.peers.size){const w=mxWorldPack();netSend('W',w)}}
function mxApplyWorld(m){
  tod=m.tod;S.day=m.day;seas=m.seas;rain=m.rain;rainGoal=m.rg;
  mxReviveLoaded();mxSetWM(m.wm);
  structs.length=0;(m.st||[]).forEach(s=>{s.own=false;structs.push(s)});
  fires.length=0;(m.fi||[]).forEach(f=>{f.own=false;fires.push(f)});
  drops.length=0;(m.dr||[]).forEach(d=>drops.push(d));
  invDirty=true;
}
function mxPlaceNear(hx,hy){
  let x=hx+1.6,y=hy+1.2,ok=false;
  for(let r=1.5;r<7&&!ok;r+=.8)for(let a=0;a<6.28&&!ok;a+=.9){const tx=hx+Math.cos(a)*r,ty=hy+Math.sin(a)*r;if(waterAt(tx,ty)!==2&&freeSpot(tx,ty,.4)){x=tx;y=ty;ok=true}}
  P.x=x;P.y=y;P.vx=P.vy=0;cam.wx=x;cam.wy=y;S.sx=x;S.sy=y;P.dropTries=9;
  try{trail.length=0;prints.length=0}catch(e){}
}
function mxOnJoined(){
  MX.waitW=true;
  setTimeout(()=>{if(MX.waitW&&Net.on&&!Net.host){MX.waitW=false;mxEnter(null)}},7000);
}
function mxOnWorld(m){
  if(Net.host)return;
  if(MX.waitW||!MX.inWorld){MX.waitW=false;mxEnter(m)}
  else mxApplyWorld(m);
}
function mxEnter(m){
  if(Load.on){setTimeout(()=>mxEnter(m),400);return}
  try{if(S.alive&&P.state==='live')saveSlot(3,true)}catch(e){}
  const hx=m?m.hx:P.x,hy=m?m.hy:P.y;
  menuShotClear();aInit();userPaused=false;
  $('pauseMenu').hidden=true;$('savePanel').hidden=true;$('netPanel').hidden=true;$('splash').hidden=true;$('mpx').hidden=true;MX.panel=false;$('roster').hidden=true;Net.rosterOpen=false;
  loadOpen('','');
  const keep=(S.alive&&P.state==='live')?{S:saveClone(S),inv:saveClone(inv)}:null;
  loadAdd(()=>{newGame();if(m)mxApplyWorld(m);
    if(keep){const dy=S.day;Object.assign(S,keep.S);S.day=dy;S.alive=true;inv.length=0;keep.inv.forEach(x=>inv.push(x));invDirty=true;P.state='live';P.z=0;P.zv=0}
    mxPlaceNear(hx,hy);MX.inWorld=true},14);
  loadWorld(hx,hy,18,82);
  loadWait(40,94,'');
  loadFinish();
}
{const _h=netHandle;netHandle=function(m){
  if(!m)return;
  if(m.t==='W'){if(Net.ready)mxOnWorld(m);return}
  if(m.t==='H'){
    if(Net.host){const e=ents.find(x=>x.nid===m.n);if(e&&!e.dead){const q=Net.peers.get(m.i);hurtEnt(e,+m.d||1,'player',+m.kx||0,+m.ky||0)}}
    return}
  if(m.t==='D'){hitPlayer(+m.a[0]||1,{x:P.x-(+m.a[2]||0),y:P.y-(+m.a[3]||0),sp:'peer',st:'hunt'},m.a[1]||'animal',+m.a[2]||0,+m.a[3]||0,+m.a[4]||0);return}
  if(m.t==='s'&&Net.ready){
    const p=Net.peers.get(m.i)||peerGet(m.i,m.n);
    if(p&&!p.seen){p.seen=1;p.rx=p.tx=m.x;p.ry=p.ty=m.y;p.rz=m.z||0;p.buf.length=0}
  }
  return _h.apply(this,arguments)}}

/* wildlife: fix the mirror (guest used its own ids -> every push re-created every animal) */
netEntApply=function(m){
  if(!m.l||!m.l.length)return;
  const seen=new Set(),by=new Map();
  for(const e of ents)if(e.nid)by.set(e.nid,e);
  for(const a of m.l){
    const nid=a[0],sp=ENTL[a[1]];if(!sp)continue;
    if(a[7]<=0)continue;
    seen.add(nid);
    let e=by.get(nid);
    if(!e){
      if(Math.hypot(a[2]-P.x,a[3]-P.y)>62)continue;
      e=mkEnt(sp,a[2],a[3]);e.nid=nid;if(e.ck)e.ck.alive++;e.ntx=a[2];e.nty=a[3];
    }else{e.ntx=a[2];e.nty=a[3];if(Math.hypot(e.x-a[2],e.y-a[3])>6){e.x=a[2];e.y=a[3]}}
    e.hx=a[2];e.hy=a[3];e.face=a[4];e.ph=a[6];e.hp=a[7];e.gone=false;
    e.st=a[5]?'hunt':(e.st==='hunt'?'idle':e.st);e.flip=Math.cos(e.face)>=0?1:-1;
  }
  for(let i=ents.length-1;i>=0;i--){const e=ents[i];if(!e.gone&&e.nid&&!seen.has(e.nid)&&e.nid>1){if(e.ck)e.ck.alive--;ents.splice(i,1)}}
};
netEntPush=function(){
  const l=[],far=QUAL.wildFar,pts=[[P.x,P.y]];
  for(const q of Net.peers.values())pts.push([q.rx,q.ry]);
  for(const e of ents){
    if(e.gone)continue;
    let ok=false;for(const p of pts)if(Math.abs(e.x-p[0])<=far&&Math.abs(e.y-p[1])<=far){ok=true;break}
    if(!ok)continue;
    l.push([e.nid,ENTK[e.sp]||e.sp[0],+e.x.toFixed(1),+e.y.toFixed(1),+e.face.toFixed(2),e.st==='hunt'?1:0,+e.ph.toFixed(1),e.hp|0]);
    if(l.length>=QUAL.wildMax)break;
  }
  if(l.length)netSend('E',{l:l});
};
/* host AI treats the nearest player as the target; hits on a guest are relayed to that guest */
{const _ue=updEnt;updEnt=function(e,dt,f){
  if(!(Net.on&&Net.role==='admin'&&Net.peers.size)||e.dead)return _ue.apply(this,arguments);
  let best=null,bd=Math.hypot(e.x-P.x,e.y-P.y);
  for(const q of Net.peers.values()){if(q.st!=='live'||!q.seen)continue;const d=Math.hypot(e.x-q.rx,e.y-q.ry);if(d<bd-1.5){bd=d;best=q}}
  if(!best)return _ue.apply(this,arguments);
  const sx=P.x,sy=P.y,svx=P.vx,svy=P.vy;P.x=best.rx;P.y=best.ry;P.vx=best.tvx;P.vy=best.tvy;MX.asPeer=best;
  try{return _ue.apply(this,arguments)}finally{P.x=sx;P.y=sy;P.vx=svx;P.vy=svy;MX.asPeer=null}
}}
{const _hp=hitPlayer;hitPlayer=function(dmg,src,kind,kx,ky,poison){
  if(MX.asPeer){netSend('D',{to:MX.asPeer.id,a:[dmg,kind,kx||0,ky||0,poison||0]});return}
  return _hp.apply(this,arguments)}}
{const _he=hurtEnt;hurtEnt=function(e,dmg,src,kx,ky){
  if(Net.on&&Net.ready&&!Net.host&&Net.role!=='admin'&&e&&e.nid&&src==='player'){
    if(e.dead)return;
    netSend('H',{n:e.nid,d:+(+dmg).toFixed(1),kx:+(kx||0).toFixed(2),ky:+(ky||0).toFixed(2)});
    e.flash=.16;e.hpShow=2.8;SFX.flesh(e);for(let i=0;i<4;i++)emit('puff',e.x,e.y,.5,{col:'rgba(214,70,60,.7)',size:3});
    return}
  return _he.apply(this,arguments)}}
/* smooth the mirrored animals between pushes */
{const _u2=update;update=function(dt){
  const r=_u2.apply(this,arguments);
  if(Net.on&&Net.role!=='admin'){const k=Math.min(1,(dt||.016)*9);for(const e of ents)if(e.ntx!==undefined){e.x+=(e.ntx-e.x)*k;e.y+=(e.nty-e.y)*k}}
  return r}}

/* discovery ----------------------------------------------------------- */
async function mxInfo(h){
  const c=new AbortController(),t=setTimeout(()=>c.abort(),700);
  try{const r=await fetch('http://'+h+'/info',{signal:c.signal,cache:'no-store'});const j=await r.json();return j&&j.saw?j:null}
  catch(e){return null}finally{clearTimeout(t)}
}
async function mxScan(){
  if(MX.scanning)return;MX.scanning=true;MX.scanAt=Date.now();
  try{
    const own=mxOwnIp(),hosts=[];
    if(own){const p=own.replace(/\.\d+$/,'');for(let i=1;i<255;i++){const ip=p+'.'+i;if(ip!==own)hosts.push(ip+':8787')}}
    else hosts.push(location.host);
    let sv='';try{sv=localStorage.getItem('saw-host')||''}catch(e){}if(sv&&!hosts.includes(sv))hosts.unshift(sv);
    const found=[];let k=0;
    await Promise.all(Array.from({length:Math.min(48,hosts.length)},async()=>{
      while(k<hosts.length){const h=hosts[k++];const r=await mxInfo(h);if(r&&r.open)found.push({h:h,host:r.host||'',n:r.n|0})}}));
    MX.rooms=found;
    if(found.length>MX.seenRooms&&!Net.on||(found.length>MX.seenRooms&&Net.host)){if(SFX.chime)SFX.chime()}
    MX.seenRooms=found.length;
  }catch(e){}
  MX.scanning=false;mxGlow();mxRender();
}
function mxGlow(){
  const g=MX.rooms.length>0&&!(Net.on&&!Net.host);
  for(const id of ['netBtn','mxPauseBtn']){const b=$(id);if(b)b.classList.toggle('mxglow',g)}
}

/* panel ---------------------------------------------------------------- */
{const st=document.createElement('style');st.textContent=
 '#mpx{position:fixed;inset:0;z-index:70;background:rgba(10,6,3,.78);display:grid;place-items:center}#mpx[hidden]{display:none}'+
 '#mpx .net-shell{max-height:92vh}#mxRooms .pl,#mxMine .pl{margin:4px 0}#mpx .net-foot{display:flex;gap:6px;margin:8px 0;align-items:center}'+
 '#mpx .net-in{min-width:0}#mpx input.net-in{flex:1}'+
 '.mxglow{animation:mxg 1.4s ease-in-out infinite}@keyframes mxg{50%{box-shadow:0 0 0 3px #8fe36a,0 0 18px #8fe36a}}'+
 '#netFeed,#netBar,#down .dt,#chats{display:none!important}';
 document.head.appendChild(st)}
{const d=document.createElement('div');d.id='mpx';d.hidden=true;
 d.innerHTML='<div class="net-shell" dir="rtl" lang="ar"><div class="net-head"><div><div class="net-kick">LAN</div><h2>اللعب الجماعي</h2></div><button id="mxClose" class="net-x" type="button">✕</button></div>'+
 '<label class="net-lab">اسمك<input id="mxName" class="net-in" type="text" maxlength="14" placeholder="رَحّال" autocomplete="off" spellcheck="false"></label>'+
 '<div class="admin-h">عوالم على الشبكة</div><div id="mxRooms" class="plist"></div>'+
 '<div class="net-foot"><input id="mxIp" class="net-in" type="text" inputmode="decimal" placeholder="192.168.x.x" style="direction:ltr;text-align:left" autocomplete="off"><button id="mxIpGo" class="net-btn" type="button">انضمام</button><button id="mxRescan" class="net-btn ghost" type="button">بحث</button></div>'+
 '<div class="admin-h">عالمي</div><div id="mxMine"></div></div>';
 document.body.appendChild(d);
 try{$('mxName').value=localStorage.getItem('sa-net-name')||''}catch(e){}
 try{$('mxIp').value=(localStorage.getItem('saw-host')||'').replace(/:8787$/,'')}catch(e){}}
function mxRender(){
  const r=$('mxRooms'),m=$('mxMine');if(!r||!m||$('mpx').hidden)return;
  const cur=Net.on&&!Net.host?MX.url:'';
  r.innerHTML=MX.rooms.length?MX.rooms.map(o=>{
    const on=cur&&cur.indexOf(o.h)>=0;
    return '<div class="pl"><div class="av" style="background:#e08a2e">'+esc((o.host||'?').charAt(0))+'</div><div class="nm">'+esc(o.host||'رَحّال')+'<i>'+o.n+' لاعب</i></div>'+
     (on?'<div class="mt" style="width:auto;color:#8fe36a">●</div>':'<button class="net-btn" data-j="'+esc(o.h)+'" type="button">انضمام</button>')+'</div>'}).join('')
   :'<div class="pl" style="opacity:.6"><div class="nm">'+(MX.scanning?'…':'لا أحد حولك')+'</div></div>';
  const ip=mxOwnIp();
  let h='<div class="net-foot"><button class="net-btn'+(MX.open?'':' ghost')+'" data-x="toggle" type="button">'+(MX.open?'عالمي مفتوح':'عالمي مغلق')+'</button>'+(ip?'<span style="direction:ltr;font:700 13px system-ui">'+esc(ip)+'</span>':'')+
    (Net.on&&!Net.host?'<button class="net-btn ghost" data-x="leave" type="button">مغادرة</button>':'')+'</div>';
  const rows=[{n:Net.name,hp:S.hp,me:1}].concat([...Net.peers.values()].map(p=>({n:p.name,hp:p.hp,lat:p.lat,col:p.col})));
  if(Net.on)h+=rows.map(p=>'<div class="pl"><div class="av" style="background:'+(p.col||'#e08a2e')+'">'+esc((p.n||'?').charAt(0))+'</div><div class="nm">'+esc(p.n)+(p.me?'<i>(أنت)</i>':'')+'</div><div class="hb"><b style="width:'+clamp(p.hp||0,0,100)+'%;background:#7acb55"></b></div><div class="mt">'+(p.lat?p.lat+'ms':'')+'</div></div>').join('');
  m.innerHTML=h;
}
function mxOpen(){
  MX.panel=true;$('mpx').hidden=false;try{$('mxName').value=Net.name&&Net.name!=='رَحّال'?Net.name:($('mxName').value||'')}catch(e){}
  mxRender();mxScan();if(SFX.ui)SFX.ui();
}
function mxShut(){MX.panel=false;$('mpx').hidden=true;netNameGet()}
$('mpx').addEventListener('click',async e=>{
  if(e.target===$('mpx')){mxShut();return}
  const b=e.target.closest('button');if(!b)return;
  if(b.id==='mxClose'){mxShut();return}
  if(b.id==='mxRescan'){mxScan();return}
  if(b.id==='mxIpGo'){await mxJoin($('mxIp').value);return}
  if(b.dataset.j){netNameGet();await mxJoin(b.dataset.j);return}
  if(b.dataset.x==='toggle'){if(MX.open)mxClose();else mxOpenRoom();return}
  if(b.dataset.x==='leave'){mxLeave();return}
});
$('mxName').addEventListener('change',()=>{netNameGet()});
['pointerdown','touchstart'].forEach(ev=>$('mpx').addEventListener(ev,e=>e.stopPropagation(),{passive:true}));
document.addEventListener('click',e=>{
  const b=e.target.closest&&e.target.closest('#netBtn');
  if(b){e.stopImmediatePropagation();e.preventDefault();mxOpen()}
},true);
{const nb=$('netBtn');if(nb)nb.textContent='اللعب الجماعي'}
{const pa=document.querySelector('#pauseMenu .pause-actions'),mb=$('pauseMainBtn');
 if(pa&&mb){const b=document.createElement('button');b.id='mxPauseBtn';b.type='button';b.textContent='اللعب الجماعي';b.addEventListener('click',mxOpen);pa.insertBefore(b,mb)}}
{const ri=$('rosterInvite');if(ri){ri.innerHTML='<button class="net-btn" id="mxFromRoster" type="button">اللعب الجماعي</button>';ri.hidden=false;
  $('mxFromRoster').addEventListener('click',()=>{$('roster').hidden=true;Net.rosterOpen=false;mxOpen()})}}
{const _nu=netUI;netUI=function(){_nu.apply(this,arguments);const ri=$('rosterInvite');if(ri)ri.hidden=false;if(MX.panel)mxRender()}}

/* peers: no hint texts on the canvas */
/* background loop: auto-open the room when a world is live; rescan LAN */
setInterval(()=>{
  try{
    const live=S.alive&&P.state==='live'&&$('splash').hidden&&!Load.on;
    if(MX.open&&!Net.on&&!MX.conn&&live&&Date.now()>MX.noAuto)mxHost();
    const menu=!$('splash').hidden;
    const gap=MX.panel?5000:(menu?6000:(Net.on&&!Net.host?1e9:20000));
    if(!MX.scanning&&Date.now()-MX.scanAt>gap&&!(Net.on&&!Net.host))mxScan();
    if(MX.panel)mxRender();
  }catch(e){}
},1500);

/* ---- wildlife lives around EVERY player, not just the host ---- */
function mxPeersLive(){const a=[];if(Net.on&&Net.role==='admin')for(const q of Net.peers.values())if(q.seen&&q.st!=='dead')a.push(q);return a}
function mxFarAll(e){
  if(Math.hypot(e.x-P.x,e.y-P.y)<=48)return false;
  for(const q of mxPeersLive())if(Math.hypot(e.x-q.rx,e.y-q.ry)<=48)return false;
  return true;
}
function mxNearAny(e,r){
  if(Math.hypot(e.x-P.x,e.y-P.y)<r)return true;
  for(const q of mxPeersLive())if(Math.hypot(e.x-q.rx,e.y-q.ry)<r)return true;
  return false;
}
MX.pSpawnT=0;
{const _me=manageEnts;manageEnts=function(dt){
  _me.apply(this,arguments);
  const ps=mxPeersLive();if(!ps.length)return;
  MX.pSpawnT-=dt;if(MX.pSpawnT>0)return;MX.pSpawnT=1.2;
  const sx=P.x,sy=P.y,st=spawnT;
  MX.spawnOnly=true;
  try{for(const q of ps){P.x=q.rx;P.y=q.ry;spawnT=0;_me(0)}}finally{P.x=sx;P.y=sy;spawnT=st;MX.spawnOnly=false}
}}
