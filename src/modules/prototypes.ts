import logger from "./logger";

String.prototype.toPlainHex = function () {
  try {
    const value = this;
    return value.replace(/:/g, "").toLowerCase();
  } catch (err) {
    logger.error("prototypes", "toPlainHex", err);
    return null;
  }
};

Array.prototype.unique = function () {
  try {
    return this.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  } catch (err) {
    logger.error("prototypes", "unique", err);
    return [];
  }
};

export default { String, Array };
