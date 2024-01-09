// Copyright (c) Pascal Brand
// MIT License

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

function preproc(args, cb) {
  return gulphandlebars()
      .data(args.preprocVariables)
}

exports.preproc = preproc
exports.createPreprocVariables = createPreprocVariables
