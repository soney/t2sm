import * as SVG from 'svg.js';
import { EventEmitter } from "events";
import { extend, isString } from 'lodash';
import { ForeignObjectDisplay, SetDimensionsEvent } from './ForeignObjectDisplay';
import { DISPLAY_TYPE, StateMachineDisplay } from './StateMachineDisplay';
import { FSM } from '..';
import { SVGComponentDisplay } from './ComponentDisplay';
import { SVGShapeButton, getXPath, getArrowPath, getAPath } from './ShapeButton';

export class SVGStateDisplay extends SVGComponentDisplay {
    private rect: SVG.Rect;
    private deleteButton: SVGShapeButton;
    private addOutgoingTransitionButton: SVGShapeButton;
    private makeActiveButton: SVGShapeButton;
    private removeControlsTimeout: any;

    public constructor(stateMachineDisplay: StateMachineDisplay, node: string, dimensions: {width: number, height: number}) {
        super(stateMachineDisplay, node, DISPLAY_TYPE.STATE, dimensions);
        this.rect = this.group.rect(dimensions.width, dimensions.height);
        this.foreignObject.front();
        this.updateColors();
        if(this.stateMachineDisplay.options.showControls) {
            this.group.mouseover(this.showControls);
            this.group.mouseout(this.onMouseout);
        }
    }

    private clearRemoveControlsTimeout() {
        clearTimeout(this.removeControlsTimeout);
    }
    private setRemoveControlsTimeout() {
        this.clearRemoveControlsTimeout();
        this.removeControlsTimeout = setTimeout(this.hideControls, 1000);
    }

    private onMouseout = (): void => {
        this.setRemoveControlsTimeout();
    }

    private showControls = (): void => {
        const {x, y, width, height } = this.graph.node(this.name);
        if(this.deleteButton) {
            this.deleteButton.remove();
        }
        if(this.addOutgoingTransitionButton) {
            this.addOutgoingTransitionButton.remove();
        }
        if(this.makeActiveButton) {
            this.makeActiveButton.remove();
        }
        const r = 10;
        const b1x = x + width/2 + r + 5;
        const b1y = y - height/2 - r/2;
        this.deleteButton = new SVGShapeButton(this.svg, getXPath(b1x, b1y, r, 45), b1x, b1y, 15, '#000', '#F00', 2);
        const b2x = b1x;
        const b2y = b1y + 2*r + 1;
        this.addOutgoingTransitionButton = new SVGShapeButton(this.svg, getArrowPath(b2x, b2y, r, 45, 5), b2x, b2y, 15, '#000', '#F00', 2);

        const b3x = b2x;
        const b3y = b2y + 2*r + 1;
        this.makeActiveButton = new SVGShapeButton(this.svg, getAPath(b3x, b3y, r, r), b3x, b3y, 15, '#000', '#F00', 2);

        this.deleteButton.addListener('click', () => {
            this.emit('delete');
            this.hideControls();
        });
        this.addOutgoingTransitionButton.addListener('click', () => {
            this.emit('addOutgoingTransition');
            this.hideControls();
        });
        this.makeActiveButton.addListener('click', () => {
            this.emit('makeActive');
            this.hideControls();
        });
        this.deleteButton.addListener('mouseover', () => {
            this.clearRemoveControlsTimeout();
        })
        this.deleteButton.addListener('mouseout', () => {
            this.setRemoveControlsTimeout();
        })
        this.addOutgoingTransitionButton.addListener('mouseover', () => {
            this.clearRemoveControlsTimeout();
        })
        this.addOutgoingTransitionButton.addListener('mouseout', () => {
            this.setRemoveControlsTimeout();
        })
        this.makeActiveButton.addListener('mouseover', () => {
            this.clearRemoveControlsTimeout();
        })
        this.makeActiveButton.addListener('mouseout', () => {
            this.setRemoveControlsTimeout();
        })
    };

    private hideControls = (): void => {
        if(this.deleteButton) {
            this.deleteButton.remove();
            this.deleteButton = null;
        }
        if(this.addOutgoingTransitionButton) {
            this.addOutgoingTransitionButton.remove();
            this.addOutgoingTransitionButton = null;
        }
        if(this.makeActiveButton) {
            this.makeActiveButton.remove();
            this.makeActiveButton = null;
        }
    };
    private updateStateDisplay(): void {
        const {foreground, background} = this.stateMachineDisplay.getStateColors(this.name);
        this.rect.stroke(foreground).fill(background);
    }
    public updateLayout(): void {
        const {x, y, width, height } = this.graph.node(this.name);

        this.rect.size(width, height);
        if(this.stateMachineDisplay.options.animationDuration > 0) {
            this.rect.animate(this.stateMachineDisplay.options.animationDuration).center(x, y);
        } else {
            this.rect.center(x, y);
        }
        if(this.stateMachineDisplay.options.animationDuration > 0) {
            this.foreignObject.animate(this.stateMachineDisplay.options.animationDuration).x(x-width/2).y(y-height/2);
            this.foreignObject.animate(this.stateMachineDisplay.options.animationDuration).size(width, height);
        } else {
            this.foreignObject.x(x-width/2).y(y-height/2);
            this.foreignObject.size(width, height);
        }
    }
    public updateColors(delay: number = 0): void {
        const {foreground, background} = this.stateMachineDisplay.getStateColors(this.name);
        if(delay > 0) {
            setTimeout(() => this.rect.stroke(foreground).fill(background), delay);
        } else {
           this.rect.stroke(foreground).fill(background);
        }
    }
}

