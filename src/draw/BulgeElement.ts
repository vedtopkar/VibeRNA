import { BulgeNode } from '../structure/nodes'
import { DrawnElement } from './DrawnElement'
import { Drawing } from '../draw'
import { Point } from "paper/dist/paper-core"

export class BulgeElement extends DrawnElement {
    public node: BulgeNode
    public basePoint: Point
    public baseVector: Point


    constructor(drawing: Drawing, parentElement: DrawnElement, node: BulgeNode) {
        super(drawing, parentElement)
        this.node = node
    }

    /**
     * Drawing a bulge involves
     */
    public draw() {

    }

}