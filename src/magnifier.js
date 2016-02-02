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

        // x position relative to the image
        offsetX: React.PropTypes.number.isRequired,

        // y position relative to the image
        offsetY: React.PropTypes.number.isRequired,

        // the offset of the zoom bubble from the cursor
        cursorOffset: React.PropTypes.shape({
            x: React.PropTypes.number.isRequired,
            y: React.PropTypes.number.isRequired
        }).isRequired,

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
            height: React.PropTypes.number.isRequired
        }).isRequired
    },

    render() {
        const { smallImage, zoomImage, offsetX, offsetY, y, x, previewWidth, cursorOffset } = this.props;

        const ySmallRatio = smallImage.height / smallImage.width;
        const yBigRatio = zoomImage.height / zoomImage.width;

        const imagesDiffX = smallImage.width / zoomImage.width; // Diff between big and small images preview windows
        // const imagesDiffY = zoomImage.height / smallImage.height;

        const rectangleSizeX = previewWidth * imagesDiffX;
        const rectangleSizeY = rectangleSizeX * ySmallRatio;
        const rectangleHalfSizeX = Math.floor(rectangleSizeX / 2);
        const rectangleHalfSizeY = Math.floor(rectangleSizeY / 2);

        const previewSizeX = previewWidth;
        const previewSizeY = previewWidth * yBigRatio;

        const previewDiffY = previewSizeY / rectangleSizeY;
        const previewDiffX = previewSizeX / rectangleSizeX;


        const isVisible = offsetY < smallImage.height &&
            offsetX < smallImage.width &&
            offsetY > 0 &&
            offsetX > 0;

        if (!isVisible) {
            return null;
        }

        // TODO cursor offset support

        // previews rectangles
        const { rectanglePosition, previewPosition } = (() => {
            const { left, top, right, bottom } = smallImage;
            const rectanglePosition = {};
            const previewPosition = {};

            // vertical position
            if (y + rectangleHalfSizeY >= bottom) {
                rectanglePosition.top = bottom - rectangleSizeY;
                previewPosition.vertical = 'bottom';

            } else if (y - rectangleHalfSizeY <= top) {
                rectanglePosition.top = top;
                previewPosition.vertical = 'top';

            } else {
                rectanglePosition.top = y;
                rectanglePosition.marginTop = -rectangleHalfSizeY + cursorOffset.y;
                previewPosition.vertical = -(offsetY - rectangleHalfSizeY) * previewDiffY + 'px';
            }

            // horizontal position
            if (x + rectangleHalfSizeX >= right) {
                rectanglePosition.left = right - rectangleSizeX;
                previewPosition.horizontal = 'right';

            } else if (x - rectangleHalfSizeX <= left) {
                rectanglePosition.left = left;
                previewPosition.horizontal = 'left';

            } else {
                rectanglePosition.left = x;
                rectanglePosition.marginLeft = -rectangleHalfSizeX + cursorOffset.x;
                previewPosition.horizontal = -(offsetX - rectangleHalfSizeX) * previewDiffX + 'px';

            }

            return { rectanglePosition, previewPosition };

        })();


        const rectangleStyles = {
            position: 'absolute',
            width: rectangleSizeX,
            height: rectangleSizeY,
            border: '2px solid grey',
            boxShadow: `1px 1px 6px rgba(0,0,0,0.3)`
        };

        const previewStyles = {
            position: 'absolute',
            left: smallImage.right,
            top: smallImage.top,
            width: previewSizeX,
            height: previewSizeY,
            backgroundImage: `url(${zoomImage.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `${previewPosition.horizontal} ${previewPosition.vertical}`
        };

        return (
            <div>
                <div style={assign(rectangleStyles, rectanglePosition)} />
                <div style={previewStyles}/>
            </div>
        );
    }
});
