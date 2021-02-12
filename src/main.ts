/*

Draw RNA

The idea here is to read in a sequence and dot-bracket secondary structure, then draw it!

This requires 2 things:
1. Parse dot-bracket string in a tree format to allow for easy drawing
2. Draw the dot-bracket using paper.js

*/

import paper from 'paper/dist/paper-core'
import { ParseSecondaryStructure } from './structure/ParseSecondaryStructure'
import { Drawing } from "./draw"
import { PanAndZoom } from './interact/PanAndZoom'

import { initializeDownloadButtons } from "./interface/DownloadButton"
import { initializeResizeActions } from "./interface/Resize"

import 'bulma'
import {adjustAfterWindowResize, initializeAdjustAfterWindowResize} from "./interact/Resize";

let nameField = <HTMLInputElement>document.getElementById('name')
let sequence_field = <HTMLInputElement>document.getElementById('sequence')
let structure_field = <HTMLInputElement>document.getElementById('structure')
let reactivity_field = <HTMLInputElement>document.getElementById('reactivity')

console.log(paper)
paper.install(window)

// Initialize structure object with inputted values
let s:ParseSecondaryStructure = new ParseSecondaryStructure(nameField.value, sequence_field.value, structure_field.value)

// Initialize canvas for PaperJS
const canvas: HTMLCanvasElement = document.getElementById("render") as HTMLCanvasElement
paper.setup(canvas)

// Initialize PanAndZoom
const panAndZoom:PanAndZoom = new PanAndZoom()
paper.view.scale(1)


// Initialize PaperJS Tool for event listening
const toolPan = new paper.Tool()

// Pan on mousedrag
toolPan.onMouseDrag = function (toolEvent) {
	if(toolEvent.event.shiftKey) {
		var delta = toolEvent.downPoint.subtract(toolEvent.point)
		paper.view.scrollBy(delta)
	}
};

// Zoom on scroll
canvas.addEventListener('wheel', function (e:WheelEvent) {
	// Zoom on mousewheel
	let newZoom: number = 1
	let offset: number = 0

	let mousePosition = paper.DomEvent.getOffset(e, canvas)
	let viewPosition = paper.view.viewToProject(mousePosition)
	let viewCenter = new paper.Point(paper.view.center.x, paper.view.center.y)

	// console.log('wheel', viewCenter, viewPosition)
	let result = panAndZoom.changeZoom(paper.view.zoom, e.deltaY, viewCenter, viewPosition)
	paper.view.zoom = result[0]

	// NOTE: Uncomment if you want zooming to happen under the mouse
	// paper.view.center = view.center.add(result[1])
	e.preventDefault()
})

let ade_example = document.getElementById('load-dummy')
ade_example.addEventListener('click', function (e) {
	nameField.value = 'Ade example'
	sequence_field.value = 'aggaaagggaaagaaACGCUUCAUAUAAUCCUAAUGAUAUGGUUUGGGAGUUUCUACCAAGAGCCUUAAACUCUUGAUUAUGAAGUGaaaa'
	structure_field.value ='................(((((((((...((((((.........))))))........((((((.......))))))..)))))))))....'
	reactivity_field.value='0.6775,0.5422,0.2528,0.655,0.4755,0.0057,0.5808,0.6561,0.2812,0.2412,0.7743,0.8104,0.2768,0.0875,0.3538,0.2732,0.4146,0.0933,0.0538,0.0493,0.018,0.0504,0.0711,0.028,0.0646,0.0285,0.1416,0.1264,0.0243,0.0188,0.0364,0.0233,0.1087,0.0919,0.0519,0.0783,0.1341,0.0156,0.384,0.1599,0.0161,0.0193,-0.0153,0.0028,0.0346,0.0009,0.0769,0.0069,0.024,-0.0063,0.0232,0.0377,-0.0463,-0.0096,0.0387,0.0218,0.0455,-0.0075,0.0328,0.0713,0.0102,0.0949,0.0075,0.0231,0.0325,0.0696,0.0263,0.5351,0.1938,0.1135,0.0678,0.0003,-0.0016,0.0063,0.0321,0.0244,0.0868,0.017,0.0037,0.0416,0.054,0.0284,0.1237,0.1418,-0.1526,0.2069,0.3223,1.6037,0.8508,1.3139,1.0931'
})

