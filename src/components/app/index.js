/**
 * Imports
 */

import element from 'vdux/element'
import css from 'jss-simple'
import weo from './weo.png'

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
      <img src={weo} />
    </div>
  )
}

/**
 * Exports
 */

export default render
