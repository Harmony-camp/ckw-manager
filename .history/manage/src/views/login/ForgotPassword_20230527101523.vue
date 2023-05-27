<template>
  <div class="forgot-wrapper">
    <div class="modal">
      <el-steps align-center :active="1" finish-status="success">
        <el-step title="验证身份" />
        <el-step title="设置密码" />
        <el-step title="设置成功" />
      </el-steps>
      <hr />
      <div class="setIdentity" ></div>
      <div class="setPassword"></div>
      <div class="success"></div>
    </div>
  </div>
</template>

<script setup>
import 
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
