const assert = require('assert');
const app = require('../../src/app');

describe('\'picture\' service', () => {
  it('registered the service', () => {
    const service = app.service('picture');

    assert.ok(service, 'Registered the service');
  });
});
