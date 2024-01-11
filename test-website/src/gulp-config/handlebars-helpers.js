// Copyright (c) Pascal Brand
// MIT License

//const gulphandlebars = require('gulp-hb');

function helloworld(text1, text2) {
  let result = ''
  result += `<div>\n`
  result += `  ${text1}\n`
  result += `  <br>\n`
  result += `  ${text2}\n`
  result += `</div>\n`

  return result
}

exports.helloworld = helloworld
