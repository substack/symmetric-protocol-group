var hyperlog = require('hyperlog')
var memdb = require('memdb')
var mreplicate = require('../')

var log0 = hyperlog(memdb('/tmp/a.db'))
var log1 = hyperlog(memdb('/tmp/b.db'))

populate(function () {
  var streams = {
    abc: log0.replicate(),
    xyz: log1.replicate()
  }
  mreplicate(streams, function (err) {
    if (err) console.error(err)
    else console.log('ok')
  })
})

function populate (cb) {
  var pending = 2
  log0.batch([
    { value: 'A' },
    { value: 'B' },
    { value: 'C' }
  ], done)
  log1.batch([
    { value: 'x' },
    { value: 'y' },
    { value: 'z' }
  ], done)
  function done () { if (--pending === 0) cb() }
}
