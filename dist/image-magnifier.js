'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _magnifier = require('./magnifier');

var _magnifier2 = _interopRequireDefault(_magnifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

        smallImage: _react2.default.PropTypes.shape({
            src: _react2.default.PropTypes.string.isRequired,
            alt: _react2.default.PropTypes.string.isRequired
        }).isRequired,

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
            zoomImageDimensions: {
                width: 0,
                height: 0
            }
        };
    },
    componentDidMount: function componentDidMount() {
        var _this = this;

        if (!this.portalElement) {
            this.portalElement = document.createElement('div');
            document.body.appendChild(this.portalElement);
        }

        this._isMounted = true;

        this.loadImage(function () {
            document.addEventListener('mousemove', _this.onMouseMove);
        });
    },
    componentDidUpdate: function componentDidUpdate() {
        var _ReactDOM$findDOMNode = _reactDom2.default.findDOMNode(this).getBoundingClientRect();

        var left = _ReactDOM$findDOMNode.left;
        var top = _ReactDOM$findDOMNode.top;
        var right = _ReactDOM$findDOMNode.right;
        var bottom = _ReactDOM$findDOMNode.bottom;
        var width = _ReactDOM$findDOMNode.width;
        var height = _ReactDOM$findDOMNode.height;
        var _props = this.props;
        var zoomImage = _props.zoomImage;
        var previewWidth = _props.previewWidth;
        var cursorOffset = _props.cursorOffset;
        var _state = this.state;
        var x = _state.x;
        var y = _state.y;
        var zoomImageDimensions = _state.zoomImageDimensions;

        var smallImage = { left: left, top: top, right: right, bottom: bottom, width: width, height: height };
        var zoomImageExtended = (0, _assign2.default)({}, zoomImage, zoomImageDimensions);

        _reactDom2.default.render(_react2.default.createElement(_magnifier2.default, {
            previewWidth: previewWidth,
            smallImage: smallImage,
            zoomImage: zoomImageExtended,
            cursorOffset: cursorOffset,
            x: x,
            y: y
        }), this.portalElement);
    },
    componentWillUnmount: function componentWillUnmount() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.body.removeChild(this.portalElement);
        this.portalElement = null;
        this._isMounted = false;
    },
    onMouseMove: function onMouseMove(e) {
        // const offset = getOffset(ReactDOM.findDOMNode(this));
        this.setState({
            x: e.x + window.scrollX,
            y: e.y + window.scrollY
        });
    },
    loadImage: function loadImage(callback) {
        var _this2 = this;

        var zoomImage = (0, _assign2.default)(this.props.zoomImage);
        var img = new Image();

        img.onload = function (event) {

            if (!_this2._isMounted) {
                return;
            }

            var _event$currentTarget = event.currentTarget;
            var width = _event$currentTarget.width;
            var height = _event$currentTarget.height;

            _this2.setState({ zoomImageDimensions: { width: width, height: height } });
            callback();
        };

        img.src = zoomImage.src;
    },

    _isMounted: false,

    portalElement: null,

    removeMagnifier: function removeMagnifier() {
        this.portalElement.innerHTML = '';
    },
    render: function render() {
        var smallImage = this.props.smallImage;

        return _react2.default.createElement('img', { src: smallImage.src, alt: smallImage.alt });
    }
});