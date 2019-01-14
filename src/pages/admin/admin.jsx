import React, {Component} from 'react';
import {Button} from 'antd'
import './index.less'

export default class Admin extends Component {

  handleClick = () => {
    this.props.history.push('/login')
  }

  render() {
    return (
      <div id="admin">
        admin
        <Button className='btn' type='primary' onClick={this.handleClick}>进入登录页面</Button>
      </div>
    )
  }
}