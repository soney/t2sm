import {AbstractState} from './State';
import { EventEmitter } from 'events';

export class Transition<S, T> extends EventEmitter {
    private eligible:boolean;

    constructor(private fromState:AbstractState<S,T>, private toState:AbstractState<S,T>, private payload?:T) {
        super();
        this.fromState._addOutgoingTransition(this);
        this.toState._addIncomingTransition(this);
    };

    public isEligible():boolean { return this.eligible; };
    public setEligible(eligible:boolean):void { this.eligible = eligible; };

    public remove():void {
        this.fromState._removeOutgoingTransition(this);
        this.toState._removeIncomingTransition(this);
    };
    public getFromState():AbstractState<S,T> { return this.fromState; };
    public getToState():AbstractState<S,T> { return this.toState; };
    public fire = (event?:any, source?:any):void => {
        this.emit('fire', this, event, source);
    };
    public setFromState(state:AbstractState<S,T>):void {
        this.fromState._removeOutgoingTransition(this);
        this.fromState = state;
        this.fromState._addOutgoingTransition(this);
    };
    public setToState(state:AbstractState<S,T>):void {
        this.toState._removeIncomingTransition(this);
        this.toState = state;
        this.toState._addIncomingTransition(this);
    };
    public getPayload():T {
        return this.payload;
    };
};