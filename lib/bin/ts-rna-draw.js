#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var structure_1 = require("../src/structure/structure");
var draw_1 = require("../src/draw");
var program = require('commander');
/*******************************************/
// Draw an RNA secondary structure
// $ ts-rna-draw draw
// $ ts-rna-draw d
program
    .option('--seq <sequence>', 'Primary Sequence')
    .option('--struct <structure>', 'Secondary Structure')
    .parse(process.argv);
// allow commander to parse `process.argv`
var options = program.opts();
console.log(options.seq, options.struct);
var paper = require('paper');
paper.setup([1200, 800]);
// Initialize a new structure with the
var s = new structure_1.Structure('CLI test', options.seq, options.struct);
// Clear canvas
// Make a new drawing and draw it
var drawing = new draw_1.Drawing(s, paper.view);
drawing.drawTreeDispatch();
drawing.centerAndZoomDrawing();
console.log(paper.project.exportJSON());
console.log(paper.project.exportSVG({ asString: true }));
var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({ asString: true }));
