/*

Draw RNA

The idea here is to read in a sequence and dot-bracket secondary structure, then draw it!

This requires 2 things:
1. Parse dot-bracket string in a tree format to allow for easy drawing
2. Draw the dot-bracket using paper.js

*/

import { paper, view } from 'paper/dist/paper-core'
// import { setup, Path, Point, Line, install, view, Tool, DomEvent } from "paper/dist/paper-core"
import 'bulma'

import { Structure } from './structure/structure'
import { Drawing } from "./draw"
import { PanAndZoom } from './interact/PanAndZoom'

let name_field: HTMLInputElement = document.getElementById('name')
let sequence_field: HTMLInputElement = document.getElementById('sequence')
let structure_field: HTMLInputElement = document.getElementById('structure')

console.log(paper)
paper.install(window)

// Initialize structure object with inputted values
let s:Structure = new Structure(name_field.value, sequence_field.value, structure_field.value)

// Initialize canvas for PaperJS
const canvas: HTMLCanvasElement = document.getElementById("render") as HTMLCanvasElement
paper.setup(canvas)

// Initialize PanAndZoom
const panAndZoom:PanAndZoom = new PanAndZoom()
let zoomFactor:number = 1.05
paper.view.scale(1)


// Initialize PaperJS Tool for event listening
const toolPan = new paper.Tool()

// Pan on mousedrag
// toolPan.onMouseDrag = function (event) {
//     var delta = event.downPoint.subtract(event.point)
//     paper.view.scrollBy(delta)
// };

// Zoom on scroll
canvas.addEventListener('wheel', (e:WheelEvent) {
	console.log(e)
	// Zoom on mousewheel
	let newZoom: number = 1
	let offset: number = 0

	let mousePosition = paper.DomEvent.getOffset(e, canvas)
	let viewPosition = paper.view.viewToProject(mousePosition)
	let viewCenter = new Point(paper.view.center.x, paper.view.center.y)

	// console.log('wheel', viewCenter, viewPosition)
	let result = panAndZoom.changeZoom(paper.view.zoom, e.deltaY, viewCenter, viewPosition)
	console.log(result)
	paper.view.zoom = result[0]

	// NOTE: Uncomment if you want zooming to happen under the mouse
	// paper.view.center = view.center.add(result[1])
	e.preventDefault()
})

let dummy_example = document.getElementById('load-dummy')
dummy_example.addEventListener('click', (e:Event) {
	name_field.value = 'Dummy example'
	sequence_field.value = 'AAAAAGGGGGABGGGGAAACCCCDGGGGAAACCCACCCCCAAAAAAAAAAGGGGAGGGGAAAAAAACCCCACCCAAAAA'
	structure_field.value ='.....(((((..(((....)))..(((....))).)))))..........((((.(((........)))).))).....'
})

let p4p6_example = document.getElementById('load-p4p6')
p4p6_example.addEventListener('click', (e:Event) {
	name_field.value = 'P4P6'
	sequence_field.value = 'GGAAUUGCGGGAAAGGGGUCAACAGCCGUUCAGUACCAAGUCUCAGGGGAAACUUUGAGAUGGCCUUGCAAAGGGUAUGGUAAUAAGCUGACGGACAUGGUCCUAACCACGCAGCCAAGUCCUAAGUCAACAGAUCUUCUGUUGAUAUGGAUGCAGUUCA'
	structure_field.value = '.....((((((...((((((.....(((.((((.(((..(((((((((....)))))))))..((.......))....)))......)))))))....))))))..)).))))((...((((...(((((((((...)))))))))..))))...))...'
})

let draw_button = document.getElementById('draw')
draw_button.addEventListener('click', (e:Event) {

	// Initialize a new structure with the
	let s = new Structure(name_field.value, sequence_field.value, structure_field.value)

	// Clear canvas
	const canvas: HTMLCanvasElement = document.getElementById("render") as HTMLCanvasElement
	window.paper.project.clear()

	// Make a new drawing and draw it
	window.drawing = new Drawing(s)
	drawing.drawTreeDispatch()
	
	panAndZoom.centerAndZoomDrawing(window.paper.view, window.drawing)
	
})


// Whenever the window is resized, recenter the drawing and change zoom if needed
window.paper.view.onResize = function(event) {
	panAndZoom.centerAndZoomDrawing(window.paper.view, window.drawing)
})

let download_svg = document.getElementById('download-svg')
download_svg.addEventListener('click', (e:Event) {
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
download_png.addEventListener('click', (e:Event) {
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
	draw_button.click()
}, false);