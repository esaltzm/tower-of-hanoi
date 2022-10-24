/* TODO :
- Animate rings dropping (WORKING ON THIS)
- Animate auto solve (figure out recursive setTimeout)
- Create landing modal with directions
- Create winning modal with score and option to try next level
*/

// To fix positioning of drop transition - record offset of clientXY at dragstart

let nRings = 8

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
let yLevels = []
let wrongRing = undefined
let autoTime = 2000 * nRings
console.log(autoTime)
let autoMoves = []
let offset = []

initializeGame(nRings)

document.addEventListener('dragstart', (event) => {
    if (event.target.className == 'ring') {
        const ring = event.target
        const currentRings = ring.parentElement.childNodes
        if (currentRings[currentRings.length - 1] == ring) {
            event.dataTransfer.setData("Text", event.target.id)
            const rect = event.target.getBoundingClientRect()
            offset.push(event.clientX - rect.left)
            offset.push(event.clientY - rect.top)
            setTimeout(() => {
                event.target.style.visibility = "hidden";
            }, 1);
        } else {
            event.target.classList.add('glowing')
            wrongRing = event.target
        }
    }
})

document.addEventListener('dragover', (event) => {
    event.preventDefault()
})

document.addEventListener('drop', (event) => {
    event.preventDefault
    if (event.target.className == 'rodContainer' || event.target.className == 'rod') {
        let rod = undefined
        event.target.className == 'rodContainer' ? rod = event.target : rod = event.target.parentElement
        let rings = rod.childNodes
        const id = event.dataTransfer.getData("Text");
        const ring = document.getElementById(id)
        if(ring) {
            ring.style.visibility = ''
            addRing(ring, rings, rod, event)
            isWon()
        } else {
            wrongRing.classList.remove('glowing')
            wrongRing.innerText = ''
        }
    } else {
        wrongRing.classList.remove('glowing')
        wrongRing.innerText = ''
    }
})

document.addEventListener('click', (event) => {
    if (event.target.id == 'giveUp') {
        initializeGame(nRings)
        autoMoves = []
        autoSolve(nRings, 1, 3)
        console.log(autoMoves)
        for (let i = 0; i < autoMoves.length; i++) {
            setTimeout(() => {
                console.log(autoMoves[i][0], '->', autoMoves[i][1])
                autoAddRing(autoMoves[i][0], autoMoves[i][1])
            }, autoTime / autoMoves.length * i);
        }
    }
})

function initializeGame(nRings) {
    document.querySelectorAll('.ring').forEach(ring => ring.remove())
    const rodWidth = parseInt(getComputedStyle(document.querySelector('#base')).width) / 3
    for (let i = 0; i < nRings; i++) {
        let ring = document.createElement('div')
        ring.className = 'ring'
        ring.id = 'ring' + (i + 1)
        ring.style['background-color'] = colors[i % colors.length]
        if (nRings < 5) {
            ring.style.height = '100px'
        } else { ring.style.height = 480 / nRings + 'px' }
        //implement minimum width of ring so they arent too small
        ring.style.width = Math.floor(((nRings * 2) - 1 - (2 * i)) / ((nRings * 2) - 1) * rodWidth) - 2 + 'px'
        ring.draggable = true
        document.querySelector('#rodContainer1').appendChild(ring)
        yLevels.push(ring.getBoundingClientRect().top)
    }
}


function autoSolve(n, start, end) {
    if (n == 1) {
        autoMoves.push([start, end])
        isWon()
    }
    else {
        let other = 6 - (start + end)
        autoSolve(n - 1, start, other)
        autoMoves.push([start, end])
        autoSolve(n - 1, other, end)
    }
}

function autoAddRing(start, end) {
    let startRod = document.getElementById('rodContainer' + start)
    let endRod = document.getElementById('rodContainer' + end)
    console.log(startRod, endRod)
    let ring = startRod.childNodes[startRod.childNodes.length - 1]
    endRod.appendChild(ring)
}

function addRing(ring, rings, rod, event) {
    if (ring == null) {
        console.log(ring.id)
        wrongRing.classList.remove('glowing')
        wrongRing.innerText = ''
    }
    else if (rings.length == 1 || parseInt(rings[1].style.width) > parseInt(ring.style.width)) {
        const rodRect = rod.getBoundingClientRect()
        document.styleSheets[0].insertRule(`.drop {
            position: absolute;
            left: ${(rodRect.left + rodRect.right) / 2 - ring.offsetWidth / 2}px; ${/* positions ring on center of rod */''}
            top: ${event.clientY - offset[1]}px; ${/* positions ring at height where user dragged it */''}
            transition: 1s;
            transform: translateY(${yLevels[rod.childNodes.length] - (event.clientY - offset[1])}px);
        }`, 8) // ring ends up at appropriate height for number of rings already on the rod
        ring.classList.add('drop')
        setTimeout(() => {
            ring.classList.remove('drop')
            document.styleSheets[0].deleteRule(8)
            rod.appendChild(ring)
        }, 1000)
    }

}


function isWon() {
    if (document.getElementById('rodContainer3').childNodes.length == nRings + 1) {
        console.log('you won!!!')
    }
}