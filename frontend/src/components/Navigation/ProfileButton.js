

import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';

import * as sessionActions from '../../store/session';

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
      <button onClick={openMenu}>
        {button()}

      <ul className={ulClassName} ref={ulRef}>
        <li>{user.username}</li>
        <li>{user.firstName} {user.lastName}</li>
        <li>{user.email}</li>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
      </ul>
      </button>
    </>
  );
}

export default ProfileButton;
