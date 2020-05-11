const sdks = require('./sdks.json')
const yaml = require('js-yaml')
const bent = require('bent')
const fs = require('fs')
const chalk = require('chalk')

const NODE_ENV = process.env.NODE_ENV || 'development'

/*
 * Pretty console log function
 */
const log = (msg, color = 'FFB4E1', label = 'CODE-SAMPLE-FETCHER') => {
  console.log(`\n${chalk.reset.inverse.bold.hex(color)(` ${label} `)} ${msg}`)
}

/*
 * Convert YAML string to Js object
 * Throw a precise error on parsing fail.
 */
function sampleYamlToJs(body, sdk) {
  try {
    return yaml.safeLoad(body)
  } catch (e) {
    throw new Error(`The sample file of ${sdk.label} SDK cannot be converted to JSON
    SDK: ${sdk.label},
    url: ${sdk.url}

    ${e.stack}`)
  }
}

/*
 * Fetches only cURL samples from local directory
 */
function fetchLocalSamples() {
  const cURLPath = `${process.cwd()}/.code-samples.meilisearch.yaml`
  const curlSamples = fs.readFileSync(cURLPath, 'utf-8')
  return [
    {
      samples: sampleYamlToJs(curlSamples, {
        url: cURLPath,
        label: 'cURL',
      }),
      language: 'bash',
      label: 'cURL',
    },
  ]
}

/**
 * Fetches all yaml file based on a list of SDK repositories URL's
 */
async function fetchSamples() {
  const fetchPromises = sdks.map(async (sdk) => {
    try {
      const body = await bent(sdk.url, 'GET', 'string')()
      return {
        samples: sampleYamlToJs(body, sdk),
        language: sdk.language,
        label: sdk.label,
      }
    } catch (e) {
      // Crashs are not thrown. File will be ignored and warning raised
      log(
        `Warning: the sample file could not be fetched
        SDK: ${sdk.label},
        url: ${sdk.url}

        ${e.stack}`,
        '#FFA600'
      )
    }
  })
  return await Promise.all(fetchPromises)
}

/*
 * Writes file in JSON format
 */
function samplesToFiles(samples) {
  fs.writeFileSync(
    `${__dirname}/generated-samples.json`,
    JSON.stringify(samples, null, 2)
  )
}

module.exports = async () => {
  log('Fetching sample files...')
  let samples = {}
  if (NODE_ENV === 'development') {
    samples = fetchLocalSamples()
    log('Fetched local cURL file.')
  } else {
    samples = (await fetchSamples()).filter((sample) => sample)
    log(
      `Fetched sample files of: \n\t${samples
        .map((sample) => sample.label)
        .join('\n\t')}\n`
    )
  }
  await samplesToFiles(samples)
  log('Json sample file created.')
}
