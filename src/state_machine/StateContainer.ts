import {AbstractState, StartState, State, ActiveEvent, NotActiveEvent, SPayloadChangedEvent, SRemovedEvent} from './State';
import {Transition, FromStateChangedEvent, ToStateChangedEvent, TPayloadChangedEvent, FireEvent, AliasChangedEvent, TRemovedEvent} from './Transition';
import { EventEmitter } from 'events';
import { HashMap } from '../utils/HashMap';
import {keys, forEach, isString} from 'lodash';

export interface StateAddedEvent {
    state: string,
    payload: any
};

export interface StateRemovedEvent {
    state: string
};

// export interface StateRenamedEvent {
//     fromName: string,
//     toName: string
// };

export interface TransitionAddedEvent {
    transition: string,
    from: string,
    to: string,
    alias?: string,
    payload: any
};

export interface TransitionRemovedEvent {
    transition: string,
    oldFrom: string,
    oldTo: string
};

export interface TransitionToStateChangedEvent {
    transition: string,
    state: string,
    oldTo: string
};

export interface TransitionFromStateChangedEvent {
    transition: string,
    state: string,
    oldFrom: string
};

export interface TransitionPayloadChangedEvent {
    transition: string,
    payload: any
};

export interface TransitionAliasChangedEvent {
    transition: string,
    alias: string
};

export interface StatePayloadChangedEvent {
    state: string,
    payload: any
};

export interface TransitionFiredEvent {
    transition: string,
    event: any
};

export interface ActiveStateChangedEvent {
    state: string,
    oldActiveState: string
};

export abstract class StateContainer<S,T> extends EventEmitter {
    protected startState:StartState<S,T>; // The state that will be active on create
    private activeState:AbstractState<S,T>; // The state that is currently active
    protected states:Map<string, AbstractState<S,T>> = new Map<string, AbstractState<S,T>>(); // States are indexed by name (string)
    protected stateLabels:Map<AbstractState<S,T>, string> = new Map<AbstractState<S,T>, string>(); // Map back from states to labels
    protected transitions:Map<string, Transition<S,T>> = new Map<string, Transition<S,T>>(); // Transitions are indexed by name too
    protected transitionLabels:Map<Transition<S,T>, string> = new Map<Transition<S,T>, string>(); // Map back from transitions to labels
    /**
     * Create a new StateContainer
     * @param startStateName The label for the start state
     */
    constructor() {
        super();
        const startStateName:string='(start)';
        this.startState = this.activeState = new StartState();
        this.states.set(startStateName, this.startState);
        this.stateLabels.set(this.startState, startStateName);
        this.startState.setIsActive(true);
        this.addStateListeners(this.startState);
    };

    /**
     * Get the label of a state
     * @param state The AbstractState object we are searching for
     */
    protected getStateLabel(state:AbstractState<S,T>):string {
        return this.stateLabels.get(state);
    };
    /**
     * Check if a state is in this container
     * @param label The label of the state to check
     * @returns true if the state is in this container; false otherwise
     */
    public hasState(label:string):boolean { return this.states.has(label); };
    /**
     * Get the state object representing a given state
     * @param label The state to get
     * @returns the state object
     */
    protected getState(label:string):AbstractState<S,T> { return this.states.get(label) as AbstractState<S,T>; };

    /**
     * Get the payload of a given state
     * @param label The label of the state whose payload we are fetching
     * @returns The state's payload
     */
    public getStatePayload(label:string):S {
        if(this.hasState(label)) {
            return this.getState(label).getPayload();
        } else {
            throw new Error(`Could not find state with label ${label}`);
        }
    };

    /**
     * Set the payload of a given state
     * @param label The label of the  state whose payload we are modifying
     * @param payload The new payload
     */
    public setStatePayload(label:string, payload:S):this {
        if(this.hasState(label)) {
            this.getState(label).setPayload(payload);
            this.emit('statePayloadChanged', {state:label, payload});
            return this;
        } else {
            throw new Error(`Could not find state with label ${label}`);
        }
    };

    /**
     * Get a transition from its label
     * @param label The label for the transition
     * @returns the transition object
     */
    protected getTransition(label:string):Transition<S,T> { return this.transitions.get(label) as Transition<S,T>; };

    /**
     * Check if this container has a given transition
     * @param label The label of the transition
     * @returns true if this state machine has a transition with that label, false otherwise
     */
    public hasTransition(label:string):boolean { return this.transitions.has(label); };

