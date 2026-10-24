/* ===== FAUNA ART v2: shaded, jointed-leg animals (drawn in sprite space, ground at y=0, facing +x) ===== */
const faG=(x0,y0,x1,y1,a,b)=>{const g=ctx.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,a);g.addColorStop(1,b);return g};
const faFlick=(e,k)=>Math.sin(e.ph*k+(e.nid||0)*1.7);
const faBlink=e=>((e.ph*.55+(e.nid||0)*.37)%5)<.11;
function faBlob(pts,fill,w){
  const n=pts.length,mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
  ctx.beginPath();const s=mid(pts[n-1],pts[0]);ctx.moveTo(s[0],s[1]);
  for(let i=0;i<n;i++){const c=pts[i],q=mid(pts[i],pts[(i+1)%n]);ctx.quadraticCurveTo(c[0],c[1],q[0],q[1])}
  ctx.closePath();ctx.lineJoin='round';ctx.lineWidth=w||2.2;ctx.strokeStyle=OL2;ctx.stroke();ctx.fillStyle=fill;ctx.fill();
}
function faEye(x,y,r,iris,slit){
  ctx.fillStyle=iris||'#1b1008';ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  if(slit){ctx.fillStyle='#120a05';ctx.beginPath();ctx.ellipse(x+r*.1,y,r*.28,r*.85,0,0,TAU);ctx.fill()}
  ctx.fillStyle='rgba(255,255,255,.88)';ctx.beginPath();ctx.arc(x+r*.38,y-r*.38,r*.36,0,TAU);ctx.fill();
}
function faLid(x,y,r){ctx.strokeStyle='#1b1008';ctx.lineWidth=1.4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x-r,y);ctx.lineTo(x+r,y+.2);ctx.stroke()}
function faStep(e,off,amp,lift,m){const p=e.ph*AN[e.sp].cad+off;return[Math.sin(p)*amp*m,Math.max(0,Math.cos(p))*lift*m]}
function faLeg(hx,hy,fx,fy,l1,l2,w,col,fwd,paw){
  let dx=fx-hx,dy=fy-hy,d=Math.hypot(dx,dy)||1;const mx=l1+l2-.6;
  if(d>mx){fx=hx+dx/d*mx;fy=hy+dy/d*mx;dx=fx-hx;dy=fy-hy;d=mx}
  const a=(l1*l1-l2*l2+d*d)/(2*d),h=Math.sqrt(Math.max(0,l1*l1-a*a)),ux=dx/d,uy=dy/d,s=fwd?1:-1;
  const kx=hx+ux*a+uy*h*s,ky=hy+uy*a-ux*h*s;
  ctx.lineCap='round';ctx.lineJoin='round';
  ctx.strokeStyle=OL2;ctx.lineWidth=w+2.6;ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(kx,ky);ctx.lineTo(fx,fy);ctx.stroke();
  ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(kx,ky);ctx.lineTo(fx,fy);ctx.stroke();
  if(paw)bean(fx+(paw[2]||0),fy-.3,paw[0],paw[1],paw[3]||col,0,1.8);
}
function faTufts(x0,y0,x1,y1,n,len,col,dirx,diry,w){
  ctx.fillStyle=col;ctx.strokeStyle=OL2;ctx.lineWidth=w||1.3;ctx.lineJoin='round';
  for(let i=0;i<n;i++){const t=(i+.5)/n,x=x0+(x1-x0)*t,y=y0+(y1-y0)*t,l=len*(.75+.5*Math.sin(i*2.3));
    ctx.beginPath();ctx.moveTo(x-1.6,y);ctx.lineTo(x+dirx*l,y+diry*l);ctx.lineTo(x+1.6,y);ctx.closePath();ctx.stroke();ctx.fill()}
}
function faStroke(pts,col,w,ol){
  ctx.lineCap='round';ctx.lineJoin='round';
  const path=()=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]))};
  if(ol){path();ctx.strokeStyle=OL2;ctx.lineWidth=w+2.4;ctx.stroke()}
  path();ctx.strokeStyle=col;ctx.lineWidth=w;ctx.stroke();
}

