var events = require('./events.js');
var functions = require('./functions.js');
var script = require('./script.js');

require("./css/style.css");
require("./css/typography.css");

$(document).ready(function(e) {
  $('body').append(require('./index.html'));
  functions.injectSelect($('.months'), ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']);
  functions.injectSelect($('.years'), functions.makeNumbersObject(2000, 2016));
  functions.injectSelect($('.days'), functions.makeNumbersObject(1, 31));
  
  functions.authorisation = $('#authorisation');
  functions.client_registration = $('#client_registration');
  functions.create_comment = $('#create_comment');
  functions.create_request = $('#create_request');
  functions.edit_request = $('#edit_request');
  functions.list_request = $('#list_request');
  functions.performer_registration = $('#performer_registration');
  functions.select_performer = $('#select_performer');
  functions.request_details = $('#request_details');
  functions.performer_creation = $('#performer_creation');

  functions.hide();
  
  functions.authorisation.css('display', 'block');

  var admin = script.getObject('admin');
  if (admin === null) {
    admin = new script.User();
    admin.id('admin');
    admin.login('admin');
    admin.type('Администратор');
    script.saveObject(admin);
  }
  
  
  functions.authorisation.find('form').submit(events.auth);

  $('#reg-performer').click(function () {
    functions.hide();
    functions.performer_registration.css('display', 'block');
  });
  
  functions.performer_registration.find('form').submit(events.registration);
  
  $('#reg-customer').click(function () {
    functions.hide();
    functions.client_registration.css('display', 'block');
  });
  
  functions.client_registration.find('form').submit(events.registration1);

  $('#create-request').click(events.createRequest);
  
  functions.create_request.find('form').submit(events.recordRequest);
  
  $('#list-requests').click(events.showRequests);
  
  functions.create_comment.find('form').submit(events.createComment);
  
  $('#add-comment').click(function () {
    functions.hide();
    functions.create_comment.css('display', 'block');
    var value;
    if (events.user.type() === 'Исполнитель') value = 'none';
    else value = 'auto';
    
    $('.not-performer').css('display', value);
    return false;
  });

  $('#edit-request').click(events.editRequest);
  
  functions.edit_request.find('form').submit(events.submitRequest);
  
  $('#back-authorisation').click(function () {
    functions.hide();
    functions.authorisation.css('display', 'block');
    return false;
  });
  
  $('#create-performer').click(function () {
    functions.hide();
    functions.performer_creation.css('display', 'block');
    return false;
  });
  
  functions.performer_creation.find('form').submit(events.creation);
});