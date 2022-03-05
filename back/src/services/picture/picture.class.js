/* eslint-disable no-unused-vars */
exports.Picture = class Picture {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    return [];
  }

  async get (id, params) {
    return {};
  }

  async create (data, params) {
    console.log(data);
    // console.log(params);
    return data;
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
};
