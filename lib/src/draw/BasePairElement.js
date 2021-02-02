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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePairElement = void 0;
var paper_core_1 = require("paper/dist/paper-core");
var DrawnElement_1 = require("./DrawnElement");
var Nucleotide_1 = require("./Nucleotide");
/**
 * Base pair element
 *
 * A base pair element is contains the vectors needed to define the base-pair
 * and draws and holds on to references to the two nucleotides and the intervening line
 */
var BasePairElement = /** @class */ (function (_super) {
    __extends(BasePairElement, _super);
    function BasePairElement(drawing, parentElement, letterPair, startPoint, drawVector) {
        var _this = _super.call(this, drawing, parentElement) || this;
        _this.nucleotides = []; // 5' and 3', in that order
        _this.letterPair = letterPair;
        _this.startPoint = startPoint.clone();
        _this.drawVector = drawVector.clone();
        _this.drawVector.length = _this.drawing.config.bpLength;
        _this.type = 'BasePairElement';
        return _this;
    }
    BasePairElement.prototype.draw = function () {
        var drawCursor = this.startPoint.clone();
        var l = new Nucleotide_1.Nucleotide(this.drawing, this, this.letterPair[0], drawCursor, this.drawVector.angle - 90);
        l.helixSide = 'left';
        l.draw();
        var p1 = drawCursor.clone();
        drawCursor = drawCursor.add(this.drawVector);
        var p2 = drawCursor.clone();
        var r = new Nucleotide_1.Nucleotide(this.drawing, this, this.letterPair[1], drawCursor, this.drawVector.angle + 90);
        l.helixSide = 'right';
        r.draw();
        this.hBond = new paper_core_1.Path.Line(p1, p2);
        this.hBond.strokeColor = 'black';
        this.hBond.strokeWidth = 5;
        this.hBond.sendToBack();
        this.nucleotides.push(l);
        this.nucleotides.push(r);
        this.drawing.nucleotides.push(l);
        this.drawing.nucleotides.push(r);
    };
    BasePairElement.prototype.rotateCircularly = function (angle, center) {
        this.nucleotides[0].rotate(angle, center);
        this.nucleotides[1].rotate(angle, center);
        this.hBond.rotate(angle, center);
    };
    return BasePairElement;
}(DrawnElement_1.DrawnElement));
exports.BasePairElement = BasePairElement;
