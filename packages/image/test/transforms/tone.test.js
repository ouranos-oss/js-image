const toneModule = require('../../dist/transforms/tone')
const {expect} = require('../utils')

describe('#transforms/tone', () => {
  describe('#curves', () => {
    const imageData = {width: 1, height: 1, channels: 3, colorspace: 'ycbcr'}
    const curves = curvePoints => imageData => toneModule.curves(imageData, curvePoints).data

    it('should hold in identity case', () => {
      const curve = curves([])
      expect(curve({...imageData, data: [100, 1, 2]})).to.eql([100, 1, 2])
      expect(curve({...imageData, data: [150, 1, 2]})).to.eql([150, 1, 2])
    })

    it('should apply basic linear interpolation', () => {
      const curve = curves([[0, 50], [255, 200]])

      expect(curve({...imageData, data: [0, 1, 2]})).to.eql([50, 1, 2])
      expect(curve({...imageData, data: [255, 1, 2]})).to.eql([200, 1, 2])

      const interpolate = curve({...imageData, data: [128, 1, 2]}).map(Math.round)
      expect(interpolate).to.eql([125, 1, 2])
    })

    it('should apply basic cubic interpolation', () => {
      const curve = curves([[0, 0], [50, 40], [205, 215], [255, 255]])
      const compute = y => Math.round(curve({...imageData, data: [y]})[0])

      expect(compute(0)).to.equal(0)
      expect(compute(40)).to.equal(31)
      expect(compute(50)).to.equal(40)
      expect(compute(90)).to.equal(82)
      expect(compute(128)).to.equal(128)
      expect(compute(195)).to.equal(205)
      expect(compute(205)).to.equal(215)
      expect(compute(215)).to.equal(224)
      expect(compute(255)).to.equal(255)
    })
  })
})
