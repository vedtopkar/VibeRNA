import { DrawnElement } from './DrawnElement'
import { Drawing } from '../../draw'
import { Point } from "paper/dist/paper-core"
import { CircularDrawElement } from './CircularDrawElement'

export class MultiLoopElement extends CircularDrawElement {
    public node: BulgeNode
    public basePoint: Point
    public baseVector: Point

    constructor(drawing: Drawing, parentElement: DrawnElement, node: MultiLoopNode) {
        super(drawing, parentElement, node)
    }


}