var exports = module.exports = {};

var script = require('script.js');
var functions = require('./functions.js');

exports.user = null;
exports.request = null;
exports.comment = null;

exports.options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
};

/**
 * Функция создания исполнителя
 * @param {object} event - Объект события
 * @returns {undefined}
 */
exports.creation = function(event) {
  event = event || window.event;
  var login = functions.performer_creation.querySelector('input[name="login"]').value;
  if (script.validate(login, 1) && !(login in localStorage)) {
    var performer = new script.User();
    performer.id(login);
    performer.login(login);
    performer.type('Исполнитель');
    script.saveObject(performer);
    functions.hide();
    functions.list_request.style.display = 'block';
  } else {
    functions.displayError('Ошибка!');
  }
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }

};

/**
 * Функция регистрации исполнителя
 * @param {object} event - Объект события
 * @returns {undefined}
 */
exports.registration = function(event) {
  event = event || window.event;
  var login = functions.performer_registration.querySelector('input[name="login"]').value;
  if (script.validate(login, 1) && !(login in localStorage)) {
    var performer = new script.User();
    performer.id(login);
    performer.login(login);
    performer.type('Исполнитель');
    script.saveObject(performer);
    functions.hide();
    functions.authorisation.style.display = 'block';
  } else {
    functions.displayError('Ошибка!');
  }
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
};

/**
 * Функция регистрации клиента
 * @param {object} event - Объект события
 * @returns {undefined}
 */
exports.registration1 = function(event) {
  event = event || window.event;
  var login = functions.client_registration.querySelector('input[name="login"]').value;
  if (script.validate(login, 1) && !(login in localStorage)) {
    var customer = new script.User();
    customer.id(login);
    customer.login(login);
    customer.type('Клиент');
    script.saveObject(customer);
    functions.hide();
    functions.authorisation.style.display = 'block';
  } else {
    functions.displayError('Ошибка!');
  }
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
};
/**
 * Функция отображения списка заявок
 * @param {object} event - Объект события
 * @returns {Boolean}
 */
exports.showRequests = function(event) {
  event = event || window.event;

  functions.hide();
  functions.list_request.style.display = 'block';
  if (exports.user.type() !== 'Администратор') {
    document.getElementById('create-performer').style.display = 'none';
  } else {
    document.getElementById('create-performer').style.display = 'block';
  }
  var login = exports.user.login();
  var span = document.getElementsByClassName('user');
  for (var i = 0; i < span.length; i++) {
    span[i].innerHTML = login;
  }

  if (exports.user.type() == 'Исполнитель') {
    document.getElementById('create-request').style.display = 'none';
  } else {
    document.getElementById('create-request').style.display = 'block';
  }

  var requestsId = exports.user.requestsId();
  var tr;
  var table = list_request.querySelector('table');
  functions.removeElements(table, 'tr', 1);
  if (requestsId.length === 0) {
    tr = document.createElement('tr');
    var td = document.createElement('td');
    td.setAttribute('colspan', '7');
    td.innerHTML = 'Нет заявок';
    tr.appendChild(td);
    table.appendChild(tr);
    return false;
  }

  for (var k = 0; k < requestsId.length; k++) {
    var id = requestsId[k];
    var request = script.getObject(id);

    tr = document.createElement('tr');
    functions.createSimpleElement(tr, 'td',
            request.id(),
            request.customerId(),
            request.performerId(),
            request.summary(),
            request.priority(),
            request.estimated(),
            request.deadline().toLocaleString("ru", exports.options),
            request.ready() + '%'
            );

    tr.firstElementChild.style.display = 'none';
    table.appendChild(tr);
  }
  var trs = table.querySelectorAll('tr');
  if (trs[1].children.length !== 1) {
    for (var l = 1; l < trs.length; l++) {
      trs[l].temp = trs[l].firstElementChild.innerHTML;
      trs[l].addEventListener('click', exports.selectRequest);
    }
  }
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
};

/**
 * Функция отображает детали заявки с идентификатором id
 * @param {number} id - Идентификатор заявки
 * @returns {undefined}
 */