DR.rabbit=function(e,sw,m,g){
  const hop=m>.2,f=faFlick(e,2.1),br=1+Math.sin(e.ph*2.4)*.035;
  const st=o=>faStep(e,o,hop?7:2,hop?4:1,m);
  let a=st(Math.PI);
  faLeg(-3,-5,-4+a[0]*.8,-a[1],4,4.6,2.6,'#94805f',false,[1.9,1.1,1.1,'#85724f']);
  faLeg(5,-4,5+a[0]*.6,-a[1]*.7,3,3.4,2.2,'#9d8666',true);
  ctx.save();ctx.scale(1,br);
  faBlob([[-10,-7],[-7,-13],[1,-14.5],[8,-11],[9,-6],[3,-2.2],[-6,-2.4]],faG(0,-15,0,-2,'#d6bf9c','#b29977'));
  bean(-.5,-4.6,6.4,2.4,'#efe3cb',0,0);
  bean(-5.5,-7.6,5.6,5.4,'#c9b08c',0,1.6);
  ctx.restore();
  bean(-11,-9,2.9,2.9,'#fbf7ef');
  a=st(0);
  faLeg(-3,-5,-4+a[0]*.8,-a[1],4,4.6,2.8,'#b39a78',false,[2,1.2,1.2,'#a08865']);
  faLeg(5,-4,5+a[0]*.6,-a[1]*.7,3,3.4,2.4,'#b9a07f',true);
  const hy=-12+g*5.5,tw=f>.9?.35:0;
  bean(8.4,hy-7.5,1.8,5.6,'#c9b08d',-.28+tw,1.8);bean(8.4,hy-7.8,.8,3.8,'#efb3b3',-.28+tw,0);
  bean(10,hy,5.2,4.2,faG(0,hy-4,0,hy+4,'#dcc7a4','#bda583'));
  bean(11.8,hy-7.2,1.8,5.4,'#d6bf9c',.2-tw*.5,1.8);bean(11.8,hy-7.4,.8,3.6,'#efc3c3',.2-tw*.5,0);
  bean(14.5,hy+1.2,1.4,1.1,'#e29b9b',0,1.3);
  if(faBlink(e))faLid(11.6,hy-1,1.2);else faEye(11.6,hy-1,1.15);
  ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(14,hy+1.6);ctx.lineTo(18,hy+.4);ctx.moveTo(14,hy+2.2);ctx.lineTo(18,hy+2.6);ctx.stroke();
};

DR.deer=function(e,sw,m,g){
  const a1=faStep(e,0,8,6,m),a2=faStep(e,Math.PI,8,6,m),coat='#b97f4a',coatD='#8d5d34',pw=[1.9,1.3,0,'#2a1d14'];
  const hx=24+g*4,hdy=-45+g*22+Math.sin(e.ph*1.1)*.4;
  faLeg(9,-19,9+a2[0],-a2[1],10.5,10,3.6,coatD,true,pw);
  faLeg(-12,-20,-12+a1[0],-a1[1],10.5,10,3.8,coatD,false,pw);
  bean(-18,-27,2.4,3.6,'#f4eee2',-.9+Math.sin(e.ph*3)*.15);
  faBlob([[-18,-23],[-14,-30],[-2,-32],[9,-31],[15,-27],[16,-21],[9,-16],[-4,-15.5],[-14,-16.5]],faG(0,-33,0,-15,'#c28750','#9a6638'));
  bean(-1,-18.6,13,3.2,'#ecd9b6',0,0);
  bean(-15.5,-24,3.6,5,'#f2e6cc',-.2,0);
  ctx.fillStyle='rgba(255,246,225,.7)';[[-7,-27],[-1,-28.5],[5,-27.5],[-10,-23],[2,-24.5],[8,-24]].forEach(p=>{ctx.beginPath();ctx.arc(p[0],p[1],1.05,0,TAU);ctx.fill()});
  faBlob([[7,-31],[13,-33],[hx-1,hdy-1],[hx+5,hdy+4],[16,-22],[8,-22]],faG(0,-32,0,hdy,'#c28854','#b97f4a'));
  if(e.male){
    const bx=hx-2,by=hdy-5;
    [[ [bx,by],[bx-3,by-9],[bx-3,by-17],[bx-6,by-23] ],[ [bx-3,by-9],[bx+3,by-14] ],[ [bx-3,by-17],[bx+2,by-21] ],[ [bx+1,by],[bx+2,by-8],[bx+6,by-14] ]].forEach((p,i)=>faStroke(p,'#d9c9a0',i?1.5:2.1,true));
  }
  bean(hx-3,hdy-6,1.8,4.6,'#a8733f',-.95,1.8);bean(hx-3,hdy-6,.8,3,'#e8b8a0',-.95,0);
  faBlob([[hx-4,hdy-3.5],[hx+2,hdy-5.5],[hx+9,hdy-2],[hx+14,hdy+2],[hx+12.5,hdy+5],[hx+3,hdy+5.5],[hx-3,hdy+3]],faG(0,hdy-5,0,hdy+6,'#c98d57','#a8733f'));
  bean(hx+13.2,hdy+3.2,2.5,2,'#2e2018');bean(hx+10,hdy+4.6,3.6,1,'#e8d2b0',0,0);
  if(faBlink(e))faLid(hx+4.6,hdy-.6,1.5);else faEye(hx+4.6,hdy-.6,1.45);
  faLeg(9,-19,9+a1[0],-a1[1],10.5,10,4,coat,true,pw);
  faLeg(-12,-20,-12+a2[0],-a2[1],10.5,10,4.2,coat,false,pw);
};

