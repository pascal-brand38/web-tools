//
// (c) webtools
//
// Initialize the JS framework

// load defered image
// it looks at all <img> and <source> that have an inherited class (for example a picture) of 'priority_class'
// for exanple, in the html
//    <picture class="webtools-img-priority2">
//      <source type="image/webp" data-srcset="img/210729-vrac-04-256 . webp"> <!-- screen up to 366px (70% of 256) -->
//      <source type="image/jpeg" data-srcset="img/210729-vrac-04-256 . jpg" >
//      <img srcset="img/thumb-128x59 . png" data-src="img/210729-vrac-04-512 . jpg">
//    </picture>
// and the JS calling at onload event
//    webtools_load_deferred_images('webtools-img-priority2');
function webtools_load_deferred_images(priority_class) {
  var prio = document.getElementsByClassName(priority_class);

  for (var element=0; element<prio.length; element++) {
    var imgDefer = prio[element].getElementsByTagName('img');
    for (var i=0; i<imgDefer.length; i++) {
      if(imgDefer[i].getAttribute('data-src')) {
        imgDefer[i].setAttribute('src',imgDefer[i].getAttribute('data-src'));
      }
    }

    var sourceDefer = prio[element].getElementsByTagName('source');    /// try picture.source  or  picture source  as tags
    for (var i=0; i<sourceDefer.length; i++) {
      if(sourceDefer[i].getAttribute('data-srcset')) {
        sourceDefer[i].setAttribute('srcset',sourceDefer[i].getAttribute('data-srcset'));
      }
    }
  }
}

// From   https://stackoverflow.com/questions/38156388/delay-javascript-loading
function webtools_load_js(url, async, defer) {
  var script = document.createElement('script');
  script.src = url;
  if (async) {
    script.setAttribute('async', 'true');
  }
  if (defer) {
    script.setAttribute('defer', 'true');
  }
  document.documentElement.firstChild.appendChild(script);
}

// load google tag manager (google analytics), given the id of your website
function webtools_googletagmanager(id) {
  // Global site tag (gtag(dot)js) - Google Analytics
  webtools_load_js('https://www.googletagmanager.com/gtag/js?id=' + id, false, false)

  // google analytics init
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', id);   // ID from google analytics
}

// webfont loading utilities
function webtools_webfont_load_01(font_01) {
  WebFont.load({
    google: {
      families: [ font_01 ]
    }
  });
}
function webtools_webfont_load_02(font_01, font_02) {
  WebFont.load({
    google: {
      families: [ font_01, font_02 ]
    }
  });
}

// Initialization of JS
// called when window is loading
function webtools_onload() {
  // webtools_onload_this_html() is the "local" init function, specific to any html if required
  if (typeof webtools_onload_this_html == 'function') {
    webtools_onload_this_html();
  }
  if (typeof webtools_onload_all_html == 'function') {
    webtools_onload_all_html();
  }
}
window.onload = webtools_onload;


// Service workers
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service_worker-min.js').then(function(registration) {
      // Registration was successful
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
      console.log('Cannot open file service_worker-min.js');
    });
  });
}

/*
 * feature support by the browser
 */

// webp support, from
//    https://stackoverflow.com/questions/5573096/detecting-webp-support
//    https://developers.google.com/speed/webp/faq#how_can_i_detect_browser_support_for_webp
// webtools_check_support_webp:
//   'feature' can be one of 'lossy', 'lossless', 'alpha' or 'animation'.
//   'callback(feature, result)' will be passed back the detection result (in an asynchronous way!)
//
// For example, call
//    webtools_add_support_webp('alpha');
// to set class .webtools-support-webp-alpha or .webtools-support-no-webp-alpha on body
// and then use the following in your css
//            .webtools-support-no-webp-alpha [class^="webtools-ia-"]::after {
//              background-image:url(../img/icons.png?P___V3DEV_BUILTIN_FILE_VERSION);
//            }
function webtools_check_support_webp(feature, callback) {
  var kTestImages = {
      lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
      lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
      alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
      animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
  };
  var img = new Image();
  img.onload = function () {
      var result = (img.width > 0) && (img.height > 0);
      callback(feature, result);
  };
  img.onerror = function () {
      callback(feature, false);
  };
  img.src = "data:image/webp;base64," + kTestImages[feature];
}

function webtools_add_support_webp(feature) {
  webtools_check_support_webp(feature, function (feature, isSupported) {
    if (isSupported) {
      document.body.classList.add('webtools-support-webp-' + feature);
    } else {
      document.body.classList.add('webtools-support-no-webp-' + feature);
    }
  });
}
