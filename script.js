
const kSpeed = 0.45

class Ledge {
  constructor(nx,ny, ndiv){
    this.x = nx
    this.y = ny
    this.div = ndiv
  }
  
  divMove() {
    this.div.style.top = this.y+"vh"
    this.div.style.left = this.x+"vw"
  }

  setPos(nx,ny) {
    this.x = nx
    this.y = ny
    this.divMove()
  }

  down(k) {
    this.y+=(kSpeed*k)
    this.divMove()
  }
}


const goat = {
  isJump: false,
  onLedge: false,
  jumpHigh: 20,
  high: 0,
  y: 71,
  x: 10,
  lustY: 20,
  speed: kSpeed,

  divMove() {
    goatDiv.style.top = this.y+"vh"
    goatDiv.style.left = this.x+"vw"
  },

  up(k) {
    this.y-=(this.speed*k)
    this.divMove()
  },
  down(k) {
    this.y+=(this.speed*k)
    this.divMove()
  },

  left(k) {
    this.x-=(this.speed*k)
    this.divMove()
  },
  right(k) {
    this.x+=(this.speed*k)
    this.divMove()
  },

  setPos(nx,ny) {
    this.x = nx
    this.y = ny
    this.divMove()
  }
}



let score = 0
let highScore = 0

let mouseX = 0
let mouseY = 0
let isPlay = false

const ledges = []
const ledgesDiv = []
const goatDiv = document.createElement("div")
const butDiv = document.createElement("input")

let goatSizeX = 5.1
const goatSizeY = 10
let ledgeSizeX = 5
let ledgeSizeY = 6.2

const kGravity = 1
const kJump = 3
const kLR = 1

//=======================================================
//=========== START-BILD ================================
//=======================================================

const coordinate = (event) => {
  //mouseX = event.clientX;
  //mouseY = event.clientY;
  mouseX = event.clientX * 100 / window.innerWidth;
  mouseY = event.clientY * 100 / window.innerHeight;
}

const resizeWnd = () => {
  const gH = window.innerHeight/10
  const gW = (gH/window.innerWidth)*100
  goatSizeX = Math.ceil(gW*10) / 10
  goatDiv.style.width = goatSizeX+"vw"

  ledgeSizeX = goatSizeX
  
  const wToPx = window.innerWidth*ledgeSizeX/100
  let hPx = wToPx/80.4*128
  ledgeSizeY = Math.round(window.innerHeight/hPx*10) / 10
  if(window.innerWidth<window.innerHeight){
    ledgeSizeY = 6.3
  }
  ledgesDiv.forEach( el => {
    el.style.width = ledgeSizeX+"vw"
    el.style.height = ledgeSizeY+"vh"
  })

  butDiv.style.height = "8vh"
  const bW = Math.round(window.innerHeight*0.08/window.innerWidth*1000)/10
  butDiv.style.width = bW+"vw"
}

const btnFunc = () => {
  isPlay = true
  score = 0
  butDiv.style.visibility="hidden"
  for(let i=-1; i<9;i++) {
    newLedge(i)
  }
}

const rebild = () => {
  ledgesDiv.forEach( el => document.getElementById("main").removeChild(el))
  while(ledgesDiv.length){ledgesDiv.pop()}
  while(ledges.length){ledges.pop()}

  ledgesDiv.push(document.createElement("div"))
  ledgesDiv[ledgesDiv.length-1].className="ledge"
  ledgesDiv[ledgesDiv.length-1].style.top="80vh"
  ledgesDiv[ledgesDiv.length-1].style.left="10vw"
  ledgesDiv[ledgesDiv.length-1].style.width=ledgeSizeX+"vw"
  ledgesDiv[ledgesDiv.length-1].style.height=ledgeSizeY+"vh"
  ledges.push(new Ledge(10,80,ledgesDiv[ledgesDiv.length-1]))
 
  goatDiv.style.top="71vh"
  goatDiv.style.left="10vw"
  goat.y = 71
  goat.x = 10
  goat.high = 0

  butDiv.style.visibility="visible"

  document.getElementById("main").appendChild(ledgesDiv[ledgesDiv.length-1]) 
}

const start = () => {  
  goatDiv.id="goat"

  butDiv.type="button"
  butDiv.id="btnStart"
  butDiv.onclick=btnFunc
  butDiv.value="Beeeegin"
  butDiv.style.position="absolute"
  butDiv.name="jump"
  //butDiv.style.top="90vh"
  //butDiv.style.left="11vw"

  resizeWnd()
  rebild()
  

  document.getElementById("main").appendChild(goatDiv)
  document.getElementById("main").appendChild(butDiv)

  document.getElementById("main").onmousemove=coordinate
}


//=======================================================
//=========== GEN LVL ===================================
//=======================================================

