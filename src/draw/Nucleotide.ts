import { Path, Point, PointText } from "paper/dist/paper-core"
import { Drawing } from "../draw"

export class Nucleotide {
    public drawing: Drawing
    public letter: string
    public center: Point


    constructor(drawing: Drawing, letter: string, center: Point) {
        this.drawing = drawing
        this.letter = letter
        this.center = center.clone()
    }

    public draw() {
        const circle = new Path.Circle(this.center, this.drawing.config.ntRadius)
        circle.fillColor = this.drawing.config.ntFillColor
        circle.strokeColor = this.drawing.config.ntStrokeColor
        circle.strokeWidth = this.drawing.config.ntStrokeWidth

        const offset_center: Point = this.center.clone()
        offset_center.y += 4
        const text = new PointText(offset_center)
        text.content = this.letter
        text.justification = 'center'

        // circle.onMouseEnter = function(event) {
        //     this.strokeColor = 'blue'
        // }
    
        // circle.onMouseLeave = function(event) {
        //     this.strokeColor = 'red'
        // }
    
        // circle.onMouseDown = function(event) {
        //     this.strokeColor = 'green'
        // }
    
        // circle.onMouseUp = function(event) {
        //     this.strokeColor = 'red'
        // }
    
    }

}