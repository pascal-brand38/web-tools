// Copyright (c) Pascal Brand
// MIT License

const fs = require('fs')
const path = require('path')
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')
const { series, parallel } = require('gulp');
const { buildHtml } = require('./js/buildHtml')
const { buildCss } = require('./js/buildCss')
const { buildJs } = require('./js/buildJs')
const { build3rdParties } = require('./js/build3rdParties')
const { buildRootDir } = require('./js/buildRootDir')
const { buildPhp } = require('./js/buildPhp')
const { buildValidate } = require('./js/buildValidate')
const { createPreprocVariables } = require('./js/preproc')


////////////////////////////////////////////////////////////////////// Initialization

// TODO: remove these hard values
let args = {
  relativeDst: 'dist',
  webtoolsDir: '/home/pasca/dev/pascal-brand38/web-tools'
}

function getArgs(argv) {
  return options = yargs(hideBin(argv))
    .usage('Build web site using web-tools')
    .help('help').alias('help', 'h')
    .version('version', '1.0').alias('version', 'V')
    .parserConfiguration({
      'unknown-options-as-args': true   // produce '_' key with all unknown args
    })
    .options({
      "site-root-dir": {
        description: "root directory of the site. Default is test-website",
        default: 'test-website',
        requiresArg: true,
        required: false,
        alias: 's',
      },
      "dbg": {
        description: "debug mode",
        default: false,
        requiresArg: false,
        required: false,
        boolean: true,
      },
      "w3c": {
        description: "w3c validation, as may take time",
        default: true,
        requiresArg: false,
        required: false,
        boolean: true,
      },
      "locals": {
        description: "build local specific resources",
        default: true,
        requiresArg: false,
        required: false,
        boolean: true,
      },
    })
    .argv;
}

async function initTask() {
  const options = getArgs(process.argv)
  args.siteRootdir = options['site-root-dir']
  args.dbg = options['dbg']
  args.w3c = options['w3c']
  args.locals = options['locals']

  if (options._.length != 0) {
    getArgs([process.argv[0], process.argv[1], '--help'])   // show the help
    throw('STOP')
  }

  args.gulpConfig = await JSON.parse(fs.readFileSync(args.siteRootdir + '/src/gulp-config/gulp-config.json', 'utf8'))
  if (args.gulpConfig.config.relativeDst) {
    args.relativeDst = args.gulpConfig.config.relativeDst
  }
  createPreprocVariables(args)

  // clear tmp dir
  try {
    const tmp = path.join(args.siteRootdir, 'tmp')
    for (const file of fs.readdirSync(tmp)) {
      fs.unlinkSync(path.join(tmp, file));
    }
  } catch {
    // in case tmp dir does not exist
  }
}


////////////////////////////////////////////////////////////////////// Tasks
// run with  gulp helloworld
function helloworldTask(cb) {
  console.log('Hello World')
  cb()
}

const buildLocalsTask = async (cb) => {
  if (args.locals) {
    const { buildLocals } = require('./' + args.siteRootdir + '/src/gulp-config/buildLocals.js')
    await buildLocals(args, cb)
  }
}

const buildHtmlTask = (cb) => buildHtml(args, cb)
const buildCssTask = (cb) => buildCss(args, cb)
const buildJsTask = (cb) => buildJs(args, cb)
const build3rdPartiesTask = (cb) => build3rdParties(args, cb)
const buildRootDirTask = (cb) => buildRootDir(args, cb)
const buildPhpTask = (cb) => buildPhp(args, cb)
const buildValidateTask = (cb) => buildValidate(args, cb)

///////////////////////// Tasks
// run helloworld task using:  gulp helloworld
exports.helloworld = helloworldTask

exports.default = series(
  parallel(initTask),
  buildLocalsTask,
  parallel(buildCssTask, buildJsTask, build3rdPartiesTask, buildPhpTask, buildRootDirTask),
  buildHtmlTask,
  buildValidateTask,
)

// TODO: Check result:
// - w3c
// - dependencies
// - img...
//
