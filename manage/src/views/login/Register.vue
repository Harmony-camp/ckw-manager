<template>
  <div class="register-wrapper">
    <div class="modal">
      <el-form :model="user" status-icon :rules="rules" ref="userForm">
        <div class="title">用户注册</div>
        <el-form-item prop="username">
          <el-input type="text" :prefix-icon="Avatar" v-model="user.username"/>
        </el-form-item>
        <el-form-item prop="password"> 
          <el-input type="password" :prefix-icon="Lock" v-model="user.password"/>
        </el-form-item>
        <el-form-item prop="role"> 
          <el-select v-model="user._id">
              <el-option 
                v-for="item in user.role" 
                :value="item._id" 
                :label="item.roleName"/>
            
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary" @click="login">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { Avatar, Lock } from "@element-plus/icons-vue";
import {ref,onMounted,reactive} from 'vue'
import { useStore } from "vuex";
import {UserLogin,getRegisterRoleList} from '../../api'

const router = useRouter()
const store = useStore()
const user = reactive({
  username:"",
  password:"",
  
})
onMounted(()=>{
  getRegisterRoleList().then(res=>{
    user.role = res
    user._id = user.role[0]._id
  })
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
    
    let roleList = []
    roleList.push(user._id)
    user.roleList = roleList 
    let params = {...user}
    delete params._id
    delete params.role
    console.log('params :>> ', params);
    if(valid){
      
    }else{
      return false
    }
  })
}


</script>

<style lang="scss">
.register-wrapper{
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
