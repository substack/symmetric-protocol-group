var test = require('tape')
var hyperlog = require('hyperlog')
var memdb = require('memdb')
var mreplicate = require('../')
var collect = require('collect-stream')

test('log', function (t) {
  t.plan(4)
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
    var a = mreplicate(streams0, function (err) {
      t.error(err)
    })
    var b = mreplicate(streams1, function (err) {
      t.error(err)
      collect(log2.createReadStream(), function (err, rows) {
        t.deepEqual(rows.map(valueof), [ 'A', 'B', 'C' ].map(Buffer))
      })
      collect(log3.createReadStream(), function (err, rows) {
        t.deepEqual(rows.map(valueof), [ 'x', 'y', 'z' ].map(Buffer))
      })
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
})

function valueof (row) { return row.value }
