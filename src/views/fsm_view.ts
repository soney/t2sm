import * as SVG from 'svg.js';
// import 'svg.pathmorphing.js';
import * as dagre from 'dagre';
import { FSM, DagreBinding } from '../index';
import { clone, tail } from 'lodash';

// interface MorphableAnimation extends SVG.Animation {
//     plot: (key: string) => this;
// }

interface Dimensions {
    width: number,
    height: number
}

enum CREATE_TRANSITION_STATE {
    IDLE, PRESSED_ON_FROM, LEFT_FROM, OVER_TO 
}

export class StateMachineDisplay {
    private svg: SVG.Doc;
    private dagreBinding: DagreBinding;
    private graph: dagre.graphlib.Graph;
    private states: Map<string, SVG.G> = new Map();
    private transitions: Map<string, SVG.G> = new Map();
    private createTransitionState: CREATE_TRANSITION_STATE = CREATE_TRANSITION_STATE.IDLE;
    private creatingTransitionFromState: string;
    private creatingTransitionToState: string;
    private creatingTransitionLine: SVG.G = null;
    private addStateButton:SVG.Text;

    private startStateDimensions: Dimensions = { width: 30, height: 30 };
    private stateDimensions: Dimensions = { width: 80, height: 40 };

    public constructor(private fsm:FSM<any, any>, private element:HTMLElement) {
        this.dagreBinding = new DagreBinding(fsm, (state) => {
            if(state === this.fsm.getStartState()) {
                return clone(this.startStateDimensions);
            } else {
                return clone(this.stateDimensions);
            }
        });
        this.graph = this.dagreBinding.getGraph();

        this.svg = SVG(element);

        this.addStateButton = this.svg.text('Add state').addClass('noselect');
        this.addStateButton.click(this.addStateClicked);

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

                this.transitions.set(name, transitionGroup);
            }
        });
    }

    public addState(payload?: any): string {
        const stateName = this.fsm.addState(payload);
        this.addViewForNewNodes();
        this.updateLayout();
        return stateName;
    };

    private addStateClicked = (): void => {
        this.addState();
    }

    private addStateListeners(node: string, stateGroup: SVG.G): void {
        stateGroup.mousedown(this.mousedownGroup.bind(this, node));
        stateGroup.mouseout(this.mouseoutGroup.bind(this, node));
        stateGroup.mouseover(this.mouseoverGroup.bind(this, node));
        stateGroup.mouseup(this.mouseupGroup.bind(this, node));
    }

    private addViewForNewNodes(): void {
        this.graph.nodes().forEach((node: string) => {
            if(!this.states.has(node)) {
                const stateGroup = this.svg.group();
                if(node === this.fsm.getStartState()) {
                    this.graph.setNode(this.fsm.getStartState(), { type: 'start', width: this.startStateDimensions.width, height: this.startStateDimensions.height});
                    stateGroup.circle(this.startStateDimensions.width/2);
                } else {
                    stateGroup.rect(this.stateDimensions.width, this.stateDimensions.height).fill('#AAA').stroke('#444');
                    stateGroup.text(node);
                }

                this.addStateListeners(node, stateGroup);
                this.states.set(node, stateGroup);
            }
        });
    }

    private destroyTransitionCreationIntermediateData(): void {
        this.creatingTransitionToState = this.creatingTransitionFromState = null;
        this.createTransitionState = CREATE_TRANSITION_STATE.IDLE;
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

    private mousedownGroup = (stateName: string, event: MouseEvent): void => {
        if (this.createTransitionState === CREATE_TRANSITION_STATE.IDLE && event.which === 1) {
            this.createTransitionState = CREATE_TRANSITION_STATE.PRESSED_ON_FROM;
            this.creatingTransitionFromState = stateName;
            this.creatingTransitionLine = this.svg.group();
            this.creatingTransitionLine.path('').stroke({ color: '#F00', width: 2 }).fill('none').addClass('nopointer');
            event.preventDefault();
            event.stopPropagation();
            this.mousemoveSVG(event);
        } else {
            this.destroyTransitionCreationIntermediateData();
        }
    }
    private mouseoutGroup = (stateName: string, event: MouseEvent): void => {
        if (this.createTransitionState === CREATE_TRANSITION_STATE.PRESSED_ON_FROM &&
                stateName === this.creatingTransitionFromState) {
            this.createTransitionState = CREATE_TRANSITION_STATE.LEFT_FROM;
        } else if (this.createTransitionState === CREATE_TRANSITION_STATE.OVER_TO) {
            this.createTransitionState = CREATE_TRANSITION_STATE.LEFT_FROM;
            this.creatingTransitionToState = null;
        }
        event.preventDefault();
    }
    private mouseoverGroup = (stateName: string, event: MouseEvent): void => {
        if (this.createTransitionState === CREATE_TRANSITION_STATE.LEFT_FROM) {
            this.createTransitionState = CREATE_TRANSITION_STATE.OVER_TO;
            this.creatingTransitionToState = stateName;
        }
        event.preventDefault();
    }

    private keydownWindow = (event: KeyboardEvent): void => {
        if(event.which === 27 && this.createTransitionState !== CREATE_TRANSITION_STATE.IDLE) {
            this.destroyTransitionCreationIntermediateData();
        }
    };

    private mouseupWindow = (event: MouseEvent): void => {
        event.preventDefault();
        this.destroyTransitionCreationIntermediateData();
    }

    private mouseupGroup = (stateName: string, event: MouseEvent): void => {
        if (this.createTransitionState === CREATE_TRANSITION_STATE.OVER_TO &&
                stateName === this.creatingTransitionToState) {
            this.createTransitionState = CREATE_TRANSITION_STATE.IDLE;

            this.addTransition(this.creatingTransitionFromState, this.creatingTransitionToState, {});
            this.destroyTransitionCreationIntermediateData();
        } else {
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
                    r.animate(1).center(node.x, node.y);
                });
            });
            group.select('text').each((i: number, members: SVG.Element[]) => {
                members.forEach((t: SVG.Text) => {
                    t.center(node.x, node.y);
                });
            });
        });
        this.graph.edges().forEach((e) => {
            const node = this.graph.edge(e);
            const group = this.transitions.get(e.name);

            const path = group.select('path');
            const { points } = this.graph.edge(e);
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

                    p.plot(pathString);
                });
            });
        });
    }
} 