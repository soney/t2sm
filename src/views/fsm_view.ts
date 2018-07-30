import * as SVG from 'svg.js';
import 'svg.pathmorphing.js';
import 'svg.draggable.js';
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
    RMS_WAITING
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

        this.svg.on('mousemove', this.mousemoveSVG);
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
                            p.stroke({ color: '#000' });
                        });
                    });
                } else {
                    transitionGroup.path('').stroke({ color: '#000', width: 2 }).fill('none').addClass('nopointer');
                }

                transitionGroup.rect(this.transitionLabelDimensions.width, this.transitionLabelDimensions.height).fill('#EEE' ).stroke('#777');
                transitionGroup.text(name).fill('#777');

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
        console.log('remove transition');
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
        stateGroup.mousedown(this.mousedownGroup.bind(this, node));
        stateGroup.mouseout(this.mouseoutStateGroup.bind(this, node));
        stateGroup.mouseover(this.mouseoverStateGroup.bind(this, node));
        stateGroup.mouseup(this.mouseupStateGroup.bind(this, node));
        stateGroup.click(this.clickGroup.bind(this, node));
    }

    private addViewForNewNodes(): void {
        this.graph.nodes().forEach((node: string) => {
            if(!this.states.has(node)) {
                const stateGroup = this.svg.group();
                const isStart = node === this.fsm.getStartState();
                const dimensions = isStart ? this.startStateDimensions : this.stateDimensions;
                stateGroup.rect(dimensions.width, dimensions.height).fill( isStart ? '#888' : '#AAA' ).stroke('#444');
                stateGroup.text(node);

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
        this.creatingTransitionLine.select('path').each(($: number, members: SVG.Element[]) => {
            members.forEach((p: SVG.Path) => {
                p.plot(`M ${node.x} ${node.y} L ${x} ${y} ${this.getArrowPath(node, {x, y})}`);
            });
        });
    }

    private mousemoveSVG = (event: MouseEvent): void => {
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

    private mousedownGroup = (stateName: string, event: MouseEvent): void => {
        if (this.fsmState === FSM_STATE.IDLE && event.which === 3) {
            this.fsmState = FSM_STATE.CT_PRESSED_FROM;
            this.creatingTransitionFromState = stateName;
            this.creatingTransitionLine = this.svg.group();
            this.creatingTransitionLine.path('').stroke({ color: '#F00', width: 2 }).fill('none').addClass('nopointer');
            event.preventDefault();
            event.stopPropagation();
            this.mousemoveSVG(event);
        } else if(this.fsmState === FSM_STATE.AT_AWAITING_FROM) {
            this.fsmState = FSM_STATE.AT_AWAITING_TO;
            this.creatingTransitionFromState = stateName;
            this.creatingTransitionLine = this.svg.group();
            this.creatingTransitionLine.path('').stroke({ color: '#F00', width: 2 }).fill('none').addClass('nopointer');
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
        // this.destroyTransitionCreationIntermediateData();
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

            group.select('rect').each((i: number, members: SVG.Element[]) => {
                members.forEach((r: SVG.Rect) => {
                    r.width(node.width);
                    r.height(node.height);
                    r.animate(this.animationDuration).center(node.x, node.y);
                });
            });
            group.select('text').each((i: number, members: SVG.Element[]) => {
                members.forEach((t: SVG.Text) => {
                    t.animate(this.animationDuration).center(node.x, node.y);
                });
            });
        });
        this.graph.edges().forEach((e) => {
            const node = this.graph.edge(e);
            const group = this.transitions.get(e.name);

            const path = group.select('path');
            const { points, x, y, width, height } = this.graph.edge(e);
            group.select('path').each(($: number, members: SVG.Element[]) => {
                members.forEach((p: SVG.Path) => {
                    const pointStrings = points.map(pnt => `${pnt.x} ${pnt.y}`);
                    const controlPoints = tail(pointStrings);
                    let pathString = `M ${pointStrings[0]}`;
                    for (let i: number = 1; i < pointStrings.length - 1; i += 2) {
                        pathString += ` Q ${pointStrings[i]} ${pointStrings[i + 1]}`;
                    }
                    const sndLstPnt = points[points.length - 2];
                    const lastPnt = points[points.length - 1];

                    pathString += this.getArrowPath(sndLstPnt, lastPnt);

                    (p.animate(this.animationDuration) as MorphableAnimation).plot(pathString);
                });
            });
            group.select('rect').each((i: number, members: SVG.Element[]) => {
                members.forEach((r: SVG.Rect) => {
                    r.width(width).height(height);
                    r.animate(this.animationDuration).center(x, y);
                });
            });
            group.select('text').each((i: number, members: SVG.Element[]) => {
                members.forEach((t: SVG.Text) => {
                    t.animate(this.animationDuration).center(x, y);
                });
            });
        });
    }
} 