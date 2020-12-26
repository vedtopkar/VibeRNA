import { Path, Point } from "paper/dist/paper-core"

export class Nucleotide {
    public letter: string
    public center: Point

    private radius: number = 10
    private fillColor: string = 'white'
    private strokeColor: string = 'red'
    private strokeWidth: number = 3

    constructor(letter: string, center: Point) {
        this.letter = letter
        this.center = center.clone()
    }

    public drawNucleotide() {
        const circle = new Path.Circle(this.center, this.radius)
        circle.fillColor = this.fillColor
        circle.strokeColor = this.strokeColor
        circle.strokeWidth = this.strokeWidth

        const offset_center: Point = this.center.clone()
        offset_center.y += 4
        const text = new PointText(offset_center)
        text.content = this.letter
        text.justification = 'center'

        circle.onMouseEnter = function(event) {
            this.strokeColor = 'blue'
        }
    
        circle.onMouseLeave = function(event) {
            this.strokeColor = 'red'
        }
    
        circle.onMouseDown = function(event) {
            this.strokeColor = 'green'
        }
    
        circle.onMouseUp = function(event) {
            this.strokeColor = 'red'
        }
    
    }

}