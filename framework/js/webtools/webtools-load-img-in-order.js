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

function webtools_load_img_in_order() {
  var prio = document.getElementsByClassName('webtools-img-in-order');
  var found = false
  _loadedCompleted()

  for (var element = 0; element < prio.length; element++) {
    var picDefer = prio[element].getElementsByTagName('picture');
    for (var i = 0; i < picDefer.length; i++) {
      var imgDefer = picDefer[i].getElementsByTagName('img');
      for (var j = 0; j < imgDefer.length; j++) {
        if (imgDefer[j].getAttribute('data-src')) {
          imgDefer[j].setAttribute('src', imgDefer[j].getAttribute('data-src'));
          imgDefer[j].removeAttribute('data-src');
          imgDefer[j].setAttribute('onload', 'webtools_load_img_in_order()');
          found = true
        }
      }

      var sourceDefer = picDefer[i].getElementsByTagName('source');    /// try picture.source  or  picture source  as tags
      for (var j = 0; j < sourceDefer.length; j++) {
        if (sourceDefer[j].getAttribute('data-srcset')) {
          sourceDefer[j].setAttribute('srcset', sourceDefer[j].getAttribute('data-srcset'));
          sourceDefer[j].removeAttribute('data-srcset');
          found = true
        }
      }

      if (found) {
        _startLoading()
        if (!_continueLoading()) {
          return
        }
      }
    }

    var imgDefer = prio[element].getElementsByTagName('img');
    for (var j = 0; j < imgDefer.length; j++) {
      if (imgDefer[j].getAttribute('data-src')) {
        imgDefer[j].setAttribute('src', imgDefer[j].getAttribute('data-src'));
        imgDefer[j].removeAttribute('data-src');
        imgDefer[j].setAttribute('onload', 'webtools_load_img_in_order');
        _startLoading()
        if (!_continueLoading()) {
          return
        }
      }
    }
  }
}
