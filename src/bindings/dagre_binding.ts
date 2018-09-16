import * as dagre from 'dagre';
import {FSM, StateAddedEvent, StateRemovedEvent, TransitionAddedEvent, TransitionRemovedEvent, TransitionFromStateChangedEvent, TransitionToStateChangedEvent} from '../state_machine/FSM';
import {isFunction, clone} from 'lodash';

export type StateOptions = ((state: string) => {[key: string]: any}) | {[key: string]: any};
export type TransitionOptions = ((transition: string) => {[key: string]: any}) | {[key: string]: any};

export class DagreBinding {
    private graph: dagre.graphlib.Graph = new dagre.graphlib.Graph({ multigraph: true, directed: true });

    public constructor(private fsm:FSM<any, any>, private stateOptions?:StateOptions, private transitionOptions?:TransitionOptions, private graphOptions: any = {}) {
        this.graph.setGraph(graphOptions);
        this.fsm.getStates().forEach((state) => {
            this.graph.setNode(state, this.getStateOptions(state));
        });
        this.fsm.getTransitions().forEach((transition) => {
            const from = this.fsm.getTransitionFrom(transition);
            const to = this.fsm.getTransitionTo(transition);
            this.graph.setEdge(from, to, this.getTransitionOptions(transition), transition);
        });
        this.fsm.on('stateAdded', this.onStateAdded);
        this.fsm.on('stateRemoved', this.onStateRemoved);
        this.fsm.on('transitionAdded', this.onTransitionAdded);
        this.fsm.on('transitionRemoved', this.onTransitionRemoved);
        this.fsm.on('transitionToStateChanged', this.onTransitionToStateChanged);
        this.fsm.on('transitionFromStateChanged', this.onTransitionFromStateChanged);
    };

    public getGraph():dagre.graphlib.Graph {
        return this.graph;
    };

    private onStateAdded = (event:StateAddedEvent):void => {
        const {state} = event;
        this.graph.setNode(state, this.getStateOptions(state));
    };
    private onStateRemoved = (event:StateRemovedEvent):void => {
        const {state} = event;
        this.graph.removeNode(state);
    };
    private onTransitionAdded = (event:TransitionAddedEvent):void => {
        const {transition, from, to} = event;
        this.graph.setEdge(from, to, this.getTransitionOptions(transition), transition);
    };
    private onTransitionRemoved = (event:TransitionRemovedEvent):void => {
        const {transition, oldFrom, oldTo} = event;
        (this.graph as any).removeEdge({name: transition, v: oldFrom, w: oldTo});
    };
    private onTransitionFromStateChanged = (event:TransitionFromStateChangedEvent):void => {
        const {oldFrom} = event;
        const name = event.transition;
        const v = oldFrom;
        const w = this.fsm.getTransitionTo(name);
        const oldData = this.graph.edge({name, v, w});
        (this.graph as any).removeEdge({name, v, w});
        this.graph.setEdge(this.fsm.getTransitionFrom(name), w, oldData, name);
    };
    private onTransitionToStateChanged = (event:TransitionToStateChangedEvent):void => {
        const {oldTo} = event;
        const name = event.transition;
        const v = this.fsm.getTransitionFrom(name);
        const w = oldTo;
        const oldData = this.graph.edge({name, v, w});
        (this.graph as any).removeEdge({name, v, w});
        this.graph.setEdge(v, this.fsm.getTransitionTo(name), oldData, name);
    };
    private getStateOptions(state:string):{[key:string]: any} {
        if(isFunction(this.stateOptions)) {
            return this.stateOptions(state);
        } else if(this.stateOptions) {
            return clone(this.stateOptions);
        } else {
            return {};
        }
    };
    private getTransitionOptions(transition:string):{[key:string]: any} {
        if(isFunction(this.transitionOptions)) {
            return this.transitionOptions(transition);
        } else if(this.transitionOptions) {
            return clone(this.transitionOptions);
        } else {
            return {};
        }
    };
};