export class SVGStartStateDisplay extends SVGComponentDisplay {
    private circle: SVG.Circle;
    private removeControlsTimeout: any;
    private addOutgoingTransitionButton: SVGShapeButton;
    private makeActiveButton: SVGShapeButton;

    public constructor(stateMachineDisplay: StateMachineDisplay, node: string, dimensions: {width: number, height: number}) {
        super(stateMachineDisplay, node, DISPLAY_TYPE.STATE, dimensions);
        this.circle = this.group.circle(dimensions.width);
        this.foreignObject.front();
        this.updateColors();
        if(this.stateMachineDisplay.options.showControls) {
            this.group.mouseover(this.showControls);
            this.group.mouseout(this.onMouseout);
        }
    }

    private clearRemoveControlsTimeout() {
        clearTimeout(this.removeControlsTimeout);
    }
    private setRemoveControlsTimeout() {
        this.clearRemoveControlsTimeout();
        this.removeControlsTimeout = setTimeout(this.hideControls, 1000);
    }

    private showControls = (): void => {
        const {x, y, width, height } = this.graph.node(this.name);
        if(this.addOutgoingTransitionButton) {
            this.addOutgoingTransitionButton.remove();
        }
        if(this.makeActiveButton) {
            this.makeActiveButton.remove();
        }
        const r = 10;
        const b1x = x + width/2 + r + 5;
        const b1y = y - height/2 - r/2;
        this.addOutgoingTransitionButton = new SVGShapeButton(this.svg, getArrowPath(b1x, b1y, r, 45, 5), b1x, b1y, 15, '#000', '#F00', 2);
        const b2x = b1x;
        const b2y = b1y + height * 2;
        this.makeActiveButton = new SVGShapeButton(this.svg, getAPath(b2x, b2y, r, r), b2x, b2y, 15, '#000', '#F00', 2);
        this.addOutgoingTransitionButton.addListener('click', () => {
            this.emit('addOutgoingTransition');
            this.hideControls();
        });
        this.makeActiveButton.addListener('click', () => {
            this.emit('makeActive');
            this.hideControls();
        });
        this.addOutgoingTransitionButton.addListener('mouseover', () => {
            this.clearRemoveControlsTimeout();
        })
        this.addOutgoingTransitionButton.addListener('mouseout', () => {
            this.setRemoveControlsTimeout();
        })
        this.makeActiveButton.addListener('mouseover', () => {
            this.clearRemoveControlsTimeout();
        })
        this.makeActiveButton.addListener('mouseout', () => {
            this.setRemoveControlsTimeout();
        })
    };

    private hideControls = (): void => {
        if(this.addOutgoingTransitionButton) {
            this.addOutgoingTransitionButton.remove();
            this.addOutgoingTransitionButton = null;
        }
        if(this.makeActiveButton) {
            this.makeActiveButton.remove();
            this.makeActiveButton = null;
        }
    };
    private onMouseout = (): void => {
        this.setRemoveControlsTimeout();
    }
    private updateStateDisplay(): void {
        const {foreground, background} = this.stateMachineDisplay.getStateColors(this.name);
        this.circle.stroke(foreground).fill(background);
    }
    public updateLayout(): void {
        const {x, y, width, height } = this.graph.node(this.name);

        this.circle.radius(width);
        if(this.stateMachineDisplay.options.animationDuration > 0) {
            this.circle.animate(this.stateMachineDisplay.options.animationDuration).center(x, y);
        } else {
            this.circle.center(x, y);
        }
        if(this.stateMachineDisplay.options.animationDuration > 0) {
            this.foreignObject.animate(this.stateMachineDisplay.options.animationDuration).x(x-width/2).y(y-height/2);
            this.foreignObject.animate(this.stateMachineDisplay.options.animationDuration).size(width, height);
        } else {
            this.foreignObject.x(x-width/2).y(y-height/2);
            this.foreignObject.size(width, height);
        }
    }
    public updateColors(delay: number = 0): void {
        const {foreground, background} = this.stateMachineDisplay.getStateColors(this.name);
        if(delay > 0) {
            setTimeout(() => this.circle.stroke(foreground).fill(background), delay);
        } else {
           this.circle.stroke(foreground).fill(background);
        }
    }
}
