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
  exports.authorisation.style.display = 'none';
  exports.client_registration.style.display = 'none';
  exports.create_comment.style.display = 'none';
  exports.create_request.style.display = 'none';
  exports.edit_request.style.display = 'none';
  exports.list_request.style.display = 'none';
  exports.performer_registration.style.display = 'none';
  exports.select_performer.style.display = 'none';
  exports.request_details.style.display = 'none';
  exports.performer_creation.style.display = 'none';
};

exports.createSimpleElement = function(element, tag) {
  for (var i = 2; i < arguments.length; i++) {
    var elem = document.createElement(tag);
    elem.innerHTML = arguments[i];
    element.appendChild(elem);
  }
};

exports.displayError = function(text, f) {
  var error = document.createElement('div');
  error.className = 'error';
  error.innerHTML = text;
  document.body.appendChild(error);
  if (f === 'undefined' || f === false)
    return error;
  setTimeout(function () {
    document.body.removeChild(error);
  }, 2000);
  return error;
};

exports.removeElements = function(element, tag, index) {
  var elements = element.querySelectorAll(tag);
  for (var i = index; i < elements.length; i++) {
    element.removeChild(elements[i]);
  }
};

exports.injectSelect = function(sel, rowsObject) {
  for (var i = 0; i < sel.length; i++) {
    var opt, x;
    sel[i].innerHTML = "";
    if (rowsObject instanceof Array) {
      for (var k = 0; k < rowsObject.length; k++) {
        opt = document.createElement("option");
        opt.value = k;
        opt.innerHTML = rowsObject[k];
        sel[i].appendChild(opt);
      }
    } else {
      for (x in rowsObject) {
        opt = document.createElement("option");
        opt.value = x;
        opt.innerHTML = rowsObject[x];
        sel[i].appendChild(opt);
      }
    }
  }
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
