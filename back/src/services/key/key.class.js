const Jimp = require('Jimp');
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
    const defaultKeySize = 500;
    
    let pixels = []
    for (let y = 0; y < defaultKeySize; y++) {
      let rowPixels = [];
      for (let x = 0; x < defaultKeySize; x++) {
        const r = Number(Math.floor(Math.random() * 255) + 1);
        const g = Number(Math.floor(Math.random() * 255) + 1);
        const b = Number(Math.floor(Math.random() * 255) + 1);
        rowPixels.push(`${r},${g},${b}`);
      }
      pixels.push(rowPixels)
    }
    fs.writeFileSync('storage/key/key.json', JSON.stringify({ data: pixels }))

    return { success: true };
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
