import { Path } from 'paper/dist/paper-core'
import { Drawing } from '../draw'
import { Structure } from '../structure/structure'
import { BasePairElement } from './BasePairElement'
import { DrawnElement } from './DrawnElement'
import { Nucleotide } from './Nucleotide'
import { StemElement } from './StemElement'
import { Node } from '../structure/nodes'
import { exit } from 'process'
import { UnpairedElement } from './UnpairedElement'

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
    public baseStart: Point

    public node: Node
    public radius: number
    public center: Point

    public minRadius: number
    public defaultRadius: number

    // An array that logs the amount of angle consumed by each daughter element
    public daughterAngles: Array<Array<number>> = []


    constructor(drawing: Drawing, parentElement: DrawnElement, node: Node) {
        super(drawing, parentElement)
        this.node = node

        this.baseBp = this.parentElement.basePairs.slice(-1)[0]
        this.baseVector = this.baseBp.drawVector
        this.baseStart = this.baseBp.startPoint


        this.computeRadius() // compute 
    }

    // TODO: Tinker with this...
    private computeRadius(): void {

        this.minRadius = this.drawing.config.bpLength + 2*this.drawing.config.ntRadius
        this.defaultRadius = this.drawing.config.bpLength + 2*this.drawing.config.ntRadius

        // Iterate through the circle and tally up the circumference
        this.node.daughters.forEach((c,i) => {
            switch (c.type) {
                case 'UnpairedNode': {
                    this.minRadius += 2*(c.sequence.length+1)*this.drawing.config.ntRadius
                    this.defaultRadius += (c.sequence.length + 1)*this.drawing.config.ntSpacing
                    // this.defaultRadius += (c.sequence.length + 1)*this.drawing.config.ntSpacing
                    break
                }

                case 'StemNode': {
                    this.minRadius += this.drawing.config.bpLength
                    this.defaultRadius += this.drawing.config.bpLength + 2*this.drawing.config.ntRadius
                }

            }
        })

        // Divide our circumferences by 2pi to get our radii
        this.minRadius /= 2*Math.PI
        this.defaultRadius /= 2*Math.PI
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

        Fourth, we calculate the total angle used up by the two base-nucleotides.
        This is the same angle used up by all stems in the loop
        phi = 2arcsin(|v1|/2r)

        Fifth, we use calculate the amount of angle each terminal loop nt gets
        (360 - phi)/n

        Finally, starting at the centerpoint, draw each nucleotide rotationally 

        */

        'use strict';

        // NOTE: In paperjs, vectors are still of type Point
        let r: number = this.defaultRadius
        let bp: BasePairElement = this.parentElement.basePairs.slice(-1)[0]
        let p1: Point = bp.nucleotides[0].center
        let p2: Point = bp.nucleotides[1].center
        let v1: Point = p2.subtract(p1)

        let theta: number = 180*Math.acos(v1.length/(2*r))/Math.PI

        let C = v1.clone()
        C.angle -= theta
        C.length = r
        C = C.add(p1)
        this.center = C

        let v2: Point = p2.subtract(C)
        let v3: Point = p1.subtract(C)

        let phi: number = 180 - 2*theta

        // Count up the number of bp vs unpaired nts in the loop
        let bps: number = 1
        let nts: number = 0
        this.node.daughters.forEach((n, i) => {
            switch (n.type) {
                case 'UnpairedNode' {
                    nts += n.sequence.length
                    break
                }
                case 'StemNode' {
                    bps += 1
                    break
                }
            }
        })


        // TODO explain this
        let nt_angle_increment: number = (360 - bps*phi)/(nts + bps)
        let bp_angle_increment: number = phi

        let angle_cursor: number = v3.angle + nt_angle_increment

        let c = new Path.Circle(C, r)
        // c.strokeColor = 'black'

        // Iterate through the nodes along the circle and draw
        this.node.daughters.forEach((n, i) => {
            switch (n.type) {
                case 'UnpairedNode' {
                    let u: UnpairedElement = new UnpairedElement(this.drawing, this, n)
                    let chars = [...n.sequence]
                    let endAngle = angle_cursor + nt_angle_increment*(chars.length - 1)

                    u.drawCircular(C, r, angle_cursor, endAngle)
                    
                    this.daughterElements.push(u)
                    this.daughterAngles.push([angle_cursor, endAngle])

                    angle_cursor = endAngle + nt_angle_increment
                    break
                }
                case 'StemNode': {
                    // When we get to the stem, we make a new helix and kick off the next recursive round
                    let startPoint = C.clone()
                    startPoint.y += r*Math.sin(Math.PI*angle_cursor/180)
                    startPoint.x += r*Math.cos(Math.PI*angle_cursor/180)

                    this.daughterAngles.push([angle_cursor, angle_cursor + bp_angle_increment])
                    angle_cursor += bp_angle_increment

                    let endPoint = C.clone()
                    endPoint.y += r*Math.sin(Math.PI*angle_cursor/180)
                    endPoint.x += r*Math.cos(Math.PI*angle_cursor/180)

                    let startVector = endPoint.subtract(startPoint)

                    angle_cursor += nt_angle_increment

                    this.daughterElements.push(this.drawing.drawTreeRecursive(n, this, startPoint, startVector))
                    
                    break
                }
            }
        })
    }

    // Rotate each daughter element to rotate this circle
    public rotateCircularly(angle, center) {
        this.daughterElements.forEach((e, i) {
            e.rotateCircularly(angle, center)
        })
    }

    // After a daughter stem is dragged, rearrange the 5' and 3' elements (if unpaired)
    public rearrangeAfterDrag(stem: StemElement, angle) {
        let stem_index = this.daughterElements.indexOf(stem)
        let stem_angles = this.daughterAngles[stem_index]

        console.log('rearrange', stem_index, stem_angles)

        if (stem_index > 0) {
            // rearrange the stuff before
            let before_element = this.daughterElements[stem_index - 1]
            console.log('before element', before_element)
            before_element.rearrangeCircular(before_element.angleStart, stem.stemDirectionVector.angle)

        }

        if (stem_index < this.daughterElements.length) {
            // rearrange the stuff after
            let after_element = this.daughterElements[stem_index + 1]
            console.log('after element', after_element)
            after_element.rearrangeCircular(stem.stemDirectionVector.angle, after_element.angleEnd)
        }
    }
}