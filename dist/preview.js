'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'preview',


    propTypes: {
        width: _propTypes2.default.number.isRequired,
        height: _propTypes2.default.number.isRequired,

        // the position of the preview
        position: _propTypes2.default.shape({
            bgVertical: _propTypes2.default.string.isRequired,
            bgHorizontal: _propTypes2.default.string.isRequired
        }).isRequired,

        // the size of the non-zoomed-in image
        smallImage: _propTypes2.default.shape({
            bottom: _propTypes2.default.number.isRequired,
            left: _propTypes2.default.number.isRequired,
            top: _propTypes2.default.number.isRequired,
            right: _propTypes2.default.number.isRequired
        }).isRequired,

        // the size of the zoomed-in image
        zoomImage: _propTypes2.default.shape({
            src: _propTypes2.default.string.isRequired,
            offset: _propTypes2.default.shape({
                x: _propTypes2.default.number,
                y: _propTypes2.default.number
            })
        }).isRequired
    },

    render: function render() {
        var _props = this.props,
            width = _props.width,
            height = _props.height,
            position = _props.position,
            smallImage = _props.smallImage,
            zoomImage = _props.zoomImage;


        var previewStyles = {
            position: 'fixed',
            transform: 'translateZ(0)',
            zIndex: '9999',
            left: zoomImage.offset && zoomImage.offset.x ? smallImage.right + zoomImage.offset.x : smallImage.right,
            top: zoomImage.offset && zoomImage.offset.y ? smallImage.top + zoomImage.offset.y : smallImage.top,
            width: width,
            height: height,
            backgroundImage: 'url(' + zoomImage.src + ')',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: position.bgHorizontal + ' ' + position.bgVertical
        };

        return _react2.default.createElement('div', { style: previewStyles });
    }
});