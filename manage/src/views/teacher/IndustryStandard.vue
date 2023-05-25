<template>
  <div class="standard-manage">
    <div class="query-form">
      <Query />
    </div>
    <div class="base-table">

      <BaseTable :action="'industry'" :columns="columns"></BaseTable>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import Query from '../../components/Query.vue';
import BaseTable from '../../components/BaseTable.vue';
  
const columns = ref([
    {label:"类型",prop:"HType"},
    {label:"公布部门",prop:"publicDept"},
    {label:"公布时间",prop:"timePublication"},
    
])
</script>

<style lang="scss" >
.query-form{
    display: flex;
    align-items: center;
    height: 80px;
    
  }
</style>