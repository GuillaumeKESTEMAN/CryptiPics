const Jimp = require('jimp');
const fs = require('fs');

/**
 * Get RGB of the key
 * @param {number[][]} aK Array of the key
 * @param {number} x x
 * @param {number} y y
 * @returns {number[]} [R,G,B] values
 */
const getRGBKey = (aK, x, y) => {
  let j = 0;
  while (!aK[y - (aK.length * j)]) { j += 1 }
  let i = 0;
  while (!aK[y - (aK.length * j)][x - (aK[y - (aK.length * j)].length * i)]) { i += 1 }

  return aK[y - (aK.length * j)][x - (aK[y - (aK.length * j)].length * i)]?.split(',');
}

/**
 * @param {number} col Picture color [0-255]
 * @param {number} key Key color [1-255]
 */
const sumRGB = (col, key) => {
  let newCol = col;
  if (col == 0) {
    col = 1
  } else if (col == 255) {
    col = 254
  }

  if (key > 50 && key < 200) {
    if ((col + key) >= 255) {
      newCol = ((col + key) - 254);
    } else {
      newCol = col + key;
    }
  } else {
    if ((col - key) <= 0) {
      newCol = ((col - key) + 254);
    } else {
      newCol = col - key;
    }
  }
  return newCol
}

exports.Crypt = class Crypt {
  constructor(options, app) {
    this.options = options || {};
    this.app = app;
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    return {};
  }

  async create(data, params) {
    let pixelsPicture = [];

    let selectedPicture = await Jimp.read(Buffer.from(data.picture.split(',')[1], 'base64'))
    let width = selectedPicture.bitmap.width;
    let height = selectedPicture.bitmap.height;
    for (let y = 0; y < height; y++) {
      let rowPixels = [];
      for (let x = 0; x < width; x++) {
        let pixel = Jimp.intToRGBA(selectedPicture.getPixelColor(x, y));
        rowPixels.push(`${pixel.r}, ${pixel.g}, ${pixel.b}`);
      }
      pixelsPicture.push(rowPixels);
    }

    let pixelsKey;
    await this.app.service('key').create({width: width, height: height}).then((data) => {
      pixelsKey = data.pixels;
    })
    let cryptedImage = new Jimp(pixelsPicture[0].length, pixelsPicture.length);
    pixelsPicture.forEach((rowPixels, y) => {
      rowPixels.forEach((pixel, x) => {
        let rgb = pixel.split(',');
        let rgbKey = []
        if (pixelsKey[y]) {
          if (pixelsKey[y][x]) {
            rgbKey = pixelsKey[y][x].split(',');
          } else {
            rgbKey = getRGBKey(pixelsKey, x, y);
          }
        } else {
          rgbKey = getRGBKey(pixelsKey, x, y);
        }
        let r = sumRGB(parseInt(rgb[0]), parseInt(rgbKey[0]));
        let g = sumRGB(parseInt(rgb[1]), parseInt(rgbKey[1]));
        let b = sumRGB(parseInt(rgb[2]), parseInt(rgbKey[2]));
        let color = Jimp.rgbaToInt(r, g, b, 255);
        cryptedImage.setPixelColor(color, x, y)
      })
    });
    cryptedImage.write('storage/crypted/cryptedimg.png');

    new Jimp(pixelsKey.length, pixelsKey[0].length, (err, image) => {
      if (err) { throw err; }
      pixelsKey.forEach((rowPixels, y) => {
        rowPixels.forEach((pixel, x) => {
          var rgb = pixel.split(',');
          var r = Number(rgb[0]);
          var g = Number(rgb[1]);
          var b = Number(rgb[2]);
          var color = Jimp.rgbaToInt(r, g, b, 255);
          image.setPixelColor(color, x, y)
        })
      })
      image.write('storage/crypted/keyimg.png', (err) => {
        if (err) { throw err; }
      });
    });

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
