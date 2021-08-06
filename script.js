const canvas = document.querySelector(`canvas`);
const context = canvas.getContext(`2d`);
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const blockSize = 10;
const widthInBlocks = canvasWidth / blockSize;
const heightInBlocks = canvasHeight / blockSize;
let score = 0;
const drawCircle = (x, y, radius, fill = false) => {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2, true);
  if (fill) {
    context.fill();
  } else {
    context.stroke();
  }
};
class Block {
  constructor(col, row) {
    this.col = col;
    this.row = row;
  }
  drawSquare(fillStyle) {
    context.fillStyle = fillStyle;
    const x = this.col * blockSize;
    const y = this.row * blockSize;
    context.fillRect(x, y, blockSize, blockSize);
  }
  drawCircle(fillStyle) {
    context.fillStyle = fillStyle;
    let x = this.col * blockSize + blockSize / 2;
    let y = this.row * blockSize + blockSize / 2;
    drawCircle(x, y, blockSize / 2, true);
  }
  checkIfCoordinatesMatch(otherBlock) {
    if (this.col === otherBlock.col && this.row === otherBlock.row) {
      return true;
    } else {
      return false;
    }
  }
}
class Apple {
  constructor() {
    this.position = new Block(10, 10);
  }
  draw() {
    this.position.drawCircle("limegreen");
  }
  move() {
    const randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    const randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    this.position.row = randomRow;
    this.position.col = randomCol;
    this.checkIfTheAppleIsInTheSnake();
  }
  checkIfTheAppleIsInTheSnake() {
    snake.segments.forEach((segment) => {
      while (segment.checkIfCoordinatesMatch(this.position)) {
        this.move();
      }
    });
  }
}
class Snake {
  constructor(direction) {
    let centerCol = Math.floor(widthInBlocks / 2);
    let centerRow = Math.floor(heightInBlocks / 2);
    this.nextDirection = direction;
    this.segments = [
      new Block(centerCol, centerRow),
      new Block(centerCol + 1, centerRow),
      new Block(centerCol + 2, centerRow),
    ];
    this.direction = direction;
  }
  checkWallCollision(newHead) {
    if (
      newHead.row === 0 ||
      newHead.row === widthInBlocks - 1 ||
      newHead.col === 0 ||
      newHead.col === heightInBlocks - 1
    ) {
      return true;
    } else {
      return false;
    }
  }
  checkSelfCollision(newHead) {
    for (let i = 0; i < this.segments.length; i++) {
      if (this.segments[i].checkIfCoordinatesMatch(newHead)) {
        return true;
      }
    }
    return false;
  }
  setDirection(newDirection) {
    switch (newDirection) {
      case "up":
        if (this.direction === "down") {
          return;
        }
        break;
      case "down":
        if (this.direction === "up") {
          return;
        }
        break;
      case "left":
        if (this.direction === "right") {
          return;
        }
        break;
      case "right":
        if (this.direction === "left") {
          return;
        }
        break;
      default:
    }
    this.nextDirection = newDirection;
  }
  move() {
    //find previous head
    //decide position of new head (col, row)
    //create new head
    //push new head into segments
    this.direction = this.nextDirection;
    let newHead;
    let previous = this.segments[0];
    switch (this.direction) {
      case "up":
        newHead = new Block(previous.col, previous.row - 1);
        break;
      case "down":
        newHead = new Block(previous.col, previous.row + 1);
        break;
      case "left":
        newHead = new Block(previous.col - 1, previous.row);
        break;
      case "right":
        newHead = new Block(previous.col + 1, previous.row);
        break;
      default:
    }
    if (newHead.checkIfCoordinatesMatch(apple.position)) {
      score++;
      apple.move();
    } else {
      this.segments.pop();
    }
    if (this.checkWallCollision(newHead) || this.checkSelfCollision(newHead)) {
      gameOver();
    }
    this.segments.unshift(newHead);
  }
  draw() {
    this.segments.forEach((block, index) => {
      block.drawSquare(index % 2 ? "green" : "yellow");
    });
  }
}
const drawBorder = () => {
  context.fillStyle = `grey`;
  //top
  context.fillRect(0, 0, canvasWidth, blockSize);
  //bottom
  context.fillRect(0, canvasHeight - blockSize, canvasWidth, blockSize);
  //left
  context.fillRect(0, 0, blockSize, canvasHeight);
  //right
  context.fillRect(canvasWidth - blockSize, 0, blockSize, canvasHeight);
};
const drawScore = () => {
  context.font = "20px Courier";
  context.fillStyle = "black";
  context.textAlign = "start";
  context.textBaseline = "top";
  context.fillText("Score: " + score, blockSize, blockSize);
};
const gameOver = () => {
  context.font = "60px Courier";
  context.fillStyle = "Red";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("Game Over", canvasWidth / 2, canvasHeight / 2);
  clearInterval(intervalId);
};
const apple = new Apple();
const snake = new Snake("up");
const intervalId = setInterval(() => {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  snake.draw();
  drawBorder();
  drawScore();
  apple.draw();
  snake.move();
}, 100);
const direction = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};
$(`body`).on(`keydown`, (event) => {
  let keycode = event.code;
  if (direction[keycode] !== undefined) {
    snake.setDirection(direction[keycode]);
  }
});
