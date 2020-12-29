import { DrawnElement } from './DrawnElement'
import { Nucleotide } from './Nucleotide'
import { Point } from 'paper/dist/paper-core'
import { Structure } from '../structure/structure'
import { UnpairedNode } from '../structure/nodes'
import { Drawing } from '../draw'

export class UnpairedElement extends DrawnElement {

    public drawnNucleotides: Array<Nucleotide> = []
    public node: UnpairedNode
    public startPoint: Point
    public endPoint: Point

    constructor(drawing: Drawing, parentElement: DrawnElement, node: UnpairedNode, drawCursor: Point) {
        super(drawing, parentElement)
        this.node = node
        this.startPoint = drawCursor.clone()
    }

    public draw(): Point {
        const chars = [...this.node.sequence]
        let drawCursor: Point = this.startPoint.clone()
        console.log('up', chars)
        chars.forEach((c, i) {
            let n = new Nucleotide(this.drawing, c, drawCursor)
            n.draw()
            this.drawing.nucleotides.push(n)

            drawCursor.x += this.structure.drawConfig.ntSpacing
        })
        
        this.endPoint = drawCursor.clone()

        return this.endPoint.clone()
    }


}