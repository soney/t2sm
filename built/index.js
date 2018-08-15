"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StateContainer_1 = require("./state_machine/StateContainer");
exports.FSM = StateContainer_1.FSM;
const sharedb_binding_1 = require("./bindings/sharedb_binding");
exports.SDBBinding = sharedb_binding_1.SDBBinding;
const dagre_binding_1 = require("./bindings/dagre_binding");
exports.DagreBinding = dagre_binding_1.DagreBinding;
// import {StateMachineDisplay} from './views/StateMachineDisplay';
// import {ForeignObjectDisplay} from './views/ForeignObjectDisplay';
const t2sm = { FSM: StateContainer_1.FSM, SDBBinding: sharedb_binding_1.SDBBinding, DagreBinding: dagre_binding_1.DagreBinding };
if (typeof window != 'undefined' && window.document) {
    window['t2sm'] = t2sm;
}
//# sourceMappingURL=index.js.map