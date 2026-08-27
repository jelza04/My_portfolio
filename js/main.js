const LNC=()=>document.documentElement.dataset.theme==='light'?'30,28,24':'242,240,236';
const TLC=()=>document.documentElement.dataset.theme==='light'?'11,138,108':'61,219,180';
const LVC=()=>document.documentElement.dataset.theme==='light'?'95,72,201':'179,162,236';
gsap.registerPlugin(ScrollTrigger);
const lenis=new Lenis({duration:1.2,smoothWheel:true});
lenis.on('scroll',ScrollTrigger.update);
gsap.ticker.add(t=>lenis.raf(t*1000));
gsap.ticker.lagSmoothing(0);

const loader=document.getElementById('loader'),count=document.getElementById('count');
lenis.stop();let c={v:0};
gsap.to(c,{v:100,duration:1.4,ease:'power2.inOut',
  onUpdate:()=>count.textContent=String(Math.round(c.v)).padStart(3,'0'),
  onComplete(){loader.classList.add('done');lenis.start();
    gsap.to('#wire1',{strokeDashoffset:0,duration:2.6,ease:'power2.inOut',delay:.2});
    gsap.to('#wire2',{strokeDashoffset:0,duration:2.6,ease:'power2.inOut',delay:.55});
    gsap.from('.hero-top>*:not(.hi)',{opacity:0,y:26,duration:1,stagger:.14,delay:.55,ease:'power3.out'});
    typeHero();
  }});

const dot=document.getElementById('cdot');
const heroEl=document.querySelector('.hero');
let inkLast=0;
addEventListener('mousemove',e=>{
  const hb=heroEl.getBoundingClientRect().bottom;
  const inHero=hb>0&&e.clientY<hb;
  dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';
  if(inHero){const n=performance.now();
    if(n-inkLast>36){inkLast=n;
      const k=document.createElement('div');k.className='ink';
      const s=6+Math.random()*10;
      k.style.cssText+=`left:${e.clientX}px;top:${e.clientY}px;width:${s}px;height:${s}px`;
      document.body.appendChild(k);
      k.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:.7},{transform:'translate(-50%,-50%) scale(.05)',opacity:0}],{duration:640,easing:'ease-out'}).onfinish=()=>k.remove();
    }}
});
document.querySelectorAll('a,button,.chip,.work').forEach(el=>{
  el.addEventListener('mouseenter',()=>dot.classList.add('hov'));
  el.addEventListener('mouseleave',()=>dot.classList.remove('hov'));
});

gsap.to('#progress',{scaleX:1,ease:'none',scrollTrigger:{scrub:.3,start:0,end:'max'}});
const secname=document.getElementById('secname');
document.querySelectorAll('[data-sec]').forEach(s=>{
  ScrollTrigger.create({trigger:s,start:'top 55%',end:'bottom 55%',
    onEnter:()=>secname.textContent=s.dataset.sec,
    onEnterBack:()=>secname.textContent=s.dataset.sec});
});

const ic=document.getElementById('isoc'),ictx=ic.getContext('2d');
let IW=0,IH=0,curX=-9999,curY=-9999;
let springs=[],deco=[];
const RH=8;
function icres(){const d=devicePixelRatio||1,r=ic.parentElement.getBoundingClientRect();IW=r.width;IH=r.height;ic.width=IW*d;ic.height=IH*d;ictx.setTransform(d,0,0,d,0,0);buildField()}
function buildField(){
  springs=[];deco=[];
  const fl=IH-16;
  for(let x=54;x<IW-40;x+=84){
    springs.push({x,n:4+((x/84|0)%3),c:0,v:0,rw:24});
  }
  for(let x=96;x<IW-60;x+=110){
    deco.push({x:x+20,n:3+((x/110|0)%2),c:0,v:0,rw:16,by:fl-92});
  }
}
icres();addEventListener('resize',icres);
const ball={x:120,y:120,vx:0,vy:0,r:14,rot:0,sq:0};
const hoop={rx:32};
let score=0,fx=0,netW=0,drag=false,px=0,py=0,pt=0,prevY=0,cd=0,hinted=false,started=false;
const parts=[],trail=[];
const HX=()=>IW*.85,HY=()=>IH-16-238;
function c2c(e){const r=ic.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]}
addEventListener('pointerdown',e=>{const[x,y]=c2c(e);
  if(y>0&&y<IH&&Math.hypot(x-ball.x,y-ball.y)<64){drag=true;hinted=true;px=x;py=y;pt=performance.now();ball.vx=0;ball.vy=0;e.preventDefault()}},{passive:false});
