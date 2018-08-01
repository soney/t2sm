import { EventEmitter } from "events";
import { DISPLAY_TYPE } from "./StateMachineDisplay";

export interface SetDimensionsEvent {
    width: number, height: number
}

export class ForeignObjectDisplay extends EventEmitter {
    private body: HTMLBodyElement = document.createElement('body');
    public constructor(private element: SVGForeignObjectElement, private name: string, private displayType: DISPLAY_TYPE, private payload: any) {
        super();
        this.element.appendChild(this.body);
        this.body.textContent = this.name;
    }
    public setDimensions(width: number, height: number): void {
        this.element.setAttribute('width', `${width}`);
        this.element.setAttribute('height', `${height}`);
        this.emit('setDimensions', {width, height});
    }
    public getBody(): HTMLBodyElement {
        return this.body;
    }
    public mouseEntered(): void {
        this.emit('mouseenter', { fod: this });
        this.body.setAttribute('style', 'color: blue');
    }
    public mouseLeft(): void {
        this.emit('mouseleft', { fod: this });
        this.body.removeAttribute('style');
    }
    public stateActive(): void {

    }
    public stateInactive(): void {

    }
    public transitionFired(event: any): void {
        this.emit('transitionfired', { fod: this });
    }
    public destroy(): void {
        this.emit('destroy', { fod: this });
    }
};