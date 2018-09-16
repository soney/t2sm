"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const StateMachineDisplay_1 = require("./StateMachineDisplay");
class ForeignObjectDisplay extends events_1.EventEmitter {
    constructor(fsm, foreignObject, name, displayType, initialDimensions) {
        super();
        this.fsm = fsm;
        this.foreignObject = foreignObject;
        this.name = name;
        this.displayType = displayType;
        this.element = this.foreignObject.node;
        this.shownWidth = initialDimensions.width;
        this.shownHeight = initialDimensions.height;
        this.initialize();
    }
    initialize() {
        if (this.displayType === StateMachineDisplay_1.DISPLAY_TYPE.STATE) {
            this.payload = this.fsm.getStatePayload(this.name);
        }
        else {
            this.payload = this.fsm.getTransitionPayload(this.name);
        }
    }
    hide() {
        if (this.displayType === StateMachineDisplay_1.DISPLAY_TYPE.TRANSITION) {
            this.setDimensions(0, 0, false);
        }
        else {
            this.setDimensions(1, 1, false);
        }
        this.foreignObject.hide();
    }
    show() {
        this.foreignObject.show();
        this.setDimensions(this.shownWidth, this.shownHeight);
    }
    setPayload(payload) {
        this.payload = payload;
        this.emit('setPayload', payload);
    }
    ;
    getPayload() { return this.payload; }
    setDimensions(width, height, saveAsLast = true) {
        this.element.setAttribute('width', `${width}`);
        this.element.setAttribute('height', `${height}`);
        this.emit('setDimensions', { width, height });
        if (saveAsLast) {
            this.shownWidth = width;
            this.shownHeight = height;
        }
    }
    mouseEntered() {
        this.emit('mouseenter', { fod: this });
    }
    mouseLeft() {
        this.emit('mouseleft', { fod: this });
    }
    stateActive() {
    }
    stateInactive() {
    }
    transitionFired(event) {
        this.emit('transitionfired', { fod: this });
    }
    destroy() {
        this.emit('destroy', { fod: this });
        super.removeAllListeners();
    }
    getElement() { return this.element; }
    getName() { return this.name; }
    getDisplayType() { return this.displayType; }
    getFSM() { return this.fsm; }
    ;
}
exports.ForeignObjectDisplay = ForeignObjectDisplay;
;
exports.displayName = displayValue((fod) => {
    const name = fod.getName();
    if (name === fod.getFSM().getStartState()) {
        return '';
    }
    else {
        return name;
    }
});
function displayValue(func) {
    return function (fod) {
        const body = document.createElement('body');
        const content = document.createElement('div');
        const element = fod.getElement();
        element.appendChild(body);
        body.setAttribute('style', 'font-family: Helvetica, Arial, Sans-Serif;');
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
exports.displayValue = displayValue;
//# sourceMappingURL=ForeignObjectDisplay.js.map