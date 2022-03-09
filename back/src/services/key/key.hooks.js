const { blockService } = require("../blockedService");


module.exports = {
  before: {
    all: [],
    find: [blockService],
    get: [blockService],
    create: [],
    update: [blockService],
    patch: [blockService],
    remove: [blockService]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
