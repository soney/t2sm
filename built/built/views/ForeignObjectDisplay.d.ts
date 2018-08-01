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
    constructor(element: SVGForeignObjectElement, name: string, displayType: DISPLAY_TYPE);
    setDimensions(width: number, height: number): void;
}
