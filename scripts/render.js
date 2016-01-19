/**
 * Imports
 */

import forEach from '@f/foreach-obj'
import _main from '../src/server'
import page from './page'
import path from 'path'

/**
 * Vars
 */

let main = _main

/**
 * Render
 */

function render (req) {
  return main(req).then(page)
}

function replace () {
  invalidate(new RegExp('^' + path.resolve('./src')))
  main = require('../src/server').default
}

function invalidate (re) {
  forEach(remove, require.cache)

  function remove (val, key) {
    if (re.test(key)) {
      delete require.cache[key]
    }
  }
}

/**
 * Exports
 */

export default render
export {
  replace
}

