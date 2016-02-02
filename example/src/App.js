// polyfills
require('es5-shim');
require('es5-shim/es5-sham');

import React from 'react';
import ReactDOM from 'react-dom';
import ImageMagnifier from '../../src/image-magnifier';

var App = React.createClass({

    render() {
        return (
            <div>
                <ImageMagnifier
                    smallImage={{
                        width: 400,
                        height: 300
                    }}
                    zoomImage={{
                        src: 'img/beach-large.jpg',
                        width: 1600,
                        height: 1200
                    }}
                    previewWidth={800}
                >
                    <img src="img/beach-small.jpg" alt=""/>
                </ImageMagnifier>
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
