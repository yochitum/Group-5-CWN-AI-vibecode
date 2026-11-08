// Controlled, known mutations in temporary copies. This is NOT a blind BUG_MODE hunt.
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),dir=fs.mkdtempSync(path.join(os.tmpdir(),'roam-mutations-'));
const mutations=[
 {id:'M1',file:'frontend/expense-core.js',from:'i<remainder?1:0',to:'0',test:'backend/expenses.test.cjs',fault:'Drop remainder satang from shared expenses'},
 {id:'M2',file:'backend/selected-plan.cjs',from:'selected.length>input.days*6',to:'selected.length>input.days*5',test:'backend/assessment.test.cjs',fault:'Reject the allowed sixth visit'},
 {id:'M3',file:'frontend/feedback-core.js',from:'proposal.status=decision;',to:"proposal.status='pending';",test:'backend/feedback.test.cjs',fault:'Accepted feedback remains pending'}
];
const results=[];const logDir=path.join(root,'evidence/mutations');fs.mkdirSync(logDir,{recursive:true});
try{
 for(const mutation of mutations){
  const work=path.join(dir,mutation.id);fs.mkdirSync(work);
  for(const folder of ['backend','frontend'])fs.cpSync(path.join(root,folder),path.join(work,folder),{recursive:true,filter:source=>!source.includes(`${path.sep}data`)&&!source.includes(`${path.sep}assets`)});
  const run=()=>spawnSync(process.execPath,['--test','--test-reporter=tap',mutation.test],{cwd:work,encoding:'utf8',timeout:60000});
  const baseline=run();const target=path.join(work,mutation.file),original=fs.readFileSync(target,'utf8');
  if(original.split(mutation.from).length!==2)throw Error('Mutation target must be unique: '+mutation.id);
  fs.writeFileSync(target,original.replace(mutation.from,mutation.to));const mutant=run();
  fs.writeFileSync(path.join(logDir,`${mutation.id}-baseline.tap`),(baseline.stdout||'')+(baseline.stderr||''));
  fs.writeFileSync(path.join(logDir,`${mutation.id}-mutant.tap`),(mutant.stdout||'')+(mutant.stderr||''));
  const killed=baseline.status===0&&mutant.status===1&&/# fail [1-9]/.test(mutant.stdout||'');
  results.push({...mutation,baselineExit:baseline.status,mutantExit:mutant.status,killed});
 }
 const report={generatedAt:new Date().toISOString(),method:'Known source mutation in isolated copies, normal app unchanged',results};
 fs.writeFileSync(path.join(logDir,'results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 if(results.some(r=>!r.killed))process.exitCode=1;
}finally{fs.rmSync(dir,{recursive:true,force:true});}
