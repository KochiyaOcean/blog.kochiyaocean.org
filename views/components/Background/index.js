import React from 'react'
import '../../3rd/fss'
import { startFSS, disableLoop } from '../../3rd/mesh'

import styles from './styles.css'

class Background extends React.Component {
  componentDidMount() {
    if (localStorage.getItem('blog.kochiyaocean.org') === 'false') {
      disableLoop()
    }
    startFSS(this.ground)
  }

  render() {
    return (
      <div ref={node => this.ground = node} className={styles.ground} />
    )
  }
}

export default Background
