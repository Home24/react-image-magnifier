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

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _lens = require('./lens');

var _lens2 = _interopRequireDefault(_lens);

var _preview = require('./preview');

var _preview2 = _interopRequireDefault(_preview);

var _calculatePositionStyles = require('./helpers/calculate-position-styles');

var _calculatePositionStyles2 = _interopRequireDefault(_calculatePositionStyles);

var _isTouchDevice = require('./helpers/is-touch-device');

var _isTouchDevice2 = _interopRequireDefault(_isTouchDevice);

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
        }).isRequired
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
            isActive: false,
            isScrolling: false
        };
    },
    componentDidMount: function componentDidMount() {
        this._isMounted = true;

        if ((0, _isTouchDevice2.default)()) {
            return;
        }

        this.onScrollFinish = (0, _debounce2.default)(this.onScrollFinish, 200); // will be called in the end of scrolling
        this.onScrollStart = (0, _debounce2.default)(this.onScrollStart, 200, { leading: true, trailing: false }); // will be called on start of scrolling

        this.appendPreviewPlaceholder();
        this.loadImage(this.props.zoomImage.src);
        this.bindEvents();
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if ((0, _isTouchDevice2.default)()) {
            return;
        }

        if (this.props.zoomImage !== nextProps.zoomImage) {
            this.setState({ isImageLoaded: false, isActive: false });
            this.loadImage(nextProps.zoomImage.src);
        }
    },
    componentDidUpdate: function componentDidUpdate() {
        if ((0, _isTouchDevice2.default)()) {
            return;
        }

        this.renderMagnifier();
    },
    componentWillUnmount: function componentWillUnmount() {
        this._isMounted = false;

        if ((0, _isTouchDevice2.default)()) {
            return;
        }

        this.onLeave();
        this.unbindEvents();
        this.removePreviewPlaceholder();
    },
    onEnter: function onEnter() {
        document.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('scroll', this.onScrollFinish);
        window.addEventListener('scroll', this.onScrollStart);

        this.setState({ isActive: true });
    },
    onLeave: function onLeave() {
        this.removeMagnifier();
        document.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('scroll', this.onScrollFinish);
        window.removeEventListener('scroll', this.onScrollStart);

        this.setState({ isActive: false });
    },
    onMouseMove: function onMouseMove(e) {
        this.setState({ x: e.clientX, y: e.clientY });
    },
    onScrollFinish: function onScrollFinish() {
        this.setState({ isScrolling: false });
    },
    onScrollStart: function onScrollStart() {
        this.setState({ isScrolling: true });
    },
    bindEvents: function bindEvents() {
        var el = this.refs.stage;
        el.addEventListener('mouseenter', this.onEnter);
        el.addEventListener('mouseleave', this.onLeave);
    },
    unbindEvents: function unbindEvents() {
        var el = this.refs.stage;
        el.removeEventListener('mouseenter', this.onEnter);
        el.removeEventListener('mouseleave', this.onLeave);
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

    previewPlaceholder: null,

    handleImageLoad: function handleImageLoad(width, height) {
        this.setState({
            zoomImageDimensions: { width: width, height: height },
            isImageLoaded: true
        });
    },
    removeMagnifier: function removeMagnifier() {
        _reactDom2.default.unmountComponentAtNode(this.refs.lens);
        _reactDom2.default.unmountComponentAtNode(this.previewPlaceholder);
    },
    appendPreviewPlaceholder: function appendPreviewPlaceholder() {
        this.previewPlaceholder = document.body.appendChild(document.createElement('div'));
    },
    removePreviewPlaceholder: function removePreviewPlaceholder() {
        if (!this.previewPlaceholder) {
            return;
        }

        document.body.removeChild(this.previewPlaceholder);
        this.previewPlaceholder = null;
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
        var isScrolling = _state.isScrolling;

        if (!isActive || !isImageLoaded || isScrolling) {
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
        }), this.previewPlaceholder);
    },
    render: function render() {
        var _props2 = this.props;
        var smallImage = _props2.smallImage;
        var children = _props2.children;

        var style = { position: 'relative' };

        var content = undefined;

        if (smallImage) {
            content = _react2.default.createElement('img', { src: smallImage.src, alt: smallImage.alt });
        } else {
            content = children;
        }

        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                'div',
                { style: style, ref: 'stage' },
                content,
                _react2.default.createElement('div', { ref: 'lens' })
            )
        );
    }
});