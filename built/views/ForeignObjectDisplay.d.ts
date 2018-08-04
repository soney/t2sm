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
    constructor(element: SVGForeignObjectElement, name: string, displayType: DISPLAY_TYPE, payload: any);
    protected initialize(): void;
    setPayload(payload: any): void;
    setDimensions(width: number, height: number): void;
    mouseEntered(): void;
    mouseLeft(): void;
    stateActive(): void;
    stateInactive(): void;
    transitionFired(event: any): void;
    destroy(): void;
    getElement(): SVGForeignObjectElement;
    getName(): string;
    getDisplayType(): DISPLAY_TYPE;
}
export declare function displayName(fod: ForeignObjectDisplay): void;
