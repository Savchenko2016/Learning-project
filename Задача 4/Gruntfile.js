module.exports = function(grunt) {
  require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);
  var webpack = require("webpack");
  var webpackConfig = require("./webpack.config.js");
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    webpack: {
      options: webpackConfig,
      build: {
        plugins: webpackConfig.plugins.concat(
          new webpack.DefinePlugin({
	    "process.env": {
	      "NODE_ENV": JSON.stringify("production")
	    }
	  }),
	  new webpack.optimize.UglifyJsPlugin()
	)
      },
      "build-dev": {
	devtool: "sourcemap",
	debug: true
      }
    },
    watch: {
      app: {
        files: ["frontend/**/*", "node_modules/**/*"],
        tasks: ["webpack:build-dev"],
        options: {
          spawn: false,
        }
      }
    }
  });

  grunt.registerTask("default", ["webpack:build-dev", "watch:app"]);
  grunt.registerTask("build", ["webpack:build"]);
};
