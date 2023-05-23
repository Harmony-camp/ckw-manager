<template>
  <div class="time-manage">
    <div class="time-item">
        <el-steps  direction="vertical">
          <div class="item">
            <el-step :icon="Apple"/>
            <UseTimeCard class="time-card"/>
          </div>
          <div class="item">
            <el-step :icon="Apple"/>
            <UseTimeCard class="time-card"/>
          </div>
        </el-steps>
      </div>
      
  </div>
</template>

<script setup>
import UseTimeCard from '../../components/UseTimeCard.vue';
import { Apple } from '@element-plus/icons-vue'
</script>

<style lang="scss" >
.time-manage{
  margin-top: 5px;
  .time-item{

    .item{
      display: flex;
      .time-card{
        left: 1px;
      }
    }

    
  }
}
</style>