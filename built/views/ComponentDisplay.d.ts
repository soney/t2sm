/// <reference types="node" />
import * as SVG from 'svg.js';
import { EventEmitter } from "events";
import { ForeignObjectDisplay } from './ForeignObjectDisplay';
import { DISPLAY_TYPE, StateMachineDisplay } from './StateMachineDisplay';
import { FSM } from '..';
export declare abstract class SVGComponentDisplay extends EventEmitter {
    protected stateMachineDisplay: StateMachineDisplay;
    protected name: string;
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
    constructor(stateMachineDisplay: StateMachineDisplay, name: string, displayType: DISPLAY_TYPE, dimensions: {
        width: number;
        height: number;
    });
    protected getEdge(): any;
    remove(): void;
    getForeignObjectDisplay(): ForeignObjectDisplay;
    private addListeners;
    abstract updateColors(duration?: number): void;
    abstract updateLayout(): void;
    protected forEachInGroup(group: SVG.G, selector: string, fn: (el: SVG.Element) => void): void;
}
