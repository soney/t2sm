/// <reference types="node" />
import { AbstractState, StartState } from './State';
import { Transition } from './Transition';
import { EventEmitter } from 'events';
export interface StateAddedEvent {
    state: string;
    payload: any;
}
export interface StateRemovedEvent {
    state: string;
}
export interface TransitionAddedEvent {
    transition: string;
    from: string;
    to: string;
    alias?: string;
    payload: any;
}
export interface TransitionRemovedEvent {
    transition: string;
    oldFrom: string;
    oldTo: string;
}
export interface TransitionToStateChangedEvent {
    transition: string;
    state: string;
    oldTo: string;
}
export interface TransitionFromStateChangedEvent {
    transition: string;
    state: string;
    oldFrom: string;
}
export interface TransitionPayloadChangedEvent {
    transition: string;
    payload: any;
}
export interface TransitionAliasChangedEvent {
    transition: string;
    alias: string;
}
export interface StatePayloadChangedEvent {
    state: string;
    payload: any;
}
export interface TransitionFiredEvent {
    transition: string;
    event: any;
    eligible: boolean;
}
export interface ActiveStateChangedEvent {
    state: string;
    oldActiveState: string;
}
export interface UpdateEvent {
}
export declare type JSONFSM = {
    initial: string;
    states: {
        [stateName: string]: {
            on: {
                [eventName: string]: string | {
                    [stateName: string]: {
                        actions: string[];
                    };
                };
            };
            onEntry?: string[];
        };
    };
};
export declare class FSM<S, T> extends EventEmitter {
    protected startState: StartState<S, T>;
    private activeState;
    protected states: Map<string, AbstractState<S, T>>;
    protected stateLabels: Map<AbstractState<S, T>, string>;
    protected transitions: Map<string, Transition<S, T>>;
    protected transitionLabels: Map<Transition<S, T>, string>;
    /**
     * Create a new StateContainer
     * @param startStateName The label for the start state
     */
    constructor();
    /**
     * Get the label of a state
     * @param state The AbstractState object we are searching for
     */
    protected getStateLabel(state: AbstractState<S, T>): string;
    /**
     * Check if a state is in this container
     * @param label The label of the state to check
     * @returns true if the state is in this container; false otherwise
     */
    hasState(label: string): boolean;
    /**
     * Get the state object representing a given state
     * @param label The state to get
     * @returns the state object
     */
    protected getState(label: string): AbstractState<S, T>;
    /**
     * Get the payload of a given state
     * @param label The label of the state whose payload we are fetching
     * @returns The state's payload
     */
    getStatePayload(label: string): S;
    /**
     * Set the payload of a given state
     * @param label The label of the  state whose payload we are modifying
     * @param payload The new payload
     */
    setStatePayload(label: string, payload: S): this;
    /**
     * Get a transition from its label
     * @param label The label for the transition
     * @returns the transition object
     */
    protected getTransition(label: string): Transition<S, T>;
    /**
     * Check if this container has a given transition
     * @param label The label of the transition
     * @returns true if this state machine has a transition with that label, false otherwise
     */
    hasTransition(label: string): boolean;
    /**
     * Get the label of a transition
     * @param state The Transition object we are searching for
     */
    protected getTransitionLabel(transition: Transition<S, T>): string;
    /**
     * Get the payload of a given transition
     * @param label The label of the transition
     * @returns The payload for the transition
     */
    getTransitionPayload(label: string): T;
    /**
     * Set the payload of a given transition
     * @param label The label of the transition
     * @param payload The new payload
     */
    setTransitionPayload(label: string, payload: T): this;
    /**
     * Get the alias of a transition
     * @param label The label of the transition
     * @returns The alias of the transition
     */
    getTransitionAlias(label: string): string;
    /**
     * Change the alias of a transition
     * @param label The label of the transition
     * @param alias The new alias
     */
    setTransitionAlias(label: string, alias: string): this;
    /**
     * Fire a transition by its label
     * @param label The label of the transition
     * @param event The content of the event
     * @param source Information about the source firing this transition
     */
    fireTransition(label: string, event?: any, source?: any): this;
    /**
     * Creates a function that will fire a given transition when called
     * @param label The transition that we are getting a fire function for
     * @returns a function that will fire the given transition
     */
    getFireFunction(label: string): Function;
    /**
     * Add a new state to this container
     * @param payload The payload of the new state
     * @param label (optional) the label of the new state; auto-generated if not given
     * @returns The new state's label
     */
    addState(payload?: S, label?: string): string;
    /**
     * Called whenever a state is active
     */
    /**
     * Remove a state from the list of states
     * @param label The label of the state to remove
     */
    removeState(label: string): this;
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
    addTransition(fromLabel: string, toLabel: string, alias?: string, payload?: any, label?: string): string;
    /**
     * Remove a transition by label
     * @param label The label of the transition to remove
     */
    removeTransition(label: string): this;
    /**
     * Get the label of the active state
     * @returns The label of the currently active state
     */
    getActiveState(): string;
    /**
     * Changes which state is active in this container
     * @param label The label of the new active state
     */
    setActiveState(label: string): this;
    /**
     * Get the label of every state in this container
     * @returns a list of states in this container
     */
    getStates(): string[];
    /**
     * Get the label of every transition in this container
     * @returns a list of transitions in this container
     */
    getTransitions(): string[];
    /**
     * @returns a state name that will be unique for this container
     */
    protected getUniqueStateLabel(): string;
    /**
     * @returns a transition name that will be unique for this container
     */
    protected getUniqueTransitionLabel(): string;
    /**
     * @returns the name of the start state
     */
    getStartState(): string;
    /**
     * Check if a given state is a start state
     * @param label The state to check
     * @returns true if the state is a start state and false otherwise
     */
    isStartState(label: string): boolean;
    /**
     * Get the list of transitions leaving a state
     * @param label The state name for which we are getting outgoing transitions
     */
    getOutgoingTransitions(label: string): string[];
    /**
     * Get the list of transitions entering a state
     * @param label The state name for which we are getting incoming transitions
     */
    getIncomingTransitions(label: string): string[];
    /**
     * Get the state that a transition goes to
     * @param label The transition label
     * @returns The label of the state this transition goes to
     */
    getTransitionTo(label: string): string;
    /**
     * Get he state that a transition leaves from
     * @param label The transition label
     * @returns The label of the state that this transition leaves from
     */
    getTransitionFrom(label: string): string;
    /**
     * Change the state that a transition goes to
     * @param label The transition label
     * @param toState The label of the state that it should now go to
     */
    setTransitionTo(label: string, toState: string): this;
    /**
     * Change the state that a transition leaves from
     * @param label The transition label
     * @param fromState The label of the state that it should now leave from
     */
    setTransitionFrom(label: string, fromState: string): this;
    /**
     * Convert this state machine into a printable representation
     */
    toString(): string;
    /**
     * Clean up all of the objects stored in this container
     */
    destroy(): void;
    getStartTransition(): string;
    private addStateListeners;
    private addTransitionListeners;
    /**
     * Converts a JSON object (such as that exported by https://musing-rosalind-2ce8e7.netlify.com) to an FSM
     * @param jsonObj The JSON object
     */
    static fromJSON(jsonObj: JSONFSM): FSM<string, string>;
    /**
     * Converts the current FSM into a JSON object readable by https://musing-rosalind-2ce8e7.netlify.com
     */
    toJSON(): JSONFSM;
}
