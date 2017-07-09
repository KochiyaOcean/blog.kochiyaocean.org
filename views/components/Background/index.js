import React from 'react'
import '../../3rd/fss'
import { startFSS, enableLoop, disableLoop } from '../../3rd/mesh'

import styles from './styles.css'

class Background extends React.Component {
  componentDidMount() {
    startFSS(this.ground)
    window.enableLoop = enableLoop
    window.disableLoop = disableLoop
  }

  render() {
    return (
      <div ref={node => this.ground = node} className={styles.ground} />
    )
  }
}

export default Background
