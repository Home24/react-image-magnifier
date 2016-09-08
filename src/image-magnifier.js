import React from 'react';
import ReactDOM from 'react-dom';
import assign from 'lodash/assign';
import debounce from 'lodash/debounce';
import Lens from './lens';
import Preview from './preview';
import calculatePositionStyles from './helpers/calculate-position-styles';
import isTouchDevice from './helpers/is-touch-device';

export default React.createClass({

    propTypes: {
        previewWidth: React.PropTypes.number,
        previewHeight: React.PropTypes.number,

        delay: React.PropTypes.number,
        children: React.PropTypes.element,

        smallImage: React.PropTypes.shape({
            src: React.PropTypes.string.isRequired,
            alt: React.PropTypes.string.isRequired
        }),
        zoomImage: React.PropTypes.shape({
            offset: React.PropTypes.shape({
                x: React.PropTypes.number,
                y: React.PropTypes.number
            }),
            src: React.PropTypes.string.isRequired
        }).isRequired
    },

    getDefaultProps() {
        return {
            previewWidth: 200,
            previewHeight: 200
        };
    },

    getInitialState() {
        return {
            x: 0,
            y: 0,
            zoomImageDimensions: { width: 0, height: 0 },
            isImageLoaded: false,
            isActive: false,
            isScrolling: false
        };
    },

    componentDidMount() {
        this._isMounted = true;

        if (isTouchDevice()) {
            return;
        }

        this.onScrollFinish = debounce(this.onScrollFinish, 200); // will be called in the end of scrolling
        this.onScrollStart = debounce(this.onScrollStart, 200, { leading: true, trailing: false }); // will be called on start of scrolling

        this.appendPreviewPlaceholder();
        this.loadImage(this.props.zoomImage.src);
        this.bindEvents();
    },

    componentWillReceiveProps(nextProps) {
        if (isTouchDevice()) {
            return;
        }

        if (this.props.zoomImage !== nextProps.zoomImage) {
            this.setState({ isImageLoaded: false, isActive: false });
            this.loadImage(nextProps.zoomImage.src);
        }
    },

    componentDidUpdate() {
        if (isTouchDevice()) {
            return;
        }

        this.renderMagnifier();
    },

    componentWillUnmount() {
        this._isMounted = false;

        if (isTouchDevice()) {
            return;
        }

        this.onLeave();
        this.unbindEvents();
        this.removePreviewPlaceholder();
    },

    onEnter() {
        document.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('scroll', this.onScrollFinish);
        window.addEventListener('scroll', this.onScrollStart);

        const handler = () => {
            this.setState({ isActive: true });
        };

        if (this.props.delay) {
            this.waitTimeoutId = setTimeout(handler, this.props.delay);
        } else {
            handler();
        }
    },

    onLeave() {
        clearTimeout(this.waitTimeoutId);

        this.removeMagnifier();

        document.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('scroll', this.onScrollFinish);
        window.removeEventListener('scroll', this.onScrollStart);

        this.setState({ isActive: false });
    },

    onMouseMove(e) {
        this.setState({ x: e.clientX, y: e.clientY });
    },

    onScrollFinish() {
        this.setState({ isScrolling: false });
    },

    onScrollStart() {
        this.setState({ isScrolling: true });
    },

    bindEvents() {
        const el = this.refs.stage;
        el.addEventListener('mouseenter', this.onEnter);
        el.addEventListener('mouseleave', this.onLeave);
    },
    
    unbindEvents() {
        const el = this.refs.stage;
        el.removeEventListener('mouseenter', this.onEnter);
        el.removeEventListener('mouseleave', this.onLeave);
    },

    loadImage(src) {
        const img = new Image();

        img.onload = (event) => {
            if (!this._isMounted) {
                return;
            }

            const { width, height } = event.currentTarget;
            this.handleImageLoad(width, height);
        };

        img.src = src;
    },

    _isMounted: false,

    previewPlaceholder: null,

    handleImageLoad(width, height) {
        this.setState({
            zoomImageDimensions: { width, height },
            isImageLoaded: true
        });
    },

    removeMagnifier() {
        ReactDOM.unmountComponentAtNode(this.refs.lens);
        ReactDOM.unmountComponentAtNode(this.previewPlaceholder);
    },

    appendPreviewPlaceholder() {
        this.previewPlaceholder = document.body.appendChild(document.createElement('div'));
    },

    removePreviewPlaceholder() {
        if (!this.previewPlaceholder) {
            return;
        }

        document.body.removeChild(this.previewPlaceholder);
        this.previewPlaceholder = null;
    },

    renderMagnifier() {
        const smallImage = ReactDOM.findDOMNode(this).getBoundingClientRect();
        const { zoomImage, previewWidth, previewHeight } = this.props;
        const { x, y, zoomImageDimensions, isActive, isImageLoaded, isScrolling } = this.state;

        if (!isActive || !isImageLoaded || isScrolling) {
            this.removeMagnifier();
            return;
        }

        const zoomImageExtended = assign({}, zoomImage, zoomImageDimensions);

        const imagesDiffX = smallImage.width / zoomImageExtended.width; // Diff between big and small images preview windows
        const imagesDiffY = smallImage.height / zoomImageExtended.height;

        const rectangleWidth = previewWidth * imagesDiffX;
        const rectangleHeight = previewHeight * imagesDiffY;

        const previewDiffY = previewHeight / rectangleHeight;
        const previewDiffX = previewWidth / rectangleWidth;

        // TODO cursor offset support

        // previews rectangles
        const { rectanglePosition, previewPosition }
            = calculatePositionStyles({ x, y, smallImage, rectangleHeight, rectangleWidth, previewDiffX, previewDiffY });

        ReactDOM.render(
            <Lens
                width={rectangleWidth}
                height={rectangleHeight}
                position={rectanglePosition}
            />,
            this.refs.lens
        );

        ReactDOM.render(
            <Preview
                smallImage={smallImage}
                zoomImage={zoomImage}
                width={previewWidth}
                height={previewHeight}
                position={previewPosition}
            />,
            this.previewPlaceholder
        );
    },

    render() {
        const { smallImage, children } = this.props;
        const style = { position: 'relative' };

        let content;

        if (smallImage) {
            content = <img src={smallImage.src} alt={smallImage.alt} />;

        } else {
            content = children;
        }
        
        return (
            <div>
                <div style={style} ref="stage">
                    { content }
                    <div ref="lens"></div>
                </div>
            </div>
        );
    }
});


