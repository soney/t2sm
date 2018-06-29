/// <reference types="node" />
import { Transition } from './Transition';
import { EventEmitter } from 'events';
/**
 * A class representing a state in a state machine
 */
export declare abstract class AbstractState<S, T> extends EventEmitter {
    private payload?;
    private active;
    private outgoingTransitions;
    private incomingTransitions;
    abstract isStartState(): boolean;
    constructor(payload?: S);
    /**
     * Get the data attached to this state
     */
    getPayload(): S;
    /**
     * Set the data attached to this state
     * @param payload The new payload
     */
    setPayload(payload: S): void;
    /**
     * Get all of the transitions leaving this state (should only be used internally)
     */
    _getOutgoingTransitions(): Transition<S, T>[];
    /**
     * Get all of the transitions entering this state (should only be used internally)
     */
    _getIncomingTransitions(): Transition<S, T>[];
    /**
     * Mark a new transition as leaving from this state (should only be used internally)
     * @param transition The transition to add to the list of outgoing transitions
     */
    _addOutgoingTransition(transition: Transition<S, T>): void;
    /**
     * Remove a transition from the list of outgoing transitions
     * @param transition The transition to remove
     * @return true if the transition was removed; false otherwise
     */
    _removeOutgoingTransition(transition: Transition<S, T>): boolean;
    /**
     * Mark a new transition as going to this state (should only be used internally)
     * @param transition The transition to add to the list of incoming transitions
     */
    _addIncomingTransition(transition: Transition<S, T>): void;
    /**
     * Remove a transition from the list of incoming transitions
     * @param transition The transition to remove
     * @returns true if the transition was removed; false otherwise
     */
    _removeIncomingTransition(transition: Transition<S, T>): boolean;
    /**
     * @return true if this state is active and false otherwise
     */
    isActive(): boolean;
    /**
     * Change whether this state is active or not
     * @param active Whether or not the state should be active
     */
    setIsActive(active: boolean): void;
    /**
     * Enable outgoing transition listeners for when this state is active
     */
    private addOutgoingTransitionListeners;
    /**
     * Disable outgoing transition listeners for when this state is inactive
     */
    private removeOutgoingTransitionListeners;
    /**
     * Called when a transition leaving this state was fired
     */
    private onOutgoingTransitionFired;
    /**
     * Remove this state
     */
    remove(): void;
}
/**
 * A class representing a starting state
 */
export declare class StartState<S, T> extends AbstractState<S, T> {
    constructor(payload?: S);
    /**
     * Adds an outgoing transition (only one allowed)
     * @param transition The transition to add
     */
    _addOutgoingTransition(transition: Transition<S, T>): void;
    /**
     * Throws an exception; start states cannot have incoming transitions
     */
    _addIncomingTransition(transition: Transition<S, T>): void;
    /**
     * @returns true (to represent that this is a start state)
     */
    isStartState(): boolean;
}
/**
 * A class to represent a "normal" state
 */
export declare class State<S, T> extends AbstractState<S, T> {
    constructor(payload?: S);
    /**
     * @returns false (to represent that this is not a start state)
     */
    isStartState(): boolean;
}
