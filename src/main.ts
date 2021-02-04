/*

Draw RNA

The idea here is to read in a sequence and dot-bracket secondary structure, then draw it!

This requires 2 things:
1. Parse dot-bracket string in a tree format to allow for easy drawing
2. Draw the dot-bracket using paper.js

*/

import { paper, view } from 'paper/dist/paper-core'
import 'bulma'
// import { setup, Path, Point, Line, install, view, Tool, DomEvent } from "paper/dist/paper-core"


import { Structure } from './structure/structure'
import { Drawing } from "./draw"
import { PanAndZoom } from './interact/PanAndZoom'

let name_field: HTMLInputElement = document.getElementById('name')
let sequence_field: HTMLInputElement = document.getElementById('sequence')
let structure_field: HTMLInputElement = document.getElementById('structure')
let reactivity_field: HTMLInputElement = document.getElementById('reactivity')

console.log(paper)
paper.install(window)

// Initialize structure object with inputted values
let s:Structure = new Structure(name_field.value, sequence_field.value, structure_field.value)

// Initialize canvas for PaperJS
const canvas: HTMLCanvasElement = document.getElementById("render") as HTMLCanvasElement
paper.setup(canvas)

// Initialize PanAndZoom
const panAndZoom:PanAndZoom = new PanAndZoom()
paper.view.scale(1)


// Initialize PaperJS Tool for event listening
const toolPan = new paper.Tool()

// Pan on mousedrag
// toolPan.onMouseDrag = function (event) {
//     var delta = event.downPoint.subtract(event.point)
//     paper.view.scrollBy(delta)
// };

// Zoom on scroll
canvas.addEventListener('wheel', function (e:WheelEvent) {
	// Zoom on mousewheel
	let newZoom: number = 1
	let offset: number = 0

	let mousePosition = paper.DomEvent.getOffset(e, canvas)
	let viewPosition = paper.view.viewToProject(mousePosition)
	let viewCenter = new Point(paper.view.center.x, paper.view.center.y)

	// console.log('wheel', viewCenter, viewPosition)
	let result = panAndZoom.changeZoom(paper.view.zoom, e.deltaY, viewCenter, viewPosition)
	paper.view.zoom = result[0]

	// NOTE: Uncomment if you want zooming to happen under the mouse
	// paper.view.center = view.center.add(result[1])
	e.preventDefault()
})

let ade_example = document.getElementById('load-dummy')
ade_example.addEventListener('click', function (e) {
	name_field.value = 'Ade example'
	sequence_field.value = 'ggaaaggaaagggaaagaaACGCUUCAUAUAAUCCUAAUGAUAUGGUUUGGGAGUUUCUACCAAGAGCCUUAAACUCUUGAUUAUGAAGUGaaaacaaaacaaagaaacaacaacaacaac'
	structure_field.value ='....................(((((((((...((((((.........))))))........((((((.......))))))..)))))))))..............................'
	reactivity_field.value='0.6775,0.5422,0.2528,0.655,0.4755,0.0057,0.5808,0.6561,0.2812,0.2412,0.7743,0.8104,0.2768,0.0875,0.3538,0.2732,0.4146,0.0933,0.0538,0.0493,0.018,0.0504,0.0711,0.028,0.0646,0.0285,0.1416,0.1264,0.0243,0.0188,0.0364,0.0233,0.1087,0.0919,0.0519,0.0783,0.1341,0.0156,0.384,0.1599,0.0161,0.0193,-0.0153,0.0028,0.0346,0.0009,0.0769,0.0069,0.024,-0.0063,0.0232,0.0377,-0.0463,-0.0096,0.0387,0.0218,0.0455,-0.0075,0.0328,0.0713,0.0102,0.0949,0.0075,0.0231,0.0325,0.0696,0.0263,0.5351,0.1938,0.1135,0.0678,0.0003,-0.0016,0.0063,0.0321,0.0244,0.0868,0.017,0.0037,0.0416,0.054,0.0284,0.1237,0.1418,-0.1526,0.2069,0.3223,1.6037,0.8508,1.3139,1.0931'
})

let p4p6_example = document.getElementById('load-p4p6')
p4p6_example.addEventListener('click', function (e) {
	name_field.value = 'P4P6'
	sequence_field.value = 'GGAAUUGCGGGAAAGGGGUCAACAGCCGUUCAGUACCAAGUCUCAGGGGAAACUUUGAGAUGGCCUUGCAAAGGGUAUGGUAAUAAGCUGACGGACAUGGUCCUAACCACGCAGCCAAGUCCUAAGUCAACAGAUCUUCUGUUGAUAUGGAUGCAGUUCA'
	structure_field.value = '.....((((((...((((((.....(((.((((.(((..(((((((((....)))))))))..((.......))....)))......)))))))....))))))..)).))))((...((((...(((((((((...)))))))))..))))...))...'
})

let draw_button = document.getElementById('draw')
draw_button.addEventListener('click', function (e) {

	// Initialize a new structure with the
	let s = new Structure(name_field.value, sequence_field.value, structure_field.value)
	console.log(s)

	// Clear canvas
	const canvas: HTMLCanvasElement = document.getElementById("render") as HTMLCanvasElement
	window.paper.project.clear()

	// Make a new drawing and draw it
	window.drawing = new Drawing(s, window.paper.view)
	window.drawing.drawTreeDispatch()

	if(reactivity_field.value.length > 0) {
		window.drawing.paintReactivity(reactivity_field.value)
	}

	panAndZoom.centerAndZoom(window.paper.view, window.drawing)

	
})

// Whenever the window is resized, recenter the drawing and change zoom if needed
window.paper.view.onResize = function(event) {
	console.log('blah')
	window.drawing.centerAfterChange(window.paper.view, window.drawing)
}

canvas.addEventListener('mouseup', function(e) {
	panAndZoom.centerAndZoom(window.paper.view, window.drawing)
})

let download_svg = document.getElementById('download-svg')
download_svg.addEventListener('click', function (e) {
	let fileName = `${name_field.value}.svg`
	let url = "data:image/svg+xml;utf8," + encodeURIComponent(window.paper.project.exportSVG({asString:true}))
	let link = document.createElement("a")
	link.download = fileName
	link.href = url
	link.click()
	link.remove()
})

let download_png = document.getElementById('download-png')
let that = this
download_png.addEventListener('click', function  (e) {
	let png = document.getElementById("render").toDataURL()

	let fileName = `${name_field.value}.png`
	let link = document.createElement('a');
	link.download = fileName
	link.href = png;
	link.click();
	link.remove();
})

// Kick off the sample
// dummy_example.click(

document.addEventListener('DOMContentLoaded', function() {
	console.log('loaded')
	ade_example.click()
	draw_button.click()
}, false);

let dropdown = document.querySelector('.dropdown');
dropdown.addEventListener('click', function(event) {
  event.stopPropagation();
  dropdown.classList.toggle('is-active');
});