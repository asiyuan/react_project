import React, {Component} from 'react';
import {NavLink, withRouter} from 'react-router-dom'
import {
  Menu,
  Icon,
} from 'antd';

import './left-nav.less'
import logo from '../../assets/images/logo1.jpg'
import menuConfig from '../../config/menuConfig'


const SubMenu = Menu.SubMenu;

class LeftNav extends Component {

  getNodes = (arr) => {
    return arr.reduce((pre, item) => {
      if (item.children) {
        const subMenu = (
          <SubMenu key={item.key}
                   title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
            {
              this.getNodes(item.children)
            }
          </SubMenu>
        )
        pre.push(subMenu)

        // 得到请求路径对应的key
        const path = this.props.location.pathname
        const cItem = item.children.find(child => path.indexOf(child.key) === 0)
        if (cItem) {
          this.openKey = item.key
          this.selectKey = cItem.key
        }
      } else {
        const menuItem = (
          <Menu.Item key={item.key}>
            <NavLink to={item.key}>
              <Icon type={item.icon}/>{item.title}
            </NavLink>
          </Menu.Item>
        )
        pre.push(menuItem)
      }
      return pre
    }, [])
  }

  componentWillMount () {
    this.menuNodes = this.getNodes(menuConfig)
  }

  render() {

    const path = this.selectKey || this.props.location.pathname
    return (
      <div className="left-nav">
        <NavLink to="/home" className="logo">
          <img src={logo} alt="logo"/>
          <h1>后台管理</h1>
        </NavLink>

        <Menu theme="dark"
              defaultOpenKeys={[this.openKey]}
              defaultSelectedKeys={[path]}
              mode="inline">
          {this.menuNodes}
        </Menu>
      </div>
    )
  }
}

export default withRouter(LeftNav)