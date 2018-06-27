import { Transition } from './Transition';
import { EventEmitter } from 'events';
export declare abstract class AbstractState extends EventEmitter {
    private label;
    private active;
    private outgoingTransitions;
    private incomingTransitions;
    abstract isStartState(): boolean;
    constructor(label: string);
    getLabel(): string;
    setLabel(label: string): void;
    addOutgoingTransition(toState: AbstractState): Transition;
    protected _addIncomingTransition(transition: Transition): void;
    removeOutgoingTransition(transition: Transition): this;
    protected _removeIncomingTransition(transition: Transition): boolean;
    isActive(): boolean;
    setIsActive(active: boolean): void;
    private addOutgoingTransitionListeners;
    private removeOutgoingTransitionListeners;
    private onOutgoingTransitionFired;
    destroy(): void;
}
export declare class StartState extends AbstractState {
    constructor(label: string);
    isStartState(): boolean;
}
export declare class State extends AbstractState {
    constructor(label: string);
    isStartState(): boolean;
}
