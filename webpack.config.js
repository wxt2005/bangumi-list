var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');

module.exports = {
    entry: {
        vendor: ['react', 'flux', 'qwest'],
        app: process.env.NODE_ENV === 'production' ? './src/js/main.js' : [
            'webpack-dev-server/client?http://localhost:8090', 
            'webpack/hot/dev-server',
            './src/js/main.js'
        ]
    },
    output: {
        path: './build/js',
        filename: process.env.NODE_ENV === 'production' ? 'main.[chunkhash].js': 'main.js',
        sourceMapFilename: '[file].map',
        publicPath: process.env.NODE_ENV === 'production' ? 'dist/js/' : 'http://localhost:8090/assets/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'react-hot!babel!jsx',
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.less$/,
                // loader: 'style!css!less'
                loader: ExtractTextPlugin.extract("style", "css!less")
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.less']
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: 'template.html',
            inject: false,
            filename: '../../index.html'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: process.env.NODE_ENV === 'production' ? 'vendor.[chunkhash].js' : 'vendor.js'
        }),
        new ExtractTextPlugin(process.env.NODE_ENV === 'production' ? '../css/styles.[chunkhash].css' : 'styles.css'),
        new webpack.NoErrorsPlugin()
    ]
};