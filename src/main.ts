/*

Draw RNA

The idea here is to read in a sequence and dot-bracket secondary structure, then draw it!

This requires 2 things:
1. Parse dot-bracket string in a tree format to allow for easy drawing
2. Draw the dot-bracket using paper.js

*/

import { setup, Path, Point, Line, install } from "paper/dist/paper-core"
import 'bulma'

import { Structure } from './structure/structure'
import { Drawing } from "./draw"

let name_field: HTMLInputElement = document.getElementById('name')
let sequence_field: HTMLInputElement = document.getElementById('sequence')
let structure_field: HTMLInputElement = document.getElementById('structure')

install(window)
const begin = () => {

	// Initialize structure object with inputted values
	let s:Structure = new Structure(name_field.value, sequence_field.value, structure_field.value)

	// Initialize canvas for PaperJS
	const canvas: HTMLCanvasElement = document.getElementById("render") as HTMLCanvasElement
	setup(canvas)

	// Draw the structure
	const d: Drawing = new Drawing(s)
	d.drawTreeDispatch()

}

window.onload = begin

let dummy_example = document.getElementById('load-dummy')
dummy_example.addEventListener('click', (e:Event) {
	name_field.value = 'Dummy test example'
	sequence_field.value = 'AAAACCCGAAAGGGAAAAAAAACCCAAGGGGAAACCCAAGGGAAAA'
	structure_field.value = '....(((....)))........(((..(((....)))..)))....'
})
								
let p4p6_example = document.getElementById('load-p4p6')
p4p6_example.addEventListener('click', (e:Event) {
	name_field.value = 'P4P6'
	sequence_field.value = 'AAAACCCGAAAGGGAAAAAAAACCCAAGGGGAAACCCAAGGGAAAA'
	structure_field.value = '....(((....)))........(((..(((....)))..)))....'
})

let draw_button = document.getElementById('draw')
draw_button.addEventListener('click', (e:Event) {

	// Initialize a new structure with the
	let s = new Structure(name_field.value, sequence_field.value, structure_field.value)

	// Clear canvas
	const canvas: HTMLCanvasElement = document.getElementById("render") as HTMLCanvasElement
	window.paper.project.clear()

	// Make a new drawing and draw it
	const d: Drawing = new Drawing(s)
	d.drawTreeDispatch()
})