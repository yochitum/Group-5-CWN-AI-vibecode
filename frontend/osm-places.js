const osmSearch=document.createElement('form');osmSearch.className='google-place-search';
osmSearch.innerHTML='<label for="osm-query">ค้นหาสถานที่จริงจาก OpenStreetMap</label><div><input id="osm-query" minlength="2" maxlength="100" placeholder="ชื่อสถานที่ เช่น วัดพระสิงห์ หรือชื่อร้าน" required><button class="primary" type="submit">ค้นหา</button></div><p id="osm-status" role="status">ค้นหาด้วยชื่อไทยหรืออังกฤษ หากไม่พบสามารถปักหมุดเองได้</p><div id="osm-results"></div><small>ข้อมูล © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a> · ค้นหาผ่าน Photon</small>';
$('w-map-area').prepend(osmSearch);
let osmResults=[],osmVersion=0;
let savePlaceHistory=()=>{};
function osmRenderResults(){
 const container=$('osm-results');container.replaceChildren();
 osmResults.forEach(s=>{const row=document.createElement('div'),button=document.createElement('button'),link=document.createElement('a');button.type='button';button.className='outline';button.textContent=(wizard.chosen.has(wKey(s))?'✓ ':'＋ ')+s.name;button.onclick=()=>{wToggle(s);if(wizard.chosen.has(wKey(s)))savePlaceHistory(s);};link.href=s.sourceUrl;link.textContent='ดูตำแหน่งใน OpenStreetMap ↗';link.target='_blank';link.rel='noopener';const address=document.createElement("small");address.textContent=s.address||s.type;row.append(button,address,link);container.append(row);});
}
wMapMarkers=function(){
 osmRenderResults();if(!wizard.map)return;wizard.layers.clearLayers();
 const items=new Map([...wCatalog(),...wizard.custom,...osmResults,...wizard.chosen.values()].map(s=>[wKey(s),s]));
 [...items.values()].filter(s=>wizard.step!==2||wFood(s)||osmResults.includes(s)).forEach(s=>{
 const marker=L.circleMarker([s.lat,s.lng],{radius:9,color:wizard.chosen.has(wKey(s))?'#fa541c':'#52644c',fillOpacity:.9}).addTo(wizard.layers);
 const label=document.createElement('span');label.textContent=s.name;marker.bindTooltip(label).on('click',()=>{if(['start','end'].includes(wizard.mode)){wizard[wizard.mode]=s;wizard.mode='select';wAnchors();wMapMarkers();}else if(wizard.mode!=='custom')wToggle(s);});
 });
 for(const [label,s] of [['เริ่ม',wizard.start],['จบ',wizard.end]])if(s){const text=document.createElement('span');text.textContent=label+' · '+s.name;L.marker([s.lat,s.lng]).addTo(wizard.layers).bindTooltip(text);}
};

