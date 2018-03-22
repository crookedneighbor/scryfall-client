const browserify = require('browserify')
const path = require('path')
const fs = require('fs')
const checkES5 = require('check-ecmascript-version-compatibility')

describe('built file', function () {
  before(function (done) {
    let name = 'mtg-cards'
    this.path = path.resolve(__dirname, '..', '..', 'dist', `${name}.js`)
    let bundleFs = fs.createWriteStream(this.path)
    let b = browserify({standalone: name})

    bundleFs.on('finish', done)

    b.add('./index.js')
    b.bundle().pipe(bundleFs)
  })

  it('is es5 compliant', function (done) {
    this.slow(22000)
    this.timeout(25000)

    checkES5(this.path, done)
  })
})
