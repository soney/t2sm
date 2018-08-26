"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FSM_1 = require("../state_machine/FSM");
const sharedb_binding_1 = require("../bindings/sharedb_binding");
const sdb_ts_1 = require("sdb-ts");
;
;
;
class ClientTraceTracker {
    constructor(serverURL, clientID) {
        this.fsm = new FSM_1.FSM();
        this.ws = new WebSocket(serverURL);
        this.sdbClient = new sdb_ts_1.SDBClient(this.ws);
        this.sdbDoc = this.sdbClient.get('t2sm', 'userTraces');
        this.sdbBinding = new sharedb_binding_1.SDBBinding(this.sdbDoc, [clientID], this.fsm);
        this.currentState = this.fsm.addState({});
        this.fsm.addTransition(this.fsm.getStartState(), this.currentState);
    }
    addEvent(eventType, target, manualLabel) {
        const sTarget = ClientTraceTracker.serializeElement(target);
        const payload = { eventType, manualLabel, target: sTarget };
        const previousState = this.currentState;
        this.currentState = this.fsm.addState({});
        this.fsm.addTransition(previousState, this.currentState, null, payload);
    }
    static serializeElement(el) {
        const { tagName, parentElement } = el;
        const attributes = {};
        for (let i = 0; i < el.attributes.length; i++) {
            const { name, value } = el.attributes.item(i);
            attributes[name] = value;
        }
        if (parentElement) {
            const childIndex = Array.prototype.indexOf.call(parentElement.childNodes, el);
            const sParent = ClientTraceTracker.serializeElement(parentElement);
            return { tagName, attributes, parent: { element: sParent, childIndex } };
        }
        else {
            return { tagName, attributes };
        }
    }
}
exports.ClientTraceTracker = ClientTraceTracker;
//# sourceMappingURL=ClientTraceTracker.js.map