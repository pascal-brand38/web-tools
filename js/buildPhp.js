// Copyright (c) Pascal Brand
// MIT License

const gulp = require('gulp');
const gulptap = require('gulp-tap');

function buildPhp(args, done) {
  return gulp.src(args.siteRootdir + '/src/php/*', {"allowEmpty": true})
    .pipe(gulptap(function (file, t) {
      console.log(file.basename)
    }))
    .pipe(gulp.dest(args.siteRootdir + '/' + args.relativeDst + '/php'))
}

exports.buildPhp = buildPhp;
