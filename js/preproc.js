// Copyright (c) Pascal Brand
// MIT License

const path = require('path')
const gulphandlebars = require('gulp-hb');

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
}

function _parsePartialName(options, file) {
  // from a partial file, return its base name as the default is strange
  // when file does not extend with hbs
  return path.parse(file.path).base
}

function preproc(args, cb) {
  const hboptions = {
    parsePartialName: _parsePartialName
  }
  return gulphandlebars( { parsePartialName: _parsePartialName})
    .partials(args.siteRootdir + '/src/partials/*')
    .data(args.preprocVariables)
}

exports.preproc = preproc
exports.createPreprocVariables = createPreprocVariables
