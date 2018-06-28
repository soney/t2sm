"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class Transition extends events_1.EventEmitter {
    constructor(fromState, toState, payload) {
        super();
        this.fromState = fromState;
        this.toState = toState;
        this.payload = payload;
        this.fire = (event, source) => {
            this.emit('fire', this, event, source);
        };
        this.fromState._addOutgoingTransition(this);
        this.toState._addIncomingTransition(this);
    }
    ;
    isEligible() { return this.eligible; }
    ;
    setEligible(eligible) { this.eligible = eligible; }
    ;
    remove() {
        this.fromState._removeOutgoingTransition(this);
        this.toState._removeIncomingTransition(this);
    }
    ;
    getFromState() { return this.fromState; }
    ;
    getToState() { return this.toState; }
    ;
    setFromState(state) {
        this.fromState._removeOutgoingTransition(this);
        this.fromState = state;
        this.fromState._addOutgoingTransition(this);
    }
    ;
    setToState(state) {
        this.toState._removeIncomingTransition(this);
        this.toState = state;
        this.toState._addIncomingTransition(this);
    }
    ;
    getPayload() {
        return this.payload;
    }
    ;
}
exports.Transition = Transition;
;
//# sourceMappingURL=Transition.js.map