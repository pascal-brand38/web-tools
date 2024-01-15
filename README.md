# Introduction

```web-tools``` helps buildin a website.

# Installation

```
npm install
```

This will install
* ```npm install yargs```: read commandline arguments
* ```npm install gulp-cli```: the gulp commandline
* ```npm install gulp```: to be able to run tasks, such as ```gulp helloworld```
* ```npm install handlebars handlebars-wax```: handlebars / mustache for preprocessing
* ```npm install sass gulp-sass```: css preprocessor
* ```npm install gulp-rename```:
  rename a stream, so that the destination has a different name than the source
  (```.hbs``` to ```.html``` for example)


# Run

Run using

```
npm run build -- -site-root-dir <mysite>
```

Default website is test-website.


# test-website

This is a sample website, compiled using command ```npm run build```. It contains:
* ```dist```: the result repository
* ```src```: all the sources, including handlebars files, scss, js used by the website, and gulp configuration

## src/hbs
Handlebars file, used to build html files.
In order to use handlebars, you may use:
* ```{{{WEBTOOLS_HOUR}}}```: variable to be replaced
* ```{{> footer.hbs}}```: include a partial named ```partials/footer.hbs```
* ```{{{helloworld "First line" "Second line"}}}```: run a js function, named helloworld,
  which is in ```gulp-config/handlebars-helpers.js```, to render html
