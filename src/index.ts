import {FSM} from './state_machine/FSM';
import {SDBBinding, JSONFSM} from './bindings/sharedb_binding';
import {DagreBinding} from './bindings/dagre_binding';
// import {StateMachineDisplay} from './views/StateMachineDisplay';
// import {ForeignObjectDisplay} from './views/ForeignObjectDisplay';

const t2sm = {FSM, SDBBinding, DagreBinding };
export {FSM, SDBBinding, JSONFSM, DagreBinding };

if(typeof window != 'undefined' && window.document) {
    window['t2sm'] = t2sm;
}