var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: {
        'image-magnifier': path.join(__dirname, 'src/image-magnifier.js')
    },
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: 'dist',
        filename: '[name].min.js'
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel?presets[]=react,presets[]=es2015'
            }
        ],
        noParse: /\.min\.js/
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        // optimizations
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    externals: ['react', 'react-dom']
};
