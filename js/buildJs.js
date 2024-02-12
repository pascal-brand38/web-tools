// Copyright (c) Pascal Brand
// MIT License

const path = require('path')
const fs = require('fs');

const gulp = require('gulp');
const { series, parallel } = require('gulp');
const { preproc } = require('./preproc')

// npm install sass gulp-sass --save-dev
const gulprename = require("gulp-rename");
// const gulpcontains = require('gulp-contains');
// const gulpuglify = require('gulp-uglify');
// const gulplazypipe = require('lazypipe');
// const gulpfileinclude = require('gulp-file-include');
// const gulpjsonreplace = require('gulp-json-replace');
// const gulpif = require('gulp-if');
// const gulpminimist = require('minimist');
// const gulpHtmlMin = require('gulp-htmlmin');
// const gulpbabel = require('gulp-babel');
const gulptap = require('gulp-tap');
const gulppreprocess = require('gulp-preprocess');
// const child_process = require('child_process');
// const readline = require('readline');
// const ffmpeg = require('fluent-ffmpeg');

function buildJs(args, done) {
  var folders = [
    { src: args.siteRootdir + '/src/js/*.js', dst: args.siteRootdir + '/' + args.relativeDst + '/js', extname: '.js'},
    { src: args.siteRootdir + '/src/hbs/*.js', dst: args.siteRootdir + '/tmp', extname: '.js.hbs'},
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
          includeBase: 'webtools/js',
      }))
      // .pipe(gulptap(function (file, t) {
      //   console.log(file.basename)
      // }))
      .pipe(gulprename(function (path) {
        path.basename = path.basename + "-min"
        path.extname = folder.extname
      }))
      .pipe(gulp.dest(folder.dst))
      .on('end', () => reallydone())
  })
}

exports.buildJs = buildJs;
