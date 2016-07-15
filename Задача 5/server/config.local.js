var p = require('../package.json');
var version = p.version.split('.').shift();
	
module.exports = {
  remoting: {
    errorHandler: {
      handler: function(err, req, res, next) {
        var log = require('debug')('server:rest:errorHandler');
        log(req.method, req.originalUrl, res.statusCode, err);
        next();
      }
    }
  },

	restApiRoot: '/api' + (version > 0 ? '/v' + version : ''),
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000
};