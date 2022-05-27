const Jimp = require('jimp');
const crypto = require('crypto');

/**
 * Get RGB of the key
 * @param {string[][]} aK Array of the key
 * @param {number} x x
 * @param {number} y y
 * @returns {number[]} [R,G,B] values
 */
const getRGBKey = (aK, x, y) => {
  let j = Math.floor(y / aK.length);
  let i = Math.floor(x / aK[y - (aK.length * j)].length);

  return aK[y - (aK.length * j)][x - (aK[y - (aK.length * j)].length * i)].split(',');
};

/**
 * @param {number} col Picture color [0-255]
 * @param {number} key Key color [0-255]
 */
const sumRGB = (col, key) => {
  let newCol;

  if (key % 2 === 0) {
    newCol = col - key;
    if (newCol < 0) {
      newCol += 256;
    }
  } else {
    newCol = col + key;
    if (newCol > 255) {
      newCol -= 256;
    }
  }

  return newCol;
};

/**
 * Convert picture to pixels array
 * @param {Jimp} selectedPicture Selected picture
 * @param {number} width Width
 * @param {number} height Height
 * @returns {number[][]} [R,G,B] values
 */
const convertPictureToPixels = (selectedPicture, width, height) => {
  let pixelsPicture = [];

  for (let y = 0; y < height; y++) {
    let rowPixels = [];
    for (let x = 0; x < width; x++) {
      let pixel = Jimp.intToRGBA(selectedPicture.getPixelColor(x, y));
      rowPixels.push(`${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a}`);
    }
    pixelsPicture.push(rowPixels);
  }
  return pixelsPicture;
};

/**
 * @param {String} password Password
 * @param {Number} width Width
 * @param {Number} height Height
 * @param {Number} nbrSeconds Number of seconds of the processing
 * @param {String} salt Salt to use
 * @returns {number[][]} [[R,G,B]] values
 */
const getPasswordKey = (password, width, height, nbrSeconds, salt) => {
  let keyLength = width * height * 8;
  let nbrIterations = Math.floor((4200/(keyLength/20000)) * nbrSeconds) > 1 ? Math.floor((4200/(keyLength/20000)) * nbrSeconds) : 1;
  let passwordHash = crypto.pbkdf2Sync(password, salt,nbrIterations, keyLength, 'sha512').toString('utf16le');

  let pixels = [];
  let i = 0;
  if(passwordHash.length >= width * height * 4) {
    for (let y = 0; y < width; y++) {
      let rowPixels = [];
      for (let x = 0; x < height; x++) {
        let asciiCharR = passwordHash.charCodeAt(i) - Math.floor(passwordHash.charCodeAt(i) / 255) * 255;
        let asciiCharG = passwordHash.charCodeAt(i+1) - Math.floor(passwordHash.charCodeAt(i+1) / 255) * 255;
        let asciiCharB = passwordHash.charCodeAt(i+2) - Math.floor(passwordHash.charCodeAt(i+2) / 255) * 255;
        let asciiCharA = passwordHash.charCodeAt(i+3) - Math.floor(passwordHash.charCodeAt(i+3) / 255) * 255;
        rowPixels.push(`${asciiCharR},${asciiCharG},${asciiCharB},${asciiCharA}`);
        i = i + 4;
      }
      pixels.push(rowPixels);
    }
  } else {
    throw new Error(`Une erreur est survenue lors de la création du pixels via hashage : ${passwordHash.length} < ${width * height * 4}`);
  }

  return pixels;
};

/**
 * @param {number[][]} pixelsPicture Pixels of the picture
 * @param {number[][]} pixelsKey Pixels of the key
 * @returns {Jimp} Jimp of the crypted picture
 */
const decryptPicture = (pixelsDecrypted,pixelsKey) => {
  let decryptedImage = new Jimp(pixelsDecrypted[0].length, pixelsDecrypted.length);
  pixelsDecrypted.forEach((rowPixels, y) => {
    rowPixels.forEach((pixel, x) => {
      let rgb = pixel.split(',');
      let rgbKey = [];
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
      let a = sumRGB(parseInt(rgb[3]), parseInt(rgbKey[3]));
      let color = Jimp.rgbaToInt(r, g, b, a);
      decryptedImage.setPixelColor(color, x, y);
    });
  });
  decryptedImage.write('storage/decrypted/decryptedimg.png');

  return decryptedImage;
};

exports.Decrypt = class Decrypt {
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
    let pixelsDecrypted = [];

    let selectedPicture = await Jimp.read(Buffer.from(data.picture.split(',')[1], 'base64'));
    let width = selectedPicture.bitmap.width;
    let height = selectedPicture.bitmap.height;
    for (let y = 0; y < height; y++) {
      let rowPixels = [];
      for (let x = 0; x < width; x++) {
        let pixel = Jimp.intToRGBA(selectedPicture.getPixelColor(x, y));
        rowPixels.push(`${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a}`);
      }
      pixelsDecrypted.push(rowPixels);
    }

    let pixelsKey;
    let password = !!data.password;

    if (password) {
      let creator = data.creator ? data.creator : 'CryptiPics';
      let userTmp = data.timeToDecrypt ? data.timeToDecrypt : 5;
      if(userTmp < 5 || userTmp > 15) {
        userTmp = 5;
      }
      let tmpDecryptPicture = (width * height * 4.7)/(1920 * 1080);
      let nbrSeconds = userTmp - tmpDecryptPicture > 0 ? userTmp - tmpDecryptPicture : 1;
      pixelsKey = getPasswordKey(data.password, width, height, nbrSeconds, creator);
    } else {
      if (data.key) {
        let key = await Jimp.read(Buffer.from(data.key.split(',')[1], 'base64'));
        let keyWidth = key.bitmap.width;
        let keyHeight = key.bitmap.height;
        pixelsKey = convertPictureToPixels(key, keyWidth, keyHeight);
      } else if (data.useStorageKey) {
        pixelsKey = (await this.app.service('key').find({query: {name: data.keyName}})).pixels;
      } else {
        throw new Error('Une clé est nécéssaire');
      }
    }

    let decryptedImage = decryptPicture(pixelsDecrypted, pixelsKey);
    const decryptedImageB64 = await decryptedImage.getBase64Async(decryptedImage.getMIME());

    return {decryptedPicture: decryptedImageB64};
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return {id};
  }
};
