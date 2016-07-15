var exports = module.exports = {};

var script = require('./script.js');
var functions = require('./functions.js');

exports.user = null;
exports.request = null;
exports.comment = null;

var customer = null;
var status = null;
var summary = null;
var list = null;

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
exports.creation = function(e) {
  var login = functions.performer_creation.find('input[name="login"]').prop('value');
  if (script.validate(login, 1) && !(login in localStorage)) {
    var performer = new script.User();
    performer.id(login);
    performer.login(login);
    performer.type('Исполнитель');
    script.saveObject(performer);
    functions.hide();
    functions.list_request.css('display', 'block');
  } else {
    functions.displayError('Ошибка!');
  }
  e.preventDefault();
};

/**
 * Функция регистрации исполнителя
 * @param {object} event - Объект события
 * @returns {undefined}
 */
exports.registration = function(e) {
  var login = functions.performer_registration.find('input[name="login"]').prop('value');
  if (script.validate(login, 1) && !(login in localStorage)) {
    var performer = new script.User();
    performer.id(login);
    performer.login(login);
    performer.type('Исполнитель');
    script.saveObject(performer);
    functions.hide();
    functions.authorisation.css('display', 'block');
  } else {
    functions.displayError('Ошибка!');
  }
  e.preventDefault();
};

/**
 * Функция регистрации клиента
 * @param {object} event - Объект события
 * @returns {undefined}
 */
exports.registration1 = function(e) {
  var login = functions.client_registration.find('input[name="login"]').prop('value');
  if (script.validate(login, 1) && !(login in localStorage)) {
    var customer = new script.User();
    customer.id(login);
    customer.login(login);
    customer.type('Клиент');
    script.saveObject(customer);
    functions.hide();
    functions.authorisation.css('display', 'block');
  } else {
    functions.displayError('Ошибка!');
  }
  e.preventDefault();
};

exports.delegateEventsTable = function(table) {
  table.find('th').unbind();
  table.find('tr').unbind();
  
  table.find('tr').each(function(index, elem) {
    var elem1 = $(elem);
    if (index === 0) {
      elem1.children().click(exports.sortRequests1);
      return;
    }
    elem1.prop('temp', elem1.children(':first').text());
    elem1.click(exports.selectRequest);
  });
}

/**
 * Функция сортировки и вывода списка заявок
 * @param {object} table - объект таблицы списка заявок
 * @param {number} id - id пользовтаеля
 * @param {string} field - название совйства объекта заявки, по которому производится сортировка таблицы
 * @param {object} object - объект фильтрации списка заявок
 * @returns {undefined}
 */
exports.sortRequests = function(table, id, field, object) {
  if (object === undefined || typeof(object) !== 'object') 
    object = {}; 
  list = script.getRequests(id, field, object);

  functions.removeElements(table, 'tr', 1);
  if (list.length === 0) {
    tr = $('<tr><td colspan="8">Нет заявок</td></tr>');
    table.append(tr);
    return;
  }
  var tmpl = require('./table_list.ejs');
  var tr = tmpl({items: list});
  table.append(tr);
};

/**
 * Обработчик события клика на th элементах таблицы
 * @param {object} e - Объект события
 * @returns {undefined}
 */
exports.sortRequests1 = function(e) {
  if (e.currentTarget.tagName === 'TH') {
    e.stopPropagation();
    var field = e.currentTarget.getAttribute('temp');
    var table = functions.list_request.find('table');
    exports.sortRequests(table, exports.user.id(), field);
    exports.delegateEventsTable(table);
  }
};

/**
 * Функция отображения списка заявок
 * @returns {undefined}
 */
exports.showRequests = function() {
  var i;
  functions.hide();
  functions.list_request.css('display', 'block');
  if (exports.user.type() !== 'Администратор') {
    $('#create-performer').css('display', 'none');
  } else {
    $('#create-performer').css('display', 'block');
  }
  var login = exports.user.login();
  $('.user').text(login);

  if (exports.user.type() == 'Исполнитель') {
    $('#create-request').css('display', 'none');
  } else {
    $('#create-request').css('display', 'block');
  }
  
  if (exports.user.type() == 'Клиент') {
    $('#filter-customer').css('display', 'none');
  } else {
    $('#filter-customer').css('display', 'inline-block');
  
    var customer = functions.list_request.find('select[name="customer"]');

    var customersId = [];
    for (var id in localStorage) {
      try {
	var object = script.getObject(id);
	if (object.login() !== undefined && object.type() == 'Клиент')
	  customersId.push(id);
      } catch (err) {

      }
    }
    functions.removeElements(customer, 'option', 1);
    var tmpl = require('./options.ejs');
    var options = tmpl({items: customersId});
    customer.append(options);
  }
  
  var table = functions.list_request.find('table');
  exports.sortRequests(table, exports.user.id(), 'created');
  exports.delegateEventsTable(table);
};

