/**
 * vuex状态管理
 */
import {createStore} from 'vuex'
import mutations from './mutations'
import storage from '../utils/storage'

const state = {
  userinfo:storage.getItem("userinfo") || {},
  menuLit:storage.getItem("menuList") || [],
  actionList :storage.getItem("actionListList") || [],
  noticeCount:0
}

export default createStore({
  state,
  mutations
})