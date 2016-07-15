const webpack = require('webpack');
//let ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  context: __dirname + '/frontend',

  entry: {
    entry:  "./script/main.js",
  },

  output: {
    path:     __dirname + '/client',
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
  }
  /*
  plugins: [
    new ExtractTextPlugin('style.css', {allChunks: true})
  ]
  */
};