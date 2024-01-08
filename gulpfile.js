// Copyright (c) Pascal Brand
// MIT License

const gulp = require('gulp');
const { series, parallel } = require('gulp');
const gulprename = require("gulp-rename");


function helloworldTask(cb) {
  console.log('Hello World')
  cb()
}

function buildHtmlTask(done) {
  src = '../web-portfolio/src/hbs/*.hbs'
  dst = '../web-portfolio/dist'
  return gulp.src(src)
    .pipe(gulprename(function (path) {
      // Updates the object in-place
      //path.dirname += "/ciao";
      //path.basename += "-goodbye";
      path.extname = ".html";
    }))
    .pipe(gulp.dest(dst))
}

///////////////////////// Tasks
// run helloworld task using:  gulp helloworld
exports.helloworld = helloworldTask
exports.buildHtml = buildHtmlTask

exports.default = series(
  buildHtmlTask,
)
