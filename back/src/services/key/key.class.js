const Jimp = require('jimp');
const fs = require('fs');

exports.Key = class Key {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create(data, params) {
    if(data.width && data.height) {
      const width = data.width;
      const height = data.height;

      let pixels = [];
      for (let y = 0; y < width; y++) {
        let rowPixels = [];
        for (let x = 0; x < height; x++) {
          const r = Number(Math.floor(Math.random() * 254) + 1);
          const g = Number(Math.floor(Math.random() * 254) + 1);
          const b = Number(Math.floor(Math.random() * 254) + 1);
          rowPixels.push(`${r},${g},${b}`);
        }
        pixels.push(rowPixels);
      }
      // fs.writeFileSync('storage/key/key.json', JSON.stringify({ data: pixels }))

      return { success: true, pixels: pixels };
    } else {
      return { success: false, error: "Missing parameters, need 'width' and 'height' parameters" };
    }
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
