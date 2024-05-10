import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import classes from './Menu.module.css';

const Menu = () => {
  const navigate = useNavigate()
  const authStatus = localStorage.getItem('auth');
  const [logged, setLogged] = useState(authStatus);
  
  useEffect(()=>{
    setLogged(authStatus)
  },[authStatus])

const logoutHandler = () => {
  localStorage.clear();
  setLogged(false);
  navigate('/login');
}


  return (
    <nav className={classes.menu}>
      {logged ? (
        <React.Fragment>
          <NavLink to='/tasks'>Dashboard</NavLink>
          <NavLink to='/completed'>Completed</NavLink>
          <NavLink to='/uncompleted'>Uncompleted</NavLink>
          <NavLink to='/create-task'>Create Task</NavLink>
          <NavLink to='/login' onClick={logoutHandler}>Logout</NavLink>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <NavLink to='/login'>Login</NavLink>
          <NavLink to='/register'>Register</NavLink>
        </React.Fragment>
      )}
    </nav>
  );
};

export default Menu;
