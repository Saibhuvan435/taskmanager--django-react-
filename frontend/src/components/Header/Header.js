import React from 'react'
import classes from './Header.module.css'
import Menu from './Menu'

const Header = () => {
  return (
    <div className={classes.header}>
      <Menu/>
    </div>
  )
}

export default Header