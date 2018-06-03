const _ = require('lodash')
const resize = require('../../lib/transforms/resize')
const ImageData = require('../../lib/image-data').ImageData
const {expect, fixtureDecode, compareToFixture} = require('../utils')

describe('#transforms/resize', () => {
  const yosemitePromise = fixtureDecode('source-yosemite.jpg').then(ImageData.normalize)

  describe('#normalizeOptions', () => {
    const baseImageData = {
      width: 100,
      height: 100,
    }

    it('should autofill missing height', () => {
      const options = {width: 50, fit: 'exact'}
      const result = resize.normalizeOptions(baseImageData, options)
      expect(result).to.have.property('height', 50)
    })

    it('should autofill missing width', () => {
      const options = {height: 50, fit: 'exact'}
      const result = resize.normalizeOptions(baseImageData, options)
      expect(result).to.have.property('width', 50)
    })

    it('should support height contain', () => {
      const options = {width: 125, height: 25, fit: 'contain'}
      const result = resize.normalizeOptions(baseImageData, options)
      expect(result).to.have.property('width', 25)
      expect(result).to.have.property('height', 25)
    })

    it('should support width contain', () => {
      const options = {width: 25, height: 125, fit: 'contain'}
      const result = resize.normalizeOptions(baseImageData, options)
      expect(result).to.have.property('width', 25)
      expect(result).to.have.property('height', 25)
    })

    it('should support height cover', () => {
      const options = {width: 125, height: 25, fit: 'cover'}
      const result = resize.normalizeOptions(baseImageData, options)
      expect(result).to.have.property('width', 125)
      expect(result).to.have.property('height', 125)
    })

    it('should support width cover', () => {
      const options = {width: 25, height: 125, fit: 'cover'}
      const result = resize.normalizeOptions(baseImageData, options)
      expect(result).to.have.property('width', 125)
      expect(result).to.have.property('height', 125)
    })

    it('should support auto height crop', () => {
      const options = {width: 50, height: 40, fit: 'crop'}
      const result = resize.normalizeOptions(baseImageData, options)
      expect(result).to.eql({
        width: 50,
        height: 40,
        fit: 'crop',
        subselect: {
          top: 10,
          bottom: 90,
          left: 0,
          right: 100,
        },
      })
    })

    it('should support auto width crop', () => {
      const options = {width: 40, height: 50, fit: 'crop'}
      const result = resize.normalizeOptions(baseImageData, options)
      expect(result).to.eql({
        width: 40,
        height: 50,
        fit: 'crop',
        subselect: {
          top: 0,
          bottom: 100,
          left: 10,
          right: 90,
        },
      })
    })

    it('should support manual crop', () => {
      const subselect = {
        top: 40,
        bottom: 60,
        left: 0,
        right: 80,
      }
      const options = {subselect, fit: 'crop'}
      const result = resize.normalizeOptions(baseImageData, options)
      expect(result).to.eql({
        width: 80,
        height: 20,
        fit: 'crop',
        subselect,
      })
    })
  })

  describe('#nearestNeighbor', () => {
    it('should resize mock data', () => {
      const input = {
        channels: 1,
        width: 4,
        height: 4,
        data: _.range(1, 33, 2),
      }

      const output = resize.nearestNeighbor(input, {width: 2, height: 2})
      expect(output.data).to.eql(new Uint8Array([
        1, 5,
        17, 21,
      ]))
    })

    it('should resize an actual image', () => {
      return yosemitePromise.then(yosemite => {
        const output = resize.nearestNeighbor(yosemite, {width: 100, height: 125})
        return compareToFixture(ImageData.toBuffer(output), 'yosemite-nearest-neighbor.jpg')
      })
    })
  })

  describe('#bilinear', () => {
    it('should resize mock data', () => {
      const input = {
        channels: 1,
        width: 3,
        height: 3,
        data: [
          1, 3, 5,
          7, 9, 11,
          13, 15, 17,
        ],
      }

      const output = resize.bilinear(input, {width: 2, height: 2})
      expect(output.data).to.eql(new Uint8Array([
        1, (3 + 5) / 2,
        (7 + 13) / 2, (9 + 11 + 15 + 17) / 4,
      ]))
    })

    it('should resize an actual image', () => {
      return yosemitePromise.then(yosemite => {
        const output = resize.bilinear(yosemite, {width: 600, height: 750})
        return compareToFixture(ImageData.toBuffer(output), 'yosemite-bilinear-minor.jpg')
      })
    })

    it('should drastically resize an actual image', () => {
      return yosemitePromise.then(yosemite => {
        const output = resize.bilinear(yosemite, {width: 100, height: 125})
        return compareToFixture(ImageData.toBuffer(output), 'yosemite-bilinear-drastic.jpg')
      })
    })
  })

  describe('#box', () => {
    it('should resize mock data', () => {
      const input = {
        channels: 1,
        width: 4,
        height: 4,
        data: _.range(1, 33, 2),
      }

      const output = resize.box(input, {width: 2, height: 2})
      expect(output.data).to.eql(new Uint8Array([
        6, 10,
        22, 26,
      ]))
    })
  })
})