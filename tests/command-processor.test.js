const { executeInstructions } = require("../command-processor/processor");

describe("Robot Instruction Processing", () => {
  test("Should correctly process a sequence of instructions", async () => {
    const instructions = [
      "PLACE 3,3,NORTH",
      "LEFT",
      "LEFT",
      "MOVE",
      "MOVE",
      "REPORT",
    ];

    const result = await executeInstructions(instructions);
    expect(result).toStrictEqual({ x: 3, y: 1, facing: "SOUTH" });
  });

  test("Should declare invalid when user input invalid coordinate", async () => {
    const instructions = [
      "PLACE 3,b,NORTH",
      "LEFT",
      "LEFT",
      "MOVE",
      "MOVE",
      "REPORT",
    ];

    const result = await executeInstructions(instructions);
    expect(result).toBeUndefined();
  });

  test("Should ignore MOVE commands if the robot hasn't been placed", async () => {
    const instructions = ["PLAIN", "MOVE", "LEFT", "RIGHT", "REPORT"];
    const result = await executeInstructions(instructions);
    expect(result).toBeUndefined(); // No valid PLACE, so no output expected
  });

  test("Should prevent the robot from falling off the board", async () => {
    const instructions = ["PLACE 0,0,SOUTH", "MOVE", "REPORT"];
    const result = await executeInstructions(instructions);
    expect(result).toStrictEqual({ x: 0, y: 0, facing: "SOUTH" }); // Robot shouldn't have moved
  });

  test("Should allow multiple PLACE commands and move accordingly", async () => {
    const instructions = [
      "PLACE 1,1,EAST",
      "MOVE",
      "PLACE 2,2,NORTH",
      "MOVE",
      "REPORT",
    ];
    const result = await executeInstructions(instructions);
    expect(result).toStrictEqual({ x: 2, y: 3, facing: "NORTH" }); // Should respect the latest PLACE
  });

  test("Should rotate correctly", async () => {
    const instructions = ["PLACE 1,1,NORTH", "RIGHT", "REPORT"];
    const result = await executeInstructions(instructions);
    expect(result).toStrictEqual({ x: 1, y: 1, facing: "EAST" });
  });
});
