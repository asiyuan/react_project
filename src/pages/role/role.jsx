import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {
  Card,
  Button,
  Table,
  message,
  Modal,
  Form,
  Input,
  Tree
} from 'antd'

import {reqRoles, reqAddRole, reqUpdateMenus} from '../../api/request'
import {formateDate} from '../../utils/utils'
import menuList from '../../config/menuConfig'

const { TreeNode } = Tree

export default class Role extends Component {

  state = {
    roles: [],             // 角色列表
    isAddShow: false,      // 添加模态框的显示状态
    isUpdateShow: false,
    role: {},    // 当前选中的角色
    menus: []    // 当前角色所有权限的数组
  }

  /*
    初始化表头
   */
  initColumn = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
          dataIndex: 'create_time',
        render: (value) => formateDate(value)
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: (value) => formateDate(value)
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      },
    ]
  }

  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0) {
      const roles = result.data
      this.setState({roles})
    } else {
      message.error('网络请求错误')
    }
  }

  addRole = async () => {
    this.setState({
      isAddShow: false
    })
    const name = this.form.getFieldValue('roleName')
    const result = await reqAddRole(name)
    // 清空输入框
    this.form.resetFields()
    if (result.status === 0) {
      message.success('添加角色成功')
      this.getRoles()
    } else {
      message.error('添加角色失败')
    }
  }

  // 点击行的 回调事件
  onRow = (role) => {
    return {
      onClick: (event) => {
        this.setState({
          role,
          menus: role.menus
        })
      }
    }
  }

  // 设置选中的权限
  setCheckMenu = (menus) => {
    this.setState({
      menus
    })
  }

  handleUpdateMenus = async (role) => {
    this.setState({
      isUpdateShow: false
    })
    const menus = this.state.menus
    role.menus = menus
    role.auth_name = 'admin'
    const result = await reqUpdateMenus(role)
    if (result.status === 0) {
      message.success('更改权限成功！')
      this.getRoles()
    } else {
      message.error('更改权限失败')
    }
  }

  // 组件对象第一次渲染之前的回调，初始化表格
  componentWillMount() {
    this.initColumn()
  }

  // 组件完成挂载的回调，在这里发送异步请求
  componentDidMount() {
    this.getRoles()
  }

  render() {

    const {roles, role, isAddShow, isUpdateShow, menus} = this.state
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: [role._id],           // 选中每行的 key
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          role: selectedRows[0]
        })
      }
    }
    return (
      <div>
        <Card>
          <Button type="primary" onClick={() => this.setState({isAddShow: true})}>创建角色</Button>&nbsp;&nbsp;
          <Button type="primary" disabled={!role._id} onClick={() => this.setState({isUpdateShow: true})}>设置角色权限</Button>&nbsp;&nbsp;
        </Card>

        <Table
          columns={this.columns}
          rowKey='_id'
          dataSource={roles}
          bordered
          rowSelection={rowSelection}
          onRow={this.onRow}         // 设置行的回调
          pagination={{defaultPageSize: 5, showQuickJumper: true}}
        />

        <Modal
          title="添加角色"
          visible={isAddShow}
          onOk={this.addRole}
          onCancel={() => this.setState({isAddShow: false})}
        >
          <AddRoleForm setForm={form => this.form = form}/>
        </Modal>

        <Modal
          title="设置角色权限"
          visible={isUpdateShow}
          onOk={() => this.handleUpdateMenus(role)}
          onCancel={() => this.setState({isUpdateShow: false, menus: role.menus})}
        >
          <UpdateRoleForm roleName={role.name} menus={menus} setCheckMenu={this.setCheckMenu}/>
        </Modal>

      </div>
    )
  }
}

// 添加角色的 from 组件
class AddRoleForm extends Component {

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {

    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    }
    const {getFieldDecorator} = this.props.form
    return (
      <Form>
        <Form.Item label="角色名称" {...formItemLayout}>
          {getFieldDecorator('roleName', {
            initialValue: ''
          })(
            <Input type="text" placeholder="请输入角色名称"/>
          )}
        </Form.Item>
      </Form>
    )
  }
}

class UpdateRoleForm extends Component {

  static propTypes = {
    roleName: PropTypes.string,
    menus: PropTypes.array,
    setCheckMenu: PropTypes.func
  }

  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
    this.props.setCheckMenu(checkedKeys)
  }

  // 动态生成树形控件
  initTreeNode = (menuList) => {

    return menuList.map(menu => (
      <TreeNode key={menu.key} title={menu.title}>
        {
          menu.children ? (
            this.initTreeNode(menu.children)
          ) : null
        }
      </TreeNode>
    ))
  }
  

  render() {
    const {roleName, menus} = this.props

    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    }
    return (
      <Form>
        <Form.Item label="角色名称：" {...formItemLayout}>
          <Input value={roleName} disabled/>
        </Form.Item>

        <Tree
          checkable
          defaultExpandAll
          onCheck={this.onCheck}
          checkedKeys={menus}   // 根据状态数据勾选的，所以要改变状态
        >
          <TreeNode title="平台权限" key="all">
            {this.initTreeNode(menuList)}
          </TreeNode>
        </Tree>
      </Form>
    )
  }
}

AddRoleForm = Form.create()(AddRoleForm)
UpdateRoleForm = Form.create()(UpdateRoleForm)