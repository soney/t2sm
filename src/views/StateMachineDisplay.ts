import * as SVG from 'svg.js';
import 'svg.pathmorphing.js';
import * as dagre from 'dagre';
import { FSM, DagreBinding } from '..';
import { clone, tail, extend } from 'lodash';
import { ForeignObjectDisplay, SetDimensionsEvent, displayName, displayValue } from './ForeignObjectDisplay';
import { TransitionFiredEvent, ActiveStateChangedEvent, StatePayloadChangedEvent, TransitionPayloadChangedEvent } from '../state_machine/FSM';

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

export class StateMachineDisplay {
    private header: HTMLDivElement;
    private svgContainer: HTMLDivElement;
    private svg: SVG.Doc;
    private dagreBinding: DagreBinding;
    private graph: dagre.graphlib.Graph;
    private states: Map<string, SVG.G> = new Map();
    private transitions: Map<string, SVG.G> = new Map();
    private stateFODisplays: Map<string, ForeignObjectDisplay> = new Map();
    private transitionFODisplays: Map<string, ForeignObjectDisplay> = new Map();
    private fsmState: FSM_STATE = FSM_STATE.IDLE;
    private creatingTransitionFromState: string;
    private creatingTransitionToState: string;
    private creatingTransitionLine: SVG.G = null;
    private modifyingTransition: string;
    private hoveringState: string;
    private hoveringTransition: string;
    private addStateButton: HTMLButtonElement = document.createElement('button');
    private addTransitionButton: HTMLButtonElement = document.createElement('button');
    private removeStateButton: HTMLButtonElement = document.createElement('button');
    private removeTransitionButton: HTMLButtonElement = document.createElement('button');
    private resetLayoutButton: HTMLButtonElement = document.createElement('button');
    private animationDuration: number = 140;
    private startStateDimensions: Dimensions = { width: 60, height: 30 };
    private stateDimensions: Dimensions = { width: 80, height: 40 };
    private transitionLabelDimensions: Dimensions = {width: 120, height: 30};
    private colors: {[key: string]: string} = {
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
    private transitionThickness: number = 3;
    private transitionAnimationDuration: number = 300;

    public constructor(private fsm:FSM<any, any>, private element:HTMLElement, private getForeignObjectViewport: (el: ForeignObjectDisplay) => string | void = displayName) {
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
        this.fsm.on('transitionFiredEvent', (event: TransitionFiredEvent) => {
            if(event.eligible) {
                this.onTransitionFired(event.transition, event.event);
            } else {
                this.onIneligibleTransitionFired(event.transition, event.event);
            }
        });
        this.fsm.on('activeStateChanged', (event: ActiveStateChangedEvent) => {
            this.updateStateDisplay(event.oldActiveState, this.transitionAnimationDuration/3);
            this.updateStateDisplay(event.state, 2*this.transitionAnimationDuration/3);
        });
        this.fsm.on('statePayloadChanged', (event: StatePayloadChangedEvent) => {
            const fod = this.stateFODisplays.get(event.state);
            fod.setPayload(event.payload);
        });
        this.fsm.on('transitionPayloadChanged', (event: TransitionPayloadChangedEvent) => {
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
                const transitionGroup = this.svg.group();

                if (this.creatingTransitionLine) {
                    this.forEachInGroup(this.creatingTransitionLine, 'path', (p: SVG.Path) => {
                        this.creatingTransitionLine.removeElement(p);
                        transitionGroup.add(p);
                        p.stroke({ color: this.colors.transitionLineColor }).removeClass('nopointer');
                    });
                } else {
                    transitionGroup.path('').stroke({ color: this.colors.transitionLineColor, width: this.transitionThickness }).fill('none').removeClass('nopointer');
                }

                transitionGroup.rect(this.transitionLabelDimensions.width, this.transitionLabelDimensions.height).fill(this.colors.transitionBackgroundColor).stroke(this.colors.transitionLineColor);
                const foreignObjectElement = transitionGroup.element('foreignObject');
                const foreignObjectDisplay = new ForeignObjectDisplay(this.fsm, foreignObjectElement.node as any, name, DISPLAY_TYPE.TRANSITION);
                const value = this.getForeignObjectViewport(foreignObjectDisplay);
                if (isString(value) && !foreignObjectDisplay.getElement().hasChildNodes()) {
                    this.getForeignObjectViewport = displayValue(this.getForeignObjectViewport as any);
                    this.getForeignObjectViewport(foreignObjectDisplay);
                }
                foreignObjectDisplay.on('setDimensions', (event: SetDimensionsEvent) => {
                    const e = this.graph.edge(edge);
                    extend(e, {width: event.width, height: event.height});
                    this.updateLayout();
                });
                this.transitionFODisplays.set(name, foreignObjectDisplay);

                this.addTransitionListeners(name, transitionGroup);

                this.transitions.set(name, transitionGroup);
            }
        });
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
        const foDisplay = this.transitionFODisplays.get(transition);
        foDisplay.transitionFired(event);
        this.animateTransition(transition);
    }

