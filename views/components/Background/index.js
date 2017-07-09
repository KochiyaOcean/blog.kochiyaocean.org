import React from 'react'
import '../../3rd/fss'
import mesh from '../../3rd/mesh'

import styles from './styles.css'

class Background extends React.Component {
  componentDidMount() {
    mesh(this.ground)
  }

  render() {
    return (
      <div ref={node => this.ground = node} className={styles.ground} />
    )
  }
}

export default Background
