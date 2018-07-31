import * as SVG from 'svg.js';
import 'svg.pathmorphing.js';
import * as dagre from 'dagre';
import { FSM, DagreBinding } from '../index';
import { clone, tail, extend } from 'lodash';

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
    RMT_WAITING
}

export class StateMachineDisplay {
    private header: HTMLDivElement;
    private svgContainer: HTMLDivElement;
    private svg: SVG.Doc;
    private dagreBinding: DagreBinding;
    private graph: dagre.graphlib.Graph;
    private states: Map<string, SVG.G> = new Map();
    private transitions: Map<string, SVG.G> = new Map();
    private fsmState: FSM_STATE = FSM_STATE.IDLE;
    private creatingTransitionFromState: string;
    private creatingTransitionToState: string;
    private creatingTransitionLine: SVG.G = null;
    private addStateButton: HTMLButtonElement = document.createElement('button');
    private addTransitionButton: HTMLButtonElement = document.createElement('button');
    private removeStateButton: HTMLButtonElement = document.createElement('button');
    private removeTransitionButton: HTMLButtonElement = document.createElement('button');
    private resetLayoutButton: HTMLButtonElement = document.createElement('button');
    private animationDuration: number = 140;
    private startStateDimensions: Dimensions = { width: 50, height: 30 };
    private stateDimensions: Dimensions = { width: 80, height: 40 };
    private transitionLabelDimensions: Dimensions = {width: 120, height: 20};
    private colors: {[key: string]: string} = {
        selectColor: '#002366',
        selectBackgroundColor: '#AAFFFF',
        startStateBackgroundColor: '#888',
        stateBackgroundColor: '#AAA',
        stateTextColor: '#444',
        transitionLineColor: '#777',
        transitionBackgroundColor: '#EEE',
        creatingTransitionColor: '#F00'
    };

    public constructor(private fsm:FSM<any, any>, private element:HTMLElement) {
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
    };

    public addTransition(fromLabel: string, toLabel: string, payload?: any): string {
        const name = this.fsm.addTransition(fromLabel, toLabel, null, payload);
        this.addViewForNewTransitions();
        this.updateLayout();
        return name;
    }

    private resetLayout() {
        console.log('reset layout');
    };

    private addViewForNewTransitions(): void {
        this.graph.edges().forEach((edge) => {
            const {v, w, name} = edge;
            if(!this.transitions.has(name)) {
                const transitionGroup = this.svg.group();

                if (this.creatingTransitionLine) {
                    this.creatingTransitionLine.select('path').each(($: number, members: SVG.Element[]) => {
                        members.forEach((p: SVG.Path) => {
                            this.creatingTransitionLine.removeElement(p);
                            transitionGroup.add(p);
                            p.stroke({ color: this.colors.transitionLineColor });
                        });
                    });
                } else {
                    transitionGroup.path('').stroke({ color: this.colors.transitionLineColor, width: 2 }).fill('none').addClass('nopointer');
                }

                transitionGroup.rect(this.transitionLabelDimensions.width, this.transitionLabelDimensions.height).fill(this.colors.transitionBackgroundColor).stroke(this.colors.transitionLineColor);
                transitionGroup.text(name).fill(this.colors.transitionLineColor);
                transitionGroup.element('foreignobject');

                this.addTransitionListeners(name, transitionGroup);

                this.transitions.set(name, transitionGroup);
            }
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
        stateGroup.click(this.clickGroup.bind(this, node));
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
                stateGroup.rect(dimensions.width, dimensions.height).fill( isStart ? this.colors.startStateBackgroundColor : this.colors.stateBackgroundColor).stroke(this.colors.stateTextColor);
                stateGroup.text(node).fill(this.colors.stateTextColor);
                stateGroup.element('foreignobject');

                this.addStateListeners(node, stateGroup);
                this.states.set(node, stateGroup);
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
        });
    }

    private removeViewForOldTransitions(): void {
        const toRemove = new Set<string>(this.transitions.keys());

        this.graph.edges().forEach((edge) => toRemove.delete(edge.name));
        toRemove.forEach((transitionName) => {
            const transitionGroup = this.transitions.get(transitionName);
            transitionGroup.remove();
            this.transitions.delete(transitionName);
        });
    }

    private destroyTransitionCreationIntermediateData(): void {
        this.creatingTransitionToState = this.creatingTransitionFromState = null;
        this.fsmState = FSM_STATE.IDLE;
        if (this.creatingTransitionLine) {
            this.creatingTransitionLine.remove();
            this.creatingTransitionLine = null;
        }
    }

    private updateCreatingTransitionLine(x: number, y: number): void {
        const node = this.graph.node(this.creatingTransitionFromState);
        this.forEachInGroup(this.creatingTransitionLine, 'path', (p: SVG.Path) => {
            p.plot(`M ${node.x} ${node.y} L ${x} ${y} ${this.getArrowPath(node, {x, y})}`);
        });
    }

    private mousemoveWindow = (event: MouseEvent): void => {
        if (this.creatingTransitionLine !== null) {
            const {clientX, clientY} = event;
            const {x, y} = this.svg.node.getBoundingClientRect() as DOMRect;

            this.updateCreatingTransitionLine(clientX - x, clientY - y);
        }
    }
    private clickGroup = (stateName: string, event: MouseEvent): void => {
        if(this.fsmState === FSM_STATE.RMS_WAITING) {
            console.log('remove state', stateName);
        }
    };