    /**
     * Get the label of a transition
     * @param state The Transition object we are searching for
     */
    protected getTransitionLabel(transition:Transition<S,T>):string {
        return this.transitionLabels.get(transition);
    };

    /**
     * Get the payload of a given transition
     * @param label The label of the transition
     * @returns The payload for the transition
     */
    public getTransitionPayload(label:string):T {
        if(this.hasTransition(label)) {
            return this.getTransition(label).getPayload();
        } else {
            throw new Error(`Could not find transition ${label}`);
        }
    };

    /**
     * Set the payload of a given transition
     * @param label The label of the transition
     * @param payload The new payload
     */
    public setTransitionPayload(label:string, payload:T):this {
        if(this.hasTransition(label)) {
            this.getTransition(label).setPayload(payload);
            this.emit('transitionPayloadChanged', {transition:label, payload});
            return this;
        } else {
            throw new Error(`Could not find transition ${label}`);
        }
    };

    /**
     * Get the alias of a transition
     * @param label The label of the transition
     * @returns The alias of the transition
     */
    public getTransitionAlias(label: string): string {
        if(this.hasTransition(label)) {
            return this.getTransition(label).getAlias();
        } else {
            throw new Error(`Could not find transition ${label}`);
        }
    };

    /**
     * Change the alias of a transition
     * @param label The label of the transition
     * @param alias The new alias
     */
    public setTransitionAlias(label: string, alias: string): this {
        if(this.hasTransition(label)) {
            this.getTransition(label).setAlias(alias);
            return this;
        } else {
            throw new Error(`Could not find transition ${label}`);
        }
    };

    /**
     * Fire a transition by its label
     * @param label The label of the transition
     * @param event The content of the event
     * @param source Information about the source firing this transition
     */
    public fireTransition(label:string, event?:any, source?:any):this {
        if(this.hasTransition(label)) {
            const transition = this.getTransition(label);
            transition.fire(event, source);
            return this;
        }
        const transitions = this.activeState._getOutgoingTransitions();
        for(let i = 0; i<transitions.length; i++) {
            const transition = transitions[i];
            const alias = transition.getAlias();
            if(alias && alias === label) {
                transition.fire(event, source);
                break;
            }
        }
    };

    /**
     * Creates a function that will fire a given transition when called
     * @param label The transition that we are getting a fire function for
     * @returns a function that will fire the given transition
     */
    public getFireFunction(label:string):Function {
        return this.fireTransition.bind(this, label);
    };

    /**
     * Add a new state to this container
     * @param payload The payload of the new state
     * @param label (optional) the label of the new state; auto-generated if not given
     * @returns The new state's label
     */
    public addState(payload?:S, label:string=this.getUniqueStateLabel()):string {
        if(this.hasState(label)) {
            throw new Error(`State container already has a state with label ${label}`);
        } else {
            const state = new State<S,T>(payload);
            this.states.set(label, state);
            this.stateLabels.set(state, label);
            this.addStateListeners(state);
            this.emit('stateAdded', {state:label, payload} as StateAddedEvent);
            return label;
        }
    };

    /**
     * Called whenever a state is active
     */

    /**
     * Remove a state from the list of states
     * @param label The label of the state to remove
     */
    public removeState(label:string):this {
        const state = this.getState(label);
        if(state) {
            state.remove();
            return this;
        } else {
            throw new Error(`State container does not have a state with label ${label}`);
        }
    };

    /**
     * Change the name of a transition
     * @param fromLabel The old transition label
     * @param toLabel The new transition label
     */
    public renameTransition(fromLabel:string, toLabel:string):this {
        if(!this.hasTransition(fromLabel)) { throw new Error(`State container does not have a transition with label ${fromLabel}`); }
        if(this.hasTransition(toLabel)) { throw new Error(`State container already has a transition with label ${toLabel}`); }

        const transition = this.getTransition(fromLabel);
        this.transitions.delete(fromLabel);
        this.transitions.set(toLabel, transition);
        this.transitionLabels.set(transition, toLabel);
        this.emit('transitionRenamed', {fromName:fromLabel, toName:toLabel});
        return this;
    };

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
    public addTransition(fromLabel:string, toLabel:string, alias?:string, payload?:any, label:string=this.getUniqueTransitionLabel()):string {
        if(!this.hasState(fromLabel)) { throw new Error(`State container does not have a state with label ${fromLabel}`); }
        if(!this.hasState(toLabel)) { throw new Error(`State container does not have a state with label ${toLabel}`); }

        if(this.hasTransition(label)) { throw new Error(`Container already has a transition with label ${label}`) };

        const fromState = this.getState(fromLabel);
        const toState = this.getState(toLabel);

        const transition = new Transition(fromState, toState, alias, payload);
        this.transitions.set(label, transition);
        this.transitionLabels.set(transition, label);
        this.emit('transitionAdded', {transition:label, from:fromLabel, to:toLabel, alias, payload} as TransitionAddedEvent);
        this.addTransitionListeners(transition);

        return label;
    };

