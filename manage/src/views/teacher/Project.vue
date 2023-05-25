<template>
  <div class="award-manage">
    <div class="query-form">
      <Query />
    </div>
    <div class="base-table">
      <BaseTable :action="'project'">
        
      </BaseTable>
    </div>
  </div>
</template>

<script setup>
import Query from '../../components/Query.vue';
import BaseTable from '../../components/BaseTable.vue';


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