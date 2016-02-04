import React from 'react';
import ReactDOM from 'react-dom';
import assign from 'lodash/assign';
import omit from 'lodash/omit';
import Magnifier from './magnifier';

export default React.createClass({

    propTypes: {

        children: React.PropTypes.element,

        previewWidth: React.PropTypes.number,

        // the offset of the zoom bubble from the cursor
        cursorOffset: React.PropTypes.shape({
            x: React.PropTypes.number.isRequired,
            y: React.PropTypes.number.isRequired
        }),

        smallImage: React.PropTypes.shape({
            src: React.PropTypes.string.isRequired,
            alt: React.PropTypes.string.isRequired
        }).isRequired,

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
            cursorOffset: { x: 0, y: 0 }
        };
    },

    getInitialState() {
        return {
            x: 0,
            y: 0,
            zoomImageDimensions: {
                width: 0,
                height: 0
            }
        };
    },

    componentDidMount() {
        if (!this.portalElement) {
            this.portalElement = document.createElement('div');
            document.body.appendChild(this.portalElement);
        }

        this._isMounted = true;

        this.loadImage(() => {
            document.addEventListener('mousemove', this.onMouseMove);
        });
    },

    componentDidUpdate() {
        const { left, top, right, bottom, width, height } = ReactDOM.findDOMNode(this).getBoundingClientRect();
        const { zoomImage, previewWidth, cursorOffset } = this.props;
        const { x, y, zoomImageDimensions } = this.state;

        const smallImage = { left, top, right, bottom, width, height };
        const zoomImageExtended = assign({}, zoomImage, zoomImageDimensions);

        ReactDOM.render(
            <Magnifier
                previewWidth={previewWidth}
                smallImage={smallImage}
                zoomImage={zoomImageExtended}
                cursorOffset={cursorOffset}
                x={x}
                y={y}
            />,
            this.portalElement);
    },

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.body.removeChild(this.portalElement);
        this.portalElement = null;
        this._isMounted = false;
    },

    onMouseMove(e) {
        // const offset = getOffset(ReactDOM.findDOMNode(this));
        this.setState({
            x: e.x + window.scrollX,
            y: e.y + window.scrollY
        });
    },

    loadImage(callback) {
        const zoomImage = assign(this.props.zoomImage);
        const img = new Image();

        img.onload = (event) => {

            if (!this._isMounted) {
                return;
            }

            const { width, height } = event.currentTarget;
            this.setState({ zoomImageDimensions: { width, height } });
            callback();
        };

        img.src = zoomImage.src;
    },

    _isMounted: false,

    portalElement: null,

    removeMagnifier() {
        this.portalElement.innerHTML = '';
    },

    render() {
        const { smallImage } = this.props;

        return <img src={smallImage.src} alt={smallImage.alt} />
    }
});
