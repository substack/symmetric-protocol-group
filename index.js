var multiplex = require('multiplex')
var once = require('once')
var onend = require('end-of-stream')

module.exports = function (streams, cb) {
  cb = once(cb || noop)
  var plex = multiplex()
  plex.once('error', cb)

  var pending = 1
  Object.keys(streams).forEach(function (key) {
    pending += 2
    var shared = plex.createSharedStream(key)
    shared.once('error', cb)
    onend(shared, function () {
      if (--pending === 0) cb(null)
    })
    streams[key].once('error', cb)
    onend(streams[key], function () {
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
