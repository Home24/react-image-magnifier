import React from 'react';
import ReactDOM from 'react-dom';
import assign from 'lodash/assign';
import Lens from './lens';
import Preview from './preview';
import calculatePositionStyles from './helpers/calculate-position-styles';

export default React.createClass({

    propTypes: {
        previewWidth: React.PropTypes.number,
        previewHeight: React.PropTypes.number,

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
        }).isRequired,

        loadingClassName: React.PropTypes.string
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
            isActive: false
        };
    },

    componentDidMount() {
        this._isMounted = true;
        this.loadImage(this.props.zoomImage.src);
        this.bindEvents();
    },

    componentWillReceiveProps(nextProps) {
        if (this.props.zoomImage !== nextProps.zoomImage) {
            this.setState({ isImageLoaded: false, isActive: false });
            this.loadImage(nextProps.zoomImage.src);
        }
    },

    componentDidUpdate() {
        this.renderMagnifier();
    },

    componentWillUnmount() {
        this.onLeave();
        this.unbindEvents();
        this._isMounted = false;
    },

    onEnter() {
        document.addEventListener('mousemove', this.onMouseMove);
    },

    onClick() {
        this.setState({ isActive: !this.state.isActive });
    },

    onTouchStart(event) {
        // prevent touch actions
        event.preventDefault();
    },

    onLeave() {
        this.removeMagnifier();
        document.removeEventListener('mousemove', this.onMouseMove);
    },

    onMouseMove(e) {
        this.setState({ x: e.x, y: e.y });
    },

    bindEvents() {
        const el = this.refs.stage;
        el.addEventListener('mouseenter', this.onEnter);
        el.addEventListener('mouseleave', this.onLeave);
        el.addEventListener('click', this.onClick);
    },
    
    unbindEvents() {
        const el = this.refs.stage;
        el.removeEventListener('mouseenter', this.onEnter);
        el.removeEventListener('mouseleave', this.onLeave);
        el.removeEventListener('click', this.onClick);
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

    handleImageLoad(width, height) {
        this.setState({
            zoomImageDimensions: { width, height },
            isImageLoaded: true
        });
    },

    removeMagnifier() {
        ReactDOM.unmountComponentAtNode(this.refs.lens);
        ReactDOM.unmountComponentAtNode(this.refs.preview);
    },

    renderMagnifier() {
        const smallImage = ReactDOM.findDOMNode(this).getBoundingClientRect();
        const { zoomImage, previewWidth, previewHeight } = this.props;
        const { x, y, zoomImageDimensions, isActive, isImageLoaded } = this.state;

        if (!isActive || !isImageLoaded) {
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
            this.refs.preview
        );
    },

    render() {
        const { smallImage, children, loadingClassName } = this.props;
        const { isImageLoaded, isActive } = this.state;

        const className = isImageLoaded ? '' : (loadingClassName || '');
        const style = { position: 'relative' };

        if (isImageLoaded) {
            style.cursor = isActive ? 'zoom-out' : 'zoom-in';
        }

        let content;

        if (smallImage) {
            content = <img src={smallImage.src} alt={smallImage.alt} />;

        } else {
            content = children;
        }
        
        return (
            <div onTouchStart={this.onTouchStart}>
                <div className={className} style={style} ref="stage">
                    { content }
                    <div ref="lens"></div>
                </div>
                <div ref="preview"></div>
            </div>
        );
    }
});


