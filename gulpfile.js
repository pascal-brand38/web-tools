// Copyright (c) Pascal Brand
// MIT License

const fs = require('fs')
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const gulp = require('gulp');
const { series, parallel } = require('gulp');
const { buildHtml } = require('./js/buildHtml')
const { createPreprocVariables } = require('./js/preproc')


////////////////////////////////////////////////////////////////////// Initialization

// TODO: remove these hard values
let args = {
  relativeDst: 'dist',
}

function getArgs(argv) {
  return options = yargs(hideBin(argv))
    .usage('Build web site using web-tools')
    .help('help').alias('help', 'h')
    .version('version', '1.0').alias('version', 'V')
    .options({
      "site-root-dir": {
        description: "root directory of the site. Default is test-website",
        default: 'test-website',
        requiresArg: true,
        required: false,
        alias: 's',
      },
    })
    .argv;
}

async function initTask() {
  const options = getArgs(process.argv)
  args.siteRootdir = options['site-root-dir']
  console.log(`args.siteRootdir = ${args.siteRootdir}`)

  args.gulpConfig = await JSON.parse(fs.readFileSync(args.siteRootdir + '/src/gulp-config/gulp-config.json', 'utf8'))
  if (args.gulpConfig.config.relativeDst) {
    args.relativeDst = args.gulpConfig.config.relativeDst
  }
  createPreprocVariables(args)
}


////////////////////////////////////////////////////////////////////// Tasks
// run with  gulp helloworld
function helloworldTask(cb) {
  console.log('Hello World')
  cb()
}

const buildHtmlTask = (cb) => buildHtml(args, cb)

///////////////////////// Tasks
// run helloworld task using:  gulp helloworld
exports.helloworld = helloworldTask

exports.default = series(
  initTask,
  buildHtmlTask,
)
