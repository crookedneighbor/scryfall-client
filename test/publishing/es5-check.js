'use strict'

const browserify = require('browserify')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const checkES5 = require('check-ecmascript-version-compatibility')

describe('built file (be patient, this can take a while)', function () {
  before(function (done) {
    let distLocation = path.resolve(__dirname, '..', '..', 'dist')

    mkdirp.sync(distLocation)

    let name = 'scryfall-client'
    this.path = path.resolve(distLocation, `${name}.js`)
    let bundleFs = fs.createWriteStream(this.path)
    let b = browserify({standalone: name})

    bundleFs.on('finish', done)

    b.add('./index.js')
    b.bundle().pipe(bundleFs)
  })

  it('is es5 compliant', function (done) {
    this.slow(30000)
    this.timeout(35000)

    checkES5(this.path, done)
  })
})
