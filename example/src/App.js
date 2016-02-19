// polyfills
require('es5-shim');
require('es5-shim/es5-sham');

import React from 'react';
import ReactDOM from 'react-dom';
import assign from 'lodash/assign';
import ImageMagnifier from '../../src/image-magnifier';

var App = React.createClass({

    getInitialState() {
        return {
            show: true,
            images: {
                small: 'img/bed-small.jpg',
                big: 'img/bed-large.jpg'
            }
        };
    },

    toggleVisibility() {
        this.setState({ show: !this.state.show });
    },

    changeImage() {
        this.setState({
            images: {
                small: 'img/cat-small.jpg',
                big: 'img/cat-large.jpg'
            }
        });
    },

    reset() {
        this.setState(this.getInitialState());
    },

    render() {
        const { show, images } = this.state;

        const component = show ? (
            <ImageMagnifier
                smallImage={{ src: images.small, alt: 'alt' }}
                zoomImage={{ src: images.big }}
                previewWidth={300}
                previewHeight={200}
                loadingClassName="loading"
            />
        ) : null;

        return (
            <div>
                {component}
                <button onClick={this.toggleVisibility}>Toggle visibility</button>
                <button onClick={this.changeImage}>Change Image</button>
                <button onClick={this.reset}>Reset</button>
            </div>
        );
    }
});

ReactDOM.render(<App />, document.getElementById('mount'));

//<ImageMagnifier
//    image={{
//        src: "img/cat-small.jpg",
//        width: 400,
//        height: 300
//    }}
//    zoomImage={{
//        src: "img/cat-large.jpg",
//        width: 1024,
//        height: 768
//    }}
///>
//<ImageMagnifier
//    image={{
//        src: "img/beach-small.jpg",
//        width: 400,
//        height: 300
//    }}
//    zoomImage={{
//        src: "img/beach-large.jpg",
//        width: 1600,
//        height: 1200
//    }}
//    cursorOffset={{ x: 80, y: -80 }}
///>
//<ImageMagnifier
//    image={{
//        src: "img/fall-small.jpg",
//        width: 400,
//        height: 250
//    }}
//    zoomImage={{
//        src: "img/fall-large.jpg",
//        width: 1920,
//        height: 1200
//    }}
///>
