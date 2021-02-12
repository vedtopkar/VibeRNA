import { DrawnElement } from './DrawnElement'
import { Nucleotide } from '../Nucleotide'
import { Point } from 'paper/dist/paper-core'
import { ParseSecondaryStructure } from '../../structure/ParseSecondaryStructure'
import { UnpairedNode } from '../../structure/Nodes'
import { Drawing } from '../../draw'

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
    public angleStart: number
    public angleEnd: number

    public drawDirection: number = 1 // 1 is clockwise, -1 is counterclockwise

    constructor(drawing: Drawing, parentElement: DrawnElement, node: UnpairedNode) {
        super(drawing, parentElement)
        this.node = node
        this.type = 'UnpairedElement'
    }

    public draw(startPoint: Point): Point {
        const chars = [...this.node.sequence]
        let drawCursor: Point = startPoint.clone()
        let that = this
        chars.forEach(function (c, i) {
            let n = new Nucleotide(that.drawing, that, c, drawCursor, 0, that.node.sequenceIndices[i])
            n.draw()
            that.drawnNucleotides.push(n)

            drawCursor.x += that.drawing.config.ntSpacing
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
        this.radius = radius
        this.angleStart = angleStart
        this.angleEnd = angleEnd
        this.centerPoint = centerPoint

        const chars = [...this.node.sequence]

        let angleCursor: number = angleStart
        let ntAngleIncrement: number = (angleEnd - angleStart)/(chars.length + 1)
        angleCursor += ntAngleIncrement

        let that = this
        chars.forEach((c, i) => {
            let center = this.centerPoint.clone()
            center.y += radius*Math.sin(Math.PI*angleCursor/180)
            center.x += radius*Math.cos(Math.PI*angleCursor/180)

            let nt = new Nucleotide(this.drawing, this, c, center, angleCursor + 90, that.node.sequenceIndices[i])
            nt.draw()

            this.drawnNucleotides.push(nt)
            angleCursor += ntAngleIncrement
        })

        return angleCursor
    }

    public rotateCircularly(angle, center) {

        this.centerPoint = this.centerPoint.rotate(angle, center)
        this.drawnNucleotides.forEach(function (n, i) {
            n.rotate(angle, center)
        })

        this.angleStart += angle
        this.angleEnd += angle

    }

    public normalizeAngle(angle) {
        if (angle > 360) {
            return angle % 360
        }

        
    }

    /**
     * Transforms circularly
     * 
     * When our unpairedlement is part of a circular element, and when the circular element is shifted
     * (e.g. a stem is dragged), we move the nucleotides to space equally along some angle of the circle.
     */
    public rearrangeCircular(angleStart, angleEnd, drawDirection) {
        this.angleStart = angleStart
        this.angleEnd = angleEnd

        let angleCursor: number = angleStart

        if (angleEnd < angleStart) {
            let ntAngleIncrement: number = (360 + angleEnd - angleStart)/(this.drawnNucleotides.length + 1)
        } else {
            let ntAngleIncrement: number = (angleEnd - angleStart)/(this.drawnNucleotides.length + 1)
        }

        angleCursor += ntAngleIncrement

        // console.log('angles', angleStart, angleEnd)

        this.drawnNucleotides.forEach((nt, i) => {

            let center = this.centerPoint.clone()
            center.y += this.radius*Math.sin(Math.PI*angleCursor/180)
            center.x += this.radius*Math.cos(Math.PI*angleCursor/180)

            nt.move(center)

            angleCursor += ntAngleIncrement
        })

        return angleCursor

    }

    public flipOverBaseline(baseline_y, drawDirection) {

        this.drawDirection = drawDirection
        this.angleStart = (180 - this.angleStart) % 360
        this.angleEnd = (180 - this.angleEnd) % 360

        this.drawnNucleotides.forEach(function (nt, i) {
            nt.flipOverBaseline(baseline_y)
        })
    }

}