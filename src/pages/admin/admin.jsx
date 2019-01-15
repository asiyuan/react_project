import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import {Button} from 'antd'

import MemoryUtils from '../../utils/MemoryUtils'
import './index.less'

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
      <div id="admin">
        admin
        <Button className='btn' type='primary' onClick={this.handleClick}>进入登录页面</Button>
      </div>
    )
  }
}