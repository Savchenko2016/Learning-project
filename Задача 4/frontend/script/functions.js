var exports = module.exports = {};

let _ = require('lodash');
let $ = require('jquery');

exports.months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

exports.hide = function() {
  $(document.body).empty();
};

exports.createSimpleElement = function(element, tag) {
  var tmpl = require('./../template/array_elements.ejs');
  var elem = tmpl({tag: tag, items: arguments});
  element.append(elem);
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

exports.removeElements = function(element, tag, ind) {
  var elements = element.find(tag).each(function(index, elem) {
    if (index >= ind) $(elem).remove();
  });
};

exports.injectSelect = function(sel, rowsObject) {
  sel.each(function(index, elem) {
    var opt, x;
    var elem1 = $(elem);
    elem1.text("");
    if (rowsObject instanceof Array) {
      for (var k = 0; k < rowsObject.length; k++) {
        opt = document.createElement("option");
        opt.value = k;
        opt.innerHTML = rowsObject[k];
        elem1.append($(opt));
      }
    }
    else {
      for (x in rowsObject) {
        opt = document.createElement("option");
        opt.value = x;
        opt.innerHTML = rowsObject[x];
        elem1.append($(opt));
      }
    }
  });
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
