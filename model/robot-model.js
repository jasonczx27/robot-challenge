const Board = require("./board-model");
const Errors = require("./errors");

class Robot {
  constructor() {
    this.board = new Board(); // Specify board dimension e.g. `new Board(x<number>,y<number>)`
    this.taskLists = [];
    this.robotPlacementList = [];
    this.robotPlacement = { x: null, y: null, facing: null };
    this.directions = [
      "NORTH",
      "NORTHEAST",
      "EAST",
      "SOUTHEAST",
      "SOUTH", //4
      "SOUTHWEST", // 5
      "WEST", //6
      "NORTHWEST",
    ]; // Direction in clockwise always starting from North
  }
  addToTasks(task, clear = false) {
    if (clear) {
      this.taskLists = [];
    }
    this.taskLists.push(task);
  }
  async executeTasks() {
    this.addToTasks(() => this.report());
    while (this.taskLists.length > 0) {
      const task = this.taskLists.shift();
      await task();
      await this.robotPlacementList.push(
        Object.assign({}, this.robotPlacement)
      );
    }
    return;
  }
  convey(action) {
    let message;
    switch (action) {
      case "place":
        message = "tips: Place command e.g.  PLACE 1,2,NORTH";
        break;
      default:
        message = "Enter commands (PLACE, MOVE, LEFT, RIGHT, REPORT, EXIT)";
        break;
    }
    console.log(message);
  }
  place(x, y, facing) {
    if (this.board.isValidPosition(x, y) && this.directions.includes(facing)) {
      this.robotPlacement.x = x;
      this.robotPlacement.y = y;
      this.robotPlacement.facing = facing;
    } else {
      if (!this.board.isValidPosition(x, y)) {
        Errors.PLACE_ERROR(`Invalid Position x:${x}, y:${y}!`);
      }

      if (!this.directions.includes(facing)) {
        Errors.PLACE_ERROR(`Invalid Direction ${facing}!`);
      }
      this.reset();
    }
  }
  isDiagonal(directionIdx) {
    return this.directions.length > 4 && directionIdx % 2 === 0;
  }

  calculateXMovement(slot = 1) {
    const positiveCheck = new RegExp("EAST");
    const negativeCheck = new RegExp("WEST");
    return positiveCheck.test(this.robotPlacement.facing)
      ? slot
      : negativeCheck.test(this.robotPlacement.facing)
      ? -slot
      : 0;
  }

  calculateYMovement(slot = 1) {
    const positiveCheck = new RegExp("NORTH");
    const negativeCheck = new RegExp("SOUTH");
    return positiveCheck.test(this.robotPlacement.facing)
      ? slot
      : negativeCheck.test(this.robotPlacement.facing)
      ? -slot
      : 0;
  }
  reset() {
    this.robotPlacement.x = null;
    this.robotPlacement.y = null;
    this.robotPlacement.facing = null;
  }
  move(slot = 1) {
    if (
      this.robotPlacement.x === null ||
      this.robotPlacement.y === null ||
      !this.robotPlacement.facing
    ) {
      return;
    }
    let projection = {
      x: this.robotPlacement.x,
      y: this.robotPlacement.y,
    };
    const strictSlot = isNaN(parseInt(slot)) ? 1 : parseInt(slot);
    projection.x += this.calculateXMovement(strictSlot);
    projection.y += this.calculateYMovement(strictSlot);
    if (this.board.isValidPosition(projection.x, projection.y)) {
      this.robotPlacement.x = projection.x;
      this.robotPlacement.y = projection.y;
    } else {
      Errors.MOVE_ERROR(
        `The robot is falling out (moving towards ${this.robotPlacement.facing} at ${this.robotPlacement.x},${this.robotPlacement.y}), movement not proceeded!`
      );
    }
  }
  left(isHalf = false) {
    if (this.robotPlacement.facing) {
      let directionIdx = this.directions.indexOf(this.robotPlacement.facing);
      const pointer =
        (directionIdx +
          this.directions.length -
          (isHalf ? 1 : this.directions.length / 4)) %
        this.directions.length;
      //get remainder depending on whether this is a 4 way or further way direction list.
      this.robotPlacement.facing = this.directions[pointer];
    }
  }

  right(isHalf = false) {
    if (this.robotPlacement.facing) {
      let directionIdx = this.directions.indexOf(this.robotPlacement.facing);
      const pointer =
        (directionIdx + ((isHalf ? 1 : this.directions.length / 4) % 4)) %
        this.directions.length;
      this.robotPlacement.facing = this.directions[pointer];
    }
  }

  report(testMode = false) {
    if (this.robotPlacement.x !== null && this.robotPlacement.y !== null) {
      console.clear();
      let flow = "";
      for (let i = 0; i < this.robotPlacementList.length; i++) {
        const { x, y, facing } = this.robotPlacementList[i];
        flow += `>> ${x},${y}, ${facing} `;
      }
      console.log(flow);
      this.board.displayBoard(
        this.robotPlacement.x,
        this.robotPlacement.y,
        this.robotPlacement.facing
      );
      console.log(this.robotPlacement);
      return this.robotPlacement;
    } else {
      Errors.PLACE_ERROR("No coordinate. Make a valid robot placement first");
      return undefined;
    }
  }
}

module.exports = Robot;
