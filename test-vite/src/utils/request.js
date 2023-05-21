/**
 * axios二次封装
 */

import axios from 'axios'
import {ElMessage} from 'element-plus'
import router from '../router'
import config from '../config'
import storage from './storage'
const TOKEN_INVALID = "token认证失败，请从新登陆"
const NETWORK_ERROR = "网络请求异常，请稍后重试"

//TODO axios实例对象，添加全局配置
const service = axios.create({
  baseURL:config.baseApi,
  timeout:8000
})


service.interceptors.request.use(req=>{

  //TODO 封装请求拦截
  const headers = req.headers;
  const {token} = storage.getItem("userinfo") || {}
  if(!headers.Authorization) headers.Authorization = "Bearer "  + token
  return req

})


service.interceptors.response.use(res=>{
  const {code,data,msg} = res.data;
  if(code === 200) return data;
  else if(code === 50001){
    ElMessage.error(TOKEN_INVALID)
    setTimeout(()=>{
      router.push('/login')
      return Promise.reject(TOKEN_INVALID)
    },1500)
  }else{
    ElMessage.error(msg|| NETWORK_ERROR)
    return Promise.reject(msg||NETWORK_ERROR)
  }

})


/**
 * 请求核心参数
 * @param {*} options 请求配置
 * @returns 
 */

function request(options){
  options.method = options.method || "get"
  if(options.method.toLowerCase() === 'get'){
    options.params = options.data;
  }
  let isMock  = config.mock
  if(typeof options.mock != "undefined") isMock = options.mock
  if(config.env === 'prod'){
    service.defaults.baseURL = config.baseApi
  }else{
    service.defaults.baseURL = isMock? config.mockApi:config.baseApi
  }
  return service(options)
}

["get","post","put","delete",'patch'].forEach(item=>{
  request[item] = (url,data,options)=>{
    return request({
      url,
      data,
      method:item,
      ...options
    })
  }
})

export default request