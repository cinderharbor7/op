import {bundle} from '@remotion/bundler';
import {getCompositions,renderStill,openBrowser} from '@remotion/renderer';
import {resolve} from 'node:path';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const before=process.argv.includes('--before');
const dir=before?'qa/opening-before':'qa/opening-after';
await mkdir(dir,{recursive:true});
const serveUrl=await bundle({entryPoint:resolve('src/index.ts'),outDir:resolve('build'),rspack:true});
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'angle'}});
const errors=[];
try{
 const comps=await getCompositions(serveUrl,{puppeteerInstance:browser}),composition=comps.find(c=>c.id==='00-Opening');
 const frames=before?[361,362]:[112,132,145,156,172,183,198,220,270,361,390,400,425,479];
 const hashes={};
 for(const frame of frames){const output=`${dir}/${frame}.png`;await renderStill({serveUrl,composition,frame,output,scale:.75,puppeteerInstance:browser,chromiumOptions:{gl:'angle'},onBrowserLog:log=>{if(log.type==='error')errors.push(log.text);}});hashes[frame]=createHash('sha256').update(await readFile(output)).digest('hex');console.log(`Opening ${frame}`);}
 const held=!before&&[479].every(f=>hashes[f]===hashes[425]);
 await writeFile(`${dir}/verification.json`,JSON.stringify({frames,errors,hashes,heldFromFrame425:held},null,2));
 if(errors.length||(!before&&!held))throw Error('Opening verification failed');
}finally{await browser.close({silent:true});}
