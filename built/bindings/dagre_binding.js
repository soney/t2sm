"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dagre = require("dagre");
const lodash_1 = require("lodash");
class DagreBinding {
    constructor(fsm, stateOptions, transitionOptions) {
        this.fsm = fsm;
        this.stateOptions = stateOptions;
        this.transitionOptions = transitionOptions;
        this.graph = new dagre.graphlib.Graph({ multigraph: true, directed: true });
        this.onStateAdded = (event) => {
            const { state } = event;
            this.graph.setNode(state, this.getStateOptions(state));
        };
        this.onStateRemoved = (event) => {
            const { state } = event;
            this.graph.removeNode(state);
        };
        this.onTransitionAdded = (event) => {
            const { transition, from, to } = event;
            this.graph.setEdge(from, to, this.getTransitionOptions(transition), transition);
        };
        this.onTransitionRemoved = (event) => {
            const { transition, oldFrom, oldTo } = event;
            this.graph.removeEdge({ name: transition, v: oldFrom, w: oldTo });
        };
        this.onTransitionFromStateChanged = (event) => {
            const { oldFrom } = event;
            const name = event.transition;
            const v = oldFrom;
            const w = this.fsm.getTransitionTo(name);
            this.graph.removeEdge({ name, v, w });
            this.graph.setEdge(this.fsm.getTransitionFrom(name), w, this.getTransitionOptions(name), name);
        };
        this.onTransitionToStateChanged = (event) => {
            const { oldTo } = event;
            const name = event.transition;
            const v = this.fsm.getTransitionFrom(name);
            const w = oldTo;
            this.graph.removeEdge({ name, v, w });
            this.graph.setEdge(v, this.fsm.getTransitionTo(name), this.getTransitionOptions(name), name);
        };
        this.graph.setGraph({});
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
    }
    ;
    getGraph() {
        return this.graph;
    }
    ;
    getStateOptions(state) {
        if (lodash_1.isFunction(this.stateOptions)) {
            return this.stateOptions(state);
        }
        else if (this.stateOptions) {
            return lodash_1.clone(this.stateOptions);
        }
        else {
            return {};
        }
    }
    ;
    getTransitionOptions(transition) {
        if (lodash_1.isFunction(this.transitionOptions)) {
            return this.transitionOptions(transition);
        }
        else if (this.transitionOptions) {
            return lodash_1.clone(this.transitionOptions);
        }
        else {
            return {};
        }
    }
    ;
}
exports.DagreBinding = DagreBinding;
;
//# sourceMappingURL=dagre_binding.js.map