    /**
     * Remove a transition by label
     * @param label The label of the transition to remove
     */
    public removeTransition(label:string):this {
        if(this.hasTransition(label)) {
            const transition = this.getTransition(label);

            transition.remove();
            return this;
        } else {
            throw new Error('Could not find transition');
        }
    };

    /**
     * Get the label of the active state
     * @returns The label of the currently active state
     */
    public getActiveState():string { return this.getStateLabel(this.activeState); };

    /**
     * Changes which state is active in this container
     * @param label The label of the new active state
     */
    public setActiveState(label:string):this {
        if(!this.hasState(label)) { throw new Error(`State container does not have a state with label ${label}`); }
        if(this.activeState) {
            this.activeState.setIsActive(false);
        }
        const state = this.getState(label);
        state.setIsActive(true);
        return this;
    };

    /**
     * Get the label of every state in this container
     * @returns a list of states in this container
     */
    public getStates():string[] {
        return Array.from(this.states.keys());
    };

    /**
     * Get the label of every transition in this container
     * @returns a list of transitions in this container
     */
    public getTransitions():string[] {
        return Array.from(this.transitions.keys());
    };


    /**
     * @returns a state name that will be unique for this container
     */
    protected getUniqueStateLabel():string {
        const prefix = 'state_';
        let i = 0;
        while(this.hasState(`${prefix}${i}`)) { i++; }
        return `${prefix}${i}`;
    };

    /**
     * @returns a transition name that will be unique for this container
     */
    protected getUniqueTransitionLabel():string {
        const prefix = 'transition_';
        let i = 0;
        while(this.hasTransition(`${prefix}${i}`)) { i++; }
        return `${prefix}${i}`;
    };

    /**
     * @returns the name of the start state
     */
    public getStartState():string {
        return this.getStateLabel(this.startState);
    };

    /**
     * Check if a given state is a start state
     * @param label The state to check
     * @returns true if the state is a start state and false otherwise
     */
    public isStartState(label:string):boolean {
        if(!this.hasState(label)) { throw new Error(`State container does not have a state with label ${label}`); }
        return this.getState(label).isStartState();
    }

    /**
     * Get the list of transitions leaving a state
     * @param label The state name for which we are getting outgoing transitions
     */
    public getOutgoingTransitions(label:string):string[] {
        if(!this.hasState(label)) { throw new Error(`State container does not have a state with label ${label}`); }
        const state = this.getState(label);
        const transitions = state._getOutgoingTransitions();
        return transitions.map((t) => this.getTransitionLabel(t));
    };

    /**
     * Get the list of transitions entering a state
     * @param label The state name for which we are getting incoming transitions
     */
    public getIncomingTransitions(label:string):string[] {
        if(!this.hasState(label)) { throw new Error(`State container does not have a state with label ${label}`); }
        const state = this.getState(label);
        const transitions = state._getIncomingTransitions();
        return transitions.map((t) => this.getTransitionLabel(t));
    };

    /**
     * Get the state that a transition goes to
     * @param label The transition label
     * @returns The label of the state this transition goes to
     */
    public getTransitionTo(label:string):string {
        if(!this.hasTransition(label)) { throw new Error(`State container does not have a transition with label ${label}`); }
        const transition = this.getTransition(label);
        return this.getStateLabel(transition.getToState());
    };

    /**
     * Get he state that a transition leaves from
     * @param label The transition label
     * @returns The label of the state that this transition leaves from
     */
    public getTransitionFrom(label:string):string {
        if(!this.hasTransition(label)) { throw new Error(`State container does not have a transition with label ${label}`); }
        const transition = this.getTransition(label);
        return this.getStateLabel(transition.getFromState());
    };

