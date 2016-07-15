module.exports = function(app) {
	app.models.user.create({
		email: 'admin@example.com',
    password: 'admin',
    role: 'admin',
    username: 'admin'
	}, function(err) {
      if (err) {
    		console.log(err);  
      }
  });
}