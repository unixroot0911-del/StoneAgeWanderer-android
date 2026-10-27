/* ===== v3o: frozen lakes in winter, water shimmer ===== */
let iceK=0;
{const _u=update;update=function(){
  const dd=((S.day-1)%24)-18+tod;                 /* winter = days 18..24 of the year */
  const k=seas===3?clamp((dd-1.2)/1.6,0,1):0;
  iceK+=(k-iceK)*.02;if(k===0&&iceK<.01)iceK=0;
  return _u.apply(this,arguments)}}
{const _w=wdep;wdep=function(x,y){const d=_w(x,y);return(d>0&&iceK>.7)?0:d}}
function iceShine(cx,cy,i,j){
  const sh=Math.sin(time*1.3+i*1.7+j*2.3);
  if(sh>.55&&iceK<.5){const ox=Math.sin(i*9.1+j*3.3)*HW*.2;ctx.strokeStyle='rgba(255,255,255,'+((sh-.55)*.55).toFixed(2)+')';ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(cx-5+ox,cy);ctx.lineTo(cx+5+ox,cy-1);ctx.stroke()}
}
