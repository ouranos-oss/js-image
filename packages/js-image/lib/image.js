const fs = require('fs')
const {promisify} = require('./utils')

const writeFileAsync = promisify(fs.writeFile, fs)

class Image {
  constructor(options) {
    this._options = Object.assign({
      format: 'jpeg',
      formatOptions: {quality: 90},
    }, options)
  }

  format(format, options) {
    if (format !== Image.JPEG && format !== Image.PNG) {
      throw new Error(`Unrecognized format: ${format}`)
    }

    this._options.format = format
    this._options.formatOptions = Object.assign({}, options)
    return this
  }

  toImageData() {
    throw new Error('unimplemented')
  }

  toBuffer() {
    throw new Error('unimplemented')
  }

  toFile(path) {
    return this.toBuffer().then(buffer => writeFileAsync(path, buffer))
  }

  static from() {
    throw new Error('unimplemented')
  }
}

Image.JPEG = 'jpeg'
Image.PNG = 'png'
module.exports = Image
