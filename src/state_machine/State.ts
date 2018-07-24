import {Transition, FireEvent} from './Transition';
import { EventEmitter } from 'events';

export interface ActiveEvent {};
export interface NotActiveEvent {};
export interface SPayloadChangedEvent {
    payload: any
};
export interface SRemovedEvent { };

/**
 * A class representing a state in a state machine
 */
export abstract class AbstractState<S, T> extends EventEmitter {
    private active:boolean = false; // Whether this state is currently active
    private outgoingTransitions:Transition<S,T>[] = []; // All of the transitions that leave this state
    private incomingTransitions:Transition<S,T>[] = []; // All of the transitions that enter this state
    public abstract isStartState():boolean; // Is this where the state machien starts
    constructor(private payload?:S) {
        super();
    };

    /**
     * Get the data attached to this state
     */
    public getPayload():S { return this.payload; };

    /**
     * Set the data attached to this state
     * @param payload The new payload
     */
    public setPayload(payload:S):void {
        this.payload = payload;
        this.emit('payloadChanged', { payload } as SPayloadChangedEvent);
    };

    /**
     * Get all of the transitions leaving this state (should only be used internally)
     */
    public _getOutgoingTransitions():Transition<S,T>[] { return this.outgoingTransitions; };
    /**
     * Get all of the transitions entering this state (should only be used internally)
     */
    public _getIncomingTransitions():Transition<S,T>[] { return this.incomingTransitions; };

    /**
     * Mark a new transition as leaving from this state (should only be used internally)
     * @param transition The transition to add to the list of outgoing transitions
     */
    public _addOutgoingTransition(transition:Transition<S,T>):void {
        this.outgoingTransitions.push(transition);

        if(this.isActive()) {
            transition.setEligible(true);
            transition.addListener('fire', this.onOutgoingTransitionFired);
        } else {
            transition.setEligible(false);
        }
    };

    /**
     * Remove a transition from the list of outgoing transitions
     * @param transition The transition to remove
     * @return true if the transition was removed; false otherwise
     */
    public _removeOutgoingTransition(transition:Transition<S,T>):boolean {
        const index = this.outgoingTransitions.indexOf(transition);
        if(index>=0) {
            this.outgoingTransitions.splice(index, 1);
            if(this.isActive()) {
                transition.setEligible(false);
                transition.removeListener('fire', this.onOutgoingTransitionFired);
            }
            return true;
        } else {
            return false;
        }
    };

    /**
     * Mark a new transition as going to this state (should only be used internally)
     * @param transition The transition to add to the list of incoming transitions
     */
    public _addIncomingTransition(transition:Transition<S,T>):void {
        this.incomingTransitions.push(transition);
    };

    /**
     * Remove a transition from the list of incoming transitions
     * @param transition The transition to remove
     * @returns true if the transition was removed; false otherwise
     */
    public _removeIncomingTransition(transition:Transition<S,T>):boolean {
        const index = this.incomingTransitions.indexOf(transition);
        if(index>=0) {
            this.incomingTransitions.splice(index, 1);
            return true;
        } else {
            return false;
        }
    };

    /**
     * @return true if this state is active and false otherwise
     */
    public isActive():boolean { return this.active; };

    /**
     * Change whether this state is active or not
     * @param active Whether or not the state should be active
     */
    public setIsActive(active:boolean):void {
        this.active = active;
        if(this.isActive()) {
            this.addOutgoingTransitionListeners();
            this.emit('active', {} as ActiveEvent);
        } else {
            this.removeOutgoingTransitionListeners();
            this.emit('not_active', {} as NotActiveEvent);
        }
    };

    /**
     * Enable outgoing transition listeners for when this state is active
     */
    private addOutgoingTransitionListeners():void {
        this.outgoingTransitions.forEach((ot) => {
            ot.setEligible(true);
            ot.addListener('fire', this.onOutgoingTransitionFired);
        });
    };
    /**
     * Disable outgoing transition listeners for when this state is inactive
     */
    private removeOutgoingTransitionListeners():void {
        this.outgoingTransitions.forEach((ot) => {
            ot.setEligible(false);
            ot.removeListener('fire', this.onOutgoingTransitionFired);
        });
    };

    /**
     * Called when a transition leaving this state was fired
     */
    private onOutgoingTransitionFired = (firedEvent:FireEvent) => {
        if(this.isActive()) {
            const {transition, event, source} = firedEvent;
            const toState = transition.getToState();
            
            // Need to set self to inactive *before* setting the other to active
            // in case it's a transition back to myself
            this.setIsActive(false);
            toState.setIsActive(true);
        } else {
            throw new Error('Received transition fired event while not active');
        }
    };

    /**
     * Remove this state
     */
    public remove():void {
        this.removeOutgoingTransitionListeners();
        while(this.incomingTransitions.length > 0) { this.incomingTransitions[0].remove(); }
        while(this.outgoingTransitions.length > 0) { this.outgoingTransitions[0].remove(); }
        this.emit('removed', {} as SRemovedEvent);
    };
};

/**
 * A class representing a starting state
 */
export class StartState<S,T> extends AbstractState<S,T> {
    constructor(payload?:S) {
        super(payload);
    };
    /**
     * Adds an outgoing transition (only one allowed)
     * @param transition The transition to add
     */
    public _addOutgoingTransition(transition:Transition<S,T>):void {
        if(this._getOutgoingTransitions().length > 0) {
            throw new Error('Can only have one outgoing transition from a start state');
        } else {
            super._addOutgoingTransition(transition);
        }
    };
    /**
     * Throws an exception; start states cannot have incoming transitions
     */
    public _addIncomingTransition(transition:Transition<S,T>):void {
        throw new Error('Start states cannot have incoming transitions');
    };
    /**
     * @returns true (to represent that this is a start state)
     */
    public isStartState():boolean { return true; };
};

/**
 * A class to represent a "normal" state
 */
export class State<S,T> extends AbstractState<S,T> {
    constructor(payload?:S) {
        super(payload);
    };
    /**
     * @returns false (to represent that this is not a start state)
     */
    public isStartState():boolean { return false; };
};