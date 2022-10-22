/* TODO :
- Animate rings dropping
- Animate auto solve (figure out recursive setTimeout)
- Create landing modal with directions
- Create winning modal with score and option to try next level
*/

let nRings = 1
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']

initializeGame(nRings)

document.addEventListener('dragstart', (event) => {
    if (event.target.className == 'ring') {
        const ring = event.target
        const currentRings = ring.parentElement.childNodes
        if (currentRings[currentRings.length - 1] == ring) {
            event.dataTransfer.setData("Text", event.target.id)
        }
    }
})

document.addEventListener('dragover', (event) => event.preventDefault())

document.addEventListener('drop', (event) => {
    event.preventDefault
    if (event.target.className == 'rodContainer' || event.target.className == 'rod') {
        addRing(event)
        isWon()
    }
})

document.addEventListener('click', (event) => {
    if (event.target.id == 'giveUp') {
        initializeGame(nRings)
        autoSolve(nRings, 1, 3)
    }
})

function initializeGame(nRings) {
    document.querySelectorAll('.ring').forEach(ring => ring.remove())
    const rodWidth = parseInt(getComputedStyle(document.querySelector('#base')).width.slice(0, -2) / 3)
    for (let i = 0; i < nRings; i++) {
        let ring = document.createElement('div')
        ring.className = 'ring'
        ring.id = 'ring' + (i + 1)
        ring.style['background-color'] = colors[i]
        ring.style.width = Math.floor(((nRings * 2) - 1 - (2 * i)) / ((nRings * 2) - 1) * rodWidth) - 2 + 'px'
        ring.draggable = true
        document.querySelector('#rodContainer1').appendChild(ring)
    }
}

function autoSolve(n, start, end) {
    if (n == 1) {
        moveRing(start, end)
        isWon()
    }
    else {
        let other = 6 - (start + end)
        autoSolve(n - 1, start, other)
        moveRing(start, end)
        autoSolve(n - 1, other, end)
    }
}

function moveRing(start, end) {
    let startRod = document.getElementById('rodContainer' + start)
    let endRod = document.getElementById('rodContainer' + end)
    let ring = startRod.childNodes[startRod.childNodes.length - 1]
    endRod.appendChild(ring)
}

function addRing(event) {
    let target = undefined
    event.target.className == 'rodContainer' ? target = event.target : target = event.target.parentElement
    let rings = target.childNodes
    const data = event.dataTransfer.getData("Text");
    const ring = document.getElementById(data)
    if (rings.length == 1 || parseInt(rings[1].style.width.slice(0, -2)) > parseInt(ring.style.width.slice(0, -2))) {
        target.appendChild(ring)
    } else {
        console.log('not valid move')
    }
}

function isWon() {
    if (document.getElementById('rodContainer3').childNodes.length == nRings + 1) {
        console.log('you won!!!')
    }
}