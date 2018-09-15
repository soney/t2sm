import * as SVG from 'svg.js';
import 'svg.pathmorphing.js';
import * as dagre from 'dagre';
import { FSM, DagreBinding } from '..';
import { clone, tail, extend } from 'lodash';
import { ForeignObjectDisplay, SetDimensionsEvent, displayName, displayValue } from './ForeignObjectDisplay';
import { TransitionFiredEvent, ActiveStateChangedEvent, StatePayloadChangedEvent, TransitionPayloadChangedEvent } from '../state_machine/FSM';
import { EventEmitter } from 'events';
import { SVGStateDisplay, SVGStartStateDisplay } from './StateDisplay';
import { SVGTransitionDisplay } from './TransitionDisplay';
import { SVGComponentDisplay } from './ComponentDisplay';

interface MorphableAnimation extends SVG.Animation {
    plot: (key: string) => this;
}

interface Dimensions {
    width: number,
    height: number
}

enum FSM_STATE {
    IDLE, CT_PRESSED_FROM, CT_LEFT_FROM, CT_OVER_TO,
    AT_AWAITING_FROM, AT_AWAITING_TO,
    RMS_WAITING,
    RMT_WAITING,
    TRANSITION_CHANGE_FROM,
    TRANSITION_CHANGE_TO
}

export enum DISPLAY_TYPE {
    STATE, TRANSITION
}

export interface SMDOptions {
    showControls?: boolean;
    animationDuration? : number;
    transitionAnimationDuration? : number;
    transitionThickness? : number;
    padding?: number
};

