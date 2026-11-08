# LAB 0 — Environment check

ตรวจจริงวันที่2026-11-07บนmacOS arm64. `node --version` v26.5.1; `npm --version`11.17.0; `docker --version`29.1.3; `docker compose version`v2.40.3-desktop.1; Docker daemon29.1.3ตอบได้; ffmpeg9.0.1.

Project requiresNode22+ ตามpackage.json. ไม่มีdependenciesต้องnpm install. Docker/ffmpegมีในเครื่อง **ไม่ได้หมายความ** โปรเจกต์นี้มีweb/dbhealthyหรือสร้างGIF/MP4แล้ว. ไม่มีbrowserinstallation/run evidenceในชุดส่งนี้.

```sh
node --version
npm start
# terminal อื่น
curl http://localhost:8080/api/health
npm run verify
npm run test:mutations
npm run report
npm run docs:check
```

Healthของserverเป็น `{ "ok":true,"mode":"mock" }` ไม่ใช่dbhealthของPostgreSQL. APItestใช้ephemeralportแยก; NodeHTTP integrationต้องอนุญาตlisten localhost. ถ้าEPERM/EADDRINUSEให้จำแนกenvironmentและแก้สิทธิ์/พอร์ต ไม่เปลี่ยนexpectedให้ผ่าน.
