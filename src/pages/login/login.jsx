import React, {Component} from 'react';
import {Form, Icon, Input, Button} from 'antd'

import logo from '../../assets/images/logo.png'
import './index.less'

export default class Login extends Component {

  render() {
    return (
      <div className='login'>
        {/*头部导航*/}
        <div className="login-header">
          <img src={logo} alt="硅谷后台管理系统"/>
          React项目: 后台管理系统
        </div>
        {/*主体部分*/}
        <div className="login-content">
          <div className="login-box">
            <div className="title">User Login</div>

            <LoginForm/>
          </div>
        </div>
      </div>
    )
  }
}


class LoginForm extends Component {

  // 提交数据
  handleSumbit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    })
  }

  // 验证表单数据
  checkUserName = (rule, value, callback) => {
    if (!value) {
      callback('请输入用户名！')
    } else if (!/^\w+$/.test(value)) {
      callback('用户名只能是字母')
    } else if (value.length < 4) {
      callback('用户名至少4位')
    }else {
      callback()
    }
  }

  // 验证密码的合法性
  checkPassword = (rule, value, callback) => {
    if (!value) {
      callback('请输入用密码！')
    } else if (!/^\w+[0-9]+$/.test(value)) {
      callback('密码必须是字母加数字的组合')
    } else if (value.length < 4) {
      callback('密码至少4位')
    }else {
      callback()
    }
  }

  render () {

    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form" onSubmit={this.handleSumbit}>

        {/*用户名验证*/}
        <Form.Item>
          {getFieldDecorator('userName', {
            rules: [{validator: this.checkUserName}]
          })(
            <Input prefix={<Icon type="user" />} placeholder="Username" autoComplete="off"/>
          )}
        </Form.Item>

        {/*密码验证*/}
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{validator: this.checkPassword}]
          })(
            <Input type="password" placeholder="password" prefix={<Icon type="safety"/>} />
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={this.loginSubmit} className="login-form-button">login</Button>
        </Form.Item>
      </Form>
    )
  }
}

LoginForm = Form.create()(LoginForm)