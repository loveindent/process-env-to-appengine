const fs = require('fs')
const yaml = require('js-yaml')
const {loadFiles} = require('./loadFiles')
const flattenObject = require('./helpers/flattenObject')
const processEnvVariables = process.env

module.exports = function(options) {
  const {
    from,
    to,
    prefix = '',
  } = options
  const {
    packageJsonFile,
    inputAppYamlFile,
    customEnvironmentVariablesFile,
  } = loadFiles({from})
  const necessaryEnvVariables = Object.values(flattenObject(customEnvironmentVariablesFile))

  console.info('\n>> Browse current env variables')
  let necessaryEnvVariablesAdded = 0
  for (const processEnvVariableName in processEnvVariables) {
    const finalEnvName = processEnvVariableName.replace(prefix, '')
    if (necessaryEnvVariables.includes(finalEnvName)) {
      console.info(`   ✓ ${finalEnvName}`)
      necessaryEnvVariablesAdded += 1
      if (!inputAppYamlFile.env_variables) inputAppYamlFile.env_variables = {}
      inputAppYamlFile.env_variables[finalEnvName] = processEnvVariables[processEnvVariableName]
    }
  }

  console.info(`   ${necessaryEnvVariablesAdded === necessaryEnvVariables.length ? '✓' : '⚠'} Found ${necessaryEnvVariablesAdded} on ${necessaryEnvVariables.length} needed`)

  console.info('\n>> Enhance with NPM env variables')
  const npmEnvVariables = {
    npm_package_version: packageJsonFile.version,
    npm_package_name: packageJsonFile.name,
  }
  for (const envVariableName in npmEnvVariables) {
    console.info(`   ✓ ${envVariableName}`)
    inputAppYamlFile.env_variables[envVariableName] = npmEnvVariables[envVariableName]
  }

  console.info(`\n>> Update destination file ${to}`)
  fs.writeFileSync(to, yaml.safeDump(inputAppYamlFile))
}
