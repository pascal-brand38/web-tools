// Copyright (c) Pascal Brand
// MIT License

const path = require('path')
const fs = require('fs');

const gulp = require('gulp');

const gulprename = require("gulp-rename");
const gulptap = require('gulp-tap');
const gulpuglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const gulppreprocess = require('gulp-preprocess');
const { preprocHandlebars } = require('./preproc')

function buildJs(args, done) {
  var folders = [
    { src: args.siteRootdir + '/src/js/*.js', dst: args.siteRootdir + '/' + args.relativeDst + '/js', extname: '.js'},
    { src: args.siteRootdir + '/src/hbs/*.js', dst: args.siteRootdir + '/tmp', extname: '.js.hbs'},
    { src: args.siteRootdir + '/src/root-dir/js/*.js', dst: args.siteRootdir + '/' + args.relativeDst, extname: '.js' },
  ]

  // callback to know when this task is completed
  var nbdone = 0;
  function reallydone() {
    nbdone ++;
    if (nbdone === folders.length) {
      done()
    }
  }

  folders.forEach(function(folder){
    return gulp.src(folder.src, {"allowEmpty": true})
      .pipe(gulppreprocess({
          includeBase: 'webtools/js',   // used to have directives:  // @include webtools.js
      }))
      .pipe(gulptap(function (file, t) {
        return preprocHandlebars(args, file)
      }))
      // .pipe(gulptap(function (file, t) {
      //   console.log(file.basename)
      // }))
      .pipe(gulpif((args.dbg == false), gulpuglify()))
      .pipe(gulprename(function (path) {
        path.basename = path.basename + "-min"
        path.extname = folder.extname
      }))
      .pipe(gulp.dest(folder.dst))
      .on('end', () => reallydone())
  })
}

exports.buildJs = buildJs;
