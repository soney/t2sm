"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class SVGShapeButton extends events_1.EventEmitter {
    constructor(svg, pathString, x, y, r, color, backgroundColor, activeColor, activeBackgroundColor, thickness) {
        super();
        this.svg = svg;
        this.pathString = pathString;
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.backgroundColor = backgroundColor;
        this.activeColor = activeColor;
        this.activeBackgroundColor = activeBackgroundColor;
        this.thickness = thickness;
        this.group = this.svg.group();
        this.circle = this.group.circle(this.r).center(x, y).attr({
            stroke: color,
            'stroke-width': thickness,
            fill: backgroundColor,
            cursor: 'pointer'
        });
        this.path = this.group.path(this.pathString).attr({
            stroke: color,
            'stroke-width': thickness,
            fill: 'none',
            cursor: 'pointer'
        }).style({
            'pointer-events': 'none'
        });
        this.group.mouseover(() => {
            this.emit('mouseover');
            this.circle.animate(100).attr({
                fill: activeBackgroundColor,
                stroke: activeColor
            });
            this.path.animate(100).attr({
                stroke: activeColor
            });
        });
        this.group.mouseout(() => {
            this.emit('mouseout');
            this.circle.animate(100).attr({
                fill: backgroundColor,
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
function getAPath(x, y, width, height) {
    return `M ${x - width / 2} ${y + height / 2}
    L ${x} ${y - height / 2}
    L ${x + width / 2} ${y + height / 2}
    M ${x - width / 4} ${y}
    h ${width / 2}
    `;
}
exports.getAPath = getAPath;
function getFPath(x, y, width, height) {
    return `M ${x + width / 2} ${y - height / 2}
    h ${-width}
    v ${height}
    M ${x + width / 2} ${y}
    h ${-width}
    `;
}
exports.getFPath = getFPath;
//# sourceMappingURL=ShapeButton.js.map