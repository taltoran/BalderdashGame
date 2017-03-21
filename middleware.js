var models = require('./models/schema');
var utils = require('./controllers/utils');

/**
 * authentication middleware for Express.
 * runs constantly in app.js with app.use(./middleware);
 * loadS users from session data, and handle all users
 */
module.exports.simpleAuth = function(req, res, next) {
  if (req.session && req.session.user) {
    models.User.findOne({ username: req.session.user.username }, 'fname lname email username password data', function(err, user) {
      if (user) {
        utils.createUserSession(req, res, user);
      }
      next();
    });
  } else {
    next();
  }
};
