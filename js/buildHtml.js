// Copyright (c) Pascal Brand
// MIT License

const gulp = require('gulp');
const gulprename = require("gulp-rename");
const { preproc } = require('./preproc')
const gulptap = require('gulp-tap');

function buildHtmlTask(args, cb) {
  console.log(cb)
  const src = args.siteRootdir + '/src/hbs/*.hbs'
  const dst = args.siteRootdir + '/' + args.relativeDst
  return gulp.src(src)
    .pipe(gulptap(function (file, t) {
      return preproc(args, file, cb)
    }))

    // .pipe(preproc(args))
    .pipe(gulprename(function (path) {
      // Updates the object in-place
      //path.dirname += "/ciao";
      //path.basename += "-goodbye";
      path.extname = ".html";
    }))
    .pipe(gulp.dest(dst))
}

function buildHtml(args, cb) {
  return buildHtmlTask(args, cb)
}

exports.buildHtml = buildHtml
