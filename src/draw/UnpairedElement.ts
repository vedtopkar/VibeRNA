import { DrawnElement } from './DrawnElement'

export class UnpairedElement extends DrawnElement {
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
}