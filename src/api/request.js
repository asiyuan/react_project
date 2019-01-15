/**
 * Created by asy on 2019-1-15.
 */
// 根据接口文档定义接口请求参数
import ajax from './ajax'

// 处理登录的请求
export const reqLogin = (user) => ajax('/login', user, 'POST')