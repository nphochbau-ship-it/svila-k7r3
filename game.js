'use strict';
const cv=document.getElementById('c'),g=cv.getContext('2d');
let W=360,H=740,SC=1,DPR=1;
function rs(){DPR=Math.min(devicePixelRatio||1,2.5);const w=innerWidth,h=innerHeight;SC=w/360;W=360;H=h/SC;cv.width=w*DPR;cv.height=h*DPR;}
addEventListener('resize',rs);rs();
const MUTE=/mute/.test(location.search);let muted=MUTE||localStorage.getItem('kk-mute')==='1';
let AC=null;function snd(f,d,t,v,f2){if(muted)return;try{AC=AC||new AudioContext();const o=AC.createOscillator(),gn=AC.createGain();o.type=t||'sine';o.frequency.setValueAtTime(f,AC.currentTime);if(f2)o.frequency.exponentialRampToValueAtTime(f2,AC.currentTime+d);gn.gain.setValueAtTime(v||.15,AC.currentTime);gn.gain.exponentialRampToValueAtTime(.001,AC.currentTime+d);o.connect(gn);gn.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}}
const R=(a,b)=>a+Math.random()*(b-a),PI=Math.PI;
// ---- levels
const LVL={1:{name:'Mravi',goal:10,spawn:1.6,kinds:['mrav']},2:{name:'Ose',goal:12,spawn:1.5,kinds:['mrav','osa','osa']},3:{name:'Pauci',goal:14,spawn:1.4,kinds:['osa','pauk','pauk','mrav']},4:{name:'Velika ptica',goal:0,spawn:2.2,kinds:['mrav','osa','pauk'],boss:1},5:{name:'Let na leptiru',dist:2400}};
const ST={mrav:{hp:1,sp:28,r:16},osa:{hp:1,sp:42,r:18},pauk:{hp:1,sp:30,r:20}};
const SK={jakub:{n:'Jakub',band:'#8e3fd6',band2:'#6d2bb0',sw:['#c58cff','#9b4dff','#6a1fd0'],cut:'#2a1050',top:['#fbf3e4','#d8ccb4'],arm:'#efe5d2',dots:'rgba(40,30,30,.45)',logo:'#d32f2f',p1:'#b5a27a',p2:'#a8956c',pk:'#8d7b55',sock:'#8a8a8a'},malik:{n:'Malik',band:'#ff8a1a',band2:'#d96400',sw:['#ffc070','#ff8a1a','#d05a00'],cut:'#1a1a1a',top:['#dfe6dc','#b3bdb0'],arm:'#cfd8cc',dots:'rgba(0,0,0,0)',logo:'rgba(0,0,0,0)',p1:'#a9c7e8',p2:'#97b8dd',pk:'#7e9fc4',sock:'#8f9c86'}};
let who=localStorage.getItem('kk-who')||'malik';
let hitStop=0;const G=()=>H-150;
let st='title',LV=1,S={},T=0,parts=[],shake=0,btns=[];
function heroBase(){return{x:180,y:H-150,tx:180,face:1,sw:0,hurt:0,vic:0,run:0}}
function start(n){LV=n;parts=[];if(n<=4){S={kind:'def',hero:heroBase(),en:[],kills:0,coc:5,cocShake:0,t:0,next:1.5,banner:2.2,boss:null}}
 else S={kind:'fly',by:H*.45,ty:H*.45,dist:0,hearts:5,ob:[],t:0,next:1,banner:2.2,stars:0,hurt:0,friend:null};
 st='play';localStorage.setItem('kk-lv',Math.max(n,+localStorage.getItem('kk-lv')||1));}
const cocX=()=>180,cocY=()=>H*.36;
function spawn(){const L=LVL[LV];const k=L.kinds[Math.random()*L.kinds.length|0];const s=ST[k];const e={k,hp:s.hp,r:s.r,t:R(0,9),hit:0};
 if(k==='mrav'){e.side=Math.random()<.5?-1:1;e.x=e.side<0?-20:380;e.y=H*.36-110;e.ph=0}// on branch walking to cocoon top
 else if(k==='osa'){e.x=Math.random()<.5?-20:380;e.y=R(H*.2,H*.55)}
 else {e.x=R(60,300);e.y=H*.36-140;e.ty=R(H*.3,H*.42);e.ph=0}
 S.en.push(e)}
function puff(x,y,c,n){for(let i=0;i<(n||14);i++){const a=R(0,2*PI),v=R(60,220);parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-60,l:R(.4,.9),c,r:R(3,7)})}}

const POWC={malik:['#ffd27a','#ff6a00'],jakub:['#f0d0ff','#a040ff']};
function pop(t,x,y,c){S.pops=S.pops||[];S.pops.push({t:0,s:t,x,y,c:c||'#ffd54a',r:R(-.3,.3)})}
const WORDS=['POW!','BAM!','ZAP!','BUM!','TRAS!'];
function hitAt(px,py){if(S.kind!=='def')return;const h=S.hero;if(h.atk&&h.atk.t<.22)return;let best=null,bd=1e9;
 const list=S.en.filter(e=>!e.dead);if(S.boss&&!S.boss.dead&&!(S.boss.kb>0))list.push(S.boss);
 for(const e of list){const d=Math.hypot(e.x-px,e.y-py);if(d<e.r+60&&d<bd){bd=d;best=e}}
 if(!best){h.atk={t:0,sx:h.x,sy:h.y,ex:Math.max(40,Math.min(320,px)),ey:G(),tgt:null,dir:px>h.x?1:-1};h.face=h.atk.dir;return}
 let dir=Math.sign(best.x-cocX())||(Math.random()<.5?-1:1);
 h.atk={t:0,sx:h.x,sy:h.y,ex:Math.max(30,Math.min(330,best.x-dir*44)),ey:Math.min(G(),best.y+70),tgt:best,dir,done:0};h.face=dir;snd(300,.1,'triangle',.08,600)}
