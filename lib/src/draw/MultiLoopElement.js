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
exports.MultiLoopElement = void 0;
var CircularDrawElement_1 = require("./CircularDrawElement");
var MultiLoopElement = /** @class */ (function (_super) {
    __extends(MultiLoopElement, _super);
    function MultiLoopElement(drawing, parentElement, node) {
        return _super.call(this, drawing, parentElement, node) || this;
    }
    return MultiLoopElement;
}(CircularDrawElement_1.CircularDrawElement));
exports.MultiLoopElement = MultiLoopElement;