addEventListener('pointermove',e=>{const[x,y]=c2c(e);curX=x;curY=y;
  if(drag){const n=performance.now(),dtm=Math.max((n-pt)/1000,.008);
    ball.vx=ball.vx*.4+((x-px)/dtm)*.6;ball.vy=ball.vy*.4+((y-py)/dtm)*.6;
    ball.x=x;ball.y=Math.min(y,IH-40);px=x;py=y;pt=n}});
addEventListener('pointerup',()=>drag=false);
let lastT=performance.now();
(function gLoop(){
  requestAnimationFrame(gLoop);
  const now=performance.now(),dt=Math.min((now-lastT)/1000,.033);lastT=now;
  if(scrollY>innerHeight*1.25)return;
  const fl=IH-16,hx=HX(),hy=HY();
  if(!started&&IW>0){started=true;ball.x=springs.length?springs[1].x:120;ball.y=fl-140;prevY=ball.y}
  if(!drag){
    ball.vy+=1500*dt;
    if(curX>-999&&curY>0&&curY<IH){
      const st=Math.max(-900,Math.min(900,(curX-ball.x)*3.2));
      ball.vx+=st*dt;hinted=hinted||Math.abs(st)>200;
    }
    ball.vx*=1-(.28*dt);
    ball.vx=Math.max(-460,Math.min(460,ball.vx));
    ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;
    for(const s of springs){
      const rh=RH*(1-Math.max(s.c,0)*.5),topY=fl-s.n*rh-4;
      if(ball.vy>0&&Math.abs(ball.x-s.x)<s.rw+ball.r*.35&&ball.y+ball.r>topY&&ball.y+ball.r<topY+32){
        ball.y=topY-ball.r;
        ball.vy=-(700+Math.max(s.c,0)*260+Math.random()*70);
        ball.sq=1;s.v+=6.5;
      }
    }
    if(ball.y+ball.r>fl){ball.y=fl-ball.r;if(Math.abs(ball.vy)>60){ball.vy*=-.85;ball.sq=1}else ball.vy=-620}
    if(ball.x-ball.r<10){ball.x=10+ball.r;ball.vx=Math.abs(ball.vx)*.8;ball.sq=1}
    if(ball.x+ball.r>IW-10){ball.x=IW-10-ball.r;ball.vx=-Math.abs(ball.vx)*.8;ball.sq=1}
    if(ball.y-ball.r<6&&ball.vy<0){ball.y=6+ball.r;ball.vy*=-.7}
    for(const rpx of[hx-hoop.rx,hx+hoop.rx]){
      const cx=ball.x-rpx,cy=ball.y-hy,d=Math.hypot(cx,cy),mn=ball.r+3;
      if(d<mn&&d>0){const nx=cx/d,ny=cy/d;ball.x=rpx+nx*mn;ball.y=hy+ny*mn;
        const dot=ball.vx*nx+ball.vy*ny;if(dot<0){ball.vx-=1.72*dot*nx;ball.vy-=1.72*dot*ny;netW=Math.min(netW+.4,1)}}
    }
    if(now>cd&&ball.vy>0&&Math.abs(ball.x-hx)<hoop.rx-8&&prevY<=hy&&ball.y>hy){
      score++;fx=1;netW=1;cd=now+700;window.__hideGn&&window.__hideGn();
      const sp=document.getElementById('scorepix');
      sp.innerHTML='SCORE<br>'+String(score).padStart(2,'0');
      sp.animate([{transform:'translateY(-50%) scale(1.3)'},{transform:'translateY(-50%) scale(1)'}],{duration:320,easing:'ease-out'});
      for(let i=0;i<20;i++)parts.push({x:hx,y:hy+10,vx:(Math.random()-.5)*440,vy:-Math.random()*400-60,l:1,c:Math.random()<.5?TLC():LVC()});
    }
    ball.rot+=ball.vx*dt/ball.r;
  }else{ball.rot+=ball.vx*dt/ball.r*.3}
  prevY=ball.y;
  ball.sq=Math.max(0,ball.sq-dt*5);
  fx=Math.max(0,fx-dt*2);netW*=(1-dt*1.8);
  const upd=s=>{
    let tgt=0;
    if(curY>0&&curY<IH&&curX>-999){
      const d=Math.abs(s.x-curX);
      if(d<110)tgt=.55*(1-d/110);
    }
    s.v+=(-90*(s.c-tgt)-8*s.v)*dt;s.c+=s.v*dt;
    s.c=Math.max(-.3,Math.min(s.c,.85));
  };
  springs.forEach(upd);deco.forEach(upd);
  trail.push([ball.x,ball.y]);if(trail.length>14)trail.shift();
  ictx.clearRect(0,0,IW,IH);
  ictx.setLineDash([4,8]);ictx.strokeStyle=`rgba(${LNC()},.14)`;ictx.lineWidth=1;
  ictx.beginPath();ictx.moveTo(0,fl);ictx.lineTo(IW,fl);ictx.stroke();
  ictx.beginPath();ictx.moveTo(30,fl-92);ictx.lineTo(IW-40,fl-92);ictx.stroke();
  ictx.setLineDash([]);
  const drawSpring=(s,base,dim)=>{
    const rh=(dim?6:RH)*(1-Math.max(s.c,0)*.5),act=Math.min(Math.abs(s.c)*1.6,1);
    ictx.lineWidth=dim?1:1.3;
    for(let k=0;k<s.n;k++){
      const yy=base-k*rh-3,jx=Math.sin(k*1.35+now*.004)*s.c*6;
      const alpha=(dim?.16:.38)+k*.05+act*.25;
      ictx.strokeStyle=act>.12?`rgba(${TLC()},${alpha.toFixed(2)})`:`rgba(${LNC()},${alpha.toFixed(2)})`;
      ictx.beginPath();ictx.ellipse(s.x+jx,yy,s.rw,dim?5:7,0,0,6.2832);ictx.stroke();
    }
  };
  deco.forEach(s=>drawSpring(s,s.by,true));
  springs.forEach(s=>drawSpring(s,fl,false));
  const bbx=hx+hoop.rx+28;
  ictx.strokeStyle=`rgba(${LNC()},.55)`;ictx.lineWidth=1.5;
  ictx.beginPath();ictx.moveTo(bbx,hy-62);ictx.lineTo(bbx,hy+8);ictx.stroke();
  ictx.beginPath();ictx.moveTo(bbx,hy-6);ictx.lineTo(hx+hoop.rx,hy);ictx.stroke();
  ictx.strokeStyle=`rgba(${LNC()},.22)`;
  ictx.beginPath();ictx.moveTo(bbx,hy+8);ictx.lineTo(bbx,fl);ictx.stroke();
  const sw=Math.sin(now*.012)*netW*10;
  ictx.strokeStyle=`rgba(${LNC()},.4)`;ictx.lineWidth=1;
  for(let i=0;i<=5;i++){
    const t=i/5,x0=hx-hoop.rx+t*hoop.rx*2;
    ictx.beginPath();ictx.moveTo(x0,hy);
    ictx.quadraticCurveTo(x0+(hx-x0)*.3+sw,hy+24,hx+(x0-hx)*.25+sw,hy+42);
    ictx.stroke();
  }
  ictx.strokeStyle=`rgba(${TLC()},1)`;ictx.lineWidth=2;
  ictx.beginPath();ictx.ellipse(hx,hy,hoop.rx,8,0,0,6.2832);ictx.stroke();
  for(let i=0;i<trail.length;i++){const a=i/trail.length*.15;
    ictx.beginPath();ictx.arc(trail[i][0],trail[i][1],ball.r*(.4+i/trail.length*.5),0,6.2832);
    ictx.strokeStyle=`rgba(${TLC()},${a.toFixed(3)})`;ictx.lineWidth=1;ictx.stroke()}
  for(let i=parts.length-1;i>=0;i--){const p=parts[i];
    p.vy+=1200*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt*1.3;
    if(p.l<=0){parts.splice(i,1);continue}
    ictx.fillStyle=`rgba(${p.c},${Math.max(p.l,0).toFixed(2)})`;
    ictx.fillRect(p.x,p.y,3,3)}
  ictx.save();ictx.translate(ball.x,ball.y);
  ictx.scale(1+ball.sq*.22,1-ball.sq*.22);
  ictx.rotate(ball.rot);
  ictx.strokeStyle=`rgba(${LNC()},1)`;ictx.lineWidth=1.6;
  ictx.beginPath();ictx.arc(0,0,ball.r,0,6.2832);ictx.stroke();
  ictx.strokeStyle='rgba(61,219,180,.85)';ictx.lineWidth=1.2;
  ictx.beginPath();ictx.moveTo(-ball.r,0);ictx.lineTo(ball.r,0);ictx.stroke();
  ictx.beginPath();ictx.arc(0,-ball.r*1.35,ball.r*1.05,.42*Math.PI,.58*Math.PI);ictx.stroke();
  ictx.beginPath();ictx.arc(0,ball.r*1.35,ball.r*1.05,1.42*Math.PI,1.58*Math.PI);ictx.stroke();
  ictx.restore();
  if(!hinted){ictx.font='500 12px Inter';ictx.textAlign='center';ictx.fillStyle='rgba(143,141,152,.85)';
    ictx.fillText('move your cursor — lead the ball across the springs to the hoop',ball.x,ball.y-36)}
})();

