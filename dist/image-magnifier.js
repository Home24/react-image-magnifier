"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _assign = _interopRequireDefault(require("lodash/assign"));

var _debounce = _interopRequireDefault(require("lodash/debounce"));

var _lens = _interopRequireDefault(require("./lens"));

var _preview = _interopRequireDefault(require("./preview"));

var _calculatePositionStyles = _interopRequireDefault(require("./helpers/calculate-position-styles"));

var _isTouchDevice = _interopRequireDefault(require("./helpers/is-touch-device"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default =
/*#__PURE__*/
function (_React$Component) {
  _inherits(_default, _React$Component);

  function _default() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, _default);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(_default)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "state", {
      x: 0,
      y: 0,
      zoomImageDimensions: {
        width: 0,
        height: 0
      },
      isImageLoaded: false,
      isActive: false,
      isScrolling: false
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onEnter", function () {
      document.addEventListener('mousemove', _this.onMouseMove);
      window.addEventListener('scroll', _this.onScrollFinish);
      window.addEventListener('scroll', _this.onScrollStart);

      var handler = function handler() {
        _this.setState({
          isActive: true
        });
      };

      if (_this.props.delay) {
        _this.waitTimeoutId = setTimeout(handler, _this.props.delay);
      } else {
        handler();
      }
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onLeave", function () {
      clearTimeout(_this.waitTimeoutId);

      _this.removeMagnifier();

      document.removeEventListener('mousemove', _this.onMouseMove);
      window.removeEventListener('scroll', _this.onScrollFinish);
      window.removeEventListener('scroll', _this.onScrollStart);

      _this.setState({
        isActive: false
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onMouseMove", function (e) {
      _this.setState({
        x: e.clientX,
        y: e.clientY
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onScrollFinish", function () {
      _this.setState({
        isScrolling: false
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onScrollStart", function () {
      _this.setState({
        isScrolling: true
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "bindEvents", function () {
      var el = _this.refs.stage;
      el.addEventListener('mouseenter', _this.onEnter);
      el.addEventListener('mouseleave', _this.onLeave);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "unbindEvents", function () {
      var el = _this.refs.stage;
      el.removeEventListener('mouseenter', _this.onEnter);
      el.removeEventListener('mouseleave', _this.onLeave);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "loadImage", function (src) {
      var img = new Image();

      img.onload = function (event) {
        if (!_this._isMounted) {
          return;
        }

        var _event$currentTarget = event.currentTarget,
            width = _event$currentTarget.width,
            height = _event$currentTarget.height;

        _this.handleImageLoad(width, height);
      };

      img.src = src;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_isMounted", false);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "previewPlaceholder", null);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "handleImageLoad", function (width, height) {
      _this.setState({
        zoomImageDimensions: {
          width: width,
          height: height
        },
        isImageLoaded: true
      });
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "removeMagnifier", function () {
      _reactDom.default.unmountComponentAtNode(_this.refs.lens);

      _reactDom.default.unmountComponentAtNode(_this.previewPlaceholder);
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "appendPreviewPlaceholder", function () {
      _this.previewPlaceholder = document.body.appendChild(document.createElement('div'));
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "removePreviewPlaceholder", function () {
      if (!_this.previewPlaceholder) {
        return;
      }

      document.body.removeChild(_this.previewPlaceholder);
      _this.previewPlaceholder = null;
    });

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "renderMagnifier", function () {
      var smallImage = _reactDom.default.findDOMNode(_assertThisInitialized(_assertThisInitialized(_this))).getBoundingClientRect();

      var _this$props = _this.props,
          zoomImage = _this$props.zoomImage,
          previewWidth = _this$props.previewWidth,
          previewHeight = _this$props.previewHeight;
      var _this$state = _this.state,
          x = _this$state.x,
          y = _this$state.y,
          zoomImageDimensions = _this$state.zoomImageDimensions,
          isActive = _this$state.isActive,
          isImageLoaded = _this$state.isImageLoaded,
          isScrolling = _this$state.isScrolling;

      if (!isActive || !isImageLoaded || isScrolling) {
        _this.removeMagnifier();

        return;
      }

      var zoomImageExtended = (0, _assign.default)({}, zoomImage, zoomImageDimensions);
      var imagesDiffX = smallImage.width / zoomImageExtended.width; // Diff between big and small images preview windows

      var imagesDiffY = smallImage.height / zoomImageExtended.height;
      var rectangleWidth = previewWidth * imagesDiffX;
      var rectangleHeight = previewHeight * imagesDiffY;
      var previewDiffY = previewHeight / rectangleHeight;
      var previewDiffX = previewWidth / rectangleWidth; // TODO cursor offset support
      // previews rectangles

      var _calculatePositionSty = (0, _calculatePositionStyles.default)({
        x: x,
        y: y,
        smallImage: smallImage,
        rectangleHeight: rectangleHeight,
        rectangleWidth: rectangleWidth,
        previewDiffX: previewDiffX,
        previewDiffY: previewDiffY
      }),
          rectanglePosition = _calculatePositionSty.rectanglePosition,
          previewPosition = _calculatePositionSty.previewPosition;

      _reactDom.default.render(_react.default.createElement(_lens.default, {
        width: rectangleWidth,
        height: rectangleHeight,
        position: rectanglePosition
      }), _this.refs.lens);

      _reactDom.default.render(_react.default.createElement(_preview.default, {
        smallImage: smallImage,
        zoomImage: zoomImage,
        width: previewWidth,
        height: previewHeight,
        position: previewPosition
      }), _this.previewPlaceholder);
    });

    return _this;
  }

  _createClass(_default, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._isMounted = true;

      if ((0, _isTouchDevice.default)()) {
        return;
      }

      this.onScrollFinish = (0, _debounce.default)(this.onScrollFinish, 200); // will be called in the end of scrolling

      this.onScrollStart = (0, _debounce.default)(this.onScrollStart, 200, {
        leading: true,
        trailing: false
      }); // will be called on start of scrolling

      this.appendPreviewPlaceholder();
      this.loadImage(this.props.zoomImage.src);
      this.bindEvents();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if ((0, _isTouchDevice.default)()) {
        return;
      }

      if (this.props.zoomImage !== nextProps.zoomImage) {
        this.setState({
          isImageLoaded: false,
          isActive: false
        });
        this.loadImage(nextProps.zoomImage.src);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if ((0, _isTouchDevice.default)()) {
        return;
      }

      this.renderMagnifier();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._isMounted = false;

      if ((0, _isTouchDevice.default)()) {
        return;
      }

      this.onLeave();
      this.unbindEvents();
      this.removePreviewPlaceholder();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          smallImage = _this$props2.smallImage,
          children = _this$props2.children;
      var style = {
        position: 'relative'
      };
      var content;

      if (smallImage) {
        content = _react.default.createElement("img", {
          src: smallImage.src,
          alt: smallImage.alt
        });
      } else {
        content = children;
      }

      return _react.default.createElement("div", null, _react.default.createElement("div", {
        style: style,
        ref: "stage"
      }, content, _react.default.createElement("div", {
        ref: "lens"
      })));
    }
  }]);

  return _default;
}(_react.default.Component);

exports.default = _default;

_defineProperty(_default, "propTypes", {
  previewWidth: _propTypes.default.number,
  previewHeight: _propTypes.default.number,
  delay: _propTypes.default.number,
  children: _propTypes.default.element,
  smallImage: _propTypes.default.shape({
    src: _propTypes.default.string.isRequired,
    alt: _propTypes.default.string.isRequired
  }),
  zoomImage: _propTypes.default.shape({
    offset: _propTypes.default.shape({
      x: _propTypes.default.number,
      y: _propTypes.default.number
    }),
    src: _propTypes.default.string.isRequired
  }).isRequired
});

_defineProperty(_default, "defaultProps", {
  previewWidth: 200,
  previewHeight: 200
});