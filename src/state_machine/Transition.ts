import {AbstractState} from './State';
import { EventEmitter } from 'events';

export interface TPayloadChangedEvent {
    payload: any
};

export interface FromStateChangedEvent {
    oldFrom: AbstractState<any, any>,
    state: AbstractState<any, any>
};

export interface ToStateChangedEvent {
    oldTo: AbstractState<any, any>,
    state: AbstractState<any, any>
};

export interface FireEvent {
    event: any,
    transition: Transition<any, any>,
    source: any,
    eligible: boolean
};

export interface AliasChangedEvent {
    alias: string
};

export interface TRemovedEvent {
};

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
     * Change the alias of this transition
     * @param alias The new alias for this transition
     */
    public setAlias(alias: string): void {
        this.alias = alias;
        this.emit('aliasChanged', { alias } as AliasChangedEvent);
    }

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
        this.emit('removed', {} as TRemovedEvent);
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
        this.emit('fire', {
            transition: this, event, source, eligible: this.isEligible()
        } as FireEvent);
    };

    /**
     * Change which state this transition leaves from
     * @param state The new "from" state
     */
    public setFromState(state:AbstractState<S,T>):void {
        const oldFrom = this.fromState;
        try {
            this.fromState._removeOutgoingTransition(this);
        } catch(err) {
            throw(err);
        }

        try {
            this.fromState = state;
            this.fromState._addOutgoingTransition(this);
            this.emit('fromStateChanged', {
                oldFrom, state
            } as FromStateChangedEvent);
        } catch(err) {
            oldFrom._addOutgoingTransition(this);
            this.fromState = oldFrom;
            throw(err);
        }
    };
    /**
     * Change which state this transition goes to
     * @param state The new "to" state
     */
    public setToState(state:AbstractState<S,T>):void {
        const oldTo = this.toState;
        try {
            this.toState._removeIncomingTransition(this);
        } catch(err) {
            throw(err);
        }

        try {
            this.toState = state;
            this.toState._addIncomingTransition(this);
            this.emit('toStateChanged', {
                oldTo, state
            } as ToStateChangedEvent);
        } catch(err) {
            oldTo._addIncomingTransition(this);
            this.toState = oldTo;
            throw(err);
        }
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
        this.emit('payloadChanged', { payload } as TPayloadChangedEvent);
    };
};