/**
 * Функция отображает детали заявки с идентификатором id
 * @param {number} id - Идентификатор заявки
 * @returns {undefined}
 */
exports.showRequestDetails = function(id) {
  functions.hide();
  functions.request_details.css('display', 'block');
  exports.request = script.getObject(id);
  var login = exports.user.login();
  $('.user').text(login);
  $('#request').text(exports.request.id());

  if (exports.user.type() === 'Клиент')
    $('#edit-request').css('display', 'none');
  else
    $('#edit-request').css('display', 'block');

  var table = functions.request_details.find('table');
  functions.removeElements(table, 'tr', 1);
  tr = $('<tr></tr>');
  functions.createSimpleElement(tr, 'td',
          exports.request.customerId(),
          exports.request.performerId(),
          exports.request.summary(),
          exports.request.priority(),
          exports.request.estimated(),
          exports.request.created(),
          exports.request.deadline(),
          exports.request.ready() + '%',
	  exports.request.status()
          );
  table.append(tr);

  $('#description').text(exports.request.description());

  var commentsId = exports.request.commentsId();
  var comments = $('#comments');
  comments.html('');
  if (commentsId.length === 0)
    comments.html('<h3>Комментариев еще нет.</h3>');
  else {
    var items = [];
    for (var k = 0; k < commentsId.length; k++) {
      var comment = script.getObject(commentsId[k]);
      items.push(comment);
    }
    var tmpl = require('./comments.ejs');
    var elem = tmpl({items: items});
    comments.append(elem);
  }
};

/**
 * Функция регистрации пользователя
 * @param {object} event - Объект события
 * @returns {Boolean}
 */
exports.auth = function(e) {
  var login = functions.authorisation.find('input[name="login"]').prop('value');

  if (script.validate(login.value, 1)) {
    exports.user = script.getObject(login);
    if (exports.user !== null) {
      exports.showRequests();
      return false;
    }
  }
  functions.displayError("Ошибка!");
  e.preventDefault();
};

/**
 * Обработчик события выбора заявки
 * @param {object} event - Объект события
 * @returns {undefined}
 */
exports.selectRequest = function(e) {
  if (e.currentTarget.tagName === 'TR') {
    id = e.currentTarget.temp;
    e.stopPropagation();
    exports.showRequestDetails(id);
  }
  e.preventDefault();
};

/**
 * Функция отображения формы создания заявки
 * @param {object} event
 * @returns {undefined}
 */
exports.createRequest = function(e) {
  functions.hide();
  functions.create_request.css('display', 'block');
  var performer = functions.create_request.find('select[name="performer"]');

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
  var tmpl = require('./options.ejs');
  var options = tmpl({items: performersId});
  performer.append(options);
  e.preventDefault();
};

/**
 * Функция создания заявки
 * @param {object} event
 * @returns {Boolean}
 */
