import { SDBServer, SDBDoc, SDBClient } from 'sdb-ts';
import * as WebSocket from 'ws';
import * as http from 'http';
import { AddressInfo } from 'net';
import { FSM, JSONFSM } from '../built/index';
import { expect } from 'chai';
import { times, sample } from 'lodash';
import { SDBBinding } from '../built/bindings/sharedb_binding';
import { DagreBinding } from '../built/bindings/dagre_binding';

describe('ShareDB tests', async () => {
    it('Testing ShareDB', async () => {
        const server = http.createServer();
        const wss = new WebSocket.Server({ server });
        const sdbServer = new SDBServer(wss);
        const fsm = new FSM<string, string>();
        server.listen();
        const address = server.address() as AddressInfo;

        const socketClients = times<WebSocket>(1, () => {
            return new WebSocket(`ws://localhost:${address.port}/`);
        });
        const sdbClients = socketClients.map((ws:any) => {
            return new SDBClient(ws);
        });

        interface ADoc {
            contents: {
                subcontents: {
                    fsm: JSONFSM
                }
            }
        }

        const serverDoc:SDBDoc<ADoc> = sdbServer.get<ADoc>('a', 'doc');

        serverDoc.create({
            contents: {
                subcontents: {
                    fsm: null
                }
            }
        });

        const clientDocs:SDBDoc<ADoc>[] = sdbClients.map((sdbClient) => {
            const doc:SDBDoc<ADoc> = sdbClient.get('a', 'doc');
            // doc.subscribe();
            return doc;
        });

        fsm.addState('state1data', 'state1');
        expect(fsm.getStates()).to.eql([fsm.getStartState(), 'state1']);
        const transitionToState1 = fsm.addTransition(fsm.getStartState(), 'state1', 't1alias', 't1data');
        expect(fsm.getActiveState()).to.equal(fsm.getStartState());
        fsm.fireTransition('t1alias');
        expect(fsm.getActiveState()).to.equal('state1');
        expect(fsm.getStatePayload('state1')).to.equal('state1data');

        // await delay(50);

        const binding = new SDBBinding(serverDoc, ['contents', 'subcontents', 'fsm'], fsm);

        const clientBindings:SDBBinding[] = clientDocs.map((clientDoc) => {
            return new SDBBinding(clientDoc, ['contents', 'subcontents', 'fsm']);
        });
        const clientFSMs:FSM<string, string>[] = clientBindings.map((clientBinding) => {
            return clientBinding.getFSM();
        });

        await delay(50);
        const allFSMs = clientFSMs.concat(fsm);

        allFSMs.forEach((fsm) => {
            expect(fsm.getStatePayload('state1')).to.equal('state1data');
            expect(fsm.getStates()).to.eql([fsm.getStartState(), 'state1']);
            expect(fsm.getActiveState()).to.equal('state1');
            expect(fsm.getTransitionPayload(transitionToState1)).to.equal('t1data');
            expect(fsm.getTransitionAlias(transitionToState1)).to.equal('t1alias');
        });

        function randFSM():FSM<string, string> {
            return sample(allFSMs);
        }

        randFSM().addState('state2payload', 's2')

        await delay(10);

        allFSMs.forEach((fsm) => {
            expect(fsm.getStatePayload('s2')).to.equal('state2payload');
            expect(fsm.getStates()).to.eql([fsm.getStartState(), 'state1', 's2']);
        });

        randFSM().setStatePayload('s2', 'otherpayload');
        await delay(10);

        allFSMs.forEach((fsm) => {
            expect(fsm.getStatePayload('s2')).to.equal('otherpayload');
        });

        randFSM().removeState('s2');
        await delay(10);
        allFSMs.forEach((fsm) => {
            expect(fsm.getStates()).to.eql([fsm.getStartState(), 'state1']);
        });

        let rfsm = randFSM();
        rfsm.addState('ospayload', 'os');
        const t1 = rfsm.addTransition('state1', 'os', 't1alias', 't1payload');
        await delay(10);

        allFSMs.forEach((fsm) => {
            expect(fsm.getStates()).to.eql([fsm.getStartState(), 'state1', 'os']);
            expect(fsm.getActiveState()).to.equal('state1');
            expect(fsm.getTransitionAlias(t1)).to.equal('t1alias');
            expect(fsm.getTransitionPayload(t1)).to.equal('t1payload');
            expect(fsm.getTransitionFrom(t1)).to.equal('state1');
            expect(fsm.getTransitionTo(t1)).to.equal('os');
        });

        randFSM().fireTransition('t1alias');
        await delay(10);

        allFSMs.forEach((fsm) => {
            expect(fsm.getActiveState()).to.equal('os');
        });

        rfsm = randFSM();
        rfsm.setTransitionFrom(t1, 'os');
        rfsm.setTransitionTo(t1, 'state1');
        rfsm.fireTransition(t1);
        await delay(10);
        allFSMs.forEach((fsm) => {
            expect(fsm.getActiveState()).to.equal('state1');
        });

        rfsm = randFSM();
        rfsm.setTransitionFrom(t1, 'state1');
        rfsm.fireTransition(t1);
        await delay(10);
        allFSMs.forEach((fsm) => {
            expect(fsm.getActiveState()).to.equal('state1');
        });

        randFSM().setTransitionPayload(t1, 'newpayload');
        await delay(10);
        allFSMs.forEach((fsm) => {
            expect(fsm.getTransitionPayload(t1)).to.equal('newpayload');
            expect(fsm.getOutgoingTransitions('state1')).to.eql([t1]);
        });

        randFSM().removeTransition(t1);
        await delay(10);
        allFSMs.forEach((fsm) => {
            expect(fsm.getOutgoingTransitions('state1')).to.eql([]);
        });

        clientBindings.forEach((binding) => {
            binding.destroy();
        });

        fsm.addState(null, 'another');
        expect(fsm.getStates()).to.contain('another');
        await delay(10);
        clientFSMs.forEach((fsm) => {
            expect(fsm.getStates()).does.not.contain('another');
        });

        socketClients.forEach((ws) => {
            ws.close();
        });
        
        server.close();
    });
});
describe('Dagre tests', async () => {
    it('Testing dagre binding', async () => {
        const fsm:FSM<null, null> = new FSM();
        const state1 = fsm.addState();
        const startTransition = fsm.addTransition(fsm.getStartState(), state1);

        const binding = new DagreBinding(fsm);
        const graph = binding.getGraph();

        function checkTransitions():void {
            expect(graph.edges().map(e => e.name)).to.eql(fsm.getTransitions());
            graph.edges().forEach((edge) => {
                const {name} = edge;
                expect(edge.v).to.equal(fsm.getTransitionFrom(name));
                expect(edge.w).to.equal(fsm.getTransitionTo(name));
            });
        }

        checkTransitions();
        expect(graph.nodes()).to.eql(fsm.getStates());
        fsm.addState(null, 'label2');
        checkTransitions();

        const otherTransition = fsm.addTransition(state1, 'label2');
        checkTransitions();
        fsm.setTransitionTo(otherTransition, state1);
        checkTransitions();
        fsm.setTransitionFrom(otherTransition, 'label2');
        checkTransitions();
        fsm.removeTransition(otherTransition);

        expect(graph.nodes()).to.eql(fsm.getStates());
        checkTransitions();

        fsm.removeState('label2');
        expect(graph.nodes()).to.eql(fsm.getStates());

        const s2 = fsm.addState();
        expect(graph.nodes()).to.eql(fsm.getStates());
        checkTransitions();
        fsm.addTransition(state1, s2);
        checkTransitions();
        fsm.addTransition(state1, s2);
        checkTransitions();
        fsm.removeState(s2);
        checkTransitions();
        expect(graph.nodes()).to.eql(fsm.getStates());
    });
});

function delay(ms: number):Promise<null> {
    return new Promise<null> ((resolve) => {
        setTimeout(()=> resolve(null), ms);
    });
};