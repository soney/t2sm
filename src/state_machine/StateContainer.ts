import {AbstractState, StartState, State} from './State';
import {Transition} from './Transition';

export abstract class StateContainer<S,T> {
    protected startState:StartState<S,T>;
    private activeState:AbstractState<S,T>;
    protected states:Map<string, AbstractState<S,T>> = new Map<string, AbstractState<S,T>>();
    private fireFunctions:Map<Function, Transition<S,T>> = new Map<Function, Transition<S,T>>();
    constructor(startStateName:string='start') {
        this.startState = this.activeState = new StartState();
        this.states.set(startStateName, this.startState);
    };
    protected getStateLabel(state:AbstractState<S,T>):string {
        for(let label in this.states.keys()) {
            if(this.states.get(label) === state) {
                return label;
            }
        }
        return null;
    };
    public hasState(label:string):boolean {
        return this.states.has(label);
    };
    public addState(payload?:S, label:string=this.getUniqueStateLabel()):string {
        if(this.hasState(label)) {
            throw new Error(`State container already has a state with label ${label}`);
        } else {
            const state = new State<S,T>(payload);
            this.states.set(label, state);
            return label;
        }
    };
    public removeState(label:string):this {
        const state = this.getState(label);
        if(state) {
            state.destroy();
            this.states.delete(label);
            return this;
        } else {
            throw new Error(`State container does not have a state with label ${label}`);
        }
    };
    public renameState(fromLabel:string, toLabel:string):void {
        if(!this.hasState(fromLabel)) { throw new Error(`State container does not have a state with label ${fromLabel}`); }
        if(this.hasState(toLabel)) { throw new Error(`State container already has a state with label ${toLabel}`); }

        const fromState = this.getState(fromLabel);
        this.states.delete(fromLabel);
        this.states.set(toLabel, fromState);
    };
    protected getState(label:string):AbstractState<S,T> {
        return this.states.get(label) as AbstractState<S,T>;
    };
    public addTransition(fromLabel:string, toLabel:string, payload?:any):Function {
        if(!this.hasState(fromLabel)) { throw new Error(`State container does not have a state with label ${fromLabel}`); }
        if(!this.hasState(toLabel)) { throw new Error(`State container does not have a state with label ${toLabel}`); }

        const fromState = this.getState(fromLabel);
        const toState = this.getState(toLabel);

        const transition = new Transition(fromState, toState, payload);
        const {fire} = transition;

        this.fireFunctions.set(fire, transition);

        return fire;
    };
    public removeTransition(fireFn:Function):this {
        if(this.fireFunctions.has(fireFn)) {
            const transition = this.fireFunctions.get(fireFn) as Transition<S,T>;
            transition.remove();
            this.fireFunctions.delete(fireFn);
            return this;
        } else {
            throw new Error('Could not find transition');
        }
    };
    public getActiveState():string { return this.getStateLabel(this.activeState); };
    public setActiveState(label:string):this {
        if(!this.hasState(label)) { throw new Error(`State container does not have a state with label ${label}`); }
        if(this.activeState) {
            this.activeState.setIsActive(false);
        }
        const state = this.getState(label);
        state.setIsActive(true);
        return this;
    };
    public getStates():string[] {
        return Array.from(this.states.keys());
    };
    protected getUniqueStateLabel():string {
        const prefix = 'state_';
        let i = 0;
        while(this.hasState(`${prefix}${i}`)) { i++; }
        return `${prefix}${i}`;
    };
    public getStartState():string {
        return this.getStateLabel(this.startState);
    };
};

type Pair<E> = [E,E];
type EqualityCheck<E> = (i1:E, i2:E) => boolean;
type SimilarityScore<E> = (i1:E, i2:E) => number;

