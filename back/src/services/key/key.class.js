const fs = require('fs');

exports.Key = class Key {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const pixelsKey = JSON.parse(fs.readFileSync(`storage/key/${params.query.name ? params.query.name : 'key'}.json`, 'utf8')).data;

    return {
      pixels: pixelsKey
    };
  }

  async get(id, params) {

  }

  async create(data, params) {
    const width = data.width ? data.width : 500;
    const height = data.height ? data.height : 500;

    let pixels = [];
    for (let y = 0; y < width; y++) {
      let rowPixels = [];
      for (let x = 0; x < height; x++) {
        const r = Number(Math.floor(Math.random() * 256));
        const g = Number(Math.floor(Math.random() * 256));
        const b = Number(Math.floor(Math.random() * 256));
        const a = Number(Math.floor(Math.random() * 256));
        rowPixels.push(`${r},${g},${b},${a}`);
      }
      pixels.push(rowPixels);
    }

    if (data.saveKey) {
      fs.writeFileSync(`storage/key/${data.name ? data.name : 'key'}.json`, JSON.stringify({ data: pixels }));
    }

    return { pixels: pixels };
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
};