    private onIneligibleTransitionFired(transition: string, event: any): void {
        this.forEachInGroup(this.transitions.get(transition), 'rect', (r: SVG.Rect) => {
            const cx = r.cx();
            const cy = r.cy();
            const width = r.width();
            const height = r.height();
            r.animate(25).size(width + 10, height + 10).center(cx, cy);
            r.animate(75).size(width, height).center(cx, cy);
        });
        setTimeout(() => this.updateLayout(), 110);
    }

    public animateTransition(transition: string) {
        const overallDuration = this.transitionAnimationDuration;
        const segments = 10;
        this.forEachInGroup(this.transitions.get(transition), 'path', (p: SVG.Path) => {
            const len = p.length();
            let point: {x: number, y: number} = p.pointAt(0);
            const dot = this.svg.path(`M ${point.x} ${point.y} l 0 0`).stroke({color: this.colors.activeColor, width: this.transitionThickness*2});

            for(let i = 0; i<segments; i++) {
                const startIndex = i * (len/segments);
                const endIndex = (i+1) * (len/segments);
                const startPoint = p.pointAt(startIndex);
                const endPoint = p.pointAt(endIndex);
                setTimeout(() => {
                    (dot.animate(overallDuration/segments) as MorphableAnimation).plot(`M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`);
                }, i*overallDuration/segments);
            }
            setTimeout(() => {
                dot.remove();
            }, overallDuration);
        });
        this.forEachInGroup(this.transitions.get(transition), 'rect', (r: SVG.Rect) => {
            setTimeout(() => { r.stroke({ color: this.colors.activeColor }).fill(this.colors.activeBackgroundColor); }, overallDuration/3)
            setTimeout(() => { this.updateTransitionDisplay(transition); }, 2*overallDuration/3);
            r.front();
        });
        this.forEachInGroup(this.transitions.get(transition), 'foreignObject', (f: SVG.Element) => {
            f.front();
        });
    }

