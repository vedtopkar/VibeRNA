#!/usr/bin/env node

import { Structure } from '../src/structure/structure'
import { Drawing } from '../src/draw'

const program = require('commander');

/*******************************************/

// Draw an RNA secondary structure
// $ ts-rna-draw draw
// $ ts-rna-draw d
program

    .option('--seq <sequence>', 'Primary Sequence')
    .option('--struct <structure>', 'Secondary Structure')
    .parse(process.argv)

// allow commander to parse `process.argv`
const options = program.opts();
console.log(options.seq, options.struct)


var paper = require('paper');
paper.setup([1200, 800]);

// Initialize a new structure with the
let s = new Structure('CLI test', options.seq, options.struct)

// Clear canvas

// Make a new drawing and draw it
let drawing = new Drawing(s, paper.view)
drawing.drawTreeDispatch()
drawing.centerAndZoomDrawing()

console.log(paper.project.exportJSON());
console.log(paper.project.exportSVG({ asString: true }));
let url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({asString:true}))