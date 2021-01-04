import { DrawnElement } from './DrawnElement'
import { Nucleotide } from './Nucleotide'
import { Point } from 'paper/dist/paper-core'
import { Structure } from '../structure/structure'
import { UnpairedNode } from '../structure/nodes'
import { Drawing } from '../draw'

/**
 * Unlike an UnpairedNode, which can point to unpaired root or loop regions,
 * an UnpairedElement ONLY refers to a root-level unpaired region.
 */
export class UnpairedElement extends DrawnElement {

    public drawnNucleotides: Array<Nucleotide> = []
    public node: UnpairedNode
    public startPoint: Point
    public endPoint: Point

    public centerPoint: Point
    public radius: number

    constructor(drawing: Drawing, parentElement: DrawnElement, node: UnpairedNode) {
        super(drawing, parentElement)
        this.node = node
    }

    public draw(startPoint: Point): Point {
        const chars = [...this.node.sequence]
        let drawCursor: Point = startPoint.clone()
        chars.forEach((c, i) {
            let n = new Nucleotide(this.drawing, c, drawCursor)
            n.draw()
            this.drawing.nucleotides.push(n)

            drawCursor.x += this.structure.drawConfig.ntSpacing
        })
        
        this.endPoint = drawCursor.clone()

        return this.endPoint.clone()
    }

    /**
     * Draws circularly
     * 
     * When the unpaired element is the daughter of a ciruclar element, we draw it circularly
     * 
     * @param center 
     * @param radius 
     * @param angleStart 
     * @param angleEnd 
     * @returns circular 
     */
    public drawCircular(centerPoint: Point, radius: number, angleStart: number, angleEnd: number): Point {
        
        const chars = [...this.node.sequence]
        console.log('drawing circularly', this.node.sequence, centerPoint, radius, angleStart, chars)

        let angleCursor: number = angleStart
        let ntAngleIncrement: number = (angleEnd - angleStart)/(chars.length - 1)

        chars.forEach((c, i) => {
            let center = centerPoint.clone()
            center.y += radius*Math.sin(Math.PI*angleCursor/180)
            center.x += radius*Math.cos(Math.PI*angleCursor/180)

            let nt = new Nucleotide(this.drawing, c, center)
            nt.draw()

            this.drawing.nucleotides.push(nt)
            this.drawnNucleotides.push(nt)
            angleCursor += ntAngleIncrement
        })

        return angleCursor
    }

    /**
     * Transforms circularly
     * 
     * When our unpairedlement is part of a circular element, and when the circular element is shifted
     * (e.g. a stem is dragged), we move the nucleotides to space equally along some angle of the circle.
     */
    public transformCircular(angleStart) {
    }


}