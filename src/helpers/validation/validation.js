"use strict";

/**
 * Checks for the existence of the value.
 * @param value any value
 * @returns {boolean}
 */
function isDefined(value) {
  return value !== undefined && value !== null;
}

/**
 * Checks for presence of the value (e.g. from RegExp execution result).
 * @param value any value
 * @returns {boolean}
 */
function isPresent(value) {
  return isDefined(value) && value !== "";
}

module.exports = {
  isDefined,
  isPresent
};
