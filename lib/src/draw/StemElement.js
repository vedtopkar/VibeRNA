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
exports.StemElement = void 0;
var BasePairElement_1 = require("./BasePairElement");
var DrawnElement_1 = require("./DrawnElement");
/**
 * Stem element
 *
 * This is an element that draws a dsRNA stem.
 *
 * Importantly, it has properties startVector and endVector, which point from the 5' to the 3' nt of the botton and top bp.
 * The drawDirection is a vector that points from the startVector to the endDirection.
 */
var StemElement = /** @class */ (function (_super) {
    __extends(StemElement, _super);
    /**
     * Creates an instance of stem element.
     * We require the startPoint, baseVector, and derive the other two vectors from that.
     */
    function StemElement(drawing, parentElement, node, startPoint, startVector) {
        var _this = _super.call(this, drawing, parentElement) || this;
        _this.basePairs = [];
        _this.nucleotides = [];
        _this.drawnElements = [];
        _this.node = node;
        _this.startPoint = startPoint.clone();
        _this.startVector = startVector.clone();
        // Make a unit vector that points in the direction  of the stem to be drawn
        _this.stemDirectionVector = _this.startVector.clone().rotate(-90).normalize();
        _this.type = 'StemElement';
        return _this;
    }
    StemElement.prototype.transformStem = function (angle) {
        if (this.node.parent.type !== 'RootNode') {
            this.parentElement.rotateStem(this, angle);
        }
    };
    /**
     * Draw stem element
     *
     * Create and draw each individual base pair element of the stem
     */
    StemElement.prototype.draw = function () {
        var drawCursor = this.startPoint.clone();
        console.log(this);
        var that = this;
        this.node.pairs.forEach(function (p, i) {
            var bp = new BasePairElement_1.BasePairElement(that.drawing, that, p, drawCursor, that.startVector);
            bp.draw();
            that.drawing.basePairs.push(bp);
            that.basePairs.push(bp);
            that.drawnElements.push(bp.nucleotides[0].circle);
            that.drawnElements.push(bp.nucleotides[1].circle);
            that.drawnElements.push(bp.nucleotides[0].text);
            that.drawnElements.push(bp.nucleotides[1].text);
            var scaledDirectionVector = that.stemDirectionVector.clone();
            scaledDirectionVector.length = that.drawing.config.ntSpacing;
            drawCursor = drawCursor.add(scaledDirectionVector);
        });
        return drawCursor;
    };
    // When a root stem is dragged, flip the stem over the horizontal
    StemElement.prototype.flipStem = function (startPoint) {
        // Flip every 
        this.basePairs.forEach(function (bp, i) {
            bp.flipOverBaseline(this.startVector);
        });
    };
    // When a stem is dragged, rotate it and kick off the upstream and downstream cascade
    StemElement.prototype.rotateStem = function (angle, center) {
        // Rotate the stem and the stem's daughters
        this.rotateCircularly(angle, center);
        if (this.parentElement !== null) {
            // Adjust the stem base if applicable
            this.parentElement.rearrangeAfterDrag(this, angle);
        }
    };
    StemElement.prototype.rotateCircularly = function (angle, center) {
        // Rotate each bp individually
        this.basePairs.forEach(function (bp, i) {
            bp.rotateCircularly(angle, center);
        });
        // Update the stem's angle
        this.stemDirectionVector.angle += angle;
        // Rotate daughters if applicable
        if (this.daughterElements.length > 0) {
            this.daughterElements[0].rotateCircularly(angle, center);
        }
    };
    return StemElement;
}(DrawnElement_1.DrawnElement));
exports.StemElement = StemElement;
