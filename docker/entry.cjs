// Docker entrypoint: same server as `npm start`, but listens on 0.0.0.0 so the
// container port can be published. Source files stay unchanged.
const {createServer}=require('../backend/server.cjs');
const port=Number(process.env.PORT)||8080;
createServer().listen(port,'0.0.0.0',()=>console.log(`roam mockup (docker): http://localhost:${port}`));
