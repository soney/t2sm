import 'svg.pathmorphing.js';
import { FSM } from '..';
import { ForeignObjectDisplay } from './ForeignObjectDisplay';
export declare enum DISPLAY_TYPE {
    STATE = 0,
    TRANSITION = 1
}
export declare class StateMachineDisplay {
    private fsm;
    private element;
    private getForeignObjectViewport;
    private header;
    private svgContainer;
    private svg;
    private dagreBinding;
    private graph;
    private states;
    private transitions;
    private stateFODisplays;
    private transitionFODisplays;
    private fsmState;
    private creatingTransitionFromState;
    private creatingTransitionToState;
    private creatingTransitionLine;
    private modifyingTransition;
    private hoveringState;
    private hoveringTransition;
    private addStateButton;
    private addTransitionButton;
    private removeStateButton;
    private removeTransitionButton;
    private resetLayoutButton;
    private animationDuration;
    private startStateDimensions;
    private stateDimensions;
    private transitionLabelDimensions;
    private colors;
    private transitionThickness;
    private transitionAnimationDuration;
    constructor(fsm: FSM<any, any>, element: HTMLElement, getForeignObjectViewport?: (el: ForeignObjectDisplay) => string | void);
    addTransition(fromLabel: string, toLabel: string, payload?: any): string;
    private resetLayout;
    private addViewForNewTransitions;
    getTransitionColors(transitionName: string): {
        background: string;
        foreground: string;
    };
    getStateColors(stateName: string): {
        background: string;
        foreground: string;
    };
    onTransitionFired(transition: string, event: any): void;
    private onIneligibleTransitionFired;
    animateTransition(transition: string): void;
    addState(payload?: any): string;
    private addStateClicked;
    private addTransitionClicked;
    private removeStateClicked;
    private removeTransitionClicked;
    private addStateListeners;
    private addTransitionListeners;
    private addViewForNewNodes;
    private removeViewForOldNodes;
    private removeViewForOldTransitions;
    private destroyTransitionCreationIntermediateData;
    private updateCreatingTransitionLine;
    private mousemoveWindow;
    private mouseoverTransitionGroup;
    private mouseoutTransitionGroup;
    private mouseupTransitionGroup;
    private mousedownTransitionGroup;
    private mousedownStateGroup;
    private updateTransitionDisplay;
    private updateStateDisplay;
    private mouseoutStateGroup;
    private mouseoverStateGroup;
    private keydownWindow;
    private mouseupWindow;
    private mouseupStateGroup;
    private getArrowPath;
    private updateLayout;
    private forEachInGroup;
}
