import { Point, Path } from 'paper/dist/paper-core'
import { start } from 'repl'
import { Drawing } from '../draw'
import { StemNode } from '../structure/nodes'
import { Structure } from '../structure/structure'
import { BasePairElement } from './BasePairElement'
import { DrawnElement } from './DrawnElement'
import { Nucleotide } from './Nucleotide'

/**
 * Stem element
 * 
 * This is an element that draws a dsRNA stem.
 * 
 * Importantly, it has properties startVector and endVector, which point from the 5' to the 3' nt of the botton and top bp.
 * The drawDirection is a vector that points from the startVector to the endDirection.
 */
export class StemElement extends DrawnElement {

    public node: StemNode
    public startPoint: Point
    public startVector: Point
    public endPoint: Point
    public endvector: Point
    public stemDirectionVector: Point
    public basePairs: Array<BasePairElement> = []

    /**
     * Creates an instance of stem element.
     * We require the startPoint, baseVector, and derive the other two vectors from that.
     */
    constructor(drawing: Drawing, parentElement: DrawnElement, node: StemNode, startPoint: Point, startVector: Point) {
        super(drawing, parentElement)

        this.node = node
        this.startPoint = startPoint
        this.startVector = startVector

        // Make a unit vector that points in the direction  of the stem to be drawn
        this.stemDirectionVector = this.startVector.clone()
        this.stemDirectionVector.angle -= 90
        this.stemDirectionVector.length = 1
    }

    /**
     * Draw stem element
     * 
     * Create and draw each individual base pair element of the stem
     */
    public draw() {
        let drawCursor: Point = this.startPoint.clone()
        console.log(drawCursor)

        this.node.pairs.forEach((p, i) {
            let bp = new BasePairElement(this.drawing, this, p, drawCursor, this.startVector)
            bp.draw()

            this.drawing.basePairs.push(bp)
            this.basePairs.push(bp)

            let scaledDirectionVector = this.stemDirectionVector.clone()
            scaledDirectionVector.length = this.drawing.config.ntSpacing

            drawCursor = drawCursor.add(scaledDirectionVector)
            console.log(drawCursor)
        })

        return drawCursor
    }
}