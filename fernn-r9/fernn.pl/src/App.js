import React from 'react'
import cookie from 'react-cookies'
import axios from 'axios'
// import { BrowserRouter, Switch, Route} from 'react-router-dom'
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link
// } from "react-router-dom";
import { Routes ,Route, BrowserRouter} from 'react-router-dom';
import Index from './components/Subpages/Index'
import Login from './components/Subpages/Login'
import Facilities from './components/Subpages/Facilities'
import NotFound from './components/Subpages/404'

class App extends React.Component{
  // constructor(){}
  render(){
    if(cookie.load('CountryCode')===undefined){
      axios.get('https://ipapi.co/json/')
           .then((response) => { cookie.save("CountryCode", response.data.country_code, { path: '/', maxAge: 315576000 }) })
           .catch((error) => { console.log(error) })
    }

    return (
      <div>
        <BrowserRouter basename='/'>
          {/* <Switch> */}
          <Routes>
            <Route exact path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/a" element={<Facilities />} />
            <Route path="*" element={<NotFound />} />
          {/* </Switch> */}
          </Routes>
        </BrowserRouter>
      </div>
    )
  }
}

export default App
