import { FSM } from '../state_machine/FSM';
export declare type EqualityCheck<E> = (i1: E, i2: E) => boolean;
export declare type SimilarityScore<E> = (i1: E, i2: E) => number;
/**
 * Merge two states together
 */
export declare function mergeStates(fsm: FSM<any, any>, removeState: string, mergeInto: string, removeStaleStates?: boolean, transitionsEqual?: EqualityCheck<any>): void;
