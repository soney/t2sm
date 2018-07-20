import {SDBDoc} from 'sdb-ts';
import {FSM, StateAddedEvent, StateRemovedEvent, TransitionAddedEvent, TransitionRemovedEvent, TransitionFromStateChangedEvent, TransitionToStateChangedEvent, StatePayloadChangedEvent, TransitionPayloadChangedEvent, TransitionAliasChangedEvent, ActiveStateChangedEvent} from '../state_machine/StateContainer';
import {each} from 'lodash';

interface JSONFSM {
    startState: string,
    states: {
        [stateName: string]: {
            payload: any,
            active: boolean
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
        this.fsm.on('activeStateChanged', this.onActiveStateChanged);
        this.fsm.on('statePayloadChanged', this.onStatePayloadChanged);
        this.fsm.on('statePayloadChanged', this.onStatePayloadChanged);
        this.fsm.on('transitionAliasChanged', this.onTransitionAliasChanged);
        this.fsm.on('transitionPayloadChanged', this.onTransitionPayloadChanged);
        this.fsm.on('transitionToStateChanged', this.onTransitionToStateChanged);
        this.fsm.on('transitionFromStateChanged', this.onTransitionFromStateChanged);

        let hasSDBData: boolean;
        try {
            const data = this.doc.traverse(this.path);
            if(data) {
                hasSDBData = true;
            } else {
                hasSDBData = false;
            }
        } catch {
            hasSDBData = false;
        }

        if(hasSDBData) {
            this.syncSDBToFSM();
        } else {
            this.syncFSMToSDB();
        }
    };
    private syncFSMToSDB():void {
        const data:JSONFSM = {
            startState: this.fsm.getStartState(),
            states: {},
            transitions: {}
        };
        this.fsm.getStates().forEach((stateName: string) => {
            const payload = this.fsm.getStatePayload(stateName);
            const active = this.fsm.getActiveState() === stateName;
            data.states[stateName] = { payload, active };
        });
        this.fsm.getTransitions().forEach((transitionName: string) => {
            const from = this.fsm.getTransitionFrom(transitionName);
            const to = this.fsm.getTransitionTo(transitionName);
            const payload = this.fsm.getTransitionPayload(transitionName);
            const alias = this.fsm.getTransitionAlias(transitionName);
            data.transitions[transitionName] = { from, to, payload, alias };
        });
        this.doc.submitObjectReplaceOp(this.path, data);
    };
    private syncSDBToFSM():void {
        const data = this.doc.traverse(this.path) as JSONFSM;
        each(data.states, (state, label) => {
            const { payload } = state;
            this.fsm.addState(payload, label);
        });
        each(data.transitions, (transition, label) => {
            const { from, to, payload, alias } = transition;
            this.fsm.addTransition(from, to, alias, payload, label);
        });
    };
    private onStateAdded = (event:StateAddedEvent):void => {
        const {state, payload} = event;
        this.doc.submitObjectInsertOp(this.path.concat('states', state), { payload });
    };
    private onStateRemoved = (event:StateRemovedEvent):void => {
        const {state} = event;
        this.doc.submitObjectDeleteOp(this.path.concat('states', state));
    };
    private onActiveStateChanged = (event:ActiveStateChangedEvent):void => {
        const {state, oldActiveState} = event;
        if(oldActiveState) {
            this.doc.submitObjectReplaceOp(this.path.concat('states', oldActiveState, 'active'), false);
        }
        this.doc.submitObjectReplaceOp(this.path.concat('states', state, 'active'), true);
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
    private onTransitionAliasChanged = (event:TransitionAliasChangedEvent):void => {
        const {transition, alias} = event;
        this.doc.submitObjectDeleteOp(this.path.concat('transitions', transition, 'alias'), alias);
    };
};