    /**
     * Change the state that a transition goes to
     * @param label The transition label
     * @param toState The label of the state that it should now go to
     */
    public setTransitionTo(label:string, toState:string):this {
        if(!this.hasTransition(label)) { throw new Error(`State container does not have a transition with label ${label}`); }
        if(!this.hasState(toState)) { throw new Error(`State container does not have a state with label ${toState}`); }
        const transition = this.getTransition(label);
        transition.setToState(this.getState(toState));
        return this;
    };

    /**
     * Change the state that a transition leaves from
     * @param label The transition label
     * @param fromState The label of the state that it should now leave from
     */
    public setTransitionFrom(label:string, fromState:string):this {
        if(!this.hasTransition(label)) { throw new Error(`State container does not have a transition with label ${label}`); }
        if(!this.hasState(fromState)) { throw new Error(`State container does not have a state with label ${fromState}`); }
        const transition = this.getTransition(label);
        transition.setFromState(this.getState(fromState));
        return this;
    };

    /**
     * Convert this state machine into a printable representation
     */
    public toString():string {
        const dividerWidth = 40;
        const divider = '~'.repeat(dividerWidth);
        const stateWidth = 10;
        const tabWidth = 4;
        const activeState = this.getActiveState();
        const spaceOut = (word:string):string => {
            const wordLength = word.length;
            const spacesBefore = Math.round((dividerWidth - wordLength)/2);
            return ' '.repeat(spacesBefore) + word;
        };
        const pad = (word:string, width:number):string => {
            const toAdd = width - word.length;
            if(toAdd > 0) {
                return word + ' '.repeat(toAdd);
            } else {
                return word;
            }
        };
        let rv:string = `${divider}\n${spaceOut('FSM')}\n${divider}\n`;
        this.getStates().forEach((state) => {
            rv += `${activeState===state?'*':' '}${pad(state+':', stateWidth)} ${this.getStatePayload(state)}\n`;

            const outgoingTransitions = this.getOutgoingTransitions(state);
            if(outgoingTransitions.length > 0) {
                outgoingTransitions.forEach((t) => {
                    const payload = this.getTransitionPayload(t);
                    rv += pad(`${' '.repeat(tabWidth)} --(${t})--> ${this.getTransitionTo(t)}`, 30);
                    rv += `: ${this.getTransitionPayload(t)}\n`;
                });
            }
        });

        return rv;
    };

    /**
     * Clean up all of the objects stored in this container
     */
    public destroy():void {
        this.states.clear();
        this.stateLabels.clear();
        this.transitions.clear();
        this.transitionLabels.clear();
        this.emit('destroyed');
    };

    private addStateListeners(state: State<S, T>): void {
        const stateLabel = this.getStateLabel(state);
        state.on('active', (event: ActiveEvent) => {
            const previousActiveState = this.activeState;
            let oldActiveState: string;
            if(previousActiveState) {
                try {
                    oldActiveState = this.getStateLabel(previousActiveState);
                } catch { }
            }
            this.activeState = state;
            this.emit('activeStateChanged', {state: stateLabel, oldActiveState } as ActiveStateChangedEvent);
        });
        // state.on('not_active', (event: NotActiveEvent) => { });
        state.on('payloadChanged', (event: SPayloadChangedEvent):void => {
            const {payload} = event;
            this.emit('stateloadChanged', {
                state: stateLabel,
                payload
            } as StatePayloadChangedEvent);
        });

        state.on('removed', (event: SRemovedEvent):void => {
            this.states.delete(stateLabel);
            this.stateLabels.delete(state);
            this.emit('stateRemoved', {state:stateLabel} as StateRemovedEvent);
        });
    };

