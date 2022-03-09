const { GeneralError } = require('@feathersjs/errors');

exports.blockService = (ctx) => {
    throw new GeneralError("Service inaccessible", ctx.data);
}