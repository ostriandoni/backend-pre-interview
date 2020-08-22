const express = require("express");
const solver = require("./solver");
const app = express();
const port = 3000;

app.listen(port, async () => {
  const sudoku = new solver();
  sudoku.solve("sudoku.txt");
});
