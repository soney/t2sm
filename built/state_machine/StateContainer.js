"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const State_1 = require("./State");
class StateContainer {
    constructor() {
        this.subStates = [];
        this.startState = new State_1.StartState('start');
        this.activeState = this.startState;
        this.states = new Map();
        this.fireFunctions = new Map();
        this.states.set(this.startState.getLabel(), this.startState);
    }
    ;
    hasState(label) {
        return this.states.has(label);
    }
    ;
    addState(label = this.getUniqueStateLabel()) {
        if (this.hasState(label)) {
            throw new Error(`State container already has a state with label ${label}`);
        }
        else {
            const state = new State_1.State(label);
            this.states.set(label, state);
            return label;
        }
    }
    ;
    removeState(label) {
        const state = this.states.get(label);
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
        const fromState = this.states.get(fromLabel);
        fromState.setLabel(toLabel);
        return this;
    }
    ;
    addTransition(fromLabel, toLabel) {
        if (!this.hasState(fromLabel)) {
            throw new Error(`State container does not have a state with label ${fromLabel}`);
        }
        if (!this.hasState(toLabel)) {
            throw new Error(`State container does not have a state with label ${toLabel}`);
        }
        const fromState = this.states.get(fromLabel);
        const toState = this.states.get(toLabel);
        const transition = fromState.addOutgoingTransition(toState);
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
    getActiveState() { return this.activeState.getLabel(); }
    ;
    setActiveState(label) {
        if (!this.hasState(label)) {
            throw new Error(`State container does not have a state with label ${label}`);
        }
        if (this.activeState) {
            this.activeState.setIsActive(false);
        }
        const state = this.states.get(label);
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
}
exports.StateContainer = StateContainer;
;
//# sourceMappingURL=StateContainer.js.map