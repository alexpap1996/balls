const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

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

const getRandomColorNum = () => {
  return Math.floor(Math.random() * 255);
}

// const { innerWidth, innHeight } = window// for (let i = 0; i < 50; i++) {
//   const x = Math.random() * innerWidth
//   const y = Math.random() * innerHeight

//   c.beginPath()
//   c.arc(x, y, 30, Math.PI * 2, false)
  
//   const f = getRandomColorNum
//   c.strokeStyle = 'blue' //`rgb(${f()}, ${f()}, ${f()})`
//   c.stroke()
// }

const possibleColors = [
  '#FF5F5D',
  '#3F7C85',
  '#00CCBF',
  '#72F2EB',
  '#747E7E',
]

class Circle {
  x = 1
  y = 1
  radius = 1
  color = possibleColors[Math.floor(Math.random() * possibleColors.length + 1)]

  constructor (id) {
    this.id = id
    this.radius = Math.random() * 3 + 1
    this.x = Math.random() * (innerWidth - 2 * this.radius + 1)
    this.y = Math.random() * (innerHeight - 2 * this.radius + 1)
    this.dx = (Math.random() * 0.8 + 1 ) * (Math.random() >= 0.5 ? 1 : -1)
    this.dy = (Math.random() * 0.8 + 1 ) * (Math.random() >= 0.5 ? 1 : -1)
  }

  draw () {
    const { x, y, radius } = this
    c.beginPath()
    c.arc(x, y, radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

  update () {

    const { x, y, radius} = this
    if (x <= radius || x + radius >= innerWidth) this.dx = -this.dx
    if (y <= radius || y + radius >= innerHeight) this.dy = -this.dy
    this.x += this.dx
    this.y += this.dy

    this.draw()
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
