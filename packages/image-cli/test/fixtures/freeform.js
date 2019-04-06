const fs = require('fs')
const path = require('path')

module.exports = async function(modules, argv) {
  const {Image, BrowserImage} = modules['@eris/image']
  const {TIFFDecoder} = modules['@eris/exif']
  const file = argv._[0] || path.join(__dirname, 'sydney.jpg')
  if (TIFFDecoder) console.log('EXIF is passed-through ✓')
  console.log('File is', file)
  const imageData = await Image.from(fs.readFileSync(file)).toImageData()

  const size = Math.round(Math.min(imageData.height, imageData.width) / 6)
  const image = BrowserImage.from(imageData)
  const subselect = {top: 0, bottom: size, left: 0, right: size}

  for (let i = 0; i < 5; i++) {
    const start = i * size
    image.resize({
      width: size,
      height: size,
      subselect: {...subselect, top: start, bottom: start + size},
    })

    console.log('Processing', i + 1, '...')
    const selectedImageData = await image.toImageData()
    await Image.from(selectedImageData).analyze({faces: {}}).toAnalysis()
    const buffer = await Image.from(selectedImageData).toBuffer()
    fs.writeFileSync(path.join(__dirname, `actual-freeform-${i}.jpg`), buffer)
  }

  console.log('Done!')
}