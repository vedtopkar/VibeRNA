import { Point, Path, Group } from 'paper/dist/paper-core'
import { start } from 'repl'
import { Drawing } from '../../draw'
import { StemNode } from '../../structure/Nodes'
import { ParseSecondaryStructure } from '../../structure/ParseSecondaryStructure'
import { BasePairElement } from './BasePairElement'
import { DrawnElement } from './DrawnElement'
import { Nucleotide } from '../Nucleotide'

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
    public nucleotides: Array<Nucleotide> = []
    public drawnElements = []
    public elementGroup: Group

    /**
     * Creates an instance of stem element.
     * We require the startPoint, baseVector, and derive the other two vectors from that.
     */
    constructor(drawing: Drawing, parentElement: DrawnElement, node: StemNode, startPoint: Point, startVector: Point) {
        super(drawing, parentElement)

        this.node = node
        this.startPoint = startPoint.clone()
        this.startVector = startVector.clone()

        // Make a unit vector that points in the direction  of the stem to be drawn
        this.stemDirectionVector = this.startVector.clone().rotate(-90).normalize()

        this.type = 'StemElement'
    }

    private transformStem(angle){
        if(this.node.parent.type !== 'RootNode') {
            this.parentElement.rotateStem(this, angle)
        }
    }

    /**
     * Draw stem element
     * 
     * Create and draw each individual base pair element of the stem
     */
    public draw() {
        let drawCursor: Point = this.startPoint.clone()
        let that = this
        this.node.pairs.forEach(function (p, i) {
            
            let bp = new BasePairElement(that.drawing, that, p, drawCursor, that.startVector, that.node.sequenceIndices[i])
            bp.draw()

            that.drawing.basePairs.push(bp)
            that.basePairs.push(bp)

            that.drawnElements.push(bp.nucleotides[0].circle)
            that.drawnElements.push(bp.nucleotides[1].circle)
            that.drawnElements.push(bp.nucleotides[0].text)
            that.drawnElements.push(bp.nucleotides[1].text)

            let scaledDirectionVector = that.stemDirectionVector.clone()
            scaledDirectionVector.length = that.drawing.config.ntSpacing

            drawCursor = drawCursor.add(scaledDirectionVector)
        })


        return drawCursor
    }

    // When a root stem is dragged, flip the stem over the horizontal
    public flipOverBaseline(baseline_y: number) {
        let that = this


        
        // Flip every base pair in the stem
        this.basePairs.forEach(function (bp, i) {
            bp.flipOverBaseline(baseline_y)
        })

        // Update the startPoint, etc.
        this.stemDirectionVector.angle = (this.stemDirectionVector.angle + 180) % 360

        if (this.daughterElements.length > 0) {
            this.daughterElements.forEach(function(el, i) {
                el.flipOverBaseline(baseline_y)
            })
        }

    }
    

    // When a stem is dragged, rotate it and kick off the upstream and downstream cascade
    public rotateStem(angle: number, center: Point) {

        // Rotate the stem and the stem's daughters
        this.rotateCircularly(angle, center)

        if (this.parentElement !== null) {
            // Adjust the stem base if applicable
            this.parentElement.rearrangeAfterDrag(this, angle)
        }


    }

    public rotateCircularly(angle, center) {
        
        // Rotate each bp individually
        this.basePairs.forEach(function (bp, i) {
            bp.rotateCircularly(angle, center)
        })

        // Update the stem's angle
        this.stemDirectionVector.angle += angle

        // Rotate daughters if applicable
        if (this.daughterElements.length > 0) {
            this.daughterElements[0].rotateCircularly(angle, center)
        }
    }


}