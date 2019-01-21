import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {Col, Row, Modal} from 'antd'

import './header.less'
import MemoryUtils from '../../utils/MemoryUtils'
import storageUtils from '../../utils/storageUtils'
import {formateDate} from '../../utils/utils'
import {reqWeather} from '../../api/request'
import menuList from '../../config/menuConfig'

class Header extends Component {

  state = {
    sysTime: formateDate(Date.now()),
    dayPictureUrl: '',
    weather: ''
  }

  lagout = () => {
    Modal.confirm({
      title: 'Do you Want to exit?',
      onOk: () => {
        storageUtils.removeUser()
        MemoryUtils.user = {}
        this.props.history.replace('/login')
      },
      onCancel() {
      },
    })
  }

  getWeather = async () => {
    const {dayPictureUrl, weather} = await reqWeather('北京')
    this.setState({
      dayPictureUrl,
      weather
    })
  }

  getSysTime = () => {
    this.intervalId = setInterval(() => {
      this.setState({
        sysTime: formateDate(Date.now())
      })
    },1000)
  }

  // 获取标题的函数
  getTitle = (menuList, path) => {
    let title = traversal(menuList, path)
    return title

    function traversal(menuList, path) {
      if (!menuList) {
        return
      }
      for (let i = 0; i < menuList.length; i++) {
        if (0 === path.indexOf(menuList[i].key)) {
          title = menuList[i].title
          break
        }
        if (menuList[i].children) {
          const menu = menuList[i].children
          traversal(menu, path)
        }
      }
      return title
    }
  }

  // 异步的 ajax 请求放在 componentDidMount 中
  componentDidMount() {
    this.getWeather()
    this.getSysTime()
  }

  // 在组件销毁前清除定时器
  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const user = MemoryUtils.user
    const {dayPictureUrl, weather, sysTime} = this.state

    // 得到标题
    const path = this.props.location.pathname
    const title = this.getTitle(menuList, path)
    
    return (
      <div className='header'>
        <Row className='header-top'>
          <span>欢迎，{user.username}</span>
          <a href="javascript:" onClick={this.lagout}>退出</a>
        </Row>
        <Row className='breadcrumb'>
          <Col span={4} className='breadcrumb-title'>{title}</Col>
          <Col span={20} className='weather'>
            <span className='date'>{sysTime}</span>
            <span className='weather-img'>
              <img src={dayPictureUrl} alt="weather"/>
            </span>
            <span className='weather-detail'>{weather}</span>
          </Col>
        </Row>
      </div>
    )
  }
}

export default withRouter(Header)