const user = require('./user/user.service.js');
const picture = require('./picture/picture.service.js');
const key = require('./key/key.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(user);
  app.configure(picture);
  app.configure(key);
};
