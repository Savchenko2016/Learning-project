var exports = module.exports = {};

exports.authorisation = null;
exports.client_registration = null;
exports.create_comment = null;
exports.create_request = null;
exports.edit_request = null;
exports.list_request = null;
exports.performer_registration = null;
exports.select_performer = null;
exports.request_details = null;
exports.performer_creation = null;

exports.hide = function() {
  exports.authorisation.css('display', 'none');
  exports.client_registration.css('display', 'none');
  exports.create_comment.css('display', 'none');
  exports.create_request.css('display', 'none');
  exports.edit_request.css('display', 'none');
  exports.list_request.css('display', 'none');
  exports.performer_registration.css('display', 'none');
  exports.select_performer.css('display', 'none');
  exports.request_details.css('display', 'none');
  exports.performer_creation.css('display', 'none');
};

exports.createSimpleElement = function(element, tag) {
  var tmpl = require('./array_elements.ejs');
  var elem = tmpl({tag: tag, items: arguments});
  element.append(elem);
};

exports.displayError = function(text, f) {
  var tmpl = require('./error.ejs');
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
