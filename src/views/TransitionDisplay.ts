import * as SVG from 'svg.js';
import { EventEmitter } from "events";
import { each, extend, isString } from 'lodash';
import { ForeignObjectDisplay, SetDimensionsEvent } from './ForeignObjectDisplay';
import { DISPLAY_TYPE, StateMachineDisplay } from './StateMachineDisplay';
import { FSM } from '..';
import { SVGComponentDisplay } from './ComponentDisplay';
import { SVGShapeButton, getXPath, getFPath } from './ShapeButton';

interface MorphableAnimation extends SVG.Animation {
    plot: (key: string) => this;
}

export class SVGTransitionDisplay extends SVGComponentDisplay {
    private rect: SVG.Rect;
    private path: SVG.Path;
    private foreignObjectElement: SVG.Bare;
    private removeControlsTimeout: any;
    private deleteButton: SVGShapeButton;
    private fireButton: SVGShapeButton;

    public constructor(stateMachineDisplay: StateMachineDisplay, edge: {v: string, w: string, name?: string}, dimensions: {width: number, height: number}, creatingTransitionLine?: SVG.G) {
        super(stateMachineDisplay, edge.name, DISPLAY_TYPE.TRANSITION, dimensions);
        if (creatingTransitionLine) {
            this.forEachInGroup(creatingTransitionLine, 'path', (p: SVG.Path) => {
                creatingTransitionLine.removeElement(p);
                this.group.add(p);
                p.stroke({ color: this.stateMachineDisplay.colors.transitionLineColor }).removeClass('nopointer');
                this.path = p;
            });
        } else {
            this.path = this.group.path('').stroke({ color: this.stateMachineDisplay.colors.transitionLineColor, width: this.stateMachineDisplay.options.transitionThickness }).fill('none').removeClass('nopointer');
        }

        this.rect = this.group.rect(this.dimensions.width, this.dimensions.height).fill(this.stateMachineDisplay.colors.transitionBackgroundColor).stroke(this.stateMachineDisplay.colors.transitionLineColor);
        this.foreignObjectElement = this.group.element('foreignObject');
        // const foreignObjectDisplay = new ForeignObjectDisplay(this.fsm, this.foreignObjectElement.node as any, this.name, DISPLAY_TYPE.TRANSITION);
        // console.log(foreignObjectDisplay);
        // foreignObjectDisplay.on('setDimensions', (event: SetDimensionsEvent) => {
        //     console.log(event);
        //     const edge = this.getEdge();
        //     const e = this.graph.edge(edge);
        //     extend(e, {width: event.width, height: event.height});
        // });
        this.foreignObject.front();
        // this.updateLayout();
        this.updateColors();
        if(this.stateMachineDisplay.options.showControls) {
            this.group.mouseover(this.showControls);
            this.group.mouseout(this.onMouseout);
        }
    }
    private onMouseout = (): void => {
        this.setRemoveControlsTimeout();
    }
    private showControls = (): void => {
        const edge = this.getEdge();
        const { points, x, y, width, height } = this.graph.edge(edge);

        if(this.deleteButton) {
            this.deleteButton.remove();
        }
        if(this.fireButton) {
            this.fireButton.remove();
        }
        const r = 10;
        const b1x = x + width/2 + r + 5;
        const b1y = y - height/2 + r;
        this.deleteButton = new SVGShapeButton(this.svg, getXPath(b1x, b1y, r, 45), b1x, b1y, 15, '#000', '#F00', 2);
        const b2x = b1x;
        const b2y = b1y + 2*r + 1;
        this.fireButton = new SVGShapeButton(this.svg, getFPath(b2x, b2y, 2*r/3, 4*r/5), b2x, b2y, 15, '#000', '#F00', 2);

        this.deleteButton.addListener('click', () => {
            this.emit('delete');
            this.hideControls();
        });
        this.deleteButton.addListener('mouseover', () => {
            this.clearRemoveControlsTimeout();
        })
        this.deleteButton.addListener('mouseout', () => {
            this.setRemoveControlsTimeout();
        })
        this.fireButton.addListener('click', () => {
            this.emit('fire');
            this.hideControls();
        });
        this.fireButton.addListener('mouseover', () => {
            this.clearRemoveControlsTimeout();
        })
        this.fireButton.addListener('mouseout', () => {
            this.setRemoveControlsTimeout();
        })
    };

