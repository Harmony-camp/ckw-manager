/**
 * Mutations业务层数据提交
 */


import storage from "../utils/storage";

export default {
  saveUserInfo(state,userinfo){
    state.userinfo = userinfo;
    storage.setItem("userinfo",userinfo)
  },
  saveMenuList(state,menuList){
    state.menuList = menuList;
    storage.setItem("menuList",menuList)
  },
  saveActionList(state,actionList){
    state.actionList = actionList;
    storage.setItem("actionList",actionList)
  },
  saveNoticeCount(state,noticeCount){
    state.noticeCount = noticeCount;
    storage.setItem("noticeCount",noticeCount)
  },
}