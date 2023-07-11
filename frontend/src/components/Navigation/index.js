


import './Navigation.css';
import * as sessionActions from '../../store/session';

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();

    //creates the star icon
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


  function choices(){
    return (
      <button>
      <div>
        <div>
          <NavLink to="/login">Log In</NavLink>
        </div>

        <div>
          <NavLink to="/signup">Sign Up</NavLink>
        </div>

        <div>
          <NavLink to='/manageSpots'>Manage Spots</NavLink>
        </div>
      </div>

      </button>
    )
  }

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  let sessionLinks;

  if (sessionUser) {

    sessionLinks = (
      <div>
        <ProfileButton user={sessionUser} />

        {/* <button onClick={logout}>Log Out</button> */}
      </div>
    );

  } else {
    sessionLinks = (

      <button className='mainButton' onClick={()=>choices()}>
          {bars()}
          {person()}
          <div>
        <div>
          <NavLink to="/login">Log In</NavLink>
        </div>

        <div>
          <NavLink to="/signup">Sign Up</NavLink>
        </div>
      </div>

      </button>


    );
  }

  return (
    <div className='whole'>


      <div className='roseButton'>
        <NavLink exact to="/">
          <img src={'https://images.pexels.com/photos/442188/pexels-photo-442188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} alt={'Home'} width="50" height="50"/>
        </NavLink>
        <div className='roseWord'>
          earthbnb
        </div>

      </div>

      {isLoaded && sessionLinks}
    </div>
  );
}

export default Navigation;
