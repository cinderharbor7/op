import '../../xjy/web/style.css';
import {appPage} from './generated/app.js';
import {researchPage,riskReportHTML,transactionReportHTML} from './generated/research.js';
import {guardianPage} from './generated/guardian.js';
import {attestationPage} from './generated/attest.js';
import {sampleMarket} from '../../xjy/web/fingerprint/data.js';
import {registry} from '../../xjy/web/ui.js';
import {mountFingerprints} from '../../xjy/web/fingerprint/render.js';
import {createFluidMesh as originalFluidMesh} from '../../xjy/web/fingerprint/sculpture.js';
import {sourcePaint} from '../src/vendor/source-paint.js';
import {createFluidMesh} from '../src/vendor/source-fluid.js';
import * as THREE from 'three';
import research from './fixtures/research.json';
import guardian from './fixtures/guardian.json';
import investigation from './fixtures/investigation.json';

const style=document.createElement('style');
style.textContent='html{scroll-behavior:auto!important;scrollbar-width:none}::-webkit-scrollbar{display:none}*{transition:none!important;animation:none!important}body{overflow-x:hidden}.film-loading{padding:30px 0;color:var(--ink-soft)}';
style.textContent+='html.film-isolate{background:transparent!important}html.film-isolate body{background:transparent!important}html.film-isolate body *{visibility:hidden!important}html.film-isolate [data-film-feature],html.film-isolate [data-film-feature] *{visibility:visible!important}html.film-isolate [data-film-feature]{background:var(--paper)}';
document.head.append(style);
const fonts=document.createElement('style');fonts.textContent=`
@font-face{font-family:'PingFang SC';src:url('../fonts/PingFangSC-Regular.ttf');font-weight:400}
@font-face{font-family:'PingFang SC';src:url('../fonts/PingFangSC-Medium.ttf');font-weight:500}
@font-face{font-family:'PingFang SC';src:url('../fonts/PingFangSC-Semibold.ttf');font-weight:600 900}
@font-face{font-family:'SF Mono';src:url('../fonts/SF-Mono-Regular.otf');font-weight:400}
@font-face{font-family:'SF Mono';src:url('../fonts/SF-Mono-Medium.otf');font-weight:500}
@font-face{font-family:'SF Mono';src:url('../fonts/SF-Mono-Semibold.otf');font-weight:600 900}
:root{--font-sans:'PingFang SC',sans-serif;font-family:var(--font-sans);font-synthesis:none}
.hero-price,.detail-price,.coin-price,code,.metrics-table td:nth-child(2),.detail-metrics dd{font-family:'SF Mono','PingFang SC',monospace;font-variant-numeric:tabular-nums}
`;document.head.append(fonts);
// This static film surface has no network, wallet, navigation or persistent-state actions.
document.addEventListener('click',e=>e.preventDefault(),true);
document.addEventListener('submit',e=>e.preventDefault(),true);
const market=sampleMarket();let lastKey='',fluid=null;
const coinFor=id=>market.coins.find(c=>c.id===id)||{id:'BOT',name:'BOT Chain',color:155,amplitude:null,volume:null,visualIdentity:true};
function dispose(){if(fluid){fluid.mesh.geometry.dispose();fluid.mesh.material.dispose();fluid.renderer.dispose();fluid=null;}}
function createFluid(host,coin){const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(1);const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,.1,100);camera.position.z=4.6;const mesh=createFluidMesh(coin,coin.visualIdentity?{value:null}:market.sentiment);scene.add(mesh);host.append(renderer.domElement);fluid={renderer,scene,camera,mesh,host};}
function layout(s){
 dispose();document.querySelector('#modal').close();const root=document.querySelector('#main');
 if(s.page==='home'||s.page==='detail')appPage(s.page,s.dialog);
 if(s.page==='investigate'||s.page==='risk-lab'){
  researchPage(root,s.page);
  if(s.page==='risk-lab'){root.querySelector('#research-result').innerHTML=riskReportHTML(research);root.querySelector('.research-metrics').closest('section').id='film-risk-inputs';root.querySelector('.model-grid').closest('section').id='film-risk-models';[...root.querySelectorAll('.workspace-panel')].find(el=>el.querySelector('h2')?.textContent==='数据出处与限制').id='film-risk-sources';}
  else{
   if(s.progress>=1)root.querySelector('#query-value').value=investigation.observation.transaction.hash;
   if(s.progress===2)root.querySelector('#research-result').innerHTML='<p class="loading">正在读取并校验数据…</p>';
   if(s.progress>=3)root.querySelector('#research-result').innerHTML=transactionReportHTML(investigation);
  }
 }
 if(s.page==='guardian')guardianPage(root,guardian.status,guardian.policy,s.progress>=2?guardian.session:null);
 if(s.page==='attestations')attestationPage(root);
 if(s.page==='guardian'&&s.progress===1)root.querySelector('#guardian-message').textContent='正在运行 MOCK 保护流程…';
 if(s.page==='attestations'&&s.progress>=1)root.querySelector('#report-preview').innerHTML='<div class="notice">研究样本已固定 · MOCK_CHAIN_FIXTURE</div><p class="note">动画示意：下一步在钱包单独确认。</p>';
 const path=s.page==='detail'?'/':s.page==='home'?'/':'/'+s.page;
 document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('active',a.dataset.nav===path));
 if(s.connected)document.querySelector('#wallet-label').textContent='0x12…89AB';
 if(s.view==='fluid'){
  const art=document.querySelector(s.page==='home'?'.hero-art':'#detail-art-content');
  if(s.page==='home')art.querySelector('canvas')?.remove();
  else{art.innerHTML='<div class="sculpture-host" id="sculpture-host"></div><div class="art-toolbar"><span>流体形态 / Shader Park</span><button data-action="motion" aria-label="暂停动态图形">Ⅱ</button></div>';document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view==='sculpture'));}
  const host=s.page==='home'?document.createElement('div'):document.querySelector('#sculpture-host');
  if(s.page==='home'){host.style.cssText='position:absolute;inset:0';art.prepend(host);}createFluid(host,s.heroCoin?coinFor(s.heroCoin):market.coins[0]);
 }
}
function box(selector){const el=document.querySelector(selector);if(!el)return null;const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}
function seek(s){
 const key=JSON.stringify([s.page,s.view,s.dialog,s.progress,s.connected,s.heroCoin]);if(key!==lastKey){layout(s);lastKey=key;}
 let scroll=0;if(s.scrollTarget){const r=document.querySelector(s.scrollTarget)?.getBoundingClientRect();if(r){const to=Math.max(0,r.top+window.scrollY-(s.scrollPad??110)+(s.scrollOffset??0)),old=s.scrollFrom?document.querySelector(s.scrollFrom)?.getBoundingClientRect():null,from=old?Math.max(0,old.top+window.scrollY-(s.scrollPad??110)+(s.scrollFromOffset??0)):0;scroll=from+(to-from)*(s.scrollProgress??1);}}
 window.scrollTo(0,scroll+(s.scrollNudge??0));
 for(const canvas of document.querySelectorAll('canvas[data-coin]')){
  const c=s.heroCoin&&canvas.closest('.hero-art')?coinFor(s.heroCoin):market.coins.find(c=>c.id===canvas.dataset.coin)||registry.find(c=>c.id===canvas.dataset.coin);if(!c)continue;
  const isIdentity=!!canvas.closest('.asset-tag'),small=canvas.dataset.size==='small',r=s.fingerprintScale==null?canvas.getBoundingClientRect():{width:canvas.clientWidth,height:canvas.clientHeight};
  if(!r.width||!r.height)continue;const dpr=2;canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,r.width,r.height);
  sourcePaint(ctx,isIdentity?{...c,amplitude:null,volume:null,visualIdentity:true}:c,market.sentiment,r.width,r.height,s.time,small,{x:canvas.closest('.hero-art')?(s.heroSpin??0)/.22:0,y:0});
 }
 if(fluid){const {renderer,scene,camera,mesh,host}=fluid;const r=host.getBoundingClientRect();renderer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();mesh.material.uniforms.resolution.value.set(r.width,r.height);mesh.material.uniforms.t.value=s.time;mesh.rotation.y=s.heroSpin??0;renderer.render(scene,camera);}
 document.querySelectorAll('canvas').forEach(canvas=>{canvas.style.transformOrigin='50% 50%';canvas.style.transform=s.fingerprintScale==null?'':`scale(${s.fingerprintScale})`;});
 if(s.hideArt){document.querySelectorAll('.hero-art canvas,.sculpture-host canvas').forEach(c=>c.style.visibility='hidden');}else{document.querySelectorAll('.hero-art canvas,.sculpture-host canvas').forEach(c=>c.style.visibility='visible');}
 const reveal=s.reveal??1;
 document.querySelectorAll('.hero-art canvas,.sculpture-host canvas').forEach(c=>c.style.opacity=String(s.artOpacity??1));
 document.querySelectorAll('.site-header,.site-footer,.intro-line,.hero-copy,.legend-strip,.workspace-paths,.catalogue,.art-label,.art-toolbar').forEach(el=>el.style.opacity=String(reveal));
 const hero=document.querySelector('.hero');
 if(s.smoothReveal){
  const tint=s.stageTint||'#eee6d8',base=[1,3,5].map(i=>parseInt(tint.slice(i,i+2),16));
  const rgb=base.map((v,i)=>v+([247,241,231][i]-v)*reveal);
  document.documentElement.style.backgroundColor=`rgb(${rgb.join(',')})`;
  if(hero){hero.style.background=`rgba(238,230,216,${reveal})`;hero.style.borderColor=`rgba(201,198,181,${reveal})`;}
 }else{
  if(hero){hero.style.borderColor=reveal<.99?'transparent':'';hero.style.background=reveal<.99?'transparent':'';}
  document.documentElement.style.backgroundColor=reveal<.99?'#eee6d8':'';
 }
 document.documentElement.classList.toggle('film-isolate',!!s.isolate);
 document.querySelectorAll('[data-film-feature]').forEach(el=>el.removeAttribute('data-film-feature'));
 if(s.isolate)document.querySelector(s.isolate)?.setAttribute('data-film-feature','');
 return {ready:true,height:document.documentElement.scrollHeight};
}
window.film={seek,box,source:'xjy/web',version:2,fontsReady:Promise.all(['PingFang SC','SF Mono'].flatMap(family=>[400,500,600].map(w=>document.fonts.load(w+' 16px "'+family+'"')))).then(()=>document.fonts.ready)};
window.film.verifySource=()=>{
 const results=[];
 for(const [id,small] of [['ETH',false],['ETH',true],['BTC',false],['SOL',false]]){
  const coin=coinFor(id),host=document.createElement('div'),a=document.createElement('canvas'),b=document.createElement('canvas');
  host.style.cssText='position:fixed;left:0;top:0;opacity:0;pointer-events:none';a.style.cssText='width:360px;height:300px';a.dataset.coin=id;if(small)a.dataset.size='small';host.append(a);document.body.append(host);
  const raf=window.requestAnimationFrame,caf=window.cancelAnimationFrame;let draw;
  window.requestAnimationFrame=fn=>{draw=fn;return 0;};window.cancelAnimationFrame=()=>{};
  const cleanup=mountFingerprints(host,[coin],market.sentiment);draw(100);
  b.width=a.width;b.height=a.height;const ctx=b.getContext('2d'),dpr=a.width/360;ctx.setTransform(dpr,0,0,dpr,0,0);sourcePaint(ctx,coin,market.sentiment,360,300,.1,small);
  const x=a.getContext('2d').getImageData(0,0,a.width,a.height).data,y=ctx.getImageData(0,0,b.width,b.height).data;let differentChannels=0,maxDifference=0;for(let i=0;i<x.length;i++){const diff=Math.abs(x[i]-y[i]);if(diff)differentChannels++;maxDifference=Math.max(maxDifference,diff);}
  cleanup();window.requestAnimationFrame=raf;window.cancelAnimationFrame=caf;host.remove();results.push({id,small,pixels:a.width*a.height,differentChannels,maxDifference});
 }
 const original=originalFluidMesh(market.coins[0],market.sentiment),extracted=createFluidMesh(market.coins[0],market.sentiment);
 const materialEqual=original.material.vertexShader===extracted.material.vertexShader&&original.material.fragmentShader===extracted.material.fragmentShader&&JSON.stringify(original.material.uniforms)===JSON.stringify(extracted.material.uniforms);
 original.geometry.dispose();original.material.dispose();extracted.geometry.dispose();extracted.material.dispose();
 return {contours:results,fluidMaterialEqual:materialEqual,fontFamily:getComputedStyle(document.documentElement).fontFamily,fontsReady:document.fonts.check('400 16px "PingFang SC"')&&document.fonts.check('600 16px "SF Mono"')};
};
window.parent.postMessage({type:'verdant-native-ready'},'*');
