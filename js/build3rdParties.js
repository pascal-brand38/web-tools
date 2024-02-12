// Copyright (c) Pascal Brand
// MIT License

const gulp = require('gulp');
const gulprename = require('gulp-rename');

function folder(file) {
  console.log(file)
  return undefined
}

function build3rdParties(args, done) {
  return gulp.src('webtools/3rdparties/**/*.{js,css}', {"allowEmpty": true})
    .pipe(gulprename(function (path) { path.dirname = path.extname.slice(start=1); }))
    .pipe(gulp.dest(args.siteRootdir + '/' + args.relativeDst))
}

exports.build3rdParties = build3rdParties;
