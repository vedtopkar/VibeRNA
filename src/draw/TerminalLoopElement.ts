import { DrawnElement } from './DrawnElement'

export class TerminalLoopElement extends DrawnElement {
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
            center.x += r*Math.cos(Math.PI*(angle_initial + (i+1)*angle_increment)/180)

            let nt = new Nucleotide(c, center)
            nt.drawNucleotide()
            console.log(center, (angle_initial - (i+1)*angle_increment))

            this.drawn_elements['nucleotides'].push(nt)
        })

    }
}