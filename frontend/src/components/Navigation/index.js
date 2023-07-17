


import './Navigation.css';
import LoginModal from './../LoginModal'
import SignupModal from './../SignupModal'
import * as sessionActions from '../../store/session';

import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import { useState } from 'react';


function Navigation({ isLoaded }){

  const dispatch = useDispatch();
  const ulRef = useRef();

  const sessionUser = useSelector(state => state.session.user);

  const [clickState, setClickState]=useState(false)


  const [loginModal, setLoginModal]=useState(false)
  const [signupModal, setSignupModal]=useState(false)

  console.log('here click',clickState)

  // useEffect(()=>{
  //   clickStateManagement()
  // },[loginModal, signupModal])

  console.log('CLICKSATE',clickState)


  function clickStateManagement(e){
    e.stopPropagation()
    setClickState(!clickState)
    return
  }

  useEffect(() => {
    const closeClickState = (e) => {
      // Check if the clicked target is not the button with class name "profileClick"
      if (clickState && !ulRef.current.contains(e.target) && !e.target.classList.contains("mainButton")) {
        setClickState(false);
      }
    };

    document.addEventListener('click', closeClickState);

    return () => document.removeEventListener('click', closeClickState);
  }, [clickState]); // Make sure to include profileClick in the dependency array to update the effect when it changes


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
          <button ref={ulRef} className='mainButton' onClick={(e)=>clickStateManagement(e)}>
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
          <div className='roseWord'>

            <img src={'https://images.pexels.com/photos/442188/pexels-photo-442188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} alt={'Home'} width="50" height="50"/>

            <div className='roseWordWidth'>
              Earth BnB
            </div>
          </div>
        </NavLink>


      </div>
      {isLoaded && sessionLinks}
      {signupModal && <SignupModal closeModal={()=>setSignupModal()} />}
      {loginModal && <LoginModal closeModal={setLoginModal} />}

    </div>
  );
}

export default Navigation;
