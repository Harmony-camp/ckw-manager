<template>

  <div class="time-manage">
    <div class="time">
      2019/4/16
    </div>
    <div class="card">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>Card name</span>
          </div>
        </template>
        <span>PanJiaChen committed 2019/4/20 20:46</span>
      </el-card>  
    </div>
  </div>
  
</template>

<script setup>
import {defineProps} from 'vue'

defineProps({

})
</script>

<style lang="scss" scoped>
.time-manage{
  left: 0;
  .time{
    margin-bottom: 10px;
  }
}
</style>