    private hideControls = (): void => {
        if(this.deleteButton) {
            this.deleteButton.remove();
            this.deleteButton = null;
        }
        if(this.fireButton) {
            this.fireButton.remove();
            this.fireButton = null;
        }
    };
    private clearRemoveControlsTimeout() {
        clearTimeout(this.removeControlsTimeout);
    }
    private setRemoveControlsTimeout() {
        this.clearRemoveControlsTimeout();
        this.removeControlsTimeout = setTimeout(this.hideControls, 1000);
    }

    public animateFiring(): void {
        const segments = 10;
        const overallDuration = this.stateMachineDisplay.options.transitionAnimationDuration;
        this.forEachInGroup(this.group, 'path', (p: SVG.Path) => {
            const len = p.length();
            let point: {x: number, y: number} = p.pointAt(0);
            const dot = this.svg.path(`M ${point.x} ${point.y} l 0 0`).stroke({color: this.stateMachineDisplay.colors.activeColor, width: this.stateMachineDisplay.options.transitionThickness*2});

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

        setTimeout(() => { this.rect.stroke({ color: this.stateMachineDisplay.colors.activeColor }).fill(this.stateMachineDisplay.colors.activeBackgroundColor); }, overallDuration/3)
        setTimeout(() => { this.updateColors(); }, 2*overallDuration/3);
        this.rect.front();
        this.foreignObject.front();
    }

    public animateIneligibleFiring(): void {
        const cx = this.rect.cx();
        const cy = this.rect.cy();
        const width = this.rect.width();
        const height = this.rect.height();
        this.rect.animate(25).size(width + 10, height + 10).center(cx, cy);
        this.rect.animate(75).size(width, height).center(cx, cy);
        setTimeout(() => this.updateLayout(), 110);
    }

    public updateColors(): void {
        const {foreground, background} = this.stateMachineDisplay.getTransitionColors(this.name);
        this.path.stroke(foreground);
        this.rect.stroke(foreground).fill(background);
    }

    public getGroup(): SVG.G { return this.group; }
    public getPath(): SVG.Path { return this.path; }

    public updateLayout(): void {
        const edge = this.getEdge();
        const { points, x, y, width, height } = this.graph.edge(edge);

        const pointStrings = points.map(pnt => `${pnt.x} ${pnt.y}`);
        let pathString = `M ${pointStrings[0]}`;
        for (let i: number = 1; i < pointStrings.length - 1; i += 2) {
            pathString += ` Q ${pointStrings[i]} ${pointStrings[i + 1]}`;
        }
        const sndLstPnt = points[points.length - 2];
        const lastPnt = points[points.length - 1];

        pathString += SVGTransitionDisplay.getArrowPath(sndLstPnt, lastPnt);

        if(this.stateMachineDisplay.options.animationDuration > 0) {
            (this.path.animate(this.stateMachineDisplay.options.animationDuration) as MorphableAnimation).plot(pathString);
        } else {
            this.path.plot(pathString);
        }

        this.rect.width(width).height(height);
        if(this.stateMachineDisplay.options.animationDuration > 0) {
            this.rect.animate(this.stateMachineDisplay.options.animationDuration).center(x, y);
        } else {
            this.rect.center(x, y);
        }
        this.rect.front();

        if(this.stateMachineDisplay.options.animationDuration > 0) {
            this.foreignObject.animate(this.stateMachineDisplay.options.animationDuration).x(x-width/2).y(y-height/2);
            this.foreignObject.animate(this.stateMachineDisplay.options.animationDuration).size(width, height);
        } else {
            this.foreignObject.x(x-width/2).y(y-height/2);
            this.foreignObject.size(width, height);
        }
        this.foreignObject.front();
    }


    public static getArrowPath(sndLstPnt: {x: number, y: number}, lastPnt: {x: number, y: number}): string {
        const theta = Math.atan2(sndLstPnt.y - lastPnt.y, sndLstPnt.x - lastPnt.x);
        const offset = 20 * Math.PI / 180;
        const s = 10;
        const pathString = ` m ${Math.cos(theta + offset) * s} ${Math.sin(theta + offset) * s}` +
                           ` L ${lastPnt.x} ${lastPnt.y}` +
                           ` l ${Math.cos(theta - offset) * s} ${Math.sin(theta - offset) * s}`;
        return pathString;
    }
}
