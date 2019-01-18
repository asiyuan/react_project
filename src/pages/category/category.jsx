import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Card,
  Button,
  Icon,
  Table,
  Form,
  Select,
  Modal,
  Input,
  message
} from 'antd'

import {reqCategory, reqAddCategory, reqUpdateCategory} from '../../api/request'

const Item = Form.Item
const Option = Select.Option

export default class Category extends Component {

  constructor(props) {
    super(props)
    this.state = {
      categorys: [],
      subCategorys: [],
      isShowAdd: false,
      isUpdateShow: false,
      parentId: '0',
    }
  }

  // 得到分类列表
  getCategory = async (parentId) => {
    parentId = parentId || '0'
    const result = await reqCategory(parentId)
    if (result.status === 0) {
      const categorys = result.data
      if (parentId === '0') {
        this.setState({
          categorys
        })
      } else {
        this.setState({
          subCategorys: categorys
        })
      }
    }
  }

  addCategory = async (categoryName, parentId) => {
    const result = await reqAddCategory(categoryName, parentId)
    if (result.status === 0) {
      this.getCategory()
    }
  }

  // 显示一级分类
  showCategorys = () => {
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }

  // 查看子分类的回调
  showSubCategory = async (category) => {
    const parentId = category._id
    console.log(parentId)
    this.setState({
      parentId,
      parentName: category.name
    }, () => {
      this.getCategory(parentId)
    })
  }

  // 添加 成功的回调
  handleOk = () => {
    this.setState({
      isShowAdd: false
    })
    let {categoryName, parentId} = this.form.getFieldsValue()
    parentId === '一级分类' ? this.addCategory(categoryName, '0') : this.addCategory(categoryName, parentId)
  }

  // 显示 更新分类的 modal
  showUpdate = (category) => {
    this.category = category
    this.setState({
      isUpdateShow: true
    })
  }

  updateCategory = async() => {
    this.setState({
      isUpdateShow: false
    })
    const categoryId = this.category._id
    const {categoryName} = this.form.getFieldsValue()

    const result = await reqUpdateCategory(categoryName, categoryId)
    if (result.status === 0) {
      message.success('修改分类成功！')
      console.log(this.state.parentId)
      this.state.parentId === '0' ? this.getCategory() : this.getCategory(this.state.parentId)
    } else {
      message.error('网络延时，请重试！')
    }
  }

  componentWillMount() {
    this.columns = [{
      title: '品类名称',
      dataIndex: 'name',
      render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '操作',
      width: 300,
      render: category => (
        <span>
          <a href="javascript:;" onClick={() => this.showUpdate(category)}>修改分类</a>
          &nbsp;&nbsp;&nbsp;
          <a href="javascript:" onClick={() => this.showSubCategory(category)}>查看子分类</a>
        </span>
      )
    }]
  }

  componentDidMount() {
    this.getCategory()
  }

  render() {

    const columns = this.columns

    const {categorys, subCategorys, parentId, parentName} = this.state

    return (
      <div>
        <Card>
          {
            parentId === '0'
            ? <span style={{fontSize: 20}}>一级分类列表</span>
            : (
              <span>
                <a href="javascript:" onClick={this.showCategorys}>一级分类222</a>
                &nbsp;&nbsp;&nbsp;
                <Icon type="arrow-right" />
                &nbsp;&nbsp;&nbsp;
                <span>{parentName}</span>
              </span>
            )
          }
          <Button type="primary" style={{float: 'right'}} onClick={() => this.setState({isShowAdd: true})}>
            <Icon type="plus"/>
            添加分类
          </Button>
        </Card>

        <Table
          rowKey='_id'
          columns={columns}
          dataSource={parentId === '0' ? categorys : subCategorys}
          bordered
          loading={categorys.length === 0}
          pagination={{defaultPageSize: 3, showQuickJumper: true, showSizeChanger: true}}
        />

        <Modal
          title="添加分类"
          visible={this.state.isShowAdd}
          onOk={this.handleOk}
          onCancel={() => this.setState({isShowAdd: false})}
        >
          <AddForm categorys={categorys} setForm={(form) => this.form=form} />
        </Modal>

        <Modal
          title="修改分类"
          visible={this.state.isUpdateShow}
          onOk={this.updateCategory}
          onCancel={() => this.setState({isUpdateShow: false})}
        >
          <UpdateForm setForm={(form) => this.form=form} />
        </Modal>
      </div>
    )
  }
}

// 添加 category 的组件
class AddForm extends Component {

  static propTypes = {
    categorys: PropTypes.array.isRequired,
    setForm: PropTypes.func.isRequired,
    parentId: PropTypes.string,
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render () {

    const {categorys, parentId} = this.props
    const {getFieldDecorator} = this.props.form

    return (
      <Form>
        <Item label="所属分类">
          {
            getFieldDecorator('parentId', {
               initialValue: '一级分类'
            })(
              <Select>
                {
                  categorys.map(c => <Option key={c._id}>{c.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
        <Item label="分类名称">
          {
            getFieldDecorator('categoryName', {
              initialValue: ''
            })(
              <Input />
            )
          }
        </Item>
      </Form>
    )
  }
}

class UpdateForm extends Component {

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render () {
    const {categoryName} = this.props
    const {getFieldDecorator} = this.props.form

    return (
      <Form>
        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: ''
            })(
              <Input placeholder='请输入分类名称'/>
            )
          }
        </Item>
      </Form>
    )
  }
}

AddForm = Form.create()(AddForm)
UpdateForm = Form.create()(UpdateForm)

