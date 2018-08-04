"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class ForeignObjectDisplay extends events_1.EventEmitter {
    constructor(element, name, displayType, payload) {
        super();
        this.element = element;
        this.name = name;
        this.displayType = displayType;
        this.payload = payload;
        this.initialize();
    }
    initialize() { }
    setPayload(payload) {
        this.payload = payload;
        this.emit('setPayload', payload);
    }
    ;
    setDimensions(width, height) {
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
}
exports.ForeignObjectDisplay = ForeignObjectDisplay;
;
function displayName(fod) {
    const body = document.createElement('body');
    const content = document.createElement('div');
    const element = fod.getElement();
    element.appendChild(body);
    body.setAttribute('style', 'font-family: Helvetica, Arial, Sans-Serif;');
    body.appendChild(content);
    content.textContent = fod.getName();
    content.setAttribute('style', 'text-align: center;');
    fod.on('mouseenter', () => {
        content.setAttribute('style', 'text-align: center; color: blue');
    });
    fod.on('mouseleft', () => {
        content.setAttribute('style', 'text-align: center;');
    });
}
exports.displayName = displayName;
//# sourceMappingURL=ForeignObjectDisplay.js.map