import * as SVG from 'svg.js';
import { StateMachineDisplay } from './StateMachineDisplay';
import { SVGComponentDisplay } from './ComponentDisplay';
export declare class SVGTransitionDisplay extends SVGComponentDisplay {
    private rect;
    private path;
    private foreignObjectElement;
    private removeControlsTimeout;
    private deleteButton;
    constructor(stateMachineDisplay: StateMachineDisplay, edge: {
        v: string;
        w: string;
        name?: string;
    }, dimensions: {
        width: number;
        height: number;
    }, creatingTransitionLine?: SVG.G);
    private onMouseout;
    private showControls;
    private hideControls;
    private clearRemoveControlsTimeout;
    private setRemoveControlsTimeout;
    animateFiring(): void;
    animateIneligibleFiring(): void;
    updateColors(): void;
    getGroup(): SVG.G;
    getPath(): SVG.Path;
    private getEdge;
    updateLayout(): void;
    static getArrowPath(sndLstPnt: {
        x: number;
        y: number;
    }, lastPnt: {
        x: number;
        y: number;
    }): string;
}
