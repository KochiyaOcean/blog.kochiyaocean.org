import React from 'react'
import { IconButton } from 'react-toolbox/lib/button'
import FontAwesome from 'react-fontawesome'

import styles from './styles.css'

const Header = ({ children }, { switchLanguage, locale}) => {
  return (
    <div className={styles.header}>
      <IconButton className={styles.menubtn} icon={<FontAwesome name='bars' />} inverse />
    </div>
  )
}


export default Header
