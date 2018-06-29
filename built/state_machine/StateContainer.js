"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const State_1 = require("./State");
const Transition_1 = require("./Transition");
const events_1 = require("events");
class StateContainer extends events_1.EventEmitter {
    /**
     * Create a new StateContainer
     * @param startStateName The label for the start state
     */
    constructor(startStateName = 'start') {
        super();
        this.states = new Map(); // States are indexed by name (string)
        this.stateLabels = new Map(); // Map back from states to labels
        this.transitions = new Map(); // Transitions are indexed by name too
        this.transitionLabels = new Map(); // Map back from transitions to labels
        /**
         * Called whenever a state is active
         */
        this.onStateActive = (state) => {
            this.activeState = state;
        };
        this.startState = this.activeState = new State_1.StartState();
        this.states.set(startStateName, this.startState);
        this.stateLabels.set(this.startState, startStateName);
        this.startState.setIsActive(true);
    }
    ;
    /**
     * Get the label of a state
     * @param state The AbstractState object we are searching for
     */
    getStateLabel(state) {
        return this.stateLabels.get(state);
    }
    ;
    /**
     * Check if a state is in this container
     * @param label The label of the state to check
     * @returns true if the state is in this container; false otherwise
     */
    hasState(label) { return this.states.has(label); }
    ;
    /**
     * Get the state object representing a given state
     * @param label The state to get
     * @returns the state object
     */
    getState(label) { return this.states.get(label); }
    ;
    /**
     * Get the payload of a given state
     * @param label The label of the state whose payload we are fetching
     * @returns The state's payload
     */
    getStatePayload(label) {
        if (this.hasState(label)) {
            return this.getState(label).getPayload();
        }
        else {
            throw new Error(`Could not find state with label ${label}`);
        }
    }
    ;
    /**
     * Set the payload of a given state
     * @param label The label of the  state whose payload we are modifying
     * @param payload The new payload
     */
    setStatePayload(label, payload) {
        if (this.hasState(label)) {
            this.getState(label).setPayload(payload);
            return this;
        }
        else {
            throw new Error(`Could not find state with label ${label}`);
        }
    }
    ;
    /**
     * Get a transition from its label
     * @param label The label for the transition
     * @returns the transition object
     */
    getTransition(label) { return this.transitions.get(label); }
    ;
    /**
     * Check if this container has a given transition
     * @param label The label of the transition
     * @returns true if this state machine has a transition with that label, false otherwise
     */
    hasTransition(label) { return this.transitions.has(label); }
    ;
    /**
     * Get the label of a transition
     * @param state The Transition object we are searching for
     */
    getTransitionLabel(transition) {
        return this.transitionLabels.get(transition);
    }
    ;
    /**
     * Get the payload of a given transition
     * @param label The label of the transition
     * @returns The payload for the transition
     */
    getTransitionPayload(label) {
        if (this.hasTransition(label)) {
            return this.getTransition(label).getPayload();
        }
        else {
            throw new Error(`Could not find transition ${label}`);
        }
    }
    ;
    /**
     * Set the payload of a given transition
     * @param label The label of the transition
     * @param payload The new payload
     */
    setTransitionPayload(label, payload) {
        if (this.hasTransition(label)) {
            this.getTransition(label).setPayload(payload);
            return this;
        }
        else {
            throw new Error(`Could not find transition ${label}`);
        }
    }
    ;
    /**
     * Fire a transition by its label
     * @param label The label of the transition
     * @param event The content of the event
     * @param source Information about the source firing this transition
     */
    fireTransition(label, event, source) {
        if (this.hasTransition(label)) {
            const transition = this.getTransition(label);
            transition.fire(event, source);
            return this;
        }
        else {
            throw new Error(`Could not find transition ${label}`);
        }
    }
    ;
    /**
     * Creates a function that will fire a given transition when called
     * @param label The transition that we are getting a fire function for
     * @returns a function that will fire the given transition
     */
    getFireFunction(label) {
        return this.fireTransition.bind(this, label);
    }
    ;
    /**
     * Add a new state to this container
     * @param payload The payload of the new state
     * @param label (optional) the label of the new state; auto-generated if not given
     * @returns The new state's label
     */
    addState(payload, label = this.getUniqueStateLabel()) {
        if (this.hasState(label)) {
            throw new Error(`State container already has a state with label ${label}`);
        }
        else {
            const state = new State_1.State(payload);
            this.states.set(label, state);
            this.stateLabels.set(state, label);
            state.addListener('active', this.onStateActive);
            return label;
        }
    }
    ;
    /**
     * Remove a state from the list of states
     * @param label The label of the state to remove
     */
    removeState(label) {
        const state = this.getState(label);
        if (state) {
            state.remove();
            this.states.delete(label);
            this.stateLabels.delete(state);
            state.removeListener('active', this.onStateActive);
            return this;
        }
        else {
            throw new Error(`State container does not have a state with label ${label}`);
        }
    }
    ;
    /**
     * Change the name of a state
     * @param fromLabel The old state label
     * @param toLabel The new state label
     */
    renameState(fromLabel, toLabel) {
        if (!this.hasState(fromLabel)) {
            throw new Error(`State container does not have a state with label ${fromLabel}`);
        }
        if (this.hasState(toLabel)) {
            throw new Error(`State container already has a state with label ${toLabel}`);
        }
        const fromState = this.getState(fromLabel);
        this.states.delete(fromLabel);
        this.states.set(toLabel, fromState);
        this.stateLabels.set(fromState, toLabel);
        return this;
    }
    ;
    /**
     * Change the name of a transition
     * @param fromLabel The old transition label
     * @param toLabel The new transition label
     */
    renameTransition(fromLabel, toLabel) {
        if (!this.hasTransition(fromLabel)) {
            throw new Error(`State container does not have a transition with label ${fromLabel}`);
        }
        if (this.hasTransition(toLabel)) {
            throw new Error(`State container already has a transition with label ${toLabel}`);
        }
        const transition = this.getTransition(fromLabel);
        this.transitions.delete(fromLabel);
        this.transitions.set(toLabel, transition);
        this.transitionLabels.set(transition, toLabel);
        return this;
    }
    ;
    /**
     * Add a new transition
     *
     * @param fromLabel The label of the state this transition leaves from
     * @param toLabel The label of the state this transition goes to
     * @param payload The payload for the new transition
     * @param label The label for the new transition (automatically determined if not given)
     *
     * @returns The label of the new transition
     */
    addTransition(fromLabel, toLabel, payload, label = this.getUniqueTransitionLabel()) {
        if (!this.hasState(fromLabel)) {
            throw new Error(`State container does not have a state with label ${fromLabel}`);
        }
        if (!this.hasState(toLabel)) {
            throw new Error(`State container does not have a state with label ${toLabel}`);
        }
        if (this.hasTransition(label)) {
            throw new Error(`Container already has a transition with label ${label}`);
        }
        ;
        const fromState = this.getState(fromLabel);
        const toState = this.getState(toLabel);
        const transition = new Transition_1.Transition(fromState, toState, payload);
        this.transitions.set(label, transition);
        this.transitionLabels.set(transition, label);
        return label;
    }
    ;
    /**
     * Remove a transition by label
     * @param label The label of the transition to remove
     */
    removeTransition(label) {
        if (this.hasTransition(label)) {
            const transition = this.getTransition(label);
            transition.remove();
            this.transitions.delete(label);
            this.transitionLabels.delete(transition);
            return this;
        }
        else {
            throw new Error('Could not find transition');
        }
    }
    ;
    /**
     * Get the label of the active state
     * @returns The label of the currently active state
     */
    getActiveState() { return this.getStateLabel(this.activeState); }
    ;
    /**
     * Changes which state is active in this container
     * @param label The label of the new active state
     */
    setActiveState(label) {
        if (!this.hasState(label)) {
            throw new Error(`State container does not have a state with label ${label}`);
        }
        if (this.activeState) {
            this.activeState.setIsActive(false);
        }
        const state = this.getState(label);
        state.setIsActive(true);
        return this;
    }
    ;
    /**
     * Get the label of every state in this container
     * @returns a list of states in this container
     */
    getStates() {
        return Array.from(this.states.keys());
    }
    ;
    /**
     * @returns a state name that will be unique for this container
     */
    getUniqueStateLabel() {
        const prefix = 'state_';
        let i = 0;
        while (this.hasState(`${prefix}${i}`)) {
            i++;
        }
        return `${prefix}${i}`;
    }
    ;
    /**
     * @returns a transition name that will be unique for this container
     */
    getUniqueTransitionLabel() {
        const prefix = 'transition_';
        let i = 0;
        while (this.hasTransition(`${prefix}${i}`)) {
            i++;
        }
        return `${prefix}${i}`;
    }
    ;
    /**
     * @returns the name of the start state
     */
    getStartState() {
        return this.getStateLabel(this.startState);
    }
    ;
    /**
     * Check if a given state is a start state
     * @param label The state to check
     * @returns true if the state is a start state and false otherwise
     */
    isStartState(label) {
        if (!this.hasState(label)) {
            throw new Error(`State container does not have a state with label ${label}`);
        }
        return this.getState(label).isStartState();
    }
    /**
     * Get the list of transitions leaving a state
     * @param label The state name for which we are getting outgoing transitions
     */
    getOutgoingTransitions(label) {
        if (!this.hasState(label)) {
            throw new Error(`State container does not have a state with label ${label}`);
        }
        const state = this.getState(label);
        const transitions = state._getOutgoingTransitions();
        return transitions.map((t) => this.getTransitionLabel(t));
    }
    ;
    /**
     * Get the list of transitions entering a state
     * @param label The state name for which we are getting incoming transitions
     */
    getIncomingTransitions(label) {
        if (!this.hasState(label)) {
            throw new Error(`State container does not have a state with label ${label}`);
        }
        const state = this.getState(label);
        const transitions = state._getIncomingTransitions();
        return transitions.map((t) => this.getTransitionLabel(t));
    }
    ;
    /**
     * Get the state that a transition goes to
     * @param label The transition label
     * @returns The label of the state this transition goes to
     */
    getTransitionTo(label) {
        if (!this.hasTransition(label)) {
            throw new Error(`State container does not have a transition with label ${label}`);
        }
        const transition = this.getTransition(label);
        return this.getStateLabel(transition.getToState());
    }
    ;
    /**
     * Get he state that a transition leaves from
     * @param label The transition label
     * @returns The label of the state that this transition leaves from
     */
    getTransitionFrom(label) {
        if (!this.hasTransition(label)) {
            throw new Error(`State container does not have a transition with label ${label}`);
        }
        const transition = this.getTransition(label);
        return this.getStateLabel(transition.getFromState());
    }
    ;
    /**
     * Change the state that a transition goes to
     * @param label The transition label
     * @param toState The label of the state that it should now go to
     */
    setTransitionTo(label, toState) {
        if (!this.hasTransition(label)) {
            throw new Error(`State container does not have a transition with label ${label}`);
        }
        if (!this.hasState(toState)) {
            throw new Error(`State container does not have a state with label ${toState}`);
        }
        const transition = this.getTransition(label);
        transition.setToState(this.getState(toState));
        return this;
    }
    ;
    /**
     * Change the state that a transition leaves from
     * @param label The transition label
     * @param fromState The label of the state that it should now leave from
     */
    setTransitionFrom(label, fromState) {
        if (!this.hasTransition(label)) {
            throw new Error(`State container does not have a transition with label ${label}`);
        }
        if (!this.hasState(fromState)) {
            throw new Error(`State container does not have a state with label ${fromState}`);
        }
        const transition = this.getTransition(label);
        transition.setFromState(this.getState(fromState));
        return this;
    }
    ;
    /**
     * Convert this state machine into a printable representation
     */
    toString() {
        const dividierWidth = 40;
        const divider = '~'.repeat(dividierWidth);
        const stateWidth = 10;
        const tabWidth = 4;
        const spaceOut = (word) => {
            const wordLength = word.length;
            const spacesBefore = Math.round((dividierWidth - wordLength) / 2);
            return ' '.repeat(spacesBefore) + word;
        };
        const pad = (word, width) => {
            const toAdd = width - word.length;
            if (toAdd > 0) {
                return word + ' '.repeat(toAdd);
            }
            else {
                return word;
            }
        };
        let rv = `${divider}\n${spaceOut('FSM')}\n${divider}\n`;
        this.getStates().forEach((state) => {
            rv += `${pad(state + ':', stateWidth)} ${this.getStatePayload(state)}\n`;
            const outgoingTransitions = this.getOutgoingTransitions(state);
            if (outgoingTransitions.length > 0) {
                outgoingTransitions.forEach((t) => {
                    const payload = this.getTransitionPayload(t);
                    rv += pad(`${' '.repeat(tabWidth)} --(${t})--> ${this.getTransitionTo(t)}`, 30);
                    rv += `: ${this.getTransitionPayload(t)}\n`;
                });
            }
        });
        return rv;
    }
    ;
    /**
     * Clean up all of the objects stored in this container
     */
    destroy() {
        this.states.clear();
        this.stateLabels.clear();
        this.transitions.clear();
        this.transitionLabels.clear();
    }
    ;
}
exports.StateContainer = StateContainer;
;
const default_equality_check = (a, b) => a === b;
class MergableFSM extends StateContainer {
    constructor(transitionsEqual = default_equality_check, startStateName) {
        super(startStateName);
        this.transitionsEqual = transitionsEqual;
    }
    ;
    /**
     * Iterate and merge the best candidates
     */
    iterateMerge() {
        const similarityScores = this.computeSimilarityScores();
        const sortedStates = Array.from(similarityScores.entries()).sort((a, b) => a[1] - b[1]);
        const [toMergeS1, toMergeS2] = sortedStates[0][0];
        this.mergeStates(toMergeS1, toMergeS2);
    }
    ;
    /**
     * Compute a similarity score of every pair of states
     */
    computeSimilarityScores() {
        const rv = new Map();
        const states = Array.from(this.states.values());
        for (let i = 0; i < states.length; i++) {
            const si = states[i];
            for (let j = i + 1; j < states.length; j++) {
                const sj = states[j];
                this.getSimilarityScore(si, sj, rv);
            }
        }
        return rv;
    }
    ;
    /**
     * Get a list of equivalent transitions from two sets of transitions
     * @param transitionSet1 The first set of transitions
     * @param transitionSet2 The second set of transitions
     * @returns A list of pairs of transitions that are common between transitionSet1 and transitionSet2
     */
    equivalentTransitions(transitionSet1, transitionSet2) {
        const rv = [];
        for (let i = 0; i < transitionSet1.length; i++) {
            const t1 = transitionSet1[i];
            for (let j = 0; j < transitionSet2.length; j++) {
                const t2 = transitionSet2[j];
                if (this.transitionsEqual(t1.getPayload(), t2.getPayload())) {
                    rv.push([t1, t2]);
                    break;
                }
            }
        }
        return rv;
    }
    ;
    /**
     *
     * @param state1 First state
     * @param state2 Second state
     * @param scoreMap The scores so far
     */
    getSimilarityScore(state1, state2, scoreMap = new Map()) {
        let score = 0;
        const equivalentOutgoingTransitions = this.equivalentTransitions(state1._getOutgoingTransitions(), state2._getOutgoingTransitions());
        equivalentOutgoingTransitions.forEach((pair) => {
            score++;
            scoreMap.set([state1, state2], score);
            const [t1, t2] = pair;
            const t1Dest = t1.getToState();
            const t2Dest = t2.getToState();
            if (scoreMap.has([t1Dest, t2Dest])) {
                score += scoreMap.get([t1Dest, t2Dest]);
            }
            else {
                score += this.getSimilarityScore(t1Dest, t2Dest, scoreMap);
            }
        });
        return score;
    }
    ;
    /**
     * Add a new "trace" through a program
     */
    addTrace(trace) {
        let currentState = this.getStartState();
        trace.forEach((item) => {
            const [t, s] = item;
            const outgoingTransitions = this.getState(currentState)._getOutgoingTransitions();
            let transitionExists = false;
            let existingState;
            for (let i = 0; i < outgoingTransitions.length; i++) {
                const outgoingTransition = outgoingTransitions[i];
                if (this.transitionsEqual(outgoingTransition.getPayload(), t)) {
                    transitionExists = true;
                    existingState = outgoingTransition.getToState();
                    break;
                }
            }
            if (transitionExists) {
                currentState = this.getStateLabel(existingState);
            }
            else {
                const newState = this.addState(s);
                this.addTransition(currentState, newState, t);
                currentState = newState;
            }
        });
    }
    ;
    /**
     * Merge two states together
     */
    mergeStates(removeState, mergeInto) {
        const mergeIntoOutgoingTransitions = mergeInto._getOutgoingTransitions();
        removeState._getOutgoingTransitions().forEach((t) => {
            const tPayload = t.getPayload();
            let hasConflict = false;
            for (let i in mergeIntoOutgoingTransitions) {
                const t2 = mergeIntoOutgoingTransitions[i];
                const t2Payload = t2.getPayload();
                if (this.transitionsEqual(tPayload, t2Payload)) {
                    hasConflict = true;
                    break;
                }
            }
            if (hasConflict) {
                t.remove();
            }
            else {
                t.setFromState(mergeInto);
            }
        });
        removeState._getIncomingTransitions().forEach((t) => {
            t.setToState(mergeInto);
        });
        this.removeState(this.getStateLabel(removeState));
    }
    ;
}
exports.MergableFSM = MergableFSM;
;
//# sourceMappingURL=StateContainer.js.map