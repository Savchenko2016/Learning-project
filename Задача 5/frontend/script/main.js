var events = require('./events.js');
var functions = require('./functions.js');
var script = require('./script.js');

let $ = require('jquery');

require("./../css/style.css");
require("./../css/typography.css");

$(document).ready(function(e) {
  events.showAuthoristation(); 
});