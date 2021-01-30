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
    public drawDirection: number

    public parentElement: DrawnElement
    
    public helixSide: string
    public numbered: Boolean = false


    constructor(drawing: Drawing, parentElement: DrawnElement, letter: string, center: Point, drawDirection: number) {
        this.drawing = drawing
        this.parentElement = parentElement
        this.letter = letter
        this.drawDirection = drawDirection
        this.center = center.clone()

    }

    public draw() {
        const circle = new Path.Circle(this.center, this.drawing.config.ntRadius)

        const color = this.drawing.config.ntColors[this.drawing.config.ntNucleotides.indexOf(this.letter)]
        
        circle.fillColor = color
        circle.strokeColor = this.drawing.config.ntStrokeColor
        circle.strokeWidth = this.drawing.config.ntStrokeWidth


        const offset_center: Point = this.center.clone()
        offset_center.y += 4
        const text = new PointText(offset_center)
        text.content = this.letter
        text.justification = 'center'

        this.circle = circle
        this.text = text

        let dragStartPoint: Point
        let dragAngle: number


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
            
            dragAngle = event.point.subtract(that.parentElement.parentElement.parentElement.center).angle - dragStartPoint.subtract(that.parentElement.parentElement.parentElement.center).angle
            
            if(that.parentElement.type == 'BasePairElement') {
                console.log(dragStartPoint, dragAngle)
                let nearestMultiple = Math.round(dragAngle / 45) * 45
    
                // Drag the stem if it's not at root
                if (that.parentElement !== null) {
                    that.parentElement.parentElement.rotateStem(dragAngle, that.parentElement.parentElement.parentElement.center)
                    dragStartPoint = event.point.clone()
                } else {
                    // If we're dragging a root stem, then do a flip!
                    that.flipStem(that.startPoint)
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
        console.log('vecang', numberCenter)

        const numberText = new PointText(numberCenter)
        numberText.content = number + 1
        numberCenter.x += 5

        let line = new Path.Line(numberCenter, this.center)
        line.strokeColor = 'black'
        console.log(numberCenter, this.center)

    }

    // Simply move the nucleotide and update the center
    public move(center) {
        this.center = center
        this.group.position = this.center
    }

    public rotate(angle, center) {
        this.group.rotate(angle, center)
        this.text.rotate(-1*angle)

        this.center = this.group.center
    }

}