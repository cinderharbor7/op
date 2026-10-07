import {openBrowser} from '@remotion/renderer';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('public');
const server=http.createServer(async(req,res)=>{try{const target=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}const ext=path.extname(target);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.ttf':'font/ttf','.otf':'font/otf','.json':'application/json'})[ext]||'application/octet-stream');res.end(await fs.readFile(target));}catch{res.writeHead(404);res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'angle'}});
try{
 const page=await browser.newPage({context:undefined,logLevel:'error',indent:false,pageIndex:0,onBrowserLog:()=>{},onLog:()=>{}});
 await page.setViewport({width:1440,height:810,deviceScaleFactor:1});
 await page.goto({url:`http://127.0.0.1:${server.address().port}/site/index.html`,timeout:30000,options:{waitUntil:'load'}});
 const result=await page.evaluate(async()=>{await window.film.fontsReady;window.film.seek({page:'home',time:.1});await document.fonts.ready;return window.film.verifySource();});
 await fs.writeFile('qa/native-fidelity.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
 if(result.contours.some(x=>x.differentChannels)||!result.fluidMaterialEqual||!result.fontsReady)throw new Error('Native source fidelity failed');
}finally{await browser.close({silent:true});server.close();}
