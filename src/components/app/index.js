/**
 * Imports
 */

import element from 'vdux/element'
import css from 'jss-simple'
import mlk from './mlk.jpg'

/**
 * Style
 */

const style = css({
  primary: {
    color: 'green'
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
