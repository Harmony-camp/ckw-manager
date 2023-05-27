<template>
  <div class="forgot-wrapper">
    <div class="modal">
      <el-steps align-center :active="active" finish-status="success">
        <el-step title="身份验证" />
        <el-step title="密码重置" />
        <el-step title="设置完成" />
      </el-steps>
      <hr />
      <div class="main">
        <div class="setIdentity" v-if="active == 1">
          <el-form>
            <el-form-item>
              <el-input :prefix-icon="Avatar" label-width=""/>
            </el-form-item>
          </el-form>
        </div>
        <div class="setPassword" v-if="active == 2">2</div>
        <div class="success" v-if="active == 3">3</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import { Avatar } from "@element-plus/icons-vue";

const active = ref(1)

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
  }
}
</style>
