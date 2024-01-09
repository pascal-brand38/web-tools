// Copyright (c) Pascal Brand
// MIT License

const fs = require('fs')
const gulp = require('gulp');
const { series, parallel } = require('gulp');
const { buildHtml } = require('./js/buildHtml')
const { createPreprocVariables } = require('./js/preproc')


////////////////////////////////////////////////////////////////////// Initialization

console.log(buildHtml)

// TODO: remove these hard values
const args = {
  siteRootdir: '../web-portfolio',
  relativeDst: 'dist',
}

async function initTask() {
  args.gulpConfig = await JSON.parse(fs.readFileSync(args.siteRootdir + '/gulp-config.json', 'utf8'))
  createPreprocVariables(args)
  console.log(args)
}


////////////////////////////////////////////////////////////////////// Tasks

function helloworldTask(cb) {
  console.log('Hello World')
  cb()
}

const buildHtmlTask = (cb) => buildHtml(args, cb)

///////////////////////// Tasks
// run helloworld task using:  gulp helloworld
exports.helloworld = helloworldTask

exports.default = series(
  initTask,
  buildHtmlTask,
)