gsap.to('#strip1',{xPercent:-22,ease:'none',scrollTrigger:{trigger:'.strip',start:'top bottom',end:'bottom top',scrub:1}});
gsap.to('#trajfill',{height:'100%',ease:'none',scrollTrigger:{trigger:'#traj',start:'top 70%',end:'bottom 60%',scrub:.5}});
const htrack=document.getElementById('htrack');
if(matchMedia('(min-width:721px)').matches){
  const hdist=()=>htrack.scrollWidth-innerWidth+innerWidth*.06;
  gsap.to(htrack,{x:()=>-hdist(),ease:'none',
    scrollTrigger:{trigger:'#works',start:'top top',end:()=>'+='+hdist(),pin:true,scrub:1,invalidateOnRefresh:true,anticipatePin:1}});
}
document.querySelectorAll('.hcard').forEach(card=>{
  card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();
    card.style.setProperty('--mx',(e.clientX-r.left)+'px');card.style.setProperty('--my',(e.clientY-r.top)+'px')});
});
if(matchMedia('(min-width:721px)').matches){
  gsap.timeline({scrollTrigger:{trigger:'#ctastage',start:'center 55%',end:'+=65%',pin:true,scrub:.6,anticipatePin:1}})
    .fromTo('#bigcta',{scale:.5,y:40},{scale:1,y:0,ease:'none'},0)
    .fromTo('#ctao',{color:'rgba(61,219,180,0)'},{color:'#3ddbb4',ease:'none'},.15)
    .fromTo('#ctasub',{opacity:0},{opacity:1,ease:'none'},.4);
}else{
  gsap.from('#bigcta',{scale:.7,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:'#bigcta',start:'top 85%'}});
}

