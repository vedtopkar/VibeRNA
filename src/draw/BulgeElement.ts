import { BulgeNode } from '../structure/nodes'
import { DrawnElement } from './DrawnElement'
import { Drawing } from '../draw'
import { Point } from "paper/dist/paper-core"
import { CircularDrawElement } from './CircularDrawElement'

export class BulgeElement extends CircularDrawElement {
    public node: BulgeNode
    public basePoint: Point
    public baseVector: Point


    constructor(drawing: Drawing, parentElement: DrawnElement, node: BulgeNode) {
        console.log('drawingbulge')
        super(drawing, parentElement, node)
        this.node = node
    }


}