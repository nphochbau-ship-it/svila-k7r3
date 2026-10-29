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
const META={"mrav": [165, 160], "osa": [185, 160], "pauk": [207, 160], "vilin": [211, 160], "kap": [116, 160], "cvijet": [166, 160], "ptica": [430, 320], "leptir": [416, 360], "kokon0": [86, 220], "kokon1": [88, 220], "kokon2": [110, 220], "grana": [765, 160], "trava": [663, 200], "malik0": [144, 295, 0], "malik1": [203, 250, 10], "malik2": [288, 243, 9], "malik3": [164, 287, 43], "jakub0": [166, 254, 0], "jakub1": [179, 230, 4], "jakub2": [233, 217, 1], "jakub3": [151, 301, 29]};const IMN=Object.keys(META).filter(k=>k!=='leptir').concat(['leptirL','leptirR','bg_meadow','bg_fly']);const IM={};let loaded=0;
for(const n of IMN){const i=new Image();i.onload=i.onerror=()=>{loaded++;if(loaded===IMN.length&&st==='load')st='title'};i.src='art/'+n+'.webp?v=3';IM[n]=i}
let hitStop=0;const G=()=>H-150;
let st='load',LV=1,S={},T=0,parts=[],shake=0,btns=[];
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

function img(n){return IM[n]}
function dimg(n,x,y,w,h){const i=IM[n];if(i&&i.complete)g.drawImage(i,x,y,w,h)}
function bg(scroll){const fly=S&&S.kind==='fly'&&st!=='title';
 if(!fly){const i=IM.bg_meadow,s2=Math.max(W/720,H/1280)*1.04,w=720*s2,h=1280*s2;g.drawImage(i,(W-w)/2+Math.sin(T*.2)*3,H-h+8,w,h)}
 else{const i=IM.bg_fly,s2=H/720,w=1280*s2,off=(scroll*.25)%(2*w);for(let k=-1;k<3;k++){const x=k*w-off;if(x>W||x+w<0)continue;g.save();if(k&1){g.translate(x+w,0);g.scale(-1,1);g.drawImage(i,0,0,w,H)}else g.drawImage(i,x,0,w,H);g.restore()}}
 const tw=663*.62,th=200*.62,off2=((fly?scroll*1.2:0)%tw+tw)%tw;g.save();g.globalAlpha=1;for(let x=-off2-20;x<W+tw;x+=tw-4)g.drawImage(IM.trava,x,H-th+18,tw,th);g.restore()}
function branch(){const y=cocY()-110;g.drawImage(IM.grana,-40,y-50,440,92)}
function cocoon(x,y,shk,crack,open){g.save();g.translate(x+Math.sin(T*30)*shk*6,y-112);g.rotate(Math.sin(T*1.3)*.05);const n=open?'kokon2':crack?'kokon1':'kokon0',m=META[n],h=190,w=m[0]/m[1]*h;
 g.drawImage(IM[n],-w/2,0,w,h);g.restore()}
const HS=.5;
function hero(x,y,o){o=o||{};const P=o.who||who,h=o.h||{face:1,run:0,hurt:0,vic:0};g.save();g.translate(x,y);
 const a=h.atk,at=a?a.t:9,air=h.y!=null&&h.y<G()-6;let f=0;
 if(o.ride)f=0;else if(a)f=at<.14?0:at<.34?2:0;else if(h.vic||air)f=3;else if(h.run>0)f=1;
 if(!o.ride)shadow(0,4,30*(air?Math.max(.5,1-(G()-h.y)/300):1));
 if(air&&!o.ride)g.translate(0,0);
 const sc=(o.s||1)*HS,m=META[P+f];g.scale((h.face||1)*sc,sc);
 if(h.hurt>0&&((T*20|0)%2))g.globalAlpha=.5;
 let rot=0,sx=1,sy=1;if(a){rot=at<.14?-.16:at<.26?.18:.18*(1-(at-.26)/.16);sx=at<.14?1.06:at<.24?.94:1;sy=2-sx}else if(h.hurt>0)rot=-.15;else if(!h.vic&&!air){sy=1+Math.sin(T*4)*.02;sx=2-sy}
 if(h.run>0&&!a)g.translate(0,-Math.abs(Math.sin(h.run))*14);
 if(h.vic&&!air)g.translate(0,-Math.abs(Math.sin(T*6))*40);
 g.rotate(rot);g.scale(sx,sy);g.drawImage(IM[P+f],-m[0]/2,-m[1]-m[2],m[0],m[1]);g.restore();
 if(a&&at>.14&&at<.36){g.save();g.translate(x,y);g.scale(h.face*(o.s||1),o.s||1);g.translate(10,-66);const ang=at<.22?-2.9+(at-.14)/.08*4.4:1.5;const al=at<.22?1:1-(at-.22)/.14;const C=SK[P].sw;for(let i=0;i<3;i++){g.globalAlpha=al*(.8-i*.25);g.strokeStyle=i?C[0]:'#fff';g.lineWidth=22-i*6;g.lineCap='round';g.beginPath();g.arc(0,0,92-i*10,-2.9,Math.min(ang,1.5));g.stroke()}g.restore()}}
