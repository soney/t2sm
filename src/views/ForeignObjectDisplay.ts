import * as SVG from 'svg.js';
import { EventEmitter } from "events";
import { DISPLAY_TYPE } from "./StateMachineDisplay";
import { FSM } from "..";

export interface SetDimensionsEvent {
    width: number, height: number
}

export class ForeignObjectDisplay extends EventEmitter {
    private payload: any;
    private element: SVGForeignObjectElement;
    private shownWidth: number;
    private shownHeight: number;

    public constructor(private fsm: FSM<any, any>, private foreignObject: SVG.Bare, private name: string, private displayType: DISPLAY_TYPE, initialDimensions: { width: number, height: number }) {
        super();
        this.element = this.foreignObject.node as any;
        this.shownWidth = initialDimensions.width;
        this.shownHeight = initialDimensions.height;
        this.initialize();
    }
    protected initialize(): void {
        if(this.displayType === DISPLAY_TYPE.STATE) {
            this.payload = this.fsm.getStatePayload(this.name);
        } else {
            this.payload = this.fsm.getTransitionPayload(this.name);
        }
    }
    public hide(): void {
        if(this.displayType === DISPLAY_TYPE.TRANSITION) {
            this.setDimensions(0, 0, false);
        } else {
            this.setDimensions(1, 1, false);
        }
        this.foreignObject.hide();
    }
    public show(): void {
        this.foreignObject.show();
        this.setDimensions(this.shownWidth, this.shownHeight);
    }
    public setPayload(payload: any): void {
        this.payload = payload;
        this.emit('setPayload', payload);
    };
    public getPayload(): any { return this.payload; }
    public setDimensions(width: number, height: number, saveAsLast: boolean = true): void {
        this.element.setAttribute('width', `${width}`);
        this.element.setAttribute('height', `${height}`);
        this.emit('setDimensions', {width, height});
        if (saveAsLast) {
            this.shownWidth = width;
            this.shownHeight = height;
        }
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
    public getFSM(): FSM<any, any> { return this.fsm; };
};

export const displayName = displayValue((fod: ForeignObjectDisplay): string => {
    const name = fod.getName();
    if(name === fod.getFSM().getStartState()) {
        return '';
    } else {
        return name;
    }
 });

export function displayValue(func: (fod: ForeignObjectDisplay) => string): (fod: ForeignObjectDisplay) => void {
    return function(fod: ForeignObjectDisplay): void {
        const body: HTMLBodyElement = document.createElement('body');
        const content: HTMLDivElement = document.createElement('div');
        const element = fod.getElement();
        element.appendChild(body);
        body.setAttribute('style', 'font-family: Helvetica, Arial, Sans-Serif;')
        body.appendChild(content);
        content.textContent = func(fod);
        fod.addListener('setPayload', () => {
            content.textContent = func(fod);
        });

        content.setAttribute('style', 'text-align: center;');
        fod.on('mouseenter', () => {
            content.setAttribute('style', 'text-align: center; color: blue');
        });
        fod.on('mouseleft', () => {
            content.setAttribute('style', 'text-align: center;');
        });
    };
}