function knock(e,dir,pw){const boss=e===S.boss;if(boss){e.hp-=pw?2:1;e.hit=.3;e.kb=1.4;e.vx=dir*120;e.vy=-380;e.spin=dir*10;if(e.hp<=0){e.dead=1;e.vy=-500;e.vx=dir*200}return}
 e.hp-=1;e.hit=.25;if(e.hp<=0||pw){e.dead=1;e.vx=dir*R(260,380);e.vy=-R(260,420);e.spin=dir*R(10,18);e.rot=0;if(e.k==='pauk')e.cut=1;S.kills++}else{e.stun=1.2;e.vx=dir*240;e.vy=-120}}
function impact(e,dir,pw){hitStop=pw?.12:.075;shake=pw?.5:.28;knock(e,dir,pw);pop(WORDS[Math.random()*WORDS.length|0],e.x,e.y-30,pw?POWC[who][0]:null);
 for(let i=0;i<10;i++){const a=R(0,2*PI),v=R(150,380);parts.push({x:e.x,y:e.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:R(.3,.6),c:i%2?'#fff':'#ffe066',r:R(2,5),star:i%3==0})}
 S.pow=Math.min(1,(S.pow||0)+.14);snd(pw?120:180,.18,'square',.12,60);snd(900,.08,'triangle',.1,1500)}
function power(){if(S.pow<1||st!=='play')return;S.pow=0;if(S.kind==='fly'){S.shots=3.5;snd(400,.4,'sawtooth',.1,1600);return}
 const h=S.hero;h.vy=-600;h.atk=null;S.wave={t:0,x:h.x,y:h.y-60};shake=.6;hitStop=.1;snd(80,.8,'sawtooth',.18,40);snd(1200,.5,'square',.06,300);
 for(const e of S.en)if(!e.dead)impact(e,Math.sign(e.x-cocX())||1,1);if(S.boss&&!S.boss.dead)impact(S.boss,1,1);pop(who==='malik'?'VATRA!':'MUNJA!',180,H*.5,POWC[who][0])}
