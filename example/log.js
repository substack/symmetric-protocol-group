var hyperlog = require('hyperlog')
var memdb = require('memdb')
var sym = require('../')

var log0 = hyperlog(memdb('/tmp/a.db'))
var log1 = hyperlog(memdb('/tmp/b.db'))
var log2 = hyperlog(memdb('/tmp/c.db'))
var log3 = hyperlog(memdb('/tmp/d.db'))

populate(function () {
  var streams0 = {
    abc: log0.replicate(),
    xyz: log1.replicate()
  }
  var streams1 = {
    abc: log2.replicate(),
    xyz: log3.replicate()
  }
  var a = sym(streams0, function (err) {
    if (err) console.error(err)
    else console.log('ok 0')
  })
  var b = sym(streams1, function (err) {
    if (err) console.error(err)
    else console.log('ok 1')
  })
  a.pipe(b).pipe(a)
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
