// Copyright (c) Pascal Brand
// MIT License

const gulp = require('gulp');
const gulprename = require("gulp-rename");

function buildHtmlTask(src, dst, cb) {
  return gulp.src(src)
    .pipe(gulprename(function (path) {
      // Updates the object in-place
      //path.dirname += "/ciao";
      //path.basename += "-goodbye";
      path.extname = ".html";
    }))
    .pipe(gulp.dest(dst))
}

function buildHtml(_siteRootdir, _relativeDst, cb) {
  return buildHtmlTask(_siteRootdir + '/src/hbs/*.hbs', _siteRootdir + '/' + _relativeDst, cb)
}

exports.buildHtml = buildHtml
