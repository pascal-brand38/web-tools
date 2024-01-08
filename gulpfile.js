// run helloworld taksk using:  gulp helloworld
function helloworldTask(cb) {
  console.log('Hello World')
  cb();
}

exports.helloworld = helloworldTask
