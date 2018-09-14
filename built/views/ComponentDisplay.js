"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const lodash_1 = require("lodash");
const ForeignObjectDisplay_1 = require("./ForeignObjectDisplay");
class SVGComponentDisplay extends events_1.EventEmitter {
    constructor(stateMachineDisplay, name, displayType, dimensions) {
        super();
        this.stateMachineDisplay = stateMachineDisplay;
        this.name = name;
        this.dimensions = dimensions;
        this.fsm = this.stateMachineDisplay.getFSM();
        this.svg = this.stateMachineDisplay.getSVG();
        this.graph = this.stateMachineDisplay.getGraph();
        this.group = this.svg.group();
        this.foreignObject = this.group.element('foreignObject');
        this.foElement = this.foreignObject.node;
        this.foDisplay = new ForeignObjectDisplay_1.ForeignObjectDisplay(this.fsm, this.foElement, name, displayType);
        this.foDisplay.on('setDimensions', (event) => {
            const e = this.graph.node(name);
            lodash_1.extend(e, { width: event.width, height: event.height });
            this.emit('dimensionsChanged');
        });
        this.addListeners();
        const getForeignObjectViewport = this.stateMachineDisplay.getFOVGetter();
        getForeignObjectViewport(this.foDisplay);
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