var multiplex = require('multiplex')
var once = require('once')
var onend = require('end-of-stream')

module.exports = function (streams, cb) {
  cb = once(cb || noop)
  var plex = multiplex()
  plex.once('error', cb)

  var pending = 1
  Object.keys(streams).forEach(function (key) {
    pending++
    var shared = plex.createSharedStream(key)
    shared.once('error', cb)
    streams[key].once('error', cb)
    onend(streams[key], function () {
      plex.emit('stream-close', key)
      if (--pending === 0) cb(null)
    })
    shared.pipe(streams[key]).pipe(shared)
  })
  if (--pending === 0) {
    process.nextTick(function () { cb(null) })
  }
  return plex
}

function noop () {}
