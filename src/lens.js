import React from 'react';
import assign from 'lodash/assign';

export default React.createClass({

    propTypes: {

        // the size of the magnifier window
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,

        // the position of the lens relative to the image
        position: React.PropTypes.shape({
            top: React.PropTypes.number.isRequired,
            left: React.PropTypes.number.isRequired,
            marginLeft: React.PropTypes.number,
            marginTop: React.PropTypes.number
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
