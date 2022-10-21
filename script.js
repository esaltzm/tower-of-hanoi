// initialize three rings on rod #1

let nRings = 2
let rodWidth = parseInt(getComputedStyle(document.querySelector('#rod1')).width.slice(0,-2))

for(let i = 0; i < nRings; i++) {
    let ring = document.createElement('div')
    ring.className = 'ring'
    ring.id = 'ring' + (i + 1)
    ring.style['background-color'] = 'grey'
    ring.style['width'] = (nRings * 2 - 1 - 2 * i) / (nRings * 2 - 1) * rodWidth + 'px'
    ring.draggable = true
    document.querySelector('#rod1').appendChild(ring)
}