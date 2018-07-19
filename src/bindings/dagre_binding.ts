import * as dagre from 'dagre';
import {FSM, StateAddedEvent, StateRemovedEvent, TransitionAddedEvent, TransitionRemovedEvent} from '../state_machine/StateContainer';

export class DagreBinding {
    private graph: dagre.graphlib.Graph = new dagre.graphlib.Graph({ multigraph: true, directed: true });

    public constructor(private fsm:FSM<any, any>) {
        this.fsm.on('stateAdded', this.onStateAdded);
        this.fsm.on('stateRemoved', this.onStateRemoved);
        this.fsm.on('transitionAdded', this.onTransitionAdded);
        this.fsm.on('transitionRemoved', this.onTransitionRemoved);
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
        const {transition} = event;
        this.graph.removeEdge(transition);
    };
    private getStateOptions(state:string):{[key:string]: any} {
        const rv = {};
        return rv;
    };
    private getTransitionOptions(transition:string):{[key:string]: any} {
        const rv = {};
        return rv;
    };
};