DR.boar=function(e,sw,m,g){
  const a1=faStep(e,0,6,4,m),a2=faStep(e,Math.PI,6,4,m),c='#735a45',cd='#4a382a',pw=[2.3,1.5,0,'#2a1d14'],ch=e.st==='charge';
  const hy=-15+g*7+(ch?3:0);
  faLeg(8,-10,8+a2[0],-a2[1],6,6.6,5,cd,true,pw);faLeg(-9,-10,-9+a1[0],-a1[1],6,6.6,5.2,cd,false,pw);
  ctx.strokeStyle=OL2;ctx.lineWidth=3.6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-16,-18);ctx.quadraticCurveTo(-22,-20+Math.sin(e.ph*4)*2,-19,-12);ctx.stroke();
  ctx.strokeStyle='#5a4535';ctx.lineWidth=1.8;ctx.stroke();
  faBlob([[-17,-14],[-13,-22],[-1,-26],[11,-24],[18,-18],[16,-10],[0,-7.5],[-14,-8.5]],faG(0,-27,0,-8,'#86694f','#54402f'));
  bean(0,-10.5,13,2.6,'#8e7358',0,0);
  faTufts(-13,-23,12,-25,10,5.5,'#2c2018',.15,-1);
  faBlob([[13,hy-6],[19,hy-8],[26,hy-3],[28.5,hy+2],[25,hy+6],[16,hy+5],[12,hy]],faG(0,hy-8,0,hy+6,'#7b6048','#5d4635'));
  bean(28,hy+1.2,3,3.9,'#a98876',0,1.8);ctx.fillStyle='#2a1a14';ctx.beginPath();ctx.arc(28.6,hy,.8,0,TAU);ctx.arc(28.6,hy+2.4,.8,0,TAU);ctx.fill();
  faStroke([[24,hy+4.5],[27.5,hy+8],[30,hy+5.4]],'#f2ead2',1.9,true);
  tri(13,hy-5.5,15,hy-12,18.2,hy-5.2,'#4a382a');
  if(faBlink(e))faLid(20.6,hy-1.6,1.3);else faEye(20.6,hy-1.6,1.3,ch?'#b02a1a':'#1b1008');
  faLeg(8,-10,8+a1[0],-a1[1],6,6.6,5.4,c,true,pw);faLeg(-9,-10,-9+a2[0],-a2[1],6,6.6,5.6,c,false,pw);
};

DR.wolf=function(e,sw,m,g){
  const a1=faStep(e,0,8,5.5,m),a2=faStep(e,Math.PI,8,5.5,m),c='#9399a2',cd='#5b6069',pw=[2.2,1.4,.5,'#3d4148'];
  const hunt=e.st==='hunt',lg=e.atkT>.85?1.1:1,sl=e.young&&!e.ally&&e.st==='sit'?1:0;
  const hx=19+g*2,hy=-25+g*8+(hunt?3:0);
  ctx.save();ctx.scale(lg,1);
  faLeg(9,-14,9+a2[0],-a2[1],8.6,8.6,3.6,cd,true,pw);faLeg(-9,-14,-9+a1[0],-a1[1],8.6,8.6,3.8,cd,false,pw);
  const tw=Math.sin(e.ph*(hunt?9:2.5))*(hunt?1.2:3);
  faBlob([[-12,-21],[-19,-18+tw*.3],[-26,-13+tw],[-27,-9+tw],[-22,-11+tw*.6],[-14,-14]],faG(-26,-14,-12,-20,'#4a4f57','#7d838c'));
  faBlob([[-15,-18],[-9,-26],[3,-28],[12,-26],[15,-21],[10,-13],[-4,-12],[-13,-13.5]],faG(0,-28,0,-12,'#a2a8b0','#6c717a'));
  faBlob([[-8,-25],[0,-28.5],[8,-27],[3,-24],[-5,-22.5]],'rgba(70,74,82,.75)',0);
  bean(-1,-14.6,10,2.8,'#dcdfe3',0,0);
  faBlob([[9,-27],[14,-31],[hx-1,hy-3],[hx+3,hy+4],[14,-17],[9,-18]],faG(0,-31,0,hy,'#9a9fa8','#868b94'));
  faTufts(9,-26,16,-30,5,4.5,'#b9bec5',.5,-.9);
  faBlob([[hx-4,hy-3.5],[hx+2,hy-5],[hx+8,hy-2],[hx+14,hy+1.4],[hx+13,hy+4.5],[hx+4,hy+5.5],[hx-3,hy+3.5]],faG(0,hy-5,0,hy+6,'#9aa0a9','#7d838c'));
  faBlob([[hx+6,hy+.5],[hx+14,hy+1.6],[hx+13,hy+4.6],[hx+5,hy+5]],'#d2d5da',1.4);
  bean(hx+14.4,hy+2,1.5,1.2,'#1c1a1a',0,1);
  tri(hx-3,hy-3,hx-1.5,hy-11.5,hx+3.6,hy-3.6,'#5d626b');tri(hx-2,hy-4.2,hx-1.2,hy-9,hx+1.6,hy-4.4,'#c79a9a');
  const ey=e.ally?'#c8a43a':'#e6d36a';
  if(faBlink(e)&&!hunt)faLid(hx+5.8,hy-.8,1.5);else faEye(hx+5.8,hy-.8,1.5,ey,true);
  if(hunt&&e.atkT>.5){faStroke([[hx+11,hy+4.4],[hx+11.6,hy+7.6]],'#fff',1.4);faStroke([[hx+8,hy+4.6],[hx+8.4,hy+7.2]],'#fff',1.4)}
  if(e.ally){ctx.strokeStyle='#8a1f16';ctx.lineWidth=4.2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(10.4,-28);ctx.quadraticCurveTo(14,-22,12.8,-18.6);ctx.stroke();ctx.strokeStyle='#d6453a';ctx.lineWidth=2.4;ctx.stroke()}
  faLeg(9,-14,9+a1[0],-a1[1],8.6,8.6,4,c,true,pw);faLeg(-9,-14,-9+a2[0],-a2[1],8.6,8.6,4.2,c,false,pw);
  ctx.restore();
};

