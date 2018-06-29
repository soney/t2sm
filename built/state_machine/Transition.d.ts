/// <reference types="node" />
import { AbstractState } from './State';
import { EventEmitter } from 'events';
/**
 * A class representing a transition in a state machine
 */
export declare class Transition<S, T> extends EventEmitter {
    private fromState;
    private toState;
    private payload?;
    private eligible;
    /**
     * Constructor
     * @param fromState The state that this transition leaves from
     * @param toState The state that this transition goes to
     * @param payload The information stored in this transition
     */
    constructor(fromState: AbstractState<S, T>, toState: AbstractState<S, T>, payload?: T);
    /**
     * @returns whether this transition is eligible to fire
     */
    isEligible(): boolean;
    /**
     * Change whether this transition is eligible
     * @param eligible true if this transition should be eligible to fire, false otherwise.
     */
    setEligible(eligible: boolean): void;
    /**
     * Remove this transition
     */
    remove(): void;
    /**
     * Get the state that this transition leaves from
     */
    getFromState(): AbstractState<S, T>;
    /**
     * Get the state that this transition goes to
     */
    getToState(): AbstractState<S, T>;
    /**
     * Tell the transition to fire (if the "from" state is active, move to the "to" state)
     */
    fire(event?: any, source?: any): void;
    /**
     * Change which state this transition leaves from
     * @param state The new "from" state
     */
    setFromState(state: AbstractState<S, T>): void;
    /**
     * Change which state this transition goes to
     * @param state The new "to" state
     */
    setToState(state: AbstractState<S, T>): void;
    /**
     * Get this transition's content payload
     */
    getPayload(): T;
    /**
     * Set this transition's payload
     * @param payload The new payload
     */
    setPayload(payload: T): void;
}
