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
            <el-form v-model="identity">
              <el-form-item>
                <el-input  :m:prefix-icon="Avatar" />
              </el-form-item>
              <el-form-item>
                <el-input :prefix-icon="Message">
                  <template #append>
                    <el-button>获取邮箱验证码</el-button>
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

const active = ref(1);
const passwd = ref("")
const setPasswd = reactive({})
const identity = reactive({})
const showPassword = ()=>{
  if(passwd.value.input.type == "password") passwd.value.input.type = "text"
  else passwd.value.input.type = "password"
  
}

function setIdentity(){

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
