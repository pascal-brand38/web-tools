// Copyright (c) Pascal Brand
// MIT License

const gulphandlebars = require('gulp-hb');

const _digits2 = (number) => number < 10 ? '0' + number : '' + number

function preproc(args, cb) {
  const epoch = Math.round(args.now.getTime() / 1000);

  const data = {
    // time and date
    WEBTOOLS_FILE_VERSION: 'v=' + epoch,
    WEBTOOLS_EPOCH: epoch,
    WEBTOOLS_SECOND: _digits2(args.now.getSeconds()),
    WEBTOOLS_MINUTE: _digits2(args.now.getMinutes()),
    WEBTOOLS_HOUR: _digits2(args.now.getHours()),
    WEBTOOLS_YEAR: args.now.getFullYear(),
    WEBTOOLS_MONTH: _digits2(args.now.getMonth()+1),
    WEBTOOLS_DAY: _digits2(args.now.getDate()),
  }
  return gulphandlebars()
      //.partials('C:/msys64/home/pasca/dev/other/web-design/site/*/dev/partial/*.html')
      // .partials('site/*/dev/partial/*.hbs')
      .data(data)

}

exports.preproc = preproc
