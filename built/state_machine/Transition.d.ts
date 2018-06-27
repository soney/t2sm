import { AbstractState } from './State';
import { EventEmitter } from 'events';
export declare class Transition extends EventEmitter {
    private fromState;
    private toState;
    constructor(fromState: AbstractState, toState: AbstractState);
    remove(): void;
    getFromState(): AbstractState;
    getToState(): AbstractState;
    private _fire;
    fire: (event?: any, source?: any) => void;
}
