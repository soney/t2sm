"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const State_1 = require("./State");
const Transition_1 = require("./Transition");
class StateContainer {
    constructor(startStateName = 'start') {
        this.states = new Map();
        this.fireFunctions = new Map();
        this.startState = this.activeState = new State_1.StartState();
        this.states.set(startStateName, this.startState);
    }
    ;
    getStateLabel(state) {
        for (let label in this.states.keys()) {
            if (this.states.get(label) === state) {
                return label;
            }
        }
        return null;
    }
    ;
    hasState(label) {
        return this.states.has(label);
    }
    ;
    addState(payload, label = this.getUniqueStateLabel()) {
        if (this.hasState(label)) {
            throw new Error(`State container already has a state with label ${label}`);
        }
        else {
            const state = new State_1.State(payload);
            this.states.set(label, state);
            return label;
        }
    }
    ;
    removeState(label) {
        const state = this.getState(label);
        if (state) {
            state.destroy();
            this.states.delete(label);
            return this;
        }
        else {
            throw new Error(`State container does not have a state with label ${label}`);
        }
    }
    ;
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
    }
    ;
    getState(label) {
        return this.states.get(label);
    }
    ;
    addTransition(fromLabel, toLabel, payload) {
        if (!this.hasState(fromLabel)) {
            throw new Error(`State container does not have a state with label ${fromLabel}`);
        }
        if (!this.hasState(toLabel)) {
            throw new Error(`State container does not have a state with label ${toLabel}`);
        }
        const fromState = this.getState(fromLabel);
        const toState = this.getState(toLabel);
        const transition = new Transition_1.Transition(fromState, toState, payload);
        const { fire } = transition;
        this.fireFunctions.set(fire, transition);
        return fire;
    }
    ;
    removeTransition(fireFn) {
        if (this.fireFunctions.has(fireFn)) {
            const transition = this.fireFunctions.get(fireFn);
            transition.remove();
            this.fireFunctions.delete(fireFn);
            return this;
        }
        else {
            throw new Error('Could not find transition');
        }
    }
    ;
    getActiveState() { return this.getStateLabel(this.activeState); }
    ;
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
    getStates() {
        return Array.from(this.states.keys());
    }
    ;
    getUniqueStateLabel() {
        const prefix = 'state_';
        let i = 0;
        while (this.hasState(`${prefix}${i}`)) {
            i++;
        }
        return `${prefix}${i}`;
    }
    ;
    getStartState() {
        return this.getStateLabel(this.startState);
    }
    ;
}
exports.StateContainer = StateContainer;
;
class MergableFSM extends StateContainer {
    constructor(transitionsEqual, startStateName) {
        super(startStateName);
        this.transitionsEqual = transitionsEqual;
    }
    ;
    iterateMerge() {
        const similarityScores = this.computeSimilarityScores();
        const sortedStates = Array.from(similarityScores.entries()).sort((a, b) => a[1] - b[1]);
        const [toMergeS1, toMergeS2] = sortedStates[0][0];
        this.mergeStates(toMergeS1, toMergeS2);
    }
    ;
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
    equivalentTransitions(transitionSet1, transitionSet2) {
        const rv = [];
        for (let i = 0; i < transitionSet1.length; i++) {
            const t1 = transitionSet1[i];
            for (let j = 0; j < transitionSet2.length; j++) {
                const t2 = transitionSet2[i];
                if (this.transitionsEqual(t1.getPayload(), t2.getPayload())) {
                    rv.push([t1, t2]);
                    break;
                }
            }
        }
        return rv;
    }
    ;
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