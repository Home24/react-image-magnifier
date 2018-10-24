'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (_ref) {
    var x = _ref.x,
        y = _ref.y,
        smallImage = _ref.smallImage,
        rectangleHeight = _ref.rectangleHeight,
        rectangleWidth = _ref.rectangleWidth,
        previewDiffX = _ref.previewDiffX,
        previewDiffY = _ref.previewDiffY;
    var left = smallImage.left,
        top = smallImage.top,
        right = smallImage.right,
        bottom = smallImage.bottom,
        height = smallImage.height,
        width = smallImage.width;

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