"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nucleotide = void 0;
var paper_core_1 = require("paper/dist/paper-core");
var Nucleotide = /** @class */ (function () {
    function Nucleotide(drawing, parentElement, letter, center, drawDirection) {
        this.numbered = false;
        this.drawing = drawing;
        this.parentElement = parentElement;
        this.letter = letter;
        this.drawDirection = drawDirection;
        this.center = center.clone();
    }
    Nucleotide.prototype.draw = function () {
        var circle = new paper_core_1.Path.Circle(this.center, this.drawing.config.ntRadius);
        var color = this.drawing.config.ntColors[this.drawing.config.ntNucleotides.indexOf(this.letter)];
        circle.fillColor = color;
        circle.strokeColor = this.drawing.config.ntStrokeColor;
        circle.strokeWidth = this.drawing.config.ntStrokeWidth;
        var offset_center = this.center.clone();
        offset_center.y += 4;
        var text = new paper_core_1.PointText(offset_center);
        text.content = this.letter;
        text.justification = 'center';
        this.circle = circle;
        this.text = text;
        var dragStartPoint;
        var dragAngle;
        this.group = new paper_core_1.Group([this.circle, this.text]);
        var that = this;
        this.group.onMouseEnter = function (event) {
            that.circle.strokeWidth += 3;
        };
        this.group.onMouseLeave = function (event) {
            that.circle.strokeWidth -= 3;
        };
        this.group.onMouseDown = function (event) {
            dragStartPoint = event.point.clone();
        };
        this.group.onMouseUp = function (event) {
        };
        this.group.onMouseDrag = function (event) {
            dragAngle = event.point.subtract(that.parentElement.parentElement.parentElement.center).angle - dragStartPoint.subtract(that.parentElement.parentElement.parentElement.center).angle;
            if (that.parentElement.type == 'BasePairElement') {
                console.log(dragStartPoint, dragAngle);
                var nearestMultiple = Math.round(dragAngle / 45) * 45;
                // Drag the stem if it's not at root
                if (that.parentElement !== null) {
                    that.parentElement.parentElement.rotateStem(dragAngle, that.parentElement.parentElement.parentElement.center);
                    dragStartPoint = event.point.clone();
                }
                else {
                    // If we're dragging a root stem, then do a flip!
                    that.flipStem(that.startPoint);
                }
            }
        };
    };
    Nucleotide.prototype.drawNumbering = function (number) {
        // First, we get the overal drawing direction
        // we willd draw the numbering along its tangent
        var drawCursor = new paper_core_1.Point(this.center.x, this.center.y);
        // if (this.helixSide == 'right' || this.helixSide === undefined) {
        //     console.log(number)
        //     let numberingVector = new Point({length: this.drawing.config.ntRadius*2, angle: this.drawDirection - 90})
        // } else {
        //     let numberingVector = new Point({length: this.drawing.config.ntRadius*2, angle: this.drawDirection + 90})
        // }
        var numberingVector = new paper_core_1.Point({ length: this.drawing.config.ntRadius * 2, angle: this.drawDirection - 90 });
        var numberCenter = drawCursor.add(numberingVector);
        console.log('vecang', numberCenter);
        /*         const numberText = new PointText(numberCenter)
                numberText.content = number + 1
                numberCenter.x += 5
        
                let line = new Path.Line(numberCenter, this.center)
                line.strokeColor = 'black'
                console.log(numberCenter, this.center) */
    };
    // Simply move the nucleotide and update the center
    Nucleotide.prototype.move = function (center) {
        this.center = center;
        this.group.position = this.center;
    };
    Nucleotide.prototype.rotate = function (angle, center) {
        this.group.rotate(angle, center);
        this.text.rotate(-1 * angle);
        this.center = this.group.center;
    };
    return Nucleotide;
}());
exports.Nucleotide = Nucleotide;
