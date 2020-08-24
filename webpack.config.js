var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');

var isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        vendor: ['react', 'flux', 'qwest', 'lodash'],
        app: isProduction ? './src/js/main.js' : [
            'webpack-dev-server/client?http://localhost:8090',
            'webpack/hot/dev-server',
            './src/js/main.js'
        ]
    },
    output: {
        path: './build/js',
        filename: isProduction ? 'main.[chunkhash].js': 'main.js',
        sourceMapFilename: '[file].map',
        publicPath: isProduction ? 'dist/js/' : 'http://localhost:8090/assets/'
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
    plugins: (function(){
        return isProduction ? [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': '"production"'
                }
            }),
            new HtmlWebpackPlugin({
                template: 'template.html',
                inject: false,
                filename: '../../index.html'
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                filename: 'vendor.[chunkhash].js'
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                output: {
                    comments: false
                }
            }),
            new ExtractTextPlugin('../css/styles.[chunkhash].css'),
            new webpack.NoErrorsPlugin(),
            new webpack.optimize.OccurenceOrderPlugin()
        ] : [
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                filename: 'vendor.js'
            }),
            new ExtractTextPlugin('styles.css')
        ];
    })()
};
