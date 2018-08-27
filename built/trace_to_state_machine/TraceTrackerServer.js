"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdb_ts_1 = require("sdb-ts");
const http = require("http");
const WebSocket = require("ws");
const express = require("express");
const path = require("path");
const PORT = 8000;
const app = express();
app.use(express.static(path.join(__dirname, 'client_pages')));
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const sdbServer = new sdb_ts_1.SDBServer(wss);
const userTracesDoc = sdbServer.get('t2sm', 'userTraces');
userTracesDoc.createIfEmpty({});
console.log('create');
server.listen(PORT);
console.log(`Listening on port ${PORT}`);
//# sourceMappingURL=TraceTrackerServer.js.map