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
exports.CircularDrawElement = void 0;
var DrawnElement_1 = require("./DrawnElement");
var UnpairedElement_1 = require("./UnpairedElement");
/**
 * Circular Draw Element
 *
 * The math behind layout out bulges, internal loops, multi-loops, and terminal loops, are pretty much the same!
 * So, we can abstract that math up a level to this class, which those classes extend.
 * Could probably even do all four as a single class, but for customization reasons I am splitting them up for now.
 *
 */
var CircularDrawElement = /** @class */ (function (_super) {
    __extends(CircularDrawElement, _super);
    function CircularDrawElement(drawing, parentElement, node) {
        var _this = _super.call(this, drawing, parentElement) || this;
        // An array that logs the amount of angle consumed by each daughter element
        _this.daughterAngles = [];
        console.log(_this.parentElement);
        _this.node = node;
        _this.baseBp = _this.parentElement.basePairs.slice(-1)[0];
        _this.baseVector = _this.baseBp.drawVector;
        _this.baseStart = _this.baseBp.startPoint;
        console.log(_this);
        _this.computeRadius(); // compute 
        return _this;
    }
    // TODO: Tinker with this...
    CircularDrawElement.prototype.computeRadius = function () {
        var _this = this;
        this.minRadius = this.drawing.config.bpLength + 2 * this.drawing.config.ntRadius;
        this.defaultRadius = this.drawing.config.bpLength + 2 * this.drawing.config.ntRadius;
        // Iterate through the circle and tally up the circumference
        this.node.daughters.forEach(function (c, i) {
            switch (c.type) {
                case 'UnpairedNode': {
                    _this.minRadius += 2 * (c.sequence.length + 1) * _this.drawing.config.ntRadius;
                    _this.defaultRadius += (c.sequence.length + 1) * _this.drawing.config.ntSpacing;
                    // this.defaultRadius += (c.sequence.length + 1)*this.drawing.config.ntSpacing
                    break;
                }
                case 'StemNode': {
                    _this.minRadius += _this.drawing.config.bpLength;
                    _this.defaultRadius += _this.drawing.config.bpLength + 2 * _this.drawing.config.ntRadius;
                }
            }
        });
        // Divide our circumferences by 2pi to get our radii
        this.minRadius /= 2 * Math.PI;
        this.defaultRadius /= 2 * Math.PI;
    };
    CircularDrawElement.prototype.draw = function () {
        /*
        This is a bit tricky, math time!
        
        First, we create a vector v1 that starts at the 5' side of the last bp in the helix
        and goes to the 3' side of that last bp. The tangent to this vector points towards
        the loop centerpoint.

        Second, we figure out the angle theta between the above vector, and either
        of the two end nucleotides to the center (which is a vector of length radius).
        theta = arccos(|v1|/2r)

        Third, we find the centerpoint by rotating v1 by theta and scaling to length r
        (this is the vector v3)

        Fourth, we calculate the total angle used up by the two base-nucleotides.
        This is the same angle used up by all stems in the loop
        phi = 2arcsin(|v1|/2r)

        Fifth, we use calculate the amount of angle each terminal loop nt gets
        (360 - phi)/n

        Finally, starting at the centerpoint, draw each nucleotide rotationally

        */
        'use strict';
        var _this = this;
        // NOTE: In paperjs, vectors are still of type Point
        var r = this.defaultRadius;
        var bp = this.parentElement.basePairs.slice(-1)[0];
        var p1 = bp.nucleotides[0].center;
        var p2 = bp.nucleotides[1].center;
        var v1 = p2.subtract(p1);
        var theta = 180 * Math.acos(v1.length / (2 * r)) / Math.PI;
        var C = v1.clone();
        C.angle -= theta;
        C.length = r;
        C = C.add(p1);
        this.center = C;
        var v2 = p2.subtract(C);
        var v3 = p1.subtract(C);
        var phi = 180 - 2 * theta;
        this.phi = phi;
        // Count up the number of bp vs unpaired nts in the loop
        var bps = 1;
        var nts = 0;
        this.node.daughters.forEach(function (n, i) {
            switch (n.type) {
                case 'UnpairedNode': {
                    nts += n.sequence.length;
                    break;
                }
                case 'StemNode': {
                    bps += 1;
                    break;
                }
            }
        });
        // TODO explain this
        var nt_angle_increment = (360 - bps * phi) / (nts + bps);
        var bp_angle_increment = phi;
        var angle_cursor = v3.angle;
        var angle_cursor_vector = v3.clone();
        // Iterate through the nodes along the circle and draw
        this.node.daughters.forEach(function (n, i) {
            switch (n.type) {
                case 'UnpairedNode': {
                    var u = new UnpairedElement_1.UnpairedElement(_this.drawing, _this, n);
                    var chars = __spreadArrays(n.sequence);
                    var endAngle = angle_cursor + nt_angle_increment * (chars.length + 1);
                    u.drawCircular(C, r, angle_cursor, endAngle);
                    _this.daughterElements.push(u);
                    _this.daughterAngles.push([angle_cursor, endAngle]);
                    angle_cursor = endAngle;
                    break;
                }
                case 'StemNode': {
                    // If the stem is the first thing in the loop, increment the angle_cursor
                    // so that we don't start  drawing over the base bp
                    if (i == 0) {
                        angle_cursor += nt_angle_increment;
                    }
                    // When we get to the stem, we make a new helix and kick off the next recursive round
                    var startPoint = C.clone();
                    startPoint.y += r * Math.sin(Math.PI * angle_cursor / 180);
                    startPoint.x += r * Math.cos(Math.PI * angle_cursor / 180);
                    _this.daughterAngles.push([angle_cursor, angle_cursor + bp_angle_increment]);
                    angle_cursor += bp_angle_increment;
                    var endPoint = C.clone();
                    endPoint.y += r * Math.sin(Math.PI * angle_cursor / 180);
                    endPoint.x += r * Math.cos(Math.PI * angle_cursor / 180);
                    var startVector = endPoint.subtract(startPoint);
                    _this.daughterElements.push(_this.drawing.drawTreeRecursive(n, _this, startPoint, startVector));
                    break;
                }
            }
        });
    };
    // Rotate each daughter element to rotate this circle
    CircularDrawElement.prototype.rotateCircularly = function (angle, center) {
        this.center = this.center.rotate(angle, center);
        this.daughterElements.forEach(function (e, i) {
            e.rotateCircularly(angle, center);
        });
    };
    // After a daughter stem is dragged, rearrange the 5' and 3' elements (if unpaired)
    CircularDrawElement.prototype.rearrangeAfterDrag = function (stem, angle) {
        var stem_index = this.daughterElements.indexOf(stem);
        var stem_angle = (stem.stemDirectionVector.angle + 360) % 360;
        if (stem_index > 0) {
            // rearrange the stuff before
            var before_element = this.daughterElements[stem_index - 1];
            before_element.rearrangeCircular(before_element.angleStart, stem_angle - this.phi / 2);
        }
        if (stem_index < this.daughterElements.length - 1) {
            // rearrange the stuff after
            var after_element = this.daughterElements[stem_index + 1];
            after_element.rearrangeCircular(stem_angle + this.phi / 2, after_element.angleEnd % 360);
        }
    };
    return CircularDrawElement;
}(DrawnElement_1.DrawnElement));
exports.CircularDrawElement = CircularDrawElement;
