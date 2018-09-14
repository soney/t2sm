"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class SVGShapeButton extends events_1.EventEmitter {
    constructor(svg, pathString, x, y, r, color, activeColor, thickness) {
        super();
        this.svg = svg;
        this.pathString = pathString;
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.activeColor = activeColor;
        this.thickness = thickness;
        this.group = this.svg.group();
        this.path = this.group.path(this.pathString).attr({
            stroke: color,
            'stroke-width': thickness,
            fill: 'none',
            cursor: 'pointer'
        });
        this.circle = this.group.circle(this.r).center(x, y).attr({
            stroke: color,
            'stroke-width': thickness,
            'fill-opacity': 0.1,
            fill: color,
            cursor: 'pointer'
        });
        this.group.mouseover(() => {
            this.circle.animate(100).attr({
                'fill-opacity': 0.2,
                fill: activeColor,
                stroke: activeColor
            });
            this.path.animate(100).attr({
                stroke: activeColor
            });
        });
        this.group.mouseout(() => {
            this.circle.animate(100).attr({
                'fill-opacity': 0.1,
                fill: color,
                stroke: color
            });
            this.path.animate(100).attr({
                stroke: color
            });
        });
        this.group.click(() => {
            this.emit('click');
            event.preventDefault();
        });
        this.group.mousedown(() => {
            this.emit('mousedown');
            event.preventDefault();
        });
        this.group.mouseup(() => {
            this.emit('mouseup');
            event.preventDefault();
        });
    }
    remove() {
        this.group.remove();
    }
}
exports.SVGShapeButton = SVGShapeButton;
function getArrowPath(x, y, width, arrowAngle, arrowLength) {
    const theta = (180 + arrowAngle) * Math.PI / 180;
    return `M ${x - width / 2} ${y}
        h ${width}
        l ${Math.cos(theta) * arrowLength} ${Math.sin(theta) * arrowLength}
        M ${x + width / 2} ${y}
        l ${Math.cos(theta) * arrowLength} ${Math.sin(-theta) * arrowLength}`;
}
exports.getArrowPath = getArrowPath;
function getXPath(x, y, len, angle) {
    const theta = (angle) * Math.PI / 180;
    return `M ${x - len / 2 * Math.cos(theta)} ${y - len / 2 * Math.sin(theta)}
    L ${x + len / 2 * Math.cos(theta)} ${y + len / 2 * Math.sin(theta)}
    M ${x + len / 2 * Math.cos(theta)} ${y - len / 2 * Math.sin(theta)}
    L ${x - len / 2 * Math.cos(theta)} ${y + len / 2 * Math.sin(theta)}`;
}
exports.getXPath = getXPath;
//# sourceMappingURL=ShapeButton.js.map