    public addState(payload?: any): string {
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

    private addStateListeners(node: string, stateGroup: SVG.G): void {
        stateGroup.each((i: number, children: SVG.Element[]) => {
            children.forEach((child: SVG.Element) => {
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

    private addTransitionListeners(edge: string, transitionGroup: SVG.G) {
        transitionGroup.mousedown(this.mousedownTransitionGroup.bind(this, edge));
        transitionGroup.mouseout(this.mouseoutTransitionGroup.bind(this, edge));
        transitionGroup.mouseover(this.mouseoverTransitionGroup.bind(this, edge));
        transitionGroup.mouseup(this.mouseupTransitionGroup.bind(this, edge));
    }

    private addViewForNewNodes(): void {
        this.graph.nodes().forEach((node: string) => {
            if(!this.states.has(node)) {
                const stateGroup = this.svg.group();
                const isStart = node === this.fsm.getStartState();
                const dimensions = isStart ? this.startStateDimensions : this.stateDimensions;
                stateGroup.rect(dimensions.width, dimensions.height);

                const foreignObjectElement = stateGroup.element('foreignObject');
                const foreignObjectDisplay = new ForeignObjectDisplay(this.fsm, foreignObjectElement.node as any, node, DISPLAY_TYPE.STATE);
                const value = this.getForeignObjectViewport(foreignObjectDisplay);
                if (isString(value) && !foreignObjectDisplay.getElement().hasChildNodes()) {
                    this.getForeignObjectViewport = displayValue(this.getForeignObjectViewport as any);
                    this.getForeignObjectViewport(foreignObjectDisplay);
                }
                foreignObjectDisplay.on('setDimensions', (event: SetDimensionsEvent) => {
                    const e = this.graph.node(node);
                    extend(e, {width: event.width, height: event.height});
                    this.updateLayout();
                });
                this.stateFODisplays.set(node, foreignObjectDisplay);

                this.addStateListeners(node, stateGroup);
                this.states.set(node, stateGroup);
                this.updateStateDisplay(node);
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
            const foDisplay = this.stateFODisplays.get(stateName);
            foDisplay.destroy();
            this.stateFODisplays.delete(stateName);
        });
    }

    private removeViewForOldTransitions(): void {
        const toRemove = new Set<string>(this.transitions.keys());

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

    private destroyTransitionCreationIntermediateData(): void {
        this.creatingTransitionToState = this.creatingTransitionFromState = null;
        this.fsmState = FSM_STATE.IDLE;
        if (this.creatingTransitionLine) {
            if(this.modifyingTransition) {
                const transitionGroup = this.transitions.get(this.modifyingTransition);
                this.forEachInGroup(this.creatingTransitionLine, 'path', (p: SVG.Path) => {
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

    private updateCreatingTransitionLine(x: number, y: number): void {
        const reverse = this.fsmState === FSM_STATE.TRANSITION_CHANGE_FROM;
        const node = this.graph.node(reverse ? this.creatingTransitionToState : this.creatingTransitionFromState);
        this.forEachInGroup(this.creatingTransitionLine, 'path', (p: SVG.Path) => {
            const from = reverse ? {x, y} : node;
            const to = reverse ? node : {x, y};
            p.plot(`M ${from.x} ${from.y} L ${to.x} ${to.y} ${this.getArrowPath(from, to)}`);
        });
    }

    private mousemoveWindow = (event: MouseEvent): void => {
        if (this.creatingTransitionLine !== null) {
            const {clientX, clientY} = event;
            const {x, y} = this.svg.node.getBoundingClientRect() as DOMRect;

            this.updateCreatingTransitionLine(clientX - x, clientY - y);
        }
    }

    private mouseoverTransitionGroup = (transitionName: string, event: MouseEvent): void => {
        const group = this.transitions.get(transitionName);
        if(this.hoveringTransition) {
            this.updateTransitionDisplay(this.hoveringTransition);
        }
        this.hoveringTransition = transitionName;
        this.updateTransitionDisplay(transitionName);

        const foDisplay = this.transitionFODisplays.get(transitionName);
        foDisplay.mouseEntered();
    };

    private mouseoutTransitionGroup = (transitionName: string, event: MouseEvent): void => {
        if(this.hoveringTransition === transitionName) {
            this.hoveringTransition = null;
            this.updateTransitionDisplay(transitionName);
        }

        const foDisplay = this.transitionFODisplays.get(transitionName);
        foDisplay.mouseLeft();
    };

    private mouseupTransitionGroup = (transitionName: string, event: MouseEvent): void => {
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

            const group = this.transitions.get(transitionName);

            if(draggingFrom || draggingTo) {
                if(draggingFrom) {
                    this.creatingTransitionToState = w;
                    this.fsmState = FSM_STATE.TRANSITION_CHANGE_FROM;
                } else {
                    this.creatingTransitionFromState = v;
                    this.fsmState = FSM_STATE.TRANSITION_CHANGE_TO;
                }

                this.creatingTransitionLine = this.svg.group();
                this.forEachInGroup(group, 'path', (p: SVG.Path) => {
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

    private mousedownStateGroup = (stateName: string, event: MouseEvent): void => {
        if (this.fsmState === FSM_STATE.IDLE && event.which === 3) {
            this.fsmState = FSM_STATE.CT_PRESSED_FROM;
            this.creatingTransitionFromState = stateName;
            this.creatingTransitionLine = this.svg.group();
            this.creatingTransitionLine.path('').stroke({ color: this.colors.creatingTransitionColor, width: this.transitionThickness }).fill('none').addClass('nopointer');
            event.preventDefault();
            event.stopPropagation();
            this.mousemoveWindow(event);
        } else if(this.fsmState === FSM_STATE.AT_AWAITING_FROM) {
            this.fsmState = FSM_STATE.AT_AWAITING_TO;
            this.creatingTransitionFromState = stateName;
            this.creatingTransitionLine = this.svg.group();
            this.creatingTransitionLine.path('').stroke({ color: this.colors.creatingTransitionColor, width: this.transitionThickness }).fill('none').addClass('nopointer');
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
    private updateTransitionDisplay(transitionName: string): void {
        const {foreground, background} = this.getTransitionColors(transitionName);
        const group = this.transitions.get(transitionName);

        this.forEachInGroup(group, 'path', (p: SVG.Path) => p.stroke(foreground));
        this.forEachInGroup(group, 'rect', (r: SVG.Rect) => r.stroke(foreground).fill(background));
    }
    
    private updateStateDisplay(stateName: string, delay: number = 0): void {
        const {foreground, background} = this.getStateColors(stateName);
        const group = this.states.get(stateName);


        setTimeout(() => this.forEachInGroup(group, 'rect', (r: SVG.Rect) => r.stroke(foreground).fill(background)), delay);
    }

    private mouseoutStateGroup = (stateName: string, event: MouseEvent): void => {
        const group = this.states.get(stateName);

        if(this.hoveringState === stateName) {
            this.hoveringState = null;
            this.updateStateDisplay(stateName);
        }
        if (this.fsmState === FSM_STATE.CT_PRESSED_FROM &&
                stateName === this.creatingTransitionFromState) {
            this.fsmState = FSM_STATE.CT_LEFT_FROM;
        } else if (this.fsmState === FSM_STATE.CT_OVER_TO) {
            this.fsmState = FSM_STATE.CT_LEFT_FROM;
            this.creatingTransitionToState = null;
        }
        const foDisplay = this.stateFODisplays.get(stateName);
        foDisplay.mouseLeft();
        event.preventDefault();
    }
    private mouseoverStateGroup = (stateName: string, event: MouseEvent): void => {
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

    private getArrowPath(sndLstPnt: {x: number, y: number}, lastPnt: {x: number, y: number}): string {
        const theta = Math.atan2(sndLstPnt.y - lastPnt.y, sndLstPnt.x - lastPnt.x);
        const offset = 20 * Math.PI / 180;
        const s = 10;
        const pathString = ` m ${Math.cos(theta + offset) * s} ${Math.sin(theta + offset) * s}` +
                           ` L ${lastPnt.x} ${lastPnt.y}` +
                           ` l ${Math.cos(theta - offset) * s} ${Math.sin(theta - offset) * s}`;
        return pathString;
    }

    private updateLayout(): void {
        dagre.layout(this.graph);
        const {width, height} = this.graph.graph();
        this.svg.width(width);
        this.svg.height(height);
        this.graph.nodes().forEach((v) => {
            const group = this.states.get(v);
            const {x, y, width, height } = this.graph.node(v);

            this.forEachInGroup(group, 'rect', (r: SVG.Rect) => {
                r.size(width, height);
                r.animate(this.animationDuration).center(x, y);
            });
            this.forEachInGroup(group, 'foreignObject', (f: SVG.Element) => {
                f.animate(this.animationDuration).x(x-width/2).y(y-height/2);
                f.animate(this.animationDuration).size(width, height);
            });
        });
        this.graph.edges().forEach((e) => {
            const group = this.transitions.get(e.name);

            const { points, x, y, width, height } = this.graph.edge(e);
            this.forEachInGroup(group, 'path', (p: SVG.Path) => {
                const pointStrings = points.map(pnt => `${pnt.x} ${pnt.y}`);
                let pathString = `M ${pointStrings[0]}`;
                for (let i: number = 1; i < pointStrings.length - 1; i += 2) {
                    pathString += ` Q ${pointStrings[i]} ${pointStrings[i + 1]}`;
                }
                const sndLstPnt = points[points.length - 2];
                const lastPnt = points[points.length - 1];

                pathString += this.getArrowPath(sndLstPnt, lastPnt);

                (p.animate(this.animationDuration) as MorphableAnimation).plot(pathString);
            });
            this.forEachInGroup(group, 'rect', (r: SVG.Rect) => {
                r.width(width).height(height);
                r.animate(this.animationDuration).center(x, y);
                r.front();
            });
            this.forEachInGroup(group, 'foreignObject', (f: SVG.Element) => {
                f.animate(this.animationDuration).x(x-width/2).y(y-height/2);
                f.animate(this.animationDuration).size(width, height);
                f.front();
            });
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
function isString(obj: any): boolean { return typeof obj === 'string' || obj instanceof String; }