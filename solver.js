const fs = require("fs");

class Solver {
  constructor() {
    this.sudokuBoard = [];
    this.maxLength = 9;
    this.firstThreeNumbers = [];
    this.sumFirstThreeNumbers = [];
  }

  /**
   * Step 1 - Solve the puzzle (fill in all numbers in the grid)
   * Step 2 - Find the sum of the first three numbers in the top row
   * (from the left). For example, in the solution grid above,
   * the sum is 4+8+3=15
   * Step 3 - Find this sum for each of the 50 puzzles
   * @param {*} filename
   */
  solve(filename) {
    console.log(`--- Step 1 ---`);
    const step1 = this.solveStep1(filename);
    console.log(step1);
    console.log(`\n--- Step 2 ---`);
    const step2 = this.solveStep2(this.firstThreeNumbers);
    console.log(step2);
    console.log(`\n--- Step 3 ---`);
    const step3 = this.solveStep3();
    console.log(step3);
  }

  /**
   * solve the sudoku puzzle
   * fill in all numbers in the grid
   * @param {*} filename
   */
  solveStep1(filename) {
    const result = [];
    let index = 1;
    const puzzles = this.getPuzzles(filename);

    for (const puzzle of puzzles) {
      this.sudokuBoard = puzzle.split("").map((v) => {
        return isNaN(v) ? 0 : +v;
      });

      if (puzzle.length !== Math.pow(this.maxLength, 2)) {
        result.push(`Grid ${index}: Puzzle is not valid.`);
      } else {
        const tempResult = !this.getCandidate(0)
          ? `Grid ${index}: Solution is not found.`
          : this.formatOutput(this.sudokuBoard.join(""));
        result.push(`\nGrid ${index}\n`);
        result.push(tempResult);
      }

      index++;
    }

    return result.join("");
  }

  /**
   * sum of the first three numbers
   * @param {*} numbers
   */
  solveStep2(numbers) {
    const result = [];
    let index = 1;
    for (const number of numbers) {
      const tempNumbers = [...number];
      const getSum = tempNumbers.reduce((a, b) => parseInt(a) + parseInt(b), 0);
      this.sumFirstThreeNumbers.push(getSum);
      result.push(`\nGrid ${index}\n`);
      result.push(
        `${tempNumbers[0]} + ${tempNumbers[1]} + ${tempNumbers[2]} = ${getSum}`
      );
      index++;
    }
    return result.join("");
  }

  /**
   * sum for each of the 50 puzzles
   */
  solveStep3() {
    const summaries = this.sumFirstThreeNumbers;
    const total = summaries.reduce((a, b) => a + b, 0);
    return `${summaries.join(" + ")} = ${total}`;
  }

  /**
   * get puzzles from given file
   * @param {*} filename
   */
  getPuzzles(filename) {
    const data = fs.readFileSync(filename, "utf8");
    const puzzles = data
      .replace(/Grid [0-9]+/g, "|")
      .replace(/\n/g, "")
      .substring(1)
      .split("|");
    return puzzles;
  }

  /**
   * check all possible numbers for a cell
   * @param {*} index
   */
  getCandidate(index) {
    if (index >= this.sudokuBoard.length) {
      return true;
    } else if (this.sudokuBoard[index] != 0) {
      return this.getCandidate(index + 1);
    }

    for (let i = 1; i <= this.maxLength; i++) {
      const isValidNumber = this.checkCandidate(
        i,
        Math.floor(index / this.maxLength),
        index % this.maxLength
      );
      if (isValidNumber) {
        this.sudokuBoard[index] = i;
        if (this.getCandidate(index + 1)) {
          return true;
        }
      }
    }

    this.sudokuBoard[index] = 0;
    return false;
  }

  /**
   * check whether the number is valid for current cell or not
   * @param {*} num
   * @param {*} row
   * @param {*} col
   */
  checkCandidate(num, row, col) {
    for (let i = 0; i < this.maxLength; i++) {
      const index =
        (Math.floor(row / 3) * 3 + Math.floor(i / 3)) * this.maxLength +
        Math.floor(col / 3) * 3 +
        (i % 3);
      if (
        num == this.sudokuBoard[row * this.maxLength + i] ||
        num == this.sudokuBoard[col + i * this.maxLength] ||
        num == this.sudokuBoard[index]
      ) {
        return false;
      }
    }
    return true;
  }

  /**
   * format output to be 9x9 sudoku board
   * @param {*} cells
   */
  formatOutput(cells) {
    const tmp = [];
    for (let i = 0; i < cells.length; i += this.maxLength) {
      const cell = cells.slice(i, i + this.maxLength);
      tmp.push(cell);

      if (i < 3) {
        this.firstThreeNumbers.push(cell.substring(0, 3));
      }
    }
    const result = tmp.toString();
    return result.replace(/,/g, "\n");
  }
}

module.exports = Solver;