function hurtCoc(){S.coc--;S.cocShake=.6;S.cocFl=.4;S.hero.hurt=.6;pop('AU!',cocX()+30,cocY()-40,'#ff8ab0');shake=.3;snd(150,.3,'sawtooth',.1,80);if(S.coc<=0){st='over';T=0}}
function update(dt){if(hitStop>0){hitStop-=dt;return}T+=dt;for(const p of parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=300*dt;p.l-=dt}parts=parts.filter(p=>p.l>0);shake=Math.max(0,shake-dt);
 if(st==='hatch'){S.t+=dt;if(S.t>5.5)start(5);return}
 if(st!=='play')return;S.t+=dt;S.banner-=dt;
 if(S.kind==='def'){const h=S.hero,L=LVL[LV];if(h.atk){const a=h.atk;a.t+=dt;const k=Math.min(1,a.t/.14),e2=1-(1-k)*(1-k);h.x=a.sx+(a.ex-a.sx)*e2;h.y=a.sy+(a.ey-a.sy)*e2-Math.sin(k*PI)*(a.ey<G()-20?30:14);h.run+=dt*14;
  if(a.t>=.17&&!a.done){a.done=1;const t=a.tgt;if(t&&!t.dead&&Math.hypot(t.x-(h.x+a.dir*40),t.y-(h.y-66))<120)impact(t,a.dir);else snd(500,.1,'triangle',.08,1200)}
  if(a.t>.42){h.atk=null;h.vy=0}}else{h.vy=(h.vy||0)+1600*dt;h.y+=h.vy*dt;if(h.y>=G()){h.y=G();h.vy=0}h.run=0}
 for(const p of S.pops||[])p.t+=dt;S.pops=(S.pops||[]).filter(p=>p.t<.8);if(S.wave){S.wave.t+=dt;if(S.wave.t>.9)S.wave=null}S.cocShake=Math.max(0,S.cocShake-dt);S.cocFl=Math.max(0,(S.cocFl||0)-dt);h.hurt=Math.max(0,h.hurt-dt);
  if(S.banner<0){S.next-=dt;if(S.next<=0&&(L.boss||S.kills+S.en.filter(e=>!e.dead).length<L.goal)){spawn();S.next=L.spawn*R(.7,1.2)}}
  if(L.boss&&!S.boss&&S.t>3)S.boss={k:'ptica',x:180,y:H*.12,r:46,hp:10,max:10,t:0,fly:0,hit:0,dive:4};
  const cx=cocX(),cy=cocY();
  for(const e of S.en.slice()){e.t+=dt;e.hit=Math.max(0,e.hit-dt);
   if(e.dead){e.vy+=900*dt;e.x+=e.vx*dt;e.y+=e.vy*dt;e.rot=(e.rot||0)+e.spin*dt;if(e.y>H+60||e.x<-80||e.x>440)S.en.splice(S.en.indexOf(e),1);continue}
   if(e.stun>0){e.stun-=dt;e.x+=e.vx*dt;e.y+=e.vy*dt;e.vx*=.9;e.vy*=.9;continue}
   const sp=ST[e.k].sp*(1+LV*.05)*(e.lunge?3.2:1);
   let tx=cx,ty=cy;if(e.k==='mrav'&&e.ph===0){ty=e.y;if(Math.abs(e.x-cx)<6)e.ph=1;}
   if(e.k==='pauk'&&e.ph===0){e.y+=sp*dt;if(e.y>=e.ty)e.ph=1;continue}
   const dx=tx-e.x,dy=ty-e.y,d=Math.hypot(dx,dy);
   if(d<85&&!e.lunge){if(e.wu==null)e.wu=.8;e.wu-=dt;if(e.wu<=0)e.lunge=1;continue}
   e.x+=dx/d*sp*dt;e.y+=dy/d*sp*dt+(e.k==='osa'?Math.sin(e.t*6)*30*dt:0);
   if(d<30){S.en.splice(S.en.indexOf(e),1);hurtCoc();puff(cx,cy,'#c8a36a',10)}}
  const b=S.boss;if(b&&b.dead&&b.y<H+100){b.vy+=900*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.t+=dt}
  if(b&&!b.dead){b.t+=dt;b.hit=Math.max(0,b.hit-dt);if(b.kb>0){b.kb-=dt;b.vy+=500*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.y<40){b.y=40;b.vy=0}b.x=Math.max(50,Math.min(310,b.x));b.dive=R(3,5);b.wu=null}else if(b.fly>0){b.fly-=dt;b.y+=(H*.1-b.y)*dt*3}else{b.dive-=dt;
    if(b.dive<0&&(b.wu==null?(b.wu=.9,0):(b.wu-=dt)>0)){}else if(b.dive<0){b.y+=(cy-b.y)*dt*.9;b.x+=(cx-b.x)*dt*.9;if(Math.hypot(b.x-cx,b.y-cy)<55){hurtCoc();b.fly=2.5;b.dive=R(4,6);b.wu=null}}else{b.x=180+Math.sin(b.t*.9)*110;b.y+=(H*.13-b.y)*dt*2}}}
  const won=L.boss?(b&&b.dead&&b.y>H):(S.kills>=L.goal);
  if(won&&st==='play'&&!S.en.some(e=>e.dead)){h.vic=1;S.en.forEach(e=>puff(e.x,e.y,'#ffe27a',8));S.en=[];st='win';T=0;snd(523,.2);setTimeout(()=>snd(784,.3),180);}
 }else{// fly
  S.by+=(S.ty-S.by)*Math.min(1,dt*6);S.pops=S.pops||[];for(const p of S.pops)p.t+=dt;S.pops=S.pops.filter(p=>p.t<.8);S.pow=Math.min(1,(S.pow||0)+dt*.06);
  S.bul=S.bul||[];if(S.shots>0){S.shots-=dt;S.sc=(S.sc||0)-dt;if(S.sc<=0){S.sc=.14;S.bul.push({x:150,y:S.by-10});snd(1000,.05,'square',.04,600)}}
  for(const u of S.bul){u.x+=600*dt;for(const o of S.ob)if(!o.got&&o.k!=='cvijet'&&Math.hypot(o.x-u.x,o.y-u.y)<o.r+12){o.got=1;o.boom=1;u.x=999;puff(o.x,o.y,POWC[who][0],14);pop(WORDS[Math.random()*5|0],o.x,o.y-20);shake=.15}}S.bul=S.bul.filter(u=>u.x<420);S.hurt=Math.max(0,S.hurt-dt);const sp=150;if(S.banner<0)S.dist+=sp*dt;
  S.next-=dt;if(S.banner<0&&S.next<=0&&S.dist<LVL[5].dist-300){const r=Math.random();S.ob.push(r<.45?{k:'cvijet',x:400,y:R(H*.15,H*.8),r:20}:r<.75?{k:'kap',x:400,y:R(H*.12,H*.85),r:16,ph:R(0,6)}:{k:'vilin',x:400,y:R(H*.15,H*.8),r:24,ph:R(0,6)});S.next=R(.6,1.1)}
  for(const o of S.ob){o.x-=(o.k==='vilin'?sp*1.5:sp)*dt;if(o.k==='vilin')o.y+=Math.sin(S.t*3+o.ph)*60*dt;
   if(!o.got&&Math.hypot(o.x-110,o.y-S.by)<o.r+26){o.got=1;if(o.k==='cvijet'){S.stars++;puff(o.x,o.y,'#ff8ad8',12);snd(880,.12,'sine',.12,1320)}else if(S.hurt<=0){S.hearts--;S.hurt=1.2;shake=.3;snd(150,.3,'sawtooth',.1,80);if(S.hearts<=0){st='over';T=0}}}}
  S.ob=S.ob.filter(o=>o.x>-40&&!(o.got&&(o.k==='cvijet'||o.boom)));
  if(S.dist>=LVL[5].dist&&!S.friend)S.friend={x:420,t:0};
  if(S.friend){S.friend.t+=dt;S.friend.x+=(250-S.friend.x)*dt*2;if(S.friend.t>3&&st==='play'){st='end';T=0;snd(523,.2);setTimeout(()=>snd(659,.2),150);setTimeout(()=>snd(784,.4),300)}}
 }}
