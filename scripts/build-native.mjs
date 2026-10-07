import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import crypto from 'node:crypto';
import ts from 'typescript';
const root=process.cwd(),web=path.resolve(root,'../xjy/web'),out=path.resolve('native/generated');
const req=createRequire(path.resolve('../xjy/package.json'));
const {build}=await import(pathToFileURL(req.resolve('vite')).href);
const {default:tailwind}=await import(pathToFileURL(req.resolve('@tailwindcss/vite')).href);
fs.mkdirSync(out,{recursive:true});
const snapshots=[];
function source(file){const full=path.join(web,file),text=fs.readFileSync(full,'utf8');snapshots.push({file,sha256:crypto.createHash('sha256').update(text).digest('hex')});return ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);}
const app=source('app.js'),research=source('pages/research.js'),guardian=source('pages/guardian.js'),attest=source('pages/attestations.js'),render=source('fingerprint/render.js');
const fn=(sf,name)=>{const n=sf.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text===name);if(!n)throw Error(`Missing source function ${name}`);return n;};
const functions=(sf,names)=>names.map(n=>fn(sf,n).getText(sf)).join('\n');
const variables=(sf,names)=>names.map(name=>{for(const s of sf.statements)if(ts.isVariableStatement(s)){const d=s.declarationList.declarations.find(d=>d.name.getText(sf)===name);if(d)return `let ${d.getText(sf)};`;}throw Error(`Missing source variable ${name}`);}).join('\n');
const assign=(node,selector)=>{const statement=node.body.statements.find(s=>ts.isExpressionStatement(s)&&s.expression.getText().startsWith(selector));if(!statement)throw Error(`Missing assignment ${selector}`);return statement.getText();};
const nodeVar=(node,name)=>{const s=node.body.statements.find(s=>ts.isVariableStatement(s)&&s.declarationList.declarations.some(d=>d.name.getText()===name));if(!s)throw Error(`Missing local ${name}`);return s.getText();};
const sourceImport='../../../xjy/web';
fs.writeFileSync(path.join(out,'app.js'),`
import {identityAssets,esc,pct,time as timestamp} from '${sourceImport}/ui.js';
import {sampleMarket,sampleHistory,visualParameters,candleStats} from '${sourceImport}/fingerprint/data.js';
import {createEdition,contractAddress} from '${sourceImport}/fingerprint/nft.js';
const isMotionPaused=()=>false;const mount=()=>{};let currentEdition;
${variables(app,['$','money','compact','statusName','safeURL','change','coinCanvas','state'])}
${functions(app,['statusControl','art','home','renderCards','detailPage','priceChart','sentimentNetwork','detailPanels','homeTools','coinTools','modal','guide','mintDialog'])}
export function appPage(page,dialog){
 document.querySelector('#modal').close();const c=state.market.coins[0];
 if(page==='home'){$('#main').innerHTML=home();renderCards();}
 else{$('#main').innerHTML=detailPage(c);detailPanels(c,null);}
 if(dialog==='guide')guide();if(dialog==='mint')mintDialog(c);
}
`);
const helpers=`import {esc,money,pct,time,pageHead,badge,panel,list,table,facts,explorer,rawDetails,assetTag} from '${sourceImport}/ui.js';`;
const rmount=fn(research,'mount');
fs.writeFileSync(path.join(out,'research.js'),`${helpers}\n${functions(research,['transactionReportHTML','riskReportHTML'])}\nexport function researchPage(root,kind){${nodeVar(rmount,'config')}\n${assign(rmount,'root.innerHTML')}}`);
const gmount=fn(guardian,'mount'),controls=fn({statements:gmount.body.statements},'renderControls');
fs.writeFileSync(path.join(out,'guardian.js'),`${helpers}\nimport {ExecutionBadge,VerificationBadge,VerificationDetails,StressChart} from '${sourceImport}/pages/rescue-display.js';\n${functions(guardian,['sessionHTML'])}\nexport function guardianPage(root,status,policy,session){${assign(gmount,'root.innerHTML')}\n${nodeVar(gmount,'fields')}\n${assign(controls,'root.querySelector')}\nroot.querySelector('#guardian-state').innerHTML='<div class="status-band">'+badge('MOCK')+badge('监控暂停')+'</div>';root.querySelector('#event-history').innerHTML='<p class="note">动画沙盒 · 没有连接运行中的监控服务。</p>';if(session)root.querySelector('#guardian-results').innerHTML=sessionHTML(session,status);}`);
fs.writeFileSync(path.join(out,'attest.js'),`${helpers}\nexport function attestationPage(root){const mode='research',contract='',publisher='';${assign(fn(attest,'mount'),'root.innerHTML')}}`);
// Extract the original per-canvas paint statements, unchanged. No new colors or simplified gradients.
const mount=fn(render,'mountFingerprints'),draw=fn({statements:mount.body.statements},'draw');
const loop=draw.body.statements.find(s=>ts.isForOfStatement(s));
const start=loop.statement.statements.findIndex(s=>ts.isVariableStatement(s)&&s.declarationList.declarations.some(d=>d.name.getText()==='size'));
if(start<0)throw Error('Original canvas paint block not found');
const paint=loop.statement.statements.slice(start).map(s=>s.getText(render)).join('\n');
fs.writeFileSync(path.resolve('src/vendor/source-paint.js'),`// Generated from xjy/web/fingerprint/render.js by build-native.mjs. Do not simplify.\nimport {visualParameters} from './data.js';\nimport {contourPoints} from './contour.js';\nexport function sourcePaint(ctx,coin,sentiment,width,height,time,small=false,mouse={x:0,y:0}){const p=visualParameters(coin,coin.visualIdentity?{value:null}:sentiment),r={width,height};${paint}}\n`);
fs.copyFileSync(path.join(web,'fingerprint/data.js'),path.resolve('src/vendor/data.js'));
fs.copyFileSync(path.join(web,'fingerprint/sculpture-shader.json'),path.resolve('src/vendor/sculpture-shader.json'));
fs.writeFileSync(path.resolve('src/vendor/contour.js'),functions(render,['contourPoints']));
const sculpture=source('fingerprint/sculpture.js');
fs.writeFileSync(path.resolve('src/vendor/source-fluid.js'),`import * as THREE from 'three';import shader from './sculpture-shader.json';import {visualParameters} from './data.js';\n${functions(sculpture,['createFluidMesh'])}`);
const html=fs.readFileSync(path.join(web,'index.html'),'utf8').replace('<script type="module" src="/app.js"></script>','<script type="module" src="./bridge.js"></script>').replace('href="/favicon.svg"','href="data:,"');
fs.writeFileSync('native/index.html',html);
source('style.css');source('index.html');source('fingerprint/data.js');source('ui.js');
await build({configFile:false,root:path.resolve('native'),base:'./',plugins:[tailwind()],resolve:{dedupe:['three'],alias:{'@':path.resolve('../xjy/src')}},define:{'process.env.NEXT_PUBLIC_BOT_RPC_URL':'""','process.env.NEXT_PUBLIC_BOT_REPORT_REGISTRY':'""'},build:{outDir:path.resolve('public/site'),emptyOutDir:true,chunkSizeWarningLimit:1100}});
fs.writeFileSync('qa/native-source-manifest.json',JSON.stringify({generatedAt:new Date().toISOString(),source:web,snapshots,html:'Original header/footer and extracted function bodies',css:'Original style.css compiled through Vite/Tailwind',canvas:'Original paint statements including gradient stops; original fluid mesh factory'},null,2));
