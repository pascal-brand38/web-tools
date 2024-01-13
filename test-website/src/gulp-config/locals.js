function helloworld() {
  console.log('Hello World')
}

function localPreprocVariables(file) {
  // file.basename is the processed file name
  // to be used by handlebars data
  let res = {}
  return res
}

exports.helloworld = helloworld
exports.localPreprocVariables = localPreprocVariables
