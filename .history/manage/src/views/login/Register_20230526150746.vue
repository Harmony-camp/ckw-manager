<template>
  <div class="register-wrapper">
    <div class="modal">
      <el-form :model="user" status-icon :rules="rules" ref="userForm">
        <div class="title">用户注册</div>
        <el-form-item  prop="username">
          <el-input placeholder="请输入用户名称" type="text" :prefix-icon="Avatar" v-model="user.username" />
        </el-form-item>
        <el-form-item  prop="password">
          <el-input
            type="password"
            :prefix-icon="Lock"
            v-model="user.password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item  prop="rePassword">
          <el-input
          placeholder="请再次输入密码"
            type=" "
            :prefix-icon="Lock"
            v-model="user.rePassword"
          />
        </el-form-item>
        <el-form-item  prop="userEmail">
          <el-input v-model="user.userEmail" placeholder="请输入邮箱" >
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
        <el-form-item>
          <router-link to="/login"></router-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { Avatar, Lock } from "@element-plus/icons-vue";
import { ref, onMounted, reactive } from "vue";
import { useStore } from "vuex";
import { GetDeptList, getRegisterRoleList ,UserSubmit} from "../../api";
import { ElMessage } from "element-plus";


const router = useRouter();
const store = useStore();
const  deptList = ref()
const user = reactive({
  username: "",
  password: "",
  rePassword:"",
  email:"@gmail.com"
});

 
onMounted(async () => {
  getRegisterRoleList().then((res) => {
    user.role = res;
    user._id = user.role[0]._id;
  });
  deptList.value = await GetDeptList();
});

const rules = ref({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  rePassword: [{ required: true, message: "请输再次入密码", trigger: "blur" }],
  
});
const userForm = ref(null);

const register = () => {
  userForm.value.validate(async (valid) => {
    if(valid){
      if(user.password != user.rePassword) return ElMessage({type:"error",message:"两次密码不一样，请重新输入"})
      let params = {...user}
      user.userEmail && ( params.userEmail = user.userEmail + user.email)
      params.roleList = [user._id]
      params.state = 1
      params.action = "add"
      
      delete params.rePassword
      delete params.email
      delete params.role
      delete params._id

      await UserSubmit(params)
      
      ElMessage({ message: "用户注册成功", type: "success" });
      setTimeout(()=>{
        router.push("/login")
      },1500)
    }
  });
};
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
    .title {
      font-size: 50px;
      line-height: 50px;
      text-align: center;
      margin-bottom: 30px;
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>
