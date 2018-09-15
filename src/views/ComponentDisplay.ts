import * as SVG from 'svg.js';
import { EventEmitter } from "events";
import { each, extend, isString } from 'lodash';
import { ForeignObjectDisplay, SetDimensionsEvent } from './ForeignObjectDisplay';
import { DISPLAY_TYPE, StateMachineDisplay } from './StateMachineDisplay';
import { FSM } from '..';

export abstract class SVGComponentDisplay extends EventEmitter {
    protected svg: SVG.Doc;
    protected group: SVG.G;
    protected foreignObject: SVG.Bare;
    protected foElement: SVGForeignObjectElement;
    protected foDisplay: ForeignObjectDisplay;
    protected graph: dagre.graphlib.Graph;
    protected fsm: FSM<any, any>;

    public constructor(protected stateMachineDisplay: StateMachineDisplay, protected name: string, displayType: DISPLAY_TYPE, protected dimensions: {width: number, height: number}) {
        super();

        this.fsm = this.stateMachineDisplay.getFSM();
        this.svg = this.stateMachineDisplay.getSVG();
        this.graph = this.stateMachineDisplay.getGraph();

        this.group = this.svg.group();

        this.foreignObject = this.group.element('foreignObject');
        this.foElement = this.foreignObject.node as any;
        this.foDisplay = new ForeignObjectDisplay(this.fsm, this.foElement, name, displayType);
        this.foDisplay.on('setDimensions', (event: SetDimensionsEvent) => {
            let entity;
            let e;
            if(displayType === DISPLAY_TYPE.TRANSITION) {
                entity = this.getEdge();
                e = this.graph.edge(entity);
            } else {
                entity = this.name;
                e = this.graph.node(entity);
            }
            extend(e, {width: event.width, height: event.height});
            this.emit('dimensionsChanged');
        });
        this.addListeners();

        const getForeignObjectViewport = this.stateMachineDisplay.getFOVGetter();
        getForeignObjectViewport(this.foDisplay);
    }
    protected getEdge(): any {
        let edge;
        each(this.graph.edges(), (e) => {
            if (e.name === this.name) {
                edge = e;
            }
        });
        return edge;
    }


    public remove(): void {
        this.group.remove();
    }

    public getForeignObjectDisplay(): ForeignObjectDisplay {
        return this.foDisplay;
    };

    private addListeners(): void {
        this.group.each((i: number, children: SVG.Element[]) => {
            children.forEach((child: SVG.Element) => {
                child.on('contextmenu', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                });
            });
        });
        this.group.mousedown((e) => this.emit('mousedown', e) );
        this.group.mouseout((e) => this.emit('mouseout', e));
        this.group.mouseover((e) => this.emit('mouseover', e));
        this.group.mouseup((e) => this.emit('mouseup', e));
    }

    public abstract updateColors(duration?: number): void;
    public abstract updateLayout(): void;

    protected forEachInGroup(group: SVG.G, selector: string, fn: (el: SVG.Element) => void): void {
        group.select(selector).each((i: number, members: SVG.Element[]) => {
            members.forEach((el: SVG.Element) => {
                fn(el);
            });
        });
    }
}
