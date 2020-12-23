/*

Draw RNA

The idea here is to read in a sequence and dot-bracket secondary structure, then draw it!

This requires 2 things:
1. Parse dot-bracket string in a tree format to allow for easy drawing
2. Draw the dot-bracket using paper.js

*/

import { Path, Point, view, setup } from "paper/dist/paper-core"
import { Structure } from './structure'

const begin = () => {

	const canvas: HTMLCanvasElement = document.getElementById("render") as HTMLCanvasElement
	setup(canvas)
	const path = new Path()
	path.strokeColor = "black"

	const start = new Point(100, 100)
	path.moveTo(start)
	path.lineTo(start.add([200, -50]))
	view.draw()

}

window.onload = begin

// Initialize structure object with inputted values
let s:Structure = new Structure((<HTMLInputElement>document.getElementById('name')).value,
                                (<HTMLInputElement>document.getElementById('sequence')).value,
                                (<HTMLInputElement>document.getElementById('structure')).value)
