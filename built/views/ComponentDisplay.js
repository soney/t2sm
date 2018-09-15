"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const lodash_1 = require("lodash");
const ForeignObjectDisplay_1 = require("./ForeignObjectDisplay");
const StateMachineDisplay_1 = require("./StateMachineDisplay");
const ShapeButton_1 = require("./ShapeButton");
;
class SVGComponentDisplay extends events_1.EventEmitter {
    constructor(stateMachineDisplay, name, displayType, dimensions) {
        super();
        this.stateMachineDisplay = stateMachineDisplay;
        this.name = name;
        this.displayType = displayType;
        this.dimensions = dimensions;
        this.shapeButtons = [];
        this.showControls = () => {
            const { stateBackgroundColor, stateTextColor, selectColor, selectBackgroundColor } = this.stateMachineDisplay.colors;
            this.hideControls();
            const { x, y, width, height } = this.getDimensions();
            const r = 12;
            const bx = x + width / 2 + r + 5;
            let by = y - height / 2 - r / 2;
            this.dialogButtons.forEach((db, i) => {
                const bg = db.backgroundColor || stateBackgroundColor;
                const fg = db.color || stateTextColor;
                const abg = db.selectBackgroundColor || selectBackgroundColor;
                const afg = db.selectColor || selectColor;
                const shapeButton = new ShapeButton_1.SVGShapeButton(this.svg, db.getShape(bx, by, r - 2), bx, by, r + 5, fg, bg, afg, abg, 1.5);
                shapeButton.addListener('mouseover', () => {
                    this.clearRemoveControlsTimeout();
                });
                shapeButton.addListener('mouseout', () => {
                    this.setRemoveControlsTimeout();
                });
                shapeButton.addListener('click', () => {
                    db.callback();
                    this.hideControls();
                });
                this.shapeButtons[i] = shapeButton;
                by = by + 2 * r + 1;
            });
        };
        this.hideControls = () => {
            this.shapeButtons.forEach((shapeButton) => {
                shapeButton.remove();
            });
            this.shapeButtons.splice(0, this.shapeButtons.length);
        };
        this.fsm = this.stateMachineDisplay.getFSM();
        this.svg = this.stateMachineDisplay.getSVG();
        this.graph = this.stateMachineDisplay.getGraph();
        this.group = this.svg.group();
        this.foreignObject = this.group.element('foreignObject').center(this.svg.width() / 2, dimensions.height / 2);
        this.foElement = this.foreignObject.node;
        this.foDisplay = new ForeignObjectDisplay_1.ForeignObjectDisplay(this.fsm, this.foElement, name, displayType);
        this.foDisplay.on('setDimensions', (event) => {
            const e = this.getDimensions();
            lodash_1.extend(e, { width: event.width, height: event.height });
            this.emit('dimensionsChanged');
        });
        this.addListeners();
        const getForeignObjectViewport = this.stateMachineDisplay.getFOVGetter();
        getForeignObjectViewport(this.foDisplay);
        if (this.stateMachineDisplay.options.showControls) {
            this.group.mouseover(() => {
                this.clearRemoveControlsTimeout();
                this.showControls();
            });
            this.group.mouseout(() => {
                this.setRemoveControlsTimeout();
            });
        }
    }
    getDimensions() {
        let entity;
        let e;
        if (this.displayType === StateMachineDisplay_1.DISPLAY_TYPE.TRANSITION) {
            entity = this.getEdge();
            e = this.graph.edge(entity);
        }
        else {
            entity = this.name;
            e = this.graph.node(entity);
        }
        return e;
    }
    getEdge() {
        let edge;
        lodash_1.each(this.graph.edges(), (e) => {
            if (e.name === this.name) {
                edge = e;
            }
        });
        return edge;
    }
    clearRemoveControlsTimeout() {
        clearTimeout(this.removeControlsTimeout);
    }
    setRemoveControlsTimeout() {
        this.clearRemoveControlsTimeout();
        this.removeControlsTimeout = setTimeout(this.hideControls, 500);
    }
    remove() {
        this.group.remove();
    }
    getForeignObjectDisplay() {
        return this.foDisplay;
    }
    ;
    addListeners() {
        this.group.each((i, children) => {
            children.forEach((child) => {
                child.on('contextmenu', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                });
            });
        });
        this.group.mousedown((e) => this.emit('mousedown', e));
        this.group.mouseout((e) => this.emit('mouseout', e));
        this.group.mouseover((e) => this.emit('mouseover', e));
        this.group.mouseup((e) => this.emit('mouseup', e));
    }
    updateLayout() {
        this.clearRemoveControlsTimeout();
        this.hideControls();
    }
    forEachInGroup(group, selector, fn) {
        group.select(selector).each((i, members) => {
            members.forEach((el) => {
                fn(el);
            });
        });
    }
}
exports.SVGComponentDisplay = SVGComponentDisplay;
//# sourceMappingURL=ComponentDisplay.js.map