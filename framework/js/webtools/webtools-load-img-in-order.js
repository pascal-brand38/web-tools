//
// (c) webtools
//
// Load images in order
//
// Call webtools_load_img_in_order() to load every images / pictures
// that have a parent class 'webtools_load_img_in_order' in order, by bucket
// of 6 images
// Note that 'pictures' are loaded before 'img' alone tags.


// use var instead of let to avoid errors on chrome-48 related to "Block scope declaration"
var _nLoadingInOrder = undefined      // number of currently images being loaded in parallel
function _loadedCompleted() {         // the loading of an image is completed
  if (_nLoadingInOrder === undefined) {
    _nLoadingInOrder = 1
  }
  if (_nLoadingInOrder >= 1) {
    _nLoadingInOrder = _nLoadingInOrder - 1
  }
}
function _startLoading() {            // start the loading of an image
  _nLoadingInOrder = _nLoadingInOrder + 1
}

function _continueLoading() {         // should we load another one, or wait for the completion of a currently loading image
  return (_nLoadingInOrder <= 6)   // true if one should wait before loading another one
}

var _webtoolsNClass = 0
var _webtoolsPicture = 0
var _webtoolsImg = 0
function webtools_load_img_in_order() {
  var prio = document.getElementsByClassName('webtools-img-in-order');
  var found = false
  var attr
  _loadedCompleted()

  for (var element = _webtoolsNClass; element < prio.length; element++) {
    var picDefer = prio[element].getElementsByTagName('picture');
    for (var i = _webtoolsPicture; i < picDefer.length; i++) {
      var imgDefer = picDefer[i].getElementsByTagName('img');
      for (var j = 0; j < imgDefer.length; j++) {
        attr = imgDefer[j].getAttribute('data-src')
        if (attr) {
          imgDefer[j].setAttribute('src', attr);
          imgDefer[j].removeAttribute('data-src');
          imgDefer[j].setAttribute('onload', 'webtools_load_img_in_order()');
          found = true
        }
      }

      var sourceDefer = picDefer[i].getElementsByTagName('source');    /// try picture.source  or  picture source  as tags
      for (var j = 0; j < sourceDefer.length; j++) {
        attr = sourceDefer[j].getAttribute('data-srcset')
        if (attr) {
          sourceDefer[j].setAttribute('srcset', attr);
          sourceDefer[j].removeAttribute('data-src');
          found = true
        }
      }

      _webtoolsPicture = _webtoolsPicture + 1

      if (found) {
        _startLoading()
        if (!_continueLoading()) {
          return
        }
      }
    }

    var imgDefer = prio[element].getElementsByTagName('img');
    for (var j = _webtoolsImg; j < imgDefer.length; j++) {
      _webtoolsImg = _webtoolsImg + 1
      attr = imgDefer[j].getAttribute('data-src')
      if (attr) {
        imgDefer[j].setAttribute('src', attr);
        imgDefer[j].removeAttribute('data-src');
        imgDefer[j].setAttribute('onload', 'webtools_load_img_in_order()');

        _startLoading()
        if (!_continueLoading()) {
          return
        }
      }
    }
    _webtoolsPicture = 0
    _webtoolsImg = 0
    _webtoolsNClass = _webtoolsNClass + 1
  }
}
