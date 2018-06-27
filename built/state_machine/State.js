"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Transition_1 = require("./Transition");
const events_1 = require("events");
class AbstractState extends events_1.EventEmitter {
    constructor(label) {
        super();
        this.label = label;
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
    getLabel() {
        return this.label;
    }
    ;
    setLabel(label) {
        this.label = label;
    }
    ;
    addOutgoingTransition(toState) {
        const transition = new Transition_1.Transition(this, toState);
        this.outgoingTransitions.push(transition);
        toState._addIncomingTransition(transition);
        if (this.isActive()) {
            transition.addListener('fire', this.onOutgoingTransitionFired);
        }
        return transition;
    }
    ;
    _addIncomingTransition(transition) {
        this.incomingTransitions.push(transition);
    }
    ;
    removeOutgoingTransition(transition) {
        for (let i = 0; i < this.outgoingTransitions.length; i++) {
            if (this.outgoingTransitions[i] === transition) {
                if (transition.getToState()._removeIncomingTransition(transition)) {
                    this.outgoingTransitions.splice(i, 1);
                    transition.removeListener('fire', this.onOutgoingTransitionFired);
                    break;
                }
            }
        }
        return this;
    }
    ;
    _removeIncomingTransition(transition) {
        for (let i = 0; i < this.incomingTransitions.length; i++) {
            if (this.incomingTransitions[i] === transition) {
                this.incomingTransitions.splice(i, 1);
                return true;
            }
        }
        return false;
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
    constructor(label) {
        super(label);
    }
    ;
    isStartState() { return true; }
    ;
}
exports.StartState = StartState;
;
class State extends AbstractState {
    constructor(label) {
        super(label);
    }
    ;
    isStartState() { return false; }
    ;
}
exports.State = State;
;
//# sourceMappingURL=State.js.map