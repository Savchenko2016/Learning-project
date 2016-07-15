var exports = module.exports = {};

var script = require('./script.js');
var functions = require('./functions.js');

let _ = require('lodash');
let $ = require('jquery');

exports.user = null;
exports.request = null;
exports.comment = null;

var filter = {};
var list = null;
var accessToken = null;
var count = 0;
var offset = 0;

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
  var object = {};
  object.username = $(document.body).find('input[name="login"]').prop('value');
  object.password = $(document.body).find('input[name="password"]').prop('value');
  object.email = $(document.body).find('input[name="email"]').prop('value');
  object.role = 'performer';
  
  $.ajax({
    url: '/registration',
    type: 'post',
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(object),
    success: function(data, status, jqxhr) {
      exports.showRequests();
    },
    error: function(jqxhr, status, errorMsg) {
      functions.displayError("Ошибка!");
    }
  });
  return false;
};

/**
 * Функция регистрации исполнителя
 * @param {object} event - Объект события
 * @returns {undefined}
 */
exports.registration = function(e) {
  var object = {};
  object.username = $(document.body).find('input[name="login"]').prop('value');
  object.password = $(document.body).find('input[name="password"]').prop('value');
  object.email = $(document.body).find('input[name="email"]').prop('value');
  object.role = 'performer';
  $.ajax({
    url: '/registration',
    type: 'post',
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(object),
    success: function(data, status, jqxhr) {
      exports.showAuthoristation();
    },
    error: function(jqxhr, status, errorMsg) {
      functions.displayError("Ошибка!");
    }
  });
  return false;
};

/**
 * Функция регистрации клиента
 * @param {object} event - Объект события
 * @returns {undefined}
 */
exports.registration1 = function(e) {
  var object = {};
  object.username = $(document.body).find('input[name="login"]').prop('value');
  object.password = $(document.body).find('input[name="password"]').prop('value');
  object.email = $(document.body).find('input[name="email"]').prop('value');
  object.role = 'customer';
  $.ajax({
    url: '/registration',
    type: 'post',
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(object),
    success: function(data, status, jqxhr) {
      exports.showAuthoristation();
    },
    error: function(jqxhr, status, errorMsg) {
      functions.displayError("Ошибка!");
    }
  });
  return false;
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

  var settings = {};
  settings.object = object;
  settings.f = exports.user.type() == 'admin';
  var pager = false;

  var render = function(jqxhr, status) {
    settings.property = field;

    $.ajax({
      url: '/users/' + exports.user.id() + '/requests/' + offset,
      type: 'post',
      contentType: 'application/json; charset=UTF-8',
      dataType: 'json',
      data: JSON.stringify(settings),
      success: function(data, status, jqxhr) {
        var list = data;
        for (var i = 0; i < list.length; ++i) {
          list[i].deadline = new Date(list[i].deadline).toLocaleString('ru', exports.options);
          list[i].created = new Date(list[i].created).toLocaleString('ru', exports.options);    
          list[i].customerId = list[i].users1.username;
          list[i].performerId = list[i].users2.username; 
        }
        var tmpl = require('./../template/table_list.ejs');
        var div = tmpl({
          items: list,
          pager: pager,
          count: count
        });
        $('.table-pager').replaceWith(div);
        exports.delegateEventsTable($(document.body).find('table'));
        
        var index1 = (offset / 10) + 1;

        $('.pager li').each(function(index, elem) {
          if (index + 1 == index1)
            $(elem).addClass('active');
        });
        $('.pager li:not(.active)').one('click', function() {
          offset = 10 * ($(this).text() - 1);
          exports.filterRequests(field, object);
        });
      },
      error: function(jqxhr, status, errorMsg) {
        functions.displayError("Ошибка!");
      }
    });
  };

  $.ajax({
    url: '/users/'+ exports.user.id() + '/request/count',
    type: 'post',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(settings),
    success: [function(data, status, jqxhr) {
      count = parseInt(data.count / 10) + (data.count % 10 == 0 ? 0 : 1);
      if (count == 1) {
        pager = false;
        count = 0;
      }
      else
        pager = true;
    }, render],
    error: [function(jqxhr, status, errorMsg) {
      pager = false;
      count = 0;
    }, render]
  });
}

/**
 * Функция отображения списка заявок
 * @returns {undefined}
 */