    private mouseoverTransitionGroup = (transitionName: string, event: MouseEvent): void => {
        const group = this.transitions.get(transitionName);

        this.forEachInGroup(group, 'path', (p: SVG.Path) => p.stroke(this.colors.selectColor));
        this.forEachInGroup(group, 'rect', (r: SVG.Rect) => r.stroke(this.colors.selectColor).fill(this.colors.selectBackgroundColor));
        this.forEachInGroup(group, 'text', (t: SVG.Text) => t.fill(this.colors.selectColor));
    };

    private mouseoutTransitionGroup = (transitionName: string, event: MouseEvent): void => {
        const group = this.transitions.get(transitionName);

        this.forEachInGroup(group, 'path', (p: SVG.Path) => p.stroke(this.colors.transitionLineColor));
        this.forEachInGroup(group, 'rect', (r: SVG.Rect) => r.stroke(this.colors.transitionLineColor).fill(this.colors.transitionBackgroundColor));
        this.forEachInGroup(group, 'text', (t: SVG.Text) => t.fill(this.colors.transitionLineColor));
    };

    private mouseupTransitionGroup = (transitionName: string, event: MouseEvent): void => {
    };

    private mousedownTransitionGroup = (transitionName: string, event: MouseEvent): void => {
        if(this.fsmState === FSM_STATE.RMT_WAITING) {
            this.fsm.removeTransition(transitionName);
            this.removeViewForOldTransitions();
            this.fsmState = FSM_STATE.IDLE;
            this.updateLayout();
        }
    };

    private mousedownStateGroup = (stateName: string, event: MouseEvent): void => {
        if (this.fsmState === FSM_STATE.IDLE && event.which === 3) {
            this.fsmState = FSM_STATE.CT_PRESSED_FROM;
            this.creatingTransitionFromState = stateName;
            this.creatingTransitionLine = this.svg.group();
            this.creatingTransitionLine.path('').stroke({ color: this.colors.creatingTransitionColor, width: 2 }).fill('none').addClass('nopointer');
            event.preventDefault();
            event.stopPropagation();
            this.mousemoveWindow(event);
        } else if(this.fsmState === FSM_STATE.AT_AWAITING_FROM) {
            this.fsmState = FSM_STATE.AT_AWAITING_TO;
            this.creatingTransitionFromState = stateName;
            this.creatingTransitionLine = this.svg.group();
            this.creatingTransitionLine.path('').stroke({ color: this.colors.creatingTransitionColor, width: 2 }).fill('none').addClass('nopointer');
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

        this.forEachInGroup(group, 'rect', (r: SVG.Rect) => r.stroke(this.colors.stateTextColor).fill(this.colors.stateBackgroundColor));
        this.forEachInGroup(group, 'text', (t: SVG.Text) => t.fill(this.colors.stateTextColor));
        if (this.fsmState === FSM_STATE.CT_PRESSED_FROM &&
                stateName === this.creatingTransitionFromState) {
            this.fsmState = FSM_STATE.CT_LEFT_FROM;
        } else if (this.fsmState === FSM_STATE.CT_OVER_TO) {
            this.fsmState = FSM_STATE.CT_LEFT_FROM;
            this.creatingTransitionToState = null;
        }
        event.preventDefault();
    }
    private mouseoverStateGroup = (stateName: string, event: MouseEvent): void => {
        const group = this.states.get(stateName);

        this.forEachInGroup(group, 'rect', (r: SVG.Rect) => r.stroke(this.colors.selectColor).fill(this.colors.selectBackgroundColor));
        this.forEachInGroup(group, 'text', (t: SVG.Text) => t.fill(this.colors.selectColor));
        if (this.fsmState === FSM_STATE.CT_LEFT_FROM) {
            this.fsmState = FSM_STATE.CT_OVER_TO;
            this.creatingTransitionToState = stateName;
        }
        event.preventDefault();
    }

    private keydownWindow = (event: KeyboardEvent): void => {
        if(event.which === 27 && this.fsmState !== FSM_STATE.IDLE) {
            this.destroyTransitionCreationIntermediateData();
        }
    };

    private mouseupWindow = (event: MouseEvent): void => {
        event.preventDefault();
        if(this.fsmState === FSM_STATE.AT_AWAITING_TO || this.fsmState === FSM_STATE.CT_LEFT_FROM) {
            this.destroyTransitionCreationIntermediateData();
        }
    }

    private mouseupStateGroup = (stateName: string, event: MouseEvent): void => {
        if (this.fsmState === FSM_STATE.CT_OVER_TO &&
                stateName === this.creatingTransitionToState && event.which === 3) {
            this.fsmState = FSM_STATE.IDLE;

            this.addTransition(this.creatingTransitionFromState, this.creatingTransitionToState, {});
            this.destroyTransitionCreationIntermediateData();
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
            const node = this.graph.node(v);

            this.forEachInGroup(group, 'rect', (r: SVG.Rect) => {
                r.width(node.width);
                r.height(node.height);
                r.animate(this.animationDuration).center(node.x, node.y);
            });
            this.forEachInGroup(group, 'text', (t: SVG.Text) => {
                t.animate(this.animationDuration).center(node.x, node.y);
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
            });
            this.forEachInGroup(group, 'text', (t: SVG.Text) => {
                t.animate(this.animationDuration).center(x, y);
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