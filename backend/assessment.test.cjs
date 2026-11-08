const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {buildPlan,createServer}=require('./server.cjs');
const {validateMembers}=require('./members.cjs');
const {validateExpenses}=require('./expenses.cjs');
const input={destination:'เชียงใหม่',origin:'เชียงใหม่',days:1,budget:5000,interests:[]};
test('TC-ASSESSMENT-01 days accept 1 and 4; reject 0, 5 and fractions',()=>{
 for(const days of [1,4])assert.equal(buildPlan({...input,days}).plans.length,days);
 for(const days of [0,5,1.5])assert.throws(()=>buildPlan({...input,days}),e=>e.status===400);
});
test('TC-ASSESSMENT-02 budget accepts 500 and 100000; rejects 499 and 100001',()=>{
 for(const budget of [500,100000])assert.equal(buildPlan({...input,budget}).budget,budget);
 for(const budget of [499,100001,NaN])assert.throws(()=>buildPlan({...input,budget}),e=>e.status===400);
});
test('TC-ASSESSMENT-03 six selected visits fit one day; seven are rejected',()=>{
 const selected=Array.from({length:7},(_,i)=>({custom:true,name:'จุด '+i,kind:'เที่ยว',lat:18.7+i*.001,lng:98.9}));
 const data={...input,start:selected[0],end:selected[0]};
 const result=buildPlan({...data,selected:selected.slice(0,6)});
 assert.equal(result.plans[0].filter(s=>!s.anchor).length,6);
 assert.throws(()=>buildPlan({...data,selected}),e=>e.status===400);
});
test('TC-ASSESSMENT-04 member count boundary 99, 100, 101',()=>{
 const rows=Array.from({length:101},(_,i)=>({id:String(i),name:'สมาชิก '+i,status:'going'}));
 for(const count of [99,100])assert.equal(validateMembers(rows.slice(0,count)).length,count);
 assert.throws(()=>validateMembers(rows),e=>e.status===400);
});
test('TC-ASSESSMENT-05 expense satang boundaries and integer partition',()=>{
 const members=[{id:'a'}],item={id:'e',title:'อาหาร',date:'2026-11-07',payer:'a',participants:['a']};
 for(const amountSatang of [1,2,99999999,100000000])assert.equal(validateExpenses([{...item,amountSatang}],members)[0].amountSatang,amountSatang);
 for(const amountSatang of [0,100000001,1.5])assert.throws(()=>validateExpenses([{...item,amountSatang}],members),e=>e.status===400);
});
test('TC-ASSESSMENT-06 test reset is disabled by default and rejects production storage',async()=>{
 assert.throws(()=>createServer({allowTestReset:true}),/separate data/);
 const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{assert.equal((await fetch(`http://127.0.0.1:${server.address().port}/api/test/reset`,{method:'POST',body:'{}'})).status,404);}
 finally{await new Promise(resolve=>server.close(resolve));}
});
test('TC-ASSESSMENT-07 isolated reset clears trips and fixes savedAt; invalid clock does not reset',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'roam-assessment-'));
 const server=createServer({dataFile:path.join(dir,'trips.json'),allowTestReset:true});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;
 const post=(url,data)=>fetch(base+url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
 try{
  assert.equal((await post('/api/test/reset',{})).status,200);
  const saved=await (await post('/api/trips',buildPlan(input))).json();
  assert.equal(saved.savedAt,Date.parse('2026-11-07T09:00:00+07:00'));
  assert.equal((await post('/api/test/reset',{now:'invalid'})).status,400);
  assert.equal((await (await fetch(base+'/api/trips')).json()).length,1);
  await post('/api/test/reset',{});assert.deepEqual(await (await fetch(base+'/api/trips')).json(),[]);
 }finally{await new Promise(resolve=>server.close(resolve));fs.rmSync(dir,{recursive:true,force:true});}
});
