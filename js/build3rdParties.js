// Copyright (c) Pascal Brand
// MIT License

const gulp = require('gulp');

function build3rdParties(args, done) {
  return gulp.src('webtools/3rdparties/**/*.js', {"allowEmpty": true})
    .pipe(gulp.dest(args.siteRootdir + '/' + args.relativeDst + '/js'))
}

exports.build3rdParties = build3rdParties;
