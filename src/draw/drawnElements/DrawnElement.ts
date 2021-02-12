import { Drawing } from "../../draw"
import { ParseSecondaryStructure } from "../../structure/ParseSecondaryStructure"

export type DrawnElementType = "UnpairedElement" | "StemElement" | "BasePairElement";

export class DrawnElement {
    public drawing: Drawing
    public structure: ParseSecondaryStructure
    public parentElement: DrawnElement
    public type: DrawnElementType
    
    public daughterElements: Array<DrawnElement> = []
    


    constructor(drawing: Drawing, parent: DrawnElement) {
        this.drawing = drawing
        this.structure = this.drawing.structure
        this.parentElement = parent
    }

}