import React, {Component} from 'react';
import {Form, Icon, Input, Button} from 'antd'

import storageUtils from '../../utils/storageUtils'
import logo from '../../assets/images/logo1.jpg'
import {reqLogin} from '../../api/request'
import MemoryUtils from '../../utils/MemoryUtils'
import './index.less'

export default class Login extends Component {

  state = {
    errorMsg: ''    //错误提示信息
  }

  login = async (user) => {
    const result = await reqLogin(user)
    if (result.status === 0) {
      // 登陆成功
      this.props.history.replace('/')
      const user = result.data
      storageUtils.saveUser(user)
      MemoryUtils.user = user
    } else {
      // 登陆失败
      this.setState({
        errorMsg: result.msg
      })
    }
  }

  render() {
    const {errorMsg} = this.state

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
            <div className="error-msg-wrap">
              <div className={errorMsg ? 'show' : ''}>
                {errorMsg}
              </div>
            </div>
            <div className="title">User Login</div>

            <LoginForm login={this.login}/>
          </div>
        </div>
        <div className="footer">

          <h3>
            <Icon type="zhihu" />
            &nbsp;&nbsp;知乎，分享你刚编的故事
          </h3>
        </div>
      </div>
    )
  }
}


class LoginForm extends Component {

  clickLogin = () => {

    // 只有当验证没有错误时才输出输入的数据
    this.props.form.validateFields(async (error, values) => {
      console.log('validateFields', error, values)
      if(!error) {
        this.props.login(values)

      } else {
        this.props.form.resetFields() // 重置所有输入框
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
    }
     else if (value.length < 4) {
      callback('密码至少4位')
    }else {
      callback()
    }
  }

  render () {

    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form">

        {/*用户名验证*/}
        <Form.Item>
          {getFieldDecorator('username', {
            initialValue: 'admin',
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
          <Button type="primary" onClick={this.clickLogin} className="login-form-button">login</Button>
        </Form.Item>
      </Form>
    )
  }
}

LoginForm = Form.create()(LoginForm)