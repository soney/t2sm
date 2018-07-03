"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StateContainer_1 = require("./state_machine/StateContainer");
exports.FSM = StateContainer_1.FSM;
if (typeof window != 'undefined' && window.document) {
    window['FSM'] = StateContainer_1.FSM;
}
//# sourceMappingURL=index.js.map