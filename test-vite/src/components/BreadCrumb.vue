<template>
   <el-breadcrumb >
    <el-breadcrumb-item  v-for="(item,index) in breadList" :key="item.path">
      <router-link to="/welcome" v-if="index==0">{{ item.meta.title }}</router-link>
      
      <span v-else>{{item.meta.title}}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import {defineProps,computed} from 'vue'
import {useRoute} from 'vue-router'

const route = useRoute()
defineProps({
  
})
const breadList = computed(()=>{
  return route.matched
})

</script>

<style lang="scss" >

</style>