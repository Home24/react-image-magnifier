"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default() {
  return 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch;
};

exports.default = _default;