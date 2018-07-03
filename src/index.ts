import {FSM} from './state_machine/StateContainer';

export {FSM};

if(typeof window != 'undefined' && window.document) {
    window['FSM'] = FSM;
}