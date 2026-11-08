/* Category markers and popups reuse wizard state and Leaflet. */
const mapCategories={attraction:['🏯','ที่เที่ยว'],food:['🍜','ร้านอาหาร'],hotel:['🏨','ที่พัก'],cafe:['☕','คาเฟ่'],shopping:['🛍️','ช้อปปิ้ง'],nature:['🌿','ธรรมชาติ'],custom:['📍','สถานที่อื่น']};
function placeCategory(s){if(mapCategories[s.category])return s.category;const type=s.kind||s.type||'';if(/คาเฟ่/.test(type))return 'cafe';if(/อาหาร|ตลาด/.test(type))return 'food';if(/พัก|โรงแรม/.test(type))return 'hotel';if(/ช้อป/.test(type))return 'shopping';if(/ธรรมชาติ|ภูเขา|สวน/.test(type))return 'nature';return s.custom?'custom':'attraction';}
let activeMapCategory='all';
const categoryBar=document.createElement('div');categoryBar.className='map-category-bar';categoryBar.setAttribute('aria-label','กรองหมวดสถานที่');
for(const [key,label] of [['all','ทั้งหมด'],...Object.entries(mapCategories).map(([k,v])=>[k,v.join(' ')])]){const b=document.createElement('button');b.type='button';b.textContent=label;b.setAttribute('aria-pressed',String(key==='all'));b.onclick=()=>{activeMapCategory=key;categoryBar.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));wMapMarkers();};categoryBar.append(b);}
$('w-map').before(categoryBar);
function placePopup(s){
 const root=document.createElement('div');root.className='place-popup';
 const title=document.createElement('strong'),info=document.createElement('p'),coords=document.createElement('small');title.textContent=s.name;info.textContent=mapCategories[placeCategory(s)].join(' ')+' · '+(s.address||'ยังไม่มีข้อมูลที่อยู่');coords.textContent=`พิกัด ${s.lat.toFixed(6)}, ${s.lng.toFixed(6)}`;root.append(title,info,coords);
 if(s.photo){const img=document.createElement('img');img.src=s.photo;img.alt='รูปที่เพิ่มของ '+s.name;root.prepend(img);}
 const add=document.createElement('button');add.type='button';add.className='primary';add.textContent=wizard.chosen.has(wKey(s))?'นำออกจากแผน':'เพิ่มลงแผนเที่ยว';add.onclick=()=>{wToggle(s);if(wizard.chosen.has(wKey(s)))savePlaceHistory(s);};root.append(add);
 if(s.sourceUrl?.startsWith('https://www.openstreetmap.org/')){const link=document.createElement('a');link.textContent='ดูรายละเอียด ↗';link.href=s.sourceUrl;link.target='_blank';link.rel='noopener';root.append(link);}
 return root;
}
wMapMarkers=function(){
 osmRenderResults();if(!wizard.map)return;wizard.layers.clearLayers();
 const items=[...new Map([...(window.nearbyPlaces||[]),...wCatalog(),...wizard.custom,...osmResults,...wizard.chosen.values()].map(s=>[wKey(s),s])).values()].filter(s=>(activeMapCategory==='all'||placeCategory(s)===activeMapCategory));
 const labelCells=new Set();
 const groups=new Map();for(const s of items){if(!wizard.map.getBounds().pad(.05).contains([s.lat,s.lng]))continue;const pixel=wizard.map.project([s.lat,s.lng],wizard.map.getZoom());const key=wizard.map.getZoom()<16?Math.floor(pixel.x/55)+','+Math.floor(pixel.y/55):wKey(s);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(s);}
 const ordered=[...wizard.chosen.keys()];
 for(const group of groups.values()){
  const s=group[0],content=document.createElement('span');content.className='category-pin';
  if(group.length>1){content.classList.add('cluster-pin');content.textContent=group.length;const lat=group.reduce((sum,x)=>sum+x.lat,0)/group.length,lng=group.reduce((sum,x)=>sum+x.lng,0)/group.length;L.marker([lat,lng],{icon:L.divIcon({className:'category-marker',html:content,iconSize:[38,38],iconAnchor:[19,19]})}).addTo(wizard.layers).on('click',()=>wizard.map.setView([lat,lng],wizard.map.getZoom()+2));continue;}
  const selected=ordered.indexOf(wKey(s));content.textContent=selected>=0?String(selected+1):mapCategories[placeCategory(s)][0];content.classList.toggle('selected',selected>=0);
  const marker=L.marker([s.lat,s.lng],{title:s.name,icon:L.divIcon({className:'category-marker',html:content,iconSize:[38,38],iconAnchor:[19,19]})}).addTo(wizard.layers);
  if(wizard.map.getZoom()>=16){const point=wizard.map.latLngToContainerPoint([s.lat,s.lng]);const cell=Math.floor(point.x/160)+','+Math.floor(point.y/36);if(!labelCells.has(cell)){labelCells.add(cell);const label=document.createElement('span');label.textContent=s.name;marker.bindTooltip(label,{permanent:true,direction:'right',offset:[18,0],className:'poi-name'});}}
  marker.bindPopup(()=>placePopup(s),{maxWidth:280}).on('click',()=>{if(['start','end'].includes(wizard.mode)){wizard[wizard.mode]=s;wizard.mode='select';wAnchors();wMapMarkers();}else if(wizard.mode==='custom'){$('w-lat').value=s.lat;$('w-lng').value=s.lng;wizard.mode='select';}});
 }
 for(const [label,s] of [['เริ่ม',wizard.start],['จบ',wizard.end]])if(s){const tip=document.createElement('span');tip.textContent=label+' · '+s.name;L.marker([s.lat,s.lng]).addTo(wizard.layers).bindTooltip(tip).bindPopup(()=>placePopup(s));}
};
const ensureOriginalMap=wEnsureMap;
wEnsureMap=function(){ensureOriginalMap();if(wizard.map&&!wizard.mapEnhanced){wizard.mapEnhanced=true;enableMapPinCreation();wizard.map.on('zoomend',wMapMarkers);const resize=new ResizeObserver(()=>wizard.map.invalidateSize({pan:false}));resize.observe($('w-map'));window.addEventListener('pagehide',()=>resize.disconnect(),{once:true});wizard.map.stop();wizard.map.setView([15.87,100.99],6,{animate:false});setTimeout(()=>{if(wizard.step===0){wizard.map.stop();wizard.map.setView([15.87,100.99],6,{animate:false});}},100);}};
// Keep the five-step flow; show a Thailand overview even on the initial step.
const originalStep=wStep;
wStep=function(step){originalStep(step);if(step===0){$('w-map-area').hidden=false;$('w-custom').hidden=true;wEnsureMap();}};
const optimization=document.createElement('p');optimization.className='wizard-note';optimization.textContent='จัดกลุ่มจุดแวะตามระยะใกล้โดยประมาณ แล้วปรับลำดับเองได้ · ยังไม่มีการหาลำดับที่ดีที่สุดตามถนน';$('w-review').after(optimization);
const optButton=document.createElement('button');optButton.type='button';optButton.disabled=true;optButton.textContent='จัดลำดับตามถนนอัตโนมัติ (ยังไม่รองรับ)';optButton.title='ตัวเชื่อมต่อ OSRM ปัจจุบันคำนวณเส้นทางตามลำดับที่เลือก';optimization.append(document.createElement('br'),optButton);

