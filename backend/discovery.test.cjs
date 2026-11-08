const {test}=require('node:test');const assert=require('node:assert/strict');
const {createDiscovery,validateBounds,mapPlace}=require('./discovery.cjs');
test('TC-DISCOVERY-01 reject wide, reversed, nonnumeric and outside-region bounds',()=>{
 for(const value of ['','x,100,14,101','5,97,21,106','14,100,13,100.01','0,0,.01,.01'])assert.throws(()=>validateBounds(value),e=>e.status===400);
 assert.deepEqual(validateBounds('13.72,100.51,13.725,100.52'),[13.72,100.51,13.725,100.52]);
});
test('TC-DISCOVERY-02 map actual POI fields, omit missing names, and classify categories',()=>{
 assert.equal(mapPlace({lat:13,lon:100}),null);
 for(const [tags,category] of [[{amenity:'cafe'},'cafe'],[{tourism:'hotel'},'hotel'],[{shop:'books'},'shopping'],[{amenity:'restaurant'},'food']]){const p=mapPlace({type:'node',id:1,lat:13.72,lon:100.51,tags:{name:'Sample',...tags}});assert.equal(p.category,category);assert.equal(p.lat,13.72);assert.equal(p.address,'');}
});
test('TC-DISCOVERY-03 cache repeated viewport and throttle additional requests',async()=>{
 let calls=0;const discovery=createDiscovery(async()=>{calls++;return {ok:true,json:async()=>({elements:[{type:'node',id:1,lat:13.722,lon:100.515,tags:{name:'Cafe',amenity:'cafe'}}]})};});
 const bbox='13.72,100.51,13.725,100.52';assert.equal((await discovery(bbox)).places.length,1);await discovery(bbox);assert.equal(calls,1);await assert.rejects(discovery('13.72,100.51,13.726,100.52'),e=>e.status===429);
});
test('TC-DISCOVERY-04 provider failure is an error, never an empty success',async()=>{
 await assert.rejects(createDiscovery(async()=>({ok:false}))('13.72,100.51,13.725,100.52'),e=>e.status===503);
});
