import { StateMachineDisplay } from './StateMachineDisplay';
import { SVGComponentDisplay } from './ComponentDisplay';
export declare class SVGStateDisplay extends SVGComponentDisplay {
    private rect;
    private deleteButton;
    private addOutgoingTransitionButton;
    private removeControlsTimeout;
    constructor(stateMachineDisplay: StateMachineDisplay, node: string, dimensions: {
        width: number;
        height: number;
    });
    private clearRemoveControlsTimeout;
    private setRemoveControlsTimeout;
    private onMouseout;
    private showControls;
    private hideControls;
    private updateStateDisplay;
    updateLayout(): void;
    updateColors(delay?: number): void;
}
export declare class SVGStartStateDisplay extends SVGComponentDisplay {
    private circle;
    private removeControlsTimeout;
    private addOutgoingTransitionButton;
    constructor(stateMachineDisplay: StateMachineDisplay, node: string, dimensions: {
        width: number;
        height: number;
    });
    private clearRemoveControlsTimeout;
    private setRemoveControlsTimeout;
    private showControls;
    private hideControls;
    private onMouseout;
    private updateStateDisplay;
    updateLayout(): void;
    updateColors(delay?: number): void;
}
