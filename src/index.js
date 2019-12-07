/* eslint-disable */
const fs = require('fs')
const yaml = require('js-yaml')
const jsonPackage = require('../package.json')
const processEnvVariables = process.env
const env = process.argv.slice(2)[0];

function flattenObject(ob) {
  const toReturn = {};

  for (const i in ob) {
      if (!ob.hasOwnProperty(i)) continue;

      if ((typeof ob[i]) == 'object' && ob[i] !== null) {
        const flatObject = flattenObject(ob[i]);
        for (const x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue;

          toReturn[i + '.' + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
  }
  return toReturn;
}


module.exports = function(options) {
  const {
    prefix,
  } = options
  const customEnvVariables = require(`${process.cwd()}/config/custom-environment-variables`)
  const necessaryEnvVariables = Object.values(flattenObject(customEnvVariables))
  const doc = yaml.safeLoad(fs.readFileSync('./app.yaml', 'utf8'))
  const enVariables = {
    npm_package_version: jsonPackage.version,
    npm_package_name: jsonPackage.name,
  }

  const appEnginScopeRegExp = RegExp(`${prefix}*`)
  for (const processEnvVariableName in processEnvVariables) {
    const finalEnvName = processEnvVariableName.replace(prefix, '')
    if (appEnginScopeRegExp.test(processEnvVariableName) && necessaryEnvVariables.includes(finalEnvName)) {
      console.log(`Adding ${finalEnvName}`)
      doc.env_variables[finalEnvName] = processEnvVariables[processEnvVariableName]
    }
  }

  for (const envVariableName in enVariables) {
    console.log(`Adding ${envVariableName}`)
    doc.env_variables[envVariableName] = enVariables[envVariableName]
  }

  fs.writeFileSync('./dist/app.yaml', yaml.safeDump(doc))
}
