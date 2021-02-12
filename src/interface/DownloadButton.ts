
export function initializeDownloadButtons(nameField) {
    let downloadSVGButton = document.getElementById('download-svg')
    let downloadPNGButton = document.getElementById('download-png')

    downloadSVGButton.addEventListener('click', function (e) {
        let name = nameField.value
        downloadSVG(name)
    })

    downloadPNGButton.addEventListener('click', function (e:) {
        let name = nameField.value
        downloadPNG(name)
    })
}

export function downloadSVG(name) {
    let fileName = `${name}.svg`
    let url = "data:image/svg+xml;utf8," + encodeURIComponent(window.paper.project.exportSVG({asString:true}))
    let link = document.createElement("a")
    link.download = fileName
    link.href = url
    link.click()
    link.remove()
}

export function downloadPNG(name) {
    let render = document.getElementById("render") as HTMLCanvasElement
    let png = render.toDataURL()

    let fileName = `${name}.png`
    let link = document.createElement('a');
    link.download = fileName
    link.href = png;
    link.click();
    link.remove();
}