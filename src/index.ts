import {FSM} from './state_machine/StateContainer';
import {SDBBinding, JSONFSM} from './bindings/sharedb_binding';
import {DagreBinding} from './bindings/dagre_binding';
import {StateMachineDisplay} from './views/fsm_view';

const t2sm = {FSM, SDBBinding, DagreBinding, StateMachineDisplay};
export {FSM, SDBBinding, JSONFSM, DagreBinding};

if(typeof window != 'undefined' && window.document) {
    window['t2sm'] = t2sm;
}