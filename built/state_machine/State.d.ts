import { Transition } from './Transition';
import { EventEmitter } from 'events';
export declare abstract class AbstractState<S, T> extends EventEmitter {
    private payload?;
    private active;
    private outgoingTransitions;
    private incomingTransitions;
    abstract isStartState(): boolean;
    constructor(payload?: S);
    getPayload(): S;
    _getOutgoingTransitions(): Transition<S, T>[];
    _getIncomingTransitions(): Transition<S, T>[];
    _addOutgoingTransition(transition: Transition<S, T>): void;
    _addIncomingTransition(transition: Transition<S, T>): void;
    _removeOutgoingTransition(transition: Transition<S, T>): boolean;
    _removeIncomingTransition(transition: Transition<S, T>): boolean;
    isActive(): boolean;
    setIsActive(active: boolean): void;
    private addOutgoingTransitionListeners;
    private removeOutgoingTransitionListeners;
    private onOutgoingTransitionFired;
    destroy(): void;
}
export declare class StartState<S, T> extends AbstractState<S, T> {
    constructor(payload?: S);
    isStartState(): boolean;
}
export declare class State<S, T> extends AbstractState<S, T> {
    constructor(payload?: S);
    isStartState(): boolean;
}
