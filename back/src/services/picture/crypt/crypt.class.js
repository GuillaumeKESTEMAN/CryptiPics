const Jimp = require('Jimp');
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
  let i = 0
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
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    return {};
  }

  async create(data, params) {
    let pixelsPicture = [];

    let selectedPicture = await Jimp.read(Buffer.from(data.data.split(',')[1], 'base64'))
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

    const file = fs.readFileSync('storage/key/key.json', 'utf8')
    let pixelsKey = JSON.parse(file).data;
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
    cryptedImage.write('storage/crypted/cryptedimg.png')

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
