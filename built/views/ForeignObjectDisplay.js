"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const StateMachineDisplay_1 = require("./StateMachineDisplay");
class ForeignObjectDisplay extends events_1.EventEmitter {
    constructor(fsm, element, name, displayType) {
        super();
        this.fsm = fsm;
        this.element = element;
        this.name = name;
        this.displayType = displayType;
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
    setPayload(payload) {
        this.payload = payload;
        this.emit('setPayload', payload);
    }
    ;
    getPayload() { return this.payload; }
    setDimensions(width, height) {
        // console.log(width, height);
        this.element.setAttribute('width', `${width}`);
        this.element.setAttribute('height', `${height}`);
        this.emit('setDimensions', { width, height });
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
function displayName(fod) {
    return fod.getName();
}
exports.displayName = displayName;
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