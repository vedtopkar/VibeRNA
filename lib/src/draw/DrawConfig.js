"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultConfig = void 0;
var paper_core_1 = require("paper/dist/paper-core");
exports.DefaultConfig = {
    origin: new paper_core_1.Point(200, 400),
    ntRadius: 10,
    ntSpacing: 30,
    ntFillColor: 'white',
    ntStrokeColor: 'black',
    ntStrokeWidth: 0,
    ntNucleotides: ['A', 'U', 'C', 'G'],
    ntColors: ['#ff70a6', '#ffd670', '#06d6a0', '#70d6ff'],
    bpLength: 40,
    bpStrokeSize: 1,
};
