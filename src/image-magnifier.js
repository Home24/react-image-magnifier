import React from 'react';
import ReactDOM from 'react-dom';
import assign from 'lodash/assign';
import omit from 'lodash/omit';
import Magnifier from './magnifier';

function getOffset(el) {
    var element = el;
    var x = 0;
    var y = 0;

    while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
        x += element.offsetLeft - element.scrollLeft;
        y += element.offsetTop - element.scrollTop;
        element = element.offsetParent;
    }

    return { x, y };
}

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
            offsetX: -1,
            offsetY: -1,
            zoomImage: {
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

        this.loadImage(() => {
            document.addEventListener('mousemove', this.onMouseMove);
        });
    },

    componentDidUpdate() {
        const { left, top, right, bottom, width, height } = ReactDOM.findDOMNode(this).getBoundingClientRect();
        const { zoomImage, previewWidth, cursorOffset } = this.props;

        const smallImage = { left, top, right, bottom, width, height };
        const zoomImageExtended = assign({}, zoomImage, this.state.zoomImage);

        ReactDOM.render(
            <Magnifier
                previewWidth={previewWidth}
                smallImage={smallImage}
                zoomImage={zoomImageExtended}
                cursorOffset={cursorOffset}
                {...omit(this.state, 'zoomImage')}
            />,
            this.portalElement);
    },

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.body.removeChild(this.portalElement);
        this.portalElement = null;
    },

    onMouseMove(e) {
        const offset = getOffset(ReactDOM.findDOMNode(this));
        this.setState({
            x: e.x + window.scrollX,
            y: e.y + window.scrollY,
            offsetX: e.x - offset.x,
            offsetY: e.y - offset.y
        });
    },

    loadImage(callback) {
        const zoomImage = assign(this.props.zoomImage);
        const img = new Image();

        img.onload = (event) => {
            const { width, height } = event.currentTarget;

            this.setState({ zoomImage: { width, height } });
            callback();
        };

        img.src = zoomImage.src;
    },

    portalElement: null,

    removeMagnifier() {
        this.portalElement.innerHTML = '';
    },

    render() {
        const { smallImage } = this.props;

        return <img src={smallImage.src} alt={smallImage.alt} />
    }
});