exports.showRequestDetails = function(id) {
  functions.hide();
  functions.request_details.style.display = 'block';
  exports.request = script.getObject(id);
  var login = exports.user.login();
  var span = document.getElementsByClassName('user');
  for (var i = 0; i < span.length; i++) {
    span[i].innerHTML = login;
  }
  span = document.getElementById('request');
  span.innerHTML = exports.request.id();

  if (exports.user.type() === 'Клиент')
    document.getElementById('edit-request').style.display = 'none';
  else
    document.getElementById('edit-request').style.display = 'block';

  var table = functions.request_details.querySelector('table');
  functions.removeElements(table, 'tr', 1);
  tr = document.createElement('tr');
  functions.createSimpleElement(tr, 'td',
          exports.request.customerId(),
          exports.request.performerId(),
          exports.request.summary(),
          exports.request.priority(),
          exports.request.estimated(),
          exports.request.created(),
          exports.request.deadline(),
          exports.request.ready() + '%'
          );
  table.appendChild(tr);

  var div = document.getElementById('description');
  div.innerHTML = exports.request.description();

  var commentsId = exports.request.commentsId();
  var comments = document.getElementById('comments');
  if (commentsId.length === 0)
    comments.innerHTML = '<h3>Комментариев еще нет.</h3>';
  else {
    comments.innerHTML = '<h3>Комментарии:</h3>';
    for (var k = 0; k < commentsId.length; k++) {
      var comment = script.getObject(commentsId[k]);
      var ul = document.createElement('ul');
      var li1 = document.createElement('li');
      li1.innerHTML = comment.date() + ' - ' + comment.type() + ' [' + comment.userId() + ']';
      var li2 = document.createElement('li');
      ul.appendChild(li1);
      li2 = document.createElement('li');
      li2.innerHTML = comment.text();
      ul.appendChild(li2);
      comments.appendChild(ul);
    }
  }
};

/**
 * Функция регистрации пользователя
 * @param {object} event - Объект события
 * @returns {Boolean}
 */
exports.auth = function(event) {
  event = event || window.event;
  var login = functions.authorisation.querySelector('input[name="login"]');

  if (script.validate(login.value, 1)) {
    exports.user = script.getObject(login.value);
    if (exports.user !== null) {
      exports.showRequests();
      return false;
    }
  }
  functions.displayError("Ошибка!");
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
};

/**
 * Обработчик события выбора заявки
 * @param {object} event - Объект события
 * @returns {undefined}
 */
exports.selectRequest = function(event) {
  event = event || window.event;
  var target = event.target || event.srcElement;
  if (event.currentTarget.tagName === 'TR') {
    id = event.currentTarget.temp;
    event.stopPropagation();
    exports.showRequestDetails(id);
  }
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
};

/**
 * Функция отображения формы создания заявки
 * @param {object} event
 * @returns {undefined}
 */
exports.createRequest = function(event) {
  event = event || window.event;
  functions.hide();
  functions.create_request.style.display = 'block';
  var performer = functions.create_request.querySelector('select[name="performer"]');

  var performersId = [];
  for (var id in localStorage) {
    try {
      var object = script.getObject(id);
      if (object.login() !== undefined && object.type() == 'Исполнитель')
        performersId.push(id);
    } catch (err) {

    }
  }
  functions.removeElements(performer, 'option', 0);
  for (var i = 0; i < performersId.length; i++) {
    var option = document.createElement('option');
    option.innerHTML = performersId[i];
    performer.appendChild(option);
  }
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
};

/**
 * Функция создания заявки
 * @param {object} event
 * @returns {Boolean}
 */
exports.recordRequest = function(event) {
  event = event || window.event;

  var created = new Date().toLocaleString('ru', exports.options);
  var performer = functions.create_request.querySelector('select[name="performer"]').value;
  var summary = functions.create_request.querySelector('input[name="summary"]').value;
  var description = functions.create_request.querySelector('textarea').value;
  var priority = functions.create_request.querySelector('select[name="priority"]').value;
  var estimated = functions.create_request.querySelector('input[name="estimated"]').value;

  if (!script.validate(estimated, 4) || summary.length === 0 || description.length === 0) {
    functions.displayError('Ошибка!');
    return false;
  }

  var deadline = new Date(
          functions.create_request.querySelector('.years').value,
          functions.create_request.querySelector('.months').value,
          functions.create_request.querySelector('.days').value,
          functions.create_request.querySelector('input[name="hours"]').value,
          functions.create_request.querySelector('input[name="minutes"]').value,
          functions.create_request.querySelector('input[name="seconds"]').value
          ).toLocaleString('ru', exports.options);

  var request = new script.Request();
  request.created(created);
  request.performerId(performer);
  request.customerId(exports.user.id());
  request.summary(summary);
  request.description(description);
  request.priority(priority);
  request.estimated(estimated);
  request.deadline(deadline);
  request.ready(0);
  request.id(Math.uuid(20));
  script.saveObject(request);

  exports.user = script.getObject(exports.user.id());
  exports.user.addRequestId(request.id());
  script.saveObject(exports.user);

  var performerUser = script.getObject(performer);
  performerUser.addRequestId(request.id());
  script.saveObject(performerUser);

  var admin = script.getObject('admin');
  admin.addRequestId(request.id());
  script.saveObject(admin);

  exports.showRequests(exports.user);

  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
};

