


import * as sessionActions from '../../store/session';

import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom";


function ProfileButton({ user }) {

  const dispatch = useDispatch();
  const ulRef = useRef();
  const [showMenu, setShowMenu] = useState(true);


  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  const Carrot = () => {
    return (
      <div style={{ color: "BLACK", fontSize: "20px" }}>
        <i className="fa-regular fa-user"></i>
      </div>
    );
  };

function button(){
  if(showMenu){
    return<Carrot/>
  } else return <i className="fas fa-user-circle" />
}

  return (
    <>
      <div className='wholeHalfNav'>


       <NavLink to="/newSpot"><button className='createSpotButtonNav'>Create a New Spot</button></NavLink>


      <button className='profileClick' onClick={openMenu}>
        {button()}


      <div>
        <div>Hello, {user.firstName}</div>
        <div>{user.email}</div>
        <div className='manageSpotsButton'>
          <NavLink to='/manageSpots'>Manage Spots</NavLink>
        </div>
        <button className='logoutButton' onClick={logout}>Log Out</button>
      </div>


      </button>
      </div>
    </>
  );
}

export default ProfileButton;
