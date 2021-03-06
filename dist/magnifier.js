'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'magnifier',

    propTypes: {

        // the size of the magnifier window
        previewWidth: _react2.default.PropTypes.number.isRequired,

        // x position on screen
        x: _react2.default.PropTypes.number.isRequired,

        // y position on screen
        y: _react2.default.PropTypes.number.isRequired,

        // the size of the non-zoomed-in image
        smallImage: _react2.default.PropTypes.shape({
            bottom: _react2.default.PropTypes.number.isRequired,
            left: _react2.default.PropTypes.number.isRequired,
            top: _react2.default.PropTypes.number.isRequired,
            right: _react2.default.PropTypes.number.isRequired,
            width: _react2.default.PropTypes.number.isRequired,
            height: _react2.default.PropTypes.number.isRequired
        }).isRequired,

        // the size of the zoomed-in image
        zoomImage: _react2.default.PropTypes.shape({
            src: _react2.default.PropTypes.string.isRequired,
            width: _react2.default.PropTypes.number.isRequired,
            height: _react2.default.PropTypes.number.isRequired,
            offset: _react2.default.PropTypes.shape({
                x: _react2.default.PropTypes.number,
                y: _react2.default.PropTypes.number
            })
        }).isRequired
    },

    render: function render() {
        var _props = this.props;
        var smallImage = _props.smallImage;
        var zoomImage = _props.zoomImage;
        var y = _props.y;
        var x = _props.x;
        var previewWidth = _props.previewWidth;

        var isVisible = y > smallImage.top && x > smallImage.left && y < smallImage.bottom && x < smallImage.right;

        if (!isVisible) {
            return null;
        }

        var ySmallRatio = smallImage.height / smallImage.width;
        var yBigRatio = zoomImage.height / zoomImage.width;

        var imagesDiffX = smallImage.width / zoomImage.width; // Diff between big and small images preview windows
        // const imagesDiffY = zoomImage.height / smallImage.height;

        var rectangleSizeX = previewWidth * imagesDiffX;
        var rectangleSizeY = rectangleSizeX * ySmallRatio;

        var previewSizeX = previewWidth;
        var previewSizeY = previewWidth * yBigRatio;

        var previewDiffY = previewSizeY / rectangleSizeY;
        var previewDiffX = previewSizeX / rectangleSizeX;

        // TODO cursor offset support

        // previews rectangles

        var _calculateStyles = calculateStyles(x, y, smallImage, rectangleSizeX, rectangleSizeY, previewDiffX, previewDiffY);

        var rectanglePosition = _calculateStyles.rectanglePosition;
        var previewPosition = _calculateStyles.previewPosition;

        var rectangleStyles = {
            position: 'absolute',
            width: rectangleSizeX,
            height: rectangleSizeY,
            border: '2px solid grey',
            boxShadow: '1px 1px 6px rgba(0,0,0,0.3)'
        };

        var previewStyles = {
            position: 'absolute',
            left: zoomImage.offset && zoomImage.offset.x ? smallImage.right + zoomImage.offset.x : smallImage.right,
            top: zoomImage.offset && zoomImage.offset.y ? smallImage.top + zoomImage.offset.y : smallImage.top,
            width: previewSizeX,
            height: previewSizeY,
            backgroundImage: 'url(' + zoomImage.src + ')',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: previewPosition.bgHorizontal + ' ' + previewPosition.bgVertical
        };

        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement('div', { style: (0, _assign2.default)(rectangleStyles, rectanglePosition) }),
            _react2.default.createElement('div', { style: previewStyles })
        );
    }
});

function calculateStyles(x, y, smallImage, rectangleSizeX, rectangleSizeY, previewDiffX, previewDiffY) {
    var left = smallImage.left;
    var top = smallImage.top;
    var right = smallImage.right;
    var bottom = smallImage.bottom;

    var rectangleHalfSizeX = Math.floor(rectangleSizeX / 2);
    var rectangleHalfSizeY = Math.floor(rectangleSizeY / 2);

    var rectanglePosition = {};
    var previewPosition = {};

    // vertical position
    if (y + rectangleHalfSizeY >= bottom) {
        rectanglePosition.top = bottom - rectangleSizeY;
        previewPosition.bgVertical = 'bottom';
    } else if (y - rectangleHalfSizeY <= top) {
        rectanglePosition.top = top;
        previewPosition.bgVertical = 'top';
    } else {
        rectanglePosition.top = y;
        rectanglePosition.marginTop = -rectangleHalfSizeY;
        previewPosition.bgVertical = -(y - top - rectangleHalfSizeY) * previewDiffY + 'px';
    }

    // horizontal position
    if (x + rectangleHalfSizeX >= right) {
        rectanglePosition.left = right - rectangleSizeX;
        previewPosition.bgHorizontal = 'right';
    } else if (x - rectangleHalfSizeX <= left) {
        rectanglePosition.left = left;
        previewPosition.bgHorizontal = 'left';
    } else {
        rectanglePosition.left = x;
        rectanglePosition.marginLeft = -rectangleHalfSizeX;
        previewPosition.bgHorizontal = -(x - left - rectangleHalfSizeX) * previewDiffX + 'px';
    }

    return { rectanglePosition: rectanglePosition, previewPosition: previewPosition };
}