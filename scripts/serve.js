/**
 * Imports
 */

import pendingValue from '@f/pending-value'
import render, {replace} from './render'
import browserify from 'browserify'
import concat from 'concat-stream'
import assetify from './assetify'
import hmr from 'browserify-hmr'
import babelify from 'babelify'
import watchify from 'watchify'
import errorify from 'errorify'
import route from 'koa-route'
import send from 'koa-send'
import koa from 'koa'

/**
 * Constants
 */

const app = koa()
const js = pendingValue()
const assets = {}
const exts = ['png', 'gif', 'ico', 'svg', 'gif']

/**
 * Bundling
 */

const b = browserify({
  entries: ['./src/client.js'],
  packageCache: {},
  cache: {},
  transform: [babelify, assetify({assets, exts}).browser()],
  plugin: [[watchify, {delay: 0}], hmr, errorify]
})

b.on('update', bundle)
setTimeout(bundle)

function bundle () {
  replace()
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
    if (assets[this.url]) send(this, assets[this.url])
    else this.status = 404

  } else {
    yield next
  }
})

app.use(function *() {
  this.body = yield render(this.req, assets)
})

/**
 * Listen
 */

app.listen(3000, function () {
  console.log('Listening on port ', 3000)
})


