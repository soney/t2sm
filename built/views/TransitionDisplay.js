"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StateMachineDisplay_1 = require("./StateMachineDisplay");
const ComponentDisplay_1 = require("./ComponentDisplay");
const ShapeButton_1 = require("./ShapeButton");
class SVGTransitionDisplay extends ComponentDisplay_1.SVGComponentDisplay {
    constructor(stateMachineDisplay, edge, dimensions, creatingTransitionLine) {
        super(stateMachineDisplay, edge.name, StateMachineDisplay_1.DISPLAY_TYPE.TRANSITION, dimensions);
        this.onMouseout = () => {
            this.setRemoveControlsTimeout();
        };
        this.showControls = () => {
            const edge = this.getEdge();
            const { points, x, y, width, height } = this.graph.edge(edge);
            if (this.deleteButton) {
                this.deleteButton.remove();
            }
            if (this.fireButton) {
                this.fireButton.remove();
            }
            const r = 10;
            const b1x = x + width / 2 + r + 5;
            const b1y = y - height / 2 + r;
            this.deleteButton = new ShapeButton_1.SVGShapeButton(this.svg, ShapeButton_1.getXPath(b1x, b1y, r, 45), b1x, b1y, 15, '#000', '#F00', 2);
            const b2x = b1x;
            const b2y = b1y + 2 * r + 1;
            this.fireButton = new ShapeButton_1.SVGShapeButton(this.svg, ShapeButton_1.getFPath(b2x, b2y, 2 * r / 3, 4 * r / 5), b2x, b2y, 15, '#000', '#F00', 2);
            this.deleteButton.addListener('click', () => {
                this.emit('delete');
                this.hideControls();
            });
            this.deleteButton.addListener('mouseover', () => {
                this.clearRemoveControlsTimeout();
            });
            this.deleteButton.addListener('mouseout', () => {
                this.setRemoveControlsTimeout();
            });
            this.fireButton.addListener('click', () => {
                this.emit('fire');
                this.hideControls();
            });
            this.fireButton.addListener('mouseover', () => {
                this.clearRemoveControlsTimeout();
            });
            this.fireButton.addListener('mouseout', () => {
                this.setRemoveControlsTimeout();
            });
        };
        this.hideControls = () => {
            if (this.deleteButton) {
                this.deleteButton.remove();
                this.deleteButton = null;
            }
            if (this.fireButton) {
                this.fireButton.remove();
                this.fireButton = null;
            }
        };
        if (creatingTransitionLine) {
            this.forEachInGroup(creatingTransitionLine, 'path', (p) => {
                creatingTransitionLine.removeElement(p);
                this.group.add(p);
                p.stroke({ color: this.stateMachineDisplay.colors.transitionLineColor }).removeClass('nopointer');
                this.path = p;
            });
        }
        else {
            this.path = this.group.path('').stroke({ color: this.stateMachineDisplay.colors.transitionLineColor, width: this.stateMachineDisplay.options.transitionThickness }).fill('none').removeClass('nopointer');
        }
        this.rect = this.group.rect(this.dimensions.width, this.dimensions.height).fill(this.stateMachineDisplay.colors.transitionBackgroundColor).stroke(this.stateMachineDisplay.colors.transitionLineColor);
        this.foreignObjectElement = this.group.element('foreignObject');
        // const foreignObjectDisplay = new ForeignObjectDisplay(this.fsm, this.foreignObjectElement.node as any, this.name, DISPLAY_TYPE.TRANSITION);
        // console.log(foreignObjectDisplay);
        // foreignObjectDisplay.on('setDimensions', (event: SetDimensionsEvent) => {
        //     console.log(event);
        //     const edge = this.getEdge();
        //     const e = this.graph.edge(edge);
        //     extend(e, {width: event.width, height: event.height});
        // });
        this.foreignObject.front();
        // this.updateLayout();
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
    animateFiring() {
        const segments = 10;
        const overallDuration = this.stateMachineDisplay.options.transitionAnimationDuration;
        this.forEachInGroup(this.group, 'path', (p) => {
            const len = p.length();
            let point = p.pointAt(0);
            const dot = this.svg.path(`M ${point.x} ${point.y} l 0 0`).stroke({ color: this.stateMachineDisplay.colors.activeColor, width: this.stateMachineDisplay.options.transitionThickness * 2 });
            for (let i = 0; i < segments; i++) {
                const startIndex = i * (len / segments);
                const endIndex = (i + 1) * (len / segments);
                const startPoint = p.pointAt(startIndex);
                const endPoint = p.pointAt(endIndex);
                setTimeout(() => {
                    dot.animate(overallDuration / segments).plot(`M ${startPoint.x} ${startPoint.y} L ${endPoint.x} ${endPoint.y}`);
                }, i * overallDuration / segments);
            }
            setTimeout(() => {
                dot.remove();
            }, overallDuration);
        });
        setTimeout(() => { this.rect.stroke({ color: this.stateMachineDisplay.colors.activeColor }).fill(this.stateMachineDisplay.colors.activeBackgroundColor); }, overallDuration / 3);
        setTimeout(() => { this.updateColors(); }, 2 * overallDuration / 3);
        this.rect.front();
        this.foreignObject.front();
    }
    animateIneligibleFiring() {
        const cx = this.rect.cx();
        const cy = this.rect.cy();
        const width = this.rect.width();
        const height = this.rect.height();
        this.rect.animate(25).size(width + 10, height + 10).center(cx, cy);
        this.rect.animate(75).size(width, height).center(cx, cy);
        setTimeout(() => this.updateLayout(), 110);
    }
    updateColors() {
        const { foreground, background } = this.stateMachineDisplay.getTransitionColors(this.name);
        this.path.stroke(foreground);
        this.rect.stroke(foreground).fill(background);
    }
    getGroup() { return this.group; }
    getPath() { return this.path; }
    updateLayout() {
        const edge = this.getEdge();
        const { points, x, y, width, height } = this.graph.edge(edge);
        const pointStrings = points.map(pnt => `${pnt.x} ${pnt.y}`);
        let pathString = `M ${pointStrings[0]}`;
        for (let i = 1; i < pointStrings.length - 1; i += 2) {
            pathString += ` Q ${pointStrings[i]} ${pointStrings[i + 1]}`;
        }
        const sndLstPnt = points[points.length - 2];
        const lastPnt = points[points.length - 1];
        pathString += SVGTransitionDisplay.getArrowPath(sndLstPnt, lastPnt);
        if (this.stateMachineDisplay.options.animationDuration > 0) {
            this.path.animate(this.stateMachineDisplay.options.animationDuration).plot(pathString);
        }
        else {
            this.path.plot(pathString);
        }
        this.rect.width(width).height(height);
        if (this.stateMachineDisplay.options.animationDuration > 0) {
            this.rect.animate(this.stateMachineDisplay.options.animationDuration).center(x, y);
        }
        else {
            this.rect.center(x, y);
        }
        this.rect.front();
        if (this.stateMachineDisplay.options.animationDuration > 0) {
            this.foreignObject.animate(this.stateMachineDisplay.options.animationDuration).x(x - width / 2).y(y - height / 2);
            this.foreignObject.animate(this.stateMachineDisplay.options.animationDuration).size(width, height);
        }
        else {
            this.foreignObject.x(x - width / 2).y(y - height / 2);
            this.foreignObject.size(width, height);
        }
        this.foreignObject.front();
    }
    static getArrowPath(sndLstPnt, lastPnt) {
        const theta = Math.atan2(sndLstPnt.y - lastPnt.y, sndLstPnt.x - lastPnt.x);
        const offset = 20 * Math.PI / 180;
        const s = 10;
        const pathString = ` m ${Math.cos(theta + offset) * s} ${Math.sin(theta + offset) * s}` +
            ` L ${lastPnt.x} ${lastPnt.y}` +
            ` l ${Math.cos(theta - offset) * s} ${Math.sin(theta - offset) * s}`;
        return pathString;
    }
}
exports.SVGTransitionDisplay = SVGTransitionDisplay;
//# sourceMappingURL=TransitionDisplay.js.map