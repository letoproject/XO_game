const gameBoard = document.querySelector("#board");
const info = document.querySelector("#info");
const playerXScore = document.querySelector("#playerX_score");
const playerOScore = document.querySelector("#playerO_score");
const drawScore = document.querySelector("#draw");
const resetBtn = document.querySelector(".btn_reset");

const winningCombos = [
  // rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  //columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  //diagonal
  [0, 4, 8],
  [2, 4, 6],
];

let turn,
  drawScoreNum = 0,
  playerXScoreNum = 0,
  playerOScoreNum = 0;

resetBtn.addEventListener("click", resetScore);

function createGameBoard() {
  let board = " ".repeat(9).split("");
  const tileGrid = board.map((t) => `<button class="tile"></button>`).join("");
  turn = "X";
  info.textContent = `${turn}'s turn`;
  gameBoard.addEventListener("click", handleCellClick);
  gameBoard.removeAttribute("inert");
  gameBoard.innerHTML = tileGrid;
}

createGameBoard();

function updateTurn() {
  turn = turn === "X" ? "O" : "X";
  info.textContent = `${turn}'s turn`;
  document.documentElement.style.setProperty("--hue", turn === "X" ? 10 : 200);
}

function handleCellClick(e) {
  const target = e.target;
  const validValue = target.dataset.value;
  const isTile = target.classList.contains("tile");

  if (!validValue && isTile) {
    target.dataset.value = turn;
    target.classList.add("disabled");
    target.style.setProperty("--hue", turn === "X" ? 10 : 200);
    checkScore();
  }
}

function checkScore() {
  const allTiles = [...document.querySelectorAll(".tile")];
  const tileValues = allTiles.map((t) => t.dataset.value);
  const isWinner = winningCombos.some((combo) => {
    const [a, b, c] = combo;
    return (
      tileValues[a] &&
      tileValues[a] === tileValues[b] &&
      tileValues[a] === tileValues[c]
    );
  });

  if (!document.querySelectorAll(".tile:not(.disabled)").length) {
    return showResults("It's draw");
  }

  if (isWinner) {
    console.log(tileValues);
    return showResults(`${turn} win`);
  }

  updateTurn();
}

function showResults(message) {
  info.textContent = `${message}`;
  gameBoard.removeEventListener("click", handleCellClick);
  gameBoard.setAttribute("inert", true);

  if (message === "It's draw") {
    addDrawScore();
  }

  if (message === `${turn} win`) {
    turn === "X" ? addPlayerXScore() : addPlayerOScore();
  }

  restartGame();
}

function restartGame() {
  let seconds = 3;
  const timer = setInterval(() => {
    info.textContent = `Restart in ${seconds}`;
    seconds -= 1;
    if (seconds < 0) {
      clearInterval(timer);
      createGameBoard();
    }
  }, 1000);
}

function addPlayerXScore() {
  playerXScoreNum += 1;
  playerXScore.textContent = `${playerXScoreNum}`;
}

function addPlayerOScore() {
  playerOScoreNum += 1;
  playerOScore.textContent = `${playerOScoreNum}`;
}

function addDrawScore() {
  drawScoreNum += 1;
  drawScore.textContent = `${drawScoreNum}`;
}

function resetScore() {
  drawScoreNum = 0;
  playerXScoreNum = 0;
  playerOScoreNum = 0;
  drawScore.textContent = `${drawScoreNum}`;
  playerXScore.textContent = `${playerXScoreNum}`;
  playerOScore.textContent = `${playerOScoreNum}`;
}