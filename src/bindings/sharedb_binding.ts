import {SDBDoc} from 'sdb-ts';
import {FSM, StateAddedEvent, StateRemovedEvent, TransitionAddedEvent, TransitionRemovedEvent, TransitionFromStateChangedEvent, TransitionToStateChangedEvent, StatePayloadChangedEvent, TransitionPayloadChangedEvent, TransitionAliasChangedEvent, ActiveStateChangedEvent} from '../state_machine/StateContainer';
import {each, isEqual, has} from 'lodash';

export interface JSONFSM {
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
    private ignoreFSMChanges: boolean = false;
    private ignoreSDBChanges: boolean = false;

    constructor(private doc: SDBDoc<any>, private path:(string|number)[], private fsm: FSM<any, any> = new FSM<any, any>()) {
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

        this.subscribeToSDB();
    };
    public destroy():void {
        this.fsm.removeListener('stateAdded', this.onStateAdded);
        this.fsm.removeListener('stateRemoved', this.onStateRemoved);
        this.fsm.removeListener('transitionAdded', this.onTransitionAdded);
        this.fsm.removeListener('transitionRemoved', this.onTransitionRemoved);
        this.fsm.removeListener('activeStateChanged', this.onActiveStateChanged);
        this.fsm.removeListener('statePayloadChanged', this.onStatePayloadChanged);
        this.fsm.removeListener('statePayloadChanged', this.onStatePayloadChanged);
        this.fsm.removeListener('transitionAliasChanged', this.onTransitionAliasChanged);
        this.fsm.removeListener('transitionPayloadChanged', this.onTransitionPayloadChanged);
        this.fsm.removeListener('transitionToStateChanged', this.onTransitionToStateChanged);
        this.fsm.removeListener('transitionFromStateChanged', this.onTransitionFromStateChanged);
        this.unsubscribeFromSDB();
    };
    public getFSM():FSM<any, any> {
        return this.fsm;
    };
    private unsubscribeFromSDB():void {
        this.doc.destroy();
        this.ignoreSDBChanges = true;
    };
    private subscribeToSDB():void {
        this.doc.subscribe((eventType: string, ops: any[], source: any) => {
            if(!this.ignoreSDBChanges) {
                if(eventType === null) {
                    this.initialize();
                } else if(eventType === 'op') {
                    ops.forEach((op) => {
                        const {p} = op;
                        if(isEqual(p.slice(0, this.path.length), this.path)) {
                            const extraPath = p.slice(this.path.length);
                            this.ignoreFSMChanges = true;

                            if(isEqual(extraPath, [])) {
                                this.syncSDBToFSM();
                            } else if(extraPath[0] === 'states') {
                                const label = extraPath[1];
                                if(extraPath.length === 2) {
                                    if(has(op, 'od')) {
                                        this.fsm.removeState(label);
                                    }
                                    if(has(op, 'oi')) {
                                        const {oi} = op;
                                        const {payload, active} = oi;
                                        this.fsm.addState(payload, label);
                                        if(active) {
                                            this.fsm.setActiveState(label);
                                        }
                                    }
                                } else if(extraPath.length === 3) {
                                    if(extraPath[2] === 'payload') {
                                        if(has(op, 'oi')) {
                                            const {oi} = op;
                                            this.fsm.setStatePayload(label, oi);
                                        }
                                    } else if(extraPath[2] === 'active') {
                                        if(has(op, 'oi')) {
                                            const {oi} = op;
                                            if(oi === true) {
                                                this.fsm.setActiveState(label);
                                            }
                                        }
                                    }
                                }
                            } else if(extraPath[0] === 'transitions') {
                                const label = extraPath[1];
                                if(extraPath.length === 2) {
                                    if(has(op, 'oi')) {
                                        const {oi} = op;
                                        const { from, to, payload, alias } = oi;
                                        this.fsm.addTransition(from, to, alias, payload, label);
                                    }
                                    if(has(op, 'od')) {
                                        this.fsm.removeTransition(label);
                                    }
                                } else if(extraPath.length === 3) {
                                    if(extraPath[2] === 'from') {
                                        if(has(op, 'oi')) {
                                            const {oi} = op;
                                            this.fsm.setTransitionFrom(label, oi);
                                        }
                                    } else if(extraPath[2] === 'to') {
                                        if(has(op, 'oi')) {
                                            const {oi} = op;
                                            this.fsm.setTransitionTo(label, oi);
                                        }
                                    } else if(extraPath[2] === 'alias') {
                                        if(has(op, 'oi')) {
                                            const {oi} = op;
                                            this.fsm.setTransitionAlias(label, oi);
                                        }
                                    } else if(extraPath[2] === 'payload') {
                                        if(has(op, 'oi')) {
                                            const {oi} = op;
                                            this.fsm.setTransitionPayload(label, oi);
                                        }
                                    }
                                }
                            } else {
                                console.log(extraPath);
                            }
                            this.ignoreFSMChanges = false;
                        }
                    });
                }
            }
        });
    };
    private initialize(): void {
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

        this.ignoreSDBChanges = true;
        this.doc.submitObjectReplaceOp(this.path, data);
        this.ignoreSDBChanges = false;
    };
    private syncSDBToFSM():void {
        const data = this.doc.traverse(this.path) as JSONFSM;
        this.ignoreFSMChanges = true;
        each(data.states, (state, label) => {
            const { active, payload } = state;
            if(label === data.startState) {
                this.fsm.setStatePayload(label, payload);
            } else {
                this.fsm.addState(payload, label);
            }
            if(active) {
                this.fsm.setActiveState(label);
            }
        });
        each(data.transitions, (transition, label) => {
            const { from, to, payload, alias } = transition;
            this.fsm.addTransition(from, to, alias, payload, label);
        });
        this.ignoreFSMChanges = false;
    };
    private onStateAdded = (event:StateAddedEvent):void => {
        if(!this.ignoreFSMChanges) {
            const {state, payload} = event;
            this.ignoreSDBChanges = true;
            this.doc.submitObjectInsertOp(this.path.concat('states', state), { payload, active: this.fsm.getActiveState() === state });
            this.ignoreSDBChanges = false;
        }
    };
    private onStateRemoved = (event:StateRemovedEvent):void => {
        if(!this.ignoreFSMChanges) {
            const {state} = event;
            this.ignoreSDBChanges = true;
            this.doc.submitObjectDeleteOp(this.path.concat('states', state));
            this.ignoreSDBChanges = false;
        }
    };
    private onActiveStateChanged = (event:ActiveStateChangedEvent):void => {
        if(!this.ignoreFSMChanges) {
            const {state, oldActiveState} = event;
            this.ignoreSDBChanges = true;
            if(oldActiveState) {
                this.doc.submitObjectReplaceOp(this.path.concat('states', oldActiveState, 'active'), false);
            }
            this.doc.submitObjectReplaceOp(this.path.concat('states', state, 'active'), true);
            this.ignoreSDBChanges = false;
        }
    };
    private onTransitionAdded = (event:TransitionAddedEvent):void => {
        if(!this.ignoreFSMChanges) {
            const {transition, from, to, payload, alias} = event;
            this.ignoreSDBChanges = true;
            this.doc.submitObjectInsertOp(this.path.concat('transitions', transition), { from, to, payload, alias });
            this.ignoreSDBChanges = false;
        }
    };
    private onStatePayloadChanged = (event:StatePayloadChangedEvent):void => {
        if(!this.ignoreFSMChanges) {
            const {state, payload} = event;
            this.ignoreSDBChanges = true;
            this.doc.submitObjectReplaceOp(this.path.concat('states', state, 'payload'), payload);
            this.ignoreSDBChanges = false;
        }
    };
    private onTransitionPayloadChanged = (event:TransitionPayloadChangedEvent):void => {
        if(!this.ignoreFSMChanges) {
            const {transition, payload} = event;
            this.ignoreSDBChanges = true;
            this.doc.submitObjectReplaceOp(this.path.concat('transitions', transition, 'payload'), payload);
            this.ignoreSDBChanges = false;
        }
    };
    private onTransitionRemoved = (event:TransitionRemovedEvent):void => {
        if(!this.ignoreFSMChanges) {
            const {transition} = event;
            this.ignoreSDBChanges = true;
            this.doc.submitObjectDeleteOp(this.path.concat('transitions', transition));
            this.ignoreSDBChanges = false;
        }
    };
    private onTransitionToStateChanged = (event:TransitionToStateChangedEvent):void => {
        if(!this.ignoreFSMChanges) {
            const {transition, state} = event;
            this.ignoreSDBChanges = true;
            this.doc.submitObjectReplaceOp(this.path.concat('transitions', transition, 'to'), state);
            this.ignoreSDBChanges = false;
        }
    };
    private onTransitionFromStateChanged = (event:TransitionFromStateChangedEvent):void => {
        if(!this.ignoreFSMChanges) {
            const {transition, state} = event;
            this.ignoreSDBChanges = true;
            this.doc.submitObjectReplaceOp(this.path.concat('transitions', transition, 'from'), state);
            this.ignoreSDBChanges = false;
        }
    };
    private onTransitionAliasChanged = (event:TransitionAliasChangedEvent):void => {
        if(!this.ignoreFSMChanges) {
            const {transition, alias} = event;
            this.ignoreSDBChanges = true;
            this.doc.submitObjectReplaceOp(this.path.concat('transitions', transition, 'alias'), alias);
            this.ignoreSDBChanges = false;
        }
    };
};