const searchInput=$('osm-query'),suggestions=document.createElement('div');
suggestions.id='place-suggestions';suggestions.setAttribute('role','listbox');suggestions.setAttribute('aria-label','สถานที่แนะนำ');suggestions.hidden=true;
searchInput.parentElement.classList.add('place-search-field');searchInput.parentElement.append(suggestions);
searchInput.setAttribute('role','combobox');searchInput.setAttribute('aria-autocomplete','list');searchInput.setAttribute('aria-controls',suggestions.id);searchInput.setAttribute('aria-expanded','false');searchInput.autocomplete='off';
let history=[];try{const saved=JSON.parse(localStorage.getItem('trip-place-history')||'[]');if(Array.isArray(saved))history=saved.filter(s=>typeof s.name==='string'&&typeof s.province==='string'&&Number.isFinite(s.lat)&&Number.isFinite(s.lng)&&typeof s.sourceUrl==='string'&&s.sourceUrl.startsWith('https://www.openstreetmap.org/')).slice(0,8);}catch{}
savePlaceHistory=s=>{history=[{...s,province:$('w-province').value},...history.filter(h=>wKey(h)!==wKey(s))].slice(0,8);try{localStorage.setItem('trip-place-history',JSON.stringify(history));}catch{}};
let suggestionItems=[],activeSuggestion=-1,timer,busy=false,lastRequest=0,pending=false;
function closeSuggestions(){suggestions.hidden=true;searchInput.setAttribute('aria-expanded','false');searchInput.removeAttribute('aria-activedescendant');activeSuggestion=-1;}
function selectSuggestion(s){clearTimeout(timer);osmVersion++;pending=false;searchInput.value=s.name;osmResults=[s];closeSuggestions();wMapMarkers();if(wizard.map)wizard.map.setView([s.lat,s.lng],16);savePlaceHistory(s);$('osm-status').textContent='พบตำแหน่งแล้ว ตรวจสอบที่อยู่และกด ＋ เพื่อเพิ่มลงทริป';}
function showSuggestions(items){suggestionItems=items;activeSuggestion=-1;suggestions.replaceChildren();items.forEach((s,i)=>{const row=document.createElement('div');row.id='place-option-'+i;row.setAttribute('role','option');row.setAttribute('aria-selected','false');const name=document.createElement('strong'),address=document.createElement('small');name.textContent=(s.province?'◷ ':'⌖ ')+s.name;address.textContent=s.address||s.type;row.append(name,address);row.addEventListener('pointerdown',e=>e.preventDefault());row.onclick=()=>selectSuggestion(s);suggestions.append(row);});suggestions.hidden=!items.length;searchInput.setAttribute('aria-expanded',String(!!items.length));searchInput.removeAttribute('aria-activedescendant');}
function localSuggestions(){const q=searchInput.value.trim().toLowerCase();return history.filter(s=>s.province===$('w-province').value&&s.name.toLowerCase().includes(q));}
function scheduleSearch(){clearTimeout(timer);if(searchInput.value.trim().length<2)return;timer=setTimeout(runSearch,Math.max(700,1600-(Date.now()-lastRequest)));}
async function runSearch(){
 if(busy){pending=true;return;}const query=searchInput.value.trim();if(query.length<2)return;
 const version=osmVersion,province=$('w-province').value;busy=true;pending=false;lastRequest=Date.now();$('osm-status').textContent='กำลังค้นหาสถานที่…';
 try{const data=await api('/api/places?'+new URLSearchParams({q:query,province}),{signal:AbortSignal.timeout(15000)});if(version!==osmVersion)return;osmResults=data.places;wMapMarkers();const unique=new Map([...localSuggestions(),...osmResults].map(s=>[wKey(s),s]));if(document.activeElement===searchInput)showSuggestions([...unique.values()].slice(0,8));$('osm-status').textContent=osmResults.length?'เลือกคำแนะนำเพื่อดูหมุด หรือกด ＋ ในการ์ดเพื่อเพิ่มลงทริป':'ไม่พบชื่อนี้ ลองชื่ออาคาร ถนน หรือปักหมุดเอง';}
 catch(error){if(version===osmVersion)$('osm-status').textContent=['TimeoutError','AbortError'].includes(error.name)?'บริการค้นหาตอบช้า ลองอีกครั้ง หรือเลือกจากประวัติ':error.message;}
 finally{busy=false;if(pending)scheduleSearch();}
}
searchInput.addEventListener('input',()=>{osmVersion++;osmResults=[];wMapMarkers();showSuggestions(localSuggestions());if(!searchInput.value.trim())$('osm-status').textContent='ประวัติสถานที่ที่เคยเลือก · พิมพ์อย่างน้อย 2 ตัวอักษร';scheduleSearch();});
searchInput.addEventListener('focus',()=>showSuggestions(localSuggestions().length?localSuggestions():osmResults.slice(0,8)));
searchInput.addEventListener('keydown',event=>{if(event.key==='Escape'){clearTimeout(timer);osmVersion++;pending=false;closeSuggestions();return;}if(!suggestions.hidden&&['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();activeSuggestion=(activeSuggestion+(event.key==='ArrowDown'?1:-1)+suggestionItems.length)%suggestionItems.length;[...suggestions.children].forEach((el,i)=>el.setAttribute('aria-selected',String(i===activeSuggestion)));searchInput.setAttribute('aria-activedescendant','place-option-'+activeSuggestion);suggestions.children[activeSuggestion].scrollIntoView({block:'nearest'});}else if(event.key==='Enter'&&!suggestions.hidden&&activeSuggestion>=0){event.preventDefault();selectSuggestion(suggestionItems[activeSuggestion]);}});
searchInput.addEventListener('blur',closeSuggestions);
document.addEventListener('pointerdown',event=>{if(!osmSearch.contains(event.target))closeSuggestions();});
osmSearch.addEventListener('submit',event=>{event.preventDefault();clearTimeout(timer);scheduleSearch();});
$('w-province').addEventListener('change',()=>{clearTimeout(timer);osmVersion++;pending=false;osmResults=[];searchInput.value='';closeSuggestions();wMapMarkers();$('osm-status').textContent='พิมพ์อย่างน้อย 2 ตัวอักษรเพื่อค้นหาในจังหวัดที่เลือก';});
