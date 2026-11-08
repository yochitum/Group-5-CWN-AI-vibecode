/* Loaded after the wizard: search occurs only on explicit submission. */
const placeSearch=document.createElement('form');placeSearch.className='google-place-search';
placeSearch.innerHTML='<label for="google-query">ค้นหาสถานที่จริงจาก Google Maps</label><div><input id="google-query" maxlength="150" placeholder="เช่น วัด คาเฟ่ หรือชื่อร้าน" required><button class="primary" type="submit">ค้นหา</button></div><p role="status" id="google-search-status">ค้นหาในจังหวัดที่เลือก แล้วกดหมุดหรือการ์ดเพื่อเพิ่มลงทริป</p><div id="google-results"></div>';
$('w-map-area').prepend(placeSearch);
let googleResults=[],googleSearchVersion=0;
wMapMarkers=function(){
 if(!wizard.map?.googleMap)return;
 wizard.googleMarkers?.forEach(m=>m.map=null);
 const items=new Map([...wCatalog(),...wizard.custom,...googleResults,...wizard.chosen.values()].map(s=>[wKey(s),s]));
 wizard.googleMarkers=[...items.values()].filter(s=>wizard.step!==2||wFood(s)).map(s=>TripGoogle.marker(wizard.map.googleMap,s,wizard.chosen.has(wKey(s))?'✓':'+',()=>{
  if(['start','end'].includes(wizard.mode)){wizard[wizard.mode]=s;wizard.mode='select';wAnchors();wMapMarkers();}
  else if(wizard.mode!=='custom')wToggle(s);
 }));
 for(const [label,s] of [['เริ่ม',wizard.start],['จบ',wizard.end]])if(s)wizard.googleMarkers.push(TripGoogle.marker(wizard.map.googleMap,s,label));
};
wEnsureMap=async function(){
 try{
  if(!wizard.map){
   if(wizard.googleLoading)return;
   wizard.googleLoading=true;
   const map=await TripGoogle.create('w-map');
   wizard.map={googleMap:map,invalidateSize(){},fitBounds(points){TripGoogle.fit(map,points.map(([lat,lng])=>({lat,lng})));}};
   wizard.map.fitBounds(wCatalog().map(s=>[s.lat,s.lng]));
   map.addListener('click',event=>{
    if(!event.latLng)return;const lat=event.latLng.lat(),lng=event.latLng.lng();
    if(wizard.mode==='custom'){$('w-lat').value=lat.toFixed(6);$('w-lng').value=lng.toFixed(6);}
    else if(['start','end'].includes(wizard.mode)){wizard[wizard.mode]={custom:true,kind:'พักผ่อน',name:wizard.mode==='start'?'จุดเริ่มต้นที่ปักหมุด':'ที่พัก / จุดจบที่ปักหมุด',type:'พักผ่อน · เพิ่มเอง',lat,lng,image:0};wAnchors();}else return;
    wizard.mode='select';$('w-map-message').textContent='บันทึกพิกัดแล้ว';wMapMarkers();
   });
  }
  wMapMarkers();$('w-map-message').textContent='Google Maps · เลือกสถานที่หรือค้นหาด้านบน';
 }catch(error){$('w-map-message').textContent=error.message;}finally{wizard.googleLoading=false;}
};
placeSearch.addEventListener('submit',async event=>{
 event.preventDefault();const query=$('google-query').value.trim();if(!query)return;
 const version=++googleSearchVersion,province=$('w-province').value,step=wizard.step;
 const button=placeSearch.querySelector('button');button.disabled=true;$('google-search-status').textContent='กำลังค้นหาสถานที่…';
 try{
  await wEnsureMap();if(!wizard.map?.googleMap)throw Error($('w-map-message').textContent);
  const {Place}=await google.maps.importLibrary('places');
  const {places}=await Place.searchByText({textQuery:query+' '+province+' ประเทศไทย',fields:['id','displayName','location','types','googleMapsURI'],language:'th',region:'th',maxResultCount:12});
  if(version!==googleSearchVersion||province!==$('w-province').value||step!==wizard.step)return;
  googleResults=places.filter(p=>p.location).map(p=>{const kind=p.types?.includes('cafe')?'คาเฟ่':p.types?.some(t=>['restaurant','food','bakery'].includes(t))?'มื้ออาหาร':'เที่ยว';return {custom:true,googlePlaceId:p.id,name:p.displayName,lat:p.location.lat(),lng:p.location.lng(),kind,type:kind+' · Google Maps',image:2,googleMapsURI:p.googleMapsURI};});
  const container=$('google-results');container.replaceChildren();
  googleResults.forEach(s=>{const row=document.createElement('div');const select=document.createElement('button');select.type='button';select.className='outline';select.textContent='＋ '+s.name;select.onclick=()=>{wToggle(s);select.textContent=(wizard.chosen.has(wKey(s))?'✓ ':'＋ ')+s.name;};const link=document.createElement('a');link.textContent='ดูใน Google Maps ↗';link.href=s.googleMapsURI||'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(s.name)+'&query_place_id='+encodeURIComponent(s.googlePlaceId);link.target='_blank';link.rel='noopener';row.append(select,link);container.append(row);});
  $('google-search-status').textContent=googleResults.length?`พบ ${googleResults.length} สถานที่ · ผลค้นหาจาก Google Maps · ตรวจจังหวัดและตำแหน่งก่อนเลือก`:'ไม่พบสถานที่ ลองเปลี่ยนคำค้น';
  wMapMarkers();TripGoogle.fit(wizard.map.googleMap,googleResults);
 }catch(error){if(version===googleSearchVersion)$('google-search-status').textContent='ค้นหาไม่ได้: '+error.message;}finally{button.disabled=false;}
});
$('w-province').addEventListener('change',()=>{googleSearchVersion++;googleResults=[];$('google-results').replaceChildren();$('google-search-status').textContent='ค้นหาในจังหวัดที่เลือก';wMapMarkers();});
document.addEventListener('trip-google-auth-error',()=>{$('w-map-message').textContent='Google Maps ไม่อนุญาตให้ใช้คีย์นี้ ตรวจการตั้งค่าใน GOOGLE-MAPS.md';});
