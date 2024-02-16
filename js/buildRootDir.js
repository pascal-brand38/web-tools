// Copyright (c) Pascal Brand
// MIT License

const path = require('path')
const fs = require('fs');

const gulp = require('gulp');

const gulptap = require('gulp-tap');
const { preproc } = require('./preproc')

function buildRootDir(args, done) {
  var folders = [
    { src: args.siteRootdir + '/src/root-dir/.*', dst: args.siteRootdir + '/' + args.relativeDst},
    { src: args.siteRootdir + '/src/root-dir/*.*', dst: args.siteRootdir + '/' + args.relativeDst},
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
      .pipe(gulptap(function (file, t) {
        return preproc(args, file)
      }))
      .pipe(gulptap(function (file, t) {
        console.log(file.basename)
      }))
      .pipe(gulp.dest(folder.dst))
      .on('end', () => reallydone())
  })
}

exports.buildRootDir = buildRootDir;
