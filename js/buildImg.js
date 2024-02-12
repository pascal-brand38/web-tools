// Copyright (c) Pascal Brand
// MIT License

const fs = require('fs')
const child_process = require('child_process');
const gulp = require('gulp');

function runpython(list_args, cb) {
  var python = child_process.spawn('python', list_args);

  python.stdout.on('data', function (data) {
    console.log(data.toString());
  });

  python.stderr.on('data', function (data) {
    console.log(data.toString());
  });

  python.on('exit', function (code) {
    if (code == 0) {
      cb();
    } else {
      cb(new Error("Failure"))
    }
  });
}

function buildSprite(args, done) {
  const spriteName = args.siteRootdir + '/src/img/sprite/sprite.json'
  if (!fs.existsSync(spriteName)) {
    console.log(`Sprite file ${spriteName} does not exist`)
    done()
  } else {
    runpython([
      '-m',
      'spriteforhtml',
      '--json',
      spriteName
    ], done)
  }
}

function buildImgLogo(args, done) {
  const srcName = args.siteRootdir + '/src/img/logo'
  if (!fs.existsSync(srcName)) {
    console.log(`Dir name ${srcName} does not exist`)
    done()
  } else {
    runpython([
      '-m',
      'responsiveimage',
      '--src-dir', srcName,
      '--dst-dir', args.siteRootdir + '/' + args.relativeDst + '/img',
      '--export-to-webp',
    ], done)
  }
}


function buildImg(args, done) {
  const { buildLocalImg } = require('../' + args.siteRootdir + '/src/gulp-config/buildLocal')

  const funcs = [ buildImgLogo, buildSprite, buildLocalImg ]
  let nbdone = 0;
  function completeTask(e) {
    if (e) {
      throw e
    } else {
      nbdone ++;
      if (nbdone === funcs.length) {
        done()
      }
    }
  }

  funcs.forEach(func => func(args, completeTask))
}

exports.buildImg = buildImg