// ---- drawing helpers
function ell(x,y,rx,ry,f){g.beginPath();g.ellipse(x,y,rx,ry,0,0,2*PI);g.fillStyle=f;g.fill()}
function rg(x,y,r,c1,c2){const q=g.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r);q.addColorStop(0,c1);q.addColorStop(1,c2);return q}
function shadow(x,y,w){ell(x,y,w,w*.28,'rgba(0,0,0,.25)')}
function rr(x,y,w,h,r,f){g.beginPath();g.roundRect(x,y,w,h,r);g.fillStyle=f;g.fill()}
function txt(s,x,y,sz,c,al){g.font=`900 ${sz}px system-ui,Arial Rounded MT Bold,sans-serif`;g.textAlign=al||'center';g.lineWidth=sz/5;g.strokeStyle='rgba(30,20,60,.85)';g.lineJoin='round';g.strokeText(s,x,y);g.fillStyle=c||'#fff';g.fillText(s,x,y)}
function bg(scroll){const q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,'#7fd3ff');q.addColorStop(.6,'#c9f0ff');q.addColorStop(1,'#e8ffd8');g.fillStyle=q;g.fillRect(0,0,W,H);
 ell(300,90,40,40,rg(300,90,60,'#fff9c4','rgba(255,230,120,0)'));ell(300,90,26,26,'#fff3a0');
 for(let i=0;i<4;i++){const x=((i*130-scroll*.15)%520+520)%520-80,y=60+i*37;ell(x,y,40,16,'rgba(255,255,255,.85)');ell(x+25,y-8,28,18,'rgba(255,255,255,.9)')}
 const hills=[[.62,'#8fd18a',.3,60],[.7,'#5fb45f',.5,45],[.8,'#3f9a4a',.8,35]];
 for(const [yy,c,p,a] of hills){g.beginPath();g.moveTo(0,H);for(let x=0;x<=W;x+=10)g.lineTo(x,H*yy-Math.sin((x+scroll*p)/a*.6)*18-Math.sin((x+scroll*p)/(a*2.3))*14);g.lineTo(W,H);g.fillStyle=c;g.fill()}
 const gq=g.createLinearGradient(0,H*.85,0,H);gq.addColorStop(0,'#4caf50');gq.addColorStop(1,'#2e7d32');g.fillStyle=gq;g.fillRect(0,H*.86,W,H);
 for(let i=0;i<30;i++){const x=((i*29-scroll)%W+W)%W;g.fillStyle='#66cc66';g.beginPath();g.moveTo(x,H*.86);g.lineTo(x+4,H*.86-10-(i%3)*4);g.lineTo(x+8,H*.86);g.fill()}}
function branch(){const y=cocY()-110;g.save();g.lineCap='round';const q=g.createLinearGradient(0,y-12,0,y+12);q.addColorStop(0,'#a9744a');q.addColorStop(1,'#5a3820');g.strokeStyle=q;g.lineWidth=22;g.beginPath();g.moveTo(-10,y+6);g.quadraticCurveTo(180,y-14,370,y+4);g.stroke();
 for(const [x,a] of [[60,-.6],[290,.5],[150,.9]]){g.save();g.translate(x,y);g.rotate(a+Math.sin(T*1.5+x)*.06);ell(0,-22,12,24,rg(0,-22,26,'#9be37a','#2f8a3a'));g.restore()}g.restore()}
function cocoon(x,y,shk,crack){g.save();g.translate(x+Math.sin(T*30)*shk*6,y);g.rotate(Math.sin(T*1.3)*.05);g.strokeStyle='#e8e0c8';g.lineWidth=3;g.beginPath();g.moveTo(0,-110);g.lineTo(0,-50);g.stroke();
 shadow(0,195-(y-cocY()),0);g.beginPath();g.ellipse(0,0,34,56,0,0,2*PI);g.fillStyle=rg(0,0,60,'#fff4d0','#b88a4a');g.fill();
 g.strokeStyle='rgba(120,80,30,.35)';g.lineWidth=2;for(let i=-3;i<=3;i++){g.beginPath();g.ellipse(0,i*13,32-Math.abs(i)*5,5,0,0,PI);g.stroke()}
 ell(-12,-20,7,14,'rgba(255,255,255,.5)');
 if(crack){g.strokeStyle='#5a3a10';g.lineWidth=3;g.beginPath();g.moveTo(-20,-10);g.lineTo(-5,0);g.lineTo(-12,12);g.lineTo(4,22);g.stroke()}g.restore()}
