/*
Here, we 
*/

import { Point } from "paper/dist/paper-core"
import { Structure } from "./structure/structure"

import { UnpairedElement } from './draw/UnpairedElement'
import { StemElement } from './draw/StemElement'
import { InternalLoopElement } from './draw/InternalLoopElement'
import { MultiLoopElement } from './draw/MultiLoopElement'
import { BasePairElement } from './draw/BasePairElement'
import { Nucleotide } from './draw/Nucleotide'

// An object that stores configuration variables for a drawing
export class DrawConfig {
    public nucleotideRadius: number = 40
    public nucleotideSpacing: number = 40
}

export class Drawing {
    // Reference to a structure object
    public structure: Structure

    // Explicit references to each type of drawn element for easy updating
    public unpaireds: Array<UnpairedElement> = []
    public stems: Array<StemElement> = []
    public internalLoops: Array<InternalLoopElement> = []
    public multiLoops: Array<MultiLoopElement> = []
    public basePairs: Array<BasePairElement> = []
    public nucleotides: Array<Nucleotide> = []

    public drawConfig = {
        origin: new Point(200, 400),
        nucleotide: {
            radius: 40,
            spacing: 40
        },
        basePair: {
            length: 40,
            strokeSize: 2
        },
        terminalLoop: {
            radius: 40
        }
    }

    constructor() {

    }

}