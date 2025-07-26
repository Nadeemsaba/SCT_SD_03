const container = document.getElementById('sudoku-container');
let solution = [];
let seconds = 0;
let timerInterval = null;

// Setup grid
function setupGrid() {
  container.innerHTML = '';
  for (let i = 0; i < 81; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1;
    input.classList.add('cell');
    input.dataset.index = i;

    const row = Math.floor(i / 9);
    const col = i % 9;

    if (row % 3 === 0) input.classList.add('top-thick');
    if (col % 3 === 0) input.classList.add('left-thick');
    if (col === 8) input.classList.add('right-thick');
    if (row === 8) input.classList.add('bottom-thick');

    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^1-9]/g, '');
    });

    container.appendChild(input);
  }
}

// Get current grid values
function getCurrentGrid() {
  return [...document.querySelectorAll('.cell')].map(cell => +cell.value || 0);
}

// Render values in grid
function renderGrid(values) {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, i) => {
    cell.value = values[i] === 0 ? '' : values[i];
    cell.classList.remove('invalid', 'valid');
  });
}

// Check if a number placement is valid
function isPlacementValid(grid, row, col, num, index) {
  for (let i = 0; i < 9; i++) {
    if ((i !== col && grid[row * 9 + i] === num) ||
        (i !== row && grid[i * 9 + col] === num)) {
      return false;
    }

    const boxRow = Math.floor(row / 3) * 3 + Math.floor(i / 3);
    const boxCol = Math.floor(col / 3) * 3 + i % 3;
    const boxIndex = boxRow * 9 + boxCol;

    if (boxIndex !== index && grid[boxIndex] === num) return false;
  }
  return true;
}

// Backtracking solver
function solveGrid(grid) {
  for (let i = 0; i < 81; i++) {
    if (grid[i] === 0) {
      for (let num = 1; num <= 9; num++) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        if (isPlacementValid(grid, row, col, num, i)) {
          grid[i] = num;
          if (solveGrid(grid)) return true;
          grid[i] = 0;
        }
      }
      return false;
    }
  }
  return true;
}

// Solve the puzzle
function solve() {
  const inputBoard = getCurrentGrid();
  const trial = [...inputBoard];
  if (solveGrid(trial)) {
    renderGrid(trial);
    alert("🎉 Puzzle Solved!");
  } else {
    alert("❌ No solution found.");
  }
}

// Reset puzzle
function reset() {
  document.querySelectorAll('.cell').forEach(cell => {
    cell.value = '';
    cell.classList.remove('invalid', 'valid');
  });
}

// Generate puzzle
function generate() {
  reset();
  startTimer();

  const level = document.getElementById('level').value;
  const clues = level === 'easy' ? 40 : level === 'medium' ? 30 : 22;

  let full = Array(81).fill(0);
  solveGrid(full);
  solution = [...full];

  let puzzle = [...solution];
  let removed = 0;
  while (removed < 81 - clues) {
    let pos = Math.floor(Math.random() * 81);
    if (puzzle[pos] !== 0) {
      puzzle[pos] = 0;
      removed++;
    }
  }

  renderGrid(puzzle);
}

// Check filled cells
function checkBoard() {
  const userGrid = getCurrentGrid();
  const cells = document.querySelectorAll('.cell');
  let correct = 0;
  let total = 0;

  cells.forEach((cell, i) => {
    const val = +cell.value;
    if (val !== 0) {
      total++;
      if (val === solution[i]) {
        cell.classList.add('valid');
        cell.classList.remove('invalid');
        correct++;
      } else {
        cell.classList.add('invalid');
        cell.classList.remove('valid');
      }
    } else {
      cell.classList.remove('valid', 'invalid');
    }
  });

  if (total === 0) {
    alert("Fill in some numbers first.");
  } else if (correct === total) {
    alert("✅ All filled numbers are correct!");
  } else {
    alert(`❌ ${total - correct} incorrect entries.`);
  }
}

// Start game timer
function startTimer() {
  clearInterval(timerInterval);
  seconds = 0;
  document.getElementById('timer').textContent = '⏱ 00:00';

  timerInterval = setInterval(() => {
    seconds++;
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `⏱ ${min}:${sec}`;
  }, 1000);
}

// Event listeners
document.getElementById('btn-generate').addEventListener('click', generate);
document.getElementById('btn-solve').addEventListener('click', solve);
document.getElementById('btn-reset').addEventListener('click', reset);
document.getElementById('btn-verify').addEventListener('click', checkBoard);

// Init
setupGrid();
