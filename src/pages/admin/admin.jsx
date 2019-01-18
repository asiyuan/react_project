import React, {Component} from 'react';
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import {Row, Col} from 'antd'

import MemoryUtils from '../../utils/MemoryUtils'
import './index.less'
import LeftNav from '../../components/left-nav/left-nav'
import Header from '../../components/header/header'
import Footer from '../../components/footer/footer'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

export default class Admin extends Component {

  handleClick = () => {
    this.props.history.push('/login')
  }

  render() {
    const user = MemoryUtils.user
    // 如果读不到 user，跳转到登录页面
    if (!user || !user._id) {
      return <Redirect to='/login'/>
    }
    return (
      <div className="container">
        <Row>
          <Col span={4}>
            <LeftNav/>
          </Col>
          <Col span={20} className='main'>
            <Header/>
            <div className="content">
              <Switch>
                <Route path='/home' component={Home}/>
                <Route path='/category' component={Category}/>
                <Route path='/product' component={Product}/>
                <Route path='/user' component={User}/>
                <Route path='/role' component={Role}/>
                <Route path="/charts/bar" component={Bar}/>
                <Route path="/charts/pie" component={Pie}/>
                <Route path="/charts/line" component={Line}/>
                <Redirect to="/category" />
              </Switch>
            </div>
            <Footer/>
          </Col>
        </Row>
      </div>
    )
  }
}