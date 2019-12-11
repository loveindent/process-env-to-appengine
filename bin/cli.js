#!/usr/bin/env node
const program = require('commander')
const packageJSON = require('../package.json')
const lib = require('../src')
const check = require('../src/check')

function list(val) {
  return val.split(',').map(String);
}

program
  .version(packageJSON.version, '-v, --version')
  .option('-s, --source [string]', 'Source app.yaml file to complete with env_variables', './app.yaml')
  .option('-d, --dest [string]', 'Destination to write file', './dist/app.yaml')
  .option('-p, --prefix [string]', 'If you have to prefix process env like DEV_HOST add DEV_ to output HOST in app.yaml')

program
  .command('apply')
  .description('Apply env variables to destination app.yaml file')
  .action(function(options) {
    console.info('\Process env to AppEngine')
    console.info('\n>> Starting apply env variables')
    const {
      source,
      dest,
      prefix
    } = options.parent
    console.info(`   source:   [${source}]`)
    console.info(`   dest:     [${dest}]`)
    console.info(`   prefix: [${prefix || 'no prefix'}]\n`)

    lib({source, dest, prefix})
  })

program
  .command('check')
  .description('Check if all environment variables are here, exit process if not')
  .option('-o, --optional [list]', 'Specify list of optional env variables (seperated by coma, ex: HOST,ENV)', list, ['PORT'])
  .action(function(options) {
    console.info('\Process env to AppEngine')
    console.info('\n>> Checking environment variables presence')
    const {
      prefix,
    } = options.parent
    console.info(`   optional:   [${options.optional}]`)

    check(prefix, options.optional)
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) program.help();
