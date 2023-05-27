<template>
  <div class="basic-layout">
    <div class="nav-side">
      <div class="logo">
        <img src="../assets/logo.png" alt="" />
        <span>Manager</span>
      </div>
      <el-menu 
        :default-actice="activeMenu" 
        class="nav-menu" 
        router 
        background-color="#001529" 
        text-color="#fff" 
        >
        <TreeMenu :userMenu="userMenu.menu" />
      </el-menu>
    </div>
    <div class="content-right">
      <div class="nav-top">
        <div class="bread">
          <BreadCrumb />
        </div>
        
        <div class="user-info">
          <el-badge :is-dot="noticeCountData>0 ?true:false" class="notice" type="danger" @click="goAudit">
            <el-icon><Bell /></el-icon>
          </el-badge>

          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ userinfo.username }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="email">邮箱{{ userinfo.userEmail }}</el-dropdown-item>
                <el-dropdown-item commend="logout">退出 </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        
          <router-view></router-view>
        
      </div>
    </div>
  </div>
</template>

<script setup>

import {ref,reactive,computed} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import {NoticeCount,MenuList,getPermissionList} from '../api'
import TreeMenu from './TreeMenu.vue'
import BreadCrumb from './BreadCrumb.vue'

const store = useStore()
const router = useRouter()

const userinfo = ref(store.state.userinfo)

const activeMenu = ref(location.hash.slice(1))

const userMenu = reactive({
  menu:[]
})

const handleLogout = (key)=>{
  if(key== 'email') return 
  if(key == "profile") {
    router.push("/profile/analysis")
    return 
  }
  store.commit("saveUserInfo","")
  userinfo.value = {}
  router.push("/login")
}

async function getNoticeCount(){
  try{
    const count = await NoticeCount()
    store.commit("saveNoticeCount",count)

  }catch(error){
    console.error(error);
  }
}
async function getMenuList(){
  try{
    const {menuList,actionList} = await getPermissionList()
    userMenu.menu = menuList
    store.commit("saveMenuList",menuList)
    store.commit("saveActionList",actionList)
  }catch(error){
    console.log(error);
  }
}
const goAudit = ()=>{
  router.push("/apply/approve")
}
let noticeCountData = computed(()=>{
  return store.state.noticeCount
})
console.log('noticeCountData :>> ', noticeCountData);

getNoticeCount()
getMenuList()
</script>

<style lang="scss">
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: width 0.5s;
    .logo{
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img{
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
    }
    .nav-menu{
      border-right: none;
      height: calc(100vh - 50px);
    }
  }
  .content-right {
    margin-left: 200px;
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .bread{
        display: flex;
        align-items: center;
      }
      .user-info{
        display: flex;
        align-items: center;
        .notice{
          line-height: 30px;
          margin-right: 15px;
          cursor: pointer;
        }
        .user-link{
          line-height: 25px;
          cursor: pointer;
          color: #409fff;
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      min-height: calc(100vh - 50px);
      .main-page {
        background-color: #fff;
        height: 100%;
      }
    }
  }
}
</style>
