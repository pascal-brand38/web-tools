// https://www.npmjs.com/package/gulp-json-replace
// https://www.npmjs.com/package/gulp-replace-task

const path = require('path')
const fs = require('fs');

const gulp = require('gulp');
const { series, parallel } = require('gulp');

// npm install sass gulp-sass --save-dev
const sass = require('gulp-sass')(require('sass'));
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
// const child_process = require('child_process');
// const readline = require('readline');
// const ffmpeg = require('fluent-ffmpeg');


function buildCssTask(args, done) {
  // check options at https://github.com/sass/node-sass#options
  const sassOptions = {
    outputStyle: ((true) ? 'expanded' : 'compressed'),   // TODO: depends on dbg
    includePaths: [
      args.siteRootdir + '/src/css',
      './webtools/css',
      './webtools',
    ]
    // from https://sass-lang.com/documentation/js-api/:  style: compressed
  };
  // const sassOptions = {};

  var folders = [
    { src: args.siteRootdir + '/src/css/*.css', dst: args.siteRootdir + '/' + args.relativeDst + '/css', },
    { src: args.siteRootdir + '/src/css/*.scss', dst: args.siteRootdir + '/' + args.relativeDst + '/css', },
  ]

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
        console.log(file.basename)
      }))
      .pipe(sass(sassOptions))
      .pipe(gulprename(function (path) { path.basename = path.basename + "-min"; }))
      .pipe(gulp.dest(folder.dst))

      .on('end', () => reallydone())
  })


  // files.forEach(function(element, index) {
  //   src = element[0]
  //   dst = element[1]
  //   return gulp.src(src, {"allowEmpty": true})
  //   .pipe(preproc.fileSpecific())
  //   .pipe(gulptap(preproc.builtin))
  //   .pipe(preproc.specific())
  //   .pipe(sass(sassOptions))
  //   .pipe(gulprename(function (path) { path.basename = path.basename + "-min"; }))
  //   .pipe(gulp.dest(dst))
  //     .on('end', () => reallydone())
  //     ;
  // });

};

function buildCss(args, cb) {
  return buildCssTask(args, cb)
}

exports.buildCss = buildCss;
