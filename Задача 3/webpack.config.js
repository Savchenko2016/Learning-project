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
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new webpack.ProvidePlugin({
        _: "underscore"
    })
  ],
    
  module: {
    loaders: [
      { 
	test: /\.js$/, 
	loader: 'babel', 
	exclude: /\/node_modules\//
      },
      /*{ test: /\.css$/, loader: ExtractTextPlugin.extract('css') }*/
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.html?$/, loader: 'dom!html' },
      { test: /\.less$/, loader: "style!css!less" },
      { test: /\.ejs$/, loader: "ejs-loader" },
    ]
  },
  /*
  plugins: [
    new ExtractTextPlugin('style.css', {allChunks: true})
  ]
  */
};