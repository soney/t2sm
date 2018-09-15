import * as SVG from 'svg.js';
import { EventEmitter } from "events";
import { extend, isString } from 'lodash';
import { ForeignObjectDisplay, SetDimensionsEvent } from './ForeignObjectDisplay';
import { DISPLAY_TYPE, StateMachineDisplay } from './StateMachineDisplay';
import { FSM } from '..';
import { SVGComponentDisplay, DialogButton } from './ComponentDisplay';
import { SVGShapeButton, getXPath, getArrowPath, getAPath } from './ShapeButton';

export class SVGStateDisplay extends SVGComponentDisplay {
    private rect: SVG.Rect;
    private updateColorTimeout;

    protected dialogButtons: DialogButton[] = [{
            getShape: (x: number, y: number, r: number) => getXPath(x, y, r, 45),
            callback: () => this.emit('delete'),
            selectBackgroundColor: '#f8d7da',
            selectColor: '#dc3545'
        }, {
            getShape: (x: number, y: number, r: number) => getArrowPath(x, y, r, 45, r/2),
            callback: () => this.emit('addOutgoingTransition'),
            selectBackgroundColor: this.stateMachineDisplay.colors.selectBackgroundColor,
            selectColor: this.stateMachineDisplay.colors.selectColor
        }, {
            getShape: (x: number, y: number, r: number) => getAPath(x, y, 2*r/3, 4*r/5),
            callback: () => this.emit('makeActive'),
            selectBackgroundColor: this.stateMachineDisplay.colors.activeBackgroundColor,
            selectColor: this.stateMachineDisplay.colors.activeColor
        }
    ];

    public constructor(stateMachineDisplay: StateMachineDisplay, node: string, dimensions: {width: number, height: number}) {
        super(stateMachineDisplay, node, DISPLAY_TYPE.STATE, dimensions);
        this.rect = this.group.rect(dimensions.width, dimensions.height).center(this.svg.width()/2, dimensions.height/2);
        this.foreignObject.front();
        this.updateColors();
    }
    private updateStateDisplay(): void {
        const {foreground, background} = this.stateMachineDisplay.getStateColors(this.name);
        this.rect.stroke(foreground).fill(background);
    }
    public updateLayout(): void {
        super.updateLayout();
        const {x, y, width, height } = this.graph.node(this.name);

        this.rect.size(width, height);
        if(this.stateMachineDisplay.options.animationDuration > 0) {
            this.rect.animate(this.stateMachineDisplay.options.animationDuration).center(x, y);
        } else {
            this.rect.center(x, y);
        }
        if(this.stateMachineDisplay.options.animationDuration > 0) {
            this.foreignObject.animate(this.stateMachineDisplay.options.animationDuration).x(x-width/2).y(y-height/2);
            this.foreignObject.animate(this.stateMachineDisplay.options.animationDuration).size(width, height);
        } else {
            this.foreignObject.x(x-width/2).y(y-height/2);
            this.foreignObject.size(width, height);
        }
    }
    public updateColors(delay: number = 0): void {
        const {foreground, background} = this.stateMachineDisplay.getStateColors(this.name);
        if (this.updateColorTimeout) {
            clearTimeout(this.updateColorTimeout);
        }
        if (delay > 0) {
            this.updateColorTimeout = setTimeout(() => this.rect.stroke(foreground).fill(background), delay);
        } else {
           this.rect.stroke(foreground).fill(background);
        }
    }
}

export class SVGStartStateDisplay extends SVGComponentDisplay {
    private circle: SVG.Circle;
    private updateColorTimeout;

    protected dialogButtons: DialogButton[] = [{
            getShape: (x: number, y: number, r: number) => getArrowPath(x, y, r, 45, r/2),
            callback: () => this.emit('addOutgoingTransition'),
            selectBackgroundColor: this.stateMachineDisplay.colors.selectBackgroundColor,
            selectColor: this.stateMachineDisplay.colors.selectColor
        }, {
            getShape: (x: number, y: number, r: number) => getAPath(x, y, 2*r/3, 4*r/5),
            callback: () => this.emit('makeActive'),
            selectBackgroundColor: this.stateMachineDisplay.colors.activeBackgroundColor,
            selectColor: this.stateMachineDisplay.colors.activeColor
        }
    ];

    public constructor(stateMachineDisplay: StateMachineDisplay, node: string, dimensions: {width: number, height: number}) {
        super(stateMachineDisplay, node, DISPLAY_TYPE.STATE, dimensions);
        this.circle = this.group.circle(dimensions.width);
        this.foreignObject.front();
        this.updateColors();
    }
    private updateStateDisplay(): void {
        const {foreground, background} = this.stateMachineDisplay.getStateColors(this.name);
        this.circle.stroke(foreground).fill(background);
    }
    public updateLayout(): void {
        super.updateLayout();
        const {x, y, width, height } = this.graph.node(this.name);

        this.circle.radius(width);
        if(this.stateMachineDisplay.options.animationDuration > 0) {
            this.circle.animate(this.stateMachineDisplay.options.animationDuration).center(x, y);
        } else {
            this.circle.center(x, y);
        }
        if(this.stateMachineDisplay.options.animationDuration > 0) {
            this.foreignObject.animate(this.stateMachineDisplay.options.animationDuration).x(x-width/2).y(y-height/2);
            this.foreignObject.animate(this.stateMachineDisplay.options.animationDuration).size(width, height);
        } else {
            this.foreignObject.x(x-width/2).y(y-height/2);
            this.foreignObject.size(width, height);
        }
    }
    public updateColors(delay: number = 0): void {
        if (this.updateColorTimeout) {
            clearTimeout(this.updateColorTimeout);
        }
        const {foreground, background} = this.stateMachineDisplay.getStateColors(this.name);
        if(delay > 0) {
            this.updateColorTimeout = setTimeout(() => this.circle.stroke(foreground).fill(background), delay);
        } else {
           this.circle.stroke(foreground).fill(background);
        }
    }
}
