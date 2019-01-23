import React, {Component} from 'react'
import {
  Icon,
  List
} from 'antd'
import {reqCategoryById} from '../../api/request'
import './index.less'

const Item = List.Item
export default class ProductDetail extends Component {

  state = {
    cName1: '',
    cName2: ''
  }

  getCategoryName = async () => {
    const {categoryId, pCategoryId } = this.props.location.state
    console.log(categoryId, pCategoryId)
    if (pCategoryId === '0') {
      const result = await reqCategoryById(categoryId)
      const cName1 = result.data.name
      this.setState({cName1})
    } else {
      const result1 = await reqCategoryById(pCategoryId)
      const result2 = await reqCategoryById(categoryId)
      const cName1 = result1.data.name
      const cName2 = result2.data.name
      this.setState({
        cName1,
        cName2,
      })
    }
  }

  componentDidMount() {
    this.getCategoryName()
  }

  render() {

    const {name, desc, price, categoryId, pCategoryId, imgs, detail} = this.props.location.state
    const {cName1, cName2} = this.state
    console.log(this.state)
    return (
      <div className="product-detail">
        <h2>
          <Icon type="arrow-left" onClick={() => this.props.history.goBack()}/>
          <span style={{marginLeft: 30}}>商品详情</span>
        </h2>

        <List>
          <Item>
            <span className="left">商品名称:</span>
            <span className="right">{name}</span>
          </Item>
          <Item>
            <span className="left">商品名称:</span>
            <span className="right">{desc}</span>
          </Item>
          <Item>
            <span className="left">商品价格:</span>
            <span className="right">{price}</span>
          </Item>
          <Item>
            <span className="left">商品分类:</span>
            <span className="right">{cName1 + (cName2 ? '-->'+ cName2 : '')}</span>
          </Item>
          <Item>
            <span className="left">商品图片:</span>
            <span>
              {
                imgs.map(img => (
                  <img src={'http://localhost:5000/upload/'+img} key={img} alt=""
                  style={{width: 150, height: 150}}/>
                ))
              }
            </span>
          </Item>
          <Item>
            <span className="left">商品详情:</span>
            <div dangerouslySetInnerHTML={{__html: detail}}></div>
          </Item>
        </List>
      </div>
    )
  }
}