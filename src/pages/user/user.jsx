import React, {Component} from 'react';
import PropTypes from 'prop-types'

import {
  message,
  Table,
  Button,
  Icon,
  Modal,
  Card,
  Form,
  Input,
  Select
} from 'antd'

import {reqUsers, reqAddOrUpdateUser} from '../../api/request'
import {formateDate} from '../../utils/utils'

const Option = Select.Option
export default class User extends Component {

  state = {
    users: [],
    roles: [],
    isShow: false,
  }
  
  initRoleName = (roles) => {
    this.roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
  }

  getUsers = async () => {
    const result = await reqUsers()
    if (result.status === 0) {
      const {users, roles} = result.data
      this.initRoleName(roles)
      this.setState({users, roles})
    } else {
      message.error('网络错误')
    }
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        render: (value) => formateDate(value)
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        render: value => this.roleNames[value]
      },
      {
        title: '操作',
        render: (user) => {
          return (
            <span>
              <a href="javascript:;" onClick={() => this.showUpdate(user)}>修改</a>
              &nbsp;&nbsp;
              <a href="javascript:;" onClick={() => this.clickDeleteUser(user)}>删除</a>
            </span>
          )
        }
      },
    ]
  }

  showUpdate = (user) => {
    console.log(user)
    this.user = user
    
    this.setState({
      isShow: true
    })
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getUsers()
  }

  render() {

    const {users, isShow, roles} = this.state
    const user = this.user || {}
    // console.log(isShowAdd)
    return (
      <div>
        <Card>
          <Button type="primary" onClick={() => this.setState({isShow: true})}>
            <Icon type="plus" />
            创建用户
          </Button>
        </Card>

        <Table
          columns={this.columns}
          rowKey='_id'
          dataSource={users}
          bordered
          pagination={{defaultPageSize: 10, showQuickJumper: true}}
        />

        <Modal
          title= {user._id ? '修改用户' : '创建用户'}
          visible={isShow}
          onOk={this.handleOk}
          onCancel={() => this.setState({isShow: false})}
        >
          <UserForm user={user} roles={roles}/>
        </Modal>
      </div>
    )
  }
}

class UserForm extends Component {

  static propTypes = {
    user: PropTypes.object,
    roles: PropTypes.array
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const {user, roles} = this.props
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    }
    return (
      <Form>
        <Form.Item label="用户名" {...formItemLayout}>
          {
            getFieldDecorator('username', {
              initialValue: ''
            })(
              <Input type="text" placeholder="请输入用户名"/>
            )
          }
        </Form.Item>

        {
          !user._id ? (
            <Form.Item label="密码" {...formItemLayout}>
              {
                getFieldDecorator('password', {
                  initialValue: ''
                })(
                  <Input type="text" placeholder="请输入密码"/>
                )
              }
            </Form.Item>
          ) : null
        }

        <Form.Item label="电话号码" {...formItemLayout}>
          {
            getFieldDecorator('phone', {
              initialValue: ''
            })(
              <Input type="text" placeholder="请输入电话号码"/>
            )
          }
        </Form.Item>
        <Form.Item label="邮箱" {...formItemLayout}>
          {
            getFieldDecorator('email', {
              initialValue: ''
            })(
              <Input type="text" placeholder="请输入邮箱"/>
            )
          }
        </Form.Item>
        <Form.Item label="角色" {...formItemLayout}>
          {
            getFieldDecorator('role', {
              initialValue: user.role_id
            })(
              <Select>
                {
                  roles.map(role => (
                    <Option key={role._id} value={role._id}>{role.name}</Option>
                  ))
                }
              </Select>
            )
          }
        </Form.Item>
      </Form>
    )
  }
}
UserForm = Form.create()(UserForm)