import { EventEmitter } from "events";
import { DISPLAY_TYPE } from "./StateMachineDisplay";

export interface SetDimensionsEvent {
    width: number, height: number
}

export class ForeignObjectDisplay extends EventEmitter {
    public constructor(private element: SVGForeignObjectElement, private name: string, private displayType: DISPLAY_TYPE, private payload: any) {
        super();
        this.initialize();
    }
    protected initialize(): void { }
    public setPayload(payload: any): void {
        this.payload = payload;
        this.emit('setPayload', payload);
    };
    public setDimensions(width: number, height: number): void {
        this.element.setAttribute('width', `${width}`);
        this.element.setAttribute('height', `${height}`);
        this.emit('setDimensions', {width, height});
    }
    public mouseEntered(): void {
        this.emit('mouseenter', { fod: this });
    }
    public mouseLeft(): void {
        this.emit('mouseleft', { fod: this });
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
        super.removeAllListeners();
    }
    public getElement(): SVGForeignObjectElement { return this.element; }
    public getName(): string { return this.name; }
    public getDisplayType(): DISPLAY_TYPE { return this.displayType; }
};

export function displayName(fod: ForeignObjectDisplay): void {
    const body: HTMLBodyElement = document.createElement('body');
    const content: HTMLDivElement = document.createElement('div');
    const element = fod.getElement();
    element.appendChild(body);
    body.setAttribute('style', 'font-family: Helvetica, Arial, Sans-Serif;')
    body.appendChild(content);
    content.textContent = fod.getName();

    content.setAttribute('style', 'text-align: center;');
    fod.on('mouseenter', () => {
        content.setAttribute('style', 'text-align: center; color: blue');
    });
    fod.on('mouseleft', () => {
        content.setAttribute('style', 'text-align: center;');
    });
}