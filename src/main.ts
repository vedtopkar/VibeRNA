/*

Draw RNA

The idea here is to read in a sequence and dot-bracket secondary structure, then draw it!

This requires 2 things:
1. Parse dot-bracket string in a tree format to allow for easy drawing
2. Draw the dot-bracket using paper.js

*/

import { setup, Path, Point, Line } from "paper/dist/paper-core"
import 'bulma'

import { Structure } from './structure/structure'
import { Drawing } from "./draw"

const begin = () => {

	// Initialize structure object with inputted values
	let s:Structure = new Structure((<HTMLInputElement>document.getElementById('name')).value,
									(<HTMLInputElement>document.getElementById('sequence')).value,
									(<HTMLInputElement>document.getElementById('structure')).value)

	// Initialize canvas for PaperJS
	const canvas: HTMLCanvasElement = document.getElementById("render") as HTMLCanvasElement
	setup(canvas)

	// Draw the structure
	const d: Drawing = new Drawing(s)
	d.drawTreeDispatch()

}

window.onload = begin


								
