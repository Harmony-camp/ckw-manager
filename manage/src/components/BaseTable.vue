<template>
  <div class="action">
    <slot></slot>
  </div>
  <el-table :data="tableData" row-key="_id" stripe>
    <el-table-column v-for="item in columns" :key="item.prop" v-bind="item">
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button
          type="primary"
          size="small"
          @click="handleEdit(scope.row)"
          v-has="'dept-edit'"
          >查看</el-button
        >
      </template>
    </el-table-column>
    
  </el-table>
  <el-dialog title="查看审核状态" v-model="showModal">
      <el-form label-width="120px">
        
        <el-steps :active="active" align-center>
          <el-step title="待审批"></el-step>
          <el-step title="审批中"></el-step>
          <el-step title="审批通过/审批拒绝"></el-step>
        </el-steps>
        
        <template v-for="(item,index) in columns">
          <el-form-item 
            :label="item.label" 
            :prop="item.prop" >
            <el-input />
          </el-form-item>
        </template>
        
      </el-form>
    </el-dialog>
</template>

<script setup>
import { defineProps, ref } from "vue";
const {columns,tableData} = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  tableData:{
    type:Array,
    default:()=>[]
  }
});
const active = ref(1)
const showModal = ref(false)
const handleEdit = (row)=>{
  showModal.value = true
  let colList = row
  console.log('data :>> ', columns[0]);
} 
</script>

<style lang="scss" scoped></style>