document.querySelectorAll('.reveal-text').forEach(p=>{
  p.innerHTML=p.textContent.split(' ').map(w=>`<span class="w">${w}</span>`).join(' ');
  gsap.to(p.querySelectorAll('.w'),{opacity:1,stagger:.02,ease:'none',
    scrollTrigger:{trigger:p,start:'top 82%',end:'top 40%',scrub:true}});
});

document.querySelectorAll('.fade-up').forEach(el=>{
  gsap.from(el,{y:50,opacity:0,duration:1,ease:'power3.out',
    scrollTrigger:{trigger:el,start:'top 88%'}});
});

document.querySelectorAll('nav a[href^="#"], .logo').forEach(a=>a.addEventListener('click',e=>{
  const h=a.getAttribute('href');
  if(h&&h.startsWith('#')){e.preventDefault();lenis.scrollTo(h,{duration:1.4})}
}));

document.getElementById('cform').addEventListener('submit',e=>{
  if(e.target.action.includes('YOUR_FORM_ID')){e.preventDefault();
    alert('Prototype mode: hook up your free Formspree ID and this sends straight to your email.')}
});
const gfx=document.createElement('canvas');
gfx.style.cssText='position:fixed;inset:0;z-index:0;pointer-events:none';
document.body.insertBefore(gfx,document.body.firstChild);
const gctx=gfx.getContext('2d');let GW=0,GH=0;
function gres(){const d=devicePixelRatio||1;GW=innerWidth;GH=innerHeight;gfx.width=GW*d;gfx.height=GH*d;gctx.setTransform(d,0,0,d,0,0)}
gres();addEventListener('resize',gres);
const TS=34,TH=29,lit={};
let gmx=-9999,gmy=-9999,sgx=-9999,sgy=-9999;
addEventListener('mousemove',e=>{gmx=e.clientX;gmy=e.clientY});
(function gridLoop(){
  requestAnimationFrame(gridLoop);
  const g=Math.max(0,Math.min((scrollY-innerHeight*.8)/240,1));
  gctx.clearRect(0,0,GW,GH);
  if(g<=0){for(const k in lit)delete lit[k];sgx=gmx;sgy=gmy;return}
  if(sgx<-999){sgx=gmx;sgy=gmy}
  sgx+=(gmx-sgx)*.18;sgy+=(gmy-sgy)*.18;
  const R=170,HS=TS/2;
  const j0=Math.floor((sgy-R)/TH),j1=Math.floor((sgy+R)/TH);
  const i0=Math.floor((sgx-R)/HS)-1,i1=Math.floor((sgx+R)/HS)+1;
  for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){
    const up=(i+j)%2===0,cx=i*HS+HS,cy=j*TH+(up?TH*.66:TH*.34);
    const d=Math.hypot(cx-sgx,cy-sgy);
    if(d<R){const v=1-d/R,k=i+'_'+j;lit[k]=Math.max(lit[k]||0,v)}
  }
  for(const k in lit){
    let v=lit[k];v-=.01+v*.035;
    if(v<=.01){delete lit[k];continue}
    lit[k]=v;
    const p=k.split('_'),i=+p[0],j=+p[1];
    const up=(i+j)%2===0,x0=i*HS,y0=j*TH;
    const vs=up?[[x0+HS,y0],[x0+TS,y0+TH],[x0,y0+TH]]:[[x0,y0],[x0+TS,y0],[x0+HS,y0+TH]];
    const ccx=(vs[0][0]+vs[1][0]+vs[2][0])/3,ccy=(vs[0][1]+vs[1][1]+vs[2][1])/3,SC=.52;
    gctx.beginPath();
    gctx.moveTo(ccx+(vs[0][0]-ccx)*SC,ccy+(vs[0][1]-ccy)*SC);
    gctx.lineTo(ccx+(vs[1][0]-ccx)*SC,ccy+(vs[1][1]-ccy)*SC);
    gctx.lineTo(ccx+(vs[2][0]-ccx)*SC,ccy+(vs[2][1]-ccy)*SC);
    gctx.closePath();
    const a=v*v*g;
    gctx.strokeStyle=`rgba(${TLC()},${(a*.32).toFixed(3)})`;
    gctx.lineWidth=1;
    gctx.stroke();
    gctx.fillStyle=`rgba(${TLC()},${(a*.06).toFixed(3)})`;
    gctx.fill();
  }
})();
addEventListener('load',()=>ScrollTrigger.refresh());

