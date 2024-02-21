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


async function buildValidateDependencies(args) {
  const dir = args.siteRootdir + '/' + args.relativeDst
  const files = fs.readdirSync(dir, { recursive: true })
  // const files = [ 'index.html', 'css/papadamcats-min.css' ]

  const allErrors = await Promise.all(files.map(async (file) => {
    let errors = []
    const ext = path.extname(file)
    if ((ext === '.html') || (ext === '.css') || (ext === '.js')) {
      const fileDir = path.dirname(file)

      const fullPath = path.join(dir, file)
      const content = fs.readFileSync(fullPath).toString()
      const re = new RegExp('\\.JPG|\\.WEBP|\\.JS',"gi")

      var match, matches = [];

      while ((match = re.exec(content)) != null) {    // https://stackoverflow.com/questions/3365902/search-for-all-instances-of-a-string-inside-a-string
        matches.push(match.index)
        // console.log(match[0], match.index)

        const text = content.slice(0, match.index + match[0].length)
        // console.log('CONTENT: ' + text)
        const lastRegEx = new RegExp('[/a-z0-9\-\.\:\_]+$','gi')
        const start = lastRegEx.exec(text)

        const dep = text.slice(start.index)
        let res = ''
        if (dep.startsWith('https://')) {
          // TODO: CHECK IT EXISTS
          // TODO: CHECK LOCAL IS OK WHEN ON THE SITE TO DISTRIBUTE
          // TODO: CHECK HTTPS IS USED WHEN DISTRIBUTION ON HTTPS
          res = ''
        } else if (dep.startsWith('http://')) {
          res = ''
        } else if (dep.length === match[0].length) {
          res = ''    // we have found .jpg for example, which can be the case in js when building image names
        } else {
          const depPath = path.join(dir, fileDir, dep)
          if (!fs.existsSync(depPath) || !fs.lstatSync(depPath).isFile()) {
            res = 'DOES NOT EXIST'
          }
        }
        if (res !== '') {
          console.log(`${dep} ${res} from ${file}`)
        }
      }
    }
  }))
}

async function buildValidate(args, done) {
  await Promise.all([
    // buildValidateMarkup(args),
    // buildValidateNoMorePreproc(args),
    buildValidateDependencies(args),
  ])
}

exports.buildValidate = buildValidate;
