const assert = require('assert');
const app = require('../../src/app');

describe('\'key\' service', () => {
  it('registered the service', () => {
    const service = app.service('key');

    assert.ok(service, 'Registered the service');
  });
});
