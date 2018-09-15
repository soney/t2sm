/// <reference types="node" />
import * as SVG from 'svg.js';
import { EventEmitter } from 'events';
export declare class SVGShapeButton extends EventEmitter {
    private svg;
    private pathString;
    private x;
    private y;
    private r;
    private color;
    private activeColor;
    private thickness;
    private group;
    private path;
    private circle;
    constructor(svg: SVG.Doc, pathString: string, x: number, y: number, r: number, color: string, activeColor: string, thickness: number);
    remove(): void;
}
export declare function getArrowPath(x: number, y: number, width: number, arrowAngle: number, arrowLength: number): string;
export declare function getXPath(x: number, y: number, len: number, angle: number): string;
export declare function getAPath(x: number, y: number, width: number, height: number): string;
export declare function getFPath(x: number, y: number, width: number, height: number): string;
