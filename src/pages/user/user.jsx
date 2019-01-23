import React, {Component} from 'react';

import {
  message,
  Table,
  Button,
  Icon
} from 'antd'

import {reqUsers} from '../../api/request'
import {formateDate} from '../../utils/utils'

export default class User extends Component {

  state = {
    users: []
  }

  getUsers = async () => {
    const result = await reqUsers()
    if (result.status === 0) {
      console.log(result.data)
      const users = result.data.users
      this.setState({users})
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
        render: (roleId) => {
          return this.roleMap ? this.roleMap[roleId] : ''
        }
      },
      {
        title: '操作',
        render: (user) => {
          return (
            <span>
              <a href="javascript:;" onClick={() => this.showUpdateUser(user)}>修改</a>
              &nbsp;&nbsp;
              <a href="javascript:;" onClick={() => this.clickDeleteUser(user)}>删除</a>
            </span>
          )
        }
      },
    ]
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getUsers()
  }

  render() {

    const {users} = this.state
    console.log(users)
    return (
      <div>
        user

        <Button type="primary" style={{float: "right"}}>
          <Icon type="plus" />
          添加用户
        </Button>

        <Table
          columns={this.columns}
          rowKey='_id'
          dataSource={users}
          bordered
          pagination={{defaultPageSize: 10, showQuickJumper: true}}
        />
      </div>
    )
  }
}