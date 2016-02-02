var path = require('path');
var webpack = require('webpack');

module.exports = {
    cache: true,
    entry: {
        app: path.join(__dirname, 'example', 'src', 'app.js')
    },
    output: {
        path: path.join(__dirname, 'example', 'build'),
        publicPath: 'example',
        filename: '[name].js'
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
        new webpack.NoErrorsPlugin()
    ]
};
