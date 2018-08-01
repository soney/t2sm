/// <reference types="node" />
import { EventEmitter } from "events";
import { DISPLAY_TYPE } from "./StateMachineDisplay";
export interface SetDimensionsEvent {
    width: number;
    height: number;
}
export declare class ForeignObjectDisplay extends EventEmitter {
    private element;
    private name;
    private displayType;
    private payload;
    private body;
    constructor(element: SVGForeignObjectElement, name: string, displayType: DISPLAY_TYPE, payload: any);
    setDimensions(width: number, height: number): void;
    getBody(): HTMLBodyElement;
    mouseEntered(): void;
    mouseLeft(): void;
    stateActive(): void;
    stateInactive(): void;
    transitionFired(event: any): void;
    destroy(): void;
}
