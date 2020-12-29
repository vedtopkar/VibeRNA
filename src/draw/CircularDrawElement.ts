import { Path } from 'paper/dist/paper-core'
import { Drawing } from '../draw'
import { Structure } from '../structure/structure'
import { BasePairElement } from './BasePairElement'
import { DrawnElement } from './DrawnElement'
import { Nucleotide } from './Nucleotide'
import { StemElement } from './StemElement'
import { Node } from '../structure/nodes'

/**
 * Circular Draw Element
 * 
 * The math behind layout out bulges, internal loops, multi-loops, and terminal loops, are pretty much the same!
 * So, we can abstract that math up a level to this class, which those classes extend.
 * Could probably even do all four as a single class, but for customization reasons I am splitting them up for now.
 * 
 */
export class CircularDrawElement extends DrawnElement {
    public parentElement: StemElement // All circular elements descend from stems

    public baseBp: BasePairElement // The base-pair at the base (end of the parent stem)
    public baseVector: Point

    public node: Node
    public radius: number = 0
    public minRadius: number = 0

    constructor(drawing: Drawing, parentElement: DrawnElement, node: Node) {
        super(drawing, parentElement)
        this.node = node

        this.baseBp = this.parentElement.basePairs.slice(-1)[0]
        this.baseVector = this.baseBp.drawVector

    }

    private configureRadius() {

        // Iterate through the daughter nodes and sum up the minimum radius
        this.node.daughters.forEach(n => {
            switch(n.type) {
                case ''
            }
        });
    }

    public draw() {
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

        // NOTE: In paperjs, vectors are still of type Point
        let r: number = this.radius
        let bp: BasePairElement = this.parentElement.basePairs.slice(-1)[0]
        let p1: Point = bp.nucleotides[0].center
        let p2: Point = bp.nucleotides[1].center


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
        // console.log(phi, theta)

        let angle_initial: number = v3.angle
        let angle_increment: number = (360 - phi)/(this.node.daughters[0].sequence.length+1)
        // console.log(theta, phi, p1, p2, v1, v2, v3, C)
        // console.log(angle_initial, angle_increment, this.node.daughters[0].sequence.length)
        const chars = [...this.node.daughters[0].sequence]
        console.log('here', chars)
        // let c = new Path.Circle(C, r)
        // c.strokeColor = 'black'
        
        chars.forEach((c, i) {
            let center = C.clone()
            center.y += r*Math.sin(Math.PI*(angle_initial + (i+1)*angle_increment)/180)
            center.x += r*Math.cos(Math.PI*(angle_initial + (i+1)*angle_increment)/180)

            let nt = new Nucleotide(this.drawing, c, center)
            nt.draw()

            this.drawing.nucleotides.push(nt)
        })
        
}