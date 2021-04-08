#!/usr/bin/env node

import { Command } from 'commander'
const program = new Command()

program
    .option('--seq <sequence>', 'Primary Sequence')
    .option('--struct <structure>', 'Secondary Structure')
    .parse(process.argv)

// allow commander to parse `process.argv`
const options = program.opts()
console.log(options.seq, options.struct)
