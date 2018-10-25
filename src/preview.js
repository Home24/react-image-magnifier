import PropTypes from 'prop-types';
import React from 'react';

export default class extends React.Component {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,

        // the position of the preview
        position: PropTypes.shape({
            bgVertical: PropTypes.string.isRequired,
            bgHorizontal: PropTypes.string.isRequired
        }).isRequired,

        // the size of the non-zoomed-in image
        smallImage: PropTypes.shape({
            bottom: PropTypes.number.isRequired,
            left: PropTypes.number.isRequired,
            top: PropTypes.number.isRequired,
            right: PropTypes.number.isRequired
        }).isRequired,

        // the size of the zoomed-in image
        zoomImage: PropTypes.shape({
            src: PropTypes.string.isRequired,
            offset: PropTypes.shape({
                x: PropTypes.number,
                y: PropTypes.number
            })
        }).isRequired
    };

    render() {
        const { width, height, position, smallImage, zoomImage } = this.props;

        const previewStyles = {
            position: 'fixed',
            transform: 'translateZ(0)',
            zIndex: '9999',
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
}