'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'preview',

    propTypes: {
        width: _react2.default.PropTypes.number.isRequired,
        height: _react2.default.PropTypes.number.isRequired,

        // the position of the preview
        position: _react2.default.PropTypes.shape({
            bgVertical: _react2.default.PropTypes.string.isRequired,
            bgHorizontal: _react2.default.PropTypes.string.isRequired
        }).isRequired,

        // the size of the non-zoomed-in image
        smallImage: _react2.default.PropTypes.shape({
            bottom: _react2.default.PropTypes.number.isRequired,
            left: _react2.default.PropTypes.number.isRequired,
            top: _react2.default.PropTypes.number.isRequired,
            right: _react2.default.PropTypes.number.isRequired
        }).isRequired,

        // the size of the zoomed-in image
        zoomImage: _react2.default.PropTypes.shape({
            src: _react2.default.PropTypes.string.isRequired,
            offset: _react2.default.PropTypes.shape({
                x: _react2.default.PropTypes.number,
                y: _react2.default.PropTypes.number
            })
        }).isRequired
    },

    render: function render() {
        var _props = this.props;
        var width = _props.width;
        var height = _props.height;
        var position = _props.position;
        var smallImage = _props.smallImage;
        var zoomImage = _props.zoomImage;

        var previewStyles = {
            position: 'fixed',
            transform: 'translateZ(0)',
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