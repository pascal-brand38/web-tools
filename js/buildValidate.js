// Copyright (c) Pascal Brand
// MIT License

const fs = require('fs')
const path = require('path')
const validator = require('html-validator')
const cssValidator = require('w3c-css-validator');


async function w3cMarkupValidate(ext, str, excludeList) {
  let results = []
  if (ext === '.html') {
    const validatorOptions = {
      //validator: 'WHATWG',    // local validation, without sending data to w3c - https://www.npmjs.com/package/html-validator#whatwg
      //format: 'text',
      data: str,
    }

    results = await validator(validatorOptions)
    results = results.messages
  } else if (ext === '.css') {
    results = await cssValidator.validateText(str);
    results = results.errors
  } else {
    throw `w3cMarkupValidate(): WRONG EXTENSION: ${ext}`
  }

  if (excludeList) {
    excludeList.forEach(e => results = results.filter((res) => ext!==e.ext || !res[e.prop].includes(e.str)))
  }
  return results
}


async function buildValidateMarkup(args) {
  // TODO: have excludeList specific for each html file
  const excludeList = args.gulpConfig.w3cMarkupValidate

  const dir = args.siteRootdir + '/' + args.relativeDst
  const files = fs.readdirSync(dir, { recursive: true })

  const allErrors = await Promise.all(files.map(async (file) => {
    let errors = []
    const ext = path.extname(file)
    if ((ext === '.html') || (ext === '.css')) {
      const fullPath = path.join(dir, file)
      const content = fs.readFileSync(fullPath).toString()
      errors = await w3cMarkupValidate(ext, content, excludeList)
    }

    if ((errors) && (errors.length != 0)) {
      return { file: file, errors: errors }
    }
  }))

  const errors = allErrors.filter(r => r!==undefined)
  if (errors.length != 0) {
    const msg = JSON.stringify(errors, null, 2)
    if (args.dbg) {
      console.log(msg)
    } else {
      throw(msg)
    }
  }
}

async function buildValidateNoMorePreproc(args) {
  const dir = args.siteRootdir + '/' + args.relativeDst
  const files = fs.readdirSync(dir, { recursive: true })
  files.forEach(file => {
    const fullPath = path.join(dir, file)
    if (fs.lstatSync(fullPath).isFile()) {
      const content = fs.readFileSync(fullPath)
      if (content.includes('WEBTOOLS_')) {
        const msg = `MACROS WEBTOOLS_ NOT RESOLVED in ${fullPath}`
        if (args.dbg) {
          console.log(msg)
        } else {
          throw(msg)
        }
      }
    }
  })
}



async function buildValidate(args, done) {
  await Promise.all([
    buildValidateMarkup(args),
    buildValidateNoMorePreproc(args),
  ])
}

exports.buildValidate = buildValidate;
