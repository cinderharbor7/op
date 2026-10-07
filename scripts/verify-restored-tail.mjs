import {bundle} from '@remotion/bundler';
import {getCompositions,renderStill,openBrowser} from '@remotion/renderer';
import {resolve} from 'node:path';
import {writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const serveUrl=await bundle({entryPoint:resolve('src/index.ts'),outDir:resolve('build'),rspack:true});
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'angle'}});
try {
 const compositions=await getCompositions(serveUrl,{puppeteerInstance:browser});
 const film=compositions.find(c=>c.id==='VERDANT-Film'),checks=[];
 const hash=async path=>createHash('sha256').update(await readFile(path)).digest('hex');
 for(const [frame,id,localFrame] of [[2520,'05-Wallet',180],[2840,'06-Preserve',140]]) {
  const output=`qa/00-01-v4/restored-${frame}.png`;
  const reference=`qa/00-01-v4/standalone-${id}-${localFrame}.png`;
  for(const [composition,renderFrame,path] of [[film,frame,output],[compositions.find(c=>c.id===id),localFrame,reference]]) {
   await renderStill({serveUrl,composition,frame:renderFrame,output:path,scale:.75,puppeteerInstance:browser,chromiumOptions:{gl:'angle'}});
  }
  checks.push({frame,id,localFrame,identical:await hash(output)===await hash(reference)});
 }
 const result={duration:film.durationInFrames/film.fps,ids:compositions.map(c=>c.id),checks};
 await writeFile('qa/00-01-v4/restored-tail.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify(result));
 if(film.durationInFrames!==3060||checks.some(c=>!c.identical))throw Error('Restored timeline mismatch');
}finally{await browser.close({silent:true});}
