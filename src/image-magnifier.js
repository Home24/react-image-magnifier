import React from 'react';
import ReactDOM from 'react-dom';
import assign from 'lodash/assign';
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
            width: React.PropTypes.number.isRequired,
            height: React.PropTypes.number.isRequired
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
            offsetY: -1
        };
    },

    componentDidMount() {
        document.addEventListener('mousemove', this.onMouseMove);
        if (!this.portalElement) {
            this.portalElement = document.createElement('div');
            document.body.appendChild(this.portalElement);
        }
        this.componentDidUpdate();
    },

    componentDidUpdate() {
        const zoomImage = assign(this.props.zoomImage);

        const img = new Image();
        
        img.onload = (event) => {
            const image = event.currentTarget;
            zoomImage.width = image.width;
            zoomImage.height = image.height;

            this.renderMagnifier(zoomImage);
        };

        img.src = zoomImage.src;
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

    portalElement: null,

    renderMagnifier(zoomImage) {
        const { left, top, right, bottom } = ReactDOM.findDOMNode(this).getBoundingClientRect();
        const smallImage = assign(this.props.smallImage, { left, top, right, bottom });

        ReactDOM.render(
            <Magnifier
                previewWidth={this.props.previewWidth}
                smallImage={smallImage}
                zoomImage={zoomImage}
                cursorOffset={this.props.cursorOffset}
                {...this.state}
            />,
            this.portalElement);
    },

    render() {
        return this.props.children;
    }
});
