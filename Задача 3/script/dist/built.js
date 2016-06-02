function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var VALIDATE_ARR = [
  /^[а-яА-ЯёЁa-zA-Z0-9\s.?"',:;%@!()]+$/, //простой текст
  /^[a-zA-Z][a-zA-Z0-9-_\.]{2,20}$/, //логин
  /^([a-zA-Z0-9_-]+\.)*[a-zA-Z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/, //email
  /^[a-zA-Z][a-zA-Z0-9-_\.]{6,20}$/, //пароль
  /^[1-9][0-9]+$/ //int
];

function validate(content, type) {
  if (type == 4)
    return isNumeric(content);
  var regexp = VALIDATE_ARR[type];
  return regexp.test(content);
}
/**
 * Конструктор пользователя системы управления заявками
 * @constructor
 * @returns {User}
 */
function User() {
  var id;
  var login;
  var password;
  var email;
  var type;
  var requestsId = [];
  var TYPE_ARR = ['Исполнитель', 'Клиент', 'Администратор'];
  this.attrs = ['name', 'id', 'login', 'password', 'email', 'type', 'requestsId'];

  this.name = function () {
    return this.constructor.name;
  };

  this.id = function (userId) {
    if (!arguments.length)
      return id;
    id = userId;
  };

  this.requestsId = function (value) {
    if (!arguments.length)
      return requestsId;
    requestsId = value;
  };

  this.login = function (userLogin) {
    if (!arguments.length)
      return login;

    if (validate(userLogin, 1))
      login = userLogin;
  };

  this.password = function (userPassword) {
    if (!arguments.length)
      return password;

    if (validate(userPassword, 3))
      password = userPassword;
  };

  this.email = function (userEmail) {
    if (!arguments.length)
      return email;

    if (validate(userEmail, 2))
      email = userEmail;
  };

  this.type = function (userType) {
    if (!arguments.length)
      return type;

    if (TYPE_ARR.indexOf(userType) != -1)
      type = userType;
  };

  this.addRequestId = function (id) {
    if (!arguments.length)
      return false;
    requestsId.push(id);
    return true;
  };

  this.getRequestId = function (index) {
    if (index >= requestsId.length)
      return null;
    return requestId[index];
  };
}

/**
 * Конструктор комментария
 * @constructor
 * @returns {Comment}
 */
function Comment() {
  var id;
  var userId;
  var text;
  var type;
  var date;
  var TYPE_ARR = ['Вопрос', 'Комментарий', 'Created', 'Edited', 'Closed'];
  this.attrs = ['name', 'id', 'userId', 'text', 'type', 'date'];

  this.name = function () {
    return this.constructor.name;
  };

  this.id = function (commentId) {
    if (!arguments.length)
      return id;
    id = commentId;
  };

  this.userId = function (value) {
    if (!arguments.length)
      return userId;

    userId = value;
  };

  this.text = function (commentText) {
    if (!arguments.length)
      return text;

    if (validate(commentText, 0))
      text = commentText;
  };

  this.type = function (commentType) {
    if (!arguments.length)
      return type;

    if (TYPE_ARR.indexOf(commentType) != -1)
      type = commentType;
  };

  this.date = function (commentDate) {
    if (!arguments.length)
      return date;

    date = commentDate;
  };
}

/**
 * Конструктор заявки
 * @constructor
 * @returns {Request}
 */
function Request() {
  var id;
  var customerId;
  var performerId;
  var description;
  var summary;
  var priority;
  var estimated;
  var created;
  var deadline;
  var commentsId = [];
  var ready;
  var PRIORITY_ARR = ['LOW', 'MEDIUM', 'HIGH'];
  this.attrs = ['name', 'id', 'customerId', 'performerId', 'description', 'summary', 'priority', 'estimated', 'deadline', 'commentsId', 'ready', 'created'];

  this.name = function () {
    return this.constructor.name;
  };

  this.id = function (requestId) {
    if (!arguments.length)
      return id;
    id = requestId;
  };

  this.customerId = function (value) {
    if (!arguments.length)
      return customerId;

    customerId = value;
  };

  this.performerId = function (value) {
    if (!arguments.length)
      return performerId;

    performerId = value;
  };

  this.commentsId = function (value) {
    if (!arguments.length)
      return commentsId;

    commentsId = value;
  };

  this.addCommentId = function (id) {
    if (!arguments.length)
      return false;
    commentsId.push(id);
    return true;
  };

  this.getCommentId = function (index) {
    if (index >= commentsId.length)
      return null;
    return commentsId[index];
  };

  this.description = function (requestDescription) {
    if (!arguments.length)
      return description;

    if (validate(requestDescription, 0))
      description = requestDescription;
  };

  this.summary = function (requestSummary) {
    if (!arguments.length)
      return summary;

    if (validate(requestSummary, 0))
      summary = requestSummary;
  };

  this.priority = function (requestPriority) {
    if (!arguments.length)
      return priority;

    if (PRIORITY_ARR.indexOf(requestPriority) != -1)
      priority = requestPriority;
  };

  this.estimated = function (requestEstimated) {
    if (!arguments.length)
      return estimated;

    if (isNumeric(requestEstimated) && requestEstimated >= 0)
      estimated = requestEstimated;
  };

  this.created = function (requestCreated) {
    if (!arguments.length)
      return created;

    created = requestCreated;
  };

  this.deadline = function (requestDeadline) {
    if (!arguments.length)
      return deadline;

    deadline = requestDeadline;
  };

  this.ready = function (requestReady) {
    if (!arguments.length)
      return ready;

    if (isNumeric(requestReady) && requestReady >= 0 && requestReady <= 100)
      ready = requestReady;
  };
}

Math.uuid = (function () {
  var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

  return function (len, radix) {
    var chars = CHARS, uuid = [], rnd = Math.random;
    radix = radix || chars.length;

    if (len) {
      for (var i = 0; i < len; i++)
        uuid[i] = chars[0 | rnd() * radix];
    } else {
      var r;

      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      for (var k = 0; k < 36; k++) {
        if (!uuid[k]) {
          r = 0 | rnd() * 16;
          uuid[k] = chars[(k == 19) ? (r & 0x3) | 0x8 : r & 0xf];
        }
      }
    }

    return uuid.join('');
  };
})();

if (typeof (Storage) !== 'undefined') {
  var getAttributes = function (object) {
    if (typeof (object) !== 'object')
      return null;
    var result = {};
    for (var i = 0; i < object.attrs.length; i++) {
      var attr = object.attrs[i];
      result[attr] = object[attr]();
    }
    return result;
  };

  var saveObject = function (object) {
    if (typeof (object) !== 'object')
      return null;
    var str = JSON.stringify(getAttributes(object));
    localStorage[object.id()] = str;
  };

  var getObject = function (id) {
    if (id in localStorage) {
      var object = JSON.parse(localStorage[id]);
      return init(object);
    }
    return null;
  };

  var init = function (object) {
    if (typeof (object) !== 'object')
      return null;
    var result = eval('new ' + object.name + '();');
    delete object.name;
    for (var i in object) {
      result[i](object[i]);
    }
    return result;
  };
} else {
  throw("Ошибка! У вас устаревший браузер!");
}

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

var authorisation;
var client_registration;
var create_comment;
var create_request;
var edit_request;
var list_request;
var performer_registration;
var select_performer;
var request_details;
var performer_creation;

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

/**
 * Функция создания исполнителя
 * @param {object} event - Объект события
 * @returns {undefined}
 */
function creation(event) {
  event = event || window.event;
  var login = performer_creation.querySelector('input[name="login"]').value;
  if (validate(login, 1) && !(login in localStorage)) {
    var performer = new User();
    performer.id(login);
    performer.login(login);
    performer.type('Исполнитель');
    saveObject(performer);
    hide();
    list_request.style.display = 'block';
  } else {
    displayError('Ошибка!');
  }
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }

}

/**
 * Функция регистрации исполнителя
 * @param {object} event - Объект события
 * @returns {undefined}
 */
function registration(event) {
  event = event || window.event;
  var login = performer_registration.querySelector('input[name="login"]').value;
  if (validate(login, 1) && !(login in localStorage)) {
    var performer = new User();
    performer.id(login);
    performer.login(login);
    performer.type('Исполнитель');
    saveObject(performer);
    hide();
    authorisation.style.display = 'block';
  } else {
    displayError('Ошибка!');
  }
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
}

/**
 * Функция регистрации клиента
 * @param {object} event - Объект события
 * @returns {undefined}
 */
function registration1(event) {
  event = event || window.event;
  var login = client_registration.querySelector('input[name="login"]').value;
  if (validate(login, 1) && !(login in localStorage)) {
    var customer = new User();
    customer.id(login);
    customer.login(login);
    customer.type('Клиент');
    saveObject(customer);
    hide();
    authorisation.style.display = 'block';
  } else {
    displayError('Ошибка!');
  }
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
}
/**
 * Функция отображения списка заявок
 * @param {object} event - Объект события
 * @returns {Boolean}
 */
function showRequests(event) {
  event = event || window.event;

  hide();
  list_request.style.display = 'block';
  if (user.type() !== 'Администратор') {
    document.getElementById('create-performer').style.display = 'none';
  } else {
    document.getElementById('create-performer').style.display = 'block';
  }
  var login = user.login();
  var span = document.getElementsByClassName('user');
  for (var i = 0; i < span.length; i++) {
    span[i].innerHTML = login;
  }

  if (user.type() == 'Исполнитель') {
    document.getElementById('create-request').style.display = 'none';
  } else {
    document.getElementById('create-request').style.display = 'block';
  }

  var requestsId = user.requestsId();
  var tr;
  var table = list_request.querySelector('table');
  removeElements(table, 'tr', 1);
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
  var trs = table.querySelectorAll('tr');
  if (trs[1].children.length !== 1) {
    for (var l = 1; l < trs.length; l++) {
      trs[l].temp = trs[l].firstElementChild.innerHTML;
      trs[l].addEventListener('click', selectRequest);
    }
  }
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
}

/**
 * Функция отображает детали заявки с идентификатором id
 * @param {number} id - Идентификатор заявки
 * @returns {undefined}
 */
function showRequestDetails(id) {
  hide();
  request_details.style.display = 'block';
  request = getObject(id);
  var login = user.login();
  var span = document.getElementsByClassName('user');
  for (var i = 0; i < span.length; i++) {
    span[i].innerHTML = login;
  }
  span = document.getElementById('request');
  span.innerHTML = request.id();

  if (user.type() === 'Клиент')
    document.getElementById('edit-request').style.display = 'none';
  else
    document.getElementById('edit-request').style.display = 'block';

  var table = request_details.querySelector('table');
  removeElements(table, 'tr', 1);
  tr = document.createElement('tr');
  createSimpleElement(tr, 'td',
          request.customerId(),
          request.performerId(),
          request.summary(),
          request.priority(),
          request.estimated(),
          request.created(),
          request.deadline(),
          request.ready() + '%'
          );
  table.appendChild(tr);

  var div = document.getElementById('description');
  div.innerHTML = request.description();

  var commentsId = request.commentsId();
  var comments = document.getElementById('comments');
  if (commentsId.length === 0)
    comments.innerHTML = '<h3>Комментариев еще нет.</h3>';
  else {
    comments.innerHTML = '<h3>Комментарии:</h3>';
    for (var k = 0; k < commentsId.length; k++) {
      var comment = getObject(commentsId[k]);
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
}

/**
 * Функция регистрации пользователя
 * @param {object} event - Объект события
 * @returns {Boolean}
 */
function auth(event) {
  event = event || window.event;
  var login = authorisation.querySelector('input[name="login"]');

  if (validate(login.value, 1)) {
    user = getObject(login.value);
    if (user !== null) {
      showRequests();
      return false;
    }
  }
  displayError("Ошибка!");
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
}

/**
 * Обработчик события выбора заявки
 * @param {object} event - Объект события
 * @returns {undefined}
 */
function selectRequest(event) {
  event = event || window.event;
  var target = event.target || event.srcElement;
  if (event.currentTarget.tagName === 'TR') {
    id = event.currentTarget.temp;
    event.stopPropagation();
    showRequestDetails(id);
  }
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
}

/**
 * Функция отображения формы создания заявки
 * @param {object} event
 * @returns {undefined}
 */
function createRequest(event) {
  event = event || window.event;
  hide();
  create_request.style.display = 'block';
  var performer = create_request.querySelector('select[name="performer"]');

  var performersId = [];
  for (var id in localStorage) {
    try {
      var object = getObject(id);
      if (object.login() !== undefined && object.type() == 'Исполнитель')
        performersId.push(id);
    } catch (err) {

    }
  }
  removeElements(performer, 'option', 0);
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
}

/**
 * Функция создания заявки
 * @param {object} event
 * @returns {Boolean}
 */
function recordRequest(event) {
  event = event || window.event;

  var created = new Date().toLocaleString('ru', options);
  var performer = create_request.querySelector('select[name="performer"]').value;
  var summary = create_request.querySelector('input[name="summary"]').value;
  var description = create_request.querySelector('textarea').value;
  var priority = create_request.querySelector('select[name="priority"]').value;
  var estimated = create_request.querySelector('input[name="estimated"]').value;

  if (!validate(estimated, 4) || summary.length === 0 || description.length === 0) {
    displayError('Ошибка!');
    return false;
  }

  var deadline = new Date(
          create_request.querySelector('.years').value,
          create_request.querySelector('.months').value,
          create_request.querySelector('.days').value,
          create_request.querySelector('input[name="hours"]').value,
          create_request.querySelector('input[name="minutes"]').value,
          create_request.querySelector('input[name="seconds"]').value
          ).toLocaleString('ru', options);

  var request = new Request();
  request.created(created);
  request.performerId(performer);
  request.customerId(user.id());
  request.summary(summary);
  request.description(description);
  request.priority(priority);
  request.estimated(estimated);
  request.deadline(deadline);
  request.ready(0);
  request.id(Math.uuid(20));
  saveObject(request);

  user = getObject(user.id());
  user.addRequestId(request.id());
  saveObject(user);

  var performerUser = getObject(performer);
  performerUser.addRequestId(request.id());
  saveObject(performerUser);

  var admin = getObject('admin');
  admin.addRequestId(request.id());
  saveObject(admin);

  showRequests(user);

  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
}

/**
 * Функция создания комментария
 * @param {object} event - Объект события
 * @returns {Boolean}
 */
function createComment(event) {
  event = event || window.event;
  var text = create_comment.querySelector('[name="text"]').value;
  var type = create_comment.querySelector('[name="type"]').value;
  var created = new Date().toLocaleString('ru', options);

  if (!validate(text, 0)) {
    displayError("Ошибка!");
    return false;
  }

  comment = new Comment();
  comment.id(Math.uuid(20));
  comment.type(type);
  comment.date(created);
  comment.userId(user.id());
  comment.text(text);
  saveObject(comment);

  request = getObject(request.id());
  request.addCommentId(comment.id());
  saveObject(request);

  showRequestDetails(request.id());
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
}

/**
 * Функция отображения болка редактирования заявки
 * @param {object} event - Объект события
 * @returns {undefined}
 */
function editRequest(event) {
  event = event || window.event;
  hide();
  edit_request.style.display = 'block';

  var elem = document.getElementById('administrator-edit');
  if (user.type() == 'Администратор') {
    elem.style.display = 'block';
    var performer = edit_request.querySelector('[name="performer"]');
    removeElements(performer, 'option', 0);
    var performersId = [];
    for (var id in localStorage) {
      try {
        var object = getObject(id);
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
}
/**
 * Функция редактирования заявки
 * @param {object} event - Объект события
 * @returns {Boolean}
 */
function submitRequest(event) {
  event = event || window.event;
  request = getObject(request.id());

  if (user.type() === 'Администратор') {
    var performer = edit_request.querySelector('select[name="performer"]').value;
    var estimated = edit_request.querySelector('input[name="estimated"]').value;
    if (!validate(estimated, 4)) {
      displayError('Ошибка!');
      return false;
    }

    var deadline = new Date(
            edit_request.querySelector('.years').value,
            edit_request.querySelector('.months').value,
            edit_request.querySelector('.days').value,
            edit_request.querySelector('input[name="hours"]').value,
            edit_request.querySelector('input[name="minutes"]').value,
            edit_request.querySelector('input[name="seconds"]').value
            ).toLocaleString('ru', options);
    request.performerId(performer);
    request.estimated(estimated);
    request.deadline(deadline);
  }
  var ready = edit_request.querySelector('input[name="ready"]').value;
  if (!validate(ready, 4) || ready < 0 || ready > 100) {
    displayError('Ошибка!');
    return false;
  }
  request.ready(ready);
  saveObject(request);
  showRequestDetails(request.id());
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
}

var ready = function () {
  injectSelect(document.getElementsByClassName("months"), ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']);
  injectSelect(document.getElementsByClassName("years"), makeNumbersObject(2000, 2016));
  injectSelect(document.getElementsByClassName("days"), makeNumbersObject(1, 31));

  authorisation = document.getElementById('authorisation');
  client_registration = document.getElementById('client_registration');
  create_comment = document.getElementById('create_comment');
  create_request = document.getElementById('create_request');
  edit_request = document.getElementById('edit_request');
  list_request = document.getElementById('list_request');
  performer_registration = document.getElementById('performer_registration');
  select_performer = document.getElementById('select_performer');
  request_details = document.getElementById('request_details');
  performer_creation = document.getElementById('performer_creation');


  hide();
  authorisation.style.display = 'block';

  var admin = getObject('admin');
  if (admin === null) {
    admin = new User();
    admin.id('admin');
    admin.login('admin');
    admin.type('Администратор');
    saveObject(admin);
  }

  authorisation.getElementsByTagName('form')[0].addEventListener('submit', auth);

  document.getElementById("reg-performer").addEventListener('click', function () {
    hide();
    performer_registration.style.display = 'block';

    document.querySelector('#performer_registration input[type="submit"]').addEventListener('click', registration);
  });

  document.getElementById("reg-customer").addEventListener('click', function () {
    hide();
    client_registration.style.display = 'block';

    document.querySelector('#client_registration input[type="submit"]').addEventListener('click', registration1);
  });

  document.getElementById('create-request').addEventListener('click', createRequest);
  create_request.querySelector('input[type="submit"]').addEventListener('click', recordRequest);

  document.getElementById('list-requests').addEventListener('click', showRequests);

  document.getElementById('add-comment').addEventListener('click', function () {
    hide();
    create_comment.style.display = 'block';
    var elems = document.getElementsByClassName('not-performer');
    var value;
    if (user.type() === 'Исполнитель')
      value = 'none'
    else
      value = 'auto';

    for (var k = 0; k < elems.length; ++k) {
      elems[k].style.display = value;
    }
    create_comment.querySelector('form').addEventListener('submit', createComment);
  });

  document.getElementById('edit-request').addEventListener('click', editRequest);
  edit_request.querySelector('form').addEventListener('submit', submitRequest);
  document.getElementById('back-authorisation').addEventListener('click', function () {
    hide();
    authorisation.style.display = 'block';
    return false;
  });
  document.getElementById('create-performer').addEventListener('click', function () {
    hide();
    performer_creation.style.display = 'block';
    performer_creation.querySelector('form').addEventListener('submit', creation);
    return false;
  });
};

document.addEventListener("DOMContentLoaded", ready);
