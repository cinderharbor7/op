import {getCompositions,renderStill,openBrowser} from '@remotion/renderer';
import {resolve} from 'node:path';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'angle'}}),serveUrl=resolve('build'),checks=[];
try{
 const comps=await getCompositions(serveUrl,{puppeteerInstance:browser});
 for(const [id,frame] of [['02-Investigation',280],['05-Wallet',180]]){
  const output=`qa/opening-after/scope-${id}-${frame}.png`;
  await renderStill({serveUrl,composition:comps.find(c=>c.id===id),frame,output,scale:.75,puppeteerInstance:browser,chromiumOptions:{gl:'angle'}});
  const hash=async p=>createHash('sha256').update(await readFile(p)).digest('hex');
  checks.push({id,frame,unchanged:await hash(output)===await hash(`qa/frames/${id}-${frame}.png`)});
 }
 await writeFile('qa/opening-after/scope-check.json',JSON.stringify(checks,null,2));console.log(JSON.stringify(checks));
 if(checks.some(c=>!c.unchanged))throw Error('Non-opening frame changed');
}finally{await browser.close({silent:true});}