let p4p6_example = document.getElementById('load-p4p6')
p4p6_example.addEventListener('click', function (e) {
	nameField.value = 'P4P6'
	sequence_field.value = 'aacaacgGAAUUGCGGGAAAGGGGUCAACAGCCGUUCAGUACCAAGUCUCAGGGGAAACUUUGAGAUGGCCUUGCAAAGGGUAUGGUAAUAAGCUGACGGACAUGGUCCUAACCACGCAGCCAAGUCCUAAGUCAACAGAUCUUCUGUUGAUAUGGAUGCAGUUCAAA'
	structure_field.value = '...........((((((...((((((.....(((.((((.(((..(((((((((....)))))))))..((.......))....)))......)))))))....))))))..)).))))((...((((...(((((((((...)))))))))..))))...)).................................'
	reactivity_field.value = '0.5408,0.5634,0.1589,0.2741,1.0856,0.8504,0.2532,0.0832,0.1018,0.7757,0.0618,-0.0396,-0.0212,0.023,-0.0711,-0.0201,-0.0142,0.4735,0.7753,0.8647,0.1322,0.0384,-0.071,-0.1452,0.0742,0.018,0.7733,0.3734,0.1586,0.537,0.2083,0.0619,0.0442,0.0316,0.001,0.0454,0.0743,0.1039,0.0644,0.0968,0.1289,0.0856,0.1454,1.449,1.3052,0.218,0.0997,0.0598,0.0687,0.0503,0.1325,0.1054,0.045,-0.0221,0.0003,0.1137,0.1755,0.2803,0.0638,0.0335,0.0445,0.0363,0.005,0.0963,0.1242,0.0746,0.0159,0.0312,-0.0409,0.0326,0.0213,-0.0299,-0.029,0.0351,0.0852,1.0694,1.5481,1.7888,0.083,0.0213,0.0111,0.0031,0.6551,-0.148,0.0311,-0.0098,0.0373,0.4167,0.2517,0.165,0.3134,0.3066,0.0457,0.0039,-0.0015,0.0544,0.1313,0.1605,0.0276,0.2908,0.3051,0.1675,0.5324,0.7015,0.029,0.0749,0.0732,0.1168,0.16,0.1591,1.2165,6.5496,0.6932,0.0833,0.6381,0.1545,0.0603,0.0852,0.3906,0.1181,0.0954,0.3332,2.3585,2.6426,0.4347,0.1824,0.134,0.0913,0.0901,0.2357,0.5703,0.1186,0.0989,0.1004,0.1547,0.1929,0.1394,0.1549,0.1609,0.4427,0.4208,0.2491,-0.0543,0.0392,0.0846,0.08,0.1016,0.1,0.0425,0.0722,0.1871,0.1743,0.158,0.0402,0.0372,0.1342,0.0966,0.0048,0.0277,0.322,-0.0549,0.1494,-0.3124,0.3709,0.3325,-0.0629,1.2839,0.539'
})

let draw_button = document.getElementById('draw')
draw_button.addEventListener('click', function (e) {

	// Initialize a new structure with the
	let s = new ParseSecondaryStructure(nameField.value, sequence_field.value, structure_field.value)
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



canvas.addEventListener('mouseup', function(e) {
	// if(e.altKey) {
		panAndZoom.centerAndZoom(window.paper.view, window.drawing)
		e.preventDefault()
	// }
})



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

// Initialize adjustments after window resize
initializeAdjustAfterWindowResize()

// Initialize download buttons
initializeDownloadButtons(nameField)