export default () => ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch;
