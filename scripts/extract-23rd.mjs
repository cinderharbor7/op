import fs from 'node:fs';import ts from 'typescript';
const text=fs.readFileSync('third-party/23rd/ascii-fluid-0.txt','utf8');
const sf=ts.createSourceFile('ascii-fluid.tsx',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const wanted=['DEFAULT_CHARSET','VERT','FRAG_DISPLAY'];let parts=[];
for(const s of sf.statements){if(ts.isVariableStatement(s)&&s.declarationList.declarations.some(d=>wanted.includes(d.name.getText(sf))))parts.push(s.getText(sf).replace(/^export /,''));if(ts.isFunctionDeclaration(s)&&s.name?.text==='buildAtlas')parts.push(s.getText(sf).replace('ui-monospace, SFMono-Regular, Menlo, Consolas, monospace','"SF Mono", monospace').replace('700 ${','400 ${'));}
fs.writeFileSync('src/vendor/ascii-fluid-display.ts','// Adapted from radiumcoders/23rd.dev ASCII Fluid. See third-party/23rd/README.md.\n'+parts.join('\n')+'\nexport {DEFAULT_CHARSET,VERT,FRAG_DISPLAY,buildAtlas};\n');
