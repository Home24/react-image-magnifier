'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

var _magnifier = require('./magnifier');

var _magnifier2 = _interopRequireDefault(_magnifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getOffset(el) {
    var element = el;
    var x = 0;
    var y = 0;

    while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
        x += element.offsetLeft - element.scrollLeft;
        y += element.offsetTop - element.scrollTop;
        element = element.offsetParent;
    }

    return { x: x, y: y };
}

exports.default = _react2.default.createClass({
    displayName: 'image-magnifier',

    propTypes: {

        children: _react2.default.PropTypes.element,

        previewWidth: _react2.default.PropTypes.number,

        // the offset of the zoom bubble from the cursor
        cursorOffset: _react2.default.PropTypes.shape({
            x: _react2.default.PropTypes.number.isRequired,
            y: _react2.default.PropTypes.number.isRequired
        }),

        // the size of the zoomed-in image
        zoomImage: _react2.default.PropTypes.shape({
            offset: _react2.default.PropTypes.shape({
                x: _react2.default.PropTypes.number,
                y: _react2.default.PropTypes.number
            }),
            src: _react2.default.PropTypes.string.isRequired
        }).isRequired
    },

    getDefaultProps: function getDefaultProps() {
        return {
            previewWidth: 200,
            cursorOffset: { x: 0, y: 0 }
        };
    },
    getInitialState: function getInitialState() {
        return {
            x: 0,
            y: 0,
            offsetX: -1,
            offsetY: -1
        };
    },
    componentDidMount: function componentDidMount() {
        document.addEventListener('mousemove', this.onMouseMove);
        if (!this.portalElement) {
            this.portalElement = document.createElement('div');
            document.body.appendChild(this.portalElement);
        }
        this.componentDidUpdate();
    },
    componentDidUpdate: function componentDidUpdate() {
        var _this = this;

        var zoomImage = (0, _assign2.default)(this.props.zoomImage);

        var img = new Image();

        img.onload = function (event) {
            var image = event.currentTarget;
            zoomImage.width = image.width;
            zoomImage.height = image.height;

            _this.renderMagnifier(zoomImage);
        };

        img.src = zoomImage.src;
    },
    componentWillUnmount: function componentWillUnmount() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.body.removeChild(this.portalElement);
        this.portalElement = null;
    },
    onMouseMove: function onMouseMove(e) {
        var offset = getOffset(_reactDom2.default.findDOMNode(this));
        this.setState({
            x: e.x + window.scrollX,
            y: e.y + window.scrollY,
            offsetX: e.x - offset.x,
            offsetY: e.y - offset.y
        });
    },

    portalElement: null,

    renderMagnifier: function renderMagnifier(zoomImage) {
        var _ReactDOM$findDOMNode = _reactDom2.default.findDOMNode(this).getBoundingClientRect();

        var left = _ReactDOM$findDOMNode.left;
        var top = _ReactDOM$findDOMNode.top;
        var right = _ReactDOM$findDOMNode.right;
        var bottom = _ReactDOM$findDOMNode.bottom;
        var width = _ReactDOM$findDOMNode.width;
        var height = _ReactDOM$findDOMNode.height;

        var smallImage = { left: left, top: top, right: right, bottom: bottom, width: width, height: height };

        _reactDom2.default.render(_react2.default.createElement(_magnifier2.default, _extends({
            previewWidth: this.props.previewWidth,
            smallImage: smallImage,
            zoomImage: zoomImage,
            cursorOffset: this.props.cursorOffset
        }, this.state)), this.portalElement);
    },
    render: function render() {
        return this.props.children;
    }
});