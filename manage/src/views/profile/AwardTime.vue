<template>
  <div class="time-manage">
    <div class="time-item">
        <el-steps  direction="vertical">
          <!-- //TODO: 这里还没有填上数据 -->
            <el-step :icon="Apple">
              <template #title>
                <UseTimeCard class="time-card"/>
              </template>
            </el-step>
            <el-step :icon="Apple">
              <template #title>
                <UseTimeCard class="time-card"/>
              </template>
            </el-step>
            <el-step :icon="Apple">
              <template #title>
                <UseTimeCard class="time-card"/>
              </template>
            </el-step>
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
  
}
</style>