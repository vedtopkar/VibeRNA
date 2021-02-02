"use strict";
/*

Draw RNA

The idea here is to read in a sequence and dot-bracket secondary structure, then draw it!

This requires 2 things:
1. Parse dot-bracket string in a tree format to allow for easy drawing
2. Draw the dot-bracket using paper.js

*/
Object.defineProperty(exports, "__esModule", { value: true });
var paper_core_1 = require("paper/dist/paper-core");
// import { setup, Path, Point, Line, install, view, Tool, DomEvent } from "paper/dist/paper-core"
var structure_1 = require("./structure/structure");
var draw_1 = require("./draw");
var PanAndZoom_1 = require("./interact/PanAndZoom");
var name_field = document.getElementById('name');
var sequence_field = document.getElementById('sequence');
var structure_field = document.getElementById('structure');
console.log(paper_core_1.paper);
paper_core_1.paper.install(window);
// Initialize structure object with inputted values
var s = new structure_1.Structure(name_field.value, sequence_field.value, structure_field.value);
// Initialize canvas for PaperJS
var canvas = document.getElementById("render");
paper_core_1.paper.setup(canvas);
// Initialize PanAndZoom
var panAndZoom = new PanAndZoom_1.PanAndZoom();
paper_core_1.paper.view.scale(1);
// Initialize PaperJS Tool for event listening
var toolPan = new paper_core_1.paper.Tool();
// Pan on mousedrag
// toolPan.onMouseDrag = function (event) {
//     var delta = event.downPoint.subtract(event.point)
//     paper.view.scrollBy(delta)
// };
// Zoom on scroll
canvas.addEventListener('wheel', function (e) {
    console.log(e);
    // Zoom on mousewheel
    var newZoom = 1;
    var offset = 0;
    var mousePosition = paper_core_1.paper.DomEvent.getOffset(e, canvas);
    var viewPosition = paper_core_1.paper.view.viewToProject(mousePosition);
    var viewCenter = new Point(paper_core_1.paper.view.center.x, paper_core_1.paper.view.center.y);
    // console.log('wheel', viewCenter, viewPosition)
    var result = panAndZoom.changeZoom(paper_core_1.paper.view.zoom, e.deltaY, viewCenter, viewPosition);
    console.log(result);
    paper_core_1.paper.view.zoom = result[0];
    // NOTE: Uncomment if you want zooming to happen under the mouse
    // paper.view.center = view.center.add(result[1])
    e.preventDefault();
});
var ade_example = document.getElementById('load-dummy');
ade_example.addEventListener('click', function (e) {
    name_field.value = 'Ade example';
    sequence_field.value = 'GAUCAACGCUUCAUAUAAUCCUAAUGAUAUGGUUUGGGAGUUUCUACCAAGAGCCUUAAACUCUUGAUUAUGAAGU';
    structure_field.value = '.......((((((((...((((((.........))))))........((((((.......))))))..))))))))';
});
var p4p6_example = document.getElementById('load-p4p6');
p4p6_example.addEventListener('click', function (e) {
    name_field.value = 'P4P6';
    sequence_field.value = 'GGAAUUGCGGGAAAGGGGUCAACAGCCGUUCAGUACCAAGUCUCAGGGGAAACUUUGAGAUGGCCUUGCAAAGGGUAUGGUAAUAAGCUGACGGACAUGGUCCUAACCACGCAGCCAAGUCCUAAGUCAACAGAUCUUCUGUUGAUAUGGAUGCAGUUCA';
    structure_field.value = '.....((((((...((((((.....(((.((((.(((..(((((((((....)))))))))..((.......))....)))......)))))))....))))))..)).))))((...((((...(((((((((...)))))))))..))))...))...';
});
var draw_button = document.getElementById('draw');
draw_button.addEventListener('click', function (e) {
    // Initialize a new structure with the
    var s = new structure_1.Structure(name_field.value, sequence_field.value, structure_field.value);
    // Clear canvas
    var canvas = document.getElementById("render");
    window.paper.project.clear();
    // Make a new drawing and draw it
    window.drawing = new draw_1.Drawing(s, window.paper.view);
    window.drawing.drawTreeDispatch();
    window.drawing.centerAndZoomDrawing();
});
// Whenever the window is resized, recenter the drawing and change zoom if needed
window.paper.view.onResize = function (event) {
    window.drawing.centerAndZoomDrawing(window.paper.view, window.drawing);
};
canvas.addEventListener('mouseup', function (e) {
    window.drawing.centerAndZoomDrawing();
});
var download_svg = document.getElementById('download-svg');
download_svg.addEventListener('click', function (e) {
    var fileName = name_field.value + ".svg";
    var url = "data:image/svg+xml;utf8," + encodeURIComponent(window.paper.project.exportSVG({ asString: true }));
    var link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
    link.remove();
});
var download_png = document.getElementById('download-png');
var that = this;
download_png.addEventListener('click', function (e) {
    var png = document.getElementById("render").toDataURL();
    var fileName = name_field.value + ".png";
    var link = document.createElement('a');
    link.download = fileName;
    link.href = png;
    link.click();
    link.remove();
});
// Kick off the sample
// dummy_example.click(
document.addEventListener('DOMContentLoaded', function () {
    console.log('loaded');
    ade_example.click();
    draw_button.click();
}, false);
var dropdown = document.querySelector('.dropdown');
dropdown.addEventListener('click', function (event) {
    event.stopPropagation();
    dropdown.classList.toggle('is-active');
});
