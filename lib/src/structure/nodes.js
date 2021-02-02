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
exports.RootNode = exports.MultiLoopNode = exports.InternalLoopNode = exports.BulgeNode = exports.TerminalLoopNode = exports.CircularNode = exports.StemNode = exports.UnpairedNode = exports.Node = void 0;
/*
Declaration of a Node class, and inheriting node classes for the different type of tree nodes (sequence features)
*/
var Node = /** @class */ (function () {
    function Node(parent) {
        this.daughters = [];
        this.parent = parent;
    }
    Node.prototype.pushDaughters = function (daughter) {
        this.daughters.push(daughter);
    };
    return Node;
}());
exports.Node = Node;
var UnpairedNode = /** @class */ (function (_super) {
    __extends(UnpairedNode, _super);
    function UnpairedNode(parent, sequence) {
        var _this = _super.call(this, parent) || this;
        _this.type = 'UnpairedNode';
        _this.sequence = sequence;
        return _this;
    }
    return UnpairedNode;
}(Node));
exports.UnpairedNode = UnpairedNode;
var StemNode = /** @class */ (function (_super) {
    __extends(StemNode, _super);
    function StemNode(parent, pairs) {
        var _this = _super.call(this, parent) || this;
        _this.type = 'StemNode';
        _this.pairs = pairs;
        return _this;
    }
    return StemNode;
}(Node));
exports.StemNode = StemNode;
// Similar to how we draw, all circular nodes are pretty much the same structurally
var CircularNode = /** @class */ (function (_super) {
    __extends(CircularNode, _super);
    function CircularNode(parent) {
        return _super.call(this, parent) || this;
    }
    return CircularNode;
}(Node));
exports.CircularNode = CircularNode;
var TerminalLoopNode = /** @class */ (function (_super) {
    __extends(TerminalLoopNode, _super);
    function TerminalLoopNode(parent) {
        var _this = _super.call(this, parent) || this;
        /*
        TerminalLoop Nodes are the end of the line
        */
        _this.type = 'TerminalLoopNode';
        return _this;
    }
    return TerminalLoopNode;
}(Node));
exports.TerminalLoopNode = TerminalLoopNode;
var BulgeNode = /** @class */ (function (_super) {
    __extends(BulgeNode, _super);
    function BulgeNode(parent) {
        var _this = _super.call(this, parent) || this;
        /*
        
        */
        _this.type = 'BulgeNode';
        return _this;
    }
    return BulgeNode;
}(CircularNode));
exports.BulgeNode = BulgeNode;
var InternalLoopNode = /** @class */ (function (_super) {
    __extends(InternalLoopNode, _super);
    function InternalLoopNode(parent) {
        var _this = _super.call(this, parent) || this;
        /*
        Internal loop are like BulgeNodes but have "left" AND "right" sequence that lead to a single stem
        */
        _this.type = 'InternalLoopNode';
        return _this;
    }
    return InternalLoopNode;
}(Node));
exports.InternalLoopNode = InternalLoopNode;
var MultiLoopNode = /** @class */ (function (_super) {
    __extends(MultiLoopNode, _super);
    function MultiLoopNode(parent) {
        var _this = _super.call(this, parent) || this;
        /*
        Multi loops are complex internal loops that have both unpaired regions and stems
        */
        _this.type = 'MultiLoopNode';
        return _this;
    }
    return MultiLoopNode;
}(Node));
exports.MultiLoopNode = MultiLoopNode;
var RootNode = /** @class */ (function (_super) {
    __extends(RootNode, _super);
    function RootNode() {
        var _this = _super.call(this, null, null) || this;
        // This is a special node that just holds the top
        _this.type = 'RootNode';
        return _this;
    }
    return RootNode;
}(Node));
exports.RootNode = RootNode;