const themeBtn=document.getElementById('themeBtn');
function applyTheme(t){document.documentElement.dataset.theme=t;localStorage.setItem('jj-theme',t);themeBtn.textContent=t==='light'?'\u263E':'\u2600'}
applyTheme(document.documentElement.dataset.theme||'dark');
themeBtn.addEventListener('click',()=>applyTheme(document.documentElement.dataset.theme==='light'?'dark':'light'));

const gn=document.getElementById('gamenote');
function hideGn(){if(gn&&gn.style.opacity!=='0'){gn.style.opacity='0';setTimeout(()=>gn.remove(),600)}}
window.__hideGn=hideGn;
document.getElementById('gnclose').addEventListener('click',hideGn);
setTimeout(hideGn,16000);

function typeHero(){
  const el=document.getElementById('typeline'),caret=document.getElementById('caret');
  const parts=[{t:"Hi! I'm ",c:''},{t:'Jiya',c:'name'}];
  let pi=0,ci=0,node=null;
  (function step(){
    if(pi>=parts.length){caret.classList.add('done');return}
    const p=parts[pi];
    if(!node){node=document.createElement('span');if(p.c)node.className=p.c;el.appendChild(node)}
    node.textContent=p.t.slice(0,++ci);
    if(ci>=p.t.length){pi++;ci=0;node=null;setTimeout(step,pi<parts.length?260:0)}
    else setTimeout(step,72+Math.random()*55);
  })();
}
