const fs = require('fs')
const yaml = require('js-yaml')

function loadPackageJsonFile() {
  let packageJsonFile
  try {
    packageJsonFile = require(`${process.cwd()}/package.json`)
  } catch(err) {
    console.error('   ✗ Cannot find package.json file, execute this command in the right directory or create a package.json file')
    process.exit(1)
  }

  console.log(`   ✓ Found package.json ${packageJsonFile.name}@${packageJsonFile.version}`)
  return packageJsonFile
}

function loadInputAppYamlFile(from) {
  const inputAppYamlFile = yaml.safeLoad(fs.readFileSync(from, 'utf8'))
  console.log(`   ✓ Found app.yaml at ${from}`)
  return inputAppYamlFile
}

function loadCustomEnvironmentVariablesFile() {
  let customEnvironmentVariablesFile
  try {
    customEnvironmentVariablesFile = require(`${process.cwd()}/config/custom-environment-variables`)
  } catch(err) {
    console.error('   ✗ Cannot find custom-environment-variables.js file in ./config folder')
    process.exit(1)
  }

  console.log(`   ✓ Found custom-environment-variables.js`)
  return customEnvironmentVariablesFile
}


function loadFiles({from}) {
  console.info('\n>> Find necessary files')
  return {
    packageJsonFile: loadPackageJsonFile(),
    inputAppYamlFile: loadInputAppYamlFile(from),
    customEnvironmentVariablesFile: loadCustomEnvironmentVariablesFile()
  }
}

module.exports = {
  loadFiles,
  loadCustomEnvironmentVariablesFile,
}
