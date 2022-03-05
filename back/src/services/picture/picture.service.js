// Initializes the `picture` service on path `/picture`
const { Picture } = require('./picture.class');
const hooks = require('./picture.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/picture', new Picture(options, app));
  // app.use('/picture/crypt', new Picture(options, app));
  // app.use('/picture/decrypt', new Picture(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('picture');

  service.hooks(hooks);
};
