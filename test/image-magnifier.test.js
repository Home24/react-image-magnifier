import { mount } from 'enzyme';
import React from 'react';
import expect from 'expect';
import assign from 'lodash/assign';
import ImageMagnifier from '../src/image-magnifier';


describe('Image magnifier', () => {

    const commonProps = {
        zoomImage: {
            src: 'https://placehold.it/500x500'
        }
    };

    it('renders image with provided src and alt', () => {
        const props = assign({}, commonProps, {
            smallImage: {
                src: 'https://placehold.it/200x200',
                alt: 'alternative description'
            }
        });

        const wrapper = mount(<ImageMagnifier {...props} />);
        const image = wrapper.find('img');

        expect(image.exists()).toBeTruthy();
        expect(image.prop('src')).toBe(props.smallImage.src);
        expect(image.prop('alt')).toBe(props.smallImage.alt);
    });

    it('renders children if provided', () => {
        const wrapper = mount(<ImageMagnifier {...commonProps}>
            <p className="test-child"></p>
        </ImageMagnifier>);
        
        expect(wrapper.contains(<p className="test-child"></p>)).toBe(true);
        expect(wrapper.find('img').length).toBe(0);
    });
});
