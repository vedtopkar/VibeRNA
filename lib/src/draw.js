"use strict";
/**
 * Draw.ts
 *
 * Main file that initiates drawing
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Drawing = void 0;
var UnpairedElement_1 = require("./draw/UnpairedElement");
var StemElement_1 = require("./draw/StemElement");
var TerminalLoopElement_1 = require("./draw/TerminalLoopElement");
var MultiLoopElement_1 = require("./draw/MultiLoopElement");
var DrawConfig_1 = require("./draw/DrawConfig");
var BulgeElement_1 = require("./draw/BulgeElement");
/**
 * Drawing
 *
 * A class that encapsulates all elements and configuration of our RNA drawing
 */
var Drawing = /** @class */ (function () {
    function Drawing(structure, view) {
        // The drawtree is a nested 
        this.rootElements = [];
        // Explicit references to each type of drawn element for easy post-hoc updating
        this.unpaireds = [];
        this.stems = [];
        this.terminalLoops = [];
        this.internalLoops = [];
        this.multiLoops = [];
        this.basePairs = [];
        this.nucleotides = [];
        // Load in the default config
        this.config = DrawConfig_1.DefaultConfig;
        /**
         * Draw cursor of drawing
         *
         * This object is a bit tricky... be careful!
         *
         * The drawing class has this attribute that initializes to the origin.
         * As we dispatch unpaired or stem nodes from the root, we update the
         * drawCursor.
         *
         * When we spawn stems to start recursive drawing, we pass in a CLONE
         * of this object so that it can be passed around inside that recursive
         * part of the tree without messing with the root-level nodes.
         */
        this.drawCursor = this.config.origin.clone();
        this.structure = structure;
        this.view = view;
        // Shift over so that the first element is drawn at the origin
        this.drawCursor.x -= this.config.ntSpacing;
        // Generate an initial drawVector that points rightward
        this.drawVector = this.config.origin.subtract(this.drawCursor);
    }
    Drawing.prototype.drawTreeDispatch = function () {
        for (var _i = 0, _a = this.structure.structureTree.root.daughters; _i < _a.length; _i++) {
            var node = _a[_i];
            switch (node.type) {
                case 'UnpairedNode': {
                    var u = new UnpairedElement_1.UnpairedElement(this, null, node);
                    // We expect unpaired nodes to return a drawCursor that sits at the center of the last nt
                    this.drawCursor = u.draw(this.drawCursor);
                    this.rootElements.push(u);
                    break;
                }
                case 'StemNode': {
                    var s = this.drawTreeRecursive(node, null, this.drawCursor.clone(), this.drawVector.clone());
                    // The next dispatched element may be a unpaired node or a stem
                    // shift the drawCursor over to where the bottom right stem nt should be
                    this.drawCursor.x += (this.config.ntSpacing + this.config.bpLength);
                    this.rootElements.push(s);
                    break;
                }
            }
        }
        this.nucleotides.forEach(function (n, i) {
            if ((i + 1) % 10 == 0 || i == 0) {
                console.log('nt', n.drawDirection);
                n.drawNumbering(i);
            }
        });
    };
    Drawing.prototype.drawTreeRecursive = function (node, parentElement, drawCursor, drawVector) {
        switch (node.type) {
            case 'StemNode': {
                var s = new StemElement_1.StemElement(this, parentElement, node, drawCursor.clone(), drawVector.clone());
                drawCursor = s.draw();
                if (node.daughters.length > 0) {
                    s.daughterElements.push(this.drawTreeRecursive(node.daughters[0], s, drawCursor, drawVector));
                }
                return s;
                break;
            }
            case 'BulgeNode': {
                var b = new BulgeElement_1.BulgeElement(this, parentElement, node);
                b.draw();
                return b;
                break;
            }
            case 'TerminalLoopNode': {
                var t = new TerminalLoopElement_1.TerminalLoopElement(this, parentElement, node);
                t.draw();
                this.terminalLoops.push(t);
                // End of the line! No more elements to draw in this branch.
                return t;
                break;
            }
            case 'MultiLoopNode': {
                var m = new MultiLoopElement_1.MultiLoopElement(this, parentElement, node);
                m.draw();
                this.multiLoops.push(m);
                return m;
                break;
            }
        }
    };
    Drawing.prototype.centerAndZoomDrawing = function () {
        var unitedBounds = this.nucleotides.reduce(function (bbox, item) {
            return !bbox ? item.circle.bounds : bbox.unite(item.circle.bounds);
        }, null);
        // Set the zoom to encompass the whole drawing
        this.view.center = unitedBounds.center;
        var viewBounds = view.bounds;
        var heightRatio = viewBounds.height / unitedBounds.height;
        var widthRatio = viewBounds.width / unitedBounds.width;
        var newZoom = Math.min(heightRatio, widthRatio) * .9;
        this.view.zoom *= newZoom;
    };
    Drawing.prototype.centerAndZoomAfterResize = function () {
    };
    return Drawing;
}());
exports.Drawing = Drawing;
