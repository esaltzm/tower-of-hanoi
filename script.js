/* TODO :
- Animate rings dropping (WORKING ON THIS)
- Animate auto solve (figure out recursive setTimeout)
- Create landing modal with directions
- Create winning modal with score and option to try next level
*/

let nRings = 3

const styleSheet = document.styleSheets[0]
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
let yLevels = []
let wrongRing = undefined
let autoTime = 2000
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
        if (ring) {
            ring.style.visibility = 'visible'
            addRing(ring, rings, rod, event)
            setTimeout(() => {
                isWon()
            }, 1200)
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
        for (let i = 0; i < autoMoves.length; i++) {
            setTimeout(() => {
                autoAddRing(autoMoves[i][0], autoMoves[i][1])
            }, autoTime / autoMoves.length * i);
        }
        setTimeout(() => {
            isWon()
        }, autoTime + 500)
    }
    if(event.target.id == 'closeInstructions') {
        document.getElementById('modalContainer').style.visibility = 'hidden'
    }
    if(event.target.id == 'closeWin') {
        document.getElementById('win').style.visibility = 'hidden'
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
        ring.style.width = Math.floor(((nRings * 2) - 1 - (2 * i)) / ((nRings * 2) - 1) * rodWidth) + 'px'
        ring.draggable = true
        document.querySelector('#rodContainer1').appendChild(ring)
        yLevels.push(ring.getBoundingClientRect().top)
    }
}


function autoSolve(n, start, end) {
    if (n == 1) {
        autoMoves.push([start, end])
    }
    else {
        let other = 6 - (start + end)
        autoSolve(n - 1, start, other)
        autoMoves.push([start, end])
        autoSolve(n - 1, other, end)
    }
}

function autoAddRing(start, end) {
    const startRod = document.getElementById('rodContainer' + start)
    const endRod = document.getElementById('rodContainer' + end)
    const ringMoving = startRod.childNodes[startRod.childNodes.length - 1]
    const rectRing = ringMoving.getBoundingClientRect()
    const rectRod = endRod.getBoundingClientRect()
    const timeMoving = autoTime / autoMoves.length - 10 // -10ms allows move to be completed before next call
    styleSheet.insertRule(`@keyframes autoMove {
        33% {
            top: ${rectRing.top - 525}px;
            left: ${rectRing.left}px;
        }
        66% {
            top: ${rectRing.top - 525}px;
            left: ${rectRod.left + (rectRod.offsetWidth - ringMoving.offsetWidth)}px;
        }
        99% {
            top: ${yLevels[endRod.childNodes.length - 1]}px;
            left: ${rectRod.left}px;
        }
        `, styleSheet.cssRules.length - 1)
    styleSheet.insertRule(`.moving {
        position: absolute;
        top: ${rectRing.top}px;
        left: ${rectRing.left}px;
        animation-name: autoMove;
        animation-time: ${timeMoving / 1000}s;
        `, styleSheet.cssRules.length)
    ringMoving.classList.add('moving')
    setTimeout(() => {
        ringMoving.classList.remove('moving')
        styleSheet.deleteRule(styleSheet.cssRules.length - 1)
        styleSheet.deleteRule(styleSheet.cssRules.length - 2)
        endRod.appendChild(ringMoving)
    }, timeMoving)
}


function addRing(ring, rings, rod, event) {
    if (ring == null) {
        wrongRing.classList.remove('glowing')
        wrongRing.innerText = ''
    }
    else if (rings.length == 1 || parseInt(rings[1].style.width) > parseInt(ring.style.width)) {
        const rodRect = rod.getBoundingClientRect()
        styleSheet.insertRule(`.drop {
            position: absolute;
            left: ${(rodRect.left + rodRect.right) / 2 - (ring.offsetWidth / 2)}px; ${/* positions ring on center of rod */''}
            top: ${event.clientY - offset[1]}px; ${/* positions ring at height where user dragged it */''}
            transition: 1s;
            transform: translateY(${yLevels[rod.childNodes.length - 1] - (event.clientY - offset[1]) - (ring.offsetHeight / 2)}px);
        }`, styleSheet.cssRules.length) // problem in translateY (rings go slightly below where they should be???)
        ring.classList.add('drop')
        setTimeout(() => {
            ring.classList.remove('drop')
            styleSheet.deleteRule(styleSheet.cssRules.length - 1)
            rod.appendChild(ring)
        }, 1000)
    }

}

function isWon() {
    console.log('nodes: ', document.getElementById('rodContainer3').childNodes, 'length: '+document.getElementById('rodContainer3').childNodes.length)
    if (document.getElementById('rodContainer3').childNodes.length == nRings + 1) { // +1 accounts for rod div
        document.getElementById('modalContainer').style.display = ''
        document.getElementById('instructions').style.display = 'none'
        document.getElementById('win').style.visibility = 'visible'
        console.log(document.getElementById('win').style.display)
    }
}