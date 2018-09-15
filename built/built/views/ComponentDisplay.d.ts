/// <reference types="node" />
import * as SVG from 'svg.js';
import { EventEmitter } from "events";
import { ForeignObjectDisplay } from './ForeignObjectDisplay';
import { DISPLAY_TYPE, StateMachineDisplay } from './StateMachineDisplay';
import { FSM } from '..';
export interface DialogButton {
    callback: (...args: any[]) => any;
    getShape: (x: number, y: number, radius: number) => string;
    backgroundColor?: string;
    color?: string;
    selectBackgroundColor?: string;
    selectColor?: string;
}
export declare abstract class SVGComponentDisplay extends EventEmitter {
    protected stateMachineDisplay: StateMachineDisplay;
    protected name: string;
    private displayType;
    protected dimensions: {
        width: number;
        height: number;
    };
    protected svg: SVG.Doc;
    protected group: SVG.G;
    protected foreignObject: SVG.Bare;
    protected foElement: SVGForeignObjectElement;
    protected foDisplay: ForeignObjectDisplay;
    protected graph: dagre.graphlib.Graph;
    protected fsm: FSM<any, any>;
    protected abstract dialogButtons: DialogButton[];
    private shapeButtons;
    private removeControlsTimeout;
    constructor(stateMachineDisplay: StateMachineDisplay, name: string, displayType: DISPLAY_TYPE, dimensions: {
        width: number;
        height: number;
    });
    private getDimensions;
    protected getEdge(): any;
    private clearRemoveControlsTimeout;
    private setRemoveControlsTimeout;
    private showControls;
    private hideControls;
    remove(): void;
    getForeignObjectDisplay(): ForeignObjectDisplay;
    private addListeners;
    updateLayout(): void;
    abstract updateColors(duration?: number): void;
    protected forEachInGroup(group: SVG.G, selector: string, fn: (el: SVG.Element) => void): void;
}
