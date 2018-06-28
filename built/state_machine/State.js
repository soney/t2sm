"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class AbstractState extends events_1.EventEmitter {
    constructor(payload) {
        super();
        this.payload = payload;
        this.active = false;
        this.outgoingTransitions = [];
        this.incomingTransitions = [];
        this.onOutgoingTransitionFired = (transition, event, source) => {
            if (this.isActive()) {
                const toState = transition.getToState();
                this.setIsActive(false);
                toState.setIsActive(true);
            }
            else {
                throw new Error('Received transition fired event while not active');
            }
        };
    }
    ;
    getPayload() {
        return this.payload;
    }
    ;
    _getOutgoingTransitions() {
        return this.outgoingTransitions;
    }
    ;
    _getIncomingTransitions() {
        return this.incomingTransitions;
    }
    ;
    _addOutgoingTransition(transition) {
        this.outgoingTransitions.push(transition);
        if (this.isActive()) {
            transition.addListener('fire', this.onOutgoingTransitionFired);
        }
    }
    ;
    _addIncomingTransition(transition) {
        this.incomingTransitions.push(transition);
    }
    ;
    _removeOutgoingTransition(transition) {
        const index = this.outgoingTransitions.indexOf(transition);
        if (index >= 0) {
            this.outgoingTransitions.splice(index, 1);
            if (this.isActive()) {
                transition.removeListener('fire', this.onOutgoingTransitionFired);
            }
            return true;
        }
        else {
            return false;
        }
    }
    ;
    _removeIncomingTransition(transition) {
        const index = this.incomingTransitions.indexOf(transition);
        if (index >= 0) {
            this.incomingTransitions.splice(index, 1);
            return true;
        }
        else {
            return false;
        }
    }
    ;
    isActive() { return this.active; }
    ;
    setIsActive(active) {
        this.active = active;
        if (this.isActive()) {
            this.addOutgoingTransitionListeners();
            this.emit('active');
        }
        else {
            this.removeOutgoingTransitionListeners();
            this.emit('not_active');
        }
    }
    ;
    addOutgoingTransitionListeners() {
        this.outgoingTransitions.forEach((ot) => {
            ot.removeListener('fire', this.onOutgoingTransitionFired);
        });
    }
    ;
    removeOutgoingTransitionListeners() {
        this.outgoingTransitions.forEach((ot) => {
            ot.addListener('fire', this.onOutgoingTransitionFired);
        });
    }
    ;
    destroy() {
        this.removeOutgoingTransitionListeners();
    }
    ;
}
exports.AbstractState = AbstractState;
;
class StartState extends AbstractState {
    constructor(payload) {
        super(payload);
    }
    ;
    isStartState() { return true; }
    ;
}
exports.StartState = StartState;
;
class State extends AbstractState {
    constructor(payload) {
        super(payload);
    }
    ;
    isStartState() { return false; }
    ;
}
exports.State = State;
;
//# sourceMappingURL=State.js.map