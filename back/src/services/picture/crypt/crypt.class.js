const Jimp = require('jimp');
const fs = require('fs');
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
    newCol = col + key;
    if (newCol > 255) {
      newCol -= 256;
    }
  } else {
    newCol = col - key;
    if (newCol < 0) {
      newCol += 256;
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
 * Convert pixels array to picture
 * @param {number[][]} pixelsPicture Array of the key
 * @returns {Jimp} [R,G,B] values
 */
const convertPixelsToPicture = (pixelsPicture) => {
  let picture = new Jimp(pixelsPicture[0].length, pixelsPicture.length);
  pixelsPicture.forEach((rowPixels, y) => {
    rowPixels.forEach((pixel, x) => {
      let rgba = pixel.split(',');
      let r = parseInt(rgba[0]);
      let g = parseInt(rgba[1]);
      let b = parseInt(rgba[2]);
      let a = parseInt(rgba[3]);
      let color = Jimp.rgbaToInt(r, g, b, a);
      picture.setPixelColor(color, x, y);
    });
  });
  return picture;
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
  let passwordHash = crypto.pbkdf2Sync(password, salt, nbrIterations, keyLength, 'sha512').toString('utf16le');

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
const cryptPicture = (pixelsPicture,pixelsKey) => {
  let cryptedImage = new Jimp(pixelsPicture[0].length, pixelsPicture.length);
  pixelsPicture.forEach((rowPixels, y) => {
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
      cryptedImage.setPixelColor(color, x, y);
    });
  });
  cryptedImage.write('storage/crypted/cryptedimg.png');

  return cryptedImage;
};

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
    let selectedPicture = await Jimp.read(Buffer.from(data.picture.split(',')[1], 'base64'));
    let width = selectedPicture.bitmap.width;
    let height = selectedPicture.bitmap.height;

    let pixelsPicture = convertPictureToPixels(selectedPicture, width, height);

    let pixelsKey;
    let password = !!data.password;

    if(password) {
      let creator = data.creator ? data.creator : 'CryptiPics';
      let userTmp = data.timeToEncrypt ? data.timeToEncrypt : 5;
      if(userTmp < 5 || userTmp > 15) {
        userTmp = 5;
      }
      let tmpCryptPicture = (width * height * 4.7)/(1920 * 1080);
      let nbrSeconds = userTmp - tmpCryptPicture > 0 ? userTmp - tmpCryptPicture : 1;
      pixelsKey = getPasswordKey(data.password, width, height, nbrSeconds, creator);
    } else {
      if (data.useKey) {
        let useKey = await Jimp.read(Buffer.from(data.useKey.split(',')[1], 'base64'));
        let keyWidth = useKey.bitmap.width;
        let keyHeight = useKey.bitmap.height;
        pixelsKey = convertPictureToPixels(useKey, keyWidth, keyHeight);
      } else if (data.useStorageKey) {
        pixelsKey = (await this.app.service('key').find({ query: { name: data.keyName } })).pixels;
      } else {
        const key = await this.app.service('key').create({ name: !!data.keyName, saveKey: !!data.saveKey, width: width, height: height });
        pixelsKey = key.pixels;
      }
    }

    let cryptedImage = cryptPicture(pixelsPicture, pixelsKey);

    const cryptedImageB64 = await cryptedImage.getBase64Async(cryptedImage.getMIME());

    let result = {encryptedPicture: cryptedImageB64};

    if(!password && !data.useStorageKey && !data.useKey) {
      let keyPicture = await convertPixelsToPicture(pixelsKey).getBase64Async(cryptedImage.getMIME());
      result = {key: keyPicture, ...result};
    }

    return result;
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