function hero(x,y,o){o=o||{};const P=SK[o.who||who];const h=o.h||{face:1,sw:0,run:0,hurt:0,vic:0};g.save();g.translate(x,y);if(!o.ride)shadow(0,4,30);
 const a=h.atk,at=a?a.t:9;const bob=Math.sin(T*4)*2,run=Math.sin(h.run)*6,sq=a?(at<.14?.92:at<.24?1.1:1):1+Math.sin(T*4)*.02;
 g.scale(h.face*(o.s||1),(o.s||1));g.scale(1/sq,sq);if(h.hurt>0&&((T*20|0)%2))g.globalAlpha=.5;if(a)g.rotate(at<.14?-.18:at<.26?.28:.28*(1-(at-.26)/.16));else if(h.hurt>0)g.rotate(-.15);const vy=h.vic?-Math.abs(Math.sin(T*6))*20:0;g.translate(0,vy);
 // legs
 if(!o.ride){rr(-14,-38+run*.3,12,36,5,P.p1);rr(2,-38-run*.3,12,36,5,P.p2);rr(-12,-24,6,8,2,P.pk);rr(4,-24,6,8,2,P.pk);ell(-8,-2,9,5,P.sock);ell(8,-2,9,5,P.sock);ell(-8,0,7,3,'#ddd');ell(8,0,7,3,'#ddd')}
 else{rr(-16,-42,30,14,6,P.p1);ell(14,-30,8,5,P.sock)}
 // body
 g.translate(0,bob);rr(-20,-78,40,44,12,rg(-5,-65,40,P.top[0],P.top[1]));
 g.fillStyle=P.dots;for(const [a,b] of [[-12,-66],[6,-58],[-6,-46],[10,-72],[-14,-50]]){g.beginPath();g.arc(a,b,3.5,0,2*PI);g.fill()}rr(-9,-70,18,7,2,P.logo);
 // sword arm
 const ang=a?(at<.14?-2.9:at<.22?-2.9+(at-.14)/.08*4.4:1.5-(at-.22)/.2*2.6):(h.vic?-2.6:-1.1+Math.sin(T*2)*.08);
 g.save();g.translate(10,-66);g.rotate(ang);rr(-5,-4,24,10,5,P.arm);ell(22,1,7,7,'#f1c9a5');g.translate(24,0);rr(-4,-4,14,8,3,'#222');ell(10,0,4,9,'#333');
 const sq2=g.createLinearGradient(12,-6,12,6);sq2.addColorStop(0,P.sw[0]);sq2.addColorStop(.5,P.sw[1]);sq2.addColorStop(1,P.sw[2]);g.beginPath();g.moveTo(12,-7);g.lineTo(78,-6);g.lineTo(86,0);g.lineTo(78,6);g.lineTo(12,7);g.closePath();g.fillStyle=sq2;g.fill();
 g.fillStyle=P.cut;for(let i=0;i<4;i++){g.beginPath();g.moveTo(22+i*14,-3);g.lineTo(30+i*14,-3);g.lineTo(26+i*14,3);g.fill()}g.restore();
 if(a&&at>.14&&at<.36){g.save();g.translate(10,-66);const al=at<.22?1:1-(at-.22)/.14;const C=SK[o.who||who].sw;for(let i=0;i<3;i++){g.globalAlpha=al*(.8-i*.25);g.strokeStyle=i?C[0]:'#fff';g.lineWidth=22-i*6;g.lineCap='round';g.beginPath();g.arc(0,0,92-i*10,-2.9,Math.min(ang,1.5));g.stroke()}g.restore()}
 // other arm
 rr(-26,-72,10,24,5,P.arm);ell(-21,-46,6,6,'#f1c9a5');
 // head
 const hy=-100;ell(0,hy,22,22,rg(0,hy,26,'#ffe0c4','#e0a982'));g.beginPath();g.arc(0,hy-4,22,PI*1.05,PI*1.95);g.fillStyle='#6b4a2e';g.fill();
 // mask
 g.beginPath();g.moveTo(-20,hy-2);g.quadraticCurveTo(0,hy+4,20,hy-2);g.lineTo(16,hy+14);g.quadraticCurveTo(0,hy+26,-16,hy+14);g.closePath();g.fillStyle=rg(0,hy+8,26,'#444','#0d0d0d');g.fill();
 g.fillStyle='#e8a0a0';for(const [a,b] of [[-8,hy+8],[-2,hy+12],[4,hy+12],[10,hy+8],[-4,hy+17],[6,hy+17],[1,hy+5]]){g.beginPath();g.arc(a,b,1.8,0,2*PI);g.fill()}
 ell(-7,hy-6,3,3.6,'#2a1a10');ell(7,hy-6,3,3.6,'#2a1a10');ell(-6,hy-7,1,1,'#fff');ell(8,hy-7,1,1,'#fff');
 // headband
 rr(-23,hy-20,46,10,4,P.band);g.fillStyle=P.band2;g.beginPath();g.moveTo(-22,hy-16);g.quadraticCurveTo(-36,hy-14+Math.sin(T*6)*4,-42,hy-6+Math.sin(T*6)*5);g.lineTo(-38,hy-2);g.quadraticCurveTo(-30,hy-10,-22,hy-11);g.fill();
 g.save();g.translate(4,hy-15);g.rotate(T*.5);g.fillStyle='#fff';for(let i=0;i<4;i++){g.rotate(PI/2);g.beginPath();g.moveTo(0,0);g.lineTo(7,-2);g.lineTo(2,2);g.fill()}ell(0,0,1.6,1.6,'#555');g.restore();
 g.restore()}
function enemy(e){if(!e.dead&&(e.k!=='mrav'||e.ph))shadow(e.x,G()+4,Math.max(6,16-(G()-e.y)/30));g.save();const wj=e.wu>0?Math.sin(T*60)*2:0;g.translate(e.x+wj,e.y);const ps=.85+.35*e.y/H;g.scale(ps,ps);if(e.dead)g.rotate(e.rot);if(e.hit>0)g.scale(1.25,.75);const fl=e.hit>0;if(e.k==='mrav'){const dir=e.ph===0?(e.side<0?1:-1):1;g.scale(dir,1);const l=Math.sin(e.t*16)*4;g.strokeStyle='#3a1a0a';g.lineWidth=2.5;for(const k of[-8,0,8]){g.beginPath();g.moveTo(k,0);g.lineTo(k+l,10);g.stroke()}
  ell(-12,0,10,8,rg(-12,0,12,'#e0623a','#7a1f0a'));ell(0,0,7,6,rg(0,0,8,'#e0623a','#7a1f0a'));ell(11,-2,8,7,rg(11,-2,10,'#e0623a','#7a1f0a'));ell(13,-4,2.5,2.5,'#fff');ell(14,-4,1.3,1.3,'#000');g.beginPath();g.moveTo(14,-8);g.quadraticCurveTo(20,-18,24,-14);g.stroke()}
 else if(e.k==='osa'){const w=Math.sin(e.t*40)*.5;g.fillStyle='rgba(220,240,255,.7)';g.save();g.rotate(-.5+w);ell(0,-14,8,14,'rgba(220,240,255,.75)');g.restore();
  ell(-6,0,14,10,rg(-6,0,16,'#ffe24a','#c78a00'));g.fillStyle='#222';rr(-12,-9,4,18,2,'#222');rr(-4,-9,4,18,2,'#222');ell(10,-1,8,8,rg(10,-1,9,'#ffe24a','#c78a00'));ell(13,-3,3,3,'#fff');ell(14,-3,1.6,1.6,'#000');g.beginPath();g.moveTo(-20,0);g.lineTo(-27,2);g.lineTo(-20,3);g.fill()}
 else{if(!e.cut){g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=1;g.beginPath();g.moveTo(0,0);g.lineTo(0,-(e.y-(cocY()-110))/ps);g.stroke();}g.strokeStyle='#2b1a3a';g.lineWidth=3;const l=Math.sin(e.t*8)*3;
  for(let i=0;i<4;i++){for(const s of[-1,1]){g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(s*16,-10+i*6,s*22,4+i*5+l*s);g.stroke()}}
  ell(0,0,15,13,rg(0,0,16,'#9a6ad0','#3a1a5a'));ell(-5,-3,4,4.5,'#fff');ell(5,-3,4,4.5,'#fff');ell(-4,-2,2,2,'#000');ell(6,-2,2,2,'#000');if(e.hp<2)ell(0,6,4,2,'#ffb0d0')}
 if(fl){g.globalCompositeOperation='lighter';ell(0,0,e.r*1.2,e.r*1.2,'rgba(255,255,255,.8)');g.globalCompositeOperation='source-over'}
 if(e.wu!=null&&!e.dead){g.strokeStyle='#c00';g.lineWidth=3;g.beginPath();g.moveTo(-10,-14);g.lineTo(-2,-9);g.moveTo(10,-14);g.lineTo(2,-9);g.stroke();txt('!',0,-22,18,'#ff4040')}
 g.restore();if(e.stun>0||e.dead)for(let i=0;i<3;i++){const a=T*6+i*2.1;txt('★',e.x+Math.cos(a)*16,e.y-24+Math.sin(a)*5,12,'#ffe066')}}
