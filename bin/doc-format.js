#!/usr/bin/env node
const commander = require('commander');
const d3Dsv = require('d3-dsv');
const fs = require('fs')
const path = require('path')
const pkg = require('../package.json')

function resolve(pathname) {
  return path.resolve(process.cwd(), pathname);
}

commander.version(pkg.version)

commander.command('csv2json <filename>')
  .description('convert csv file to json')
  .option('-o, --output <output>', 'output file')
  .action((filename, options) => {
    const content = fs.readFileSync(resolve(filename), 'utf8')
    const converted = JSON.stringify(d3Dsv.csvParse(content), null, 2)
    if (options.output) {
      fs.writeFileSync(resolve(options.output), converted)
    } else {
      console.log(converted)
    }
  })

commander.command('tsv2json <filename>')
  .description('convert tsv file to json')
  .option('-o, --output <output>', 'output file')
  .action((filename, options) => {
    const content = fs.readFileSync(resolve(filename), 'utf8')
    const converted = JSON.stringify(d3Dsv.tsvParse(content), null, 2)
    if (options.output) {
      fs.writeFileSync(resolve(options.output), converted)
    } else {
      console.log(converted)
    }
  })

commander.parse(process.argv)

if (process.argv.length === 2) {
  commander.outputHelp();
}
