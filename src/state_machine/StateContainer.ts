import {AbstractState, StartState, State} from './State';
import {Transition} from './Transition';

export abstract class StateContainer {
    private subStates:AbstractState[] = [];
    private startState:StartState = new StartState('start');
    private activeState:AbstractState = this.startState;
    private states:Map<string, AbstractState> = new Map<string, AbstractState>();
    private fireFunctions:Map<Function, Transition> = new Map<Function, Transition>();
    constructor() {
        this.states.set(this.startState.getLabel(), this.startState);
    };
    public hasState(label:string):boolean {
        return this.states.has(label);
    };
    public addState(label:string=this.getUniqueStateLabel()):string {
        if(this.hasState(label)) {
            throw new Error(`State container already has a state with label ${label}`);
        } else {
            const state = new State(label);
            this.states.set(label, state);
            return label;
        }
    };
    public removeState(label:string):this {
        const state = this.states.get(label) as AbstractState;
        if(state) {
            state.destroy();
            this.states.delete(label);
            return this;
        } else {
            throw new Error(`State container does not have a state with label ${label}`);
        }
    };
    public renameState(fromLabel:string, toLabel:string):this {
        if(!this.hasState(fromLabel)) { throw new Error(`State container does not have a state with label ${fromLabel}`); }
        if(this.hasState(toLabel)) { throw new Error(`State container already has a state with label ${toLabel}`); }

        const fromState = this.states.get(fromLabel) as AbstractState;
        fromState.setLabel(toLabel);

        return this;
    };
    public addTransition(fromLabel:string, toLabel:string):Function {
        if(!this.hasState(fromLabel)) { throw new Error(`State container does not have a state with label ${fromLabel}`); }
        if(!this.hasState(toLabel)) { throw new Error(`State container does not have a state with label ${toLabel}`); }

        const fromState = this.states.get(fromLabel) as AbstractState;
        const toState = this.states.get(toLabel) as AbstractState;

        const transition = fromState.addOutgoingTransition(toState);
        const {fire} = transition;

        this.fireFunctions.set(fire, transition);

        return fire;
    };
    public removeTransition(fireFn:Function):this {
        if(this.fireFunctions.has(fireFn)) {
            const transition = this.fireFunctions.get(fireFn) as Transition;
            transition.remove();
            this.fireFunctions.delete(fireFn);
            return this;
        } else {
            throw new Error('Could not find transition');
        }
    };
    public getActiveState():string { return this.activeState.getLabel(); };
    public setActiveState(label:string):this {
        if(!this.hasState(label)) { throw new Error(`State container does not have a state with label ${label}`); }
        if(this.activeState) {
            this.activeState.setIsActive(false);
        }
        const state = this.states.get(label) as AbstractState;
        state.setIsActive(true);
        return this;
    };
    public getStates():string[] {
        return Array.from(this.states.keys());
    };
    private getUniqueStateLabel():string {
        const prefix = 'state_';
        let i = 0;
        while(this.hasState(`${prefix}${i}`)) { i++; }
        return `${prefix}${i}`;
    };
};