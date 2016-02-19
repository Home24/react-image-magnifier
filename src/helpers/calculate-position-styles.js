export default function ({ x, y, smallImage, rectangleHeight, rectangleWidth, previewDiffX, previewDiffY }) {
    const { left, top, right, bottom, height, width } = smallImage;
    const rectangleHalfWidth = Math.floor(rectangleWidth / 2);
    const rectangleHalfHeight = Math.floor(rectangleHeight / 2);

    const rectanglePosition = {};
    const previewPosition = {};

    // vertical position
    if (y + rectangleHalfHeight >= bottom) {
        rectanglePosition.top = height - rectangleHeight;
        previewPosition.bgVertical = 'bottom';

    } else if (y - rectangleHalfHeight <= top) {
        rectanglePosition.top = 0;
        previewPosition.bgVertical = 'top';

    } else {
        rectanglePosition.top = y - top;
        rectanglePosition.marginTop = -rectangleHalfHeight;
        previewPosition.bgVertical = -(y - top - rectangleHalfHeight) * previewDiffY + 'px';
    }

    // horizontal position
    if (x + rectangleHalfWidth >= right) {
        rectanglePosition.left = width - rectangleWidth;
        previewPosition.bgHorizontal = 'right';

    } else if (x - rectangleHalfWidth <= left) {
        rectanglePosition.left = 0;
        previewPosition.bgHorizontal = 'left';

    } else {
        rectanglePosition.left = x - left;
        rectanglePosition.marginLeft = -rectangleHalfWidth;
        previewPosition.bgHorizontal = -(x - left - rectangleHalfWidth) * previewDiffX + 'px';

    }

    return { rectanglePosition, previewPosition };
}
