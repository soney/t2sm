"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SVG = require("svg.js");
require("svg.pathmorphing.js");
const dagre = require("dagre");
const __1 = require("..");
const lodash_1 = require("lodash");
const ForeignObjectDisplay_1 = require("./ForeignObjectDisplay");
const StateDisplay_1 = require("./StateDisplay");
const TransitionDisplay_1 = require("./TransitionDisplay");
var FSM_STATE;
(function (FSM_STATE) {
    FSM_STATE[FSM_STATE["IDLE"] = 0] = "IDLE";
    FSM_STATE[FSM_STATE["CT_PRESSED_FROM"] = 1] = "CT_PRESSED_FROM";
    FSM_STATE[FSM_STATE["CT_LEFT_FROM"] = 2] = "CT_LEFT_FROM";
    FSM_STATE[FSM_STATE["CT_OVER_TO"] = 3] = "CT_OVER_TO";
    FSM_STATE[FSM_STATE["AT_AWAITING_FROM"] = 4] = "AT_AWAITING_FROM";
    FSM_STATE[FSM_STATE["AT_AWAITING_TO"] = 5] = "AT_AWAITING_TO";
    FSM_STATE[FSM_STATE["RMS_WAITING"] = 6] = "RMS_WAITING";
    FSM_STATE[FSM_STATE["RMT_WAITING"] = 7] = "RMT_WAITING";
    FSM_STATE[FSM_STATE["TRANSITION_CHANGE_FROM"] = 8] = "TRANSITION_CHANGE_FROM";
    FSM_STATE[FSM_STATE["TRANSITION_CHANGE_TO"] = 9] = "TRANSITION_CHANGE_TO";
})(FSM_STATE || (FSM_STATE = {}));
var DISPLAY_TYPE;
(function (DISPLAY_TYPE) {
    DISPLAY_TYPE[DISPLAY_TYPE["STATE"] = 0] = "STATE";
    DISPLAY_TYPE[DISPLAY_TYPE["TRANSITION"] = 1] = "TRANSITION";
})(DISPLAY_TYPE = exports.DISPLAY_TYPE || (exports.DISPLAY_TYPE = {}));
;
const ADD_STATE_LABEL = 'ADDSTATE';
class StateMachineDisplay {
    constructor(fsm, element, getForeignObjectViewport = ForeignObjectDisplay_1.displayName, options) {
        this.fsm = fsm;
        this.element = element;
        this.getForeignObjectViewport = getForeignObjectViewport;
        this.states = new Map();
        this.transitions = new Map();
        this.fsmState = FSM_STATE.IDLE;
        this.creatingTransitionLine = null;
        this.addTransitionButton = document.createElement('button');
        this.removeStateButton = document.createElement('button');
        this.removeTransitionButton = document.createElement('button');
        this.resetLayoutButton = document.createElement('button');
        this.startStateDimensions = { width: 10, height: 10 };
        this.stateDimensions = { width: 80, height: 40 };
        this.transitionLabelDimensions = { width: 120, height: 30 };
        this.colors = {
            selectColor: '#002366',
            selectBackgroundColor: '#AAFFFF',
            startStateBackgroundColor: '#333',
            stateBackgroundColor: '#AAA',
            stateTextColor: '#444',
            transitionLineColor: '#777',
            transitionBackgroundColor: '#EEE',
            creatingTransitionColor: '#F00',
            activeColor: '#F00',
            activeBackgroundColor: '#FAA'
        };
        this.resetLayout = () => {
            this.fsm.setActiveState(this.fsm.getStartState());
        };
        this.addState = (payload) => {
            const stateName = this.fsm.addState(payload);
            this.addViewForNewNodes();
            this.updateLayout();
            return stateName;
        };
        this.addStateClicked = () => {
            this.addState();
        };
        this.addTransitionClicked = () => {
            this.fsmState = FSM_STATE.AT_AWAITING_FROM;
        };
        this.removeStateClicked = () => {
            this.fsmState = FSM_STATE.RMS_WAITING;
        };
        this.removeTransitionClicked = () => {
            this.fsmState = FSM_STATE.RMT_WAITING;
        };
        this.mouseoverTransitionGroup = (transitionName, event) => {
            if (this.hoveringTransition) {
                const hoveringTransitionDisplay = this.transitions.get(this.hoveringTransition);
                hoveringTransitionDisplay.updateColors();
            }
            this.hoveringTransition = transitionName;
            const group = this.transitions.get(transitionName);
            group.updateColors();
            const foDisplay = group.getForeignObjectDisplay();
            foDisplay.mouseEntered();
        };
        this.mouseoutTransitionGroup = (transitionName, event) => {
            const group = this.transitions.get(transitionName);
            if (this.hoveringTransition === transitionName) {
                this.hoveringTransition = null;
                group.updateColors();
            }
            const foDisplay = group.getForeignObjectDisplay();
            foDisplay.mouseLeft();
        };
        this.mousedownTransitionGroup = (transitionName, event) => {
            if (this.fsmState === FSM_STATE.RMT_WAITING) {
                this.fsm.removeTransition(transitionName);
                this.removeViewForOldTransitions();
                this.fsmState = FSM_STATE.IDLE;
                this.updateLayout();
            }
            else if (event.which === 1) {
                const v = this.fsm.getTransitionFrom(transitionName);
                const w = this.fsm.getTransitionTo(transitionName);
                const { points } = this.graph.edge({ v, w, name: transitionName });
                const firstPoint = points[0];
                const lastPoint = points[points.length - 1];
                const x = event.offsetX;
                const y = event.offsetY;
                const distanceOriginSq = Math.pow(x - firstPoint.x, 2) + Math.pow(y - firstPoint.y, 2);
                const distanceTailSq = Math.pow(x - lastPoint.x, 2) + Math.pow(y - lastPoint.y, 2);
                const draggingFrom = distanceOriginSq < distanceTailSq && distanceOriginSq < 300;
                const draggingTo = distanceOriginSq > distanceTailSq && distanceTailSq < 300;
                const transitionDisplay = this.transitions.get(transitionName);
                if (draggingFrom || draggingTo) {
                    if (draggingFrom) {
                        this.creatingTransitionToState = w;
                        this.fsmState = FSM_STATE.TRANSITION_CHANGE_FROM;
                    }
                    else {
                        this.creatingTransitionFromState = v;
                        this.fsmState = FSM_STATE.TRANSITION_CHANGE_TO;
                    }
                    const group = transitionDisplay.getGroup();
                    const path = transitionDisplay.getPath();
                    this.creatingTransitionLine = this.svg.group();
                    group.removeElement(path);
                    this.creatingTransitionLine.add(path);
                    path.stroke({ color: this.colors.creatingTransitionColor }).addClass('nopointer');
                    this.modifyingTransition = transitionName;
                    this.updateCreatingTransitionLine(x, y);
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        };
        this.mousemoveWindow = (event) => {
            if (this.creatingTransitionLine !== null) {
                const { clientX, clientY } = event;
                const { x, y } = this.svg.node.getBoundingClientRect();
                this.updateCreatingTransitionLine(clientX - x, clientY - y);
            }
        };
        this.mousedownStateGroup = (stateName, event) => {
            if (this.fsmState === FSM_STATE.IDLE && event.which === 3) {
                this.fsmState = FSM_STATE.CT_PRESSED_FROM;
                this.creatingTransitionFromState = stateName;
                this.creatingTransitionLine = this.svg.group();
                this.creatingTransitionLine.path('').stroke({ color: this.colors.creatingTransitionColor, width: this.options.transitionThickness }).fill('none').addClass('nopointer');
                event.preventDefault();
                event.stopPropagation();
                this.mousemoveWindow(event);
            }
            else if (this.fsmState === FSM_STATE.AT_AWAITING_FROM) {
                this.fsmState = FSM_STATE.AT_AWAITING_TO;
                this.creatingTransitionFromState = stateName;
                this.creatingTransitionLine = this.svg.group();
                this.creatingTransitionLine.path('').stroke({ color: this.colors.creatingTransitionColor, width: this.options.transitionThickness }).fill('none').addClass('nopointer');
            }
            else if (this.fsmState === FSM_STATE.AT_AWAITING_TO) {
                this.creatingTransitionToState = stateName;
                this.addTransition(this.creatingTransitionFromState, this.creatingTransitionToState, {});
                this.destroyTransitionCreationIntermediateData();
                this.fsmState = FSM_STATE.IDLE;
            }
            else if (this.fsmState === FSM_STATE.RMS_WAITING) {
                this.fsm.removeState(stateName);
                this.removeViewForOldNodes();
                this.removeViewForOldTransitions();
                this.updateLayout();
                this.fsmState = FSM_STATE.IDLE;
            }
            else {
                this.destroyTransitionCreationIntermediateData();
            }
        };
        this.mouseoutStateGroup = (stateName, event) => {
            const group = this.states.get(stateName);
            if (this.hoveringState === stateName) {
                this.hoveringState = null;
                group.updateColors();
            }
            if (this.fsmState === FSM_STATE.CT_PRESSED_FROM &&
                stateName === this.creatingTransitionFromState) {
                this.fsmState = FSM_STATE.CT_LEFT_FROM;
            }
            else if (this.fsmState === FSM_STATE.CT_OVER_TO) {
                this.fsmState = FSM_STATE.CT_LEFT_FROM;
                this.creatingTransitionToState = null;
            }
            const foDisplay = group.getForeignObjectDisplay();
            foDisplay.mouseLeft();
            event.preventDefault();
        };
        this.mouseoverStateGroup = (stateName, event) => {
            const group = this.states.get(stateName);
            this.hoveringState = stateName;
            group.updateColors();
            if (this.fsmState === FSM_STATE.CT_LEFT_FROM) {
                this.fsmState = FSM_STATE.CT_OVER_TO;
                this.creatingTransitionToState = stateName;
            }
            const foDisplay = group.getForeignObjectDisplay();
            foDisplay.mouseEntered();
            event.preventDefault();
        };
        this.keydownWindow = (event) => {
            if (event.which === 27 && this.fsmState !== FSM_STATE.IDLE) {
                this.destroyTransitionCreationIntermediateData();
                this.updateLayout();
            }
        };
        this.mouseupWindow = (event) => {
            event.preventDefault();
            if (this.fsmState === FSM_STATE.AT_AWAITING_TO || this.fsmState === FSM_STATE.CT_LEFT_FROM || this.fsmState === FSM_STATE.TRANSITION_CHANGE_FROM || this.fsmState === FSM_STATE.TRANSITION_CHANGE_TO) {
                this.destroyTransitionCreationIntermediateData();
                this.updateLayout();
            }
        };
        this.mouseupStateGroup = (stateName, event) => {
            if (this.fsmState === FSM_STATE.CT_OVER_TO &&
                stateName === this.creatingTransitionToState && event.which === 3) {
                this.fsmState = FSM_STATE.IDLE;
                try {
                    this.addTransition(this.creatingTransitionFromState, this.creatingTransitionToState, {});
                }
                catch (err) {
                    console.error(err);
                }
                this.destroyTransitionCreationIntermediateData();
            }
            else if (this.fsmState === FSM_STATE.TRANSITION_CHANGE_FROM) {
                try {
                    this.fsm.setTransitionFrom(this.modifyingTransition, stateName);
                }
                catch (err) {
                    console.error(err);
                }
                this.destroyTransitionCreationIntermediateData();
                this.updateLayout();
            }
            else if (this.fsmState === FSM_STATE.TRANSITION_CHANGE_TO) {
                try {
                    this.fsm.setTransitionTo(this.modifyingTransition, stateName);
                }
                catch (err) {
                    console.error(err);
                }
                this.destroyTransitionCreationIntermediateData();
                this.updateLayout();
            }
            event.preventDefault();
            event.stopPropagation();
        };
        this.options = lodash_1.extend({}, StateMachineDisplay.optionDefaults, options);
        this.dagreBinding = new __1.DagreBinding(fsm, (state) => {
            if (state === this.fsm.getStartState()) {
                return lodash_1.clone(this.startStateDimensions);
            }
            else {
                return lodash_1.clone(this.stateDimensions);
            }
        }, (transition) => {
            return lodash_1.extend(lodash_1.clone(this.transitionLabelDimensions), {
                labelpos: 'c'
            });
        }, {
            marginx: this.options.padding,
            marginy: this.options.padding
        });
        this.graph = this.dagreBinding.getGraph();
        this.header = document.createElement('div');
        this.svgContainer = document.createElement('div');
        this.element.appendChild(this.header);
        this.element.appendChild(this.svgContainer);
        this.svg = SVG(this.svgContainer);
        this.graph.setNode(ADD_STATE_LABEL, lodash_1.clone(this.stateDimensions));
        this.addStateButton = this.svg.group();
        this.addStateButton.rect().attr({
            fill: this.colors.stateBackgroundColor
        });
        this.addStateButton.text('+');
        this.addStateButton.click(this.addState);
        this.addViewForNewNodes();
        this.addViewForNewTransitions();
        this.updateLayout();
        window.addEventListener('mousemove', this.mousemoveWindow);
        window.addEventListener('mouseup', this.mouseupWindow);
        window.addEventListener('keydown', this.keydownWindow);
        this.fsm.on('transitionFiredEvent', (event) => {
            if (event.eligible) {
                this.onTransitionFired(event.transition, event.event);
            }
            else {
                this.onIneligibleTransitionFired(event.transition, event.event);
            }
        });
        this.fsm.on('activeStateChanged', (event) => {
            if (event.oldActiveState) {
                const oldStateDisplay = this.states.get(event.oldActiveState);
                oldStateDisplay.updateColors(this.options.transitionAnimationDuration / 3);
            }
            const stateDisplay = this.states.get(event.state);
            stateDisplay.updateColors(2 * this.options.transitionAnimationDuration / 3);
        });
        this.fsm.on('statePayloadChanged', (event) => {
            const sd = this.states.get(event.state);
            const fod = sd.getForeignObjectDisplay();
            fod.setPayload(event.payload);
        });
        this.fsm.on('transitionPayloadChanged', (event) => {
            const td = this.transitions.get(event.transition);
            const fod = td.getForeignObjectDisplay();
            fod.setPayload(event.payload);
        });
        this.fsm.on('stateAdded', () => {
            this.addViewForNewNodes();
            this.updateLayout();
        });
        this.fsm.on('transitionAdded', () => {
            this.addViewForNewTransitions();
            this.updateLayout();
        });
        this.fsm.on('stateRemoved', () => {
            this.removeViewForOldNodes();
            this.updateLayout();
        });
        this.fsm.on('transitionRemoved', () => {
            this.removeViewForOldTransitions();
            this.updateLayout();
        });
        this.fsm.on('transitionToStateChanged', () => {
            this.updateLayout();
        });
        this.fsm.on('transitionFromStateChanged', () => {
            this.updateLayout();
        });
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
            const { v, w, name } = edge;
            if (!this.transitions.has(name)) {
                const transitionDisplay = new TransitionDisplay_1.SVGTransitionDisplay(this, edge, this.transitionLabelDimensions, this.creatingTransitionLine);
                this.transitions.set(name, transitionDisplay);
                transitionDisplay.addListener('mouseover', this.mouseoverTransitionGroup.bind(this, name));
                transitionDisplay.addListener('mouseout', this.mouseoutTransitionGroup.bind(this, name));
                transitionDisplay.addListener('mousedown', this.mousedownTransitionGroup.bind(this, name));
                transitionDisplay.addListener('delete', () => {
                    this.fsm.removeTransition(name);
                });
            }
        });
    }
    getSVG() { return this.svg; }
    getFSM() { return this.fsm; }
    getGraph() { return this.graph; }
    getFOVGetter() {
        return this.getForeignObjectViewport;
    }
    getTransitionColors(transitionName) {
        if (this.hoveringTransition === transitionName) {
            return { background: this.colors.selectBackgroundColor, foreground: this.colors.selectColor };
        }
        else {
            return { background: this.colors.transitionBackgroundColor, foreground: this.colors.transitionLineColor };
        }
    }
    getStateColors(stateName) {
        if (this.hoveringState === stateName) {
            return { background: this.colors.selectBackgroundColor, foreground: this.colors.selectColor };
        }
        else if (this.fsm.getActiveState() === stateName) {
            return { background: this.colors.activeBackgroundColor, foreground: this.colors.activeColor };
        }
        else if (this.fsm.getStartState() === stateName) {
            return { background: this.colors.startStateBackgroundColor, foreground: this.colors.stateTextColor };
        }
        else {
            return { background: this.colors.stateBackgroundColor, foreground: this.colors.stateTextColor };
        }
    }
    onTransitionFired(transition, event) {
        const transitionDisplay = this.transitions.get(transition);
        const foDisplay = transitionDisplay.getForeignObjectDisplay();
        foDisplay.transitionFired(event);
        if (this.options.transitionAnimationDuration > 0) {
            transitionDisplay.animateFiring();
        }
    }
    onIneligibleTransitionFired(transition, event) {
        const transitionDisplay = this.transitions.get(transition);
        transitionDisplay.animateIneligibleFiring();
    }
    addViewForNewNodes() {
        this.graph.nodes().forEach((node) => {
            if (!this.states.has(node) && node !== ADD_STATE_LABEL) {
                if (node === this.fsm.getStartState()) {
                    const stateDisplay = new StateDisplay_1.SVGStartStateDisplay(this, node, this.stateDimensions);
                    this.states.set(node, stateDisplay);
                }
                else {
                    const stateDisplay = new StateDisplay_1.SVGStateDisplay(this, node, this.stateDimensions);
                    this.states.set(node, stateDisplay);
                }
                const sd = this.states.get(node);
                sd.addListener('mouseover', this.mouseoverStateGroup.bind(this, node));
                sd.addListener('mouseout', this.mouseoutStateGroup.bind(this, node));
                sd.addListener('mousedown', this.mousedownStateGroup.bind(this, node));
                sd.addListener('mouseup', this.mouseupStateGroup.bind(this, node));
                sd.addListener('delete', () => {
                    this.fsm.removeState(node);
                });
                sd.addListener('addOutgoingTransition', () => {
                    this.fsmState = FSM_STATE.AT_AWAITING_TO;
                    this.creatingTransitionFromState = node;
                    this.creatingTransitionLine = this.svg.group();
                    this.creatingTransitionLine.path('').stroke({ color: this.colors.creatingTransitionColor, width: this.options.transitionThickness }).fill('none').addClass('nopointer');
                });
            }
        });
    }
    removeViewForOldNodes() {
        const toRemove = new Set(this.states.keys());
        this.graph.nodes().forEach((stateName) => toRemove.delete(stateName));
        toRemove.forEach((stateName) => {
            const stateGroup = this.states.get(stateName);
            stateGroup.remove();
            this.states.delete(stateName);
            const foDisplay = stateGroup.getForeignObjectDisplay();
            foDisplay.destroy();
        });
    }
    removeViewForOldTransitions() {
        const toRemove = new Set(this.transitions.keys());
        this.graph.edges().forEach((edge) => toRemove.delete(edge.name));
        toRemove.forEach((transitionName) => {
            const transitionGroup = this.transitions.get(transitionName);
            transitionGroup.remove();
            this.transitions.delete(transitionName);
            const foDisplay = transitionGroup.getForeignObjectDisplay();
            foDisplay.destroy();
        });
    }
    destroyTransitionCreationIntermediateData() {
        this.creatingTransitionToState = this.creatingTransitionFromState = null;
        this.fsmState = FSM_STATE.IDLE;
        if (this.creatingTransitionLine) {
            if (this.modifyingTransition) {
                const transitionGroup = this.transitions.get(this.modifyingTransition);
                this.forEachInGroup(this.creatingTransitionLine, 'path', (p) => {
                    this.creatingTransitionLine.removeElement(p);
                    const group = transitionGroup.getGroup();
                    group.add(p);
                    p.stroke({ color: this.colors.transitionLineColor }).removeClass('nopointer');
                });
                this.modifyingTransition = null;
            }
            this.creatingTransitionLine.remove();
            this.creatingTransitionLine = null;
        }
    }
    updateCreatingTransitionLine(x, y) {
        const reverse = this.fsmState === FSM_STATE.TRANSITION_CHANGE_FROM;
        const node = this.graph.node(reverse ? this.creatingTransitionToState : this.creatingTransitionFromState);
        this.forEachInGroup(this.creatingTransitionLine, 'path', (p) => {
            const from = reverse ? { x, y } : node;
            const to = reverse ? node : { x, y };
            p.plot(`M ${from.x} ${from.y} L ${to.x} ${to.y} ${TransitionDisplay_1.SVGTransitionDisplay.getArrowPath(from, to)}`);
        });
    }
    updateLayout() {
        dagre.layout(this.graph);
        const { width, height } = this.graph.graph();
        this.svg.width(width);
        this.svg.height(height);
        this.states.forEach((stateGroup) => {
            stateGroup.updateLayout();
        });
        this.transitions.forEach((transitionGroup) => {
            transitionGroup.updateLayout();
        });
        const addStateInfo = this.graph.node(ADD_STATE_LABEL);
        this.forEachInGroup(this.addStateButton, 'rect', (r) => {
            r.size(addStateInfo.width, addStateInfo.height);
            if (this.options.animationDuration > 0) {
                r.animate(this.options.animationDuration).center(addStateInfo.x, addStateInfo.y);
            }
            else {
                r.center(addStateInfo.x, addStateInfo.y);
            }
        });
        this.forEachInGroup(this.addStateButton, 'text', (t) => {
            if (this.options.animationDuration > 0) {
                t.animate(this.options.animationDuration).center(addStateInfo.x, addStateInfo.y);
            }
            else {
                t.center(addStateInfo.x, addStateInfo.y);
            }
        });
        this.graph.setNode(ADD_STATE_LABEL, this.stateDimensions);
    }
    forEachInGroup(group, selector, fn) {
        group.select(selector).each((i, members) => {
            members.forEach((el) => {
                fn(el);
            });
        });
    }
}
StateMachineDisplay.optionDefaults = {
    showControls: true,
    transitionAnimationDuration: 300,
    animationDuration: 140,
    transitionThickness: 3,
    padding: 30
};
exports.StateMachineDisplay = StateMachineDisplay;
if (typeof window != 'undefined' && window.document) {
    window['t2sm'].StateMachineDisplay = StateMachineDisplay;
}
//# sourceMappingURL=StateMachineDisplay.js.map