    private addTransitionListeners(transition: Transition<S, T>):void {
        const transitionLabel = this.getTransitionLabel(transition);
        transition.on('fromStateChanged', (event: FromStateChangedEvent):void => {
            const {oldFrom, state} = event;
            this.emit('transitionFromStateChanged', {
                transition: transitionLabel,
                oldFrom: this.getStateLabel(oldFrom),
                state: this.getStateLabel(state)
            } as TransitionFromStateChangedEvent);
        });

        transition.on('toStateChanged', (event: ToStateChangedEvent):void => {
            const {oldTo, state} = event;
            this.emit('transitionToStateChanged', {
                transition: transitionLabel,
                oldTo: this.getStateLabel(oldTo),
                state: this.getStateLabel(state)
            } as TransitionToStateChangedEvent);
        });

        transition.on('payloadChanged', (event: TPayloadChangedEvent):void => {
            const {payload} = event;
            this.emit('transitionPayloadChanged', {
                transition: transitionLabel,
                payload
            } as TransitionPayloadChangedEvent);
        });

        transition.on('fire', (event: FireEvent):void => {
            this.emit('transitionFiredEvent', {
                transition: transitionLabel,
                event: event.event
            } as TransitionFiredEvent);
        });

        transition.on('aliasChanged', (event: AliasChangedEvent):void => {
            const {alias} = event;
            this.emit('transitionAliasChanged', {
                transition: transitionLabel, alias
            } as TransitionAliasChangedEvent);
        });

        transition.on('removed', (event: TRemovedEvent):void => {
            const oldTo = this.getTransitionTo(transitionLabel);
            const oldFrom = this.getTransitionFrom(transitionLabel);
            this.transitions.delete(transitionLabel);
            this.transitionLabels.delete(transition);
            this.emit('transitionRemoved', {transition:transitionLabel, oldFrom, oldTo} as TransitionRemovedEvent);
        });
    };
};

type Pair<E> = [E,E];
export type EqualityCheck<E> = (i1:E, i2:E) => boolean;
export type SimilarityScore<E> = (i1:E, i2:E) => number;
const defaultEqualityCheck:EqualityCheck<any> = (a:any, b:any) => a===b;
const defaultSimilarityScore:SimilarityScore<any> = (a:any, b:any) => a===b ? 1 : 0;

export type JSONFSM = {
    initial:string,
    states: {
        [stateName:string]: {
            on: {
                [eventName:string]: string | {
                    [stateName:string]:{
                        actions: string[]
                    }
                }
            },
            onEntry?: string[]
        }
    }
};

export class FSM<S,T> extends StateContainer<S,T> {
    constructor(private transitionsEqual:EqualityCheck<T>=defaultEqualityCheck,
                private transitionSimilarityScore:SimilarityScore<T>=defaultSimilarityScore,
                private stateSimilarityScore:SimilarityScore<S>=defaultSimilarityScore) {
        super();
    };

    /**
     * Converts a JSON object (such as that exported by https://musing-rosalind-2ce8e7.netlify.com) to an FSM
     * @param jsonObj The JSON object
     */
    public static fromJSON(jsonObj:JSONFSM):FSM<string, string> {
        const rv = new FSM<string, string>();
        rv.addState(jsonObj.initial, jsonObj.initial)
        keys(jsonObj.states).forEach((stateName) => {
            if(stateName !== jsonObj.initial) {
                rv.addState('', stateName);
            }
        });
        rv.addTransition('(start)', jsonObj.initial, 'start');
        forEach(jsonObj.states, (stateInfo, stateName) => {
            forEach(stateInfo.on, (toStateInfo, eventName) => {
                let toStateName:string;
                if(isString(toStateInfo)) {
                    toStateName = toStateInfo;
                } else {
                    toStateName = keys(toStateInfo)[0];
                }

                rv.addTransition(stateName, toStateName, eventName, eventName);
            });
        });
        return rv;
    };

    /**
     * Converts the current FSM into a JSON object readable by https://musing-rosalind-2ce8e7.netlify.com
     */
    public toJSON():JSONFSM {
        const result:JSONFSM = {
            initial: this.getTransitionTo(this.getOutgoingTransitions(this.getStartState())[0]),
            states: {
            }
        };
        const {states} = result;
        this.getStates().forEach((stateName) => {
            if(stateName !== this.getStartState()) {
                result.states[stateName] = { on: { }};
                this.getOutgoingTransitions(stateName).forEach((transition) => {
                    const transitionData = this.getTransitionPayload(transition) + '';
                    result.states[stateName].on[transitionData] = this.getTransitionTo(transition);
                });
            }
        });
        return result;
    };

    /**
     * Iterate and merge the best candidates
     */
    public iterateMerge():void {
        const similarityScores = this.computeSimilarityScores();
        const sortedStates = Array.from(similarityScores.entries()).sort((a, b) => b[1]-a[1]);
        console.log(sortedStates);

        if(sortedStates.length > 0) {
            const [toMergeS1, toMergeS2] = sortedStates[0][0];
            this.mergeStates(toMergeS1, toMergeS2);
        }
    };

