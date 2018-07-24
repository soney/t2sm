import {FSM, SDBBinding, JSONFSM, DagreBinding} from '../built/index';
import {expect} from 'chai';
import {SDBServer, SDBDoc, SDBClient} from 'sdb-ts';
import * as WebSocket from 'ws';
import * as http from 'http';
import {times, sample} from 'lodash';
import { AddressInfo } from 'net';

describe('Create a basic FSM', () => {
    const fsm = new FSM<null, null>();
    it('Create an FSM with one state', () => {
        expect(fsm.getStates()).to.eql([fsm.getStartState()]);
        expect(fsm.getActiveState()).to.equal(fsm.getStartState());
    });
    it('Add a state', () => {
        fsm.addState(null, 'state1');
        expect(fsm.getStates()).to.eql([fsm.getStartState(), 'state1']);
    });
    let secondStateName;
    it('Add a second state', () => {
        secondStateName = fsm.addState();
        expect(secondStateName).to.be.a('string');
        expect(fsm.getStates()).to.eql([fsm.getStartState(), 'state1', secondStateName]);
    });

    it('Transition from start to state1', () => {
        const tName = fsm.addTransition(fsm.getStartState(), 'state1');
        expect(fsm.getActiveState()).to.equal(fsm.getStartState());
        fsm.fireTransition(tName);
        expect(fsm.getActiveState()).to.equal('state1');
    });

    it(`Transition from state1 to second state`, () => {
        const tName = fsm.addTransition('state1', secondStateName);
        expect(fsm.getActiveState()).to.equal('state1');
        fsm.fireTransition(tName);
        expect(fsm.getActiveState()).to.equal(secondStateName);
        expect(fsm.getOutgoingTransitions('state1')).to.eql([tName]);
    });

    it(`Remove a state`, () => {
        fsm.removeState(secondStateName);
        expect(fsm.getStates()).to.eql([fsm.getStartState(), 'state1'])
        expect(fsm.getOutgoingTransitions('state1')).to.eql([]);
    });

    it('Add another state', () => {
        secondStateName = fsm.addState();
        expect(fsm.getStates()).to.eql([fsm.getStartState(), 'state1', secondStateName]);
    });

    it('Transition between states', () => {
        const transition2 = fsm.addTransition('state1', secondStateName);
        const transition3 = fsm.addTransition(secondStateName, 'state1');
        const fireTransition3 = fsm.getFireFunction(transition3);
        fsm.setActiveState('state1');
        expect(fsm.getActiveState()).to.equal('state1');
        fsm.fireTransition(transition2);
        expect(fsm.getActiveState()).to.equal(secondStateName);
        fsm.fireTransition(transition3);
        expect(fsm.getActiveState()).to.equal('state1');

        const otherState = fsm.addState();
        fsm.setTransitionTo(transition2, otherState);
        fsm.fireTransition(transition2);
        expect(fsm.getActiveState()).to.equal(otherState);
        fsm.setTransitionFrom(transition3, otherState);
        fsm.setTransitionTo(transition3, otherState);
        fsm.fireTransition(transition3);
        expect(fsm.getActiveState()).to.equal(otherState);
        fireTransition3();
        expect(fsm.getActiveState()).to.equal(otherState);
        fsm.setTransitionTo(transition3, 'state1');
        expect(fsm.getActiveState()).to.equal(otherState);
        fireTransition3();
        expect(fsm.getActiveState()).to.equal('state1');
    });


    it('Destroy the FSM', () => {
        fsm.destroy();
    });
});

// describe('Traces to FSM', () => {
//     const fsm = new FSM<null, string>();
//     it('Add basic traces', () => {
//         const example_traces = [
//             [
//                 'begin',
//                 'click next',
//                 'click next',
//                 'click prev',
//                 'click ok'
//             ], [
//                 'begin',
//                 'click next',
//                 'click next',
//                 'click prev',
//                 'click x',
//                 'click next',
//                 'click prev',
//                 'click okay'
//             ], [
//                 'begin',
//                 'click ok'
//             ]
//         ];
//         const fsmTraces = example_traces.map((et) => (et.map((s) => [s, null]) as [string, null][]));
//         fsmTraces.forEach((t) => fsm.addTrace(t));
//         console.log(fsm.toString());
//         fsm.iterateMerge();
//         console.log(fsm.toString());
//         fsm.iterateMerge();
//         console.log(fsm.toString());
//         fsm.iterateMerge();
//         console.log(fsm.toString());
//         fsm.iterateMerge();
//         console.log(fsm.toString());
//         fsm.iterateMerge();
//         console.log(fsm.toString());
//     });
// });

describe('Load from JSON', () => {
    it('Create an FSM from JSON', () => {
        const str = '{"initial":"start","states":{"start":{"on":{"Search":"searching","Filter":"filtering","Navigate":"itemList"}},"searching":{"on":{"Search_success":"itemList","Cancel_search":"itemList","Filter":"filtering"}},"itemList":{"on":{"Serach":"searching","Select_item":"item","Filter":"filtering","Open_cart":"cart_checking"}},"item":{"on":{"Navigate":"itemList"}},"filtering":{"on":{"Filter_success":"itemList","Cancel_filter":"itemList","Search":"searching"}},"cart_checking":{"on":{"Save":"itemList","Unsave":"itemList"}}}}'
        const fsm = FSM.fromJSON(JSON.parse(str));
        fsm.fireTransition('start');
        expect(fsm.getActiveState()).to.equal('start');
        fsm.fireTransition('Search');
        expect(fsm.getActiveState()).to.equal('searching');
        fsm.fireTransition('Filter');
        expect(fsm.getActiveState()).to.equal('filtering');
    });
});

describe('ShareDB tests', async () => {
    it('Testing ShareDB', async () => {
        const server = http.createServer();
        const wss = new WebSocket.Server({ server });
        const sdbServer = new SDBServer({wss});
        const fsm = new FSM<string, string>();
        server.listen();
        const address = server.address() as AddressInfo;

        const socketClients = times<WebSocket>(5, () => {
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
            doc.subscribe(() => {});
            return doc;
        });

        fsm.addState('state1data', 'state1');
        expect(fsm.getStates()).to.eql([fsm.getStartState(), 'state1']);
        const transitionToState1 = fsm.addTransition(fsm.getStartState(), 'state1', 't1alias', 't1data');
        expect(fsm.getActiveState()).to.equal(fsm.getStartState());
        fsm.fireTransition('t1alias');
        expect(fsm.getActiveState()).to.equal('state1');
        expect(fsm.getStatePayload('state1')).to.equal('state1data');

        const binding = new SDBBinding(fsm, serverDoc, ['contents', 'subcontents', 'fsm']);

        const clientBindings:SDBBinding[] = clientDocs.map((clientDoc) => {
            return new SDBBinding(new FSM<string, string>(), clientDoc, ['contents', 'subcontents', 'fsm']);
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