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

    public parentElement: DrawnElement
    
    public numbered: Boolean = false


    constructor(drawing: Drawing, parentElement: DrawnElement, letter: string, center: Point) {
        this.drawing = drawing
        this.parentElement = parentElement
        this.letter = letter
        this.center = center.clone()
        console.log(this.parentElement.type)

    }

    public draw() {
        const circle = new Path.Circle(this.center, this.drawing.config.ntRadius)

        const color = this.drawing.config.ntColors[this.drawing.config.ntNucleotides.indexOf(this.letter)]

        // circle.fillColor = this.drawing.config.ntFillColor
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
            console.log(this.parentElement)
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
                let nearestMultiple = Math.round(dragAngle / (Math.PI/2)) * (Math.PI/2)
                console.log('nearest', dragAngle, nearestMultiple)
                // Snap to nearest 45 degree angle if applicable
                if (Math.abs(dragAngle - nearestMultiple) < Math.PI*15/180) {
                    dragAngle = nearestMultiple
                }
    
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

        if (this.parent)

        let numberCenter = this.center.clone()
        numberCenter.y += 40

        const numberText = new PointText(numberCenter)
        numberText.content = number + 1
        numberCenter.x += 5

        let line = new Path.Line(numberCenter, this.center)
        line.strokeColor = 'black'

        console.log(line)


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