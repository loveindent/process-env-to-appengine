const {
  loadCustomEnvironmentVariablesFile,
} = require('./loadFiles')
const flattenObject = require('./helpers/flattenObject')
const processEnvVariables = process.env

module.exports = function(prefix) {
  console.info('\n>> Find necessary files')

  const customEnvironmentVariablesFile = loadCustomEnvironmentVariablesFile()
  const necessaryEnvVariables = Object.values(flattenObject(customEnvironmentVariablesFile))
  let count = 0
  const unprefixedPprocessEnvVariables = {}

  for (var key in processEnvVariables) {
    unprefixedPprocessEnvVariables[key.replace(prefix, '')] = processEnvVariables[key]
  }

  console.info('\n>> Check presence of env variables')

  necessaryEnvVariables.forEach((necessaryEnvVariable, key) => {
    const finalEnvName = necessaryEnvVariable.replace(prefix, '')
    if (unprefixedPprocessEnvVariables[finalEnvName]) {
      console.info(`   ✓ ${finalEnvName}`)
      count += 1
    } else {
      console.info(`   ✗ ${finalEnvName}`)
    }
  })

  console.info(`\n   ${count === necessaryEnvVariables.length ? '✓' : '⚠'} Found ${count} on ${necessaryEnvVariables.length} needed`)

  if (count !== necessaryEnvVariables.length) {
    console.error(`\nError: missing ${necessaryEnvVariables.length - count} environment variables\n`)
    process.exit(1)
  }
}
