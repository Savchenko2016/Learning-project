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
