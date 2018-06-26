import {AbstractState, StartState} from './State';

export abstract class StateContainer {
    private subStates:AbstractState[] = [];
    private startState:StartState = new StartState();
    private activeState:AbstractState = this.startState;
    constructor() {
    };
    public addSubState(...states:AbstractState[]):this {
        this.subStates.push(...states);
        return this;
    };
    public removeSubState(state:AbstractState):this {
        for(let i = 0; i<this.subStates.length; i++) {
            if(this.subStates[i] === state) {
                this.subStates.splice(i, 1);
            }
        }
        return this;
    };
    public getStartState():StartState { return this.startState; };
    public getActiveState():AbstractState { return this.activeState; };
};