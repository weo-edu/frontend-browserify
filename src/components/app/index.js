/**
 * Imports
 */

import element from 'vdux/element'
import css from 'jss-simple'
import mlk from './mlk.jpg'

/**
 * Style
 */

const n = 20
const style = css({
  primary: {
    color: 'green',
    fontSize: n
  }
})

/**
 * App
 */

function render () {
  return (
    <div>
      <span class={style.primary}>Hello world!</span>
      <img src={mlk} />
    </div>
  )
}

/**
 * Exports
 */

export default render
