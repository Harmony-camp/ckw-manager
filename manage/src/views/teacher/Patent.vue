<template>
  <div class="patent-manage">
    <div class="query-form">
      <Query />
    </div>
    <div class="base-table">
      <BaseTable :columns="columns">
        
      </BaseTable>
    </div>
  </div>
</template>

<script setup>
import Query from '../../components/Query.vue';
import BaseTable from '../../components/BaseTable.vue';
import {ref} from 'vue'

const columns = ref([
      {label:"金额",prop:"amount"},
      {label:"转换时间",prop:"conversionTime"}])

</script>


<style lang="scss" scoped>
.patent-manage{
  .query-form{
    display: flex;
    align-items: center;
    height: 80px;
    
  }
}
 
</style>