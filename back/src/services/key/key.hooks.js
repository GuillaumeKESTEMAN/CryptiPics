const { GeneralError } = require("@feathersjs/errors");
const { blockService } = require("../blockedService");

const beforeFindCheckData = (ctx) => {
  // if (!ctx.params.query.name) throw new GeneralError("Donnée manquante: name", ctx.params.query);
}

module.exports = {
  before: {
    all: [],
    find: [beforeFindCheckData],
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
