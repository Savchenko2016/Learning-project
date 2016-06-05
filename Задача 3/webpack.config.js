'use strict'

const webpack = require('webpack');
//let ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  context: __dirname + '/frontend',

  entry: {
    entry:  "./main.js",
  },

  output: {
    path:     __dirname + '/public',
    filename: "main.js",
  },

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions:         ['', '.js']
  },

  resolveLoader: {
    modulesDirectories: ['node_modules'],
    moduleTemplates:    ['*-loader', '*'],
    extensions:         ['', '.js']
  },

  plugins: [
    new webpack.DefinePlugin({
      LANG:     JSON.stringify('ru')
    })
  ],

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel' },
      /*{ test: /\.css$/, loader: ExtractTextPlugin.extract('css') }*/
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.html?$/, loader: 'dom!html' },
    ]
  },
  /*
  plugins: [
    new ExtractTextPlugin('style.css', {allChunks: true})
  ]
  */
};
