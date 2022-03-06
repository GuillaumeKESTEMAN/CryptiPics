// Initializes the `user` service on path `/user`
const { User } = require('./user.class');
const hooks = require('./user.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user', new User(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user');

  service.hooks(hooks);
};
