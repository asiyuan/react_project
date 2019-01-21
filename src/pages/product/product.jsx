import React, {Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom'

import ProductAddUpdate from './add-update'
import ProductIndex from './index'
import ProductDetail from './detail'

export default class Product extends Component {

  render() {
    return (
      <Switch>
        <Route path='/product/index' component={ProductIndex}/>
        <Route path='/product/saveupdate' component={ProductAddUpdate}/>
        <Route path='/product/detail' component={ProductDetail}/>
        <Redirect to='/product/index'/>
      </Switch>
    )
  }
}