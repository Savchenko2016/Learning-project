var events = require('./events.js');
var functions = require('./functions.js');
var script = require('./script.js');

require("./css/style.css");
require("./css/typography.css");

var ready = function () {
  document.body.appendChild(require("./index.html"));
  functions.injectSelect(document.getElementsByClassName("months"), ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']);
  functions.injectSelect(document.getElementsByClassName("years"), functions.makeNumbersObject(2000, 2016));
  functions.injectSelect(document.getElementsByClassName("days"), functions.makeNumbersObject(1, 31));

  functions.authorisation = document.getElementById('authorisation');
  functions.client_registration = document.getElementById('client_registration');
  functions.create_comment = document.getElementById('create_comment');
  functions.create_request = document.getElementById('create_request');
  functions.edit_request = document.getElementById('edit_request');
  functions.list_request = document.getElementById('list_request');
  functions.performer_registration = document.getElementById('performer_registration');
  functions.select_performer = document.getElementById('select_performer');
  functions.request_details = document.getElementById('request_details');
  functions.performer_creation = document.getElementById('performer_creation');


  functions.hide();
  functions.authorisation.style.display = 'block';

  var admin = script.getObject('admin');
  if (admin === null) {
    admin = new script.User();
    admin.id('admin');
    admin.login('admin');
    admin.type('Администратор');
    script.saveObject(admin);
  }

  functions.authorisation.getElementsByTagName('form')[0].addEventListener('submit', events.auth);

  document.getElementById("reg-performer").addEventListener('click', function () {
    functions.hide();
    functions.performer_registration.style.display = 'block';

    document.querySelector('#performer_registration input[type="submit"]').addEventListener('click', events.registration);
  });

  document.getElementById("reg-customer").addEventListener('click', function () {
    functions.hide();
    functions.client_registration.style.display = 'block';

    document.querySelector('#client_registration input[type="submit"]').addEventListener('click', events.registration1);
  });

  document.getElementById('create-request').addEventListener('click', events.createRequest);
  functions.create_request.querySelector('input[type="submit"]').addEventListener('click', events.recordRequest);

  document.getElementById('list-requests').addEventListener('click', events.showRequests);

  document.getElementById('add-comment').addEventListener('click', function () {
    functions.hide();
    functions.create_comment.style.display = 'block';
    var elems = document.getElementsByClassName('not-performer');
    var value;
    if (events.user.type() === 'Исполнитель')
      value = 'none';
    else
      value = 'auto';

    for (var k = 0; k < elems.length; ++k) {
      elems[k].style.display = value;
    }
    functions.create_comment.querySelector('form').addEventListener('submit', events.createComment);
  });

  document.getElementById('edit-request').addEventListener('click', events.editRequest);
  functions.edit_request.querySelector('form').addEventListener('submit', events.submitRequest);
  document.getElementById('back-authorisation').addEventListener('click', function () {
    functions.hide();
    functions.authorisation.style.display = 'block';
    return false;
  });
  document.getElementById('create-performer').addEventListener('click', function () {
    functions.hide();
    functions.performer_creation.style.display = 'block';
    functions.performer_creation.querySelector('form').addEventListener('submit', events.creation);
    return false;
  });
};

document.addEventListener("DOMContentLoaded", ready);
