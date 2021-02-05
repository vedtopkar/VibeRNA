/** 
 * Draw.ts
 * 
 * Main file that initiates drawing
*/

import { Point, View, Color } from "paper/dist/paper-core"
import { Structure, StructureTree } from "./structure/structure"
import { Node, UnpairedNode, StemNode, TerminalLoopNode, BulgeNode, InternalLoop, MultiLoop, RootNode } from './structure/nodes'

import { DrawnElement } from './draw/DrawnElement'
import { UnpairedElement } from './draw/UnpairedElement'
import { StemElement } from './draw/StemElement'
import { TerminalLoopElement } from './draw/TerminalLoopElement'
import { InternalLoopElement } from './draw/InternalLoopElement'
import { MultiLoopElement } from './draw/MultiLoopElement'
import { BasePairElement } from './draw/BasePairElement'
import { Nucleotide } from './draw/Nucleotide'
import { DrawConfig, DefaultConfig } from "./draw/DrawConfig"
import { BulgeElement } from "./draw/BulgeElement"
import tinygradient from "tinygradient"

/**
 * Drawing
 * 
 * A class that encapsulates all elements and configuration of our RNA drawing
 */
export class Drawing {

    // Reference to paper view
    public view: View

    // Reference to a structure object
    public structure: Structure

    // The drawtree is a nested 
    public rootElements: Array<DrawnElement> = []

    // Explicit references to each type of drawn element for easy post-hoc updating
    public unpaireds: Array<UnpairedElement> = []
    public stems: Array<StemElement> = []
    public terminalLoops: Array<TerminalLoopNode> = []
    public internalLoops: Array<InternalLoopElement> = []
    public multiLoops: Array<MultiLoopElement> = []
    public basePairs: Array<BasePairElement> = []
    public nucleotides: Array<Nucleotide>
    
    // Load in the default config
    public config: DrawConfig = DefaultConfig

    public reactivities: Array<number>

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
    private drawCursor: Point = this.config.origin.clone()
    private drawVector: Point

    constructor(structure: Structure, view: View) {
        this.structure = structure
        this.nucleotides = Array(this.structure.sequence.length)

        this.view = view

        // Shift over so that the first element is drawn at the origin
        this.drawCursor.x -= this.config.ntSpacing

        // Generate an initial drawVector that points rightward
        this.drawVector = this.config.origin.subtract(this.drawCursor)

    }

    public drawTreeDispatch() {
        for (const node of this.structure.structureTree.root.daughters) {

            switch(node.type) {
                case 'UnpairedNode' : {
                    let u: UnpairedElement = new UnpairedElement(this, null, node)

                    // We expect unpaired nodes to return a drawCursor that sits at the center of the last nt
                    this.drawCursor = u.draw(this.drawCursor)
                    this.rootElements.push(u)
                    
                    break
                }
                case 'StemNode': {

                    let s = this.drawTreeRecursive(node, null, this.drawCursor.clone(), this.drawVector.clone())

                    // The next dispatched element may be a unpaired node or a stem
                    // shift the drawCursor over to where the bottom right stem nt should be
                    this.drawCursor.x += (this.config.ntSpacing + this.config.bpLength)

                    this.rootElements.push(s)

                    break
                }
            }
        }

        
        this.nucleotides.forEach((n, i) => {
            if((i + 1) % 10 == 0 || i == 0) {
                n.drawNumbering(i)
            }
        })
    }

    public drawTreeRecursive(node: Node, parentElement: DrawnElement, drawCursor: Point, drawVector: Point) {
        switch(node.type) {
            case 'StemNode': {
                let s = new StemElement(this, parentElement, node, drawCursor.clone(), drawVector.clone())
                drawCursor = s.draw()

                if (node.daughters.length > 0) {
                    s.daughterElements.push(this.drawTreeRecursive(node.daughters[0], s, drawCursor, drawVector))
                }
                return s

                break
            }

            case 'BulgeNode': {
                let b = new BulgeElement(this, parentElement, node)
                b.draw()

                return b

                break
            }

            case 'TerminalLoopNode': {
                let t = new TerminalLoopElement(this, parentElement, node)
                t.draw()

                this.terminalLoops.push(t)
                // End of the line! No more elements to draw in this branch.

                return t
                break
            }

            case 'MultiLoopNode': {
                let m = new MultiLoopElement(this, parentElement, node)
                m.draw()
                this.multiLoops.push(m)
                
                return m
                break
            }
        }
    }

    public paintReactivity(reactivity) {

        // We start by taking in the values, splitting on commas, converting to floats, then normalizing to [0,1]
        const splitNumbers = reactivity.split(",")
        const reactivityFloats = splitNumbers.map(x => parseFloat(x))
        this.reactivities = this.normalizeReactivity(reactivityFloats)

        // Initialize gradient
        let gradient = tinygradient('white', 'red')

        // Next, we color from white to red (for now)
        let that = this
        this.nucleotides.forEach((n, i) => {
            if (n.letter.toUpperCase() == "A"  || n.letter.toUpperCase() == "C") {
                n.reactivityValue = that.reactivities[i]
                n.circle.fillColor = gradient.rgbAt(that.reactivities[i]).toHexString()
                console.log(n, i, that.reactivities[i], gradient.rgbAt(that.reactivities[i]).toHexString())
            } else {
                console.log(n.letter)
                n.circle.fillColor = '#dbdbdb'
            }

        })

        // console.log(reactivity.length, splitNumbers.length, reactivityFloats.length, this.normalizedReactivityFloats.length, this.structure.sequence.length)
    }

    public normalizeReactivity(values) {

        // If values dip below 0, move everything up to be positive
        if(Math.min(...values) < 0) {
            values = values.map(x => x + Math.abs(Math.min(...values)))
        }

        // Divide by the maximun value
        values = values.map(x => x/Math.max(...values))

        return values
    }

}