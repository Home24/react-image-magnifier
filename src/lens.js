import PropTypes from 'prop-types';
import React from 'react';
import assign from 'lodash/assign';

export default React.createClass({

    propTypes: {

        // the size of the magnifier window
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,

        // the position of the lens relative to the image
        position: PropTypes.shape({
            top: PropTypes.number.isRequired,
            left: PropTypes.number.isRequired,
            marginLeft: PropTypes.number,
            marginTop: PropTypes.number
        }).isRequired
    },

    render() {
        const { width, height, position } = this.props;

        const styles = {
            position: 'absolute',
            border: '2px solid grey',
            transform: 'translateZ(0)',
            width,
            height
        };

        return <div style={assign(styles, position)} />;
    }
});
