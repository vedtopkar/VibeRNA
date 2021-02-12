

export function initializeAdjustAfterWindowResize() {

    // Whenever the window is resized, recenter the drawing and change zoom if needed
    window.paper.view.onResize = function(event) {
        panAndZoom.centerDrawing(window.paper.view, window.drawing)
    }

}