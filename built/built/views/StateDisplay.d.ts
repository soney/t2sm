import { StateMachineDisplay } from './StateMachineDisplay';
import { SVGComponentDisplay, DialogButton } from './ComponentDisplay';
export declare class SVGStateDisplay extends SVGComponentDisplay {
    private rect;
    private updateColorTimeout;
    protected dialogButtons: DialogButton[];
    constructor(stateMachineDisplay: StateMachineDisplay, node: string, dimensions: {
        width: number;
        height: number;
    });
    private updateStateDisplay;
    updateLayout(): void;
    updateColors(delay?: number): void;
}
export declare class SVGStartStateDisplay extends SVGComponentDisplay {
    private circle;
    private updateColorTimeout;
    protected dialogButtons: DialogButton[];
    constructor(stateMachineDisplay: StateMachineDisplay, node: string, dimensions: {
        width: number;
        height: number;
    });
    private updateStateDisplay;
    updateLayout(): void;
    updateColors(delay?: number): void;
}
