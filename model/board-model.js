class Board {
  constructor(xSize = 5, ySize = 5) {
    this.x = isNaN(parseInt(xSize)) ? 5 : parseInt(xSize);
    this.y = isNaN(parseInt(ySize)) ? 5 : parseInt(ySize);
  }

  isValidPosition(x, y) {
    return x >= 0 && x < this.x && y >= 0 && y < this.y;
  }

  displayBoard(robotX, robotY, robotDirection) {
    let bottomRow = "  ";
    for (let y = this.y - 1; y >= 0; y--) {
      let row = "";
      for (let x = 0; x < this.x; x++) {
        if (y === 0) {
          bottomRow += ` ${x}   `;
        }

        row += `${x === 0 ? y : ""} ${
          x === robotX && y === robotY ? " O " : " * "
        } `; // Robot
      }
      console.log(row);
    }
    console.log(bottomRow);
    console.log(`(${robotX},${robotY}), facing ${robotDirection}`);
  }
}

module.exports = Board;
