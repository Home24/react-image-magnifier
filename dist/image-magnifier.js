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

var _lens = require('./lens');

var _lens2 = _interopRequireDefault(_lens);

var _preview = require('./preview');

var _preview2 = _interopRequireDefault(_preview);

var _calculatePositionStyles = require('./helpers/calculate-position-styles');

var _calculatePositionStyles2 = _interopRequireDefault(_calculatePositionStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'image-magnifier',

    propTypes: {
        previewWidth: _react2.default.PropTypes.number,
        previewHeight: _react2.default.PropTypes.number,

        children: _react2.default.PropTypes.element,

        smallImage: _react2.default.PropTypes.shape({
            src: _react2.default.PropTypes.string.isRequired,
            alt: _react2.default.PropTypes.string.isRequired
        }),
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
            previewWidth: 200,
            previewHeight: 200
        };
    },
    getInitialState: function getInitialState() {
        return {
            x: 0,
            y: 0,
            zoomImageDimensions: { width: 0, height: 0 },
            isImageLoaded: false,
            isActive: false
        };
    },
    componentDidMount: function componentDidMount() {
        this._isMounted = true;
        this.loadImage(this.props.zoomImage.src);
        this.bindEvents();
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (this.props.zoomImage !== nextProps.zoomImage) {
            this.setState({ isImageLoaded: false, isActive: false });
            this.loadImage(nextProps.zoomImage.src);
        }
    },
    componentDidUpdate: function componentDidUpdate() {
        this.renderMagnifier();
    },
    componentWillUnmount: function componentWillUnmount() {
        this.onLeave();
        this.unbindEvents();
        this._isMounted = false;
    },
    onEnter: function onEnter() {
        document.addEventListener('mousemove', this.onMouseMove);
    },
    onClick: function onClick() {
        this.setState({ isActive: !this.state.isActive });
    },
    onTouchStart: function onTouchStart(event) {
        // prevent touch actions
        event.preventDefault();
    },
    onLeave: function onLeave() {
        this.removeMagnifier();
        document.removeEventListener('mousemove', this.onMouseMove);
    },
    onMouseMove: function onMouseMove(e) {
        this.setState({ x: e.x, y: e.y });
    },
    bindEvents: function bindEvents() {
        var el = this.refs.stage;
        el.addEventListener('mouseenter', this.onEnter);
        el.addEventListener('mouseleave', this.onLeave);
        el.addEventListener('click', this.onClick);
    },
    unbindEvents: function unbindEvents() {
        var el = this.refs.stage;
        el.removeEventListener('mouseenter', this.onEnter);
        el.removeEventListener('mouseleave', this.onLeave);
        el.removeEventListener('click', this.onClick);
    },
    loadImage: function loadImage(src) {
        var _this = this;

        var img = new Image();

        img.onload = function (event) {
            if (!_this._isMounted) {
                return;
            }

            var _event$currentTarget = event.currentTarget;
            var width = _event$currentTarget.width;
            var height = _event$currentTarget.height;

            _this.handleImageLoad(width, height);
        };

        img.src = src;
    },

    _isMounted: false,

    handleImageLoad: function handleImageLoad(width, height) {
        this.setState({
            zoomImageDimensions: { width: width, height: height },
            isImageLoaded: true
        });
    },
    removeMagnifier: function removeMagnifier() {
        _reactDom2.default.unmountComponentAtNode(this.refs.lens);
        _reactDom2.default.unmountComponentAtNode(this.refs.preview);
    },
    renderMagnifier: function renderMagnifier() {
        var smallImage = _reactDom2.default.findDOMNode(this).getBoundingClientRect();
        var _props = this.props;
        var zoomImage = _props.zoomImage;
        var previewWidth = _props.previewWidth;
        var previewHeight = _props.previewHeight;
        var _state = this.state;
        var x = _state.x;
        var y = _state.y;
        var zoomImageDimensions = _state.zoomImageDimensions;
        var isActive = _state.isActive;
        var isImageLoaded = _state.isImageLoaded;

        if (!isActive || !isImageLoaded) {
            this.removeMagnifier();
            return;
        }

        var zoomImageExtended = (0, _assign2.default)({}, zoomImage, zoomImageDimensions);

        var imagesDiffX = smallImage.width / zoomImageExtended.width; // Diff between big and small images preview windows
        var imagesDiffY = smallImage.height / zoomImageExtended.height;

        var rectangleWidth = previewWidth * imagesDiffX;
        var rectangleHeight = previewHeight * imagesDiffY;

        var previewDiffY = previewHeight / rectangleHeight;
        var previewDiffX = previewWidth / rectangleWidth;

        // TODO cursor offset support

        // previews rectangles

        var _calculatePositionSty = (0, _calculatePositionStyles2.default)({ x: x, y: y, smallImage: smallImage, rectangleHeight: rectangleHeight, rectangleWidth: rectangleWidth, previewDiffX: previewDiffX, previewDiffY: previewDiffY });

        var rectanglePosition = _calculatePositionSty.rectanglePosition;
        var previewPosition = _calculatePositionSty.previewPosition;

        _reactDom2.default.render(_react2.default.createElement(_lens2.default, {
            width: rectangleWidth,
            height: rectangleHeight,
            position: rectanglePosition
        }), this.refs.lens);

        _reactDom2.default.render(_react2.default.createElement(_preview2.default, {
            smallImage: smallImage,
            zoomImage: zoomImage,
            width: previewWidth,
            height: previewHeight,
            position: previewPosition
        }), this.refs.preview);
    },
    render: function render() {
        var _props2 = this.props;
        var smallImage = _props2.smallImage;
        var children = _props2.children;
        var loadingClassName = _props2.loadingClassName;
        var _state2 = this.state;
        var isImageLoaded = _state2.isImageLoaded;
        var isActive = _state2.isActive;

        var className = isImageLoaded ? '' : loadingClassName || '';
        var style = { position: 'relative' };

        if (isImageLoaded) {
            style.cursor = isActive ? 'zoom-out' : 'zoom-in';
        }

        var content = undefined;

        if (smallImage) {
            content = _react2.default.createElement('img', { src: smallImage.src, alt: smallImage.alt });
        } else {
            content = children;
        }

        return _react2.default.createElement(
            'div',
            { onTouchStart: this.onTouchStart },
            _react2.default.createElement(
                'div',
                { className: className, style: style, ref: 'stage' },
                content,
                _react2.default.createElement('div', { ref: 'lens' })
            ),
            _react2.default.createElement('div', { ref: 'preview' })
        );
    }
});