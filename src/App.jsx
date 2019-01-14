import React, { Component } from 'react';
import {Button} from 'antd'
import {Route, BrowserRouter, Switch} from 'react-router-dom'

import Admin from './pages/admin/admin'
import Login from './pages/login/login'

export default class App extends Component {

  render () {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Login}/>
          <Route path='/' component={Admin}/>
        </Switch>
      </BrowserRouter>
    )
  }
}
