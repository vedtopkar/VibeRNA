
import { Path, Point, view, setup, PointText } from "paper/dist/paper-core"
import { Structure } from "./structure"
import { Node, StructureTree, UnpairedNode, StemNode, TerminalLoopNode } from "./tree"

export class DrawTree {
    /*
    Here we construct a DrawTree class that owns the tree of references to all drawn elements
    */
    public structure: Structure

    // The DrawTree object holds references to all drawn objects for easy updating
    public drawn_elements: object = {
        'unpaired': [],
        'stems': [],
        'terminalLoops': [],
        'internalLoops': [],
        'multiLoops': [],
        'basePairs': [],
        'nucleotides': [],
    }

    // Initial
    // TODO: Move to separate config file
    public drawConfig: object = {
        'origin': new Point(200,  400),
        'nucleotideRadius': 40,
        'nucleotideSpacing': 40,
        'bpLength': 40,
        'bpStrokeSize': 2,
        'terminalLoopRadius': 40,
    }

    public drawTreeDispatch() {
        console.log('Beginning to draw')
        let t: StructureTree = this.structure.structureTree

        let drawCursor: Point = this.drawConfig['origin'].clone()

        for (const node: Node of t.root.daughters) {
            switch (node.type) {
                case 'UnpairedNode': {
                    console.log('Unpaired')
                    drawCursor = this.drawUnpaired(drawCursor, node)
                    break
                }
                case 'StemNode': {
                    console.log('Stem')
                    drawCursor = this.drawTreeRecursive(drawCursor, node)
                    drawCursor.x += this.drawConfig['bpLength'] + this.drawConfig['nucleotideSpacing']
                    drawCursor.y += node.pairs.length*this.drawConfig['nucleotideSpacing']
                    break
                }
            }
        }
    }

    public drawTreeRecursive(drawCursor: Point, node: Node) {
        console.log('Beginning recursive draw', drawCursor)
        switch(node.type) {
            case 'StemNode': {
                drawCursor = this.drawStem(drawCursor, node)
                if(node.daughters.length = 1) {
                    this.drawTreeRecursive(drawCursor, node.daughters[0])
                }
                break
            }
            case 'TerminalLoopNode': {
                drawCursor = this.drawTerminalLoop(drawCursor, node)
                break
            }
        }
        return drawCursor

    }

    private drawUnpaired(drawCursor: Point, node): Point {
        const chars = [...node.sequence]
    
        chars.forEach((c, i) {
            let n = new Nucleotide(c, drawCursor)
            n.drawNucleotide()
            this.drawn_elements['nucleotides'].push(n)
            drawCursor.x += this.drawConfig['nucleotideSpacing']
        })
        console.log(drawCursor)
        return drawCursor
    }

    private drawStem(drawCursor: Point, node: StemNode) {
    
        node.pairs.forEach((p, i) {
            console.log(p)
            let l = new Nucleotide(p[0], drawCursor)
            l.drawNucleotide()

            let p1: Point = drawCursor.clone()
            drawCursor.x += this.drawConfig['bpLength']

            let p2: Point = drawCursor.clone()
            let r = new Nucleotide(p[1], drawCursor)
            r.drawNucleotide()
            drawCursor.x -= this.drawConfig['bpLength']
            drawCursor.y -= this.drawConfig['nucleotideSpacing']

            let bp = new Path.Line(p1, p2)
            bp.strokeColor = 'black'
            bp.strokeWidth = 5
            bp.sendToBack()

            this.drawn_elements['nucleotides'].push(l)
            this.drawn_elements['nucleotides'].push(r)
        })

        return drawCursor
    }

    private drawTerminalLoop(drawCursor: Point, node: TerminalLoopNode) {
        /*
        This is a bit tricky, math time!
        
        First, we create a vector v1 that starts at the 5' side of the last bp in the helix
        and goes to the 3' side of that last bp. The tangent to this vector points towards
        the loop centerpoint.

        Second, we figure out the angle theta between the above vector, and either
        of the two end nucleotides to the center (which is a vector of length radius).
        theta = arccos(|v1|/2r)

        Third, we find the centerpoint by rotating v1 by theta and scaling to length r
        (this is the vector v3)

        Fourth, we calculate the total angle used up by the two end-nucleotides.
        phi = 2arcsin(|v1|/2r)

        Fifth, we use calculate the amount of angle each terminal loop nt gets
        (360 - phi)/n

        Finally, starting at the centerpoint, draw each nucleotide rotationally 

        */
        console.log('terminal loop')

        // NOTE: In paperjs, vectors are still of type Point
        let r: number = this.drawConfig['terminalLoopRadius']

        let p1: Point = this.drawn_elements['nucleotides'][this.drawn_elements['nucleotides'].length - 2].center
        let p2: Point = this.drawn_elements['nucleotides'][this.drawn_elements['nucleotides'].length - 1].center


        let v1: Point = p2.subtract(p1)

        let theta: number = 180*Math.acos(v1.length/(2*r))/Math.PI
        let C = v1.clone()
        C.angle -= theta
        C.length = r
        C = C.add(p1)

        let v2: Point = p2.subtract(C)
        let v3: Point = p1.subtract(C)


        // let phi: number = 180*2*Math.asin(v1.length/(2*r))/Math.PI
        let phi: number = 180 - 2*theta
        console.log(phi)

        let angle_initial: number = v3.angle
        let angle_increment: number = (360 - phi)/(node.sequence.length+1)
        
        console.log(theta, phi, p1, p2, v1, v2, v3, C)
        console.log(angle_initial, angle_increment, node.sequence.length)
        const chars = [...node.sequence]

        // let c = new Path.Circle(C, r)
        // c.strokeColor = 'black'
        

        chars.forEach((c, i) {
            let center = C.clone()
            center.y += r*Math.sin(Math.PI*(angle_initial + (i+1)*angle_increment)/180)
            center.x -= r*Math.cos(Math.PI*(angle_initial + (i+1)*angle_increment)/180)

            let nt = new Nucleotide(c, center)
            nt.drawNucleotide()
            console.log(center, (angle_initial - (i+1)*angle_increment))

            this.drawn_elements['nucleotides'].push(nt)
        })

    }

    constructor(structure: Structure) {
        this.structure = structure
        console.log('Initialized DrawTree object')
    }
}

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
        offset_center.x -= 4
        offset_center.y += 4
        const text = new PointText(offset_center)
        text.content = this.letter

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
    
        // circle.onMouseDrag = function(event) {
        //     console.log(circle.position)
        //     circle.position = event.point
        //     console.log(circle.position)
        // }
    }

}



// export function drawStem(drawCursor: Point, node): Point {
// continue
// }

// export function drawRNA(structure: StructureTree) {
//     /*
//     Given a StructureTree, draw that structure!

//     We recursively traverse the tree and draw each item as appropriate
//     */
//     let nodeCursor: Node = structure.root



    

//     for (const element:Node of nodeCursor.daughters) {
//         console.log(typeof element)
//         if (element.type == 'UnpairedNode') {
//             drawCursor = drawUnstructured(drawCursor, element)
//         } else if (element.type == 'StemNode') {
//             drawCursor = drawStem(drawCursor, element)
//         } else if (element.type == 'TerminalLoop') {
//             drawCursor = drawTerminalLoop(drawCursor, element)
//         }
//     }

// }



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