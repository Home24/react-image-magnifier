import React from 'react';
import assign from 'lodash/assign';

export default React.createClass({

    propTypes: {

        // the size of the magnifier window
        previewWidth: React.PropTypes.number.isRequired,

        // x position on screen
        x: React.PropTypes.number.isRequired,

        // y position on screen
        y: React.PropTypes.number.isRequired,

        // the size of the non-zoomed-in image
        smallImage: React.PropTypes.shape({
            bottom: React.PropTypes.number.isRequired,
            left: React.PropTypes.number.isRequired,
            top: React.PropTypes.number.isRequired,
            right: React.PropTypes.number.isRequired,
            width: React.PropTypes.number.isRequired,
            height: React.PropTypes.number.isRequired
        }).isRequired,

        // the size of the zoomed-in image
        zoomImage: React.PropTypes.shape({
            src: React.PropTypes.string.isRequired,
            width: React.PropTypes.number.isRequired,
            height: React.PropTypes.number.isRequired,
            offset: React.PropTypes.shape({
                x: React.PropTypes.number,
                y: React.PropTypes.number
            })
        }).isRequired
    },

    render() {
        const { smallImage, zoomImage, y, x, previewWidth } = this.props;

        const isVisible = y > smallImage.top &&
            x > smallImage.left &&
            y < smallImage.bottom &&
            x < smallImage.right;


        if (!isVisible) {
            return null;
        }

        const ySmallRatio = smallImage.height / smallImage.width;
        const yBigRatio = zoomImage.height / zoomImage.width;

        const imagesDiffX = smallImage.width / zoomImage.width; // Diff between big and small images preview windows
        // const imagesDiffY = zoomImage.height / smallImage.height;

        const rectangleSizeX = previewWidth * imagesDiffX;
        const rectangleSizeY = rectangleSizeX * ySmallRatio;

        const previewSizeX = previewWidth;
        const previewSizeY = previewWidth * yBigRatio;

        const previewDiffY = previewSizeY / rectangleSizeY;
        const previewDiffX = previewSizeX / rectangleSizeX;

        // TODO cursor offset support

        // previews rectangles
        const { rectanglePosition, previewPosition } =
            calculateStyles(x, y, smallImage, rectangleSizeX, rectangleSizeY, previewDiffX, previewDiffY);

        const rectangleStyles = {
            position: 'absolute',
            width: rectangleSizeX,
            height: rectangleSizeY,
            border: '2px solid grey',
            boxShadow: `1px 1px 6px rgba(0,0,0,0.3)`
        };

        const previewStyles = {
            position: 'absolute',
            left: (zoomImage.offset && zoomImage.offset.x) ? (smallImage.right + zoomImage.offset.x) : smallImage.right,
            top: (zoomImage.offset && zoomImage.offset.y) ? (smallImage.top + zoomImage.offset.y) : smallImage.top,
            width: previewSizeX,
            height: previewSizeY,
            backgroundImage: `url(${zoomImage.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `${previewPosition.bgHorizontal} ${previewPosition.bgVertical}`
        };

        return (
            <div>
                <div style={assign(rectangleStyles, rectanglePosition)} />
                <div style={previewStyles}/>
            </div>
        );
    }
});


function calculateStyles(x, y, smallImage, rectangleSizeX, rectangleSizeY, previewDiffX, previewDiffY) {
    const { left, top, right, bottom } = smallImage;
    const rectangleHalfSizeX = Math.floor(rectangleSizeX / 2);
    const rectangleHalfSizeY = Math.floor(rectangleSizeY / 2);

    const rectanglePosition = {};
    const previewPosition = {};

    // vertical position
    if (y + rectangleHalfSizeY >= bottom) {
        rectanglePosition.top = bottom - rectangleSizeY;
        previewPosition.bgVertical = 'bottom';

    } else if (y - rectangleHalfSizeY <= top) {
        rectanglePosition.top = top;
        previewPosition.bgVertical = 'top';

    } else {
        rectanglePosition.top = y;
        rectanglePosition.marginTop = -rectangleHalfSizeY;
        previewPosition.bgVertical = -(y - top - rectangleHalfSizeY) * previewDiffY + 'px';
    }

    // horizontal position
    if (x + rectangleHalfSizeX >= right) {
        rectanglePosition.left = right - rectangleSizeX;
        previewPosition.bgHorizontal = 'right';

    } else if (x - rectangleHalfSizeX <= left) {
        rectanglePosition.left = left;
        previewPosition.bgHorizontal = 'left';

    } else {
        rectanglePosition.left = x;
        rectanglePosition.marginLeft = -rectangleHalfSizeX;
        previewPosition.bgHorizontal = -(x - left - rectangleHalfSizeX) * previewDiffX + 'px';

    }

    return { rectanglePosition, previewPosition };
}
