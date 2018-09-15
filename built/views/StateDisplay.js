"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StateMachineDisplay_1 = require("./StateMachineDisplay");
const ComponentDisplay_1 = require("./ComponentDisplay");
const ShapeButton_1 = require("./ShapeButton");
class SVGStateDisplay extends ComponentDisplay_1.SVGComponentDisplay {
    constructor(stateMachineDisplay, node, dimensions) {
        super(stateMachineDisplay, node, StateMachineDisplay_1.DISPLAY_TYPE.STATE, dimensions);
        this.dialogButtons = [{
                getShape: (x, y, r) => ShapeButton_1.getXPath(x, y, r, 45),
                callback: () => this.emit('delete'),
                selectBackgroundColor: '#f8d7da',
                selectColor: '#dc3545'
            }, {
                getShape: (x, y, r) => ShapeButton_1.getArrowPath(x, y, r, 45, r / 2),
                callback: () => this.emit('addOutgoingTransition'),
                selectBackgroundColor: this.stateMachineDisplay.colors.selectBackgroundColor,
                selectColor: this.stateMachineDisplay.colors.selectColor
            }, {
                getShape: (x, y, r) => ShapeButton_1.getAPath(x, y, 2 * r / 3, 4 * r / 5),
                callback: () => this.emit('makeActive'),
                selectBackgroundColor: this.stateMachineDisplay.colors.activeBackgroundColor,
                selectColor: this.stateMachineDisplay.colors.activeColor
            }
        ];
        this.rect = this.group.rect(dimensions.width, dimensions.height).center(this.svg.width() / 2, dimensions.height / 2);
        this.foreignObject.front();
        this.updateColors();
    }
    updateStateDisplay() {
        const { foreground, background } = this.stateMachineDisplay.getStateColors(this.name);
        this.rect.stroke(foreground).fill(background);
    }
    updateLayout() {
        super.updateLayout();
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
        if (this.updateColorTimeout) {
            clearTimeout(this.updateColorTimeout);
        }
        if (delay > 0) {
            this.updateColorTimeout = setTimeout(() => this.rect.stroke(foreground).fill(background), delay);
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
        this.dialogButtons = [{
                getShape: (x, y, r) => ShapeButton_1.getArrowPath(x, y, r, 45, r / 2),
                callback: () => this.emit('addOutgoingTransition'),
                selectBackgroundColor: this.stateMachineDisplay.colors.selectBackgroundColor,
                selectColor: this.stateMachineDisplay.colors.selectColor
            }, {
                getShape: (x, y, r) => ShapeButton_1.getAPath(x, y, 2 * r / 3, 4 * r / 5),
                callback: () => this.emit('makeActive'),
                selectBackgroundColor: this.stateMachineDisplay.colors.activeBackgroundColor,
                selectColor: this.stateMachineDisplay.colors.activeColor
            }
        ];
        this.circle = this.group.circle(dimensions.width);
        this.foreignObject.front();
        this.updateColors();
    }
    updateStateDisplay() {
        const { foreground, background } = this.stateMachineDisplay.getStateColors(this.name);
        this.circle.stroke(foreground).fill(background);
    }
    updateLayout() {
        super.updateLayout();
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
        if (this.updateColorTimeout) {
            clearTimeout(this.updateColorTimeout);
        }
        const { foreground, background } = this.stateMachineDisplay.getStateColors(this.name);
        if (delay > 0) {
            this.updateColorTimeout = setTimeout(() => this.circle.stroke(foreground).fill(background), delay);
        }
        else {
            this.circle.stroke(foreground).fill(background);
        }
    }
}
exports.SVGStartStateDisplay = SVGStartStateDisplay;
//# sourceMappingURL=StateDisplay.js.map