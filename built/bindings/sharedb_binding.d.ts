import { SDBDoc } from 'sdb-ts';
import { FSM } from '../state_machine/StateContainer';
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
    private fsm;
    private doc;
    private path;
    private ignoreFSMChanges;
    private ignoreSDBChanges;
    constructor(fsm: FSM<any, any>, doc: SDBDoc<any>, path: (string | number)[]);
    destroy(): void;
    getFSM(): FSM<any, any>;
    private unsubscribeFromSDB;
    private subscribeToSDB;
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
