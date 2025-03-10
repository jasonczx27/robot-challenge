// src/instructions/instructionProcessor.js
const Robot = require("../model/robot-model");
const Errors = require("../model/errors");

const robot = new Robot();

const processInstruction = async (instruction) => {
  const cleanInstruction = instruction.trim().toUpperCase();
  let isHalf = false;

  if (cleanInstruction.startsWith("PLACE")) {
    const args = cleanInstruction.split(" ")[1];
    if (args) {
      const [x, y, facing] = args.split(",");
      robot.addToTasks(
        () => robot.place(parseInt(x), parseInt(y), facing),
        true
      );
    }
  } else if (cleanInstruction.startsWith("LEFT")) {
    isHalf = cleanInstruction.split(" ")[1] === "HALF";
    robot.addToTasks(() => robot.left(isHalf));
  } else if (cleanInstruction.startsWith("RIGHT")) {
    isHalf = cleanInstruction.split(" ")[1] === "HALF";
    robot.addToTasks(() => robot.right(isHalf));
  } else if (cleanInstruction === "MOVE") {
    robot.addToTasks(() => robot.move(1)); // Specify robot progression e.g. `robot.move(n<number>)`
  } else if (cleanInstruction === "PLAIN") {
    robot.addToTasks(() => robot.reset(), true);
  } else if (cleanInstruction.startsWith("REPORT")) {
    await robot.executeTasks();
    return robot.report();
  } else if (cleanInstruction === "EXIT") {
    console.clear();
    process.exit(0);
  } else if (cleanInstruction === "CLEAR") {
    robot.addToTasks(() => console.clear());
  } else {
    Errors.GENERAL_ERROR("Invalid instruction.");
  }
};

const executeInstructions = async (instructions) => {
  let output;
  for (const instruction of instructions) {
    const result = await processInstruction(instruction);
    if (instruction.toUpperCase() === "REPORT") {
      output = result;
    }
  }
  return output;
};

module.exports = { executeInstructions, processInstruction };
