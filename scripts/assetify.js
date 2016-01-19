/**
 * Imports
 */

import through from 'through2'
import path from 'path'
import sha from 'sha1'
import fs from 'fs'

/**
 * Constants
 */

/**
 * Assetify
 */

function assetify ({assets, exts, base = '/assets/'}) {
  const extRe = new RegExp('\.' + exts.join('|') + '$')

  return {
    browser () {
      return file => extRe.test(file) ? urify(file) : through()
    },
    node () {
      // hook require
      exts.forEach(ext => require.extensions['.' + ext] = handleExt(ext))
    }
  }

  function handleExt (ext) {
    return file => {
      return urify(fs.readFileSync(file))
    }
  }

  function process (file) {
    const buffers = []
    return through (
      buf => buffers.push(buf),
      function (cb) {
        this.push(urify(Buffer.concat(buffers)))
        cb()
      }
    )
  }

  function urify (contents) {
    const hashed = sha(contents) + path.extname(file)
    const url = path.join(base, hashed)

    opts.assets[url] = file
    this.push(`module.exports = "${url}"`)
  }
}

/**
 * Exports
 */

export default assetify
