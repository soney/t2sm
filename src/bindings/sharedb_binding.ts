import {SDBDoc} from 'sdb-ts';
import {FSM, StateAddedEvent, StateRemovedEvent, TransitionAddedEvent, TransitionRemovedEvent, TransitionFromStateChangedEvent, TransitionToStateChangedEvent, StatePayloadChangedEvent, TransitionPayloadChangedEvent} from '../state_machine/StateContainer';

interface JSONFSM {
    startState: string,
    states: {
        [stateName: string]: {
            payload: any
        }
    },
    transitions: {
        [transitionName: string]: {
            from: string,
            to: string,
            payload: any,
            alias?: string
        }
    }
};

export class SDBBinding {
    constructor(private fsm: FSM<any, any>, private doc: SDBDoc<any>, private path:(string|number)[]) {
        this.fsm.on('stateAdded', this.onStateAdded);
        this.fsm.on('stateRemoved', this.onStateRemoved);
        this.fsm.on('transitionAdded', this.onTransitionAdded);
        this.fsm.on('transitionRemoved', this.onTransitionRemoved);
        this.fsm.on('statePayloadChanged', this.onStatePayloadChanged);
        this.fsm.on('transitionPayloadChanged', this.onTransitionPayloadChanged);
        this.fsm.on('transitionToStateChanged', this.onTransitionToStateChanged);
        this.fsm.on('transitionFromStateChanged', this.onTransitionFromStateChanged);
    };
    private initialize() {
        const data:JSONFSM = {
            startState: this.fsm.getStartState(),
            states: {},
            transitions: {}
        };
        this.fsm.getStates().forEach((stateName: string) => {
            const payload = this.fsm.getStatePayload(stateName);
            data.states[stateName] = { payload };
        });
        this.fsm.getTransitions().forEach((transitionName: string) => {
            const from = this.fsm.getTransitionFrom(transitionName);
            const to = this.fsm.getTransitionTo(transitionName);
            const payload = this.fsm.getTransitionPayload(transitionName);
            const alias = this.fsm.getTransitionAlias(transitionName);
            data.transitions[transitionName] = { from, to, payload, alias}
        });
    };
    private getJSONFSM():JSONFSM {
        return this.doc.traverse(this.path) as JSONFSM;
    };
    private onStateAdded = (event:StateAddedEvent):void => {
        const {state, payload} = event;
        this.doc.submitObjectInsertOp(this.path.concat('states', state), { payload });
    };
    private onStateRemoved = (event:StateRemovedEvent):void => {
        const {state} = event;
        this.doc.submitObjectDeleteOp(this.path.concat('states', state));
    };
    private onTransitionAdded = (event:TransitionAddedEvent):void => {
        const {transition, from, to, payload, alias} = event;
        this.doc.submitObjectInsertOp(this.path.concat('transitions', transition), { from, to, payload, alias });
    };
    private onStatePayloadChanged = (event:StatePayloadChangedEvent):void => {
        const {state, payload} = event;
        this.doc.submitObjectInsertOp(this.path.concat('states', state, 'payload'), payload);
    };

    private onTransitionPayloadChanged = (event:TransitionPayloadChangedEvent):void => {
        const {transition, payload} = event;
        this.doc.submitObjectInsertOp(this.path.concat('transitions', transition, 'payload'), payload);
    };
    private onTransitionRemoved = (event:TransitionRemovedEvent):void => {
        const {transition} = event;
        this.doc.submitObjectDeleteOp(this.path.concat('transitions', transition));
    };
    private onTransitionToStateChanged = (event:TransitionToStateChangedEvent):void => {
        const {transition, state} = event;
        this.doc.submitObjectReplaceOp(this.path.concat('transitions', transition, 'to'), state);
    };
    private onTransitionFromStateChanged = (event:TransitionFromStateChangedEvent):void => {
        const {transition, state} = event;
        this.doc.submitObjectDeleteOp(this.path.concat('transitions', transition, 'from'), state);
    };

};