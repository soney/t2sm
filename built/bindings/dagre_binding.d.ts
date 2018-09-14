import * as dagre from 'dagre';
import { FSM } from '../state_machine/FSM';
export declare type StateOptions = ((state: string) => {
    [key: string]: any;
}) | {
    [key: string]: any;
};
export declare type TransitionOptions = ((transition: string) => {
    [key: string]: any;
}) | {
    [key: string]: any;
};
export declare class DagreBinding {
    private fsm;
    private stateOptions?;
    private transitionOptions?;
    private graphOptions;
    private graph;
    constructor(fsm: FSM<any, any>, stateOptions?: StateOptions, transitionOptions?: TransitionOptions, graphOptions?: any);
    getGraph(): dagre.graphlib.Graph;
    private onStateAdded;
    private onStateRemoved;
    private onTransitionAdded;
    private onTransitionRemoved;
    private onTransitionFromStateChanged;
    private onTransitionToStateChanged;
    private getStateOptions;
    private getTransitionOptions;
}
