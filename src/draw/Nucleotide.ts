import { Path, Point, PointText, Group } from "paper/dist/paper-core"
import { Drawing } from "../draw"
import { DrawnElement } from "./DrawnElement"

export class Nucleotide {
    public drawing: Drawing
    public letter: string
    public center: Point
    public group: Group
    public circle: Path.Circle
    public text: Path.PointText
    public sequenceIndex: number

    // Drawdirection is the angle in which the cursor is moving when the nucleotide is drawn
    public drawDirection: number

    public parentElement: DrawnElement
    
    public helixSide: string

    public highlighted: Boolean  = false
    public selected: Boolean = false
    public numbered: Boolean = false


    constructor(drawing: Drawing, parentElement: DrawnElement, letter: string, center: Point, drawDirection: number, sequenceIndex: number) {
        this.drawing = drawing
        this.parentElement = parentElement
        this.letter = letter.toUpperCase()
        this.drawDirection = drawDirection
        this.center = center.clone()
        this.sequenceIndex = sequenceIndex

        // When we make the nucleotide, put it at the appropriate place in the drawing's nucleotide array
        this.drawing.nucleotides[this.sequenceIndex] = this

    }

    public draw() {
        const circle = new Path.Circle(this.center, this.drawing.config.ntRadius)

        const color = this.drawing.config.ntColors[this.drawing.config.ntNucleotides.indexOf(this.letter)]
        
        circle.fillColor = color
        circle.strokeColor = this.drawing.config.ntStrokeColor
        circle.strokeWidth = this.drawing.config.ntStrokeWidth

        const offset_center: Point = this.center.clone()
        offset_center.y = offset_center.y + 4

        const text = new PointText(offset_center)
        text.content = this.letter
        text.justification = 'center'

        this.circle = circle
        this.text = text

        let dragStartPoint: Point
        let dragLatestPoint: Point
        let dragAngle: number
        let crossedBaseline: Boolean


        this.group = new Group([this.circle, this.text])

        let that = this

        this.group.onMouseEnter = function(event) {
            that.circle.strokeWidth += 3
        }
    
        this.group.onMouseLeave = function(event) {
            that.circle.strokeWidth -= 3
        }

        this.group.onMouseDown = function(event) {
            dragStartPoint = event.point.clone()
        }
    
        this.group.onMouseUp = function(event) {
        }

        this.group.onMouseDrag = function(event) {
            
            if(that.parentElement.type == 'BasePairElement') {
                
                let nearestMultiple = Math.round(dragAngle / 45) * 45
    
                // Flip the stem if it's at root, otherwise drag the stem
                if(that.parentElement.parentElement.parentElement === null) {

                    let min = Math.min(event.point.y, event.point.y - event.delta.y)
                    let max = Math.max(event.point.y, event.point.y - event.delta.y)

                    // Check if the latest drag traversed the baseline
                    if(min < that.drawing.config.origin.y && that.drawing.config.origin.y < max) {
                        console.log('FLIP')
                        that.parentElement.parentElement.flipOverBaseline(that.drawing.config.origin.y)
                    }
                    

                } else {
                    dragAngle = event.point.subtract(that.parentElement.parentElement.parentElement.center).angle - dragStartPoint.subtract(that.parentElement.parentElement.parentElement.center).angle
                    that.parentElement.parentElement.rotateStem(dragAngle, that.parentElement.parentElement.parentElement.center)
                    dragStartPoint = event.point.clone()
                }
            }


        }


    }

    public drawNumbering(number) {
        // First, we get the overal drawing direction
        // we willd draw the numbering along its tangent

        let drawCursor = new Point(this.center.x, this.center.y)

        // if (this.helixSide == 'right' || this.helixSide === undefined) {
        //     console.log(number)
        //     let numberingVector = new Point({length: this.drawing.config.ntRadius*2, angle: this.drawDirection - 90})
        // } else {
        //     let numberingVector = new Point({length: this.drawing.config.ntRadius*2, angle: this.drawDirection + 90})
        // }

        let numberingVector = new Point({length: this.drawing.config.ntRadius*2, angle: this.drawDirection - 90})
        
        

        let numberCenter = drawCursor.add(numberingVector)

/*         const numberText = new PointText(numberCenter)
        numberText.content = number + 1
        numberCenter.x += 5

        let line = new Path.Line(numberCenter, this.center)
        line.strokeColor = 'black'
        console.log(numberCenter, this.center) */

    }

    // Simply move the nucleotide and update the center
    public move(center) {
        this.center = center.clone()
        this.group.position = this.center
    }

    public rotate(angle, center) {
        this.group.rotate(angle, center)
        this.text.rotate(-1*angle)

        this.center = this.group.center
    }

    public flipOverBaseline(baseline_y) {

        let newCenter = this.center.clone()
        newCenter.y += 2*(baseline_y - this.center.y)

        this.move(newCenter)

    }

    public toggleHighlight() {

    }

    public select() {
        this.selected = true
        
    }

    public deselect() {
        this.selected = false
    }

}