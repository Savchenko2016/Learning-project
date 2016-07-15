module.exports = function(app) {
  var user = app.models.user;
  var request = app.models.request;
  var comment = app.models.comment;

  var bodyParser = require('body-parser');
  app.use(bodyParser.json()); 
	
	app.post('/login1', function(req, res, next) {
    user.login({
      email: req.body.email,
      password: req.body.password
    }, 'user', function(err, token) {
      if (err) {
        res.sendStatus(500);
        return next(err);
      }
      user.findById(token.userId, function(err, user) {
        if (err) {
          res.sendStatus(500);
          return next(err);
        }
        res.send(JSON.stringify({
          id: token.userId,
          accessToken: token.id,
          username: user.username,
          role: user.role
        }));
      });
    });
  });
  app.post('/logout', function(req, res, next) {
    if (!req.body.accessToken) return res.sendStatus(401);
    user.logout(req.body.accessToken, function(err) {
      if (err) {
        res.sendStatus(500);
      	return next(err);
      }
      res.sendStatus(200);
    });
  });

  app.post('/registration', function(req, res, next) {
    user.create({
    	email: req.body.email,
    	password: req.body.password,
    	role: req.body.role,
    	username: req.body.username
    }, function(err) {
      if (err) {
        res.sendStatus(500);
        return next(err);
      }
      res.sendStatus(200);
    });
  });

  app.post('/users/:id/requests/:offset', function(req, res) {
    var id = req.params.id;
    var f = req.body.f;
    var offset = req.params.offset;
    var object;
    var isEmpty = true;
    for (var name in req.body.object) {
      isEmpty = false;
    }
    if (isEmpty) {
      object = {
        include: [
          {
            relation: 'users1',
            scope: {
              fields: {username: true}
            }
          },
          {
            relation: 'users2',
            scope: {
              fields: {username: true}
            }
          }
        ],
        skip: offset,
        limit: 10,
        order: req.body.property + ' ASC',
        where: {
          or: [{customerId: id}, {performerId: id}]
        }
      };
      if (f)
        delete object.where;
    }
    else {
      object = {
        include: [
          {
            relation: 'users1',
            scope: {
              fields: {username: true}
            }
          },
          {
            relation: 'users2',
            scope: {
              fields: {username: true}
            }
          }
        ],
        skip: offset,
        limit: 10,
        order: req.body.property + ' ASC',
        where: {
          and: [req.body.object, {or: [{customerId: id}, {performerId: id}]}]      
        }
      };
      if (f)
        object.where = req.body.object;
    }
    request.find(object, function(err, requests) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      res.json(requests);     
    });
  });

  app.post('/users/:type', function(req, res) {
    var type = req.params.type;
    user.find({
      order: 'username ASC',
      where: {
        role: type
      },
      fields: {username: true, id: true}
    }, function(err, users) {
      if (err) {
        res.sendStatus(500);
        return;
      }
      var items = [];
      users.forEach(function(user) {
        var user = user.toJSON();
        items.push({
          username: user.username,
          id: user.id
        });
      });
      res.json(items);
    });
  });

  app.post('/requests/:id', function(req, res, next) {
    var id = req.params.id;
    request.findById(id, {
      include: 
      [
        {
          relation: 'users1',
          scope: {
            fields: {username: true}
          }
        },
        {
          relation: 'users2',
          scope: {
            fields: {username: true}
          }
        },
        {
          relation: 'comments',
          scope: {
            include: {
              relation: 'users',
              scope: {
                fields: {username: true}
              }
            }
          }
        }
      ],
    }, function(err, request) {
      if (err) {
        res.sendStatus(500);
        return next(err);
      }
	  res.json(request);
    });
  });

  app.post('/users/:id/request/new', function(req, res, next) {
    request.create({
      customerId: req.params.id,
      performerId: req.body.performerId,
      description: req.body.description,
      summary: req.body.summary,
      priority: req.body.priority,
      estimated: req.body.estimated,
      created: req.body.created,
      deadline: req.body.deadline,
      ready: 0,
      status: req.body.status
    }, function(err) {
      if (err) {
        res.sendStatus(500);
        return next(err);
      }
      res.sendStatus(200);
    });
  });
  
  app.post('/users/:id1/requests/:id2/comments/new', function(req, res, next) {
  	comment.create({
  		type: req.body.type,
  		date: req.body.date,
  		text: req.body.text,
  		userId: req.params.id1,
  		requestId: req.params.id2
  	}, function(err) {
  		if (err) {
  			res.sendStatus(500);
  			return next(err);	
  		}
  		res.sendStatus(200);
  	});
  });

  app.post('/users/:id/request/count', function(req, res, next) {
    var object;
    var id = req.params.id;
    var f = req.body.f;
    var isEmpty = true;
    for (var name in req.body.object) {
      isEmpty = false;
    }
    if (isEmpty) {
      object = {
        or: [{customerId: id}, {performerId: id}]
      };
    }
    else {
      object = {
        and: [req.body.object, {or: [{customerId: id}, {performerId: id}]}]      
      };
      if (f)
        object = req.body.object;
    }
    if (isEmpty && f)
      request.count(function(err, count) {
        if (err) {
          res.sendStatus(500);
          return next(err);
        }
        res.json({
          count: count
        });
      });
    else
      request.count(object, function(err, count) {
        if (err) {
          res.sendStatus(500);
          return next(err); 
        }
        res.json({
          count: count
        });
      });
  });
};