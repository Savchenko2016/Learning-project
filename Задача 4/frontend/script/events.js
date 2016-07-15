var exports = module.exports = {};

var script = require('./script.js');
var functions = require('./functions.js');

let _ = require('lodash');
let $ = require('jquery');

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
 * Функция отображения формы авторизации
 * @returns {undefined}
 */
exports.showAuthoristation = function() {
  functions.hide();
  var tmpl = require('./../template/authorisation.ejs');
  var div = tmpl({});
  $(document.body).append(div);
  
  $('#reg-performer').one('click', function () {
    functions.hide();
    var tmpl = require('./../template/performer_registration.ejs');
    var div = tmpl({});
    $(document.body).append(div);
    $(document.body).find('form').submit(exports.registration);
  });
  
  $('#reg-customer').one('click', function () {
    functions.hide();
    var tmpl = require('./../template/client_registration.ejs');
    var div = tmpl({});
    $(document.body).append(div);
    $(document.body).find('form').submit(exports.registration1);
  });
  
  $(document.body).find('form').submit(exports.auth);
}

/**
 * Функция создания исполнителя
 * @param {object} event - Объект события
 * @returns {undefined}
 */
exports.creation = function(e) {
  var login = $(document.body).find('input[name="login"]').prop('value');
  if (script.validate(login, 1) && !(login in localStorage)) {
    var performer = new script.User();
    performer.id(login);
    performer.login(login);
    performer.type('Исполнитель');
    script.saveObject(performer);
    exports.showRequests();
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
  var login = $(document.body).find('input[name="login"]').prop('value');
  if (script.validate(login, 1) && !(login in localStorage)) {
    var performer = new script.User();
    performer.id(login);
    performer.login(login);
    performer.type('Исполнитель');
    script.saveObject(performer);
    exports.showAuthoristation();
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
  var login = $(document.body).find('input[name="login"]').prop('value');
  if (script.validate(login, 1) && !(login in localStorage)) {
    var customer = new script.User();
    customer.id(login);
    customer.login(login);
    customer.type('Клиент');
    script.saveObject(customer);
    exports.showAuthoristation();
  } else {
    functions.displayError('Ошибка!');
  }
  e.preventDefault();
};

/**
 * Функция назначения элементам таблицы списка заявок обработчиков
 * @param {object} table - Объект таблицы
 * @returns {undefined}
 */
exports.delegateEventsTable = function(table) {
  table.find('tr').each(function(index, elem) {
    var elem1 = $(elem);
    if (index === 0) {
      elem1.children().one('click', exports.sortRequests);
      return;
    }
    elem1.prop('temp', elem1.children(':first').text());
    elem1.one('click', exports.selectRequest);
  });
}

/**
 * Обработчик события клика на th элементах таблицы
 * @param {object} e - Объект события
 * @returns {undefined}
 */
exports.sortRequests = function(e) {
  if (e.currentTarget.tagName === 'TH') {
    e.stopPropagation();
    var field = e.currentTarget.getAttribute('temp');
    exports.filterRequests(field);
  }
};

/**
 * Функция вывода на экран таблицы списка заявок с фильтрацией заявок
 * @param {string} field - Строка сортировки
 * @param {object} object - Объект фильтрации
 * @returns {undefined}
 */
exports.filterRequests = function(field, object) {
  if (field === undefined) field = 'created';
  if (object === undefined) object = {};
  
  list = script.getRequests(exports.user.id(), field, object);
  
  var tmpl = require('./../template/table_list.ejs');
  var div = tmpl({
    items: list
  });
  $('table').replaceWith(div);
  
  exports.delegateEventsTable($(document.body).find('table'));
}

/**
 * Функция отображения списка заявок
 * @returns {undefined}
 */
exports.showRequests = function() {
  functions.hide();
  
  var customersId = [];
  for (var id in localStorage) {
    try {
      var object = script.getObject(id);
      if (object.login() !== undefined && object.type() == 'Клиент')
	customersId.push(id);
    } catch (err) {

    }
  }
  
  var tmpl = require('./../template/list_request.ejs');
  var div = tmpl({
    f1: exports.user.type() !== 'Исполнитель',
    f2: exports.user.type() !== 'Клиент',
    f3: exports.user.type() == 'Администратор',
    login: exports.user.login(),
    customers: customersId
  });
  $(document.body).append(div);
  
  exports.filterRequests();
  
  var create_request = $('#create-request');
  if (create_request.length !== 0) {
    create_request.one('click', exports.createRequest);
  }
  
  var back_authorisation = $('#back-authorisation');
  if (back_authorisation.length !== 0) {
    back_authorisation.one('click', function () {
      exports.showAuthoristation();
      return false;
    });
  }
  
  var create_performer = $('#create-performer');
  if (create_performer.length !== 0) {
    create_performer.one('click', function () {
      functions.hide();
      var tmpl = require('./../template/performer_creation.ejs');
      var div = tmpl({});
      $(document.body).append(div);
      
      $(document.body).find('form').submit(exports.creation);
      return false;
    });
  }
  
  $(document.body).find('select[name="customer"]').change(exports.filterCustomer);
  $(document.body).find('select[name="status"]').change(exports.filterStatus);
  $(document.body).find('.search form').submit(exports.filterSummary);
};

/**
 * Функция отображает деталей заявки с идентификатором id
 * @param {number} id - Идентификатор заявки
 * @returns {undefined}
 */
exports.showRequestDetails = function(id) {
  functions.hide();
  
  exports.request = script.getObject(id);
  
  var commentsId = exports.request.commentsId();
  var items = [];
  for (var k = 0; k < commentsId.length; k++) {
    var comment = script.getObject(commentsId[k]);
    items.push(comment);
  }
  
  var tmpl = require('./../template/request_details.ejs');
  var div = tmpl({
    id: exports.request.id(),
    f: exports.user.type() === 'Клиент',
    login: exports.user.login(),
    description: exports.request.description(),
    items: items,
    table: [
      exports.request.customerId(),
      exports.request.performerId(),
      exports.request.summary(),
      exports.request.priority(),
      exports.request.estimated(),
      exports.request.created(),
      exports.request.deadline(),
      exports.request.ready() + '%',
      exports.request.status()
    ]
  });
  $(document.body).append(div);
  
  $('#list-requests').one('click', function() { exports.showRequests() });
  
  $('#add-comment').one('click', function () {
    functions.hide();
    var tmpl = require('./../template/create_comment.ejs');
    var div = tmpl({f: exports.user.type() !== 'Исполнитель'});
    $(document.body).append(div);
    
    $(document.body).find('form').submit(exports.createComment);
    return false;
  });

  var edit_request = $('#edit-request');
  if (edit_request.length !== 0) {
    edit_request.one('click', exports.editRequest);
  }
};

/**
 * Функция авторизации пользователя
 * @param {object} event - Объект события
 * @returns {Boolean}
 */
exports.auth = function(e) {
  var login = $(document.body).find('input[name="login"]').prop('value');

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
    e.preventDefault();
  }
};

/**
 * Функция отображения формы создания заявки
 * @param {object} event
 * @returns {undefined}
 */
exports.createRequest = function(e) {
  functions.hide();
  
  var performersId = [];
  for (var id in localStorage) {
    try {
      var object = script.getObject(id);
      if (object.login() !== undefined && object.type() == 'Исполнитель')
        performersId.push(id);
    } catch (err) {

    }
  }
  
  var tmpl = require('./../template/create_request.ejs');
  var div = tmpl({
    performers: performersId, 
    months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    days: functions.makeNumbersObject(1, 31),
    years: functions.makeNumbersObject(2000, 2016)
  });
  $(document.body).append(div);
  
  $(document.body).find('form').submit(exports.recordRequest);

  e.preventDefault();
};

/**
 * Функция создания заявки
 * @param {object} event
 * @returns {Boolean}
 */
exports.recordRequest = function(e) {
  var created = new Date().toLocaleString('ru', exports.options);
  var performer = $(document.body).find('select[name="performer"]').prop('value');
  var summary = $(document.body).find('input[name="summary"]').prop('value');
  var description = $(document.body).find('textarea').prop('value');
  var priority = $(document.body).find('select[name="priority"]').prop('value');
  var estimated = $(document.body).find('input[name="estimated"]').prop('value');
  var status = 'Открыто';

  if (!script.validate(estimated, 4) || summary.length === 0 || description.length === 0) {
    functions.displayError('Ошибка!');
    return false;
  }

  var deadline = new Date(
    $(document.body).find('.years').prop('value'),
    functions.months.indexOf($(document.body).find('.months').prop('value')),
    $(document.body).find('.days').prop('value'),
    $(document.body).find('input[name="hours"]').prop('value'),
    $(document.body).find('input[name="minutes"]').prop('value'),
    $(document.body).find('input[name="seconds"]').prop('value')
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

  exports.showRequests();
  e.preventDefault();
};

/**
 * Функция создания комментария
 * @param {object} event - Объект события
 * @returns {Boolean}
 */
exports.createComment = function(e) {
  var text = $(document.body).find('[name="text"]').prop('value');
  var type = $(document.body).find('[name="type"]').prop('value');
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
  
  var performersId = [];
  for (var id in localStorage) {
    try {
      var object = script.getObject(id);
      if (object.login() !== undefined && object.type() == 'Исполнитель')
        performersId.push(id);
    } catch (err) {
      
    }
  }
  
  var tmpl = require('./../template/edit_request.ejs');
  var div = tmpl({
    f: exports.user.type() == 'Администратор',
    items: performersId
  });
  
  $(document.body).append(div);
  $(document.body).find('form').submit(exports.submitRequest);
  
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
    var performer = $(document.body).find('select[name="performer"]').prop('value');
    var estimated = $(document.body).find('input[name="estimated"]').prop('value');
    var status = $(document.body).find('select[name="status"]').prop('value');
    if (!script.validate(estimated, 4)) {
      functions.displayError('Ошибка!');
      return false;
    }

    var deadline = new Date(
      $(document.body).find('.years').prop('value'),
      $(document.body).find('.months').prop('value'),
      $(document.body).find('.days').prop('value'),
      $(document.body).find('input[name="hours"]').prop('value'),
      $(document.body).find('input[name="minutes"]').prop('value'),
      $(document.body).find('input[name="seconds"]').prop('value')
    ).toLocaleString('ru', exports.options);
    exports.request.performerId(performer);
    exports.request.estimated(estimated);
    exports.request.deadline(deadline);
  }
  var ready = $(document.body).find('input[name="ready"]').prop('value');
  var status = $(document.body).find('select[name="status"]').prop('value');
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
  exports.filterRequests('created', {customerId: customer, status: status});
};

/**
 * Функция вывода списка заявок, отфильтрованных по статусу
 * @returns {undefined}
 */
exports.filterStatus = function() {
  status = $(this).prop('value');
  status = status === 'Любой' ? null : status;
  exports.filterRequests('created', {customerId: customer, status: status});
};

/**
 * Функция вывода списка заявок, отфильтрованных по названию
 * @returns {undefined}
 */
exports.filterSummary = function() {
  summary = $(this).find('input:first').prop('value');
  if (script.validate(summary, 0)) {
    exports.filterRequests('created', {summary: summary});
  }
  else {
    functions.displayError('Ошибка!');
  }
  return false;
};