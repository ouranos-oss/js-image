const path = require('path')
const expect = require('chai').expect
const sinon = require('sinon')
const Runner = require('../lib/runner')

const fixturePath = name => path.join(__dirname, `fixtures/${name}`)

describe('lib/runner.js', () => {
  const noop = () => undefined

  const reporterApi = {
    started: noop,
    finished: noop,
    entryStarted: noop,
    entryFinished: noop,
    entryErrored: noop,
  }

  let sandbox
  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('.run', () => {
    it('should process images', () => {
      const entry = {
        input: fixturePath('skater.jpg'),
        output: ':::in-memory',
        action: 'toBuffer',
        settings: {},
      }

      const runner = new Runner(reporterApi, [entry])
      const entryFinished = sandbox.stub(reporterApi, 'entryFinished')
      return runner.run().then(() => {
        expect(entryFinished.firstCall).to.be.ok
        const result = entryFinished.firstCall.args[1]
        expect(result.length).to.be.within(14000, 17000)
      })
    })

    it('should process metadata', () => {
      const entry = {
        input: fixturePath('skater.jpg'),
        output: ':::in-memory',
        action: 'toMetadata',
        settings: {},
      }

      const runner = new Runner(reporterApi, [entry])
      const entryFinished = sandbox.stub(reporterApi, 'entryFinished')
      return runner.run().then(() => {
        expect(entryFinished.firstCall).to.be.ok
        const result = entryFinished.firstCall.args[1]
        expect(result).to.have.property('width', 256)
        expect(result).to.have.property('exif')
      })
    })

    it('should process analysis', () => {
      const entry = {
        input: fixturePath('skater.jpg'),
        output: ':::in-memory',
        action: 'toAnalysis',
        settings: {
          analyze: {hash: {}, sharpness: {}},
        },
      }

      const runner = new Runner(reporterApi, [entry])
      const entryFinished = sandbox.stub(reporterApi, 'entryFinished')
      return runner.run().then(() => {
        expect(entryFinished.firstCall).to.be.ok
        const result = entryFinished.firstCall.args[1]
        expect(result).to.have.property('hash').a('string')
        expect(result.sharpness).to.have.property('median', 75)
      })
    })
  })
})