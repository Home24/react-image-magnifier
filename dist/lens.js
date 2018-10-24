'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'lens',


    propTypes: {

        // the size of the magnifier window
        width: _propTypes2.default.number.isRequired,
        height: _propTypes2.default.number.isRequired,

        // the position of the lens relative to the image
        position: _propTypes2.default.shape({
            top: _propTypes2.default.number.isRequired,
            left: _propTypes2.default.number.isRequired,
            marginLeft: _propTypes2.default.number,
            marginTop: _propTypes2.default.number
        }).isRequired
    },

    render: function render() {
        var _props = this.props,
            width = _props.width,
            height = _props.height,
            position = _props.position;


        var styles = {
            position: 'absolute',
            border: '2px solid grey',
            transform: 'translateZ(0)',
            width: width,
            height: height
        };

        return _react2.default.createElement('div', { style: (0, _assign2.default)(styles, position) });
    }
});