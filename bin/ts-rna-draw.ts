#!/usr/bin/env node

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