exports.showRequests = function() {
  functions.hide();
  var customersId = [];
  offset = 0;
  
  var render = function(jqxhr, status) {
    var tmpl = require('./../template/list_request.ejs');
    var div = tmpl({
      f1: exports.user.type() !== 'performer',
      f2: exports.user.type() !== 'customer',
      f3: exports.user.type() == 'admin',
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
        $.ajax({
          url: '/logout',
          type: 'post',
          contentType: 'application/json; charset=UTF-8',
          data: JSON.stringify({
            accessToken: accessToken,
          }),
          success: function(data, status, jqxhr) {
            exports.showAuthoristation();
          },
          error: function(jqxhr, status, errorMsg) {
            functions.displayError("Ошибка!");
          }
        });        
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

  $.ajax({
    url: '/users/customer',
    type: 'post',
    contentType: 'application/json; charset=UTF-8',
    dataType: 'json',
    success: [function(data, status, jqxhr) {
    	customersId = data;
    }, render],
    error: [function(jqxhr, status, errorMsg) {
      functions.displayError("Ошибка!");
    }, render]
  });
};

/**
 * Функция отображает деталей заявки с идентификатором id
 * @param {number} id - Идентификатор заявки
 * @returns {undefined}
 */
exports.showRequestDetails = function(id) {
  functions.hide();
  
  $.ajax({
    url: '/requests/' + id,
    type: 'post',
    contentType: 'application/json; charset=UTF-8',
    dataType: 'json',
    success: function(data, status, jqxhr) {
      var request = data;
      var items = [];
      exports.request = script.init(request, 'Request');
      exports.request.customerId(request.users1.username);
      exports.request.performerId(request.users2.username);
      
      for (var i = 0; i < request.comments.length; ++i) {
        request.comments[i].date = new Date(request.comments[i].date).toLocaleString('ru', exports.options);
        request.comments[i].userId = request.comments[i].users.username;
        items.push(request.comments[i]);
      }

      var tmpl = require('./../template/request_details.ejs');
      var div = tmpl({
        id: exports.request.id(),
        f: exports.user.type() != 'customer',
        login: exports.user.login(),
        description: exports.request.description(),
        items: items,
        table: [
          exports.request.customerId(),
          exports.request.performerId(),
          exports.request.summary(),
          exports.request.priority(),
          exports.request.estimated(),
          new Date(exports.request.created()).toLocaleString('ru', exports.options),
          new Date(exports.request.deadline()).toLocaleString('ru', exports.options),
          exports.request.ready() + '%',
          exports.request.status()
        ]
      });
      $(document.body).append(div);
      
      $('#list-requests').one('click', function() { exports.showRequests() });
      
      $('#add-comment').one('click', function () {
        functions.hide();
        var tmpl = require('./../template/create_comment.ejs');
        var div = tmpl({f: exports.user.type() !== 'performer'});
        $(document.body).append(div);
        
        $(document.body).find('form').submit(exports.createComment);
        return false;
      });

      var edit_request = $('#edit-request');
      if (edit_request.length !== 0) {
        edit_request.one('click', exports.editRequest);
      }
    },
    error: function(jqxhr, status, errorMsg) {
      functions.displayError("Ошибка!");
    }
  });
};

/**
 * Функция авторизации пользователя
 * @param {object} event - Объект события
 * @returns {Boolean}
 */
exports.auth = function(e) {
  var object = {};
  object.password = $(document.body).find('input[name="password"]').prop('value');
  object.email = $(document.body).find('input[name="email"]').prop('value');
  
  $.ajax({
    url: '/login1',
    type: 'post',
    dataType: 'json',
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(object),
    success: function(data, status, jqxhr) {
      exports.user = new script.User();
      exports.user.id(data.id);
      exports.user.login(data.username);
      exports.user.type(data.role);
      accessToken = data.accessToken;
      exports.showRequests();
    },
    error: function(jqxhr, status, errorMsg) {
      functions.displayError("Ошибка!");
    }
  });
  return false;
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
  
  var render = function(jqxhr, status) {
    var tmpl = require('./../template/create_request.ejs');
    var div = tmpl({
      performers: performersId, 
      months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      days: functions.makeNumbersObject(1, 31),
      years: functions.makeNumbersObject(2000, 2016)
    });
    $(document.body).append(div);
    $(document.body).find('form').submit(exports.recordRequest);
  };

  $.ajax({
    url: '/users/performer',
    type: 'post',
    contentType: 'application/json; charset=UTF-8',
    dataType: 'json',
    success: [function(data, status, jqxhr) {
      performersId = data;
    }, render],
    error: [function(jqxhr, status, errorMsg) {
      functions.displayError("Ошибка!");
    }, render]
  });

  e.preventDefault();
};

/**
 * Функция создания заявки
 * @param {object} event
 * @returns {Boolean}
 */
exports.recordRequest = function(e) {
  var created = new Date();
  var performerId = $(document.body).find('select[name="performer"]').prop('value');
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
  );

  var object = {
    performerId: performerId,
    description: description,
  	summary: summary,
  	priority: priority,
  	estimated: estimated,
  	created: created,
  	deadline: deadline,
  	status: status
  };

  $.ajax({
    url: '/users/' + exports.user.id() + '/request/new',
    type: 'post',
    contentType: 'application/json; charset=UTF-8',
    data: JSON.stringify(object),
    success: function(data, status, jqxhr) {
      exports.showRequests();
    },
    error: function(jqxhr, status, errorMsg) {
      functions.displayError("Ошибка!");
    }
  });
    
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
  var created = new Date();

  if (!script.validate(text, 0)) {
    functions.displayError("Ошибка!");
    return false;
  }
  
  var object = {
  	type: type,
  	text: text,
  	date: created  
  };

  $.ajax({
	url: '/users/' + exports.user.id() + '/requests/' + exports.request.id() + '/comments/new',
	type: 'post',
	contentType: 'application/json; charset=UTF-8',
	data: JSON.stringify(object),
	success: function(data, status, jqxhr) {
	  exports.showRequestDetails(exports.request.id());
	},
	error: function(jqxhr, status, errorMsg) {
	  functions.displayError("Ошибка!");
	}
  });

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
  
  var render = function(jqxhr, status) {
    var tmpl = require('./../template/edit_request.ejs');
    var div = tmpl({
      f: exports.user.type() == 'admin',
      items: performersId,
      months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      days: functions.makeNumbersObject(1, 31),
      years: functions.makeNumbersObject(2000, 2016)
    });
  
    $(document.body).append(div);
    $(document.body).find('form').submit(exports.submitRequest);
  };
  
  $.ajax({
    url: '/users/performer',
    type: 'post',
    contentType: 'application/json; charset=UTF-8',
    dataType: 'json',
    success: [function(data, status, jqxhr) {
      performersId = data;
    }, render],
    error: [function(jqxhr, status, errorMsg) {
      functions.displayError("Ошибка!");
    }, render]
  });
  
  e.preventDefault();
};

/**
 * Функция редактирования заявки
 * @param {object} event - Объект события
 * @returns {Boolean}
 */
exports.submitRequest = function(e) {
  var object = {};
  
  if (exports.user.type() === 'admin') {
    var performerId = $(document.body).find('select[name="performer"]').prop('value');
    var estimated = $(document.body).find('input[name="estimated"]').prop('value');

    if (!script.validate(estimated, 4)) {
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
    );
	
  	object = {
  	  performerId: performerId,
  	  estimated: estimated,
  	  deadline: deadline
  	};
  }
  
  var ready = $(document.body).find('input[name="ready"]').prop('value');
  var status = $(document.body).find('select[name="status"]').prop('value');
  if (!script.validate(ready, 4) || ready < 0 || ready > 100) {
    functions.displayError('Ошибка!');
    return false;
  }
  
  object.ready = ready;
  object.status = status;
  
  $.ajax({
    url: '/api/v1/requests/' + exports.request.id(),
  	type: 'patch',
  	contentType: 'application/json',
  	dataType: 'json',
  	data: JSON.stringify(object),
  	success: function(data, status, jqxhr) {
      exports.showRequestDetails(exports.request.id());  
  	},
  	error: function(jqxhr, status, errorMsg) {
  	  functions.displayError("Ошибка!");
  	}
  });
  e.preventDefault();
};

/**
 * Функция вывода списка заявок, отфильтрованных по клиентам
 * @returns {undefined}
 */
exports.filterCustomer = function() {
  customer = $(this).prop('value');
  delete filter.summary;
  if (customer === 'Любой') 
    delete filter.customerId;
  else 
    filter.customerId = customer;
  offset = 0;
  exports.filterRequests('created', filter);
};

/**
 * Функция вывода списка заявок, отфильтрованных по статусу
 * @returns {undefined}
 */
exports.filterStatus = function() {
  status = $(this).prop('value');
  delete filter.summary;
  if (status === 'Любой')
    delete filter.status;
  else
    filter.status = status;
  offset = 0;
  exports.filterRequests('created', filter);
};

/**
 * Функция вывода списка заявок, отфильтрованных по названию
 * @returns {undefined}
 */
exports.filterSummary = function() {
  summary = $(this).find('input:first').prop('value');
  if (script.validate(summary, 0)) {
    filter = {
      summary: summary
    };
    offset = 0;
    exports.filterRequests('created', filter);
  }
  else {
    functions.displayError('Ошибка!');
  }
  return false;
};