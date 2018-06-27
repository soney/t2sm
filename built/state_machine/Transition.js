"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class Transition extends events_1.EventEmitter {
    constructor(fromState, toState) {
        super();
        this.fromState = fromState;
        this.toState = toState;
        this.fire = (event, source) => {
            this._fire(event, source);
        };
    }
    ;
    remove() {
        this.fromState.removeOutgoingTransition(this);
    }
    ;
    getFromState() { return this.fromState; }
    ;
    getToState() { return this.toState; }
    ;
    _fire(event, source) {
        this.emit('fire', this, event, source);
    }
    ;
}
exports.Transition = Transition;
;
//# sourceMappingURL=Transition.js.map