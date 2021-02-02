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
exports.TerminalLoopElement = void 0;
var CircularDrawElement_1 = require("./CircularDrawElement");
var TerminalLoopElement = /** @class */ (function (_super) {
    __extends(TerminalLoopElement, _super);
    function TerminalLoopElement(drawing, parentElement, node) {
        var _this = _super.call(this, drawing, parentElement, node) || this;
        _this.node = node;
        _this.sequence = _this.node.daughters[0].sequence;
        _this.radius = _this.minimumRadius();
        return _this;
    }
    /**
     * We have a defined "radius" for terminal loops, but that may be too small for larger loops!
     *
     * Here we establish a lower bound for the radius, and use it if the config radius is too small.
     */
    TerminalLoopElement.prototype.minimumRadius = function () {
        var n_nt = this.sequence.length;
        var min_circumference = 2 * (2 + n_nt) * (this.drawing.config.ntRadius) + this.drawing.config.bpLength;
        var min_radius = min_circumference / (2 * Math.PI);
        return min_radius > this.drawing.config.terminalLoopRadius ? min_radius : this.drawing.config.terminalLoopRadius;
    };
    return TerminalLoopElement;
}(CircularDrawElement_1.CircularDrawElement));
exports.TerminalLoopElement = TerminalLoopElement;
