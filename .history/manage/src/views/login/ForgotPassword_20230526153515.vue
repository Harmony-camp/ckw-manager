<template>
  <div class="register-wrapper">
    <div class="modal">
      <el-form :model="user" status-icon :rules="rules" ref="userForm">
        <div class="title">用户注册</div>
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名称"
            type="text"
            :prefix-icon="Avatar"
            v-model="user.username"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            :prefix-icon="Lock"
            v-model="user.password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input
            placeholder="请再次输入密码"
            type=" "
            :prefix-icon="Lock"
            v-model="user.rePassword"
          />
        </el-form-item>
        <el-form-item prop="userEmail">
          <el-input v-model="user.userEmail" placeholder="请输入邮箱">
            <template #append>
              <el-select v-model="user.email">
                <el-option value="@gmail.com" label="@gmail.com"></el-option>
                <el-option value="@qq.com" label="@qq.com"></el-option>
                <el-option value="@163.com" label="@163.com"></el-option>
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="role">
          <el-select v-model="user._id" style="width: 100%">
            <el-option
              v-for="item in user.role"
              :value="item._id"
              :label="item.roleName"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="dept">
          <el-cascader
            style="width: 100%"
            v-model="user.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{
              expandTrigger: 'hover',
              checkStrictly: true,
              value: '_id',
              label: 'deptName',
            }"
            clearable
          >
          </el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary" @click="register"
            >注册</el-button
          >
        </el-form-item>
        <div class="user">
          <router-link to="/ForgotPassword">忘记密码</router-link>
          <router-link to="/login">已有账号？点击登录</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss">
.register-wrapper {
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
    
  }
}
</style>