const ESZ={mrav:58,osa:62,pauk:62};
function enemy(e){if(!e.dead&&(e.k!=='mrav'||e.ph))shadow(e.x,G()+4,Math.max(6,16-(G()-e.y)/30));
 if(e.k==='pauk'&&!e.cut&&!e.dead){g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=1.5;g.beginPath();g.moveTo(e.x,e.y-10);g.lineTo(e.x,cocY()-110);g.stroke()}
 g.save();const wj=e.wu>0?Math.sin(T*60)*2.5:0;g.translate(e.x+wj,e.y);const ps=.85+.35*e.y/H;g.scale(ps,ps);if(e.dead)g.rotate(e.rot);
 const m=META[e.k],h=ESZ[e.k]*m[1]/m[0],w=ESZ[e.k];let sx=1,sy=1;
 if(e.k==='mrav'){g.translate(0,-Math.abs(Math.sin(e.t*14))*3);g.rotate(Math.sin(e.t*14)*.06)}
 else if(e.k==='osa'){sy=1+Math.sin(e.t*50)*.06;g.translate(0,Math.sin(e.t*6)*3)}
 else{g.rotate(Math.sin(e.t*2)*.1)}
 if(e.hit>0){sx=1.3;sy=.7}if(e.wu>0){sx*=1.1;sy*=.9}
 const goingRight=e.dead?e.vx>0:(e.k==='mrav'&&e.ph===0?e.side<0:cocX()>e.x);g.scale(goingRight?-sx:sx,sy);
 g.drawImage(IM[e.k],-w/2,-h/2,w,h);if(e.hit>0){g.globalCompositeOperation='lighter';g.globalAlpha=.7;g.drawImage(IM[e.k],-w/2,-h/2,w,h);g.globalCompositeOperation='source-over';g.globalAlpha=1}
 g.restore();if(e.wu!=null&&!e.dead){txt('!',e.x,e.y-30,22,'#ff4040')}
 if(e.stun>0||e.dead)for(let i=0;i<3;i++){const a=T*6+i*2.1;txt('★',e.x+Math.cos(a)*18,e.y-28+Math.sin(a)*5,13,'#ffe066')}}
function bird(b){if(!b.dead)shadow(b.x,G()+4,34);g.save();g.translate(b.x+(b.wu>0?Math.sin(T*60)*3:0),b.y+Math.sin(b.t*5)*6);if(b.kb>0||b.dead)g.rotate(b.t*(b.spin||8));
 let sx=1,sy=1+Math.sin(b.t*9)*.07;if(b.hit>0){sx=1.25;sy=.78}if(b.wu>0){sx=1.12;sy=.9}g.scale(sx,sy);const w=150,h=150*320/430;g.drawImage(IM.ptica,-w/2,-h/2,w,h);
 if(b.hit>0){g.globalCompositeOperation='lighter';g.globalAlpha=.7;g.drawImage(IM.ptica,-w/2,-h/2,w,h);g.globalCompositeOperation='source-over';g.globalAlpha=1}g.restore();
 if(b.wu>0)txt('!',b.x,b.y-60,28,'#ff4040');if(b.kb>0)for(let i=0;i<3;i++){const a=T*6+i*2.1;txt('★',b.x+Math.cos(a)*34,b.y-46+Math.sin(a)*8,17,'#ffe066')}if(b.dead)return;
 rr(80,8+46,200,14,7,'rgba(0,0,0,.35)');rr(82,10+46,196*b.hp/b.max,10,5,'#ff5a7a');txt('Velika ptica',180,48,16,'#fff')}
function butterfly(x,y,s,open){g.save();g.translate(x,y);g.scale(s,s);const f=open==null?.35+.65*Math.abs(Math.sin(T*7)):open;const w=150,h=150*360/416;
 g.save();g.scale(.15+.85*f,1);g.drawImage(IM.leptirL,-w/2,-h/2,w/2+1,h);g.restore();g.save();g.scale(.15+.85*f,1);g.drawImage(IM.leptirR,0,-h/2,w/2,h);g.restore();g.restore()}
