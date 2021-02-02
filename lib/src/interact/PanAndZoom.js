"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanAndZoom = void 0;
var paper_core_1 = require("paper/dist/paper-core");
// Logic for simple panning and zooming of the canvas
// adapted from this informative script: https://github.com/mberth/PanAndZoom/blob/master/app/scripts/pan_and_zoom.coffee
var PanAndZoom = /** @class */ (function () {
    function PanAndZoom() {
    }
    PanAndZoom.prototype.computeNewZoom = function (oldZoom, deltaY) {
        var factor = 1.05;
        if (deltaY < 0) {
            return oldZoom * factor;
        }
        else if (deltaY > 0) {
            return oldZoom / factor;
        }
        else {
            return oldZoom;
        }
    };
    PanAndZoom.prototype.changeZoom = function (oldZoom, deltaY, c, p) {
        var newZoom = this.computeNewZoom(oldZoom, deltaY);
        var beta = oldZoom / newZoom;
        var pc = p.subtract(c);
        var a = p.subtract(pc.multiply(beta)).subtract(c);
        console.log([newZoom, a]);
        return [newZoom, a];
    };
    PanAndZoom.prototype.changeCenter = function (oldCenter, deltaX, deltaY, factor) {
        var offset = new paper_core_1.paper.Point(deltaX, -deltaY);
        offset = offset.multiply(factor);
        return oldCenter.add(offset);
    };
    PanAndZoom.prototype.centerAndZoomAfterResize = function (view, drawing) {
        var unitedBounds = drawing.nucleotides.reduce(function (bbox, item) {
            return !bbox ? item.circle.bounds : bbox.unite(item.circle.bounds);
        }, null);
        // Set the zoom to encompass the whole drawing
        view.center = unitedBounds.center;
        var viewBounds = view.bounds;
        var heightRatio = viewBounds.height / unitedBounds.height;
        var widthRatio = viewBounds.width / unitedBounds.width;
        var newZoom = Math.min(heightRatio, widthRatio) * .9;
        view.zoom *= newZoom;
    };
    return PanAndZoom;
}());
exports.PanAndZoom = PanAndZoom;
