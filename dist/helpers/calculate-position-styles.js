'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (_ref) {
    var x = _ref.x;
    var y = _ref.y;
    var smallImage = _ref.smallImage;
    var rectangleHeight = _ref.rectangleHeight;
    var rectangleWidth = _ref.rectangleWidth;
    var previewDiffX = _ref.previewDiffX;
    var previewDiffY = _ref.previewDiffY;
    var left = smallImage.left;
    var top = smallImage.top;
    var right = smallImage.right;
    var bottom = smallImage.bottom;
    var height = smallImage.height;
    var width = smallImage.width;

    var rectangleHalfWidth = Math.floor(rectangleWidth / 2);
    var rectangleHalfHeight = Math.floor(rectangleHeight / 2);

    var rectanglePosition = {};
    var previewPosition = {};

    // vertical position
    if (y + rectangleHalfHeight >= bottom) {
        rectanglePosition.top = height - rectangleHeight;
        previewPosition.bgVertical = 'bottom';
    } else if (y - rectangleHalfHeight <= top) {
        rectanglePosition.top = 0;
        previewPosition.bgVertical = 'top';
    } else {
        rectanglePosition.top = y - top;
        rectanglePosition.marginTop = -rectangleHalfHeight;
        previewPosition.bgVertical = -(y - top - rectangleHalfHeight) * previewDiffY + 'px';
    }

    // horizontal position
    if (x + rectangleHalfWidth >= right) {
        rectanglePosition.left = width - rectangleWidth;
        previewPosition.bgHorizontal = 'right';
    } else if (x - rectangleHalfWidth <= left) {
        rectanglePosition.left = 0;
        previewPosition.bgHorizontal = 'left';
    } else {
        rectanglePosition.left = x - left;
        rectanglePosition.marginLeft = -rectangleHalfWidth;
        previewPosition.bgHorizontal = -(x - left - rectangleHalfWidth) * previewDiffX + 'px';
    }

    return { rectanglePosition: rectanglePosition, previewPosition: previewPosition };
};