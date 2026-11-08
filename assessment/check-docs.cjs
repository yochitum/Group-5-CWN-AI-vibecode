const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
process.chdir(path.resolve(__dirname,'..'));
const errors=[];
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const manifest=read('submission.json'),cases=read('assessment/cases.json');
const exists=p=>{if(!fs.existsSync(p))errors.push('Missing: '+p);};
if(manifest.labs.length!==13)errors.push('Expected LAB00..12');
if(manifest.rubric.length!==20)errors.push('Expected20rubric entries');
const docs=['README.md','REVIEW-INDEX.md','LAB-STATUS.md','RUBRIC-MAP.md','LAB0.md','INTERVIEW.md','USER-STORIES.md','REQUIREMENTS.md','DESIGN.md','TEST-DATA.md','BUILD-PROMPT.md','SPEC.md','EXPLORATION.md','TEST-PLAN.md','PLAN-REVIEW.md','TEST-RUN-1.md','BUG-HUNT.md'];
for(const lab of manifest.labs)for(const p of lab.artifact_paths)exists(p);
for(const rubric of manifest.rubric)exists(rubric.artifact);
for(const p of Object.values(manifest.evidence))exists(p);
for(const file of docs){
 exists(file);if(!fs.existsSync(file))continue;
 for(const match of fs.readFileSync(file,'utf8').matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
  const target=match[1].split('#')[0];if(!target||/^[a-z]+:/i.test(target))continue;
  exists(path.resolve(path.dirname(file),decodeURIComponent(target)));
 }
}
const plan=fs.readFileSync('TEST-PLAN.md','utf8');
const req=fs.readFileSync('REQUIREMENTS.md','utf8');
const ids=new Set();
for(const c of cases){
 if(ids.has(c.id))errors.push('Duplicate '+c.id);ids.add(c.id);
 exists(c.file);
 if(!fs.readFileSync(c.file,'utf8').includes("test('"+c.id+' '))errors.push('Test ID missing '+c.id);
 if(!plan.includes(c.id))errors.push('Plan missing '+c.id);
 for(const ref of [...c.requirements,...c.rules])if(!req.includes(ref))errors.push('Unknown requirement '+ref);
}
const sourceTests=fs.readdirSync('backend').filter(f=>f.endsWith('.test.cjs')).flatMap(f=>[...fs.readFileSync('backend/'+f,'utf8').matchAll(/test\('(TC-[^ ]+) /g)].map(m=>m[1]));
if(sourceTests.length!==cases.length)errors.push('Case/source count mismatch');
const pointer=read('evidence/latest.json'),report=read(pointer.report);
for(const [file,hash] of Object.entries(report.sourceHashes)){
 exists(file);if(fs.existsSync(file)&&crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==hash)errors.push('Stale evidence source hash: '+file);
}
for(const run of report.results){
 exists(run.raw);const raw=fs.readFileSync(run.raw,'utf8');
 for(const id of ids)if(!raw.includes(id))errors.push('Run '+run.round+' missing '+id);
 if(run.tests!==cases.length)errors.push('Report case count mismatch');
}
const ui=read('assessment/ui-cases.json');
for(const c of ui)if(!plan.includes(c.id))errors.push('UI case missing from plan '+c.id);
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
else console.log(`PASS: ${docs.length} documents,13labs,20rubric entries,${cases.length} Nodecases,${ui.length} pending UIcases,local links and source hashes. Content quality/browser behavior not validated by this check.`);
