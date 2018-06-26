import {Transition} from './Transition';

export abstract class AbstractState {
    private active:boolean = false;
    private outgoingTransitions:Transition[] = [];
    private incomingTransitions:Transition[] = [];
    public abstract isStartState():boolean;
    constructor(private label:string='') { };
    public getLabel():string {
        return this.label;
    };
    public addOutgoingTransition(toState:AbstractState):Transition {
        const transition = new Transition(this, toState);
        this.outgoingTransitions.push(transition);
        toState._addIncomingTransition(transition);
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
    protected _setIsActive(active:boolean):this {
        this.active = active;
        return this;
    };
};

export class StartState extends AbstractState {
    constructor(label?:string) {
        super(label);
    };
    public isStartState():boolean { return true; };
};

export class State extends AbstractState {
    constructor(label?:string) {
        super(label);
    };
    public isStartState():boolean { return false; };
}; 
