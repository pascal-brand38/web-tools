// Copyright (c) Pascal Brand
// MIT License

const fs = require('fs')
const path = require('path')
const validator = require('html-validator')

async function w3cHtmlValidate(htmlStr, excludeList) {
  const validatorOptions = {
    //validator: 'WHATWG',    // local validation, without sending data to w3c - https://www.npmjs.com/package/html-validator#whatwg
    //format: 'text',
    data: htmlStr,
  }

  let results = await validator(validatorOptions)
  results = results.messages
  if (excludeList) {
    excludeList.forEach(e => results = results.filter((res) => !res[e.prop].includes(e.str)))
  }
  return results
}


async function buildValidateHtml(args) {
  // TODO: have excludeList specific for each html file
  const excludeList = args.gulpConfig.w3cHtmlValidateExcludeList

  const dir = args.siteRootdir + '/' + args.relativeDst
  const files = fs.readdirSync(dir, { recursive: true })

  const allErrors = await Promise.all(files.map(async (file) => {
      if (file.endsWith('.html')) {
        const fullPath = path.join(dir, file)
        const content = fs.readFileSync(fullPath)
        const errors = await w3cHtmlValidate(content, excludeList)
        if (errors.length != 0) {
          return { file: file, errors: errors }
        }
      }
    })
  )
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
  await buildValidateHtml(args)
  await buildValidateNoMorePreproc(args)
}

exports.buildValidate = buildValidate;
