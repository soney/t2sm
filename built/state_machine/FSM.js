"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const State_1 = require("./State");
const Transition_1 = require("./Transition");
const events_1 = require("events");
const lodash_1 = require("lodash");
;
;
;
;
;
;
;
;
;
;
;
;
class FSM extends events_1.EventEmitter {
    /**
     * Create a new StateContainer
     * @param startStateName The label for the start state
     */
    constructor() {
        super();
        this.states = new Map(); // States are indexed by name (string)
        this.stateLabels = new Map(); // Map back from states to labels
        this.transitions = new Map(); // Transitions are indexed by name too
        this.transitionLabels = new Map(); // Map back from transitions to labels
        this.statePayloadToString = (p) => `${p}`;
        this.transitionPayloadToString = (p) => `${p}`;
        const startStateName = '(start)';
        this.startState = this.activeState = new State_1.StartState();
        this.states.set(startStateName, this.startState);
        this.stateLabels.set(this.startState, startStateName);
        this.startState.setIsActive(true);
        this.addStateListeners(this.startState);
    }
    ;
    setStatePayloadToString(f) {
        this.statePayloadToString = f;
    }
    setTransitionPayloadToString(f) {
        this.transitionPayloadToString = f;
    }
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
            // this.emit('statePayloadChanged', {state:label, payload});
            // this.emit('update');
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
            // this.emit('transitionPayloadChanged', {transition:label, payload});
            // this.emit('update');
            return this;
        }
        else {
            throw new Error(`Could not find transition ${label}`);
        }
    }
    ;
    /**
     * Get the alias of a transition
     * @param label The label of the transition
     * @returns The alias of the transition
     */
    getTransitionAlias(label) {
        if (this.hasTransition(label)) {
            return this.getTransition(label).getAlias();
        }
        else {
            throw new Error(`Could not find transition ${label}`);
        }
    }
    ;
    /**
     * Change the alias of a transition
     * @param label The label of the transition
     * @param alias The new alias
     */
    setTransitionAlias(label, alias) {
        if (this.hasTransition(label)) {
            this.getTransition(label).setAlias(alias);
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
        const transitions = this.activeState._getOutgoingTransitions();
        for (let i = 0; i < transitions.length; i++) {
            const transition = transitions[i];
            const alias = transition.getAlias();
            if (alias && alias === label) {
                transition.fire(event, source);
                break;
            }
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
            this.addStateListeners(state);
            this.emit('stateAdded', { state: label, payload });
            this.emit('update');
            return label;
        }
    }
    ;
    /**
     * Called whenever a state is active
     */
    /**
     * Remove a state from the list of states
     * @param label The label of the state to remove
     */
    removeState(label) {
        const state = this.getState(label);
        if (label === this.getStartState()) {
            throw new Error(`Cannot remove start state ${label}`);
        }
        else if (state) {
            state.remove();
            return this;
        }
        else {
            throw new Error(`State container does not have a state with label ${label}`);
        }
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
    addTransition(fromLabel, toLabel, alias, payload, label = this.getUniqueTransitionLabel()) {
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
        const transition = new Transition_1.Transition(fromState, toState, alias, payload);
        this.transitions.set(label, transition);
        this.transitionLabels.set(transition, label);
        this.emit('transitionAdded', { transition: label, from: fromLabel, to: toLabel, alias, payload });
        this.emit('update');
        this.addTransitionListeners(transition);
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
     * Get the label of every transition in this container
     * @returns a list of transitions in this container
     */
    getTransitions() {
        return Array.from(this.transitions.keys());
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
        if (this.getTransitionTo(label) !== toState) {
            const transition = this.getTransition(label);
            transition.setToState(this.getState(toState));
        }
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
        if (this.getTransitionFrom(label) !== fromState) {
            const transition = this.getTransition(label);
            transition.setFromState(this.getState(fromState));
        }
        return this;
    }
    ;
    /**
     * Convert this state machine into a printable representation
     */
    toString() {
        const dividerWidth = 40;
        const divider = '~'.repeat(dividerWidth);
        const stateWidth = 10;
        const tabWidth = 4;
        const activeState = this.getActiveState();
        const spaceOut = (word) => {
            const wordLength = word.length;
            const spacesBefore = Math.round((dividerWidth - wordLength) / 2);
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
            rv += `${activeState === state ? '*' : ' '}${pad(state + ':', stateWidth)} ${this.statePayloadToString(this.getStatePayload(state))}\n`;
            const outgoingTransitions = this.getOutgoingTransitions(state);
            if (outgoingTransitions.length > 0) {
                outgoingTransitions.forEach((t) => {
                    rv += pad(`${' '.repeat(tabWidth)} --(${t})--> ${this.getTransitionTo(t)}`, 30);
                    rv += `: ${this.transitionPayloadToString(this.getTransitionPayload(t))}\n`;
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
        this.emit('destroyed');
        this.emit('update');
    }
    ;
    getStartTransition() {
        const ssOutgoingTransitions = this.getOutgoingTransitions(this.getStartState());
        if (ssOutgoingTransitions.length > 0) {
            return ssOutgoingTransitions[0];
        }
        else {
            return null;
        }
    }
    addStateListeners(state) {
        const stateLabel = this.getStateLabel(state);
        state.on('active', (event) => {
            const previousActiveState = this.activeState;
            let oldActiveState;
            if (previousActiveState) {
                try {
                    oldActiveState = this.getStateLabel(previousActiveState);
                }
                catch (_a) { }
            }
            this.activeState = state;
            this.emit('activeStateChanged', { state: stateLabel, oldActiveState });
            this.emit('update');
        });
        // state.on('not_active', (event: NotActiveEvent) => { });
        state.on('payloadChanged', (event) => {
            const { payload } = event;
            this.emit('statePayloadChanged', {
                state: stateLabel,
                payload
            });
            this.emit('update');
        });
        state.on('removed', (event) => {
            this.states.delete(stateLabel);
            this.stateLabels.delete(state);
            this.emit('stateRemoved', { state: stateLabel });
            this.emit('update');
        });
    }
    ;
    addTransitionListeners(transition) {
        const transitionLabel = this.getTransitionLabel(transition);
        transition.on('fromStateChanged', (event) => {
            const { oldFrom, state } = event;
            this.emit('transitionFromStateChanged', {
                transition: transitionLabel,
                oldFrom: this.getStateLabel(oldFrom),
                state: this.getStateLabel(state)
            });
            this.emit('update');
        });
        transition.on('toStateChanged', (event) => {
            const { oldTo, state } = event;
            this.emit('transitionToStateChanged', {
                transition: transitionLabel,
                oldTo: this.getStateLabel(oldTo),
                state: this.getStateLabel(state)
            });
            this.emit('update');
        });
        transition.on('payloadChanged', (event) => {
            const { payload } = event;
            this.emit('transitionPayloadChanged', {
                transition: transitionLabel,
                payload
            });
            this.emit('update');
        });
        transition.on('fire', (event) => {
            this.emit('transitionFiredEvent', {
                transition: transitionLabel,
                eligible: event.eligible,
                event: event.event
            });
            this.emit('update');
        });
        transition.on('aliasChanged', (event) => {
            const { alias } = event;
            this.emit('transitionAliasChanged', {
                transition: transitionLabel, alias
            });
            this.emit('update');
        });
        transition.on('removed', (event) => {
            const oldTo = this.getTransitionTo(transitionLabel);
            const oldFrom = this.getTransitionFrom(transitionLabel);
            this.transitions.delete(transitionLabel);
            this.transitionLabels.delete(transition);
            this.emit('transitionRemoved', { transition: transitionLabel, oldFrom, oldTo });
            this.emit('update');
        });
    }
    ;
    /**
     * Converts a JSON object (such as that exported by https://musing-rosalind-2ce8e7.netlify.com) to an FSM
     * @param jsonObj The JSON object
     */
    static fromJSON(jsonObj) {
        const rv = new FSM();
        rv.addState(jsonObj.initial, jsonObj.initial);
        lodash_1.keys(jsonObj.states).forEach((stateName) => {
            if (stateName !== jsonObj.initial) {
                rv.addState('', stateName);
            }
        });
        rv.addTransition('(start)', jsonObj.initial, 'start');
        lodash_1.forEach(jsonObj.states, (stateInfo, stateName) => {
            lodash_1.forEach(stateInfo.on, (toStateInfo, eventName) => {
                let toStateName;
                if (lodash_1.isString(toStateInfo)) {
                    toStateName = toStateInfo;
                }
                else {
                    toStateName = lodash_1.keys(toStateInfo)[0];
                }
                rv.addTransition(stateName, toStateName, eventName, eventName);
            });
        });
        return rv;
    }
    ;
    /**
     * Converts the current FSM into a JSON object readable by https://musing-rosalind-2ce8e7.netlify.com
     */
    toJSON() {
        const result = {
            initial: this.getTransitionTo(this.getOutgoingTransitions(this.getStartState())[0]),
            states: {}
        };
        const { states } = result;
        this.getStates().forEach((stateName) => {
            if (stateName !== this.getStartState()) {
                result.states[stateName] = { on: {} };
                this.getOutgoingTransitions(stateName).forEach((transition) => {
                    const transitionData = this.getTransitionPayload(transition) + '';
                    result.states[stateName].on[transitionData] = this.getTransitionTo(transition);
                });
            }
        });
        return result;
    }
    ;
    serialize() {
        const result = {
            startState: this.getStartState(),
            states: {},
            transitions: {}
        };
        const activeState = this.getActiveState();
        this.getStates().forEach((state) => {
            result.states[state] = {
                payload: this.getStatePayload(state),
                active: activeState === state
            };
        });
        this.getTransitions().forEach((transition) => {
            result.transitions[transition] = {
                payload: this.getTransitionPayload(transition),
                alias: this.getTransitionAlias(transition),
                from: this.getTransitionFrom(transition),
                to: this.getTransitionTo(transition),
            };
        });
        return result;
    }
    static deserialize(data, fsm = new FSM()) {
        lodash_1.each(data.states, (state, label) => {
            const { active, payload } = state;
            if (label === data.startState) {
                fsm.setStatePayload(label, payload);
            }
            else {
                fsm.addState(payload, label);
            }
            if (active) {
                fsm.setActiveState(label);
            }
        });
        lodash_1.each(data.transitions, (transition, label) => {
            const { from, to, payload, alias } = transition;
            fsm.addTransition(from, to, alias, payload, label);
        });
        return fsm;
    }
    ;
}
exports.FSM = FSM;
;
//# sourceMappingURL=FSM.js.map