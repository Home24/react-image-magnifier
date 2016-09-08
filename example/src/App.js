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
            delay: 0,
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

    changeDelay(e) {
        this.setState({
            delay: parseInt(e.currentTarget.value, 10)
        })
    },

    reset() {
        this.setState(this.getInitialState());
    },

    render() {
        const { show, images, delay } = this.state;

        const component1 = show ? (
            <ImageMagnifier
                smallImage={{ src: images.small, alt: 'alt' }}
                zoomImage={{ src: images.big }}
                previewWidth={300}
                previewHeight={200}
                delay={delay}
                loadingClassName="loading"
            />
        ) : null;

        const component2 = show ? (
            <ImageMagnifier
                zoomImage={{ src: images.big }}
                previewWidth={300}
                previewHeight={200}
                delay={delay}
                loadingClassName="loading"
            >
                <img src={images.small} alt="alt"/>
            </ImageMagnifier>
        ) : null;

        return (
            <div>
                <nav>
                    <button onClick={this.toggleVisibility}>Toggle visibility</button>
                    <button onClick={this.changeImage}>Change Image</button>
                    <span className="delay">
                        Change delay
                        <input
                            type="range"
                            onChange={this.changeDelay}
                            value={delay}
                            min={0}
                            max={2000}
                            step={100}
                        />
                        ({delay})
                    </span>
                    <button onClick={this.reset}>Reset</button>
                </nav>
                <h4>Component without children</h4>
                {component1}
                <h4>Component with children</h4>
                {component2}
            </div>
        );
    }
});

ReactDOM.render(<App />, document.getElementById('mount'));

