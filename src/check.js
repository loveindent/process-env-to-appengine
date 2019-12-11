const {
  loadCustomEnvironmentVariablesFile,
} = require('./loadFiles')
const flattenObject = require('./helpers/flattenObject')
const processEnvVariables = process.env

module.exports = function(prefix, ignoreList) {
  console.info('\n>> Find necessary files')

  const customEnvironmentVariablesFile = loadCustomEnvironmentVariablesFile()
  const necessaryEnvVariables = Object.values(flattenObject(customEnvironmentVariablesFile))
  let count = 0
  let ignoreCount = 0
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
      if (ignoreList.includes(finalEnvName)) {
        ignoreCount += 1
        console.info(`   ⚠ ${finalEnvName} (Not found but marked as optional)`)
      } else {
        console.info(`   ✗ ${finalEnvName}`)
      }
    }
  })

  console.info(`\n   ${count === necessaryEnvVariables.length - ignoreCount ? '✓' : '⚠'} Found ${count} on ${necessaryEnvVariables.length - ignoreCount} needed${ignoreCount && `, ignored ${ignoreCount}`}`)

  if (count + ignoreCount !== necessaryEnvVariables.length) {
    console.error(`\nError: missing ${necessaryEnvVariables.length - ignoreCount} mendatory environment variables\n`)
    process.exit(1)
  }
}
