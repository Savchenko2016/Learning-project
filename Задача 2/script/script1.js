var authorisation;
var client_registration;
var create_comment;
var create_request;
var edit_request;
var list_request;
var performer_registration;
var select_performer;
var request_details;

var user = null;
var request = null;
var comment = null;

var options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
};

var hide = function() {
  authorisation.style.display = 'none';
  client_registration.style.display = 'none';
  create_comment.style.display = 'none';
  create_request.style.display = 'none';
  edit_request.style.display = 'none';
  list_request.style.display = 'none';
  performer_registration.style.display = 'none';
  select_performer.style.display = 'none';
  request_details.style.display = 'none';
};

var registration = function(event) {
  event = event || window.event;
  var login = performer_registration.querySelectorAll('input[name="login"]')[0].value;
  if (validate(login, 1) && !(login in localStorage)) {
    var performer = new User();
    performer.id(login);
    performer.login(login);
    performer.type('Исполнитель');
    saveObject(performer);
    hide();
    authorisation.style.display = 'block';
  }
  else {

  }
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
};

var registration1 = function(event) {
  event = event || window.event;
  var login = client_registration.querySelectorAll('input[name="login"]')[0].value;
  if (validate(login, 1) && !(login in localStorage)) {
    var customer = new User();
    customer.id(login);
    customer.login(login);
    customer.type('Исполнитель');
    saveObject(customer);
    hide();
    authorisation.style.display = 'block';
  }
  else {

  }
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
};

var showRequests = function(user) {
  hide();
  list_request.style.display = 'block';

  var login = user.login();
  var span = document.getElementsByClassName('user');
  for ( var i = 0; i < span.length; i++ ) {
    span[i].innerHTML = login;
  }

  if (user.type() == 'Исполнитель') {
    document.getElementById('create-request').style.display = 'none';
  }

  var requestsId = user.requestsId();
  var tr;
  var table = list_request.querySelectorAll('table')[0];
  removeElements(table, 'tr', 1);
  if (requestsId.length === 0) {
    tr = document.createElement('tr');
    var td = document.createElement('td');
    td.setAttribute('colspan', '7');
    td.innerHTML = 'Нет заявок';
    tr.appendChild(td);
    table.appendChild(tr);
    return;
  }

  for ( var k = 0; k < requestsId.length; k++ ) {
    var id = requestsId[k];
    var request = getObject(id);

    tr = document.createElement('tr');
    createSimpleElement(tr, 'td',
      request.id(),
      request.customerId(),
      request.performerId(),
      request.summary(),
      request.priority(),
      request.estimated(),
      request.deadline().toLocaleString("ru", options),
      request.ready() + '%'
    );

    tr.firstElementChild.style.display = 'none';
    table.appendChild(tr);
  }
};

var showRequestDetails = function(id) {
  hide();
  request_details.style.display = 'block';

  var login = user.login();
  var span = document.getElementsByClassName('user');
  for ( var i = 0; i < span.length; i++ ) {
    span[i].innerHTML = login;
  }
  span = document.getElementById('request');
  span.innerHTML = request.id();

  var table = request_details.querySelectorAll('table')[0];
  removeElements(table, 'tr', 1);
  request = getObject(id);
  tr = document.createElement('tr');
  createSimpleElement(tr, 'td',
    request.customerId(),
    request.performerId(),
    request.summary(),
    request.priority(),
    request.estimated(),
    request.created().toLocaleString("ru", options),
    request.deadline().toLocaleString("ru", options),
    request.ready() + '%'
  );
  table.appendChild(tr);

  var div = request_details.querySelectorAll('#description')[0];
  div.innerHTML = request.description();

  var commentsId = request.commentsId();
  var comments = request_details.querySelectorAll('#comments')[0];
  if (commentsId.length === 0) comments.innerHTML='<h3>Комментариев еще нет.</h3>';
  else {
    comments.innerHTML = '<h3>Комментарии:</h3>';
    for ( var k = 0; k < commentsId.length; k++ ) {
      var comment = getObject(commentsId[i]);
      var ul = document.createElement('ul');
      var li1 = document.createElement('li');
      li1.innerHTML = comment.date().toLocaleString("ru", options) + ' - ' + comment.type() + ' [' + comment.userId() + ']';
      var li2 = document.createElement('li');
      ul.appendChild(li1);
      li2 = document.createElement('li');
      li2.innerHTML = comment.text();
      ul.appendChild(li2);
      comments.appendChild(ul);
    }
  }
};

