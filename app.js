#!/usr/bin/env node

const readline = require("readline");
const { processInstruction } = require("./command-processor/processor");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

console.log("Enter Commands (PLACE, MOVE, LEFT, RIGHT, REPORT, EXIT)");
rl.prompt();

rl.on("line", async (line) => {
  await processInstruction(line);
  rl.prompt();
});

rl.on("close", () => {
  console.log("-- Exiting Robot Simulator. --");
  process.exit(0);
});
