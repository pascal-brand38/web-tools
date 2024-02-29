// Copyright (c) Pascal Brand
// MIT License

const fs = require('fs')
const path = require('path')
const validator = require('html-validator')
const cssValidator = require('w3c-css-validator');

async function w3cMarkupValidate(ext, str, excludeList) {
  if (str.length === 0) {
    return []
  }
  let results
  if (ext === '.html') {
    const validatorOptions = {
      //validator: 'WHATWG',    // local validation, without sending data to w3c - https://www.npmjs.com/package/html-validator#whatwg
      //format: 'text',
      data: str,
    }

    results = await validator(validatorOptions)
    results = results.messages
  } else if (ext === '.css') {
    await new Promise(r => setTimeout(r, 1000));    // wait for 1sec as told in https://jigsaw.w3.org/css-validator/manual.html
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
  const files = fs.readdirSync(dir, { recursive: true }).filter(file => ['.html', '.css'].includes(path.extname(file)))

  let allErrors = []
  for (const index in files) {
    const file = files[index]
    console.log(file)
    const fullPath = path.join(dir, file)
    const content = fs.readFileSync(fullPath).toString()
    const errors = await w3cMarkupValidate(path.extname(file), content, excludeList)
    if ((errors) && (errors.length != 0)) {
      allErrors.push({ file: file, errors: errors })
    }
  }

  if (allErrors.length != 0) {
    const msg = JSON.stringify(allErrors, null, 2)
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
  // const files = [ 'index.html' ]
  const extList = [ 'png', 'jpg', 'webp', 'gif', 'ico', 'svg', 'css', 'js', 'php' ]
  // const extList = [ 'png' ]
  let reStr = ''
  extList.forEach(e => {
    if (reStr !== '') {
      reStr += '|'
    }
    reStr += '\\.' + e
  })
  const re = new RegExp(reStr,"gi")


  let error = false
  await Promise.all(files.map(async (file) => {
    const fileExt = path.extname(file)
    if ((fileExt === '.html') || (fileExt === '.css') || (fileExt === '.js') || (fileExt === '.php')) {
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
          try {
            if (!fileExistsWithCaseSync(depPath) || !fs.lstatSync(depPath).isFile()) {
              res = `${depPath} NOT FOUND`
            }
          } catch {
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
