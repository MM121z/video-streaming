var websocket = new WebSocket('ws://localhost:7777');
websocket.binaryType = 'arraybuffer';

var mediaSource = new MediaSource();
var buffer;
var queue = [];

var video = document.getElementById('localVideo');;
video.src = window.URL.createObjectURL(mediaSource);

mediaSource.addEventListener('sourceopen', function(e) {
  video.play().then(function() {
    // Automatic playback started!
  }).catch(function(error) {
      console.log('--- error play', error);
      
    // Automatic playback failed.
    // Show a UI element to let the user manually start playback.
  });

  buffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');

  buffer.addEventListener('updatestart', function(e) { console.log('updatestart: ' + mediaSource.readyState); });
  buffer.addEventListener('update', function(e) { console.log('update: ' + mediaSource.readyState); });
  buffer.addEventListener('updateend', function(e) { console.log('updateend: ' + mediaSource.readyState); });
  buffer.addEventListener('error', function(e) { console.log('error: ' + mediaSource.readyState); });
  buffer.addEventListener('abort', function(e) { console.log('abort: ' + mediaSource.readyState); });

  buffer.addEventListener('update', function() { // Note: Have tried 'updateend'
    if (queue.length > 0 && !buffer.updating) {
      buffer.appendBuffer(queue.shift());
    }
  });
}, false);

mediaSource.addEventListener('sourceopen', function(e) { console.log('sourceopen: ' + mediaSource.readyState); });
mediaSource.addEventListener('sourceended', function(e) { console.log('sourceended: ' + mediaSource.readyState); });
mediaSource.addEventListener('sourceclose', function(e) { console.log('sourceclose: ' + mediaSource.readyState); });
mediaSource.addEventListener('error', function(e) { console.log('error: ' + mediaSource.readyState); });

websocket.addEventListener('message', function(e) {
  if (typeof e.data !== 'string') {
    if (buffer.updating || queue.length > 0) {
      queue.push(e.data);
    } else {
      buffer.appendBuffer(e.data);
    }
  }
}, false);