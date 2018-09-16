import * as SVG from 'svg.js';
import { EventEmitter } from "events";
import { each, extend, isString } from 'lodash';
import { ForeignObjectDisplay, SetDimensionsEvent } from './ForeignObjectDisplay';
import { DISPLAY_TYPE, StateMachineDisplay } from './StateMachineDisplay';
import { FSM } from '..';
import { SVGShapeButton } from './ShapeButton';

export interface DialogButton {
    callback: (...args: any[]) => any,
    getShape: (x: number, y: number, radius: number) => string,
    backgroundColor?: string,
    color?: string,
    selectBackgroundColor?: string,
    selectColor?: string
};

export abstract class SVGComponentDisplay extends EventEmitter {
    protected svg: SVG.Doc;
    protected group: SVG.G;
    protected foreignObject: SVG.Bare;
    protected foElement: SVGForeignObjectElement;
    protected foDisplay: ForeignObjectDisplay;
    protected graph: dagre.graphlib.Graph;
    protected fsm: FSM<any, any>;
    protected abstract dialogButtons: DialogButton[];
    private shapeButtons: SVGShapeButton[] = [];
    private removeControlsTimeout: any;

    public constructor(protected stateMachineDisplay: StateMachineDisplay, protected name: string, private displayType: DISPLAY_TYPE, protected dimensions: {width: number, height: number}) {
        super();

        this.fsm = this.stateMachineDisplay.getFSM();
        this.svg = this.stateMachineDisplay.getSVG();
        this.graph = this.stateMachineDisplay.getGraph();

        this.group = this.svg.group();

        this.foreignObject = this.group.element('foreignObject').center(this.svg.width()/2, dimensions.height/2);
        this.foDisplay = new ForeignObjectDisplay(this.fsm, this.foreignObject, name, displayType, dimensions);
        this.foDisplay.on('setDimensions', (event: SetDimensionsEvent) => {
            const e = this.getDimensions();
            extend(e, {width: event.width, height: event.height});
            this.emit('dimensionsChanged');
        });
        this.addListeners();

        const getForeignObjectViewport = this.stateMachineDisplay.getFOVGetter();
        getForeignObjectViewport(this.foDisplay);


        if(this.stateMachineDisplay.options.showControls) {
            this.group.mouseover(() => {
                this.clearRemoveControlsTimeout();
                this.showControls();
            });
            this.group.mouseout(() => {
                this.setRemoveControlsTimeout();
            });
        }
    }

    private getDimensions(): {x: number, y: number, width: number, height: number} {
        let entity;
        let e;
        if(this.displayType === DISPLAY_TYPE.TRANSITION) {
            entity = this.getEdge();
            e = this.graph.edge(entity);
        } else {
            entity = this.name;
            e = this.graph.node(entity);
        }
        return e;
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

    private clearRemoveControlsTimeout() {
        clearTimeout(this.removeControlsTimeout);
    }

    private setRemoveControlsTimeout() {
        this.clearRemoveControlsTimeout();
        this.removeControlsTimeout = setTimeout(this.hideControls, 500);
    }

    private showControls = (): void => {
        const { stateBackgroundColor, stateTextColor, selectColor, selectBackgroundColor } = this.stateMachineDisplay.colors;
        this.hideControls();
        const {x, y, width, height } = this.getDimensions();
        const r = 12;
        const bx: number = x + width/2 + r + 5;
        let by: number = y - height/2 - r/2;
        this.dialogButtons.forEach((db, i) => {
            const bg = db.backgroundColor || stateBackgroundColor;
            const fg = db.color || stateTextColor;
            const abg = db.selectBackgroundColor || selectBackgroundColor;
            const afg = db.selectColor || selectColor;
            const shapeButton = new SVGShapeButton(this.svg, db.getShape(bx, by, r-2), bx, by, r+5, fg, bg, afg, abg, 1.5);
            shapeButton.addListener('mouseover', () => {
                this.clearRemoveControlsTimeout();
            });
            shapeButton.addListener('mouseout', () => {
                this.setRemoveControlsTimeout();
            });
            shapeButton.addListener('click', () => {
                db.callback();
                this.hideControls();
            });
            this.shapeButtons[i] = shapeButton;
            by = by + 2*r + 1;
        });
    };

    private hideControls = (): void => {
        this.shapeButtons.forEach((shapeButton) => {
            shapeButton.remove();
        })
        this.shapeButtons.splice(0, this.shapeButtons.length);
    };

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

    public updateLayout(): void {
        this.clearRemoveControlsTimeout();
        this.hideControls();
    }

    public abstract updateColors(duration?: number): void;

    protected forEachInGroup(group: SVG.G, selector: string, fn: (el: SVG.Element) => void): void {
        group.select(selector).each((i: number, members: SVG.Element[]) => {
            members.forEach((el: SVG.Element) => {
                fn(el);
            });
        });
    }

}