DR.bear=function(e,sw,m,g){
  const a1=faStep(e,0,6,4,m),a2=faStep(e,Math.PI,6,4,m),c='#6a4a33',cd='#43301f';
  const up=e.windup>0?Math.min(1,(.55-e.windup)/.4):0;
  const hy=-30+g*8-up*4,hx=29;
  faLeg(-14,-17,-14+a1[0],-a1[1],9,9,10.4,cd,false,[5.2,2.4,.5,'#2e2016']);
  faLeg(15,-17,15+a2[0],-a2[1],9,9,10.4,cd,true,[5.2,2.4,.5,'#2e2016']);
  faBlob([[-24,-20],[-19,-32],[-8,-39],[4,-43],[16,-38],[24,-29],[22,-17],[8,-11],[-12,-11],[-22,-14]],faG(0,-44,0,-10,'#7a5638','#43301f'),2.6);
  faTufts(-18,-34,18,-40,11,5,'#4b3322',0,-1);
  ctx.strokeStyle='rgba(30,18,10,.45)';ctx.lineWidth=1;for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(-14+i*5,-34-Math.sin(i)*2);ctx.lineTo(-12+i*5,-24);ctx.stroke()}
  faLeg(-8,-17,-8+a2[0],-a2[1],9,9,11,c,false,[5.4,2.5,.5,'#2e2016']);
  if(up>0){faStroke([[17,-24],[24+up*8,-30-up*8],[27+up*10,-38-up*14]],c,11,true);for(let k=-1;k<=1;k++)faStroke([[27+up*10+k*2,-38-up*14],[29+up*10+k*2.4,-41-up*14.6]],'#efe6d0',1.6)}
  else faLeg(17,-17,17+a1[0],-a1[1],9,9,11.4,c,true,[5.6,2.6,.5,'#2e2016']);
  bean(hx-6,hy-9.6,3.4,3.4,cd,0,2);bean(hx+3,hy-9.8,3.2,3.2,cd,0,2);bean(hx-6,hy-9.6,1.5,1.5,'#8f6e4c',0,0);
  faBlob([[hx-9,hy-5],[hx-2,hy-9],[hx+7,hy-6],[hx+11,hy+1],[hx+8,hy+8],[hx-3,hy+9],[hx-9,hy+3]],faG(0,hy-9,0,hy+9,'#745339','#5a3f2a'),2.4);
  faBlob([[hx+3,hy+1],[hx+11,hy+1.4],[hx+13,hy+5],[hx+7,hy+8.5],[hx+2,hy+6]],'#a07d57',1.6);
  bean(hx+12.2,hy+2,2.2,1.7,'#17100c',0,1);
  if(faBlink(e))faLid(hx+3.2,hy-2.4,1.5);else faEye(hx+3.2,hy-2.4,1.5);
  if(up>.2){ctx.fillStyle='#8a1a14';ctx.beginPath();ctx.ellipse(hx+9,hy+7,3.2,1.6+up*1.8,0,0,TAU);ctx.fill();faStroke([[hx+7.4,hy+6],[hx+7.6,hy+8.6]],'#fff',1.3);faStroke([[hx+10.4,hy+6.4],[hx+10.6,hy+8.8]],'#fff',1.3)}
};

