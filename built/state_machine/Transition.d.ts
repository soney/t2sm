import { AbstractState } from './State';
import { EventEmitter } from 'events';
export declare class Transition<S, T> extends EventEmitter {
    private fromState;
    private toState;
    private payload?;
    private eligible;
    constructor(fromState: AbstractState<S, T>, toState: AbstractState<S, T>, payload?: T);
    isEligible(): boolean;
    setEligible(eligible: boolean): void;
    remove(): void;
    getFromState(): AbstractState<S, T>;
    getToState(): AbstractState<S, T>;
    fire: (event?: any, source?: any) => void;
    setFromState(state: AbstractState<S, T>): void;
    setToState(state: AbstractState<S, T>): void;
    getPayload(): T;
}
