const yargs = require('yargs')
const ConfigEntry = require('../lib/config-entry')
const Runner = require('../lib/runner')
const Reporters = require('../lib/reporters')

const argv = yargs
  .usage('Usage: $0 -c [config]')
  .option('config', {
    alias: 'c',
    type: 'string',
    required: true,
  })
  .argv

const configEntries = ConfigEntry.readAllFrom(argv.config)
const reporter = Reporters.from(argv)
const runner = new Runner(reporter, configEntries)
runner.run()
