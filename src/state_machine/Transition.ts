import {AbstractState} from './State';
import { EventEmitter } from 'events';

export class Transition extends EventEmitter {
    constructor(private fromState:AbstractState, private toState:AbstractState) {
        super();
    };

    public remove():void {
        this.fromState.removeOutgoingTransition(this);
    };
    public getFromState():AbstractState { return this.fromState; };
    public getToState():AbstractState { return this.toState; };
    private _fire(event?:any, source?:any):void {
        this.emit('fire', this, event, source);
    };
    public fire = (event?:any, source?:any):void => {
        this._fire(event, source);
    };
};