export class StateMachineDisplay {
    private header: HTMLDivElement;
    private svgContainer: HTMLDivElement;
    private svg: SVG.Doc;
    private dagreBinding: DagreBinding;
    private graph: dagre.graphlib.Graph;
    private states: Map<string, SVGComponentDisplay> = new Map();
    private transitions: Map<string, SVGTransitionDisplay> = new Map();
    private fsmState: FSM_STATE = FSM_STATE.IDLE;
    private creatingTransitionFromState: string;
    private creatingTransitionToState: string;
    private creatingTransitionLine: SVG.G = null;
    private modifyingTransition: string;
    private hoveringState: string;
    private hoveringTransition: string;
    private addTransitionButton: HTMLButtonElement = document.createElement('button');
    private removeStateButton: HTMLButtonElement = document.createElement('button');
    private removeTransitionButton: HTMLButtonElement = document.createElement('button');
    private resetLayoutButton: HTMLButtonElement = document.createElement('button');
    private startStateDimensions: Dimensions = { width: 10, height: 10 };
    private stateDimensions: Dimensions = { width: 80, height: 40 };
    private transitionLabelDimensions: Dimensions = {width: 120, height: 30};
    private addStateButton: SVG.G;
    public colors: {[key: string]: string} = {
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
    private static optionDefaults: SMDOptions  = {
        showControls: true,
        transitionAnimationDuration: 300,
        animationDuration: 140,
        transitionThickness: 3,
        padding: 30
    };
    public options: SMDOptions;


    public constructor(private fsm:FSM<any, any>, private element:HTMLElement, private getForeignObjectViewport: (el: ForeignObjectDisplay) => void = displayName, options?: SMDOptions) {
        this.options = extend({}, StateMachineDisplay.optionDefaults, options);
        this.dagreBinding = new DagreBinding(fsm, (state) => {
            if(state === this.fsm.getStartState()) {
                return clone(this.startStateDimensions);
            } else {
                return clone(this.stateDimensions);
            }
        }, (transition) => {
            return extend(clone(this.transitionLabelDimensions), {
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

        this.addStateButton = this.svg.group();
        this.addStateButton.rect(this.stateDimensions.width, this.stateDimensions.height).attr({
            fill: this.colors.stateBackgroundColor
        });
        this.addStateButton.text('+').center(this.stateDimensions.width/2, this.stateDimensions.height/2);

        this.addStateButton.click(() => this.addState());

        this.addViewForNewNodes();
        this.addViewForNewTransitions();

        this.updateLayout();

        window.addEventListener('mousemove', this.mousemoveWindow);
        window.addEventListener('mouseup', this.mouseupWindow);
        window.addEventListener('keydown', this.keydownWindow);
        this.fsm.on('transitionFiredEvent', (event: TransitionFiredEvent) => {
            if(event.eligible) {
                this.onTransitionFired(event.transition, event.event);
            } else {
                this.onIneligibleTransitionFired(event.transition, event.event);
            }
        });
        this.fsm.on('activeStateChanged', (event: ActiveStateChangedEvent) => {
            if (event.oldActiveState) {
                const oldStateDisplay = this.states.get(event.oldActiveState);
                oldStateDisplay.updateColors(this.options.transitionAnimationDuration/3);
            }
            const stateDisplay = this.states.get(event.state);
            stateDisplay.updateColors(2*this.options.transitionAnimationDuration/3);
        });
        this.fsm.on('statePayloadChanged', (event: StatePayloadChangedEvent) => {
            const sd = this.states.get(event.state);
            const fod = sd.getForeignObjectDisplay();
            fod.setPayload(event.payload);
        });
        this.fsm.on('transitionPayloadChanged', (event: TransitionPayloadChangedEvent) => {
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
    };

    public addTransition(fromLabel: string, toLabel: string, payload?: any): string {
        const name = this.fsm.addTransition(fromLabel, toLabel, null, payload);
        this.addViewForNewTransitions();
        this.updateLayout();
        return name;
    }

    private resetLayout = (): void => {
        this.fsm.setActiveState(this.fsm.getStartState());
    };

    private addViewForNewTransitions(): void {
        this.graph.edges().forEach((edge) => {
            const {v, w, name} = edge;
            if(!this.transitions.has(name)) {
                const transitionDisplay = new SVGTransitionDisplay(this, edge, this.transitionLabelDimensions, this.creatingTransitionLine);
                this.transitions.set(name, transitionDisplay);

                transitionDisplay.addListener('mouseover', this.mouseoverTransitionGroup.bind(this, name));
                transitionDisplay.addListener('mouseout', this.mouseoutTransitionGroup.bind(this, name));
                transitionDisplay.addListener('mousedown', this.mousedownTransitionGroup.bind(this, name));
                transitionDisplay.addListener('delete', () => {
                    this.fsm.removeTransition(name);
                });
                transitionDisplay.addListener('fire', () => {
                    this.fsm.fireTransition(name);
                });
            }
        });
    }

    public getSVG(): SVG.Doc { return this.svg; }
    public getFSM(): FSM<any, any> { return this.fsm; }
    public getGraph(): dagre.graphlib.Graph { return this.graph; }
    public getFOVGetter(): (el: ForeignObjectDisplay) => string | void  {
        return this.getForeignObjectViewport;
    }

    public getTransitionColors(transitionName: string): {background: string, foreground: string} {
        if(this.hoveringTransition === transitionName) {
            return { background: this.colors.selectBackgroundColor, foreground: this.colors.selectColor};
        } else {
            return { background: this.colors.transitionBackgroundColor, foreground: this.colors.transitionLineColor};
        }
    }

    public getStateColors(stateName: string): {background: string, foreground: string} {
        if(this.hoveringState === stateName) {
            return { background: this.colors.selectBackgroundColor, foreground: this.colors.selectColor};
        } else if(this.fsm.getActiveState() === stateName) {
            return { background: this.colors.activeBackgroundColor, foreground: this.colors.activeColor};
        } else if(this.fsm.getStartState() === stateName) {
            return { background: this.colors.startStateBackgroundColor, foreground: this.colors.stateTextColor};
        } else {
            return { background: this.colors.stateBackgroundColor, foreground: this.colors.stateTextColor};
        }
    }

    public onTransitionFired(transition: string, event: any) {
        const transitionDisplay = this.transitions.get(transition);
        const foDisplay = transitionDisplay.getForeignObjectDisplay();
        foDisplay.transitionFired(event);
        if(this.options.transitionAnimationDuration > 0) {
            transitionDisplay.animateFiring();
        }
    }

    private onIneligibleTransitionFired(transition: string, event: any): void {
        const transitionDisplay = this.transitions.get(transition);
        transitionDisplay.animateIneligibleFiring();
    }

    public addState = (payload?: any): string => {
        const stateName = this.fsm.addState(payload);
        this.addViewForNewNodes();
        this.updateLayout();
        return stateName;
    }

    private addStateClicked = (): void => {
        this.addState();
    }

    private addTransitionClicked = (): void => {
        this.fsmState = FSM_STATE.AT_AWAITING_FROM;
    }

    private removeStateClicked = (): void => {
        this.fsmState = FSM_STATE.RMS_WAITING;
    }

    private removeTransitionClicked = (): void => {
        this.fsmState = FSM_STATE.RMT_WAITING;
    }

    private addViewForNewNodes(): void {
        this.graph.nodes().forEach((node: string) => {
            if(!this.states.has(node)) {
                if(node === this.fsm.getStartState()) {
                    const stateDisplay = new SVGStartStateDisplay(this, node, this.stateDimensions);
                    this.states.set(node, stateDisplay);
                } else {
                    const stateDisplay = new SVGStateDisplay(this, node, this.stateDimensions);
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
                sd.addListener('makeActive', () => {
                    this.fsm.setActiveState(node);
                });
            }
        });
    }

    private removeViewForOldNodes(): void {
        const toRemove = new Set<string>(this.states.keys());
        this.graph.nodes().forEach((stateName: string) => toRemove.delete(stateName));
        toRemove.forEach((stateName) => {
            const stateGroup = this.states.get(stateName);
            stateGroup.remove();
            this.states.delete(stateName);
            const foDisplay = stateGroup.getForeignObjectDisplay();
            foDisplay.destroy();
        });
    }

    private removeViewForOldTransitions(): void {
        const toRemove = new Set<string>(this.transitions.keys());

        this.graph.edges().forEach((edge) => toRemove.delete(edge.name));
        toRemove.forEach((transitionName) => {
            const transitionGroup = this.transitions.get(transitionName);
            transitionGroup.remove();
            this.transitions.delete(transitionName);

            const foDisplay = transitionGroup.getForeignObjectDisplay();
            foDisplay.destroy();
        });
    }

    private mouseoverTransitionGroup = (transitionName: string, event: MouseEvent): void => {
        if(this.hoveringTransition) {
            const hoveringTransitionDisplay = this.transitions.get(this.hoveringTransition);
            hoveringTransitionDisplay.updateColors();
        }
        this.hoveringTransition = transitionName;
        const group = this.transitions.get(transitionName);
        group.updateColors();

        const foDisplay = group.getForeignObjectDisplay();
        foDisplay.mouseEntered();
    };

    private mouseoutTransitionGroup = (transitionName: string, event: MouseEvent): void => {
        const group = this.transitions.get(transitionName);
        if(this.hoveringTransition === transitionName) {
            this.hoveringTransition = null;
            group.updateColors();
        }

        const foDisplay = group.getForeignObjectDisplay();
        foDisplay.mouseLeft();
    };

    private mousedownTransitionGroup = (transitionName: string, event: MouseEvent): void => {
        if(this.fsmState === FSM_STATE.RMT_WAITING) {
            this.fsm.removeTransition(transitionName);
            this.removeViewForOldTransitions();
            this.fsmState = FSM_STATE.IDLE;
            this.updateLayout();
        } else if(event.which === 1) {
            const v = this.fsm.getTransitionFrom(transitionName);
            const w = this.fsm.getTransitionTo(transitionName);
            const { points } = this.graph.edge({v, w, name: transitionName});
            const firstPoint = points[0];
            const lastPoint = points[points.length-1];
            const x = event.offsetX;
            const y = event.offsetY;
            const distanceOriginSq = Math.pow(x - firstPoint.x, 2) + Math.pow(y - firstPoint.y, 2);
            const distanceTailSq = Math.pow(x - lastPoint.x, 2) + Math.pow(y - lastPoint.y, 2);
            const draggingFrom: boolean = distanceOriginSq < distanceTailSq && distanceOriginSq < 300;
            const draggingTo: boolean = distanceOriginSq > distanceTailSq && distanceTailSq < 300;

            const transitionDisplay = this.transitions.get(transitionName);

            if(draggingFrom || draggingTo) {
                if(draggingFrom) {
                    this.creatingTransitionToState = w;
                    this.fsmState = FSM_STATE.TRANSITION_CHANGE_FROM;
                } else {
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


    private destroyTransitionCreationIntermediateData(): void {
        this.creatingTransitionToState = this.creatingTransitionFromState = null;
        this.fsmState = FSM_STATE.IDLE;
        if (this.creatingTransitionLine) {
            if(this.modifyingTransition) {
                const transitionGroup = this.transitions.get(this.modifyingTransition);
                this.forEachInGroup(this.creatingTransitionLine, 'path', (p: SVG.Path) => {
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

    private updateCreatingTransitionLine(x: number, y: number): void {
        const reverse = this.fsmState === FSM_STATE.TRANSITION_CHANGE_FROM;
        const node = this.graph.node(reverse ? this.creatingTransitionToState : this.creatingTransitionFromState);
        this.forEachInGroup(this.creatingTransitionLine, 'path', (p: SVG.Path) => {
            const from = reverse ? {x, y} : node;
            const to = reverse ? node : {x, y};
            p.plot(`M ${from.x} ${from.y} L ${to.x} ${to.y} ${SVGTransitionDisplay.getArrowPath(from, to)}`);
        });
    }

    private mousemoveWindow = (event: MouseEvent): void => {
        if (this.creatingTransitionLine !== null) {
            const {clientX, clientY} = event;
            const {x, y} = this.svg.node.getBoundingClientRect() as DOMRect;

            this.updateCreatingTransitionLine(clientX - x, clientY - y);
        }
    }

    private mousedownStateGroup = (stateName: string, event: MouseEvent): void => {
        if (this.fsmState === FSM_STATE.IDLE && event.which === 3) {
            this.fsmState = FSM_STATE.CT_PRESSED_FROM;
            this.creatingTransitionFromState = stateName;
            this.creatingTransitionLine = this.svg.group();
            this.creatingTransitionLine.path('').stroke({ color: this.colors.creatingTransitionColor, width: this.options.transitionThickness }).fill('none').addClass('nopointer');
            event.preventDefault();
            event.stopPropagation();
            this.mousemoveWindow(event);
        } else if(this.fsmState === FSM_STATE.AT_AWAITING_FROM) {
            this.fsmState = FSM_STATE.AT_AWAITING_TO;
            this.creatingTransitionFromState = stateName;
            this.creatingTransitionLine = this.svg.group();
            this.creatingTransitionLine.path('').stroke({ color: this.colors.creatingTransitionColor, width: this.options.transitionThickness }).fill('none').addClass('nopointer');
        } else if(this.fsmState === FSM_STATE.AT_AWAITING_TO) {
            this.creatingTransitionToState = stateName;
            this.addTransition(this.creatingTransitionFromState, this.creatingTransitionToState, {});
            this.destroyTransitionCreationIntermediateData();
            this.fsmState = FSM_STATE.IDLE;
        } else if(this.fsmState === FSM_STATE.RMS_WAITING) {
            this.fsm.removeState(stateName);
            this.removeViewForOldNodes();
            this.removeViewForOldTransitions();
            this.updateLayout();
            this.fsmState = FSM_STATE.IDLE;
        } else {
            this.destroyTransitionCreationIntermediateData();
        }
    }

    private mouseoutStateGroup = (stateName: string, event: MouseEvent): void => {
        const group = this.states.get(stateName);

        if(this.hoveringState === stateName) {
            this.hoveringState = null;
            group.updateColors();
        }
        if (this.fsmState === FSM_STATE.CT_PRESSED_FROM &&
                stateName === this.creatingTransitionFromState) {
            this.fsmState = FSM_STATE.CT_LEFT_FROM;
        } else if (this.fsmState === FSM_STATE.CT_OVER_TO) {
            this.fsmState = FSM_STATE.CT_LEFT_FROM;
            this.creatingTransitionToState = null;
        }
        const foDisplay = group.getForeignObjectDisplay();
        foDisplay.mouseLeft();
        event.preventDefault();
    }
    private mouseoverStateGroup = (stateName: string, event: MouseEvent): void => {
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
    }

    private keydownWindow = (event: KeyboardEvent): void => {
        if(event.which === 27 && this.fsmState !== FSM_STATE.IDLE) {
            this.destroyTransitionCreationIntermediateData();
            this.updateLayout();
        }
    };

    private mouseupWindow = (event: MouseEvent): void => {
        event.preventDefault();
        if(this.fsmState === FSM_STATE.AT_AWAITING_TO || this.fsmState === FSM_STATE.CT_LEFT_FROM || this.fsmState === FSM_STATE.TRANSITION_CHANGE_FROM || this.fsmState === FSM_STATE.TRANSITION_CHANGE_TO) {
            this.destroyTransitionCreationIntermediateData();
            this.updateLayout();
        }
    }

    private mouseupStateGroup = (stateName: string, event: MouseEvent): void => {
        if (this.fsmState === FSM_STATE.CT_OVER_TO &&
                stateName === this.creatingTransitionToState && event.which === 3) {
            this.fsmState = FSM_STATE.IDLE;

            try {
                this.addTransition(this.creatingTransitionFromState, this.creatingTransitionToState, {});
            } catch(err) {
                console.error(err);
            }
            this.destroyTransitionCreationIntermediateData();
        } else if(this.fsmState === FSM_STATE.TRANSITION_CHANGE_FROM) {
            try {
                this.fsm.setTransitionFrom(this.modifyingTransition, stateName);
            } catch(err) {
                console.error(err);
            }

            this.destroyTransitionCreationIntermediateData();
            this.updateLayout();
        } else if(this.fsmState === FSM_STATE.TRANSITION_CHANGE_TO) {
            try {
                this.fsm.setTransitionTo(this.modifyingTransition, stateName);
            } catch(err) {
                console.error(err);
            }
            this.destroyTransitionCreationIntermediateData();
            this.updateLayout();
        }
        event.preventDefault();
        event.stopPropagation();
    }


    private updateLayout(): void {
        dagre.layout(this.graph);
        const {width, height} = this.graph.graph();
        this.svg.width(width);
        this.svg.height(height);
        this.states.forEach((stateGroup) => {
            stateGroup.updateLayout();
        });
        this.transitions.forEach((transitionGroup) => {
            transitionGroup.updateLayout();
        });
    }
    private forEachInGroup(group: SVG.G, selector: string, fn: (el: SVG.Element) => void): void {
        group.select(selector).each((i: number, members: SVG.Element[]) => {
            members.forEach((el: SVG.Element) => {
                fn(el);
            });
        });
    }
} 


if(typeof window != 'undefined' && window.document) {
    window['t2sm'].StateMachineDisplay = StateMachineDisplay;
}