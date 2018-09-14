import * as SVG from 'svg.js';
import 'svg.pathmorphing.js';
import * as dagre from 'dagre';
import { FSM } from '..';
import { ForeignObjectDisplay } from './ForeignObjectDisplay';
export declare enum DISPLAY_TYPE {
    STATE = 0,
    TRANSITION = 1
}
export interface SMDOptions {
    showControls?: boolean;
    animationDuration?: number;
    transitionAnimationDuration?: number;
    transitionThickness?: number;
    padding?: number;
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
    private fsmState;
    private creatingTransitionFromState;
    private creatingTransitionToState;
    private creatingTransitionLine;
    private modifyingTransition;
    private hoveringState;
    private hoveringTransition;
    private addTransitionButton;
    private removeStateButton;
    private removeTransitionButton;
    private resetLayoutButton;
    private startStateDimensions;
    private stateDimensions;
    private transitionLabelDimensions;
    private addStateButton;
    colors: {
        [key: string]: string;
    };
    private static optionDefaults;
    options: SMDOptions;
    constructor(fsm: FSM<any, any>, element: HTMLElement, getForeignObjectViewport?: (el: ForeignObjectDisplay) => void, options?: SMDOptions);
    addTransition(fromLabel: string, toLabel: string, payload?: any): string;
    private resetLayout;
    private addViewForNewTransitions;
    getSVG(): SVG.Doc;
    getFSM(): FSM<any, any>;
    getGraph(): dagre.graphlib.Graph;
    getFOVGetter(): (el: ForeignObjectDisplay) => string | void;
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
    addState: (payload?: any) => string;
    private addStateClicked;
    private addTransitionClicked;
    private removeStateClicked;
    private removeTransitionClicked;
    private addViewForNewNodes;
    private removeViewForOldNodes;
    private removeViewForOldTransitions;
    private mouseoverTransitionGroup;
    private mouseoutTransitionGroup;
    private mousedownTransitionGroup;
    private destroyTransitionCreationIntermediateData;
    private updateCreatingTransitionLine;
    private mousemoveWindow;
    private mousedownStateGroup;
    private mouseoutStateGroup;
    private mouseoverStateGroup;
    private keydownWindow;
    private mouseupWindow;
    private mouseupStateGroup;
    private updateLayout;
    private forEachInGroup;
}