DR.snake=function(e,sw,m,g){
  const n=18,t=e.ph*6*(.4+m),pts=[],rise=e.windup>0?1:(e.st==='alert'?.5:0);
  for(let i=0;i<n;i++){
    let x=-24+i*2.8,y=-3-Math.sin(i*.7+t)*3*(.7+m*.5);
    const h=Math.pow(i/(n-1),3)*rise;x+=h*5;y-=h*13;
    pts.push([x,y]);
  }
  for(let pass=0;pass<3;pass++)for(let i=n-1;i>0;i--){
    const tk=.45+.55*Math.min(1,i/9),w=(pass===0?8.6:pass===1?6:2.3)*tk*(i>n-4?.9:1);
    ctx.lineCap='round';
    ctx.strokeStyle=pass===0?OL2:pass===1?(i%4<2?'#6c8a37':'#547232'):(i%4<2?'#d9e08a':'#c9d36e');
    if(pass===2&&!(i%2))continue;
    ctx.lineWidth=Math.max(1.2,w);ctx.beginPath();ctx.moveTo(pts[i][0],pts[i][1]);ctx.lineTo(pts[i-1][0],pts[i-1][1]);ctx.stroke();
  }
  ctx.fillStyle='rgba(30,40,14,.55)';for(let i=2;i<n-3;i+=2){ctx.beginPath();ctx.ellipse(pts[i][0],pts[i][1]-.6,1.7,1.2,0,0,TAU);ctx.fill()}
  const h=pts[n-1],ang=-.2-rise*.9;
  ctx.save();ctx.translate(h[0],h[1]);ctx.rotate(ang);
  faBlob([[-3,-3.6],[3,-3.8],[8,-1],[8,1.8],[2,3.4],[-3,3]],faG(0,-4,0,4,'#7c9a40','#587535'),2);
  faEye(3.6,-1.4,1.3,'#e6d36a',true);
  if(Math.sin(e.ph*9)>.2||rise>0){faStroke([[8,.4],[12,.4]],'#c0302a',1,false);faStroke([[12,.4],[14,-.8]],'#c0302a',.9,false);faStroke([[12,.4],[14,1.6]],'#c0302a',.9,false)}
  ctx.restore();
};