/**
 * Функция создания комментария
 * @param {object} event - Объект события
 * @returns {Boolean}
 */
exports.createComment = function(event) {
  event = event || window.event;
  var text = functions.create_comment.querySelector('[name="text"]').value;
  var type = functions.create_comment.querySelector('[name="type"]').value;
  var created = new Date().toLocaleString('ru', exports.options);

  if (!script.validate(text, 0)) {
    functions.displayError("Ошибка!");
    return false;
  }

  exports.comment = new script.Comment();
  exports.comment.id(Math.uuid(20));
  exports.comment.type(type);
  exports.comment.date(created);
  exports.comment.userId(exports.user.id());
  exports.comment.text(text);
  script.saveObject(exports.comment);

  exports.request = script.getObject(exports.request.id());
  exports.request.addCommentId(exports.comment.id());
  script.saveObject(exports.request);

  exports.showRequestDetails(exports.request.id());
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
};

/**
 * Функция отображения болка редактирования заявки
 * @param {object} event - Объект события
 * @returns {undefined}
 */
exports.editRequest = function(event) {
  event = event || window.event;
  functions.hide();
  functions.edit_request.style.display = 'block';

  var elem = document.getElementById('administrator-edit');
  if (exports.user.type() == 'Администратор') {
    elem.style.display = 'block';
    var performer = functions.edit_request.querySelector('[name="performer"]');
    functions.removeElements(performer, 'option', 0);
    var performersId = [];
    for (var id in localStorage) {
      try {
        var object = script.getObject(id);
        if (object.login() !== undefined && object.type() == 'Исполнитель')
          performersId.push(id);
      } catch (err) {

      }
    }
    for (var i = 0; i < performersId.length; i++) {
      var option = document.createElement('option');
      option.innerHTML = performersId[i];
      performer.appendChild(option);
    }
  } else {
    elem.style.display = 'none';
  }
  /*
   elem = document.getElementById('performer-edit');
   if (user.type() == 'Исполнитель') {
   elem.style.display = 'block';
   }
   else {
   elem.style.display = 'none';
   }
   */
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
};
/**
 * Функция редактирования заявки
 * @param {object} event - Объект события
 * @returns {Boolean}
 */
exports.submitRequest = function(event) {
  event = event || window.event;
  exports.request = script.getObject(exports.request.id());

  if (exports.user.type() === 'Администратор') {
    var performer = functions.edit_request.querySelector('select[name="performer"]').value;
    var estimated = functions.edit_request.querySelector('input[name="estimated"]').value;
    if (!script.validate(estimated, 4)) {
      functions.displayError('Ошибка!');
      return false;
    }

    var deadline = new Date(
            functions.edit_request.querySelector('.years').value,
            functions.edit_request.querySelector('.months').value,
            functions.edit_request.querySelector('.days').value,
            functions.edit_request.querySelector('input[name="hours"]').value,
            functions.edit_request.querySelector('input[name="minutes"]').value,
            functions.edit_request.querySelector('input[name="seconds"]').value
            ).toLocaleString('ru', exports.options);
    exports.request.performerId(performer);
    exports.request.estimated(estimated);
    exports.request.deadline(deadline);
  }
  var ready = functions.edit_request.querySelector('input[name="ready"]').value;
  if (!script.validate(ready, 4) || ready < 0 || ready > 100) {
    functions.displayError('Ошибка!');
    return false;
  }
  exports.request.ready(ready);
  script.saveObject(exports.request);
  exports.showRequestDetails(exports.request.id());
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
};
