function isNumeric(n) {
  return !isNaN( parseFloat(n) ) && isFinite(n);
}

function extend(target, obj) {
  if(obj === null || typeof(obj) != 'object') {
    return target;
  }
  for(var key in obj) {
    target[key] = extend(obj[key]);
  }
  return target;
}

function validate(content, type) {
  var VALIDATE_ARR = [
    /^[а-яА-ЯёЁa-zA-Z0-9\s.?"',:;%@!_]+$/,  //простой текст
    /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/,  //логин
    /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/,  //email
    /^[a-zA-Z][a-zA-Z0-9-_\.]{6,20}$/  //пароль
  ];
  var regexp = VALIDATE_ARR[type];
  return regexp.test(content);
} 
  
function User() {
  var id;
  var login;
  var password;
  var email;
  var type;
  var requestsId = [];
  var TYPE_ARR = ['Исполнитель', 'Клиент', 'Администатор'];

  this.id = function(userId) {
    if (!arguments.length) return id;

    if ( isNumeric(userId) && userId >= 0 ) id = userId;
  };

  this.login = function(userLogin) {
    if (!arguments.length) return login;

    if ( validate(userLogin, 1) ) login = userLogin;
  };

  this.password = function(userPassword) {
    if (!arguments.length) return password;

    if ( validate(userPassword, 3) ) password = userPassword;
  };

  this.email = function(userEmail) {
    if (!arguments.length) return email;

    if ( validate(userEmail, 2) ) email = userEmail;
  };

  this.type = function(userType) {
    if (!arguments.length) return type;

    if ( TYPE_ARR.indexOf(userType) != -1 ) type = userType;
  };

  this.addRequestId = function(id) {
    if (!arguments.length) return false;
    if ( isNumeric(id) && id >= 0 ) {
      requestsId.push(id);
      return true;
    }
  };

  this.getRequestId = function(index) {
    if ( index >= requestsId.length ) return null;
    return requestId[index];
  };
}

function Comment() {
  var id;
  var userId;
  var text;
  var type;
  var TYPE_ARR = ['Вопрос', 'Комментарий'];

  this.id = function(commentId) {
    if (!arguments.length) return id;

    if ( isNumeric(commentId) && commentId >= 0 ) id = commentId;
  };

  this.userId = function(value) {
    if (!arguments.length) return userId;

    if ( isNumeric(value) && value >= 0 ) userId = value;
  };

  this.text = function(commentText) {
    if (!arguments.length) return text;

    if ( validate(commentText, 0) ) text = commentText;
  };

  this.type = function(commentType) {
    if (!arguments.length) return type;

    if ( TYPE_ARR.indexOf(commentType) != -1 ) type = commentType;
  };
}

function Request() {
  var id;
  var customerId;
  var performerId;
  var description;
  var summary;
  var priority;
  var estimated;
  var deadline;
  var commentsId = [];
  var ready;
  var PRIORITY_ARR = ['LOW', 'MEDIUM', 'HIGH'];

  this.id = function(requestId) {
    if (!arguments.length) return id;

    if ( isNumeric(requestId) && requestId >= 0 ) id = requestId;
  };

  this.customerId = function(value) {
    if (!arguments.length) return customerId;

    if ( isNumeric(value) && value >= 0 ) customerId = value;
  };

  this.performerId = function(value) {
    if (!arguments.length) return performerId;

    if ( isNumeric(value) && value >= 0 ) performerId = value;
  };

  this.addCommentId = function(id) {
    if (!arguments.length) return false;
    if ( isNumeric(id) && id >= 0 ) {
      commentsId.push(id);
      return true;
    }
  };

  this.getCommentId = function(index) {
    if ( index >= commentsId.length ) return null;
    return commentsId[index];
  };

  this.description = function(requestDescription) {
    if (!arguments.length) return description;

    if ( validate(requestDescription, 0) ) description = requestDescription;
  };

  this.summary = function(requestSummary) {
    if (!arguments.length) return summary;

    if ( validate(requestSummary, 0) ) summary = requestSummary;
  };

  this.priority = function(requestPriority) {
    if (!arguments.length) return priority;

    if ( PRIORITY_ARR.indexOf(requestPriority) != -1 ) priority = requestPriority;
  };

  this.estimated = function(requestEstimated) {
    if (!arguments.length) return estimated;

    if ( isNumeric(requestEstimated) && requestEstimated >= 0 ) estimated = requestEstimated;
  };

  this.deadline = function(requestDeadline) {
    if (!arguments.length) return deadline;

    if ( requestDeadline instanceof Date) deadline = requestDeadline;
  };

  this.ready = function(requestReady) {
    if (!arguments.length) return ready;

    if ( isNumeric(requestReady) && requestReady >= 0 && requestReady <= 100) ready = requestReady;
  };
}
