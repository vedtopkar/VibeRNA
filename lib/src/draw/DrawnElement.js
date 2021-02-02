"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawnElement = void 0;
var DrawnElement = /** @class */ (function () {
    function DrawnElement(drawing, parent) {
        this.daughterElements = [];
        this.drawing = drawing;
        this.structure = this.drawing.structure;
        this.parentElement = parent;
        console.log(this);
    }
    return DrawnElement;
}());
exports.DrawnElement = DrawnElement;
