<template>
  <div class="forgot-wrapper">
    <div class="modal">
      <el-steps align-center :active="active" finish-status="success">
        <el-step title="身份验证" />
        <el-step title="密码重置" />
        <el-step title="设置完成" />
      </el-steps>
      <hr>
      <div class="main">
        <div class="setIdentity" v-if="active == 1">
          <div class="form">
            <el-form :model="identity" >
              <el-form-item>
                <el-input v-model="identity.email" :prefix-icon="Avatar" />
              </el-form-item>
              <el-form-item>
                <el-input v-model="identity.code" :prefix-icon="Message">
                  <template #append>
                    <el-button @click="getEmailCode">获取邮箱验证码</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="setIdentity"> 下一步 </el-button>
                  <el-button> 重置 </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div class="setPassword" v-if="active == 2">
          <el-form :model="setPasswd">
            <el-form-item prop="password">
              <el-input
                v-model="setPasswd.password"
                type="password"
                ref="passwd"
                :prefix-icon="Lock"
                placeholder="请输入新密码"
              >
              <template #suffix >
                <el-icon @click="showPassword"><View/></el-icon>
              </template>
            </el-input>
            </el-form-item>
            <el-form-item prop="rePassword">
              <el-input
                v-model="setPasswd.rePassword"
                type="password"
                :prefix-icon="Lock"
                placeholder="请再次输入密码"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary"> 下一步 </el-button>
              <el-button> 重置 </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="success" v-if="active == 3">

          <div>设置成功，请从新登录</div>
          <el-button type="primary">从新登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,reactive } from "vue";
import { Avatar, Message,Lock ,View} from "@element-plus/icons-vue";
import {ElMessage} from 'element-plus'
import {GetEmailCode} from '../../api'
import md5 from 'md5'

const active = ref(2);
const passwd = ref("")
const setPasswd = reactive({})
const identity = reactive({})
const rules = {
  password:[{
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },],
  rePassword:[{
      required: true,
      message: "请再次输入密码",
      trigger: "blur",
    },],
}
const code = ref()
const showPassword = ()=>{
  if(passwd.value.input.type == "password") passwd.value.input.type = "text"
  else passwd.value.input.type = "password"
  
}

async function getEmailCode(){
  if(!identity.email)return ElMessage({type:"error",message:"请输入邮箱"})
  let res = await GetEmailCode({email:identity.email})
  code.value =  res
  ElMessage({type:"success",message:"验证码发送成功"})
}

function setIdentity(){
  if(!identity.email)return ElMessage({type:"error",message:"请输入邮箱"})
  if(!identity.code)return ElMessage({type:"error",message:"验证码不能为空"})
  if(md5(identity.code) != code.value) ElMessage({type:"error",message:"验证码错误"})
  active.value = 2
}
</script>

<style lang="scss">
.forgot-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width: 100vw;
  height: 100vh;
  .modal {
    width: 600px;
    padding: 50px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    .main{
      >* {
        padding-top: 30px;
        align-items: center;
        display: flex;
        justify-content: center;
      }
      .success{
        display: flex;
        justify-content: center;
        flex-direction: column;
        >div{
          padding: 30px;
        }
      }
    }
    
  }
}
</style>
