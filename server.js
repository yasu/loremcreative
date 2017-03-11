require('dotenv').config();

var express = require('express'),
    fs = require('fs'),
    rndFlickr = require('rnd-flickr'),
    gm = require('gm');

var settings = {
  "flickr_api_key": process.env.FLICKR_API_KEY,
  "cache_path": "cache",
  "cache_expire": 3600000,
  "max_width": 1200,
  "max_height": 628,
  "default_width": 1200,
  "default_height": 628
}

var app = express();

app.get('/:width?x:height?/:text?/', function(req, res, next) {
  var options = {
    api_key: settings.flickr_api_key,
    cache_path: settings.cache_path,
    cache_expire: settings.cache_expire,
    content_type: 1
  };

  options.width = parseInt(req.params.width);
  if (options.width <= 0) {
    options.width = settings.default_width;
  } else if (options.width > settings.max_width) {
    options.width = settings.max_width;
  }

  options.height = parseInt(req.params.height);
  if (options.height <= 0) {
    options.height = settings.default_height;
  } else if (options.height > settings.max_height) {
    options.height = settings.max_height;
  }

  if (req.params.text) {
    var text = req.params.text;
  }

  rndFlickr(options, function(error, image, data) {
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Length': image.length
    });

    if (text) {
      gm(image)
        .fontSize('80px')
        .fill('#333333')
        .drawText(1, 1, text, 'Center')
        .fill('#FFFFFF')
        .drawText(0, 0, text, 'Center')
        .font('./fonts/mplus-1p-black.ttf')
        .stream().pipe(res);
    } else {
      res.send(image);
    }
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port ' + (process.env.PORT || 3000));
});