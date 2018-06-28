import {Transition} from './Transition';
import { EventEmitter } from 'events';

export abstract class AbstractState<S, T> extends EventEmitter {
    private active:boolean = false;
    private outgoingTransitions:Transition<S,T>[] = [];
    private incomingTransitions:Transition<S,T>[] = [];
    public abstract isStartState():boolean;
    constructor(private payload?:S) {
        super();
    };
    public getPayload():S {
        return this.payload;
    };
    public _getOutgoingTransitions():Transition<S,T>[] {
        return this.outgoingTransitions;
    };
    public _getIncomingTransitions():Transition<S,T>[] {
        return this.incomingTransitions;
    };
    public _addOutgoingTransition(transition:Transition<S,T>):void {
        this.outgoingTransitions.push(transition);

        if(this.isActive()) {
            transition.addListener('fire', this.onOutgoingTransitionFired);
        }
    };
    public _addIncomingTransition(transition:Transition<S,T>):void {
        this.incomingTransitions.push(transition);
    };
    public _removeOutgoingTransition(transition:Transition<S,T>):boolean {
        const index = this.outgoingTransitions.indexOf(transition);
        if(index>=0) {
            this.outgoingTransitions.splice(index, 1);
            if(this.isActive()) {
                transition.removeListener('fire', this.onOutgoingTransitionFired);
            }
            return true;
        } else {
            return false;
        }
    };
    public _removeIncomingTransition(transition:Transition<S,T>):boolean {
        const index = this.incomingTransitions.indexOf(transition);
        if(index>=0) {
            this.incomingTransitions.splice(index, 1);
            return true;
        } else {
            return false;
        }
    };
    public isActive():boolean { return this.active; };
    public setIsActive(active:boolean):void {
        this.active = active;
        if(this.isActive()) {
            this.addOutgoingTransitionListeners();
            this.emit('active');
        } else {
            this.removeOutgoingTransitionListeners();
            this.emit('not_active');
        }
    };
    private addOutgoingTransitionListeners():void {
        this.outgoingTransitions.forEach((ot) => {
            ot.removeListener('fire', this.onOutgoingTransitionFired);
        });
    };
    private removeOutgoingTransitionListeners():void {
        this.outgoingTransitions.forEach((ot) => {
            ot.addListener('fire', this.onOutgoingTransitionFired);
        });
    };

    private onOutgoingTransitionFired = (transition:Transition<S,T>, event:any, source:any) => {
        if(this.isActive()) {
            const toState = transition.getToState();
            this.setIsActive(false);
            toState.setIsActive(true);
        } else {
            throw new Error('Received transition fired event while not active');
        }
    };

    public destroy():void {
        this.removeOutgoingTransitionListeners();
    };
};

export class StartState<S,T> extends AbstractState<S,T> {
    constructor(payload?:S) {
        super(payload);
    };
    public isStartState():boolean { return true; };
};

export class State<S,T> extends AbstractState<S,T> {
    constructor(payload?:S) {
        super(payload);
    };
    public isStartState():boolean { return false; };
};