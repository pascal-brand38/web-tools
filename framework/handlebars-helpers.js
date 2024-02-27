// Copyright (c) Pascal Brand
// MIT License
//
// webtools helpers for handlebars

// to be used in hbs file, using
// {{{webtoolsHelloworld 'Pascal' 'Brand'}}}
function webtoolsHelloworld(text1, text2) {
  let result = ''
  result += `<div>\n`
  result += `  Webtools Hello World from <br>\n`
  result += `  ${text1}\n`
  result += `  <br>\n`
  result += `  ${text2}\n`
  result += `</div>\n`

  return result
}
exports.webtoolsHelloworld = webtoolsHelloworld

function webtoolsTabsBar(args) {
  const hash = args.hash
  const tabsTitle = [ hash.tab1, hash.tab2, hash.tab3, hash.tab4 ]
  const uniqueTabsNumber = args.loc.start.line
  let result = ''
  result += `<nav class="webtools-tabs--bar">\n`
  tabsTitle.forEach((title, index) => {
    if (title !== undefined) {
      const id = `webtools-tab${index+1}-${uniqueTabsNumber}`
      const checked = (index == 0 ? 'checked' : '')
      result += `  <label for="${id}"> ${title}\n`
      result += `    <input type="radio" name="webtools-tabs-${uniqueTabsNumber}" id="${id}" ${checked}>\n`
      result += `  </label>\n`
    }
  })
  result += `</nav>\n`

  /*
  result += `<nav class="webtools-tabs--bar">\n`
  result += `  <label for="tab1-1">hbs / html\n`
  result += `    <input type="radio" name="radiotabs1" id="tab1-1" checked>\n`
  result += `  </label>\n`
  result += `\n`
  result += `  <label for="tab2-1">scss\n`
  result += `    <input type="radio" name="radiotabs1" id="tab2-1">\n`
  result += `  </label>\n`
  result += `\n`
  result += `  <label for="tab3-1">js\n`
  result += `    <input type="radio" name="radiotabs1" id="tab3-1">\n`
  result += `  </label>\n`
  result += `</nav>\n`
  */

  return result
}
exports.webtoolsTabsBar = webtoolsTabsBar
