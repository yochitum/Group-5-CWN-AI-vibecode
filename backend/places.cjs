const provinces={'เชียงใหม่':'TH-50','ภูเก็ต':'TH-83','กรุงเทพมหานคร':'TH-10'};
function createPlaceSearch(fetchImpl=fetch){
 const cache=new Map();let busy=false,last=0;
 return async(q,province)=>{
  const fail=(status,message)=>{throw Object.assign(Error(message),{status});};
  q=typeof q==='string'?q.trim():'';
  if(q.length<2||q.length>100||!provinces[province])fail(400,'ระบุชื่ออย่างน้อย 2 ตัวอักษร และเลือกจังหวัดที่รองรับ');
  const key=province+'|'+q.toLowerCase(),hit=cache.get(key);
  if(hit&&Date.now()-hit.time<3600000)return hit.data;
  if(busy||Date.now()-last<1500)fail(429,'กรุณารอสักครู่แล้วค้นหาอีกครั้ง');
  busy=true;last=Date.now();
  try{
   const url=new URL(process.env.PHOTON_URL||'https://photon.komoot.io/api/');
   url.search=new URLSearchParams({q:q+' '+province,limit:'12'}).toString();
   const response=await fetchImpl(url,{headers:{'User-Agent':'ThiaoNaiDee/1.0 (local teaching prototype)'},signal:AbortSignal.timeout(12000)});
   if(!response.ok)fail(503,'บริการค้นหาสถานที่ไม่พร้อม กรุณาลองใหม่ภายหลัง หรือปักหมุดเอง');
   const body=await response.json();if(!Array.isArray(body.features))fail(503,'รูปแบบข้อมูลค้นหาไม่ถูกต้อง กรุณาลองใหม่ภายหลัง');
   const places=body.features.filter(f=>f.properties?.countrycode?.toUpperCase()==='TH').map(f=>{
    const t=f.properties,coordinates=f.geometry?.coordinates||[],osmType={N:'node',W:'way',R:'relation'}[t.osm_type];
    const kind=t.osm_value==='cafe'?'คาเฟ่':['restaurant','fast_food','food_court'].includes(t.osm_value)?'มื้ออาหาร':'เที่ยว';
    const category=t.osm_value==='cafe'?'cafe':['restaurant','fast_food','food_court'].includes(t.osm_value)?'food':['hotel','hostel','guest_house','motel'].includes(t.osm_value)?'hotel':t.osm_key==='shop'?'shopping':t.osm_key==='natural'||['park','nature_reserve','national_park'].includes(t.osm_value)?'nature':t.osm_key==='tourism'||t.osm_value==='place_of_worship'?'attraction':'custom';
    return {category,custom:true,name:(t.name||t.street||'สถานที่').slice(0,100),lat:coordinates[1],lng:coordinates[0],kind,type:kind+' · OpenStreetMap',image:2,address:[t.street,t.district,t.city,t.state].filter(Boolean).filter((v,i,a)=>a.indexOf(v)===i).join(' · '),sourceUrl:osmType&&/^\d+$/.test(String(t.osm_id))?'https://www.openstreetmap.org/'+osmType+'/'+t.osm_id:'https://www.openstreetmap.org/'};
   }).filter(s=>Number.isFinite(s.lat)&&Number.isFinite(s.lng)&&Math.abs(s.lat)<=90&&Math.abs(s.lng)<=180);
   const data={places};if(cache.size>=100)cache.delete(cache.keys().next().value);cache.set(key,{time:Date.now(),data});return data;
  }catch(error){if(error.status)throw error;if(error.name==='TimeoutError'||error.name==='AbortError')fail(504,'บริการค้นหาตอบช้าเกินไป ยังตรวจไม่ได้ว่ามีสถานที่นี้หรือไม่ กรุณาลองใหม่ภายหลัง หรือปักหมุดเอง');fail(503,'เชื่อมต่อบริการค้นหาไม่ได้ กรุณาลองใหม่ หรือปักหมุดเอง');}finally{busy=false;}
 };
}
module.exports={createPlaceSearch};