DR.mammoth=function(e,sw,m,g){
  const a1=faStep(e,0,8,4,m),a2=faStep(e,Math.PI,8,4,m),c='#70503a',cd='#4e3626',fur='#5a3e2c',pw=[8.4,3.4,0,'#3a281c'];
  const hx=49,hy=-49+g*11;
  faLeg(-24,-30,-24+a2[0],-a2[1],15,15,15,cd,false,pw);faLeg(23,-30,23+a1[0],-a1[1],15,15,15,cd,true,pw);
  faBlob([[-44,-40],[-36,-62],[-14,-76],[8,-84],[28,-76],[44,-58],[46,-36],[34,-22],[0,-20],[-34,-24]],faG(0,-84,0,-20,'#86614a','#4e3626'),3);
  for(let i=0;i<8;i++){const x=-38+i*10.5;faBlob([[x-5,-26],[x,-8-(i%3)*5],[x+5,-26]],i%2?fur:'#684633',1.6)}
  faTufts(-36,-56,40,-76,16,7,'#4a3224',-.2,-1,1.4);
  ctx.strokeStyle='rgba(30,16,8,.4)';ctx.lineWidth=1.2;for(let i=0;i<10;i++){ctx.beginPath();ctx.moveTo(-34+i*7,-60+Math.sin(i)*4);ctx.lineTo(-36+i*7,-36);ctx.stroke()}
  faLeg(-12,-30,-12+a1[0],-a1[1],15,15,15.6,c,false,pw);faLeg(35,-30,35+a2[0],-a2[1],15,15,15.6,c,true,pw);
  faBlob([[30,-70],[40,-84],[54,-86],[62,-74],[58,-58],[44,-52],[32,-58]],faG(0,-86,0,-52,'#7b5740','#5a3e2c'),2.8);
  faTufts(36,-84,56,-86,6,6,'#4a3224',0,-1,1.3);
  faBlob([[hx-8,hy-12],[hx+2,hy-16],[hx+14,hy-8],[hx+16,hy+4],[hx+8,hy+14],[hx-6,hy+8]],faG(0,hy-16,0,hy+14,'#7b5740','#5f4331'),2.6);
  ctx.save();ctx.translate(hx-9,hy-4);ctx.rotate(-.2+Math.sin(e.ph*1.4)*.06);bean(0,0,6.4,11,'#5a3e2c',0,2.2);bean(.8,1,3.2,7.4,'#a77f6c',0,0);ctx.restore();
  const tx=hx+14,tw=Math.sin(e.ph*2)*3.5+(e.windup>0?-8:0);
  faStroke([[tx,hy+2],[tx+8,hy+12],[tx+7+tw*.5,hy+26],[tx+3+tw,hy+38]],'#6a4a37',9,true);
  for(let i=1;i<5;i++){ctx.strokeStyle='rgba(30,16,8,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(tx+3+i,hy+4+i*7);ctx.lineTo(tx+9+i,hy+4+i*7);ctx.stroke()}
  faStroke([[hx+9,hy+7],[hx+22,hy+13],[hx+31,hy+4],[hx+30,hy-8]],'#f2e8cb',5.2,true);
  ctx.strokeStyle='rgba(120,100,60,.5)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(hx+14,hy+10);ctx.quadraticCurveTo(hx+27,hy+11,hx+28,hy-3);ctx.stroke();
  if(faBlink(e))faLid(hx+6,hy-3,2);else faEye(hx+6,hy-3,1.9);
  if(e.windup>0){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(40,-46,40+Math.sin(e.ph*30)*2,-.5,.5);ctx.stroke()}
};

DR.bird=function(e,sw,m,g){
  const fly=e.st==='fly'||e.st==='land',fl=Math.sin(e.ph*22),dk='rgba(20,12,8,.28)';
  const cc=e.col||'#8a7a6a',crest=((e.nid||0)%3)===0;
  if(fly){
    ctx.save();ctx.translate(-1,-7);ctx.rotate(.5-fl*.9);bean(0,-4,2.4,7,dk,0,1.4);ctx.restore();
    faBlob([[-9,-5],[-5,-8],[3,-8.5],[8,-6.6],[8,-3.6],[2,-2.6],[-6,-3]],faG(0,-9,0,-2,cc,'rgba(0,0,0,0)'),1.8);
    bean(-1,-4.5,6,2.6,cc,0,0);
    tri(-8,-5,-15,-6+fl*.8,-9,-2.6,cc);tri(-8,-4.4,-14,-3.6+fl*.8,-9,-2,'#00000033');
    bean(6,-7.4,2.6,2.4,cc);tri(8.4,-7.6,11.8,-6.8,8.4,-5.8,'#e8b64a');faEye(7.4,-8,.7);
    ctx.save();ctx.translate(-1,-7);ctx.rotate(-.5+fl*.9);bean(0,-4.2,2.5,7.4,cc,0,1.8);bean(0,-5,1.2,4.4,'#ffffff44',0,0);ctx.restore();
  }else{
    tri(-6,-4,-14,-6.4,-8,-1.8,cc);tri(-6,-3.4,-13,-3,-8,-1,'#00000033');
    faBlob([[-7,-4],[-4,-8.5],[3,-8.6],[7,-5],[5,-1.6],[-2,-1.2],[-6,-1.8]],faG(0,-9,0,-1,cc,'#00000044'),1.8);
    bean(-1,-3.6,4.4,2,'#f3ecdc',0,0);bean(-3,-5.6,4,2,'#00000025',-.2,0);
    bean(4.4,-8,2.7,2.5,cc);if(crest)tri(2,-9.6,3.2,-13.4,5,-10,cc);
    tri(6.8,-8,10,-7.4,6.8,-6.4,'#e8b64a');
    if(faBlink(e))faLid(5.4,-8.6,.8);else faEye(5.4,-8.6,.8);
    if(e.st==='ground'){faStroke([[-1,-2],[-1+sw*1.6,0]],'#6a4a2a',1);faStroke([[1,-2],[1-sw*1.6,0]],'#6a4a2a',1)}
    else faStroke([[-1,-1.4],[-1,0]],'#6a4a2a',1);
  }
};

DR.butterfly=function(e,sw,m,g){
  const f=Math.abs(Math.sin(e.ph*14)),c=e.col||'#f0c040';
  ctx.save();
  [[-1,-.45],[1,.45]].forEach(s=>{
    ctx.save();ctx.translate(s[0]*.6,-2);ctx.scale(Math.max(.15,f),1);
    bean(s[0]*3.2,-1.6,3.6,3.8,c,s[1],1.2);bean(s[0]*2.6,2,2.4,2.6,c,-s[1],1.2);
    ctx.fillStyle='rgba(30,20,10,.55)';ctx.beginPath();ctx.arc(s[0]*3.6,-2,1,0,TAU);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.55)';ctx.beginPath();ctx.arc(s[0]*2.4,-.2,.8,0,TAU);ctx.fill();
    ctx.restore();
  });
  ctx.restore();
  faStroke([[0,-5],[0,1]],'#2b180d',1.6,false);faStroke([[0,-5],[-1.8,-7.4]],'#2b180d',.7,false);faStroke([[0,-5],[1.8,-7.4]],'#2b180d',.7,false);
};

