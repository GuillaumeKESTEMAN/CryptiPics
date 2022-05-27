const { GeneralError } = require("@feathersjs/errors");
const { blockService } = require("../../blockedService");

const beforeCreateCheckData = (ctx) => {
  if (!ctx.data.picture) throw new GeneralError("Donnée manquante: picture", ctx.data);
  if (!ctx.data.password && !ctx.data.key && !ctx.data.useStorageKey) throw new GeneralError("Donnée manquante: password or key", ctx.data);
}

module.exports = {
  before: {
    all: [],
    find: [blockService],
    get: [blockService],
    create: [beforeCreateCheckData],
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
