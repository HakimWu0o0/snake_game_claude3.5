const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

const snakeBlock = 20;
const snakeSpeed = 15;

let snake = [];
let dx = snakeBlock;
let dy = 0;

let foodX;
let foodY;

let score = 0;

let gameOver = false;

const backgroundMusic = document.getElementById('backgroundMusic');
const eatSound = document.getElementById('eatSound');
const gameOverSound = document.getElementById('gameOverSound');

const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

function startGame() {
    startScreen.style.display = 'none';
    initGame();
    backgroundMusic.play();
    gameLoop();
}

function initGame() {
    snake = [
        {x: width / 2, y: height / 2},
        {x: width / 2 - snakeBlock, y: height / 2},
        {x: width / 2 - 2 * snakeBlock, y: height / 2}
    ];
    dx = snakeBlock;
    dy = 0;
    score = 0;
    gameOver = false;
    generateFood();
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'green';
    ctx.fillRect(snakePart.x, snakePart.y, snakeBlock, snakeBlock);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (head.x === foodX && head.y === foodY) {
        score++;
        eatSound.play();
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    foodX = Math.floor(Math.random() * (width / snakeBlock)) * snakeBlock;
    foodY = Math.floor(Math.random() * (height / snakeBlock)) * snakeBlock;
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(foodX, foodY, snakeBlock, snakeBlock);
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px "Press Start 2P"';
    ctx.fillText('Score: ' + score, 10, 30);
}

function checkCollision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > width - snakeBlock;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > height - snakeBlock;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function gameLoop() {
    if (gameOver) {
        backgroundMusic.pause();
        gameOverSound.play();
        ctx.fillStyle = 'white';
        ctx.font = '40px "Press Start 2P"';
        ctx.fillText('Game Over!', width / 4, height / 2);
        restartButton.style.display = 'block';
        return;
    }

    setTimeout(() => {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        drawScore();

        if (checkCollision()) {
            gameOver = true;
        }

        requestAnimationFrame(gameLoop);
    }, 1000 / snakeSpeed);
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -snakeBlock;
    const goingDown = dy === snakeBlock;
    const goingRight = dx === snakeBlock;
    const goingLeft = dx === -snakeBlock;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -snakeBlock;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -snakeBlock;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = snakeBlock;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = snakeBlock;
    }
}

function restartGame() {
    initGame();
    restartButton.style.display = 'none';
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
    gameLoop();
}

document.addEventListener('keydown', changeDirection);