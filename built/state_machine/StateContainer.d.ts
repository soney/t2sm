import { AbstractState, StartState } from './State';
export declare abstract class StateContainer<S, T> {
    protected startState: StartState<S, T>;
    private activeState;
    protected states: Map<string, AbstractState<S, T>>;
    private fireFunctions;
    constructor(startStateName?: string);
    protected getStateLabel(state: AbstractState<S, T>): string;
    hasState(label: string): boolean;
    addState(payload?: S, label?: string): string;
    removeState(label: string): this;
    renameState(fromLabel: string, toLabel: string): void;
    protected getState(label: string): AbstractState<S, T>;
    addTransition(fromLabel: string, toLabel: string, payload?: any): Function;
    removeTransition(fireFn: Function): this;
    getActiveState(): string;
    setActiveState(label: string): this;
    getStates(): string[];
    protected getUniqueStateLabel(): string;
    getStartState(): string;
}
declare type EqualityCheck<E> = (i1: E, i2: E) => boolean;
export declare class MergableFSM<S, T> extends StateContainer<S, T> {
    private transitionsEqual;
    constructor(transitionsEqual: EqualityCheck<T>, startStateName?: string);
    iterateMerge(): void;
    private computeSimilarityScores;
    private equivalentTransitions;
    private getSimilarityScore;
    addTrace(trace: [T, S][]): void;
    private mergeStates;
}
export {};
