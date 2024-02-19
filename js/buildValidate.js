// Copyright (c) Pascal Brand
// MIT License

const fs = require('fs')
const path = require('path')
// const w3cHtmlValidator = require('w3c-html-validator')

async function buildValidateHtml(args) {
  // const filename = args.siteRootdir + '/' + args.relativeDst + '/index.html'
  // const options = { filename: 'docs/index.html' };
  // w3cHtmlValidator.validate(options).then(console.log);

}

async function buildValidateNoMorePreproc(args) {
  const dir = args.siteRootdir + '/' + args.relativeDst
  const files = fs.readdirSync(dir, { recursive: true })
  files.forEach(file => {
    const fullPath = path.join(dir, file)
    if (fs.lstatSync(fullPath).isFile()) {
      const content = fs.readFileSync(fullPath)
      if (content.includes('WEBTOOLS_')) {
        if (args.dbg) {
          console.log(`MACROS WEBTOOLS_ NOT RESOLVED in ${fullPath}`)
        } else {
          throw(`MACROS WEBTOOLS_ NOT RESOLVED in ${fullPath}`)
        }
      }
    }
  })

}



async function buildValidate(args, done) {
  await buildValidateHtml(args)
  await buildValidateNoMorePreproc(args)
}

exports.buildValidate = buildValidate;