const newLedge = (lvl) => {
  const minX = -5
  const maxX = 99-ledgeSizeX

  const minY = lvl*10+3
  const maxY = (lvl+1)*10+3

  const kolLedge = Math.floor(100/ledgeSizeX/2.5)

  for(let i=0;i<kolLedge;i++) {
    ledgesDiv.push(document.createElement("div"))
    ledgesDiv[ledgesDiv.length-1].className="ledge"
    const top = (Math.round(Math.random() * (maxY-minY))+minY)
    const left = (Math.round(Math.random() * (maxX-minX))+minX)
    ledgesDiv[ledgesDiv.length-1].style.top = top+"vh"
    ledgesDiv[ledgesDiv.length-1].style.left = left+"vw"
    ledgesDiv[ledgesDiv.length-1].style.width=ledgeSizeX+"vw"
    ledgesDiv[ledgesDiv.length-1].style.height=ledgeSizeY+"vh"
    document.getElementById("main").appendChild(ledgesDiv[ledgesDiv.length-1])
    ledges.push(new Ledge(left,top,ledgesDiv[ledgesDiv.length-1]))
  }
  
}

const mapRebild = () => {
  const indLedges = []
  let maxY = ledges.length === 0 ? 1 : ledges[0].y

  ledges.forEach( (el,ind) => {
    if(el.y>93) {
      indLedges.push(ind)
    }
    if(el.y<maxY){
      maxY=el.y
    }
  })

  indLedges.sort( (a,b) => b-a)
  indLedges.forEach( el => {
    document.getElementById("main").removeChild(ledgesDiv[el])
    ledgesDiv.splice(el,1)
    ledges.splice(el,1)
  })

  if(maxY>10){
    newLedge(-1)
  }
}

//=======================================================
//=========== PLAY ======================================
//=======================================================

const fall = () => {
  if(goat.isJump){
    return
  }
  ledges.forEach( el => {
    if( Math.abs(goat.x-el.x) < goatSizeX/2 && Math.abs(goat.y+goatSizeY-(el.y+1)) < goatSizeY/20 && goat.y+goatSizeY>el.y) {
      goat.onLedge = true
    }
  })
}

const jump = () => {
  if(goat.onLedge) {
    goat.onLedge = false
    goat.isJump = true
    goat.lustY = goat.y
  }
  if(goat.lustY - goat.y > goat.jumpHigh){
    goat.isJump = false
  }
  if(goat.isJump){
    if(goat.y>40) {
      //========= JUMP =======================
      goat.up( Math.exp( ((goat.y - goat.lustY + 0.4)/goat.jumpHigh )+0.2)*kJump )
      //======================================
    }
    else {
      ledges.forEach( el => el.down( Math.exp( ((goat.y - goat.lustY + 0.4)/goat.jumpHigh )+0.2)*kJump - kGravity) )
      goat.up(kGravity)
      goat.lustY += Math.exp( ((goat.y - goat.lustY + 0.4)/goat.jumpHigh )+0.2)*kJump - kGravity
      //goat.up(kGravity)
    }

    if(isPlay) {
      goat.high += Math.exp( ((goat.y - goat.lustY + 0.4)/goat.jumpHigh )+0.2)*kJump
      if(score<goat.high){
        score=goat.high
      }
    }
  }
}

const mouseTurn = () => {
  if( Math.abs( (goat.x+goatSizeX/2) - mouseX ) > goatSizeX/2 ) {
    if( (goat.x+goatSizeX/2) < mouseX) {
      goat.right(kLR)
      goatDiv.style.transform="scale(-1, 1)"
      if(goat.x>=95){
        goat.left(kLR)
      }
    }
    else {
      goat.left(kLR)
      goatDiv.style.transform="scale(1, 1)"
    }
  }
}


const play = () => {
  jump()
  fall()
  mouseTurn()

  mapRebild()

  if(!goat.onLedge){
    goat.down(kGravity)
    goat.high -= kGravity
  }

  if(goat.y>90) {
    //goat.setPos( Math.floor(Math.random() * 90), Math.floor(Math.random() * 90))
    isPlay = false
    if(highScore<score){
      highScore = Math.floor(score)
    }
    rebild()
  }
}

const demo = () => {
  jump()
  fall()

  if(!goat.onLedge){
    goat.down(kGravity)
  }
}



//=======================================================
//=========== MAIN ======================================
//=======================================================

const load = () => {
 
  start()
  //goat.setPos( Math.floor(Math.random() * 90), Math.floor(Math.random() * 90))

  const loop = () => {
    document.getElementById("score").innerHTML = Math.floor(score)
    document.getElementById("highScore").innerHTML = highScore
    //document.getElementById("gx").innerHTML = goat.x
    //document.getElementById("gy").innerHTML = goat.y

    if(isPlay){
      play()
    }
    else {
      demo()
    }

    setTimeout(loop,10)
  }

  loop()
}
window.onresize = resizeWnd
window.onload = load;