// Catalog may finish loading before this enhancement script arrives.
if(Object.keys(presets).length)wStep(wizard.step);

function enableMapPinCreation(){
 let clickMode='select';
 wizard.map.on('preclick',()=>{clickMode=wizard.mode;});
 wizard.map.on('click',event=>{
  if(clickMode!=='select')return;
  const {lat,lng}=event.latlng;
  const form=document.createElement('form');form.className='place-popup pin-create-form';
  const title=document.createElement('strong');title.textContent='เพิ่มสถานที่ตรงนี้';
  const nameLabel=document.createElement('label');nameLabel.textContent='ชื่อสถานที่';
  const input=document.createElement('input');input.required=true;input.maxLength=100;input.placeholder='เช่น จุดนัดพบ หรือร้านที่อยากไป';input.setAttribute('aria-label','ชื่อสถานที่ใหม่');nameLabel.append(input);
  const categoryLabel=document.createElement('label');categoryLabel.textContent='ประเภท';const select=document.createElement('select');select.setAttribute('aria-label','ประเภทสถานที่ใหม่');for(const [key,[icon,label]] of Object.entries(mapCategories)){const option=document.createElement('option');option.value=key;option.textContent=icon+' '+label;select.append(option);}select.value='custom';categoryLabel.append(select);
  const coords=document.createElement('small');coords.textContent='พิกัดที่คุณปัก: '+lat.toFixed(6)+', '+lng.toFixed(6);
  const add=document.createElement('button');add.type='submit';add.className='primary';add.textContent='เพิ่มหมุดลงแผนเที่ยว';
  form.append(title,nameLabel,categoryLabel,coords,add);
  L.DomEvent.disableClickPropagation(form);L.DomEvent.disableScrollPropagation(form);
  const popup=L.popup({maxWidth:300}).setLatLng(event.latlng).setContent(form).openOn(wizard.map);
  form.onsubmit=event=>{event.preventDefault();const name=input.value.trim();if(!name){input.setCustomValidity('กรุณาระบุชื่อสถานที่');input.reportValidity();return;}input.setCustomValidity('');if(wizard.chosen.size>=Number($('w-days').value)*6){toast('จุดแวะเต็มแล้ว ลองเพิ่มวันหรือลดสถานที่ก่อน');return;}
   const category=select.value,kind={food:'มื้ออาหาร',cafe:'คาเฟ่',hotel:'พักผ่อน',shopping:'ช้อปปิ้ง',nature:'เที่ยว',attraction:'เที่ยว',custom:'เที่ยว'}[category];
   const stop={custom:true,name,lat,lng,category,kind,type:kind+' · ปักหมุดเอง',image:2,priority:'must'};
   if(!wizard.custom.some(s=>wKey(s)===wKey(stop)))wizard.custom.push(stop);wizard.chosen.set(wKey(stop),stop);activeMapCategory='all';categoryBar.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===0)));wizard.map.closePopup(popup);wRenderChoices();toast('เพิ่มหมุดลงแผนแล้ว');
  };
  input.oninput=()=>input.setCustomValidity('');
 });
}
