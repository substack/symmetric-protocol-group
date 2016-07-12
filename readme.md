# symmetric-protocol-group

multiplex symmetric protocol duplex streams

This is useful if you need to replicate multiple symmetric databases over the
same connection.

# example

``` js
var hyperlog = require('hyperlog')
var memdb = require('memdb')
var sym = require('symmetric-protocol-group')

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
```

# api

``` js
var sym = require('symmetric-protocol-group')
```

## var stream = sym(streams, cb)

Return a multiplex `stream` that bundles an object `streams` mapping names to
full-duplex symmetric protocol streams. The other end should include the same
stream names.

`cb(err)` fires on errors or when all the streams have finished successfully.

## stream.on('close', function (key) {})

When an individual stream closes, this event fires with the stream `key`.

# install

```
npm install symmetric-protocol-group
```

# license

BSD
