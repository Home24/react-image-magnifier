var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    mode: 'production',
    entry: {
        'image-magnifier': path.join(__dirname, 'src/image-magnifier.js')
    },
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: 'dist',
        filename: '[name].min.js',
        globalObject: 'this'
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader?presets[]=@babel/preset-react,presets[]=@babel/preset-env'
            }
        ],
        noParse: /\.min\.js/
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
    ],
    optimization: {
        minimize: true
    },
    externals: ['react', 'react-dom', 'prop-types', 'lodash']
};
