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

var _magnifier = require('./magnifier');

var _magnifier2 = _interopRequireDefault(_magnifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'image-magnifier',

    propTypes: {

        previewWidth: _react2.default.PropTypes.number,

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
        }).isRequired,

        loadingClassName: _react2.default.PropTypes.string
    },

    getDefaultProps: function getDefaultProps() {
        return {
            previewWidth: 200
        };
    },
    getInitialState: function getInitialState() {
        return {
            x: 0,
            y: 0,
            zoomImageDimensions: { width: 0, height: 0 },
            imageLoaded: false
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

            _this2.setState({
                zoomImageDimensions: { width: width, height: height },
                imageLoaded: true
            });
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
        var _props2 = this.props;
        var smallImage = _props2.smallImage;
        var loadingClassName = _props2.loadingClassName;

        var className = this.state.imageLoaded ? '' : loadingClassName || '';

        return _react2.default.createElement(
            'div',
            { className: className },
            _react2.default.createElement('img', { src: smallImage.src, alt: smallImage.alt })
        );
    }
});