DR.frog=function(e,sw,m,g){
  const air=e.st==='hop',pulse=1+Math.sin(e.ph*5)*.08;
  faLeg(-2,-3,air?-9:-5,air?-1:0,3,3.4,2.4,'#3f7f2a',false,[1.6,.9,.6,'#4a8a2e']);
  faBlob([[-6,-3.6],[-3,-7],[3,-7.4],[7,-4.6],[5,-1.4],[-1,-1],[-5,-1.6]],faG(0,-8,0,-1,'#6aa845','#3f7f2a'),1.8);
  bean(0,-2.4,4.4,1.6,'#d9e8a8',0,0);
  ctx.fillStyle='rgba(30,70,20,.55)';[[-2,-5],[1,-6],[-4,-3.6],[3,-4.8]].forEach(p=>{ctx.beginPath();ctx.arc(p[0],p[1],.9,0,TAU);ctx.fill()});
  bean(6,-3.4,2.1*pulse,1.6*pulse,'#e8efb8',0,1.2);
  bean(4.4,-7.6,1.9,1.9,'#5a9a3a',0,1.6);ctx.fillStyle='#e6c74a';ctx.beginPath();ctx.arc(4.6,-7.8,1.1,0,TAU);ctx.fill();ctx.fillStyle='#120a05';ctx.beginPath();ctx.ellipse(4.8,-7.8,.4,.9,0,0,TAU);ctx.fill();
  faLeg(2,-3,air?8:3.5,air?-1:0,2.2,2.6,2,'#4a8a2e',true,[1.1,.7,.5,'#4a8a2e']);
};

DR.fish=function(e,sw,m,g){
  const w=Math.sin(e.ph*9)*2.4;ctx.globalAlpha=.85;
  faBlob([[-14,0+w*.6],[-8,-3.6+w],[-8,3.6+w],[-14,-.2+w*.6]],'#34566a',1.4);
  tri(-4,-3,-1,-7.6,3,-3.2,'#3a566a');
  faBlob([[-8,0],[-3,-3.6],[4,-3.8],[9,-.6],[4,3.4],[-3,3.6]],faG(0,-4,0,4,'#5a86a2','#9ec0d0'),1.6);
  bean(1,1.4,6,1.2,'#e3eef2',0,0);
  ctx.strokeStyle='rgba(255,255,255,.28)';ctx.lineWidth=.8;for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(-1+i*2.4,-.4,2.3,-1,1);ctx.stroke()}
  faStroke([[4.2,-2.6],[4.2,2.6]],'rgba(20,40,50,.5)',.9,false);
  faEye(6.4,-.8,.95);
  ctx.globalAlpha=1;ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,11+Math.sin(e.ph*3)*1.5,5.4,0,0,TAU);ctx.stroke();
};

DR.sabertooth=function(e,sw,m,g){
  const a1=faStep(e,0,9,6,m),a2=faStep(e,Math.PI,9,6,m),c='#c58c4e',cd='#8a5a2c',pw=[3.4,1.8,.6,'#6e4824'];
  const crouch=(e.st==='stalk'?5:0)+(e.sleep?9:0),leap=e.leap>0?1:0;
  const hx=22+(e.st==='stalk'?4:0)+g*2,hy=-26+crouch*.7+(e.st==='stalk'?-1:0)+g*8,by=crouch;
  ctx.save();ctx.translate(0,by*.55);
  faLeg(11,-16,11+a2[0]+leap*8,-a2[1]-leap*6,9,9,5.6,cd,true,pw);faLeg(-12,-16,-12+a1[0]-leap*8,-a1[1]-leap*4,9,9,5.8,cd,false,pw);
  const tl=Math.sin(e.ph*(e.st==='stalk'?6:2))*3;
  faStroke([[-17,-22],[-24,-20+tl*.4],[-28,-14+tl]],'#8a5a2c',5,true);bean(-28,-14+tl,2.4,2.4,'#3a2414',0,1.2);
  faBlob([[-19,-22],[-14,-31],[-1,-32.5],[11,-31],[18,-26],[17,-18],[7,-13],[-8,-12.5],[-17,-14]],faG(0,-33,0,-12,'#d19a5a','#a8723a'),2.4);
  bean(-1,-14.5,11,2.8,'#ecd9b4',0,0);
  ctx.strokeStyle='rgba(80,42,14,.55)';ctx.lineWidth=1.8;ctx.lineCap='round';for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(-12+i*4.4,-30);ctx.lineTo(-10+i*4.4,-22+Math.sin(i)*1.5);ctx.stroke()}
  faTufts(9,-31,16,-30,4,3.6,'#8a5a2c',.6,-.8,1);
  faBlob([[9,-30],[15,-33],[hx-1,hy-4],[hx+4,hy+4],[14,-19],[8,-20]],faG(0,-33,0,hy,'#c78f52','#b27c42'));
  faBlob([[hx-5,hy-5],[hx+2,hy-7],[hx+9,hy-4],[hx+15,hy+1],[hx+14,hy+6],[hx+4,hy+7.4],[hx-4,hy+5]],faG(0,hy-7,0,hy+8,'#d3a062','#b27c42'),2.4);
  faBlob([[hx+7,hy+.4],[hx+15,hy+1.4],[hx+14,hy+5.6],[hx+6,hy+6]],'#ecd9b4',1.4);
  bean(hx+15,hy+1.6,1.6,1.3,'#3a1a14',0,1);
  const jaw=e.st==='pounce'||e.leap>0||(e.windup>0)||e.atkT>1.3?1:0;
  tri(hx+7.4,hy+5.2,hx+8.6,hy+15+jaw*3,hx+10.8,hy+5.4,'#f6f0de');tri(hx+10.8,hy+5.2,hx+12,hy+14+jaw*3,hx+13.4,hy+5,'#efe7cf');
  bean(hx-3.4,hy-6.4,2.2,2.6,cd,0,1.8);
  if(faBlink(e)&&!jaw)faLid(hx+5.8,hy-1.4,1.7);else faEye(hx+5.8,hy-1.4,1.7,'#d9a82e',true);
  faLeg(11,-16,11+a1[0]+leap*8,-a1[1]-leap*6,9,9,6,c,true,pw);faLeg(-12,-16,-12+a2[0]-leap*8,-a2[1]-leap*4,9,9,6.2,c,false,pw);
  ctx.restore();
};

