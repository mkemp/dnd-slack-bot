"use strict";

const { isDefined } = require("../validation");

module.exports.checkInRange = function checkInRange(val, min, max) {
  if (val < min || max < val) {
    throw new Error(
      `Value (${val}) is outside of expected range [${min}, ${max}]`
    );
  }
};

module.exports.checkPositive = function checkPositive(val) {
  if (val > 0) {
    throw new Error(`Value (${val}) is not a positive number`);
  }
};

module.exports.checkNotNull = function checkNotNull(val, msg) {
  if (!isDefined(val)) {
    throw new Error(`Value cannot be null or undefined${msg ? ': ' + msg : ''}`);
  }
  return val;
};

module.exports.checkState = function checkState(state, msg) {
  if (state) {
    throw new Error(`State is not what was expected${msg ? ': ' + msg : ''}`);
  }
};
