


import React, { useState, useEffect } from "react"
import {Route, Switch} from 'react-router-dom'
import { useDispatch } from "react-redux";
import LoginModal from "./components/LoginModal"
import SignupModal from "./components/SignupModal";
import * as sessionActions from "./store/session"

import Navigation from './components/Navigation'
import SpotDetail from "./components/SpotDetail";
import AllSpots from "./components/AllSpots";
import CreateSpot from "./components/CreateSpot";
import ManageSpots from "./components/ManageSpots";
import UpdateSpot from "./components/UpdateSpot";


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

      <Route path='/spots/:spotId/updateSpot'>
        <UpdateSpot/>
      </Route>

      <Route path='/spots/:spotId'>
        <SpotDetail/>
      </Route>



      <Route path="/login">
        <LoginModal />
      </Route>

      <Route path="/signup">
        <SignupModal/>
      </Route>

      <Route path='/manageSpots'>
        <ManageSpots/>
      </Route>

      <Route path='/newSpot'>
        <CreateSpot/>
      </Route>

      <Route exact path='/'>
        <AllSpots/>
      </Route>

    </Switch>
    )}

    </>
  );

}

export default App;
