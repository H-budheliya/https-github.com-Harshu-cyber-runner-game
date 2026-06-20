const player = document.getElementById("player");
const gameArea = document.getElementById("gameArea");
const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

const moveSound = new Audio("assets/move.mp3");
const gameOverSound = new Audio("assets/gameover.mp3");

let playerX = 170;
let score = 0;
let speed = 4;
let gameRunning = false;
let scoreInterval;

let highScore = localStorage.getItem("cyberHigh") || 0;
highScoreText.innerText = highScore;

function playMoveSound(){
    moveSound.currentTime = 0;
    moveSound.play();
}

function moveLeft(){
    if(playerX > 0){
        playerX -= 25;
        player.style.left = playerX + "px";
        playMoveSound();
    }
}

function moveRight(){
    if(playerX < 340){
        playerX += 25;
        player.style.left = playerX + "px";
        playMoveSound();
    }
}

document.addEventListener("keydown",(e)=>{

    if(e.key==="ArrowLeft"){
        moveLeft();
    }

    if(e.key==="ArrowRight"){
        moveRight();
    }

});

function startGame(){

    if(gameRunning) return;

    gameRunning = true;

    scoreInterval = setInterval(()=>{

        score++;
        scoreText.innerText = score;

        if(score % 30 === 0){
            speed += 1;
        }

    },1000);

    spawnObstacle();
}

function spawnObstacle(){

    if(!gameRunning) return;

    const obstacle = document.createElement("div");

    obstacle.classList.add("obstacle");
    obstacle.innerHTML = "☄️";

    let obstacleX = Math.floor(Math.random()*340);

    obstacle.style.left = obstacleX + "px";

    gameArea.appendChild(obstacle);

    let obstacleY = -60;

    let moveInterval = setInterval(()=>{

        obstacleY += speed;

        obstacle.style.top = obstacleY + "px";

        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if(
            playerRect.left < obstacleRect.right &&
            playerRect.right > obstacleRect.left &&
            playerRect.top < obstacleRect.bottom &&
            playerRect.bottom > obstacleRect.top
        ){
            clearInterval(moveInterval);
            gameOver();
        }

        if(obstacleY > 520){
            clearInterval(moveInterval);
            obstacle.remove();
        }

    },20);

    setTimeout(spawnObstacle,1000);
}

function gameOver(){

    gameRunning = false;

    clearInterval(scoreInterval);

    gameOverSound.play();

    if(score > highScore){
        localStorage.setItem("cyberHigh",score);
    }

    setTimeout(()=>{

        alert("Game Over!\n\nYour Score: " + score);

        location.reload();

    },300);
}

function restartGame(){
    location.reload();
}