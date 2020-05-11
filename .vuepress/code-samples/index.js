const path = require('path')
const renderSamples = require('./render')
const fetchSamples = require('./fetch')

module.exports = function() {
  return {
    name: 'fetch-sample-files',
    extendCli(cli) {
      cli
        .command(
          'fetch-sample-files',
          "fetches the sample files in MeiliSearch SDK's"
        )
        .action(fetchSamples)
    },
    define() {
      const samples = require('./generated-samples.json')
      return {
        CODE_SAMPLES: renderSamples(samples),
      }
    },
    enhanceAppFiles: [path.resolve(__dirname, './client.js')],
  }
}
