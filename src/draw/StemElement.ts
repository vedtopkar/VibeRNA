import { DrawnElement } from './DrawnElement'

export class StemElement extends DrawnElement {
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
}