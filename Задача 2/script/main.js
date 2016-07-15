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
