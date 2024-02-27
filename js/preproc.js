// Copyright (c) Pascal Brand
// MIT License

const path = require('path')
var handlebars = require('handlebars');
var handlebarsWax = require('handlebars-wax');


const _digits2 = (number) => number < 10 ? '0' + number : '' + number

function createPreprocVariables(args) {
  const now = new Date()
  const epoch = Math.round(now.getTime() / 1000);

  args.preprocVariables = {
    // time and date
    WEBTOOLS_FILE_VERSION: 'v=' + epoch,
    WEBTOOLS_EPOCH: epoch,
    WEBTOOLS_SECOND: _digits2(now.getSeconds()),
    WEBTOOLS_MINUTE: _digits2(now.getMinutes()),
    WEBTOOLS_HOUR: _digits2(now.getHours()),
    WEBTOOLS_YEAR: now.getFullYear(),
    WEBTOOLS_MONTH: _digits2(now.getMonth()+1),
    WEBTOOLS_DAY: _digits2(now.getDate()),

    // adding private preproc variables
    ...args.gulpConfig.preprocVariables,
  }

  const hboptions = {
    parsePartialName: _parsePartialName
  }
  const hbHelpers = {
    helperMissing: _helperMissing
  }

  // file.contents = Buffer.from('PASCAL')
  args.handlebarswax = handlebarsWax(handlebars, hboptions)
    .helpers(hbHelpers)
    .helpers(args.siteRootdir + '/src/gulp-config/handlebars-helpers.js')
    .helpers('./framework/handlebars-helpers.js')
    .data(args.preprocVariables)
    .data(args.gulpConfig['index.hbs'])
}

// hook to raise an error when a preproc data is not defined
// cf. https://handlebarsjs.com/examples/hook-helper-missing.html
function _helperMissing(/* dynamic arguments */) {
  var options = arguments[arguments.length-1];
  var args = Array.prototype.slice.call(arguments, 0,arguments.length-1)
  throw new Error(`Handlebars: unknown ${options.name}(${args})`)
}

function _parsePartialName(options, file) {
  // from a partial file, return its base name as the default is strange
  // when file does not extend with hbs
  return path.parse(file.path).base
}

function preprocHandlebars(args, file) {
  let localFunctions = require('../' + args.siteRootdir + '/src/gulp-config/locals.js')
  const localPreprocVariables = localFunctions.localPreprocVariables(file)

  let template = args.handlebarswax
  .partials(args.siteRootdir + '/src/partials/*')
  .partials(args.siteRootdir + '/tmp/*')
    .compile(file.contents.toString())
  file.contents = Buffer.from(template({...args.gulpConfig.preprocVariables[file.basename], ...localPreprocVariables}))
}

exports.preprocHandlebars = preprocHandlebars
exports.createPreprocVariables = createPreprocVariables
