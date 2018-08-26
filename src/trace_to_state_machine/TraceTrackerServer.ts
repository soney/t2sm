import { SDBServer } from "sdb-ts";
import * as http from 'http';
import * as WebSocket from 'ws';

const PORT = 8000;

const server = http.createServer();
const wss = new WebSocket.Server({ server });
const sdbServer = new SDBServer(wss);
const userTracesDoc = sdbServer.get('t2sm', 'userTraces');
userTracesDoc.createIfEmpty({});

server.listen(PORT);