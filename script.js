// initialize three rings on rod #1

let nRings = 4
let rodWidth = parseInt(getComputedStyle(document.querySelector('#base')).width.slice(0, -2) / 3)
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']

for (let i = 0; i < nRings; i++) {
    let ring = document.createElement('div')
    ring.className = 'ring'
    ring.id = 'ring' + (i + 1)
    ring.style['background-color'] = colors[i]
    ring.style.width = Math.floor(((nRings * 2) - 1 - (2 * i)) / ((nRings * 2) - 1) * rodWidth) - 2 + 'px'
    ring.draggable = true
    document.querySelector('#rodContainer1').appendChild(ring)
    ring.addEventListener('dragstart', (event) => {
        const currentRings = ring.parentElement.childNodes
        if (currentRings[currentRings.length - 1] == ring) {
            event.dataTransfer.setData("Text", event.target.id)
        }
    })
}

document.addEventListener('dragover', (event) => event.preventDefault())
document.addEventListener('drop', (event) => {
    event.preventDefault
    if (event.target.className == 'rodContainer' || event.target.className == 'rod') {
        addRing(event)
        if (isWon()) {
            console.log('game won!!!')
        }
    }
})

function addRing(event) {
    let target = undefined
    event.target.className == 'rodContainer' ? target = event.target : target = event.target.parentElement
    let rings = target.childNodes
    const data = event.dataTransfer.getData("Text");
    const ring = document.getElementById(data)
    try {
        if (rings.length == 1) {
            target.appendChild(ring)
        }
        else if (parseInt(rings[1].style.width.slice(0, -2)) > parseInt(ring.style.width.slice(0, -2))) {
            target.appendChild(ring)
        }
    } catch (error) {
        console.log(error)
        console.log('cannot move ring from under another ring')
    }
}

function isWon() {
    return document.getElementById('rodContainer3').childNodes.length == nRings + 1 ? true : false
}