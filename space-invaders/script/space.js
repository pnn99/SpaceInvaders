//board
let tileSize = 32
let rows = 16
let columns = 16

let board
let boardWidth = tileSize * columns // 32 * 16
let boardHeight = tileSize * rows // 32 * 16
let context

//nave
let shipWidht = tileSize*2
let shipHeight = tileSize
let shipX = tileSize * columns/2 - tileSize
let shipY = tileSize * rows - tileSize*2

let ship = {
    x : shipX,
    y : shipY,
    width : shipWidht,
    height : shipHeight
}

let shipImage
let shipVelocityX = tileSize; //velocidade de movimento da nave

//aliens
let alienArray = []
let alienWidth = tileSize*2
let alienHeight = tileSize
let alienX = tileSize
let alienY = tileSize
let alienImage

let alienRows = 2
let alienColums = 3
let alienCount = 0
let alienVelocityX = 1 // velocidade dos aliens

// Bullets
let bulletArray = []
let bulletVelocityY = -10

//placar e gameover
let score = 0
let gameOver = false

window.onload = function () {
    board = document.getElementById("board")
    board.width = boardWidth
    board.height = boardHeight
    context = board.getContext("2d") // usado para desenha no quadro


    //local inicial da nave
    // context.fillStyle="green"
    // context.fillReact(shipX, shipY, shipWidht, shipHeight)


    //load images
    shipImage = new Image()
    shipImage.src = "./assets/ship.png"
    shipImage.onload = function() {
        context.drawImage(shipImage, shipX, shipY, shipWidht, shipHeight)
    }

    alienImage = new Image()
    alienImage.src = "./assets/alien-yellow.png"
    createAliens()
    
    requestAnimationFrame(update)
    document.addEventListener("keydown", moveShip)
    document.addEventListener("keyup", shoot)
}

function update() {
    requestAnimationFrame(update)

    if (gameOver) {
        return
    }

    context.clearRect(0, 0, boardWidth, boardHeight)

    // nave
    context.drawImage(shipImage, ship.x, ship.y, shipWidht, shipHeight) //redesenhar a imagem a cada movimento

    // Aliens
    for (let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i]
        if (alien.alive) {
            alien.x += alienVelocityX

            if(alien.x + alien.width >= board.width || alien.x <= 0){
                alienVelocityX *= -1
                alien.x += alienVelocityX*2

                //movimentando os aliens
                for (let j = 0; j < alienArray.length; j++) {
                    alienArray[j].y += alienHeight
                    
                }
            }
            context.drawImage(alienImage, alien.x, alien.y, alien.width, alien.height)

            if (alien.y >= ship.y) {
                gameOver = true
            }
        }
    }

    //bullets
    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i]
        bullet.y += bulletVelocityY
        context.fillStyle = "white"
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)

        //colisão das balas
        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j]
            
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true
                alien.alive = false
                alienCount --
                score += 100
            }
        }
        
    }

    // limpar as balas
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift()
    }

    //passando de fase
    if (alienCount == 0) {
        alienColums = Math.min(alienColums + 1, columns/2 - 2) // limite de 16/2 - 2 = 6
        alienRows = Math.min(alienRows + 1, rows - 4) // limite de 16-4 = 12
        alienVelocityX += 0.4
        alienArray = []
        bulletArray = []
        createAliens()
    }

    // Placar
    context.fillStyle = "White"
    context.font = "16px courier"
    context.filText(score, 5, 20)
}

function moveShip(e) {
    if (gameOver) {
        return
    }

    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX 
    }
    else if (e.code == "ArrowRight" && ship.x + shipVelocityX + shipWidht <= boardWidth) {
        ship.x += shipVelocityX
    }
}

function createAliens() {
    for (let i = 0; i < alienColums; i++) {
        for (let j = 0; j < alienRows; j++) {
            let alien = {
                img : alienImage,
                x : alienX + i * alienWidth,
                y : alienY + j * alienHeight,
                width : alienWidth,
                height : alienHeight,
                alive : true
            }

            alienArray.push(alien)
        }
        
    }
    alienCount = alienArray.length
}

function shoot(e) {
    if (gameOver) {
        return
    }

    if (e.code == "Space") {
        let bullet = {
            x : ship.x + shipWidht*15/32,
            y : ship.y,
            width : tileSize/8,
            height : tileSize/2,
            used : false
        }
        bulletArray.push(bullet)
    }
}

function detectCollision(a, b) {
    // Verifica se o lado esquerdo do objeto 'a' está à esquerda do lado direito do objeto 'b' (colisão horizontal)
    // Verifica se o lado direito do objeto 'a' está à direita do lado esquerdo do objeto 'b' (colisão horizontal)
    // Verifica se o topo do objeto 'a' está acima da base do objeto 'b' (colisão vertical)
    // Verifica se a base do objeto 'a' está abaixo do topo do objeto 'b' (colisão vertical)
    return  a.x < b.x + b.width && 
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}