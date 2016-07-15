var exports = module.exports = {};

let _ = require('lodash');
let $ = require('jquery');

exports.months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

exports.hide = function() {
  $(document.body).empty();
};

exports.displayError = function(text, f) {
  var tmpl = require('./../template/error.ejs');
  var error = tmpl({error: text});
  $('body').append(error);
  if (f === 'undefined' || f === false)
    return error;
  setTimeout(function () {
    $('.error').remove();
  }, 2000);
  return error;
};

exports.makeNumbersObject = function(from, to) {
  var result = {}, x;
  if (from > to) {
    var z = from;
    from = to;
    to = z;
  }
  for (x = from; x <= to; x++) {
    result[x] = x;
  }
  return result;
};
