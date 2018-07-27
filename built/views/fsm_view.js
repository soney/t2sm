"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SVG = require("svg.js");
// import 'svg.pathmorphing.js';
const dagre = require("dagre");
const index_1 = require("../index");
const lodash_1 = require("lodash");
// interface MorphableAnimation extends SVG.Animation {
//     plot: (key: string) => this;
// }
var CREATE_TRANSITION_STATE;
(function (CREATE_TRANSITION_STATE) {
    CREATE_TRANSITION_STATE[CREATE_TRANSITION_STATE["IDLE"] = 0] = "IDLE";
    CREATE_TRANSITION_STATE[CREATE_TRANSITION_STATE["PRESSED_ON_FROM"] = 1] = "PRESSED_ON_FROM";
    CREATE_TRANSITION_STATE[CREATE_TRANSITION_STATE["LEFT_FROM"] = 2] = "LEFT_FROM";
    CREATE_TRANSITION_STATE[CREATE_TRANSITION_STATE["OVER_TO"] = 3] = "OVER_TO";
})(CREATE_TRANSITION_STATE || (CREATE_TRANSITION_STATE = {}));
class StateMachineDisplay {
    constructor(fsm, element) {
        this.fsm = fsm;
        this.element = element;
        this.states = new Map();
        this.transitions = new Map();
        this.createTransitionState = CREATE_TRANSITION_STATE.IDLE;
        this.creatingTransitionLine = null;
        this.addStateClicked = () => {
            this.addState();
        };
        this.mousemoveSVG = (event) => {
            if (this.creatingTransitionLine !== null) {
                const { clientX, clientY } = event;
                const { x, y } = this.svg.node.getBoundingClientRect();
                this.updateCreatingTransitionLine(clientX - x, clientY - y);
            }
        };
        this.mousedownGroup = (stateName, event) => {
            if (this.createTransitionState === CREATE_TRANSITION_STATE.IDLE && event.which === 3) {
                this.createTransitionState = CREATE_TRANSITION_STATE.PRESSED_ON_FROM;
                this.creatingTransitionFromState = stateName;
                this.creatingTransitionLine = this.svg.group();
                this.creatingTransitionLine.path('').stroke({ color: '#F00', width: 2 }).fill('none').addClass('nopointer');
                event.preventDefault();
                event.stopPropagation();
                this.mousemoveSVG(event);
                console.log('stop');
            }
            else {
                this.destroyTransitionCreationIntermediateData();
            }
        };
        this.mouseoutGroup = (stateName, event) => {
            if (this.createTransitionState === CREATE_TRANSITION_STATE.PRESSED_ON_FROM &&
                stateName === this.creatingTransitionFromState) {
                this.createTransitionState = CREATE_TRANSITION_STATE.LEFT_FROM;
            }
            else if (this.createTransitionState === CREATE_TRANSITION_STATE.OVER_TO) {
                this.createTransitionState = CREATE_TRANSITION_STATE.LEFT_FROM;
                this.creatingTransitionToState = null;
            }
            event.preventDefault();
        };
        this.mouseoverGroup = (stateName, event) => {
            if (this.createTransitionState === CREATE_TRANSITION_STATE.LEFT_FROM) {
                console.log('over');
                this.createTransitionState = CREATE_TRANSITION_STATE.OVER_TO;
                this.creatingTransitionToState = stateName;
            }
            event.preventDefault();
        };
        this.mouseupWindow = (event) => {
            event.preventDefault();
            this.destroyTransitionCreationIntermediateData();
        };
        this.mouseupGroup = (stateName, event) => {
            console.log('up');
            if (this.createTransitionState === CREATE_TRANSITION_STATE.OVER_TO &&
                stateName === this.creatingTransitionToState) {
                this.createTransitionState = CREATE_TRANSITION_STATE.IDLE;
                this.addTransition(this.creatingTransitionFromState, this.creatingTransitionToState, {});
                this.destroyTransitionCreationIntermediateData();
            }
            else {
                this.destroyTransitionCreationIntermediateData();
            }
            event.preventDefault();
            event.stopPropagation();
        };
        this.dagreBinding = new index_1.DagreBinding(fsm, { width: 50, height: 20 });
        this.graph = this.dagreBinding.getGraph();
        this.svg = SVG(element);
        this.addStateButton = this.svg.text('Add state');
        this.addStateButton.click(this.addStateClicked);
        this.graph.setGraph({});
        this.graph.setNode(this.fsm.getStartState(), { type: 'start', width: 30, height: 30 });
        const stateGroup = this.svg.group();
        stateGroup.circle(15);
        this.states.set(this.fsm.getStartState(), stateGroup);
        this.updateLayout();
        this.svg.on('mousemove', this.mousemoveSVG);
        window.addEventListener('mouseup', this.mouseupWindow);
    }
    ;
    addTransition(fromLabel, toLabel, payload) {
        const name = this.fsm.addTransition(fromLabel, toLabel, null, payload);
        this.addViewForNewTransitions();
        this.updateLayout();
        return name;
    }
    addViewForNewTransitions() {
        this.graph.edges().forEach((edge) => {
            if (!this.transitions.has(edge)) {
                const { v, w, name } = edge;
                const transitionGroup = this.svg.group();
                if (this.creatingTransitionLine) {
                    this.creatingTransitionLine.select('path').each(($, members) => {
                        members.forEach((p) => {
                            this.creatingTransitionLine.removeElement(p);
                            transitionGroup.add(p);
                            p.stroke({ color: '#000' });
                        });
                    });
                }
                else {
                    transitionGroup.path('').stroke({ color: '#000', width: 2 }).fill('none').addClass('nopointer');
                }
                this.transitions.set(name, transitionGroup);
            }
        });
    }
    addState(payload) {
        const stateName = this.fsm.addState(payload);
        this.addViewForNewNodes();
        this.updateLayout();
        return stateName;
    }
    ;
    addViewForNewNodes() {
        this.graph.nodes().forEach((node) => {
            if (!this.states.has(node)) {
                const stateGroup = this.svg.group();
                stateGroup.rect(50, 20);
                stateGroup.mousedown(this.mousedownGroup.bind(this, node));
                stateGroup.mouseout(this.mouseoutGroup.bind(this, node));
                stateGroup.mouseover(this.mouseoverGroup.bind(this, node));
                stateGroup.mouseup(this.mouseupGroup.bind(this, node));
                this.states.set(node, stateGroup);
            }
        });
    }
    destroyTransitionCreationIntermediateData() {
        this.creatingTransitionToState = this.creatingTransitionFromState = null;
        this.createTransitionState = CREATE_TRANSITION_STATE.IDLE;
        if (this.creatingTransitionLine) {
            this.creatingTransitionLine.remove();
            this.creatingTransitionLine = null;
        }
    }
    updateCreatingTransitionLine(x, y) {
        const node = this.graph.node(this.creatingTransitionFromState);
        this.creatingTransitionLine.select('path').each(($, members) => {
            members.forEach((p) => {
                p.plot(`M ${node.x} ${node.y} L ${x} ${y}`);
            });
        });
    }
    updateLayout() {
        dagre.layout(this.graph);
        const { width, height } = this.graph.graph();
        this.svg.width(width);
        this.svg.height(height);
        this.graph.nodes().forEach((v) => {
            const group = this.states.get(v);
            const node = this.graph.node(v);
            group.select('rect').each((i, members) => {
                members.forEach((r) => {
                    r.width(node.width);
                    r.height(node.height);
                    r.animate(1).center(node.x, node.y);
                });
            });
        });
        this.graph.edges().forEach((e) => {
            const node = this.graph.edge(e);
            const group = this.transitions.get(e.name);
            const path = group.select('path');
            const { points } = this.graph.edge(e);
            group.select('path').each(($, members) => {
                members.forEach((p) => {
                    const pointStrings = points.map(pnt => `${pnt.x} ${pnt.y}`);
                    const controlPoints = lodash_1.tail(pointStrings);
                    let pathString = `M ${pointStrings[0]}`;
                    for (let i = 1; i < pointStrings.length - 1; i += 2) {
                        pathString += ` Q ${pointStrings[i]} ${pointStrings[i + 1]}`;
                    }
                    const sndLstPnt = points[points.length - 2];
                    const lastPnt = points[points.length - 1];
                    const theta = Math.atan2(sndLstPnt.y - lastPnt.y, sndLstPnt.x - lastPnt.x);
                    const offset = 20 * Math.PI / 180;
                    const s = 10;
                    pathString += ` m ${Math.cos(theta + offset) * s} ${Math.sin(theta + offset) * s}`;
                    pathString += ` L ${lastPnt.x} ${lastPnt.y}`;
                    pathString += ` l ${Math.cos(theta - offset) * s} ${Math.sin(theta - offset) * s}`;
                    //  ${Math.cos(theta - offset) * s} ${Math.sin(theta - offset) * s}`;
                    // (p.animate(1) as MorphableAnimation).plot(pathString);
                    p.plot(pathString);
                });
            });
        });
    }
}
exports.StateMachineDisplay = StateMachineDisplay;
//# sourceMappingURL=fsm_view.js.map