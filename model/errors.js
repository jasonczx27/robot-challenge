class Errors {
  static createError(message) {
    const error = `|> ${message}`;
    console.log(error);
  }

  static MOVE_ERROR(message) {
    this.createError(`move error: ${message || "invalid move"}`);
  }
  static PLACE_ERROR(message) {
    this.createError(`place error: ${message || "invalid placement"}`);
  }
  static TURN_ERROR(message) {
    this.createError(`turn error: ${message || "invalid direction"}`);
  }
  static GENERAL_ERROR(message) {
    this.createError(
      `application error: ${message || "unexpected error encountered"}`
    );
  }
}

module.exports = Errors;
