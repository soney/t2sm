/// <reference types="node" />
import { EventEmitter } from "events";
import { DISPLAY_TYPE } from "./StateMachineDisplay";
import { FSM } from "..";
export interface SetDimensionsEvent {
    width: number;
    height: number;
}
export declare class ForeignObjectDisplay extends EventEmitter {
    private fsm;
    private element;
    private name;
    private displayType;
    private payload;
    constructor(fsm: FSM<any, any>, element: SVGForeignObjectElement, name: string, displayType: DISPLAY_TYPE);
    protected initialize(): void;
    setPayload(payload: any): void;
    getPayload(): any;
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
    getFSM(): FSM<any, any>;
}
export declare function displayName(fod: ForeignObjectDisplay): string;
export declare function displayValue(func: (fod: ForeignObjectDisplay) => string): (fod: ForeignObjectDisplay) => void;
