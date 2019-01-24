/**
 * Created by asy on 2019-1-15.
 */
// 根据接口文档定义接口请求参数
import {message} from 'antd'
import jsonp from 'jsonp'

import ajax from './ajax'

// 处理登录的请求
export const reqLogin = (user) => ajax('/login', user, 'POST')

// 处理请求天气
export function reqWeather(city) {
  const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`

  // 返回 promise 对象
  return new Promise((resolve, reject) => {
    jsonp(url, {
      param: 'callback'
    }, (err, response) => {
      if (!err) {
        const {dayPictureUrl, weather} = response.results[0].weather_data[0]
        resolve({dayPictureUrl, weather})
      } else {
        message.error('请求天气出错了')
      }
    })
  })
}

// 一级/二级 分类
export const reqCategory = (parentId) => ajax('/manage/category/list', {parentId} ,'GET')

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax('/manage/category/add', {categoryName, parentId},'POST')

// 修改分类
export const reqUpdateCategory = (categoryName, categoryId) => ajax('/manage/category/update', {categoryName, categoryId},'POST')

// 获取商品
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize})

// 分类搜索
export const reqSearchProducts = (pageNum, pageSize, searchType, searchName) => ajax('/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]: searchName,
})

// 删除上传的图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name}, 'POST')

// 添加商品
export const addOrUpdateProduct = (product) => ajax('/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

// 更新商品状态
export const reqUpdateProductStatus = ({productId, status}) => ajax(
  '/manage/product/updateStatus', {productId, status}, 'POST'
)

// 用户管理
export const reqUsers = () => ajax('/manage/user/list', {})

// 根据id获取分类
export const reqCategoryById = (categoryId) => ajax('/manage/category/info', {categoryId})

// 获取所有角色
export const reqRoles = () => ajax('/manage/role/list', {})

// 添加角色
export const reqAddRole = (roleName) => ajax('/manage/role/add', {roleName}, 'POST')

// 更新角色
export const reqUpdateMenus = (role) => ajax('/manage/role/update', role, 'POST')

// 添加或修改用户
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/' +
  (user._id ? 'update' : 'add'), user, 'POST')