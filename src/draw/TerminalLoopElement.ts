import { CircularNode, TerminalLoopNode } from '../structure/nodes'
import { BasePairElement } from './BasePairElement'
import { DrawnElement } from './DrawnElement'
import { Nucleotide } from './Nucleotide'
import { StemElement } from './StemElement']
import { Drawing } from '../draw'
import { CircularDrawElement } from './CircularDrawElement'


export class TerminalLoopElement extends CircularDrawElement {
    public node: Node
    public radius: number
    public sequence: string

    constructor(drawing: Drawing, parentElement: DrawnElement, node: Node) {
        super(drawing, parentElement, node)
        this.node = node
        this.sequence = this.node.daughters[0].sequence
        this.radius = this.minimumRadius()
    }

    /**
     * We have a defined "radius" for terminal loops, but that may be too small for larger loops!
     * 
     * Here we establish a lower bound for the radius, and use it if the config radius is too small.
     */
    private minimumRadius() {
        let n_nt: number = this.sequence.length
        let min_circumference: number = 2*(2 + n_nt)*(this.drawing.config.ntRadius) + this.drawing.config.bpLength
        let min_radius: number = min_circumference/(2*Math.PI)

        return min_radius > this.drawing.config.terminalLoopRadius ? min_radius : this.drawing.config.terminalLoopRadius
    }
    
}