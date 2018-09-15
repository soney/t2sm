"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StateMachineDisplay_1 = require("./StateMachineDisplay");
const ComponentDisplay_1 = require("./ComponentDisplay");
const ShapeButton_1 = require("./ShapeButton");
class SVGStateDisplay extends ComponentDisplay_1.SVGComponentDisplay {
    constructor(stateMachineDisplay, node, dimensions) {
        super(stateMachineDisplay, node, StateMachineDisplay_1.DISPLAY_TYPE.STATE, dimensions);
        this.onMouseout = () => {
            this.setRemoveControlsTimeout();
        };
        this.showControls = () => {
            const { x, y, width, height } = this.graph.node(this.name);
            if (this.deleteButton) {
                this.deleteButton.remove();
            }
            if (this.addOutgoingTransitionButton) {
                this.addOutgoingTransitionButton.remove();
            }
            if (this.makeActiveButton) {
                this.makeActiveButton.remove();
            }
            const r = 10;
            const b1x = x + width / 2 + r + 5;
            const b1y = y - height / 2 - r / 2;
            this.deleteButton = new ShapeButton_1.SVGShapeButton(this.svg, ShapeButton_1.getXPath(b1x, b1y, r, 45), b1x, b1y, 15, '#000', '#F00', 2);
            const b2x = b1x;
            const b2y = b1y + 2 * r + 1;
            this.addOutgoingTransitionButton = new ShapeButton_1.SVGShapeButton(this.svg, ShapeButton_1.getArrowPath(b2x, b2y, r, 45, 5), b2x, b2y, 15, '#000', '#F00', 2);
            const b3x = b2x;
            const b3y = b2y + 2 * r + 1;
            this.makeActiveButton = new ShapeButton_1.SVGShapeButton(this.svg, ShapeButton_1.getAPath(b3x, b3y, r, r), b3x, b3y, 15, '#000', '#F00', 2);
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
            });
            this.deleteButton.addListener('mouseout', () => {
                this.setRemoveControlsTimeout();
            });
            this.addOutgoingTransitionButton.addListener('mouseover', () => {
                this.clearRemoveControlsTimeout();
            });
            this.addOutgoingTransitionButton.addListener('mouseout', () => {
                this.setRemoveControlsTimeout();
            });
            this.makeActiveButton.addListener('mouseover', () => {
                this.clearRemoveControlsTimeout();
            });
            this.makeActiveButton.addListener('mouseout', () => {
                this.setRemoveControlsTimeout();
            });
        };
        this.hideControls = () => {
            if (this.deleteButton) {
                this.deleteButton.remove();
                this.deleteButton = null;
            }
            if (this.addOutgoingTransitionButton) {
                this.addOutgoingTransitionButton.remove();
                this.addOutgoingTransitionButton = null;
            }
            if (this.makeActiveButton) {
                this.makeActiveButton.remove();
                this.makeActiveButton = null;
            }
        };
        this.rect = this.group.rect(dimensions.width, dimensions.height);
        this.foreignObject.front();
        this.updateColors();
        if (this.stateMachineDisplay.options.showControls) {
            this.group.mouseover(this.showControls);
            this.group.mouseout(this.onMouseout);
        }
    }
    clearRemoveControlsTimeout() {
        clearTimeout(this.removeControlsTimeout);
    }
    setRemoveControlsTimeout() {
        this.clearRemoveControlsTimeout();
        this.removeControlsTimeout = setTimeout(this.hideControls, 1000);
    }
    updateStateDisplay() {
        const { foreground, background } = this.stateMachineDisplay.getStateColors(this.name);
        this.rect.stroke(foreground).fill(background);
    }
    updateLayout() {
        const { x, y, width, height } = this.graph.node(this.name);
        this.rect.size(width, height);
        if (this.stateMachineDisplay.options.animationDuration > 0) {
            this.rect.animate(this.stateMachineDisplay.options.animationDuration).center(x, y);
        }
        else {
            this.rect.center(x, y);
        }
        if (this.stateMachineDisplay.options.animationDuration > 0) {
            this.foreignObject.animate(this.stateMachineDisplay.options.animationDuration).x(x - width / 2).y(y - height / 2);
            this.foreignObject.animate(this.stateMachineDisplay.options.animationDuration).size(width, height);
        }
        else {
            this.foreignObject.x(x - width / 2).y(y - height / 2);
            this.foreignObject.size(width, height);
        }
    }
    updateColors(delay = 0) {
        const { foreground, background } = this.stateMachineDisplay.getStateColors(this.name);
        if (delay > 0) {
            setTimeout(() => this.rect.stroke(foreground).fill(background), delay);
        }
        else {
            this.rect.stroke(foreground).fill(background);
        }
    }
}
exports.SVGStateDisplay = SVGStateDisplay;
class SVGStartStateDisplay extends ComponentDisplay_1.SVGComponentDisplay {
    constructor(stateMachineDisplay, node, dimensions) {
        super(stateMachineDisplay, node, StateMachineDisplay_1.DISPLAY_TYPE.STATE, dimensions);
        this.showControls = () => {
            const { x, y, width, height } = this.graph.node(this.name);
            if (this.addOutgoingTransitionButton) {
                this.addOutgoingTransitionButton.remove();
            }
            if (this.makeActiveButton) {
                this.makeActiveButton.remove();
            }
            const r = 10;
            const b1x = x + width / 2 + r + 5;
            const b1y = y - height / 2 - r / 2;
            this.addOutgoingTransitionButton = new ShapeButton_1.SVGShapeButton(this.svg, ShapeButton_1.getArrowPath(b1x, b1y, r, 45, 5), b1x, b1y, 15, '#000', '#F00', 2);
            const b2x = b1x;
            const b2y = b1y + height * 2;
            this.makeActiveButton = new ShapeButton_1.SVGShapeButton(this.svg, ShapeButton_1.getAPath(b2x, b2y, r, r), b2x, b2y, 15, '#000', '#F00', 2);
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
            });
            this.addOutgoingTransitionButton.addListener('mouseout', () => {
                this.setRemoveControlsTimeout();
            });
            this.makeActiveButton.addListener('mouseover', () => {
                this.clearRemoveControlsTimeout();
            });
            this.makeActiveButton.addListener('mouseout', () => {
                this.setRemoveControlsTimeout();
            });
        };
        this.hideControls = () => {
            if (this.addOutgoingTransitionButton) {
                this.addOutgoingTransitionButton.remove();
                this.addOutgoingTransitionButton = null;
            }
            if (this.makeActiveButton) {
                this.makeActiveButton.remove();
                this.makeActiveButton = null;
            }
        };
        this.onMouseout = () => {
            this.setRemoveControlsTimeout();
        };
        this.circle = this.group.circle(dimensions.width);
        this.foreignObject.front();
        this.updateColors();
        if (this.stateMachineDisplay.options.showControls) {
            this.group.mouseover(this.showControls);
            this.group.mouseout(this.onMouseout);
        }
    }
    clearRemoveControlsTimeout() {
        clearTimeout(this.removeControlsTimeout);
    }
    setRemoveControlsTimeout() {
        this.clearRemoveControlsTimeout();
        this.removeControlsTimeout = setTimeout(this.hideControls, 1000);
    }
    updateStateDisplay() {
        const { foreground, background } = this.stateMachineDisplay.getStateColors(this.name);
        this.circle.stroke(foreground).fill(background);
    }
    updateLayout() {
        const { x, y, width, height } = this.graph.node(this.name);
        this.circle.radius(width);
        if (this.stateMachineDisplay.options.animationDuration > 0) {
            this.circle.animate(this.stateMachineDisplay.options.animationDuration).center(x, y);
        }
        else {
            this.circle.center(x, y);
        }
        if (this.stateMachineDisplay.options.animationDuration > 0) {
            this.foreignObject.animate(this.stateMachineDisplay.options.animationDuration).x(x - width / 2).y(y - height / 2);
            this.foreignObject.animate(this.stateMachineDisplay.options.animationDuration).size(width, height);
        }
        else {
            this.foreignObject.x(x - width / 2).y(y - height / 2);
            this.foreignObject.size(width, height);
        }
    }
    updateColors(delay = 0) {
        const { foreground, background } = this.stateMachineDisplay.getStateColors(this.name);
        if (delay > 0) {
            setTimeout(() => this.circle.stroke(foreground).fill(background), delay);
        }
        else {
            this.circle.stroke(foreground).fill(background);
        }
    }
}
exports.SVGStartStateDisplay = SVGStartStateDisplay;
//# sourceMappingURL=StateDisplay.js.map