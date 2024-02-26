// Copyright (c) Pascal Brand
// MIT License

const gulp = require('gulp');
const gulprename = require("gulp-rename");
const { preprocHandlebars } = require('./preproc')
const gulptap = require('gulp-tap');
const gulpif = require('gulp-if');
const gulpHtmlMin = require('gulp-htmlmin');

const optionsHtmlMin = {
  includeAutoGeneratedTags: true,
  removeAttributeQuotes: false,       // TODO!: must be false, otherwise w3c validation is not ok
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  sortClassName: false,               // must be false, otherwise fb and youtube icons are not displayed
  useShortDoctype: true,
  collapseWhitespace: true
};

function buildHtml(args, cb) {
  const src = args.siteRootdir + '/src/hbs/*.hbs'
  const dst = args.siteRootdir + '/' + args.relativeDst
  return gulp.src(src)
    .pipe(gulptap(function (file, t) {
      return preprocHandlebars(args, file)
    }))
    .pipe(gulpif((args.dbg == false), gulpHtmlMin(optionsHtmlMin)))
    .pipe(gulprename(function (path) {
      // Updates the object in-place
      //path.dirname += "/ciao";
      //path.basename += "-goodbye";
      path.extname = ".html";
    }))
    .pipe(gulp.dest(dst))
}

exports.buildHtml = buildHtml