function createRouter(fetchImpl=fetch){
 const cache=new Map();
 return async stops=>{
  const coordinates=stops.map(s=>`${s.lng},${s.lat}`).join(';');
  const cached=cache.get(coordinates);if(cached&&Date.now()-cached.time<3600000)return cached.data;
  try{
   const response=await fetchImpl(`${(process.env.OSRM_URL||'https://router.project-osrm.org').replace(/\/$/,'')}/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=false`,{signal:AbortSignal.timeout(12000),headers:{'User-Agent':'RoamTripPlanner/1.0 (local development prototype)'}});
   if(!response.ok)throw Error('upstream');const payload=await response.json();const r=payload.routes?.[0];
   if(payload.code!=='Ok'||!r||!Array.isArray(r.geometry?.coordinates)||r.geometry.coordinates.length<2||!Number.isFinite(r.distance)||!Number.isFinite(r.duration))throw Error('invalid route');
   const data={mode:'road',points:r.geometry.coordinates.map(([lng,lat])=>[lat,lng]),distanceKm:(r.distance/1000).toFixed(1),minutes:Math.round(r.duration/60),waypoints:payload.waypoints?.map(w=>({point:[w.location[1],w.location[0]],distance:w.distance}))||[],legs:r.legs.map(l=>({distance:l.distance,duration:l.duration}))};
   if(cache.size>=100)cache.delete(cache.keys().next().value);cache.set(coordinates,{time:Date.now(),data});return data;
  }catch{const error=Error('บริการเส้นทางถนนไม่พร้อม กรุณาลองใหม่ ไม่แสดงเส้นทางสมมติแทน');error.status=502;throw error;}
 };
}
module.exports={createRouter};
