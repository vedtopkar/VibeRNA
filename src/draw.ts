import { Path, Point, view, setup } from "paper/dist/paper-core"
import { nodeModuleNameResolver, Path } from "typescript"
import { Node, StructureTree, UnpairedNode, StemNode } from "./structure"

export class drawCursor {

}

export function drawNucleotide(letter: string, center_x: number, center_y: number, radius: number = 5) {

    let colors = {'G': 'green', 'C': 'blue', 'A': 'red', 'T': 'yellow'}

    const circle = new Path.Circle(new Point(center_x, center_y), radius)
    circle.fillColor = colors[letter]
    circle.strokeColor = 'black'
    circle.strokeWidth = 3

    circle.onMouseEnter = function(event) {
        this.strokeColor = 'red'
    }

    circle.onMouseLeave = function(event) {
        this.strokeColor = 'black'
    }

    circle.onMouseDown = function(event) {
        this.strokeColor = 'green'
    }

    circle.onMouseUp = function(event) {
        this.strokeColor = 'red'
    }

    circle.onMouseDrag = function(event) {
        console.log(circle.position)
        circle.position = event.point
        console.log(circle.position)
    }

}

export function drawRNA(structure: StructureTree) {
    /*
    Given a StructureTree, draw that structure!

    We recursively traverse the tree and draw each item as appropriate
    */
    let nodeCursor: Node = structure.root
    let drawCursor: Array<number> = [100, 400]

    for (const element:Node of nodeCursor.daughters) {
        console.log(typeof element)
        if (element.type == 'UnpairedNode') {
            drawCursor = drawUnstructured(drawCursor, element)
        } else if (element.type == 'StemNode') {
            drawCursor = drawStem(drawCursor, element)
        } else if (element.type == 'TerminalLoop') {
            drawCursor = drawTerminalLoop(drawCursor, element)
        }
    }

}

export function drawUnstructured(drawCursor, node): Array<number> {
    const chars = [...node.sequence]
    chars.forEach((c, i) {
        drawNucleotide(c, drawCursor[0], drawCursor[1])
        drawCursor[0] += 20
    })
    return drawCursor
}

export function drawStem(drawCursor, node: StemNode): Array<number> {
    const pairs = node.pairs

    pairs.forEach((p, i) {
        drawNucleotide(p[0], drawCursor[0], drawCursor[1])
        drawCursor[0] += 20
        drawNucleotide(p[1], drawCursor[0], drawCursor[1])
        drawCursor[0] -= 20
        drawCursor[1] -= 20
    })
    drawCursor[0] += 2*20
    drawCursor[1] += pairs.length*20
    return drawCursor
}

export function drawTerminalLoop(drawCursor, node): Array<number> {
    const n_polygon_sides = 2 + node.sequence.length
    const sum_polygon_angles = (n_polygon_sides - 2) * 180
    const each_internal_angle = sum_polygon_angles/n_polygon_sides

    const chars = [...node.sequence]
    chars.forEach((c, i) {
        drawCursor[0] += 20*Math.sin(i*(2*Math.PI/n_polygon_sides))
        drawCursor[1] += 20*Math.cos(i*(2*Math.PI/n_polygon_sides))
        console.log(drawCursor)
        drawNucleotide(c, drawCursor[0], drawCursor[1])
    })
    return drawCursor
}