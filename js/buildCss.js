// Copyright (c) Pascal Brand
// MIT License

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const gulprename = require("gulp-rename");
const gulptap = require('gulp-tap');
const { preprocHandlebars } = require('./preproc')

function buildCss(args, done) {
  // check options at https://github.com/sass/node-sass#options
  const sassOptions = {
    outputStyle: ((args.dbg) ? 'expanded' : 'compressed'),   // TODO: depends on dbg
    includePaths: [
      args.siteRootdir + '/src/css',
      './webtools/css',
      './webtools',
    ]
    // from https://sass-lang.com/documentation/js-api/:  style: compressed
  };

  var folders = [
    { src: args.siteRootdir + '/src/css/*.css', dst: args.siteRootdir + '/' + args.relativeDst + '/css', extname: '.css'},
    { src: args.siteRootdir + '/src/css/*.scss', dst: args.siteRootdir + '/' + args.relativeDst + '/css', extname: '.css'},
    { src: args.siteRootdir + '/src/hbs/*.scss', dst: args.siteRootdir + '/tmp', extname: '.css.hbs'},
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
      // .pipe(gulptap(function (file, t) {
      //   console.log(file.basename)
      // }))
      .pipe(gulptap(function (file, t) {
        return preprocHandlebars(args, file)
      }))
      .pipe(sass(sassOptions))
      .pipe(gulprename(function (path) {
        path.basename = path.basename + "-min"
        path.extname = folder.extname
      }))
      .pipe(gulp.dest(folder.dst))

      .on('end', () => reallydone())
  })
};

exports.buildCss = buildCss;
