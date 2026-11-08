/* Fetch only a small, settled viewport. No automatic retry loop. */
window.nearbyPlaces=[];
const discoveryBar=document.createElement('div');discoveryBar.className='discovery-bar';const discoveryStatus=document.createElement('span');discoveryStatus.setAttribute('role','status');const retryDiscovery=document.createElement('button');retryDiscovery.type='button';retryDiscovery.className='outline';retryDiscovery.textContent='โหลดหมุดบริเวณนี้';discoveryBar.append(discoveryStatus,retryDiscovery);$('w-map').before(discoveryBar);
let discoveryTimer,discoveryBusy=false,discoveryVersion=0,discoveryLast=0,discoveryPending=false;
const viewCache=new Map();
function viewportKey(){if(!wizard.map||wizard.map.getZoom()<14)return null;const b=wizard.map.getBounds();const coords=[b.getSouth(),b.getWest(),b.getNorth(),b.getEast()].map(v=>Number(v.toFixed(4)));if(coords[2]-coords[0]>.16||coords[3]-coords[1]>.16||coords[0]<5||coords[2]>21||coords[1]<97||coords[3]>106)return null;return coords.join(',');}
function scheduleDiscovery(){discoveryVersion++;clearTimeout(discoveryTimer);const key=viewportKey();if(!key){discoveryStatus.textContent='ซูมเข้าเพื่อแสดงร้านและสถานที่จริงในพื้นที่';return;}wMapMarkers();discoveryTimer=setTimeout(loadDiscovery,Math.max(1000,4500-(Date.now()-discoveryLast)));}
async function loadDiscovery(){
 const key=viewportKey();if(!key){discoveryStatus.textContent='กรุณาซูมเข้าอีกเพื่อโหลดสถานที่';return;}if(discoveryBusy){discoveryPending=true;return;}
 const version=discoveryVersion;let data=viewCache.get(key);discoveryBusy=true;discoveryPending=false;
 try{if(!data){discoveryLast=Date.now();discoveryStatus.textContent='กำลังโหลดสถานที่จริงในบริเวณนี้…';data=await api('/api/discovery?'+new URLSearchParams({bbox:key}),{signal:AbortSignal.timeout(26000)});if(viewCache.size>=40)viewCache.delete(viewCache.keys().next().value);viewCache.set(key,data);}
 if(version!==discoveryVersion)return;window.nearbyPlaces=data.places;wMapMarkers();discoveryStatus.textContent=data.places.length?`โหลด ${data.places.length} สถานที่จาก OpenStreetMap${data.truncated?' · ยังมีอีก ซูมเข้าเพื่อดูเพิ่ม':''}`:'ยังไม่พบสถานที่ที่มีชื่อในบริเวณนี้';
 }catch(error){if(version===discoveryVersion)discoveryStatus.textContent=error.name==='TimeoutError'?'โหลดหมุดใช้เวลานาน กดโหลดอีกครั้งภายหลัง':error.message;}
 finally{discoveryBusy=false;if(discoveryPending)scheduleDiscovery();}
}
retryDiscovery.onclick=()=>{clearTimeout(discoveryTimer);discoveryTimer=setTimeout(loadDiscovery,Math.max(0,4500-(Date.now()-discoveryLast)));};
function bindDiscovery(){if(!wizard.map||wizard.discoveryBound)return;wizard.discoveryBound=true;wizard.map.on('moveend',scheduleDiscovery);scheduleDiscovery();}
const discoveryEnsure=wEnsureMap;wEnsureMap=function(){discoveryEnsure();bindDiscovery();};bindDiscovery();
window.addEventListener('pagehide',()=>{clearTimeout(discoveryTimer);discoveryVersion++;wizard.map?.off('moveend',scheduleDiscovery);},{once:true});
