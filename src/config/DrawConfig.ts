import { Point } from 'paper/dist/paper-core'

/**
 * DrawConfig interface
 * 
 * Here, we declare an interface that defines the shape and 
 * types of the drawing configuration variables.
 * 
 * We then make a default config object for consumption.
 * 
 */
export interface DrawConfig {
    origin: Point,

    ntRadius: number,
    ntSpacing: number,
    ntFillColor: string,
    ntStrokeColor: string,
    ntStrokeWidth: number,

    ntNucleotides: Array<string>,
    ntColors: Array<string>

    bpLength: number,
    bpStrokeSize: number,
    terminalLoopRadius: number,
}

export const DefaultConfig: DrawConfig = {
    origin: new Point(200, 400),

    ntRadius: 10,
    ntSpacing: 30,
    ntFillColor: 'white',
    ntStrokeColor: 'gray',
    ntStrokeWidth: 0.25,

    ntNucleotides: ['A', 'U', 'C', 'G'],
    ntColors: ['#ff70a6', '#ffd670', '#06d6a0', '#70d6ff'],

    bpLength: 40,
    bpStrokeSize: 1,

}
