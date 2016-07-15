function hide() {
  authorisation.style.display = 'none';
  client_registration.style.display = 'none';
  create_comment.style.display = 'none';
  create_request.style.display = 'none';
  edit_request.style.display = 'none';
  list_request.style.display = 'none';
  performer_registration.style.display = 'none';
  select_performer.style.display = 'none';
  request_details.style.display = 'none';
  performer_creation.style.display = 'none';
}

function createSimpleElement(element, tag) {
  for (var i = 2; i < arguments.length; i++) {
    var elem = document.createElement(tag);
    elem.innerHTML = arguments[i];
    element.appendChild(elem);
  }
}

function displayError(text, f) {
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
}

function removeElements(element, tag, index) {
  var elements = element.querySelectorAll(tag);
  for (var i = index; i < elements.length; i++) {
    element.removeChild(elements[i]);
  }
}

function injectSelect(sel, rowsObject) {
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
}
function makeNumbersObject(from, to) {
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
}
