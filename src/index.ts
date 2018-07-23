import {FSM} from './state_machine/StateContainer';
import {SDBBinding, JSONFSM} from './bindings/sharedb_binding';

const t2sm = {FSM, SDBBinding}
export {FSM, SDBBinding, JSONFSM};

if(typeof window != 'undefined' && window.document) {
    window['t2sm'] = t2sm;
}