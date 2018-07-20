import { SDBDoc } from 'sdb-ts';
import { FSM } from '../state_machine/StateContainer';
export declare class SDBBinding {
    private fsm;
    private doc;
    private path;
    constructor(fsm: FSM<any, any>, doc: SDBDoc<any>, path: (string | number)[]);
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
