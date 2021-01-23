import { Point, Path, Group } from 'paper/dist/paper-core'
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
        this.node.pairs.forEach((p, i) {
            let bp = new BasePairElement(this.drawing, this, p, drawCursor, this.startVector)
            bp.draw()

            this.drawing.basePairs.push(bp)
            this.basePairs.push(bp)

            this.drawnElements.push(bp.nucleotides[0].circle)
            this.drawnElements.push(bp.nucleotides[1].circle)
            this.drawnElements.push(bp.nucleotides[0].text)
            this.drawnElements.push(bp.nucleotides[1].text)

            let scaledDirectionVector = this.stemDirectionVector.clone()
            scaledDirectionVector.length = this.drawing.config.ntSpacing

            drawCursor = drawCursor.add(scaledDirectionVector)
        })

        this.elementGroup = new Group(this.drawnElements)
        let dragStartPoint: Point
        let dragAngle: Point
        let that = this // make a reference to this stem for passing into scopes

    
        this.elementGroup.onMouseDown = function(event) {
            dragStartPoint = event.point.clone()
        }
    
        this.elementGroup.onMouseUp = function(event) {
        }

        this.elementGroup.onMouseDrag = function(event) {

            
            dragAngle = event.point.subtract(that.parentElement.center).angle - dragStartPoint.subtract(that.parentElement.center).angle

            let nearestMultiple = Math.round(dragAngle / (Math.PI/2)) * (Math.PI/2)
            console.log('nearest', dragAngle, nearestMultiple)
            // Snap to nearest 45 degree angle if applicable
            if (Math.abs(dragAngle - nearestMultiple) < Math.PI*15/180) {
                dragAngle = nearestMultiple
            }

            // Drag the stem if it's not at root
            if (that.parentElement !== null) {
                that.rotateStem(dragAngle, that.parentElement.center)
                dragStartPoint = event.point.clone()
            } else {
                // If we're dragging a root stem, then do a flip!
                that.flipStem(that.startPoint)
            }
        }


        return drawCursor
    }

    // When a root stem is dragged, flip the stem over the horizontal
    public flipStem(startPoint: Point) {
        
        // Flip every 
        this.basePairs.forEach((bp, i) {
            bp.flipOverBaseline(this.startVector)
        })

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
        this.basePairs.forEach((bp, i) {
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