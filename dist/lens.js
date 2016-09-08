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
    displayName: 'lens',


    propTypes: {

        // the size of the magnifier window
        width: _react2.default.PropTypes.number.isRequired,
        height: _react2.default.PropTypes.number.isRequired,

        // the position of the lens relative to the image
        position: _react2.default.PropTypes.shape({
            top: _react2.default.PropTypes.number.isRequired,
            left: _react2.default.PropTypes.number.isRequired,
            marginLeft: _react2.default.PropTypes.number,
            marginTop: _react2.default.PropTypes.number
        }).isRequired
    },

    render: function render() {
        var _props = this.props;
        var width = _props.width;
        var height = _props.height;
        var position = _props.position;


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