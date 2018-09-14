import { FSM } from '../state_machine/FSM';
import { SDBDoc } from 'sdb-ts';
export interface JSONFSM {
    startState: string;
    states: {
        [stateName: string]: {
            payload: any;
            active: boolean;
        };
    };
    transitions: {
        [transitionName: string]: {
            from: string;
            to: string;
            payload: any;
            alias?: string;
        };
    };
}
export declare class SDBBinding {
    private doc;
    private path;
    private fsm;
    private ignoreFSMChanges;
    private ignoreSDBChanges;
    private fsmProvided;
    constructor(doc: SDBDoc<any>, path: (string | number)[], fsm?: FSM<any, any>);
    destroy(): void;
    getFSM(): FSM<any, any>;
    private unsubscribeFromSDB;
    private subscribeToSDB;
    private onDocEvent;
    private initialize;
    private syncFSMToSDB;
    private syncSDBToFSM;
    private onStateAdded;
    private onStateRemoved;
    private onActiveStateChanged;
    private onTransitionAdded;
    private onStatePayloadChanged;
    private onTransitionPayloadChanged;
    private onTransitionRemoved;
    private onTransitionToStateChanged;
    private onTransitionFromStateChanged;
    private onTransitionAliasChanged;
}