exports.recordRequest = function(e) {
  var created = new Date().toLocaleString('ru', exports.options);
  var performer = functions.create_request.find('select[name="performer"]').prop('value');
  var summary = functions.create_request.find('input[name="summary"]').prop('value');
  var description = functions.create_request.find('textarea').prop('value');
  var priority = functions.create_request.find('select[name="priority"]').prop('value');
  var estimated = functions.create_request.find('input[name="estimated"]').prop('value');
  var status = 'Открыто';

  if (!script.validate(estimated, 4) || summary.length === 0 || description.length === 0) {
    functions.displayError('Ошибка!');
    return false;
  }

  var deadline = new Date(
          functions.create_request.find('.years').prop('value'),
          functions.create_request.find('.months').prop('value'),
          functions.create_request.find('.days').prop('value'),
          functions.create_request.find('input[name="hours"]').prop('value'),
          functions.create_request.find('input[name="minutes"]').prop('value'),
          functions.create_request.find('input[name="seconds"]').prop('value')
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
  request.status(status);
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
  e.preventDefault();
};

/**
 * Функция создания комментария
 * @param {object} event - Объект события
 * @returns {Boolean}
 */
exports.createComment = function(e) {
  var text = functions.create_comment.find('[name="text"]').prop('value');
  var type = functions.create_comment.find('[name="type"]').prop('value');
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
  return false;
};

/**
 * Функция отображения болка редактирования заявки
 * @param {object} event - Объект события
 * @returns {undefined}
 */
exports.editRequest = function(e) {
  functions.hide();
  functions.edit_request.css('display', 'block');

  var elem = $('#administrator-edit');
  if (exports.user.type() == 'Администратор') {
    elem.css('display', 'block');
    var performer = functions.edit_request.find('[name="performer"]');
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

    var tmpl = require('./options.ejs');
    var options = tmpl({items: performersId});
    performer.append(options);
  } else {
    elem.css('display', 'none');
  }
  e.preventDefault();
};
/**
 * Функция редактирования заявки
 * @param {object} event - Объект события
 * @returns {Boolean}
 */
exports.submitRequest = function(e) {
  exports.request = script.getObject(exports.request.id());
  var performerOld = exports.request.performerId();
  if (exports.user.type() === 'Администратор') {
    var performer = functions.edit_request.find('select[name="performer"]').prop('value');
    var estimated = functions.edit_request.find('input[name="estimated"]').prop('value');
    var status = functions.edit_request.find('select[name="status"]').prop('value');
    if (!script.validate(estimated, 4)) {
      functions.displayError('Ошибка!');
      return false;
    }

    var deadline = new Date(
            functions.edit_request.find('.years').prop('value'),
            functions.edit_request.find('.months').prop('value'),
            functions.edit_request.find('.days').prop('value'),
            functions.edit_request.find('input[name="hours"]').prop('value'),
            functions.edit_request.find('input[name="minutes"]').prop('value'),
            functions.edit_request.find('input[name="seconds"]').prop('value')
            ).toLocaleString('ru', exports.options);
    exports.request.performerId(performer);
    exports.request.estimated(estimated);
    exports.request.deadline(deadline);
  }
  var ready = functions.edit_request.find('input[name="ready"]').prop('value');
  var status = functions.edit_request.find('select[name="status"]').prop('value');
  if (!script.validate(ready, 4) || ready < 0 || ready > 100) {
    functions.displayError('Ошибка!');
    exports.request = script.getObject(exports.request.id());
    return false;
  }
  exports.request.ready(ready);
  exports.request.status(status);
  script.saveObject(exports.request);
  exports.showRequestDetails(exports.request.id());
  
  var user = script.getObject(performer);
  user.addRequestId(exports.request.id());
  script.saveObject(user);
  
  user = script.getObject(performerOld);
  user.removeRequestId(exports.request.id());
  script.saveObject(user);
  
  e.preventDefault();
};
/**
 * Функция вывода списка заявок, отфильтрованных по клиентам
 * @returns {undefined}
 */
exports.filterCustomer = function() {
  customer = $(this).prop('value');
  customer = customer === 'Любой' ? null : customer;
  var table = functions.list_request.find('table');
  exports.sortRequests(table, exports.user.id(), 'created', {customerId: customer, status: status});
  exports.delegateEventsTable(table);
};

/**
 * Функция вывода списка заявок, отфильтрованных по статусу
 * @returns {undefined}
 */
exports.filterStatus = function() {
  status = $(this).prop('value');
  status = status === 'Любой' ? null : status;
  var table = functions.list_request.find('table');
  exports.sortRequests(table, exports.user.id(), 'created', {customerId: customer, status: status});
  exports.delegateEventsTable(table);
};

/**
 * Функция вывода списка заявок, отфильтрованных по названию
 * @returns {undefined}
 */
exports.filterSummary = function() {
  summary = $(this).find('input:first').prop('value');
  if (script.validate(summary, 0)) {
    var table = functions.list_request.find('table');
    exports.sortRequests(table, exports.user.id(), 'created', {summary: summary});
    exports.delegateEventsTable(table);
  }
  else {
    functions.displayError('Ошибка!');
  }
  return false;
};