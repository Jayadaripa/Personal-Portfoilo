import {useEffect, useRef} from 'react';
export default function Background(){
 const canvasRef=useRef(null);
 useEffect(()=>{
  const canvas=canvasRef.current,ctx=canvas.getContext('2d'); let w=0,h=0,raf=0,particles=[];
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const resize=()=>{const dpr=Math.min(devicePixelRatio||1,1.5);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);particles=Array.from({length:w<700?22:55},()=>({x:Math.random()*w,y:Math.random()*h,r:.4+Math.random()*1.3,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,a:.18+Math.random()*.42,p:Math.random()*6.28}));};
  const draw=()=>{ctx.clearRect(0,0,w,h);particles.forEach(p=>{if(!reduce){p.x+=p.vx;p.y+=p.vy;p.p+=.008;if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;}ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(143,171,255,${p.a*(.7+.3*Math.sin(p.p))})`;ctx.shadowBlur=9;ctx.shadowColor='rgba(94,118,255,.5)';ctx.fill();});ctx.shadowBlur=0;if(!reduce)raf=requestAnimationFrame(draw);};
  resize();draw();addEventListener('resize',resize);return()=>{cancelAnimationFrame(raf);removeEventListener('resize',resize);};
 },[]);
 return <><div className="aurora aurora-a"/><div className="aurora aurora-b"/><div className="aurora aurora-c"/><div className="grid-bg"/><canvas ref={canvasRef} className="particles" aria-hidden="true"/><div className="cursor-glow" aria-hidden="true"/></>;
}
