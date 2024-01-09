// Copyright (c) Pascal Brand
// MIT License

const gulp = require('gulp');
const { series, parallel } = require('gulp');
const { buildHtml } = require('./js/buildHtml.js')

console.log(buildHtml)

// TODO: remove these hard values
const _siteRootdir = '../web-portfolio'
const _relativeDst = 'dist'

function helloworldTask(cb) {
  console.log('Hello World')
  cb()
}

const buildHtmlTask = (cb) => buildHtml(_siteRootdir, _relativeDst, cb)

///////////////////////// Tasks
// run helloworld task using:  gulp helloworld
exports.helloworld = helloworldTask

exports.default = series(
  buildHtmlTask,
)