function bird(b){if(!b.dead)shadow(b.x,G()+4,30);g.save();g.translate(b.x+(b.wu>0?Math.sin(T*60)*3:0),b.y);if(b.kb>0||b.dead)g.rotate(b.t*(b.spin||8));if(b.hit>0)g.scale(1.2,.8);const w=Math.sin(b.t*8)*.6;g.save();g.rotate(-.4+w);ell(-30,-10,34,14,rg(-30,-10,34,'#7ec8ff','#2a6bb0'));g.restore();
 ell(0,0,38,30,rg(0,0,40,'#8fd6ff','#2a6bb0'));ell(8,10,22,16,'#ffe8c0');g.save();g.rotate(.4-w);ell(30,-10,34,14,rg(30,-10,34,'#7ec8ff','#2a6bb0'));g.restore();
 ell(-10,-8,8,9,'#fff');ell(10,-8,8,9,'#fff');ell(-9,-6,4,4,'#000');ell(11,-6,4,4,'#000');g.fillStyle='#ffa000';g.beginPath();g.moveTo(-7,4);g.lineTo(7,4);g.lineTo(0,16);g.fill();
 if(b.wu>0){g.strokeStyle='#123';g.lineWidth=4;g.beginPath();g.moveTo(-18,-20);g.lineTo(-4,-14);g.moveTo(18,-20);g.lineTo(4,-14);g.stroke()}if(b.hit>0){ell(0,0,44,36,'rgba(255,255,255,.7)')}g.restore();if(b.kb>0)for(let i=0;i<3;i++){const a=T*6+i*2.1;txt('★',b.x+Math.cos(a)*30,b.y-40+Math.sin(a)*8,16,'#ffe066')}if(b.dead)return;
 rr(80,8+46,200,14,7,'rgba(0,0,0,.35)');rr(82,10+46,196*b.hp/b.max,10,5,'#ff5a7a');txt('Velika ptica',180,48,16,'#fff')}
function butterfly(x,y,s,open){g.save();g.translate(x,y);g.scale(s,s);const f=open==null?Math.abs(Math.sin(T*9)):open;
 for(const side of[-1,1]){g.save();g.scale(side*(.25+.75*f),1);const q=g.createRadialGradient(30,-20,4,30,-20,50);q.addColorStop(0,'#fff0a0');q.addColorStop(.4,'#ff9a3c');q.addColorStop(1,'#c2185b');
  g.beginPath();g.moveTo(0,0);g.bezierCurveTo(20,-60,80,-60,70,-10);g.bezierCurveTo(65,5,20,5,0,0);g.fillStyle=q;g.fill();g.beginPath();g.moveTo(0,4);g.bezierCurveTo(40,10,60,50,30,50);g.bezierCurveTo(10,50,4,20,0,4);g.fillStyle='#e05a9a';g.fill();
  ell(45,-25,8,8,'rgba(255,255,255,.7)');ell(30,30,5,5,'rgba(255,255,255,.6)');g.restore()}
 rr(-5,-24,10,56,5,'#3a2a50');ell(0,-28,8,8,'#3a2a50');g.strokeStyle='#3a2a50';g.lineWidth=2;g.beginPath();g.moveTo(-3,-34);g.quadraticCurveTo(-10,-50,-14,-48);g.moveTo(3,-34);g.quadraticCurveTo(10,-50,14,-48);g.stroke();ell(-3,-29,2,2,'#fff');ell(3,-29,2,2,'#fff');g.restore()}
