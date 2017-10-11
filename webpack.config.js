/**
 * @file webpack config
 * @author init
 */

/* eslint-disable no-var */

var glob = require('glob');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var WebpackMd5Hash = require('webpack-md5-hash');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var mode = process.env.NODE_ENV || 'development';

// import glob from 'glob';
// import path from 'path';
// import ExtractTextPlugin from 'extract-text-webpack-plugin';
// import Visualizer from 'webpack-visualizer-plugin';
// import webpack from 'webpack';
// import WebpackMd5Hash from 'webpack-md5-hash';
// import HtmlWebpackPlugin from 'html-webpack-plugin';
// import CopyWebpackPlugin from 'copy-webpack-plugin';

// let mode = process.env.NODE_ENV || 'development';

var viewRoot = './client/views/auto/';
var staticRoot = './dist';
// const jsFiles = glob.sync(viewRoot + 'main.js');

// let entry = {
//     index: './client/views/auto/main.js'
// };

// const entry = jsFiles.reduce((entry, filename) => {
//     let name = path.posix.relative(viewRoot, filename).replace(/(^|\/)main\.js/, '');
//     name = name || 'index';
//     entry[name] = filename;
//     return entry;
// }, {index: './client/views/auto/main.js'});

// const autoSWFiles = glob.sync(viewRoot + '*/sw.js');
var entry = glob.sync(viewRoot + '*/sw.js').reduce(
    (entry, filename) => {
        var name = path.posix.relative(viewRoot, filename).replace(/\/sw\.js/, '-sw');
        entry[name] = filename;
        return entry;
    },
    {index: './client/views/auto/main.js'}
);

/* eslint-disable no-console */
console.log(entry);
console.log('\x1b[35m%s\x1b[0m', '[' + new Date().toLocaleString() + ']', '--webpack start');
/* eslint-enable no-console */

// const cssLoader = ExtractTextPlugin.extract({
//     fallback: 'style-loader',
//     use: ['css-loader?minimize', 'postcss-loader']
// });

module.exports = {
    entry,
    output: {
        filename: '[name].js',
        // filename: mode === 'development' ? 'js/[name].js' : 'js/[name]-[chunkhash].js',
        // chunkFilename: mode === 'development' ? 'js/[name].js' : 'js/[name]-[chunkhash].js',
        path: path.resolve(staticRoot),
        publicPath: '/dist/'
        // publicPath: mode === 'development' ? '/dist/' : 'https://resource.toxicjohann.com/ispwaready/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        cacheDirectory: './.babel_cache/',
                        presets: [
                            [
                                'es2015',
                                {loose: true, modules: false}
                            ],
                            ['stage-2']
                        ],
                        plugins: ['transform-runtime']
                    }
                }]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?minimize', 'postcss-loader']
                })
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: 'url-loader?limit=10000&name=img/[name]-[hash].[ext]'
            },
            {
                test: /\.(otf|ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                use: 'url-loader?limit=10000&name=font/[name]-[hash].[ext]'
            }
        ]
    },
    resolve: {
        // 模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: {
            /* eslint-disable */
            'utils': path.resolve('./client/views/common/utils.js'),
            'store': path.resolve('./client/views/common/store.js'),
            'raven': path.resolve('./client/views/common/raven.js')
            /* eslint-enable */
        },
        enforceExtension: false,
        modules: [
            path.resolve('./client'),
            'node_modules'
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 8849,
        // hot: true,
        // inline: true,
        proxy: {
            '/auto': {
                // target: path.resolve(__dirname, 'dist'),
                target: {
                    host: 'localhost',
                    protocol: 'http:',
                    port: 8849
                },
                /* eslint-disable object-shorthand */
                pathRewrite: function (path, req) {
                    console.log('got path:' + path);
                    return path.replace(/^\/auto/, '');
                }
            }
        }
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                output: {
                    publicPath: '/dist/'
                },
                postcss: [
                    require('postcss-import')({
                        path: [path.resolve('./fesrc')],
                        resolve(id, basedir, importOptions) {
                            return id.match(/^\//)
                            ? path.resolve('./client') + id
                            : id;
                        }
                    }),
                    require('precss'),
                    require('postcss-cssnext')()
                ]
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"' + mode + '"'
            }
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].css'
            // filename: mode === 'development' ? 'css/[name].css' : 'css/[name]-[contenthash].css'
        }),
        // ...htmlWebpackPlugins,
        // new Visualizer(),
        // copy static assets to dist dir, generate static web page
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'static/cache'),
                to: path.resolve(__dirname, 'dist/cache')
            },
            // {
            //     from: path.resolve(__dirname, 'static/js/auto'),
            //     to: path.resolve(__dirname, 'dist')
            // },
            {
                from: path.resolve(__dirname, 'static/manifest.json'),
                to: path.resolve(__dirname, 'dist')
            },
            {
                from: path.resolve(__dirname, 'static/index.html'),
                to: path.resolve(__dirname, 'dist/index.html')
            }
            // ,
            // {
            //     from: path.resolve(__dirname, 'static'),
            //     to: path.resolve(__dirname, 'dist/static'),
            //     ignore: ['stats.html', 'manifest.json', 'cache/']
            // }
        ])
    ]
    .concat(
        mode !== 'development'
        ? [
            new WebpackMd5Hash(),
            // css minify will finished by stc
            new webpack.optimize.UglifyJsPlugin({
                test: /\.js$/,
                comments: false,
                sourceMap: true,
                compress: {
                    // remove warnings
                    'warnings': false,
                        // Drop console statements
                    'drop_console': true
                }
            })
        ]
        : [
            // new webpack.HotModuleReplacementPlugin()
        ]
    )
};
