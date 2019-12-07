#!/usr/bin/env node
const program = require('commander')
const packageJSON = require('../package.json')
const lib = require('../src')

program
  .version(packageJSON.version, '-v, --version')
  .option('-f, --from [string]', '...')
  .option('-t, --to [string]', '...')
  .option('-p, --prefix [string]', '...')
  .description('...')
  .parse(process.argv)

lib(program)
