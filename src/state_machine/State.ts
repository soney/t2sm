import {Transition} from './Transition';
import { EventEmitter } from 'events';

export abstract class AbstractState extends EventEmitter {
    private active:boolean = false;
    private outgoingTransitions:Transition[] = [];
    private incomingTransitions:Transition[] = [];
    public abstract isStartState():boolean;
    constructor(private label:string) {
        super();
    };
    public getLabel():string {
        return this.label;
    };
    public setLabel(label:string):void {
        this.label = label;
    };
    public addOutgoingTransition(toState:AbstractState):Transition {
        const transition = new Transition(this, toState);
        this.outgoingTransitions.push(transition);
        toState._addIncomingTransition(transition);

        if(this.isActive()) {
            transition.addListener('fire', this.onOutgoingTransitionFired);
        }

        return transition;
    };
    protected _addIncomingTransition(transition:Transition):void {
        this.incomingTransitions.push(transition);
    };

    public removeOutgoingTransition(transition:Transition):this {
        for(let i:number = 0; i<this.outgoingTransitions.length; i++) {
            if(this.outgoingTransitions[i] === transition) {
                if(transition.getToState()._removeIncomingTransition(transition)) {
                    this.outgoingTransitions.splice(i, 1);
                    transition.removeListener('fire', this.onOutgoingTransitionFired);
                    break;
                }
            }
        }
        return this;
    };
    protected _removeIncomingTransition(transition:Transition):boolean {
        for(let i:number = 0; i<this.incomingTransitions.length; i++) {
            if(this.incomingTransitions[i] === transition) {
                this.incomingTransitions.splice(i, 1);
                return true;
            }
        }
        return false;
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

    private onOutgoingTransitionFired = (transition:Transition, event:any, source:any) => {
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

export class StartState extends AbstractState {
    constructor(label:string) {
        super(label);
    };
    public isStartState():boolean { return true; };
};

export class State extends AbstractState {
    constructor(label:string) {
        super(label);
    };
    public isStartState():boolean { return false; };
}; 
