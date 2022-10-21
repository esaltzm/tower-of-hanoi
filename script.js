// initialize three rings on rod #1

let nRings = 3
let rodWidth = parseInt(getComputedStyle(document.querySelector('#rod1')).width.slice(0, -2))

for (let i = 0; i < nRings; i++) {
    let ring = document.createElement('div')
    ring.className = 'ring'
    ring.id = 'ring' + (i + 1)
    ring.style['background-color'] = 'grey'
    ring.style['width'] = ((nRings * 2) - 1 - (2 * i)) / ((nRings * 2) - 1) * rodWidth + 'px'
    ring.draggable = true
    ring.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData("Text", event.target.id)
    })
    document.querySelector('#rod1').appendChild(ring)
}

document.addEventListener('dragover', (event) => event.preventDefault())
document.addEventListener('drop', (event) => {
    event.preventDefault
    if (event.target.className == 'rod') {
        addRing(event)
        if(isWon()) {
            console.log('game won!!!')
        }
    }
})

function addRing(event) {
    const rings = event.target.childNodes
    const data = event.dataTransfer.getData("Text");
    const ring = document.getElementById(data)
    if (rings.length == 0) {
        event.target.appendChild(ring)
    }
    else if (parseInt(rings[0].style.width.slice(0, -2)) > parseInt(ring.style.width.slice(0, -2))) {
        event.target.appendChild(ring)
    }
}

function isWon() {
    return document.getElementById('rod3').childNodes.length == nRings ? true : false
}