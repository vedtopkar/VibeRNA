import { Path } from 'paper/dist/paper-core'
import { ParseSecondaryStructure } from '../../structure/ParseSecondaryStructure'
import {DrawnElement} from './DrawnElement'
import { Nucleotide } from '../Nucleotide'
import { StemElement } from './StemElement'

/**
 * Base pair element
 * 
 * A base pair element is contains the vectors needed to define the base-pair
 * and draws and holds on to references to the two nucleotides and the intervening line
 */
export class BasePairElement extends DrawnElement {
    public letterPair: Array<string>
    public parentElement: StemElement
    public startPoint: Point
    public drawVector: Point
    public drawDirection: number
    public pairIndices: Array<number>

    public nucleotides: Array<Nucleotide> = [] // 5' and 3', in that order
    public hBond: Path.Line

    constructor(drawing: Drawing, parentElement: DrawnElement, letterPair: Array<string>, startPoint: Point, drawVector: Point, pairIndices: Array<number>) {
        super(drawing, parentElement)

        this.letterPair = letterPair
        this.startPoint = startPoint.clone()
        this.drawVector = drawVector.clone()
        this.drawVector.length = this.drawing.config.bpLength
        this.pairIndices = pairIndices

        this.type = 'BasePairElement'
    }

    public draw() {

        let drawCursor: Point = this.startPoint.clone()
        let l = new Nucleotide(this.drawing, this, this.letterPair[0], drawCursor, this.drawVector.angle - 90, this.pairIndices[0])
        l.helixSide = 'left'
        l.draw()

        let p1: Point = drawCursor.clone()
        drawCursor = drawCursor.add(this.drawVector)

        let p2: Point = drawCursor.clone()
        let r = new Nucleotide(this.drawing, this, this.letterPair[1], drawCursor, this.drawVector.angle + 90, this.pairIndices[1])
        l.helixSide = 'right'
        r.draw()


        this.hBond = new Path.Line(p1, p2)
        this.hBond.strokeColor = 'black'
        this.hBond.strokeWidth = 5
        this.hBond.sendToBack()

        this.nucleotides.push(l)
        this.nucleotides.push(r)
    }

    public rotateCircularly(angle, center) {

        this.nucleotides[0].rotate(angle, center)
        this.nucleotides[1].rotate(angle, center)

        this.hBond.rotate(angle, center)
    }

    public flipOverBaseline(baseline_y) {
        this.nucleotides[0].flipOverBaseline(baseline_y)
        this.nucleotides[1].flipOverBaseline(baseline_y)

        this.hBond.segments[0].point = this.nucleotides[0].center.clone()
        this.hBond.segments[1].point = this.nucleotides[1].center.clone()
    }
}