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
