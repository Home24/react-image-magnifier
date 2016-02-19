import React from 'react';

export default React.createClass({

    propTypes: {
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,

        // the position of the preview
        position: React.PropTypes.shape({
            bgVertical: React.PropTypes.string.isRequired,
            bgHorizontal: React.PropTypes.string.isRequired
        }).isRequired,

        // the size of the non-zoomed-in image
        smallImage: React.PropTypes.shape({
            bottom: React.PropTypes.number.isRequired,
            left: React.PropTypes.number.isRequired,
            top: React.PropTypes.number.isRequired,
            right: React.PropTypes.number.isRequired
        }).isRequired,

        // the size of the zoomed-in image
        zoomImage: React.PropTypes.shape({
            src: React.PropTypes.string.isRequired,
            offset: React.PropTypes.shape({
                x: React.PropTypes.number,
                y: React.PropTypes.number
            })
        }).isRequired
    },

    render() {
        const { width, height, position, smallImage, zoomImage } = this.props;

        const previewStyles = {
            position: 'fixed',
            transform: 'translateZ(0)',
            left: (zoomImage.offset && zoomImage.offset.x) ? (smallImage.right + zoomImage.offset.x) : smallImage.right,
            top: (zoomImage.offset && zoomImage.offset.y) ? (smallImage.top + zoomImage.offset.y) : smallImage.top,
            width: width,
            height: height,
            backgroundImage: `url(${zoomImage.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `${position.bgHorizontal} ${position.bgVertical}`
        };

        return <div style={previewStyles}/>;
    }
});
