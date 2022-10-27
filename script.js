/* TODO :
- Bug fix: prevent user from clicking 'I give up' button again before action is finished - causes funky errors!
- Add final ending screen with option to restart from level 1
- implement move counter and scoring algorithm
*/

let nRings = 1

const styleSheet = document.styleSheets[0]
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
const times = [500, 2000, 6000, 10000, 15000, 20000]
let autoTime = times[0]
let yLevels = []
let withHelp = ''
let wrongRing = undefined
let autoMoves = []
let offsetY
let currentRod

initializeGame(nRings)

document.addEventListener('dragstart', (event) => {
    if (event.target.className == 'ring') {
        const ring = event.target
        const currentRings = ring.parentElement.childNodes
        ring.style.width = ring.offsetWidth + 'px'
        if (currentRings[currentRings.length - 1] == ring) {
            event.dataTransfer.setData("Text", event.target.id)
            offsetY = (event.clientY - event.target.getBoundingClientRect().top)
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
    const id = event.dataTransfer.getData("Text");
    const ring = document.getElementById(id)
    if (event.target.className == 'rodContainer' || event.target.className == 'rod') {
        let rod = undefined
        event.target.className == 'rodContainer' ? rod = event.target : rod = event.target.parentElement
        let rings = rod.childNodes
        if (ring) {
            ring.style.visibility = 'visible'
            addRing(ring, rings, rod, event)
            setTimeout(() => {
                isWon()
            }, 1200) // must be higher than 1 (time for drop transition)
        }
    } else {
        ring.style.visibility = 'visible'
    }
    if (wrongRing) {
        wrongRing.classList.remove('glowing')
        wrongRing.innerText = ''
    }
})

document.addEventListener('click', (event) => {
    if (event.target.id == 'giveUp') {
        console.log(document.getElementById('giveUp').disabled)
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
        }, autoTime + 1000)
        withHelp = '<p>... with some help from the computer 👀</p>'
    }
    if (event.target.id == 'closeInstructions' || event.target.id == 'modalContainer') {
        document.getElementById('modalContainer').style.visibility = 'hidden'
        document.getElementById('instructions').style.visibility = 'hidden'
    }
    if (event.target.id == 'restart') {
        initializeGame(nRings)
    }
    if (event.target.classList.contains('next')) {
        document.getElementById('giveUp').outerHTML = '<button title="(get help from the computer)" class="button" id="giveUp" onclick="this.disabled = true">I Give Up!</button>'
        if (parseInt(event.target.id.substring(event.target.id.length - 1)) < 6) {
            nRings++
            initializeGame(nRings)
            autoTime = times[nRings - 1]
            event.target.classList.remove('next')
            event.target.classList.add('past')
            document.getElementById('level' + (nRings + 1)).classList.remove('noAccess')
            document.getElementById('level' + (nRings + 1)).classList.add('next')
            document.getElementById('win').style.display = 'none'
            document.getElementById('modalContainer').style.visibility = 'hidden'
        }
        else if (parseInt(event.target.id.substring(event.target.id.length - 1)) == 6) {
            nRings++
            initializeGame(nRings)
            !times[nRings - 1] ? autoTime = 20000 : autoTime = times[nRings - 1]
            event.target.classList.remove('next')
            event.target.classList.add('past')
            document.getElementById('win').style.display = 'none'
            document.getElementById('modalContainer').style.visibility = 'hidden'
            document.getElementById('win').innerHTML = `
            <h2>🎉 🎉  You Won EVERY LEVEL  🎉 🎉</h2>
            ${withHelp}
            <p>Choose a level for fun (higher numbers get increasingly complex):</p>
            <form>
            <input type="number" id="input"></input>
            <button type= "button" id="button">Try it!</button>
            </form>`
        }
    }
    if (event.target.id == 'button') { // Page reloads every time you click this button???
        nRings = document.getElementById('input').value
        initializeGame(nRings)
        document.getElementById('win').style.visibility = 'hidden'
        document.getElementById('modalContainer').style.visibility = 'hidden'
    }
})

function initializeGame(nRings) {
    document.querySelectorAll('.ring').forEach(ring => ring.remove())
    yLevels = []
    const rodWidth = parseInt(window.getComputedStyle(document.getElementById('rodContainer1')).width)
    for (let i = 0; i < nRings; i++) {
        let ring = document.createElement('div')
        ring.className = 'ring'
        ring.id = 'ring' + (i + 1)
        ring.style['background-color'] = colors[i % colors.length]
        if (nRings < 5) {
            ring.style.height = 'calc(100% / 6)'
        } else { ring.style.height = `calc(80% / ${nRings})` }
        ring.style.width = ((nRings * 2) - 1 - (2 * i)) / ((nRings * 2) - 1) * 100 + '%'
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
    let startRod = document.getElementById('rodContainer' + start)
    let endRod = document.getElementById('rodContainer' + end)
    let ring = startRod.childNodes[startRod.childNodes.length - 1]
    endRod.appendChild(ring)
}

function addRing(ring, rings, rod, event) {
    if (ring == null) {
        wrongRing.classList.remove('glowing')
        wrongRing.innerText = ''
    }
    if (rings.length == 1 || rings[1].offsetWidth > ring.offsetWidth) {
        if (event.clientY < yLevels[rod.childNodes.length - 1]) {
            const rodRect = rod.getBoundingClientRect()
            const width = ring.offsetWidth
            const off = document.getElementById('gameContainer').getBoundingClientRect().left
            styleSheet.insertRule(`.drop {
            position: absolute;
            left: ${(rodRect.left + rodRect.right) / 2 - width / 2 - off}px; ${/* positions ring on center of rod */''}
            top: ${event.clientY - offsetY}px; ${/* positions ring at height where user dragged it */''}
            transition: 1s;
            transform: translateY(${yLevels[rod.childNodes.length - 1] - (event.clientY - offsetY) - ring.offsetHeight - document.getElementById('base').offsetHeight}px);
            }`, styleSheet.cssRules.length) // problem in translateY (rings go slightly below where they should be???)
            ring.classList.add('drop')
            setTimeout(() => {
                ring.classList.remove('drop')
                styleSheet.deleteRule(styleSheet.cssRules.length - 1)
                rod.appendChild(ring)
            }, 1000)
        } else {
            rod.appendChild(ring)
        }
    }

}

function isWon() {
    if (document.getElementById('rodContainer3').childNodes.length == nRings + 1) { // +1 accounts for rod div
        document.getElementById('modalContainer').style.visibility = 'visible'
        document.getElementById('instructions').style.display = 'none'
        document.getElementById('win').style.display = 'block'
    }
}