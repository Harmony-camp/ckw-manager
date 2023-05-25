<template>
  <div class="award-manage">
    <div class="query-form">
      <Query />
    </div>
    <div class="base-table">
      <BaseTable :action="'award'" :columns="columns" :tableData="tableData">
        
      </BaseTable>
    </div>
  </div>
</template>

<script setup>
import Query from '../../components/Query.vue';
import BaseTable from '../../components/BaseTable.vue';
import {  ref } from "vue";


const columns = ref([
      {label:"获奖类型",prop:"HType"},
      {label:"级别",prop:"Level"},
      {label:"获奖时间",prop:"HTime"},{label:"排名",prop:"HRank"}])
let tableData = ref([
  {HType:"优秀教师",Level:"校级",HTime:"2022-04-05"},
  {HType:"优秀教师",Level:"校级",HTime:"2022-04-05"},
  {HType:"优秀教师",Level:"校级",HTime:"2022-04-05"},
  {HType:"优秀教师",Level:"校级",HTime:"2022-04-05"},
  {HType:"优秀教师",Level:"校级",HTime:"2022-04-05"},
  {HType:"优秀教师",Level:"校级",HTime:"2022-04-05"},
])


</script>

<style lang="scss">
.award-manage{
  // width: 100vw;
  .query-form{
    display: flex;
    align-items: center;
    height: 80px;
    
  }
}

</style>