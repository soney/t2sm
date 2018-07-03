import {AbstractState} from './State';
import { EventEmitter } from 'events';

/**
 * A class representing a transition in a state machine
 */
export class Transition<S, T> extends EventEmitter {
    private eligible:boolean; // Whether this transition is eligible to fire (the "from" state is active)
    /**
     * Constructor
     * @param fromState The state that this transition leaves from
     * @param toState The state that this transition goes to
     * @param alias The shorthand name for this transition
     * @param payload The information stored in this transition
     */
    constructor(private fromState:AbstractState<S,T>, private toState:AbstractState<S,T>, private alias:string, private payload?:T) {
        super();
        this.fromState._addOutgoingTransition(this);
        this.toState._addIncomingTransition(this);
    };

    /**
     * @returns the alias for this transition (typically the event name)
     */
    public getAlias():string {
        return this.alias;
    };

    /**
     * @returns whether this transition is eligible to fire
     */
    public isEligible():boolean { return this.eligible; };

    /**
     * Change whether this transition is eligible
     * @param eligible true if this transition should be eligible to fire, false otherwise.
     */
    public setEligible(eligible:boolean):void { this.eligible = eligible; };

    /**
     * Remove this transition
     */
    public remove():void {
        this.fromState._removeOutgoingTransition(this);
        this.toState._removeIncomingTransition(this);
    };

    /**
     * Get the state that this transition leaves from
     */
    public getFromState():AbstractState<S,T> { return this.fromState; };

    /**
     * Get the state that this transition goes to
     */
    public getToState():AbstractState<S,T> { return this.toState; };

    /**
     * Tell the transition to fire (if the "from" state is active, move to the "to" state)
     */
    public fire(event?:any, source?:any):void {
        this.emit('fire', this, event, source);
    };

    /**
     * Change which state this transition leaves from
     * @param state The new "from" state
     */
    public setFromState(state:AbstractState<S,T>):void {
        this.fromState._removeOutgoingTransition(this);
        this.fromState = state;
        this.fromState._addOutgoingTransition(this);
    };
    /**
     * Change which state this transition goes to
     * @param state The new "to" state
     */
    public setToState(state:AbstractState<S,T>):void {
        this.toState._removeIncomingTransition(this);
        this.toState = state;
        this.toState._addIncomingTransition(this);
    };

    /**
     * Get this transition's content payload
     */
    public getPayload():T { return this.payload; };
    /**
     * Set this transition's payload
     * @param payload The new payload
     */
    public setPayload(payload:T):void {
        this.payload = payload;
    };
};