var auth = function(event) {
  event = event || window.event;
  var login = authorisation.querySelectorAll('input[name="login"]')[0].value;

  if ( validate(login, 1) ) {
    user = getObject(login);
    if (user !== null) {
      showRequests(user);
      return false;
    }
  }

  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
};

var selectRequest = function(event) {
  event = event || window.event;
  if (event.currentTarget.nodeName == 'TR') {
    event.stopPropagation();
    var id = event.currentTarget.temp;
    showRequestDetails(id);
  }
};

var createRequest = function() {
  hide();
  create_request.style.display = 'block';
  var performer = create_request.querySelectorAll('form input[name="performer"]')[0];
  var client = create_request.querySelectorAll('form input[name="client"]')[0];

  var performersId = localStorage[0];
  for ( var i = 0; i < performersId.length; i++ ) {
    var option = document.createElement('option');
    option.innerHTML = performersId[i];
    performer.appendChild(option);
  }

  var customersId = localStorage[1];
  for ( var k = 0; k < customersId.length; k++ ) {
    var option1 = document.createElement('option');
    option1.innerHTML = customersId[i];
    client.appendChild(option1);
  }
};

var ready = function() {
  authorisation = document.getElementById('authorisation');
  client_registration = document.getElementById('client_registration');
  create_comment = document.getElementById('create_comment');
  create_request = document.getElementById('create_request');
  edit_request = document.getElementById('edit_request');
  list_request = document.getElementById('list_request');
  performer_registration = document.getElementById('performer_registration');
  select_performer = document.getElementById('select_performer');
  request_details = document.getElementById('request_details');

  hide();
  authorisation.style.display = 'block';

  var admin = new User();
  admin.id('admin');
  admin.login('admin');
  admin.type('Администратор');
  saveObject(admin);

  authorisation.querySelectorAll('input[type="submit"]')[0].addEventListener('click', auth);

  document.getElementById("reg-performer").addEventListener('click', function () {
    hide();
    performer_registration.style.display = 'block';

    document.querySelectorAll('#performer_registration input[type="submit"]')[0].addEventListener('click', registration);
  });

  document.getElementById("reg-customer").addEventListener('click', function () {
    hide();
    client_registration.style.display = 'block';

    document.querySelectorAll('#client_registration input[type="submit"]')[0].addEventListener('click', registration1);
  });

  var table = list_request.querySelectorAll('table')[0];
  var trs = table.querySelectorAll('tr');
  for ( var i = 1; i < trs.length; i++ ) {
    if (+trs[i].firstElementChild.getAttribute('colspan')>1) {
      trs[i].temp = trs[i].firstElementChild.innerHTML;
      trs[i].addEventListener('click', selectRequest);
    }
  }

  document.getElementById('create-request').addEventListener('click', createRequest);
};

document.addEventListener("DOMContentLoaded", ready);

function createSimpleElement(element, tag) {
  for ( var i = 2; i < arguments.length; i++ ) {
    var elem = document.createElement(tag);
    elem.innerHTML = arguments[i];
    element.appendChild(elem);
  }
}

function displayError(text) {
    var error = document.createElement('div');
    error.className = 'error';
    error.innerHTML = text;
    document.body.appendChild(error);

    setTimeout(function () {
        document.body.removeChild(error);
    }, 2000);
}

function removeElements(element, tag, index) {
  var elements = element.querySelectorAll(tag);
  for ( var i = index; i < elements.length; i++ ) {
    element.removeChild(elements[i]);
  }
}
