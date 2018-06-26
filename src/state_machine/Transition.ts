import {AbstractState} from './State';

export class Transition {
    constructor(private fromState:AbstractState, private toState:AbstractState) {
    };
    public remove():void {
        this.fromState.removeOutgoingTransition(this);
    };
    public getFromState():AbstractState { return this.fromState; };
    public getToState():AbstractState { return this.toState; };
    public fire(event?:any, source?:any):void {
    };
};