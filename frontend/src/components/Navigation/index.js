


import './Navigation.css';
import LoginModal from './../LoginModal'
import SignupModal from './../SignupModal'
import * as sessionActions from '../../store/session';

import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import { useState } from 'react';

function Navigation({ isLoaded }){

  const dispatch = useDispatch();

  const sessionUser = useSelector(state => state.session.user);

  const [clickState, setClickState]=useState(false)


  const [loginModal, setLoginModal]=useState(false)
  const [signupModal, setSignupModal]=useState(false)


  // useEffect(()=>{
  //   clickStateManagement()
  // },[loginModal, signupModal])


  function clickStateManagement(e){
    e.stopPropagation()
    setClickState(!clickState)
    return
  }

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

  function signButton(e){
    clickStateManagement(e)
    setSignupModal(true)
    return
  }

  function logButton(e){
    clickStateManagement(e)
    setLoginModal(true)
    return
  }

  function choices(){
    return (

      <div className='choices'>

        <div>
          <button className='signupLoginButtons' onClick={signButton}>Sign up</button>

        </div>

        <div>
          {/* <NavLink to="/login">Log in</NavLink> */}
          <button className='signupLoginButtons' onClick={(e)=>logButton(e)}> Log In</button>

        </div>

      </div>
    )
  }

  function clicked(){
    console.log('NAVIGATION....CLICKSTATE',clickState)
    if(clickState){
      return choices()
    }
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

      <>

        <div className='leftSide'>
          <button className='mainButton' onClick={(e)=>clickStateManagement(e)}>
              {bars()}
              {person()}
          </button>

          {clicked()}
        </div>
      </>

    );
  }

  return (
    <div className='whole'>


      <div className='roseButton'>
        <NavLink exact to="/">
          <img src={'https://images.pexels.com/photos/442188/pexels-photo-442188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} alt={'Home'} width="50" height="50"/>
        </NavLink>
        <div className='roseWord'>
          Earth BnB
        </div>

      </div>

      {isLoaded && sessionLinks}
      {signupModal && <SignupModal closeModal={()=>setSignupModal()} />}
      {loginModal && <LoginModal closeModal={setLoginModal} />}
    </div>
  );
}

export default Navigation;
