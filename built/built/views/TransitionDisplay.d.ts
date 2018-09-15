import * as SVG from 'svg.js';
import { StateMachineDisplay } from './StateMachineDisplay';
import { SVGComponentDisplay, DialogButton } from './ComponentDisplay';
export declare class SVGTransitionDisplay extends SVGComponentDisplay {
    private rect;
    private path;
    protected dialogButtons: DialogButton[];
    constructor(stateMachineDisplay: StateMachineDisplay, edge: {
        v: string;
        w: string;
        name?: string;
    }, dimensions: {
        width: number;
        height: number;
    }, creatingTransitionLine?: SVG.G);
    animateFiring(): void;
    animateIneligibleFiring(): void;
    updateColors(): void;
    getGroup(): SVG.G;
    getPath(): SVG.Path;
    updateLayout(): void;
    static getArrowPath(sndLstPnt: {
        x: number;
        y: number;
    }, lastPnt: {
        x: number;
        y: number;
    }): string;
}
