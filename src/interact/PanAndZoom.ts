import { paper } from "paper/dist/paper-core"

// Logic for simple panning and zooming of the canvas
// adapted from this informative script: https://github.com/mberth/PanAndZoom/blob/master/app/scripts/pan_and_zoom.coffee
export class PanAndZoom {

    public computeNewZoom(oldZoom: number, deltaY: number) {
        const factor = 1.025
        if (deltaY < 0) {
            return oldZoom * factor
        } else if (deltaY > 0) {
            return oldZoom / factor
        } else {
            return oldZoom
        }
    }

    public changeZoom(oldZoom: number, deltaY: number, c:Point, p: Point) {
        const newZoom = this.computeNewZoom(oldZoom, deltaY)
        const beta = oldZoom/newZoom

        const pc = p.subtract(c)
        let a = p.subtract(pc.multiply(beta)).subtract(c)
        console.log([newZoom, a])
        return [newZoom, a]
    }

    public changeCenter(oldCenter: Point, deltaX: number, deltaY: number, factor: number) {
        let offset = new paper.Point(deltaX, -deltaY)
        offset = offset.multiply(factor)
        return oldCenter.add(offset)
    }
}