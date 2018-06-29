"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
/**
 * A class representing a state in a state machine
 */
class AbstractState extends events_1.EventEmitter {
    constructor(payload) {
        super();
        this.payload = payload;
        this.active = false; // Whether this state is currently active
        this.outgoingTransitions = []; // All of the transitions that leave this state
        this.incomingTransitions = []; // All of the transitions that enter this state
        /**
         * Called when a transition leaving this state was fired
         */
        this.onOutgoingTransitionFired = (transition, event, source) => {
            if (this.isActive()) {
                const toState = transition.getToState();
                // Need to set self to inactive *before* setting the other to active
                // in case it's a transition back to myself
                this.setIsActive(false);
                toState.setIsActive(true);
            }
            else {
                throw new Error('Received transition fired event while not active');
            }
        };
    }
    ;
    /**
     * Get the data attached to this state
     */
    getPayload() { return this.payload; }
    ;
    /**
     * Set the data attached to this state
     * @param payload The new payload
     */
    setPayload(payload) { this.payload = payload; }
    ;
    /**
     * Get all of the transitions leaving this state (should only be used internally)
     */
    _getOutgoingTransitions() { return this.outgoingTransitions; }
    ;
    /**
     * Get all of the transitions entering this state (should only be used internally)
     */
    _getIncomingTransitions() { return this.incomingTransitions; }
    ;
    /**
     * Mark a new transition as leaving from this state (should only be used internally)
     * @param transition The transition to add to the list of outgoing transitions
     */
    _addOutgoingTransition(transition) {
        this.outgoingTransitions.push(transition);
        if (this.isActive()) {
            transition.setEligible(true);
            transition.addListener('fire', this.onOutgoingTransitionFired);
        }
        else {
            transition.setEligible(false);
        }
    }
    ;
    /**
     * Remove a transition from the list of outgoing transitions
     * @param transition The transition to remove
     * @return true if the transition was removed; false otherwise
     */
    _removeOutgoingTransition(transition) {
        const index = this.outgoingTransitions.indexOf(transition);
        if (index >= 0) {
            this.outgoingTransitions.splice(index, 1);
            if (this.isActive()) {
                transition.setEligible(false);
                transition.removeListener('fire', this.onOutgoingTransitionFired);
            }
            return true;
        }
        else {
            return false;
        }
    }
    ;
    /**
     * Mark a new transition as going to this state (should only be used internally)
     * @param transition The transition to add to the list of incoming transitions
     */
    _addIncomingTransition(transition) {
        this.incomingTransitions.push(transition);
    }
    ;
    /**
     * Remove a transition from the list of incoming transitions
     * @param transition The transition to remove
     * @returns true if the transition was removed; false otherwise
     */
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
    /**
     * @return true if this state is active and false otherwise
     */
    isActive() { return this.active; }
    ;
    /**
     * Change whether this state is active or not
     * @param active Whether or not the state should be active
     */
    setIsActive(active) {
        this.active = active;
        if (this.isActive()) {
            this.addOutgoingTransitionListeners();
            this.emit('active', this);
        }
        else {
            this.removeOutgoingTransitionListeners();
            this.emit('not_active', this);
        }
    }
    ;
    /**
     * Enable outgoing transition listeners for when this state is active
     */
    addOutgoingTransitionListeners() {
        this.outgoingTransitions.forEach((ot) => {
            ot.setEligible(true);
            ot.addListener('fire', this.onOutgoingTransitionFired);
        });
    }
    ;
    /**
     * Disable outgoing transition listeners for when this state is inactive
     */
    removeOutgoingTransitionListeners() {
        this.outgoingTransitions.forEach((ot) => {
            ot.setEligible(false);
            ot.removeListener('fire', this.onOutgoingTransitionFired);
        });
    }
    ;
    /**
     * Remove this state
     */
    remove() {
        this.removeOutgoingTransitionListeners();
        this.incomingTransitions.forEach((it) => it.remove());
        this.outgoingTransitions.forEach((ot) => ot.remove());
    }
    ;
}
exports.AbstractState = AbstractState;
;
/**
 * A class representing a starting state
 */
class StartState extends AbstractState {
    constructor(payload) {
        super(payload);
    }
    ;
    /**
     * Adds an outgoing transition (only one allowed)
     * @param transition The transition to add
     */
    _addOutgoingTransition(transition) {
        if (this._getOutgoingTransitions().length > 0) {
            throw new Error('Can only have one outgoing transition from a start state');
        }
        else {
            super._addOutgoingTransition(transition);
        }
    }
    ;
    /**
     * Throws an exception; start states cannot have incoming transitions
     */
    _addIncomingTransition(transition) {
        throw new Error('Start states cannot have incoming transitions');
    }
    ;
    /**
     * @returns true (to represent that this is a start state)
     */
    isStartState() { return true; }
    ;
}
exports.StartState = StartState;
;
/**
 * A class to represent a "normal" state
 */
class State extends AbstractState {
    constructor(payload) {
        super(payload);
    }
    ;
    /**
     * @returns false (to represent that this is not a start state)
     */
    isStartState() { return false; }
    ;
}
exports.State = State;
;
//# sourceMappingURL=State.js.map