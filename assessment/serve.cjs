// Separate local fixture store; never enable reset on backend/data/trips.json.
const path=require('node:path');
const {createServer}=require('../backend/server.cjs');
const port=Number(process.env.TEST_PORT)||8082;
createServer({dataFile:path.join(__dirname,'.runtime/trips.json'),allowTestReset:true}).listen(port,'127.0.0.1',()=>console.log(`Assessment server: http://127.0.0.1:${port} (isolated data, reset enabled)`));
