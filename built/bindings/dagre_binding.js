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
            const { transition } = event;
            this.graph.removeEdge(transition);
        };
        this.fsm.on('stateAdded', this.onStateAdded);
        this.fsm.on('stateRemoved', this.onStateRemoved);
        this.fsm.on('transitionAdded', this.onTransitionAdded);
        this.fsm.on('transitionRemoved', this.onTransitionRemoved);
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
            return this.stateOptions;
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
            return this.transitionOptions;
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