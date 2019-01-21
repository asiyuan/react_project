import React, {Component} from 'react'
import {Card,
  Select,
  Input,
  Button,
  Icon,
  Table,
  message
} from 'antd'

import {reqProducts, reqSearchProducts, reqUpdateProductStatus} from '../../api/request'

const Option = Select.Option

export default class ProductIndex extends Component {

  state = {
    products: [],
    total: 0,
    searchType: 'productName',
    searchName: ''
  }

  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => <span>￥{price}</span>
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (status, product) => {
          let btnText = '下架'
          let statusText = '在售'
          if (status === 2) {
            btnText = '上架'
            statusText = '已下架'
          }
          status = status === 1 ? 2 : 1
          return (
            <div>
              <Button type="primary" onClick={() => this.updateProductStatus(status, product._id)}>{btnText}</Button>
              &nbsp;&nbsp;&nbsp;
              <span>{statusText}</span>
            </div>
          )
        }
      },
      {
        title: '操作',
        render: (product) => (
          <span>
            <a href="javascript:" onClick={() => {this.props.history.push('/product/detail', product)}}>详情</a>
            &nbsp;&nbsp;&nbsp;
            <a href="javascript:" onClick={() => this.props.history.push('/product/saveupdate', product)}>修改</a>
          </span>
        )
      },
    ]
  }

  updateProductStatus = async (status, productId) => {
    const result = await reqUpdateProductStatus({status, productId})
    if (result.status === 0) {
      message.success('更新商品状态成功')
      this.getProducts(this.pageNum || 1)
    }
  }

  getProducts = async (pageNum) => {
    this.pageNum = pageNum
    const {searchType, searchName} = this.state
    let result
    if (searchType) {
      result = await reqSearchProducts(pageNum, 3, searchType, searchName)
    } else {
      const result = await reqProducts(pageNum, 1)
    }
    if (result.status === 0) {
      const {list, total} = result.data
      this.setState({
        products: list,
        total
      })
    } else {
      message.error('网络不好~~~')
    }
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getProducts(1)
  }

  render() {
    const {total, products, searchType} = this.state

    return (
      <div>
        <Card>
          <Select value={searchType} onChange={value => this.setState({searchType:value})}>
            <Option key="productName" value="productName">根据商品名称</Option>
            <Option key="productDesc" value="productDesc">根据商品描述</Option>
          </Select>
          &nbsp;&nbsp;&nbsp;
          <Input placeholder="关键字" style={{width: 200}}
            onChange={(e) => this.setState({searchName: e.target.value})}/>
          &nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={() => this.getProducts(1)}>搜索</Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="primary" style={{float: "right"}}
                  onClick={() => this.props.history.push('/product/saveupdate')}>
            <Icon type="plus" />
            添加产品
          </Button>
        </Card>

        <Table
          bordered
          rowKey='_id'
          columns={this.columns}
          dataSource={products}
          pagination={{
            defaultPageSize: 3,
            showQuickJumper: true,
            total,
            onChange: this.getProducts
          }}
        />
      </div>
    )
  }
}