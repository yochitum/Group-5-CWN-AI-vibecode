const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {createServer}=require('./server.cjs');
test('TC-TRIP-MANAGEMENT-01 named trips update in place, retain place metadata, and delete',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'trip-crud-')),file=path.join(dir,'trips.json');
 const server=createServer({dataFile:file});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
 const post=async body=>{const r=await fetch(base+'/api/trips',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});return {status:r.status,body:await r.json()};};
 try{const trip={destination:'เชียงใหม่',origin:'เชียงใหม่',days:1,budget:5000,interests:[],name:'แผนวันหยุด',plans:[[{custom:true,name:'จุดของฉัน',kind:'พักผ่อน',lat:18.79,lng:98.98,category:'hotel',address:'ที่อยู่ทดสอบ'}]]};
 const first=await post(trip);assert.equal(first.status,201);assert.equal(first.body.plans[0][0].category,'hotel');assert.equal(first.body.plans[0][0].address,'ที่อยู่ทดสอบ');
 const updated=await post({...first.body,name:'ชื่อใหม่'});assert.equal(updated.body.id,first.body.id);const all=await (await fetch(base+'/api/trips')).json();assert.equal(all.length,1);assert.equal(all[0].name,'ชื่อใหม่');
 assert.equal((await post({...trip,id:'unknown'})).status,400);
 assert.equal((await fetch(base+'/api/trips/'+first.body.id,{method:'DELETE'})).status,200);assert.deepEqual(await (await fetch(base+'/api/trips')).json(),[]);
 assert.equal((await fetch(base+'/api/trips/'+first.body.id,{method:'DELETE'})).status,404);
 }finally{await new Promise(resolve=>server.close(resolve));if(fs.existsSync(file))fs.unlinkSync(file);fs.rmdirSync(dir);}
});