    /**
     * @returns every possible pairing of states
     */
    private getStatePairs():Pair<AbstractState<S,T>>[] {
        const rv:Pair<AbstractState<S,T>>[] = [];
        const states = Array.from(this.states.values());
        for(let i:number = 0; i<states.length; i++) {
            const si = states[i];
            for(let j:number = i+1; j<states.length; j++) {
                const sj = states[j];
                rv.push([si, sj]);
            }
        }
        return rv;
    };

    /**
     * Compute a similarity score of every pair of states
     */
    private computeSimilarityScores():Map<Pair<AbstractState<S,T>>, number> {
        const numCommonTransitions = new HashMap<Pair<AbstractState<S,T>>, number>((p1, p2) => { return p1[0]===p2[0] && p1[1]===p2[1]; }, (p)=>{ return this.getStateLabel(p[0]) + this.getStateLabel(p[1]); });
        const statePairs = this.getStatePairs();
        const equivalentOutgoingTransitions:Map<Pair<AbstractState<S,T>>, Pair<Transition<S,T>>[]> = new Map<Pair<AbstractState<S,T>>, Pair<Transition<S,T>>[]>();
        statePairs.forEach((p) => {
            const [state1, state2] = p;
            const et:Pair<Transition<S,T>>[] = this.equivalentTransitions(state1._getOutgoingTransitions(), state2._getOutgoingTransitions());
            equivalentOutgoingTransitions.set(p, et);
            numCommonTransitions.set(p, et.length);
        });
        const rv = new Map<Pair<AbstractState<S,T>>, number>();
        statePairs.forEach((p) => {
            const equivalentTransitions = equivalentOutgoingTransitions.get(p);
            equivalentTransitions.forEach((et) => {
                const [t1, t2] = et;

                const t1Dest = t1.getToState();
                const t2Dest = t2.getToState();
                const similarityScore:number = numCommonTransitions.get([t1Dest, t2Dest]) || numCommonTransitions.get([t2Dest, t1Dest]);
                rv.set(p, numCommonTransitions.get(p) + similarityScore);
            });
        });
        numCommonTransitions.clear();
        return rv;
    };

    /**
     * Get a list of equivalent transitions from two sets of transitions
     * @param transitionSet1 The first set of transitions
     * @param transitionSet2 The second set of transitions
     * @returns A list of pairs of transitions that are common between transitionSet1 and transitionSet2
     */
    private equivalentTransitions(transitionSet1:Transition<S,T>[], transitionSet2:Transition<S,T>[]):Pair<Transition<S,T>>[] {
        const rv:Pair<Transition<S,T>>[] = [];
        for(let i:number = 0; i<transitionSet1.length; i++) {
            const t1 = transitionSet1[i];
            for(let j:number = 0; j<transitionSet2.length; j++) {
                const t2 = transitionSet2[j];
                if(this.transitionsEqual(t1.getPayload(), t2.getPayload())) {
                    rv.push([t1, t2]);
                    break;
                }
            }
        }
        return rv;
    };

    /**
     * Add a new "trace" through a program
     */
    public addTrace(trace:[T,S][]):void {
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
                this.addTransition(currentState, newState, `${t}`, t);
                currentState = newState;
            }
        });
    };

    /**
     * Merge two states together
     */
    private mergeStates(removeState:AbstractState<S,T>, mergeInto:AbstractState<S,T>, removeStaleStates:boolean=true):void {
        const mergeIntoOutgoingTransitions = mergeInto._getOutgoingTransitions();
        const outgoingTransitionTargets:Set<AbstractState<S,T>> = new Set<AbstractState<S,T>>();

        let outgoingTransitions:Transition<S,T>[];
        do {
            outgoingTransitions = removeState._getOutgoingTransitions();
            const t = outgoingTransitions[0];
            if(t) {
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
                    if(removeStaleStates) {
                        outgoingTransitionTargets.add(t.getToState());
                    }
                    t.remove();
                } else {
                    t.setFromState(mergeInto);
                }
            }
        } while(outgoingTransitions.length > 0);

        let incomingTransitions:Transition<S,T>[];
        do {
            incomingTransitions = removeState._getIncomingTransitions();
            const t = incomingTransitions[0];
            if(t) {
                t.setToState(mergeInto);
            }
        } while(incomingTransitions.length > 0);

        this.removeState(this.getStateLabel(removeState));

        if(removeStaleStates) {
            outgoingTransitionTargets.forEach((state) => {
                if(state._getIncomingTransitions().length === 0) {
                    state.remove();
                    this.removeState(this.getStateLabel(state));
                }
            });
        }
    };
};