function hearts(n,max){for(let i=0;i<max;i++){const x=20+i*30,y=26;g.save();g.translate(x,y);g.scale(1+(i<n?Math.sin(T*4+i)*.05:0),1);g.fillStyle=i<n?rg(0,0,14,'#ff9ab0','#e0204a'):'rgba(0,0,0,.25)';g.beginPath();g.moveTo(0,6);g.bezierCurveTo(-14,-4,-8,-14,0,-6);g.bezierCurveTo(8,-14,14,-4,0,6);g.fill();g.restore()}}
function button(lbl,x,y,w,h,c,fn){const p=1+Math.sin(T*4)*.03;g.save();g.translate(x,y);g.scale(p,p);rr(-w/2,-h/2+6,w,h,h/2,'rgba(0,0,0,.25)');const q=g.createLinearGradient(0,-h/2,0,h/2);q.addColorStop(0,c[0]);q.addColorStop(1,c[1]);rr(-w/2,-h/2,w,h,h/2,q);rr(-w/2+10,-h/2+5,w-20,h*.3,h*.15,'rgba(255,255,255,.35)');txt(lbl,0,10,28,'#fff');g.restore();btns.push({x:x-w/2,y:y-h/2,w,h,fn})}
const GR=['#7be86a','#2ea043'],OR=['#ffc24a','#f07a00'],PU=['#c58cff','#7a2fe0'];
function draw(){btns=[];g.setTransform(DPR*SC,0,0,DPR*SC,0,0);if(shake>0)g.translate(R(-5,5)*shake*3,R(-5,5)*shake*3);
 if(st==='title'){bg(T*20);branch();cocoon(cocX(),cocY(),0);butterfly(300,H*.5,.5);txt('Izaberi junaka:',180,H*.6,24,'#fff');for(const [k,x] of [['malik',95],['jakub',265]]){const sel=who===k;if(sel)ell(x,H-150,62,16,'rgba(255,230,80,.7)');hero(x,H-150,{who:k,s:sel?1.05:.9,h:{face:k==='malik'?1:-1,sw:0,run:0,hurt:0,vic:sel?1:0}});txt(SK[k].n,x,H-115,24,sel?'#ffd54a':'#fff');btns.push({x:x-70,y:H-310,w:140,h:200,fn:()=>{who=k;localStorage.setItem('kk-who',k)}})}txt('ČUVAR',180,H*.11,52,'#ffd54a');txt('KOKONA',180,H*.11+52,52,'#ff8ad8');
  button('IGRAJ',180,H-60,220,70,GR,()=>start(1));const mx=+localStorage.getItem('kk-lv')||1;if(mx>1)for(let i=1;i<=Math.min(5,mx);i++)button(''+i,180+(i-3)*58,H*.11+105,48,48,PU,()=>start(i));}
 else if(S.kind==='def'||st==='hatch'){bg(0);branch();
  if(st==='hatch'){const t=S.t;if(t<2.2)cocoon(cocX(),cocY(),t*.5,t>1);else{const k=Math.min(1,(t-2.2)/1.5);if(t<2.6)puff(cocX(),cocY(),'#fff6c0',3);butterfly(cocX(),cocY()-k*40,.3+k*.9,k<.5?0:null);
    for(let i=0;i<6;i++){g.save();g.globalAlpha=.6;ell(cocX()+Math.cos(T*2+i)*90*k,cocY()+Math.sin(T*2+i)*90*k,6,6,'#fff59d');g.restore()}}
   hero(120,H-150,{h:{face:1,sw:0,run:0,hurt:0,vic:t>2.2?1:0}});txt(t<2.2?'Kokon puca...':'LEPTIR!',180,H*.62,40,'#ffd54a');}
  else{cocoon(cocX(),cocY(),S.cocShake);if(S.cocFl>0){g.globalAlpha=S.cocFl*1.5;ell(cocX(),cocY(),40,62,'rgba(255,80,80,.6)');g.globalAlpha=1}if(S.boss&&S.boss.y<H+80)bird(S.boss);for(const e of S.en)enemy(e);hero(S.hero.x,S.hero.y,{h:S.hero});
   hearts(S.coc,5);const L=LVL[LV];txt('Nivo '+LV,345,34,20,'#fff','right');if(!L.boss){rr(110,H-40,140,16,8,'rgba(0,0,0,.3)');rr(112,H-38,136*Math.min(1,S.kills/L.goal),12,6,'#ffd54a')}
   if(S.banner>0){g.globalAlpha=Math.min(1,S.banner);txt('Nivo '+LV+': '+L.name,180,H*.55,34,'#fff');txt('Udari napadače mačem! ⚔',180,H*.55+40,22,'#ffe');g.globalAlpha=1}}}
 else{const sc=S.dist;bg(sc);for(const o of S.ob){if(o.k==='cvijet'){g.save();g.translate(o.x,o.y);g.rotate(T);for(let i=0;i<5;i++){g.rotate(2*PI/5);ell(0,-11,7,11,rg(0,-11,12,'#ffd0f0','#ff4fa8'))}ell(0,0,7,7,'#ffd54a');g.restore()}
   else if(o.k==='kap'){g.save();g.translate(o.x,o.y);g.beginPath();g.moveTo(0,-20);g.quadraticCurveTo(16,6,0,14);g.quadraticCurveTo(-16,6,0,-20);g.fillStyle=rg(0,0,20,'#e0f7ff','#3a8ee0');g.fill();g.restore()}
   else{g.save();g.translate(o.x,o.y);rr(-26,-4,52,8,4,'#2ab0a0');ell(-28,0,8,8,'#1a8a80');ell(-31,-2,3,3,'#fff');g.globalAlpha=.6;const w=Math.sin(T*50)*4;ell(-4,-10-w,16,6,'#cfffff');ell(8,-10+w,16,6,'#cfffff');g.restore()}}
  g.save();if(S.hurt>0&&((T*20|0)%2))g.globalAlpha=.4;const tilt=(S.ty-S.by)*.004;g.translate(110,S.by);g.rotate(tilt);butterfly(0,0,.85);hero(0,22,{ride:1,s:.62});g.restore();
  if(S.friend){butterfly(S.friend.x,H*.4+Math.sin(T*2)*10,1.1);txt('Hvala, junače!',S.friend.x-40,H*.4-70,24,'#fff')}
  hearts(S.hearts,5);txt('🌸 '+S.stars,345,34,22,'#fff','right');rr(80,H-36,200,12,6,'rgba(0,0,0,.3)');rr(82,H-34,196*Math.min(1,S.dist/LVL[5].dist),8,4,'#ff8ad8');
  if(S.banner>0){g.globalAlpha=Math.min(1,S.banner);txt('Nivo 5: Let na leptiru',180,H*.55,30,'#fff');txt('Vuci prst gore-dolje',180,H*.55+36,22,'#ffe');g.globalAlpha=1}}
 if(S.wave){const w=S.wave,k=w.t/.9,C=POWC[who];g.save();g.globalAlpha=1-k;g.lineWidth=30*(1-k)+4;g.strokeStyle=C[1];g.beginPath();g.arc(w.x,w.y,k*420,0,2*PI);g.stroke();g.strokeStyle=C[0];g.lineWidth=8;g.beginPath();g.arc(w.x,w.y,k*380,0,2*PI);g.stroke();
  if(who==='jakub'){for(let i=0;i<10;i++){const a=i/10*2*PI+w.t*3,d=k*320;g.save();g.translate(w.x+Math.cos(a)*d,w.y+Math.sin(a)*d);g.rotate(T*20);g.fillStyle='#fff';for(let j=0;j<4;j++){g.rotate(PI/2);g.beginPath();g.moveTo(0,0);g.lineTo(14,-4);g.lineTo(4,4);g.fill()}g.restore()}
   g.strokeStyle='#f4e0ff';g.lineWidth=4;for(let i=0;i<6;i++){g.beginPath();let x=w.x,y=w.y;g.moveTo(x,y);const a=i/6*2*PI+1;for(let j=0;j<6;j++){x+=Math.cos(a)*40*k*1.6+R(-18,18);y+=Math.sin(a)*40*k*1.6+R(-18,18);g.lineTo(x,y)}g.stroke()}}
  else{for(let i=0;i<24;i++){const a=i/24*2*PI,d=k*360+Math.sin(i*7)*20;ell(w.x+Math.cos(a)*d,w.y+Math.sin(a)*d,18*(1-k)+4,18*(1-k)+4,i%2?'#ffde59':'#ff5a00')}}
  g.globalAlpha=(1-k)*.35;g.fillStyle=C[0];g.fillRect(0,0,W,H);g.restore()}
 if(S.bul)for(const u of S.bul){const C=POWC[who];ell(u.x,u.y,16,7,C[1]);ell(u.x+2,u.y,9,4,C[0])}
 for(const p of parts){g.globalAlpha=Math.max(0,p.l);if(p.star)txt('★',p.x,p.y,p.r*4,p.c);else ell(p.x,p.y,p.r,p.r,p.c)}g.globalAlpha=1;
 if(S.pops)for(const p of S.pops){const k=p.t/.8,sc=k<.15?k/.15*1.4:1.4-(k-.15)*.5;g.save();g.translate(p.x,p.y-k*30);g.rotate(p.r);g.scale(sc,sc);g.globalAlpha=1-Math.max(0,k-.6)/.4;txt(p.s,0,0,30,p.c);g.restore()}g.globalAlpha=1;
 if(st==='play'){const full=(S.pow||0)>=1,C=POWC[who],bx=56,by=H-62;g.save();if(full){g.globalAlpha=.5+Math.sin(T*8)*.3;ell(bx,by,50+Math.sin(T*8)*5,50+Math.sin(T*8)*5,C[0]);g.globalAlpha=1}
  ell(bx,by+4,36,36,'rgba(0,0,0,.3)');ell(bx,by,36,36,full?rg(bx,by,40,C[0],C[1]):'rgba(60,60,80,.6)');g.beginPath();g.moveTo(bx,by);g.arc(bx,by,36,-PI/2,-PI/2+2*PI*(S.pow||0));g.closePath();g.fillStyle=full?'rgba(255,255,255,0)':C[1];g.globalAlpha=full?1:.8;g.fill();g.globalAlpha=1;txt(who==='malik'?'🔥':'⚡',bx,by+10,30);if(full)txt('MOĆ!',bx,by-44,18,C[0]);g.restore();
  btns.push({x:bx-44,y:by-44,w:88,h:88,fn:power})}
 if(st==='win'){rr(30,H*.3,300,200,30,'rgba(40,20,80,.6)');txt('BRAVO!',180,H*.3+70,54,'#ffd54a');txt(LV===4?'Kokon je siguran!':'Kokon je siguran',180,H*.3+110,22,'#fff');button(LV===4?'GLEDAJ!':'DALJE',180,H*.3+160,180,62,GR,()=>{if(LV===4){st='hatch';S.t=0}else start(LV+1)})}
 if(st==='over'){rr(30,H*.3,300,200,30,'rgba(40,20,80,.6)');txt('Ups!',180,H*.3+70,54,'#ff8ab0');txt('Probaj opet, junače',180,H*.3+110,22,'#fff');button('OPET',180,H*.3+160,180,62,OR,()=>start(LV))}
 if(st==='end'){rr(30,H*.25,300,260,30,'rgba(40,20,80,.6)');txt('POBJEDA!',180,H*.25+70,50,'#ffd54a');txt('Skupio si 🌸 '+S.stars,180,H*.25+115,24,'#fff');button('IZNOVA',180,H*.25+200,190,62,PU,()=>{st='title'})}
 // mute
 g.setTransform(DPR*SC,0,0,DPR*SC,0,0);if(st!=='title'||true){rr(W-46,H-50,38,38,19,'rgba(0,0,0,.25)');txt(muted?'🔇':'🔊',W-27,H-24,20);btns.push({x:W-50,y:H-54,w:46,h:46,fn:()=>{muted=!muted;localStorage.setItem('kk-mute',muted?'1':'0')}})}}
function pt(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/SC,(e.clientY-r.top)/SC]}
let drag=false;cv.addEventListener('pointerdown',e=>{e.preventDefault();const [x,y]=pt(e);for(const b of btns.slice().reverse())if(x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h){b.fn();snd(600,.08);return}
 if(st==='play'){if(S.kind==='def')hitAt(x,y);else{drag=true;S.ty=Math.max(H*.1,Math.min(H*.88,y))}}});
cv.addEventListener('pointermove',e=>{if(drag&&st==='play'&&S.kind==='fly'){const y=pt(e)[1];S.ty=Math.max(H*.1,Math.min(H*.88,y))}});
addEventListener('pointerup',()=>drag=false);
let last=performance.now();function loop(t){const dt=Math.min(.05,(t-last)/1000);last=t;update(dt);draw();requestAnimationFrame(loop)}requestAnimationFrame(loop);
window.__kk={power,get hitStop(){return hitStop},get st(){return st},set st(v){st=v},get LV(){return LV},get S(){return S},start,hitAt,spawn};
