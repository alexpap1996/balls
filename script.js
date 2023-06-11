const ua = navigator.userAgent;
let isMobile = false
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
  isMobile = true
}

const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const modal = document.querySelector('.modal')
const imgOverlay = document.querySelector('.image-overlay')
// canvas.width = 1
// canvas.height = 1

const c = canvas.getContext('2d')
// c.fillStyle = "rgba(255, 0, 0, 0.5)"
// c.fillRect(100, 100, 100, 100)
// c.fillStyle = "rgba(255, 0, 255, 0.5)"
// c.fillRect(400, 100, 100, 100)

// c.beginPath()
// c.moveTo(50, 250)
// c.lineTo(300, 100)
// c.strokeStyle = "red"
// c.stroke()

// c.beginPath()
// c.arc(200, 300, 30, 0, Math.PI * 2, false)
// c.strokeStyle = "blue"
// c.stroke()

// const getRandomColorNum = () => {
//   return Math.floor(Math.random() * 255);
// }

// const { innerWidth, innHeight } = window// for (let i = 0; i < 50; i++) {
//   const x = Math.random() * innerWidth
//   const y = Math.random() * innerHeight

//   c.beginPath()
//   c.arc(x, y, 30, Math.PI * 2, false)
  
//   const f = getRandomColorNum
//   c.strokeStyle = 'blue' //`rgb(${f()}, ${f()}, ${f()})`
//   c.stroke()
// }

const mouse = {
  x: undefined,
  y: undefined,
}

const possibleColors1 = [
  '#FF5F5D',
  '#3F7C85',
  '#00CCBF',
  '#72F2EB',
  '#747E7E',
]

const possibleColors2 = [
  '#662400',
  '#FF6B1A',
  '#B33F00',
  '#006663',
  '#00B3AD',
]

const possibleColors3 = [
  '#5b4e07',
  '#978839',
  '#c6b34e',
  '#f3e6a1',
  '#36373e',
]

const possibleColors4 = [
  '#22A699',
  '#F2BE22',
  '#F29727',
  '#F24C3D',
]

const possibleColors5 = [
  '#FF78C4',
  '#E1AEFF',
  '#FFBDF7',
  '#FFECEC',
]

const colorPalettes = [possibleColors1, possibleColors2, possibleColors3, possibleColors4, possibleColors5]
const mouseDist = isMobile ? 1000 : 70
class Circle {
  x = 1
  y = 1
  radius = 1
  initialRadius = 1
  palette = possibleColors1
  colorIndex = Math.floor(Math.random() * (this.palette.length + 1))
  canBeDestroyed = false
  destroyed = false

  constructor (id) {
    this.id = id
    this.radius = Math.random() * 6 + 1
    this.initialRadius = this.radius
    this.x = Math.random() * (innerWidth - 2 * this.radius + 1)
    this.y = Math.random() * (innerHeight - 2 * this.radius + 1)
    this.dx = (Math.random() * 0.3 + 1 ) * (Math.random() >= 0.5 ? 1 : -1)
    this.dy = (Math.random() * 0.3 + 1 ) * (Math.random() >= 0.5 ? 1 : -1)
    this.color = this.palette[this.colorIndex]
  }

  draw () {
    const { x, y, radius } = this
    try {

      c.beginPath()
      c.arc(x, y, radius, 0, Math.PI * 2, false)
      c.fillStyle = this.color
      c.fill()
    } catch (e) {
      console.log(e)
    }

  }

  update () {
    if (this.destroyed) return 

    const { x, y, radius} = this
    if (x <= radius || x + radius >= innerWidth) this.dx = -this.dx
    if (y <= radius || y + radius >= innerHeight) this.dy = -this.dy
    this.x += this.dx
    this.y += this.dy

    const isNearMouse = (Math.abs(x - mouse.x) <= mouseDist) && Math.abs(y - mouse.y) <= mouseDist
    if (isNearMouse) {
      if (this.radius <= 100) this.radius += 4

      this.canBeDestroyed = true
    } else if (this.radius >= this.initialRadius){
      this.radius = this.initialRadius < this.radius - 4 ?  this.radius - 4 : this.initialRadius
    }

    if (!isNearMouse) this.canBeDestroyed = false
    this.draw()
  }

  changeColor (newColor) {
    this.color = newColor
  }

  destroy () {
    if (!this.canBeDestroyed) return
    this.radius = 0
    this.destroyed = true
  }
}
const circleArr = []
for (let i = 0; i < 900; i++) {
  circleArr.push(new Circle(i))
}

const animate = () => {
  webkitRequestAnimationFrame(animate)
  c.clearRect(0, 0, innerWidth, innerHeight)
  for (let circle of circleArr) {
    circle.update()
  }
}
animate()

const selectChangeHandler = (event) => {
  const { selectedIndex } = event
  const val = Number(event[selectedIndex].value)
  const palette = colorPalettes[val - 1]
  circleArr.forEach(circle => {
    const i = circle.colorIndex
    const newColor = palette[i] || palette[Math.floor(Math.random() * 5)]
    circle.changeColor(newColor)
  })
}

window.addEventListener(isMobile ? 'touchstart' : 'mousemove', (event) => {
  const { clientX, clientY } = event
  mouse.x = clientX
  mouse.y = clientY
})

window.addEventListener(isMobile ? 'touchend' : 'click', (event) => {
  for (let circle of circleArr) {
    circle.destroy()
  }
  checkGameOver()
})

const checkGameOver = () => {
  let dest = 0
  circleArr.forEach(circle => {
    if (circle.destroyed) dest++
  })
  if (circleArr.length * 0.84 < dest) imgOverlay.classList.remove('is-hidden')
}
const clickFakeSelect = () => {
  const dropdown = document.querySelector('.fake-select-dropdown')
  dropdown.classList.toggle("is-hidden");
}

document.querySelectorAll('.fake-option-wrapper').forEach(optionWrapper => {
  optionWrapper.addEventListener('click', (event) => {
    const { value } = optionWrapper.dataset
    // change the visible option
    document.querySelector('.fake-select').style.background = getComputedStyle(document.querySelector(`.fake-option-${value}`)).backgroundImage

    const val = Number(value)
    const palette = colorPalettes[val - 1]
    circleArr.forEach(circle => {
      const i = circle.colorIndex
      const newColor = palette[i] || palette[Math.floor(Math.random() * 5)]
      circle.changeColor(newColor)
    })

    const dropdown = document.querySelector('.fake-select-dropdown')
    dropdown.classList.add("is-hidden");
  })
})

const closeModal = () => {
  modal.classList.remove('is-active')
}
