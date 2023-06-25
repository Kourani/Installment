


import React, { useState, useEffect } from "react"
import {Route, Switch} from 'react-router-dom'
import { useDispatch } from "react-redux";
import LoginFormPage from "./components/LoginFormPage"
import SignupFormPage from "./components/SignUpFormPage";
import * as sessionActions from "./store/session"
import Navigation from './components/Navigation'

import SpotDetail from "./components/SpotDetail";


function App() {

  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(()=>{
    dispatch(sessionActions.restoreUser()).then(()=>setIsLoaded(true))
  }, [dispatch])


  return (

    <>
    <Navigation isLoaded={isLoaded}/>

    {isLoaded && (
      <Switch>
      <Route path="/login">
        <LoginFormPage />
      </Route>

      <Route path="/signup">
        <SignupFormPage/>
      </Route>

      <Route path='/spots/:spotId'>
        <SpotDetail/>
      </Route>
    </Switch>
    )}

    </>
  );

}

export default App;
