import {FSM} from '../built/index';
import {expect} from 'chai';
import {SDBServer, SDBDoc, SDBClient} from 'sdb-ts';

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
    });

    it(`Remove a state`, () => {
        fsm.removeState(secondStateName);
        expect(fsm.getStates()).to.eql([fsm.getStartState(), 'state1'])
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

describe('ShareDB tests', () => {
    const server = new SDBServer();
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
    });

    it(`Remove a state`, () => {
        fsm.removeState(secondStateName);
        expect(fsm.getStates()).to.eql([fsm.getStartState(), 'state1'])
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
});