DR.bison=function(e,sw,m,g){
  const a1=faStep(e,0,7,4.5,m),a2=faStep(e,Math.PI,7,4.5,m),c='#5a3d2b',cd='#2e2018',pw=[3,1.8,0,'#1c130c'],ch=e.st==='charge';
  const hx=26,hy=-25+g*12+(ch?5:0);
  faLeg(14,-14,14+a2[0],-a2[1],8,8,6.6,cd,true,pw);faLeg(-13,-15,-13+a1[0],-a1[1],8,8,6.4,cd,false,pw);
  faStroke([[-20,-24],[-24,-18+Math.sin(e.ph*3)*2],[-23,-9]],'#2e2018',2.6,true);bean(-23,-8,2.6,3.6,'#1f150d',0,1.6);
  faBlob([[-22,-20],[-20,-32],[-8,-36],[8,-42],[20,-38],[26,-28],[22,-16],[6,-12],[-14,-12],[-21,-14]],faG(0,-44,0,-11,'#6a4a35','#3a281c'),2.6);
  faBlob([[-22,-20],[-20,-30],[-10,-32],[-6,-22],[-12,-13],[-21,-14]],faG(0,-32,0,-12,'#8a6a4c','#6a4e36'),0);
  faTufts(-4,-40,22,-34,8,5.4,'#26190f',.4,-.9,1.2);
  faBlob([[16,-26],[24,-36],[hx+2,hy-5],[hx+8,hy+6],[hx+2,hy+14],[16,-12]],faG(0,-36,0,hy+10,'#4a3224','#2e2018'),2.4);
  faTufts(18,-14,hx+6,hy+13,7,6,'#1f150d',-.2,1,1.2);
  faBlob([[hx-3,hy-7],[hx+4,hy-9],[hx+11,hy-4],[hx+13,hy+3],[hx+8,hy+8],[hx-1,hy+6]],faG(0,hy-9,0,hy+8,'#5a3d2b','#3a281c'),2.4);
  bean(hx+12,hy+4.4,3.4,2.4,'#3a2a22',0,1.6);ctx.fillStyle='#120b07';ctx.beginPath();ctx.arc(hx+13.4,hy+3.8,.7,0,TAU);ctx.fill();
  faStroke([[hx-2,hy-7],[hx-4,hy-13],[hx+1,hy-17]],'#e6dcc0',2.6,true);faStroke([[hx+5,hy-8],[hx+9,hy-14],[hx+14,hy-14]],'#efe6cc',2.6,true);
  bean(hx-4,hy-5,1.6,3.2,cd,-.9,1.6);
  if(faBlink(e))faLid(hx+6,hy-2.6,1.4);else faEye(hx+6,hy-2.6,1.4,ch?'#b02a1a':'#1b1008');
  faLeg(14,-14,14+a1[0],-a1[1],8,8,7,c,true,pw);faLeg(-13,-15,-13+a2[0],-a2[1],8,8,6.8,c,false,pw);
};
