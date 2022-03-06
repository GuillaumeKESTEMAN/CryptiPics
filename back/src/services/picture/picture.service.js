// Initializes the `picture` service on path `/picture`
const { Crypt } = require('./crypt/crypt.class');
const cryptHooks = require('./crypt/crypt.hooks');

const { Decrypt } = require('./decrypt/decrypt.class');
const decryptHooks = require('./decrypt/decrypt.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/picture/crypt', new Crypt(options, app));
  app.use('/picture/decrypt', new Decrypt(options, app));

  // Get our initialized service so that we can register hooks
  const cryptService = app.service('picture/crypt');
  cryptService.hooks(cryptHooks);

  const decryptService = app.service('picture/decrypt');
  decryptService.hooks(cryptHooks);

};
