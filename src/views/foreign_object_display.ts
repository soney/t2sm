import { EventEmitter } from "events";
import { DISPLAY_TYPE } from "./fsm_view";

export interface SetDimensionsEvent {
    width: number, height: number
}

export class ForeignObjectDisplay extends EventEmitter {
    public constructor(private element: SVGForeignObjectElement, private name: string, private displayType: DISPLAY_TYPE) {
        super();
    }
    public setDimensions(width: number, height: number): void {
        this.element.setAttribute('width', `${width} px`);
        this.element.setAttribute('height', `${height} px`);
        this.emit('setDimensions', {width, height});
    }
};