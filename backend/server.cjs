const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
// Resolve from this file so starting from another directory also works.
const envFile=path.resolve(__dirname,'../.env');
if(fs.existsSync(envFile))process.loadEnvFile(envFile);
const {randomUUID} = require('node:crypto');
const catalog = require('./catalog.cjs');
const frontend = path.resolve(__dirname, '../frontend');
const aliases = {'กรุงเทพ':'กรุงเทพมหานคร','กรุงเทพฯ':'กรุงเทพมหานคร'};
function invalid(message){const error=new Error(message);error.status=400;throw error;}
function validateInput(input){
 if(!input||typeof input!=='object')invalid('ข้อมูลไม่ถูกต้อง');
 input.destination=aliases[input.destination]||input.destination;
 if(!Object.hasOwn(catalog,input.destination))invalid('Mockup มีทริปเชียงใหม่ ภูเก็ต และกรุงเทพฯ · ทั่วไทยจะรองรับเมื่อเชื่อม AI จริง');
 if(!Number.isInteger(input.days)||input.days<1||input.days>4)invalid('จำนวนวันต้องอยู่ระหว่าง 1–4 วัน');
 if(!Number.isFinite(input.budget)||input.budget<500||input.budget>100000)invalid('งบต้องอยู่ระหว่าง 500–100,000 บาท');
 if(typeof input.origin!=='string'||input.origin.length<1||input.origin.length>60)invalid('กรุณาระบุจุดเริ่มต้น');
 if(!Array.isArray(input.interests)||input.interests.length>4||input.interests.some(v=>typeof v!=='string'||v.length>50))invalid('รูปแบบความสนใจไม่ถูกต้อง');
 const invitation={};
 if(input.invitation!==undefined){
  if(!input.invitation||typeof input.invitation!=='object'||Array.isArray(input.invitation))invalid('ข้อมูลคำชวนไม่ถูกต้อง');
  for(const [key,max] of [['meeting',200],['message',600]])if(input.invitation[key]!==undefined){if(typeof input.invitation[key]!=='string'||input.invitation[key].length>max)invalid('ข้อความคำชวนยาวเกินไป');invitation[key]=input.invitation[key];}
  if(input.invitation.date!==undefined){if(typeof input.invitation.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(input.invitation.date)||Number.isNaN(Date.parse(input.invitation.date)))invalid('วันเดินทางไม่ถูกต้อง');invitation.date=input.invitation.date;}
  if(input.invitation.people!==undefined){if(!Number.isInteger(input.invitation.people)||input.invitation.people<1||input.invitation.people>100)invalid('จำนวนคนต้องเป็น 1–100');invitation.people=input.invitation.people;}
 }
 return {destination:input.destination,origin:input.origin,days:input.days,budget:input.budget,interests:input.interests,...(input.invitation?{invitation}:{})};
}
function validateStops(stops,min=0,max=8){
 if(!Array.isArray(stops)||stops.length<min||stops.length>max)invalid('จำนวนจุดแวะไม่ถูกต้อง');
 const known=Object.values(catalog).flat();
 return stops.map(stop=>{
  if(!stop||typeof stop!=='object')invalid('ข้อมูลจุดแวะไม่ถูกต้อง');
  let found=known.find(s=>s.name===stop.name&&s.lat===stop.lat&&s.lng===stop.lng);
  if(stop.custom===true){
   if(typeof stop.name!=='string'||!stop.name.trim()||stop.name.length>100)invalid('ชื่อสถานที่ไม่ถูกต้อง');
   if(!Number.isFinite(stop.lat)||Math.abs(stop.lat)>90||!Number.isFinite(stop.lng)||Math.abs(stop.lng)>180)invalid('พิกัดสถานที่ไม่ถูกต้อง');
   if(!['มื้ออาหาร','คาเฟ่','ช้อปปิ้ง','เที่ยว','พักผ่อน'].includes(stop.kind))invalid('ประเภทจุดแวะไม่ถูกต้อง');
   found={custom:true,name:stop.name.trim(),kind:stop.kind,type:stop.kind+' · เพิ่มเอง',lat:stop.lat,lng:stop.lng,image:2};
  }
  if(!found)invalid('สถานที่ไม่อยู่ในข้อมูลตัวอย่าง');
  if(stop.photo!==undefined&&(typeof stop.photo!=='string'||stop.photo.length>200000||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(stop.photo)))invalid('รูปภาพไม่ถูกต้องหรือมีขนาดใหญ่เกินไป');
  const details={};
  if(stop.details!==undefined){
   if(!stop.details||typeof stop.details!=='object'||Array.isArray(stop.details))invalid('รายละเอียดไม่ถูกต้อง');
   for(const key of ['eat','buy','explore','notes'])if(stop.details[key]!==undefined){if(typeof stop.details[key]!=='string'||stop.details[key].length>600)invalid('รายละเอียดต้องไม่เกิน 600 ตัวอักษร');details[key]=stop.details[key].trim();}
   if(stop.details.arrival!==undefined){if(typeof stop.details.arrival!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(stop.details.arrival))invalid('เวลาไม่ถูกต้อง');details.arrival=stop.details.arrival;}
   for(const [key,min,max] of [['duration',1,1440],['cost',0,1000000]])if(stop.details[key]!==undefined){if(!Number.isFinite(stop.details[key])||stop.details[key]<min||stop.details[key]>max)invalid('เวลาหรืองบไม่ถูกต้อง');details[key]=stop.details[key];}
  }
  if(stop.stopId!==undefined&&(typeof stop.stopId!=='string'||stop.stopId.length>100))invalid('รหัสจุดแวะไม่ถูกต้อง');
  for(const [key,max] of [["address",500],["category",30],["sourceUrl",300]])if(typeof stop[key]==="string"&&stop[key].length<=max&&(key!=="sourceUrl"||stop[key].startsWith("https://www.openstreetmap.org/")))found={...found,[key]:stop[key]};
  return {...found,details,...(stop.stopId?{stopId:stop.stopId}:{}),...(stop.photo?{photo:stop.photo}:{}),...(stop.priority==='must'||stop.priority==='optional'?{priority:stop.priority}:{}),...(['start','end'].includes(stop.anchor)?{anchor:stop.anchor}:{})};
 });
}
async function readBody(req){let text='';for await(const chunk of req){text+=chunk;if(Buffer.byteLength(text)>8000000){const error=Error('ข้อมูลมีขนาดใหญ่เกินไป');error.status=413;throw error;}}try{return JSON.parse(text);}catch{invalid('JSON ไม่ถูกต้อง');}}
function validateFeedback(items,days){
 if(items===undefined)return [];if(!Array.isArray(items)||items.length>100)invalid('ข้อเสนอมากเกินไป');
 return items.map(p=>{if(!p||!['add','move','comment'].includes(p.action)||!['pending','accepted','rejected'].includes(p.status))invalid('รูปแบบ Feedback ไม่ถูกต้อง');
 const clean={};for(const [key,max] of [['id',100],['author',60],['message',1000]]){if(typeof p[key]!=='string'||!p[key].trim()||p[key].length>max)invalid('ข้อมูลผู้เสนอหรือข้อความไม่ถูกต้อง');clean[key]=p[key];}
 if(!Number.isInteger(p.targetDay)||p.targetDay<0||p.targetDay>=days)invalid('วันในข้อเสนอไม่ถูกต้อง');Object.assign(clean,{action:p.action,status:p.status,targetDay:p.targetDay});
 for(const key of ['createdAt','decidedAt'])if(Number.isFinite(p[key]))clean[key]=p[key];
 if(p.action==='add')clean.stop=validateStops([p.stop],1,1)[0];
 if(p.action==='move'){if(!Number.isInteger(p.sourceDay)||p.sourceDay<0||p.sourceDay>=days||typeof p.stopId!=='string'||p.stopId.length>100||typeof p.stopName!=='string'||p.stopName.length>100)invalid('ข้อมูลย้ายวันไม่ถูกต้อง');Object.assign(clean,{sourceDay:p.sourceDay,stopId:p.stopId,stopName:p.stopName});}
 return clean;});
}
function buildPlan(input){const clean=validateInput(input);if(input.selected!==undefined){const result=require('./selected-plan.cjs').arrangeSelected({...input,...clean},validateStops,invalid);return {...clean,...result,mode:'selected'};}const ranked=[...catalog[clean.destination]].sort((a,b)=>score(b)-score(a));function score(stop){return clean.interests.filter(interest=>stop.type.includes(interest.slice(2).trim())).length;}
 const count=clean.budget/clean.days<1000?3:4;
 return {...clean,mode:'mock',plans:Array.from({length:clean.days},(_,i)=>Array.from({length:count},(_,j)=>({...ranked[(i*2+j)%ranked.length]})))};
}
const {createRouter}=require('./routing.cjs');
function createServer({dataFile=path.join(__dirname,'data/trips.json'),routeFetch=fetch,allowTestReset=false,now=()=>Date.now()}={}){
 if(allowTestReset&&path.resolve(dataFile)===path.join(__dirname,'data/trips.json'))throw Error('Test reset requires a separate data file');
 let testNow=null;
 const buildRoute=createRouter(routeFetch);
 const searchPlaces=require('./places.cjs').createPlaceSearch();
 const discoverPlaces=require('./discovery.cjs').createDiscovery();
 function readTrips(){try{return JSON.parse(fs.readFileSync(dataFile,'utf8'));}catch(error){if(error.code==='ENOENT')return [];throw error;}}
 function send(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));}
 return http.createServer(async(req,res)=>{try{
  const url=new URL(req.url,'http://localhost');
  if(req.method==='POST'&&url.pathname==='/api/test/reset'&&allowTestReset){
   const body=await readBody(req),value=body.now||'2026-11-07T09:00:00+07:00';
   if(typeof value!=='string'||!Number.isFinite(Date.parse(value)))invalid('Invalid test clock');
   testNow=Date.parse(value);fs.mkdirSync(path.dirname(dataFile),{recursive:true});
   fs.writeFileSync(dataFile+'.tmp','[]','utf8');fs.renameSync(dataFile+'.tmp',dataFile);
   return send(res,200,{ok:true,now:new Date(testNow).toISOString()});
  }
  if(req.method==='GET'&&url.pathname==='/api/discovery')return send(res,200,await discoverPlaces(url.searchParams.get('bbox')));
  if(req.method==='GET'&&url.pathname==='/api/places')return send(res,200,await searchPlaces(url.searchParams.get('q'),url.searchParams.get('province')));
  if(req.method==='GET'&&url.pathname==='/api/health')return send(res,200,{ok:true,mode:'mock'});
  if(req.method==='GET'&&url.pathname==='/api/catalog')return send(res,200,catalog);
  if(req.method==='POST'&&url.pathname==='/api/plan')return send(res,200,buildPlan(await readBody(req)));
  if(req.method==='POST'&&url.pathname==='/api/route')return send(res,200,await buildRoute(validateStops((await readBody(req)).stops,2)));
  if(req.method==='GET'&&url.pathname==='/api/trips')return send(res,200,readTrips());
  if(req.method==='DELETE'&&url.pathname.startsWith('/api/trips/')){const id=url.pathname.slice('/api/trips/'.length),trips=readTrips(),remaining=trips.filter(t=>t.id!==id);if(remaining.length===trips.length)return send(res,404,{error:'ไม่พบทริป'});fs.writeFileSync(dataFile+'.tmp',JSON.stringify(remaining,null,2),'utf8');fs.renameSync(dataFile+'.tmp',dataFile);return send(res,200,{ok:true});}
  if(req.method==='POST'&&url.pathname==='/api/trips'){
   const body=await readBody(req),clean=validateInput(body);if(!Array.isArray(body.plans)||body.plans.length!==clean.days)invalid('จำนวนแผนรายวันไม่ถูกต้อง');
   if(body.name!==undefined&&(typeof body.name!=='string'||body.name.length>100))invalid('ชื่อทริปต้องไม่เกิน 100 ตัวอักษร');
   if(body.id!==undefined&&(typeof body.id!=='string'||!readTrips().some(t=>t.id===body.id)))invalid('ไม่พบทริปที่จะอัปเดต');
   const members=require('./members.cjs').validateMembers(body.members);
   const trip={...clean,members,expenses:require('./expenses.cjs').validateExpenses(body.expenses,members),feedback:validateFeedback(body.feedback,clean.days),plans:body.plans.map(plan=>validateStops(plan)),id:body.id||randomUUID(),name:body.name?.trim()||clean.destination,savedAt:testNow??now(),mode:body.mode==='selected'?'selected':'mock',...(body.setup?{setup:{start:validateStops([body.setup.start],1,1)[0],end:validateStops([body.setup.end],1,1)[0],returnDaily:body.setup.returnDaily===true,restaurantSkipped:body.setup.restaurantSkipped===true}}:{}),warnings:[]};
   const trips=[trip,...readTrips().filter(t=>t.id!==trip.id)].slice(0,20);fs.mkdirSync(path.dirname(dataFile),{recursive:true});fs.writeFileSync(dataFile+'.tmp',JSON.stringify(trips,null,2),'utf8');fs.renameSync(dataFile+'.tmp',dataFile);return send(res,201,trip);
  }
  if(url.pathname.startsWith('/api/'))return send(res,404,{error:'ไม่พบ API'});
  if(req.method!=='GET')return send(res,405,{error:'Method not allowed'});
  const file=path.resolve(frontend,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if(!file.startsWith(frontend+path.sep))return send(res,403,{error:'Forbidden'});
  if(!fs.existsSync(file)||!fs.statSync(file).isFile())return send(res,404,{error:'File not found'});
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});fs.createReadStream(file).pipe(res);
 }catch(error){send(res,error.status||500,{error:error.status?error.message:'ไม่สามารถดำเนินการได้ กรุณาลองใหม่'});}});
}
if(require.main===module){const port=Number(process.env.PORT)||8080;const server=createServer();server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is in use. Stop the previous server or set PORT.`:error.message);process.exitCode=1;});server.listen(port,'127.0.0.1',()=>console.log(`roam mockup: http://localhost:${port}\nFrontend + mock API ready. Ctrl+C to stop.`));}
module.exports={createServer,buildPlan};
