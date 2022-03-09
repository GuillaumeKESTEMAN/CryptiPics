// Initializes the `key` service on path `/key`
const { Key } = require('./key.class');
const hooks = require('./key.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/key', new Key(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('key');

  service.hooks(hooks);
};
