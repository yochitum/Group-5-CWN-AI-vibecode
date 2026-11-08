const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');process.chdir(root);
const files=fs.readdirSync('backend').filter(f=>f.endsWith('.test.cjs')).sort().map(f=>'backend/'+f);
const stamp=new Date().toISOString().replace(/[:.]/g,'-');
const out=path.join('evidence',stamp);fs.mkdirSync(out,{recursive:true});
const results=[];
for(let round=1;round<=2;round++){
 const r=spawnSync(process.execPath,['--test','--test-reporter=tap',...files],{encoding:'utf8',timeout:180000});
 const raw=(r.stdout||'')+(r.stderr||'');fs.writeFileSync(path.join(out,`run-${round}.tap`),raw);
 const count=key=>Number(raw.match(new RegExp(`# ${key} (\\d+)`))?.[1]||0);
 results.push({round,exitCode:r.status,error:r.error?.message,tests:count('tests'),passed:count('pass'),failed:count('fail'),skipped:count('skipped'),raw:`${out}/run-${round}.tap`});
}
const sourceFiles=['backend','frontend','assessment'].flatMap(dir=>fs.readdirSync(dir,{recursive:true}).filter(f=>/\.(cjs|js|html|css|json)$/.test(f)&&!f.includes('.runtime')&&!f.includes('vendor')).map(f=>`${dir}/${f}`));
const hashes=Object.fromEntries(sourceFiles.filter(f=>fs.statSync(f).isFile()).sort().map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')]));
const report={generatedAt:new Date().toISOString(),node:process.version,platform:process.platform,scope:'Node unit + API integration; not browser E2E',results,sourceHashes:hashes};
fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));fs.writeFileSync('evidence/latest.json',JSON.stringify({report:`${out}/results.json`},null,2));
console.log(JSON.stringify({report:`${out}/results.json`,results},null,2));
if(results.some(r=>r.exitCode!==0||!r.tests||r.failed||r.skipped))process.exitCode=1;