export class MergableFSM<S,T> extends StateContainer<S,T> {
    constructor(private transitionsEqual:EqualityCheck<T>, startStateName?:string) {
        super(startStateName);
    };
    public iterateMerge():void {
        const similarityScores = this.computeSimilarityScores();
        const sortedStates = Array.from(similarityScores.entries()).sort((a, b) => a[1]-b[1]);

        const [toMergeS1, toMergeS2] = sortedStates[0][0];
        this.mergeStates(toMergeS1, toMergeS2);
    };
    private computeSimilarityScores():Map<Pair<AbstractState<S,T>>, number> {
        const rv = new Map<Pair<AbstractState<S,T>>, number>();
        const states = Array.from(this.states.values());
        for(let i:number = 0; i<states.length; i++) {
            const si = states[i];
            for(let j:number = i+1; j<states.length; j++) {
                const sj = states[j];
                this.getSimilarityScore(si, sj, rv);
            }
        }
        return rv;
    };
    private equivalentTransitions(transitionSet1:Transition<S,T>[], transitionSet2:Transition<S,T>[]):Pair<Transition<S,T>>[] {
        const rv:Pair<Transition<S,T>>[] = [];
        for(let i:number = 0; i<transitionSet1.length; i++) {
            const t1 = transitionSet1[i];
            for(let j:number = 0; j<transitionSet2.length; j++) {
                const t2 = transitionSet2[i];
                if(this.transitionsEqual(t1.getPayload(), t2.getPayload())) {
                    rv.push([t1, t2]);
                    break;
                }
            }
        }
        return rv;
    };

    private getSimilarityScore(state1:AbstractState<S,T>, state2:AbstractState<S,T>, scoreMap:Map<Pair<AbstractState<S,T>>, number> = new Map<Pair<AbstractState<S,T>>, number>()):number {
        let score:number = 0;
        const equivalentOutgoingTransitions:Pair<Transition<S,T>>[] = this.equivalentTransitions(state1._getOutgoingTransitions(), state2._getOutgoingTransitions());

        equivalentOutgoingTransitions.forEach((pair) => {
            score++;
            scoreMap.set([state1, state2], score);

            const [t1, t2] = pair;

            const t1Dest = t1.getToState();
            const t2Dest = t2.getToState();
            if(scoreMap.has([t1Dest, t2Dest])) {
                score += scoreMap.get([t1Dest, t2Dest]);
            } else {
                score += this.getSimilarityScore(t1Dest, t2Dest, scoreMap);
            }
        });

        return score;
    };

    public addTrace(trace:[T,S][]) {
        let currentState = this.getStartState();
        trace.forEach((item) => {
            const [t,s] = item;

            const outgoingTransitions = this.getState(currentState)._getOutgoingTransitions();
            let transitionExists:boolean = false;
            let existingState:AbstractState<S,T>;
            for(let i = 0; i<outgoingTransitions.length; i++) {
                const outgoingTransition = outgoingTransitions[i];
                if(this.transitionsEqual(outgoingTransition.getPayload(), t)) {
                    transitionExists = true;
                    existingState = outgoingTransition.getToState();
                    break;
                }
            }

            if(transitionExists) {
                currentState = this.getStateLabel(existingState);
            } else {
                const newState = this.addState(s);
                this.addTransition(currentState, newState, t);
                currentState = newState;
            }
        });
    };

    private mergeStates(removeState:AbstractState<S,T>, mergeInto:AbstractState<S,T>):void {
        const mergeIntoOutgoingTransitions = mergeInto._getOutgoingTransitions();

        removeState._getOutgoingTransitions().forEach((t) => {
            const tPayload = t.getPayload();
            let hasConflict:boolean = false;
            for(let i in mergeIntoOutgoingTransitions) {
                const t2 = mergeIntoOutgoingTransitions[i];
                const t2Payload = t2.getPayload();
                if(this.transitionsEqual(tPayload, t2Payload)) {
                    hasConflict = true;
                    break;
                }
            }
            if(hasConflict) {
                t.remove();
            } else {
                t.setFromState(mergeInto);
            }
        });
        removeState._getIncomingTransitions().forEach((t) => {
            t.setToState(mergeInto);
        });
        this.removeState(this.getStateLabel(removeState));
    };
};