function hearts(n,max){for(let i=0;i<max;i++){const x=20+i*30,y=26;g.save();g.translate(x,y);g.scale(1+(i<n?Math.sin(T*4+i)*.05:0),1);g.fillStyle=i<n?rg(0,0,14,'#ff9ab0','#e0204a'):'rgba(0,0,0,.25)';g.beginPath();g.moveTo(0,6);g.bezierCurveTo(-14,-4,-8,-14,0,-6);g.bezierCurveTo(8,-14,14,-4,0,6);g.fill();g.restore()}}
function button(lbl,x,y,w,h,c,fn){const p=1+Math.sin(T*4)*.03;g.save();g.translate(x,y);g.scale(p,p);rr(-w/2,-h/2+6,w,h,h/2,'rgba(0,0,0,.25)');const q=g.createLinearGradient(0,-h/2,0,h/2);q.addColorStop(0,c[0]);q.addColorStop(1,c[1]);rr(-w/2,-h/2,w,h,h/2,q);rr(-w/2+10,-h/2+5,w-20,h*.3,h*.15,'rgba(255,255,255,.35)');txt(lbl,0,10,28,'#fff');g.restore();btns.push({x:x-w/2,y:y-h/2,w,h,fn})}
const GR=['#7be86a','#2ea043'],OR=['#ffc24a','#f07a00'],PU=['#c58cff','#7a2fe0'];
function draw(){btns=[];g.setTransform(DPR*SC,0,0,DPR*SC,0,0);if(shake>0)g.translate(R(-5,5)*shake*3,R(-5,5)*shake*3);
 if(st==='load'){g.fillStyle='#bfe6ff';g.fillRect(0,0,W,H);txt('ČUVAR KOKONA',180,H*.4,38,'#ffd54a');rr(60,H*.5,240,22,11,'rgba(0,0,0,.25)');rr(63,H*.5+3,234*loaded/IMN.length,16,8,'#7be86a');txt('Učitavam...',180,H*.5+60,20,'#fff');ell(180+Math.cos(T*3)*50,H*.3+Math.sin(T*6)*10,6,6,'#ff8ad8')}
 else if(st==='title'){bg(T*20);branch();cocoon(cocX(),cocY(),0);butterfly(300,H*.5,.5);txt('Izaberi junaka:',180,H*.6,24,'#fff');for(const [k,x] of [['malik',95],['jakub',265]]){const sel=who===k;if(sel)ell(x,H-150,62,16,'rgba(255,230,80,.7)');hero(x,H-150,{who:k,s:sel?1.05:.9,h:{face:k==='malik'?1:-1,sw:0,run:0,hurt:0,vic:sel?1:0}});txt(SK[k].n,x,H-115,24,sel?'#ffd54a':'#fff');btns.push({x:x-70,y:H-310,w:140,h:200,fn:()=>{who=k;localStorage.setItem('kk-who',k)}})}txt('ČUVAR',180,H*.11,52,'#ffd54a');txt('KOKONA',180,H*.11+52,52,'#ff8ad8');
  button('IGRAJ',180,H-60,220,70,GR,()=>start(1));const mx=+localStorage.getItem('kk-lv')||1;if(mx>1)for(let i=1;i<=Math.min(5,mx);i++)button(''+i,180+(i-3)*58,H*.11+105,48,48,PU,()=>start(i));}
 else if(S.kind==='def'||st==='hatch'){bg(0);branch();
  if(st==='hatch'){const t=S.t;if(t<2.2)cocoon(cocX(),cocY(),t*.5,t>1);else{const k=Math.min(1,(t-2.2)/1.5);cocoon(cocX(),cocY(),0,0,1);if(t<2.6)puff(cocX(),cocY(),'#fff6c0',3);butterfly(cocX(),cocY()-k*40,.3+k*.9,k<.5?0:null);
    for(let i=0;i<6;i++){g.save();g.globalAlpha=.6;ell(cocX()+Math.cos(T*2+i)*90*k,cocY()+Math.sin(T*2+i)*90*k,6,6,'#fff59d');g.restore()}}
   hero(120,H-150,{h:{face:1,sw:0,run:0,hurt:0,vic:t>2.2?1:0}});txt(t<2.2?'Kokon puca...':'LEPTIR!',180,H*.62,40,'#ffd54a');}
  else{cocoon(cocX(),cocY(),S.cocShake);if(S.cocFl>0){g.globalAlpha=S.cocFl*1.5;ell(cocX(),cocY(),40,62,'rgba(255,80,80,.6)');g.globalAlpha=1}if(S.boss&&S.boss.y<H+80)bird(S.boss);for(const e of S.en)enemy(e);hero(S.hero.x,S.hero.y,{h:S.hero});
   hearts(S.coc,5);const L=LVL[LV];txt('Nivo '+LV,345,34,20,'#fff','right');if(!L.boss){rr(110,H-40,140,16,8,'rgba(0,0,0,.3)');rr(112,H-38,136*Math.min(1,S.kills/L.goal),12,6,'#ffd54a')}
   if(S.banner>0){g.globalAlpha=Math.min(1,S.banner);txt('Nivo '+LV+': '+L.name,180,H*.55,34,'#fff');txt('Udari napadače mačem! ⚔',180,H*.55+40,22,'#ffe');g.globalAlpha=1}}}
 else{const sc=S.dist;bg(sc);for(const o of S.ob){g.save();g.translate(o.x,o.y);if(o.k==='cvijet'){g.rotate(Math.sin(T*2+o.y)*.3);g.drawImage(IM.cvijet,-22,-21,44,42)}else if(o.k==='kap'){g.drawImage(IM.kap,-15,-21,30,41)}else{g.translate(0,Math.sin(T*20)*1.5);g.scale(1,1+Math.sin(T*45)*.05);g.drawImage(IM.vilin,-36,-27,72,55)}g.restore()}
  g.save();if(S.hurt>0&&((T*20|0)%2))g.globalAlpha=.4;const tilt=(S.ty-S.by)*.004;g.translate(110,S.by);g.rotate(tilt);butterfly(0,0,1.1);hero(2,30,{ride:1,s:.75});g.restore();
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
