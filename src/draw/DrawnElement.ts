import { Drawing } from "../draw"
import { Structure } from "../structure/structure"

export class DrawnElement {
    public drawing: Drawing
    public structure: Structure
    public parentElement: DrawnElement
    public daughterElements: Array<DrawnElement> = []


    constructor(drawing: Drawing, parent: DrawnElement) {
        this.drawing = drawing
        this.structure = this.drawing.structure
        this.parentElement = parent
    }

}