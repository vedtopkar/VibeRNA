"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnpairedElement = void 0;
var DrawnElement_1 = require("./DrawnElement");
var Nucleotide_1 = require("./Nucleotide");
/**
 * Unlike an UnpairedNode, which can point to unpaired root or loop regions,
 * an UnpairedElement ONLY refers to a root-level unpaired region.
 */
var UnpairedElement = /** @class */ (function (_super) {
    __extends(UnpairedElement, _super);
    function UnpairedElement(drawing, parentElement, node) {
        var _this = _super.call(this, drawing, parentElement) || this;
        _this.drawnNucleotides = [];
        _this.node = node;
        _this.type = 'UnpairedElement';
        return _this;
    }
    UnpairedElement.prototype.draw = function (startPoint) {
        var chars = __spreadArrays(this.node.sequence);
        var drawCursor = startPoint.clone();
        chars.forEach(function (c, i) {
            var n = new Nucleotide_1.Nucleotide(this.drawing, this, c, drawCursor, 0);
            n.draw();
            this.drawing.nucleotides.push(n);
            drawCursor.x += this.drawing.config.ntSpacing;
        });
        this.endPoint = drawCursor.clone();
        return this.endPoint.clone();
    };
    /**
     * Draws circularly
     *
     * When the unpaired element is the daughter of a ciruclar element, we draw it circularly
     *
     * @param center
     * @param radius
     * @param angleStart
     * @param angleEnd
     * @returns circular
     */
    UnpairedElement.prototype.drawCircular = function (centerPoint, radius, angleStart, angleEnd) {
        var _this = this;
        this.radius = radius;
        this.angleStart = angleStart;
        this.angleEnd = angleEnd;
        this.centerPoint = centerPoint;
        var chars = __spreadArrays(this.node.sequence);
        var angleCursor = angleStart;
        var ntAngleIncrement = (angleEnd - angleStart) / (chars.length + 1);
        angleCursor += ntAngleIncrement;
        chars.forEach(function (c, i) {
            var center = _this.centerPoint.clone();
            center.y += radius * Math.sin(Math.PI * angleCursor / 180);
            center.x += radius * Math.cos(Math.PI * angleCursor / 180);
            var nt = new Nucleotide_1.Nucleotide(_this.drawing, _this, c, center, angleCursor + 90);
            nt.draw();
            _this.drawing.nucleotides.push(nt);
            _this.drawnNucleotides.push(nt);
            angleCursor += ntAngleIncrement;
        });
        return angleCursor;
    };
    UnpairedElement.prototype.rotateCircularly = function (angle, center) {
        this.centerPoint = this.centerPoint.rotate(angle, center);
        this.drawnNucleotides.forEach(function (n, i) {
            n.rotate(angle, center);
        });
        this.angleStart += angle;
        this.angleEnd += angle;
    };
    UnpairedElement.prototype.normalizeAngle = function (angle) {
        if (angle > 360) {
            return angle % 360;
        }
    };
    /**
     * Transforms circularly
     *
     * When our unpairedlement is part of a circular element, and when the circular element is shifted
     * (e.g. a stem is dragged), we move the nucleotides to space equally along some angle of the circle.
     */
    UnpairedElement.prototype.rearrangeCircular = function (angleStart, angleEnd) {
        var _this = this;
        this.angleStart = angleStart;
        this.angleEnd = angleEnd;
        var angleCursor = angleStart;
        if (angleEnd < angleStart) {
            var ntAngleIncrement = (360 + angleEnd - angleStart) / (this.drawnNucleotides.length + 1);
        }
        else {
            var ntAngleIncrement = (angleEnd - angleStart) / (this.drawnNucleotides.length + 1);
        }
        angleCursor += ntAngleIncrement;
        // console.log('angles', angleStart, angleEnd)
        this.drawnNucleotides.forEach(function (nt, i) {
            var center = _this.centerPoint.clone();
            center.y += _this.radius * Math.sin(Math.PI * angleCursor / 180);
            center.x += _this.radius * Math.cos(Math.PI * angleCursor / 180);
            nt.move(center);
            angleCursor += ntAngleIncrement;
        });
        return angleCursor;
    };
    return UnpairedElement;
}(DrawnElement_1.DrawnElement));
exports.UnpairedElement = UnpairedElement;
