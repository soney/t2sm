"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
/**
 * A class representing a transition in a state machine
 */
class Transition extends events_1.EventEmitter {
    /**
     * Constructor
     * @param fromState The state that this transition leaves from
     * @param toState The state that this transition goes to
     * @param alias The shorthand name for this transition
     * @param payload The information stored in this transition
     */
    constructor(fromState, toState, alias, payload) {
        super();
        this.fromState = fromState;
        this.toState = toState;
        this.alias = alias;
        this.payload = payload;
        this.fromState._addOutgoingTransition(this);
        this.toState._addIncomingTransition(this);
    }
    ;
    /**
     * @returns the alias for this transition (typically the event name)
     */
    getAlias() {
        return this.alias;
    }
    ;
    /**
     * @returns whether this transition is eligible to fire
     */
    isEligible() { return this.eligible; }
    ;
    /**
     * Change whether this transition is eligible
     * @param eligible true if this transition should be eligible to fire, false otherwise.
     */
    setEligible(eligible) { this.eligible = eligible; }
    ;
    /**
     * Remove this transition
     */
    remove() {
        this.fromState._removeOutgoingTransition(this);
        this.toState._removeIncomingTransition(this);
    }
    ;
    /**
     * Get the state that this transition leaves from
     */
    getFromState() { return this.fromState; }
    ;
    /**
     * Get the state that this transition goes to
     */
    getToState() { return this.toState; }
    ;
    /**
     * Tell the transition to fire (if the "from" state is active, move to the "to" state)
     */
    fire(event, source) {
        this.emit('fire', this, event, source);
    }
    ;
    /**
     * Change which state this transition leaves from
     * @param state The new "from" state
     */
    setFromState(state) {
        this.fromState._removeOutgoingTransition(this);
        this.fromState = state;
        this.fromState._addOutgoingTransition(this);
    }
    ;
    /**
     * Change which state this transition goes to
     * @param state The new "to" state
     */
    setToState(state) {
        this.toState._removeIncomingTransition(this);
        this.toState = state;
        this.toState._addIncomingTransition(this);
    }
    ;
    /**
     * Get this transition's content payload
     */
    getPayload() { return this.payload; }
    ;
    /**
     * Set this transition's payload
     * @param payload The new payload
     */
    setPayload(payload) {
        this.payload = payload;
    }
    ;
}
exports.Transition = Transition;
;
//# sourceMappingURL=Transition.js.map