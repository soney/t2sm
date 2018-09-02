"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SVG = require("svg.js");
require("svg.pathmorphing.js");
const dagre = require("dagre");
const __1 = require("..");
const lodash_1 = require("lodash");
const ForeignObjectDisplay_1 = require("./ForeignObjectDisplay");
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
class StateMachineDisplay {
    constructor(fsm, element, getForeignObjectViewport = ForeignObjectDisplay_1.displayName, options) {
        this.fsm = fsm;
        this.element = element;
        this.getForeignObjectViewport = getForeignObjectViewport;
        this.states = new Map();
        this.transitions = new Map();
        this.stateFODisplays = new Map();
        this.transitionFODisplays = new Map();
        this.fsmState = FSM_STATE.IDLE;
        this.creatingTransitionLine = null;
        this.addStateButton = document.createElement('button');
        this.addTransitionButton = document.createElement('button');
        this.removeStateButton = document.createElement('button');
        this.removeTransitionButton = document.createElement('button');
        this.resetLayoutButton = document.createElement('button');
        this.startStateDimensions = { width: 60, height: 30 };
        this.stateDimensions = { width: 80, height: 40 };
        this.transitionLabelDimensions = { width: 120, height: 30 };
        this.colors = {
            selectColor: '#002366',
            selectBackgroundColor: '#AAFFFF',
            startStateBackgroundColor: '#888',
            stateBackgroundColor: '#AAA',
            stateTextColor: '#444',
            transitionLineColor: '#777',
            transitionBackgroundColor: '#EEE',
            creatingTransitionColor: '#F00',
            activeColor: '#F00',
            activeBackgroundColor: '#FAA'
        };
        this.transitionThickness = 3;
        this.resetLayout = () => {
            this.fsm.setActiveState(this.fsm.getStartState());
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
        this.mousemoveWindow = (event) => {
            if (this.creatingTransitionLine !== null) {
                const { clientX, clientY } = event;
                const { x, y } = this.svg.node.getBoundingClientRect();
                this.updateCreatingTransitionLine(clientX - x, clientY - y);
            }
        };
        this.mouseoverTransitionGroup = (transitionName, event) => {
            const group = this.transitions.get(transitionName);
            if (this.hoveringTransition) {
                this.updateTransitionDisplay(this.hoveringTransition);
            }
            this.hoveringTransition = transitionName;
            this.updateTransitionDisplay(transitionName);
            const foDisplay = this.transitionFODisplays.get(transitionName);
            foDisplay.mouseEntered();
        };
        this.mouseoutTransitionGroup = (transitionName, event) => {
            if (this.hoveringTransition === transitionName) {
                this.hoveringTransition = null;
                this.updateTransitionDisplay(transitionName);
            }
            const foDisplay = this.transitionFODisplays.get(transitionName);
            foDisplay.mouseLeft();
        };
        this.mouseupTransitionGroup = (transitionName, event) => {
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
                const group = this.transitions.get(transitionName);
                if (draggingFrom || draggingTo) {
                    if (draggingFrom) {
                        this.creatingTransitionToState = w;
                        this.fsmState = FSM_STATE.TRANSITION_CHANGE_FROM;
                    }
                    else {
                        this.creatingTransitionFromState = v;
                        this.fsmState = FSM_STATE.TRANSITION_CHANGE_TO;
                    }
                    this.creatingTransitionLine = this.svg.group();
                    this.forEachInGroup(group, 'path', (p) => {
                        group.removeElement(p);
                        this.creatingTransitionLine.add(p);
                        p.stroke({ color: this.colors.creatingTransitionColor }).addClass('nopointer');
                    });
                    this.modifyingTransition = transitionName;
                    this.updateCreatingTransitionLine(x, y);
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        };
        this.mousedownStateGroup = (stateName, event) => {
            if (this.fsmState === FSM_STATE.IDLE && event.which === 3) {
                this.fsmState = FSM_STATE.CT_PRESSED_FROM;
                this.creatingTransitionFromState = stateName;
                this.creatingTransitionLine = this.svg.group();
                this.creatingTransitionLine.path('').stroke({ color: this.colors.creatingTransitionColor, width: this.transitionThickness }).fill('none').addClass('nopointer');
                event.preventDefault();
                event.stopPropagation();
                this.mousemoveWindow(event);
            }
            else if (this.fsmState === FSM_STATE.AT_AWAITING_FROM) {
                this.fsmState = FSM_STATE.AT_AWAITING_TO;
                this.creatingTransitionFromState = stateName;
                this.creatingTransitionLine = this.svg.group();
                this.creatingTransitionLine.path('').stroke({ color: this.colors.creatingTransitionColor, width: this.transitionThickness }).fill('none').addClass('nopointer');
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
                this.updateStateDisplay(stateName);
            }
            if (this.fsmState === FSM_STATE.CT_PRESSED_FROM &&
                stateName === this.creatingTransitionFromState) {
                this.fsmState = FSM_STATE.CT_LEFT_FROM;
            }
            else if (this.fsmState === FSM_STATE.CT_OVER_TO) {
                this.fsmState = FSM_STATE.CT_LEFT_FROM;
                this.creatingTransitionToState = null;
            }
            const foDisplay = this.stateFODisplays.get(stateName);
            foDisplay.mouseLeft();
            event.preventDefault();
        };
        this.mouseoverStateGroup = (stateName, event) => {
            const group = this.states.get(stateName);
            this.hoveringState = stateName;
            this.updateStateDisplay(stateName);
            if (this.fsmState === FSM_STATE.CT_LEFT_FROM) {
                this.fsmState = FSM_STATE.CT_OVER_TO;
                this.creatingTransitionToState = stateName;
            }
            const foDisplay = this.stateFODisplays.get(stateName);
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
        });
        this.graph = this.dagreBinding.getGraph();
        this.header = document.createElement('div');
        this.svgContainer = document.createElement('div');
        this.element.appendChild(this.header);
        this.element.appendChild(this.svgContainer);
        this.addStateButton.textContent = 'Add state';
        this.addStateButton.addEventListener('click', this.addStateClicked);
        this.header.appendChild(this.addStateButton);
        this.addTransitionButton.textContent = 'Add transition';
        this.addTransitionButton.addEventListener('click', this.addTransitionClicked);
        this.header.appendChild(this.addTransitionButton);
        this.removeStateButton.textContent = 'Remove state';
        this.removeStateButton.addEventListener('click', this.removeStateClicked);
        this.header.appendChild(this.removeStateButton);
        this.removeTransitionButton.textContent = 'Remove transition';
        this.removeTransitionButton.addEventListener('click', this.removeTransitionClicked);
        this.header.appendChild(this.removeTransitionButton);
        this.resetLayoutButton.textContent = 'Reset Layout';
        this.resetLayoutButton.addEventListener('click', this.resetLayout);
        this.header.appendChild(this.resetLayoutButton);
        this.svg = SVG(this.svgContainer);
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
                this.updateStateDisplay(event.oldActiveState, this.options.transitionAnimationDuration / 3);
            }
            this.updateStateDisplay(event.state, 2 * this.options.transitionAnimationDuration / 3);
        });
        this.fsm.on('statePayloadChanged', (event) => {
            const fod = this.stateFODisplays.get(event.state);
            fod.setPayload(event.payload);
        });
        this.fsm.on('transitionPayloadChanged', (event) => {
            const fod = this.transitionFODisplays.get(event.transition);
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
            console.log('b');
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
                const transitionGroup = this.svg.group();
                if (this.creatingTransitionLine) {
                    this.forEachInGroup(this.creatingTransitionLine, 'path', (p) => {
                        this.creatingTransitionLine.removeElement(p);
                        transitionGroup.add(p);
                        p.stroke({ color: this.colors.transitionLineColor }).removeClass('nopointer');
                    });
                }
                else {
                    transitionGroup.path('').stroke({ color: this.colors.transitionLineColor, width: this.transitionThickness }).fill('none').removeClass('nopointer');
                }
                transitionGroup.rect(this.transitionLabelDimensions.width, this.transitionLabelDimensions.height).fill(this.colors.transitionBackgroundColor).stroke(this.colors.transitionLineColor);
                const foreignObjectElement = transitionGroup.element('foreignObject');
                const foreignObjectDisplay = new ForeignObjectDisplay_1.ForeignObjectDisplay(this.fsm, foreignObjectElement.node, name, DISPLAY_TYPE.TRANSITION);
                const value = this.getForeignObjectViewport(foreignObjectDisplay);
                if (isString(value) && !foreignObjectDisplay.getElement().hasChildNodes()) {
                    this.getForeignObjectViewport = ForeignObjectDisplay_1.displayValue(this.getForeignObjectViewport);
                    this.getForeignObjectViewport(foreignObjectDisplay);
                }
                foreignObjectDisplay.on('setDimensions', (event) => {
                    const e = this.graph.edge(edge);
                    lodash_1.extend(e, { width: event.width, height: event.height });
                    this.updateLayout();
                });
                this.transitionFODisplays.set(name, foreignObjectDisplay);
                this.addTransitionListeners(name, transitionGroup);
                this.transitions.set(name, transitionGroup);
            }
        });
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
        const foDisplay = this.transitionFODisplays.get(transition);
        foDisplay.transitionFired(event);
        if (this.options.transitionAnimationDuration > 0) {
            this.animateTransition(transition);
        }
    }
    onIneligibleTransitionFired(transition, event) {
        this.forEachInGroup(this.transitions.get(transition), 'rect', (r) => {
            const cx = r.cx();
            const cy = r.cy();
            const width = r.width();
            const height = r.height();
            r.animate(25).size(width + 10, height + 10).center(cx, cy);
            r.animate(75).size(width, height).center(cx, cy);
        });
        setTimeout(() => this.updateLayout(), 110);
    }
    animateTransition(transition) {
        const overallDuration = this.options.transitionAnimationDuration;
        const segments = 10;
        this.forEachInGroup(this.transitions.get(transition), 'path', (p) => {
            const len = p.length();
            let point = p.pointAt(0);
            const dot = this.svg.path(`M ${point.x} ${point.y} l 0 0`).stroke({ color: this.colors.activeColor, width: this.transitionThickness * 2 });
            for (let i = 0; i < segments; i++) {
                const startIndex = i * (len / segments);
                const endIndex = (i + 1) * (len / segments);
                const startPoint = p.pointAt(startIndex);
                const endPoint = p.pointAt(endIndex);
                setTimeout(() => {
                    dot.animate(overallDuration / segments).plot(`M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`);
                }, i * overallDuration / segments);
            }
            setTimeout(() => {
                dot.remove();
            }, overallDuration);
        });
        this.forEachInGroup(this.transitions.get(transition), 'rect', (r) => {
            setTimeout(() => { r.stroke({ color: this.colors.activeColor }).fill(this.colors.activeBackgroundColor); }, overallDuration / 3);
            setTimeout(() => { this.updateTransitionDisplay(transition); }, 2 * overallDuration / 3);
            r.front();
        });
        this.forEachInGroup(this.transitions.get(transition), 'foreignObject', (f) => {
            f.front();
        });
    }
    addState(payload) {
        const stateName = this.fsm.addState(payload);
        this.addViewForNewNodes();
        this.updateLayout();
        return stateName;
    }
    addStateListeners(node, stateGroup) {
        stateGroup.each((i, children) => {
            children.forEach((child) => {
                child.on('contextmenu', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                });
            });
        });
        stateGroup.mousedown(this.mousedownStateGroup.bind(this, node));
        stateGroup.mouseout(this.mouseoutStateGroup.bind(this, node));
        stateGroup.mouseover(this.mouseoverStateGroup.bind(this, node));
        stateGroup.mouseup(this.mouseupStateGroup.bind(this, node));
    }
    addTransitionListeners(edge, transitionGroup) {
        transitionGroup.mousedown(this.mousedownTransitionGroup.bind(this, edge));
        transitionGroup.mouseout(this.mouseoutTransitionGroup.bind(this, edge));
        transitionGroup.mouseover(this.mouseoverTransitionGroup.bind(this, edge));
        transitionGroup.mouseup(this.mouseupTransitionGroup.bind(this, edge));
    }
    addViewForNewNodes() {
        this.graph.nodes().forEach((node) => {
            if (!this.states.has(node)) {
                const stateGroup = this.svg.group();
                const isStart = node === this.fsm.getStartState();
                const dimensions = isStart ? this.startStateDimensions : this.stateDimensions;
                stateGroup.rect(dimensions.width, dimensions.height);
                const foreignObjectElement = stateGroup.element('foreignObject');
                const foreignObjectDisplay = new ForeignObjectDisplay_1.ForeignObjectDisplay(this.fsm, foreignObjectElement.node, node, DISPLAY_TYPE.STATE);
                const value = this.getForeignObjectViewport(foreignObjectDisplay);
                if (isString(value) && !foreignObjectDisplay.getElement().hasChildNodes()) {
                    this.getForeignObjectViewport = ForeignObjectDisplay_1.displayValue(this.getForeignObjectViewport);
                    this.getForeignObjectViewport(foreignObjectDisplay);
                }
                foreignObjectDisplay.on('setDimensions', (event) => {
                    const e = this.graph.node(node);
                    lodash_1.extend(e, { width: event.width, height: event.height });
                    this.updateLayout();
                });
                this.stateFODisplays.set(node, foreignObjectDisplay);
                this.addStateListeners(node, stateGroup);
                this.states.set(node, stateGroup);
                this.updateStateDisplay(node);
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
            const foDisplay = this.stateFODisplays.get(stateName);
            foDisplay.destroy();
            this.stateFODisplays.delete(stateName);
        });
    }
    removeViewForOldTransitions() {
        const toRemove = new Set(this.transitions.keys());
        this.graph.edges().forEach((edge) => toRemove.delete(edge.name));
        toRemove.forEach((transitionName) => {
            const transitionGroup = this.transitions.get(transitionName);
            transitionGroup.remove();
            this.transitions.delete(transitionName);
            const foDisplay = this.transitionFODisplays.get(transitionName);
            foDisplay.destroy();
            this.stateFODisplays.delete(transitionName);
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
                    transitionGroup.add(p);
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
            p.plot(`M ${from.x} ${from.y} L ${to.x} ${to.y} ${this.getArrowPath(from, to)}`);
        });
    }
    updateTransitionDisplay(transitionName) {
        const { foreground, background } = this.getTransitionColors(transitionName);
        const group = this.transitions.get(transitionName);
        this.forEachInGroup(group, 'path', (p) => p.stroke(foreground));
        this.forEachInGroup(group, 'rect', (r) => r.stroke(foreground).fill(background));
    }
    updateStateDisplay(stateName, delay = 0) {
        const { foreground, background } = this.getStateColors(stateName);
        const group = this.states.get(stateName);
        if (delay > 0) {
            setTimeout(() => this.forEachInGroup(group, 'rect', (r) => r.stroke(foreground).fill(background)), delay);
        }
        else {
            this.forEachInGroup(group, 'rect', (r) => r.stroke(foreground).fill(background));
        }
    }
    getArrowPath(sndLstPnt, lastPnt) {
        const theta = Math.atan2(sndLstPnt.y - lastPnt.y, sndLstPnt.x - lastPnt.x);
        const offset = 20 * Math.PI / 180;
        const s = 10;
        const pathString = ` m ${Math.cos(theta + offset) * s} ${Math.sin(theta + offset) * s}` +
            ` L ${lastPnt.x} ${lastPnt.y}` +
            ` l ${Math.cos(theta - offset) * s} ${Math.sin(theta - offset) * s}`;
        return pathString;
    }
    updateLayout() {
        dagre.layout(this.graph);
        const { width, height } = this.graph.graph();
        this.svg.width(width);
        this.svg.height(height);
        this.graph.nodes().forEach((v) => {
            const group = this.states.get(v);
            const { x, y, width, height } = this.graph.node(v);
            this.forEachInGroup(group, 'rect', (r) => {
                r.size(width, height);
                if (this.options.animationDuration > 0) {
                    r.animate(this.options.animationDuration).center(x, y);
                }
                else {
                    r.center(x, y);
                }
            });
            this.forEachInGroup(group, 'foreignObject', (f) => {
                if (this.options.animationDuration > 0) {
                    f.animate(this.options.animationDuration).x(x - width / 2).y(y - height / 2);
                    f.animate(this.options.animationDuration).size(width, height);
                }
                else {
                    f.x(x - width / 2).y(y - height / 2);
                    f.size(width, height);
                }
            });
        });
        this.graph.edges().forEach((e) => {
            const group = this.transitions.get(e.name);
            const { points, x, y, width, height } = this.graph.edge(e);
            this.forEachInGroup(group, 'path', (p) => {
                const pointStrings = points.map(pnt => `${pnt.x} ${pnt.y}`);
                let pathString = `M ${pointStrings[0]}`;
                for (let i = 1; i < pointStrings.length - 1; i += 2) {
                    pathString += ` Q ${pointStrings[i]} ${pointStrings[i + 1]}`;
                }
                const sndLstPnt = points[points.length - 2];
                const lastPnt = points[points.length - 1];
                pathString += this.getArrowPath(sndLstPnt, lastPnt);
                if (this.options.animationDuration > 0) {
                    p.animate(this.options.animationDuration).plot(pathString);
                }
                else {
                    p.plot(pathString);
                }
            });
            this.forEachInGroup(group, 'rect', (r) => {
                r.width(width).height(height);
                if (this.options.animationDuration > 0) {
                    r.animate(this.options.animationDuration).center(x, y);
                }
                else {
                    r.center(x, y);
                }
                r.front();
            });
            this.forEachInGroup(group, 'foreignObject', (f) => {
                if (this.options.animationDuration > 0) {
                    f.animate(this.options.animationDuration).x(x - width / 2).y(y - height / 2);
                    f.animate(this.options.animationDuration).size(width, height);
                }
                else {
                    f.x(x - width / 2).y(y - height / 2);
                    f.size(width, height);
                }
                f.front();
            });
        });
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
    transitionAnimationDuration: 300,
    animationDuration: 140
};
exports.StateMachineDisplay = StateMachineDisplay;
function isString(obj) { return typeof obj === 'string' || obj instanceof String; }
//# sourceMappingURL=StateMachineDisplay.js.map