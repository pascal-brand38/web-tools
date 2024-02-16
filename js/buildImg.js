// Copyright (c) Pascal Brand
// MIT License

const fs = require('fs')

// https://stackoverflow.com/questions/30763496/how-to-promisify-nodes-child-process-exec-and-child-process-execfile-functions
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function runcommand(command) {
  try {
    const { stdout, stderr } = await exec(command);
    console.log(stdout);
    console.log(stderr);
  } catch (e) {
    console.error(e); // should contain code (exit code) and signal (that caused the termination).
  }
}

async function buildSprite(args) {
  const spriteName = args.siteRootdir + '/src/img/sprite/sprite.json'
  if (!fs.existsSync(spriteName)) {
    console.log(`Sprite file ${spriteName} does not exist`)
  } else {
    await runcommand(`python -m spriteforhtml --json ${spriteName}`)
  }
}

async function buildImgLogo(args) {
  const srcName = args.siteRootdir + '/src/img/logo'
  if (!fs.existsSync(srcName)) {
    console.log(`Dir name ${srcName} does not exist`)
  } else {
    await runcommand(`python -m responsiveimage --src-dir ${srcName} --dst-dir ${args.siteRootdir + '/' + args.relativeDst + '/img'} --export-to-webp`)
  }
}


async function buildImg(args, done) {
  const { buildLocalImg } = require('../' + args.siteRootdir + '/src/gulp-config/buildLocal')

  await Promise.all([
    buildImgLogo(args),
    buildSprite(args),
    buildLocalImg(args),
    ])
}

exports.buildImg = buildImg
