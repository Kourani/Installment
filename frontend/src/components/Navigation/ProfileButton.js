


import * as sessionActions from '../../store/session';

import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom";
import { useHistory } from 'react-router-dom';


function ProfileButton({ user }) {

  const dispatch = useDispatch();
  const history = useHistory()
  const ulRef = useRef();
  // const [showMenu, setShowMenu] = useState(true);
  const [profileClick, setProfileClick] = useState(false)




  // const openMenu = () => {
  //   if (showMenu) return;
  //   setShowMenu(true);
  // };

  // useEffect(() => {
  //   if (!showMenu) return;

  //   const closeMenu = (e) => {
  //     if (!ulRef.current.contains(e.target)) {
  //       setShowMenu(false);
  //     }
  //   };

  //   document.addEventListener('click', closeMenu);

  //   return () => document.removeEventListener("click", closeMenu);
  // }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  useEffect(() => {
    const closeProfileClick = (e) => {
      // Check if the clicked target is not the button with class name "profileClick"
      if (profileClick && !ulRef.current.contains(e.target) && !e.target.classList.contains("profileClick")) {
        setProfileClick(false);
      }
    };

    document.addEventListener('click', closeProfileClick);

    return () => document.removeEventListener('click', closeProfileClick);
  }, [profileClick]); // Make sure to include profileClick in the dependency array to update the effect when it changes


  // const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

const person = () => {
  return (
      <div style={{ color: "black", fontSize: "20px" }}>
          <i className="fa-solid fa-circle-user"></i>
      </div>
  );
};

const bars = () => {
return (
    <div style={{ color: "black", fontSize: "20px" }}>
      <i className="fa-solid fa-bars"></i>
    </div>
);
};

function logOutOnClick(e){
  e.stopPropagation()
  setProfileClick(true)
  logout(e)
  // dispatch(sessionActions.logout())
  history.push('/')

}

function listChoices(){
  return(
    <div className='listChoicesBox'>
    <div>Hello, {user.firstName}</div>
    <div>{user.email}</div>
    <div className='manageSpotsButton'>
      <NavLink to='/manageSpots'>Manage Spots</NavLink>
    </div>
    <button className='logoutButton' onClick={logOutOnClick}>Log Out</button>
  </div>
  )
}

function openBox(){
  if(profileClick){
    console.log('PROFILE BUTTON',profileClick)
    return listChoices()
  }
}


  return (
    <>
      <div className='wholeHalfNav'>

       <NavLink to="/newSpot"><button className='createSpotButtonNav'>Create a New Spot</button></NavLink>

      <div>
        <button ref={ulRef} className='profileClick' onClick={()=>setProfileClick(!profileClick)}>

          {bars()}
          {person()}

        </button>

          {openBox()}

      </div>

      </div>
    </>
  );
}

export default ProfileButton;
