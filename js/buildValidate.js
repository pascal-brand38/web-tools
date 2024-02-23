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

let readdirSyncCacheList = []

function readdirSyncCache(dir) {
  const cache = readdirSyncCacheList.filter(e => e.dir === dir)
  if (cache.length == 1) {
    return cache[0].filenames
  }

  const filenames = fs.readdirSync(dir)
  readdirSyncCacheList.push({
    dir: dir,
    filenames: filenames,
  })
  return filenames
}

function fileExistsWithCaseSync(filepath) {
  var dir = path.dirname(filepath)
  if (dir === path.dirname(dir)) {
    return true
  }
  const filenames = readdirSyncCache(dir)
  const basename = path.basename(filepath)
  if (basename !== '..' && filenames.indexOf(basename) === -1) {
    return false
  }
  return fileExistsWithCaseSync(dir)
}

async function buildValidateDependencies(args) {
  const dir = args.siteRootdir + '/' + args.relativeDst
  const files = fs.readdirSync(dir, { recursive: true })
  // const files = [ 'index.html', 'css/papadamcats-min.css' ]
  const extList = [ 'png', 'jpg', 'webp', 'gif', 'ico', 'svg', 'css', 'js' ]
  let reStr = undefined
  extList.forEach(e => {
    if (reStr) {
      reStr += '|'
    }
    reStr += '\\.' + e
  })
  const re = new RegExp(reStr,"gi")


  let error = false
  await Promise.all(files.map(async (file) => {
    const fileExt = path.extname(file)
    if ((fileExt === '.html') || (fileExt === '.css') || (fileExt === '.js')) {
      const fileDir = path.dirname(file)

      const fullPath = path.join(dir, file)
      const content = fs.readFileSync(fullPath).toString()

      var match;

      while ((match = re.exec(content)) != null) {    // https://stackoverflow.com/questions/3365902/search-for-all-instances-of-a-string-inside-a-string
        const foundExt = match[0]
        const foundIndex = match.index

        const endIndex = foundIndex + foundExt.length
        const startIndex = Math.max(0, endIndex-256)
        const text = content.slice(startIndex, endIndex)

        if ((fileExt === '.js') && (!'\'`"'.includes(content[endIndex]))) {
          // in js, .css can be the name of variables.
          // this is why we check the ends is a string
          continue
        }

        const lastRegEx = new RegExp('[/a-z0-9\-\.\:\_]+$','gi')
        const found = lastRegEx.exec(text)

        const dep = text.slice(found.index)
        let res = ''
        if (dep.startsWith('https://')) {
          // TODO: CHECK IT EXISTS
          // TODO: CHECK LOCAL IS OK WHEN ON THE SITE TO DISTRIBUTE
          // TODO: CHECK HTTPS IS USED WHEN DISTRIBUTION ON HTTPS
        } else if (dep.startsWith('http://')) {
        } else if ((dep.length === foundExt.length) && (fileExt === '.js')) {
          // we have found .jpg for example, which can be the case in js when building image names
        } else {
          // checking with
          //    if (!fs.existsSync(depPath) || !fs.lstatSync(depPath).isFile())
          // is case insensitive on windows, so Myimg.jpg and myimg.jpg are the same
          // use fileExistsWithCaseSync instead
          const depPath = path.join(dir, fileDir, dep)
          if (!fileExistsWithCaseSync(depPath) || !fs.lstatSync(depPath).isFile()) {
            res = `${depPath} NOT FOUND`
          }
        }

        if (res !== '') {
          console.log(`${res} from ${file}`)
          error = true
        }
      }
    }
  }))

  if (error && !args.dbg) {
    throw('ERROR in buildValidateDependencies')
  }
}

async function buildValidate(args, done) {
  await Promise.all([
    (args.w3c) ? buildValidateMarkup(args) : undefined,
    buildValidateNoMorePreproc(args),
    buildValidateDependencies(args),
  ])
}

exports.buildValidate = buildValidate;
