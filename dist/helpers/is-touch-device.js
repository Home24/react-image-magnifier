'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch;
};