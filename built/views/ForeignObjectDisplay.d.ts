/// <reference types="node" />
import * as SVG from 'svg.js';
import { EventEmitter } from "events";
import { DISPLAY_TYPE } from "./StateMachineDisplay";
import { FSM } from "..";
export interface SetDimensionsEvent {
    width: number;
    height: number;
}
export declare class ForeignObjectDisplay extends EventEmitter {
    private fsm;
    private foreignObject;
    private name;
    private displayType;
    private payload;
    private element;
    private shownWidth;
    private shownHeight;
    constructor(fsm: FSM<any, any>, foreignObject: SVG.Bare, name: string, displayType: DISPLAY_TYPE, initialDimensions: {
        width: number;
        height: number;
    });
    protected initialize(): void;
    hide(): void;
    show(): void;
    setPayload(payload: any): void;
    getPayload(): any;
    setDimensions(width: number, height: number, saveAsLast?: boolean): void;
    mouseEntered(): void;
    mouseLeft(): void;
    stateActive(): void;
    stateInactive(): void;
    transitionFired(event: any): void;
    destroy(): void;
    getElement(): SVGForeignObjectElement;
    getName(): string;
    getDisplayType(): DISPLAY_TYPE;
    getFSM(): FSM<any, any>;
}
export declare const displayName: (fod: ForeignObjectDisplay) => void;
export declare function displayValue(func: (fod: ForeignObjectDisplay) => string): (fod: ForeignObjectDisplay) => void;
