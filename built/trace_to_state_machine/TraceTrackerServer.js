"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdb_ts_1 = require("sdb-ts");
const http = require("http");
const WebSocket = require("ws");
const PORT = 8000;
const server = http.createServer();
const wss = new WebSocket.Server({ server });
const sdbServer = new sdb_ts_1.SDBServer(wss);
const userTracesDoc = sdbServer.get('t2sm', 'userTraces');
userTracesDoc.createIfEmpty({});
server.listen(PORT);
//# sourceMappingURL=TraceTrackerServer.js.map