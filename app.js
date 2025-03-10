#!/usr/bin/env node

const readline = require("readline");
const Robot = require("./model/robot-model");

const robot = new Robot();
const Errors = require("./model/errors");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

rl.prompt();

console.log("Enter Commonds (PLACE, MOVE, LEFT, RIGHT, REPORT, EXIT)");
rl.on("line", async (line) => {
  const command = line.trim().toUpperCase();
  let isHalf = false;
  // processes command
  if (command.startsWith("PLACE")) {
    const args = command.split(" ")[1];
    if (args) {
      const [x, y, facing] = args.split(",");
      robot.addToTasks(
        () => robot.place(parseInt(x), parseInt(y), facing),
        true
      );
    }
  } else if (command.startsWith("LEFT")) {
    const args = command.split(" ")[1];
    isHalf = args === "HALF" ? true : false;
    robot.addToTasks(() => robot.left(isHalf));
  } else if (command.startsWith("RIGHT")) {
    const args = command.split(" ")[1];
    isHalf = args === "HALF" ? true : false;
    robot.addToTasks(() => robot.right(isHalf));
  } else if (command === "MOVE") {
    robot.addToTasks(() => robot.move(1)); // Specify robot progression e.g. `robot.move(x<number>)`
  } else if (command === "PLAIN") {
    robot.addToTasks(() => robot.reset(), true);
  } else if (command === "REPORT") {
    await robot.executeTasks();
    console.log("Enter Commonds (PLACE, MOVE, LEFT, RIGHT, REPORT, EXIT)");
  } else if (command === "EXIT") {
    console.clear();
    rl.close();
    return;
  } else if (command === "CLEAR") {
    robot.addToTasks(() => console.clear());
  } else {
    Errors.GENERAL_ERROR("Invalid command.");
  }
  rl.prompt();
});

rl.on("close", () => {
  console.log("-- Exiting Robot Simulator. --");
  process.exit(0);
});
