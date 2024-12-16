const tetris = document.getElementById('tetris');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');

const rows = 20;
const cols = 10;
let board = [];
let currentPiece;
let currentX = 0;
let currentY = 0;
let gameInterval;
let score = 0;

// Tetromino shapes
const tetrominoes = [
  [[1, 1, 1, 1]], // I shape
  [[1, 1], [1, 1]], // O shape
  [[0, 1, 0], [1, 1, 1]], // T shape
  [[1, 1, 0], [0, 1, 1]], // Z shape
  [[0, 1, 1], [1, 1, 0]], // S shape
  [[1, 1, 1], [1, 0, 0]], // L shape
  [[1, 1, 1], [0, 0, 1]], // J shape
];

// Initialize the game board
function createBoard() {
  board = Array.from({ length: rows }, () => Array(cols).fill(0));
  drawBoard();
}

// Draw the board
function drawBoard() {
  tetris.innerHTML = '';
  board.forEach(row => {
    row.forEach(cell => {
      const div = document.createElement('div');
      div.classList.add('cell');
      if (cell) div.classList.add('filled');
      tetris.appendChild(div);
    });
  });
}

// Spawn a random tetromino
function spawnPiece() {
  const randomIndex = Math.floor(Math.random() * tetrominoes.length);
  currentPiece = tetrominoes[randomIndex];
  currentX = 0;
  currentY = Math.floor((cols - currentPiece[0].length) / 2);

  if (!canPlacePiece(currentX, currentY)) {
    gameOver();
  } else {
    placePiece(currentX, currentY, 1);
    drawBoard();
  }
}

// Check if a piece can be placed
function canPlacePiece(x, y) {
  return currentPiece.every((row, dx) =>
    row.every((value, dy) => {
      const newX = x + dx;
      const newY = y + dy;
      return (
        value === 0 ||
        (board[newX] && board[newX][newY] === 0)
      );
    })
  );
}

// Place or remove a piece on the board
function placePiece(x, y, value) {
  currentPiece.forEach((row, dx) =>
    row.forEach((cell, dy) => {
      if (cell) {
        board[x + dx][y + dy] = value;
      }
    })
  );
}

// Move the piece down
function moveDown() {
  placePiece(currentX, currentY, 0);
  if (canPlacePiece(currentX + 1, currentY)) {
    currentX++;
  } else {
    placePiece(currentX, currentY, 1);
    clearLines();
    spawnPiece();
  }
  placePiece(currentX, currentY, 1);
  drawBoard();
}

// Clear completed lines
function clearLines() {
  board = board.filter(row => !row.every(cell => cell === 1));
  while (board.length < rows) {
    board.unshift(Array(cols).fill(0));
  }
  score += 10;
  scoreDisplay.textContent = score;
}

// Handle game over
function gameOver() {
  clearInterval(gameInterval);
  alert('Game Over! Your score: ' + score);
  startButton.disabled = false;
}

// Start the game
function startGame() {
  score = 0;
  scoreDisplay.textContent = score;
  createBoard();
  spawnPiece();
  gameInterval = setInterval(moveDown, 500);
  startButton.disabled = true;
}

// Handle keyboard controls
document.addEventListener('keydown', event => {
  if (!currentPiece) return;

  placePiece(currentX, currentY, 0);

  switch (event.key) {
    case 'ArrowLeft':
      if (canPlacePiece(currentX, currentY - 1)) currentY--;
      break;
    case 'ArrowRight':
      if (canPlacePiece(currentX, currentY + 1)) currentY++;
      break;
    case 'ArrowDown':
      if (canPlacePiece(currentX + 1, currentY)) currentX++;
      break;
    case 'ArrowUp':
      rotatePiece();
      break;
  }

  placePiece(currentX, currentY, 1);
  drawBoard();
});

// Rotate the piece
function rotatePiece() {
  const newPiece = currentPiece[0].map((_, i) =>
    currentPiece.map(row => row[i]).reverse()
  );
  placePiece(currentX, currentY, 0);
  if (canPlacePiece(currentX, currentY)) currentPiece = newPiece;
  placePiece(currentX, currentY, 1);
}

// Add event listener to the start button
startButton.addEventListener('click', startGame);
