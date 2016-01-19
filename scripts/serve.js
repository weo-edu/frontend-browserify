/**
 * Imports
 */

import pendingValue from '@f/pending-value'
import browserify from 'browserify'
import concat from 'concat-stream'
import Assetify from './assetify'
import hmr from 'browserify-hmr'
import babelify from 'babelify'
import watchify from 'watchify'
import errorify from 'errorify'
import route from 'koa-route'
import send from 'koa-send'
import path from 'path'
import koa from 'koa'

/**
 * Constants
 */

const app = koa()
const js = pendingValue()
const assets = {}
const exts = ['png', 'gif', 'ico', 'svg', 'gif', 'jpg']
const assetify = Assetify({exts: exts, assets})

/**
 * Bundling
 */

const b = browserify({
  entries: ['./src/client.js'],
  packageCache: {},
  cache: {},
  transform: [babelify, assetify.browser()],
  plugin: [[watchify, {delay: 0}], hmr, errorify]
})

b.on('update', bundle)
setTimeout(bundle)
assetify.node()

function bundle () {
  require('./render').replace()
  js.pending()
  b.bundle()
    .pipe(concat(function (str) { js.ready(str) }))
}

/**
 * Server
 */

app.use(function *(next) {
  if (this.url === '/bundle.js') {
    this.body = yield js.value()
  } else {
    yield next
  }
})

app.use(function *(next) {
  if (this.url.startsWith('/assets/')) {
    if (assets[this.url]) {
      const file = path.relative(process.cwd(), assets[this.url])
      yield send(this, file, {root: process.cwd()})
    } else {
      this.status = 404
    }
  } else {
    yield next
  }
})

app.use(function *() {
  const render = require('./render').default
  this.body = yield render(this.req, assets)
})

/**
 * Listen
 */

app.listen(3000, function () {
  console.log('Listening on port ', 3000)
})
