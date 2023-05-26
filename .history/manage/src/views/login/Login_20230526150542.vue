<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form :model="user" status-icon :rules="rules" ref="userForm">
        <div class="title">管理系统</div>
        <el-form-item prop="username">
          <el-input type="text" :prefix-icon="Avatar" v-model="user.username"/>
        </el-form-item>
        <el-form-item prop="password"> 
          <el-input type="password" :prefix-icon="Lock" v-model="user.password"/>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary" @click="login">登录</el-button>
        </el-form-item>
        <el-form-item >
          <router-link to="/register">还没账号，点击注册</router-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { Avatar, Lock } from "@element-plus/icons-vue";
import {ref,nextTick} from 'vue'
import { useStore } from "vuex";
import {UserLogin,getPermissionList} from '../../api'
import utils from '../../utils/utils'
import storage from '../../utils/storage'

const router = useRouter()
const store = useStore()
const user = ref({
  username:"",
  password:""
})
const rules = ref({
  username:[
    {required:true,message:"请输入用户名",trigger:"blur"}
  ],
  password:[
    {required:true,message:"请输入密码",trigger:"blur"}
  ],
})
const userForm = ref(null)

const login = ()=>{
  userForm.value.validate(valid=>{
    if(valid){
      UserLogin(user.value).then(async res=>{
        console.log(res);
        store.commit("saveUserInfo",res)
        await loadAsyncRoutes()
        nextTick(()=>{
          router.push("/welcome")
        })
      })
    }else{
      return false
    }
  })
}
async function loadAsyncRoutes(){
  let userinfo  = storage.getItem("userinfo") || {}
  if(userinfo.token){
    try{
      const {menuList} =  await getPermissionList()
      let routes = utils.generateRoute(menuList)
      routes.map(route=>{
        let url = `../${route.component}.vue`
        route.component =  ()=>import(/* @vite-ignore */url)
        router.addRoute("home",route)
      })
    }catch(error){
      console.log('error :>> ', error);
    }
  }
}

</script>

<style lang="scss">
.login-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width: 100vw;
  height: 100vh;
  .modal{
    width: 500px;
    padding: 50px;
    background-color: #fff;
    border-radius: 4px ;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    .title{
      font-size: 50px;
      line-height: 50px;
      text-align: center;
      margin-bottom: 30px;
    }
    .btn-login{
      width: 100%;
    }
  }
}
</style>
