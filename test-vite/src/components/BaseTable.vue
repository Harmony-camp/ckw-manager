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
        <el-form-item 
        :label="item.label" 
        :prop="item.prop" 
        v-for="item in columns">
          
        </el-form-item>
      </el-form>
    </el-dialog>
</template>

<script setup>
import { defineProps, ref } from "vue";
const data = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  tableData:{
    type:Array,
    default:()=>[]
  }
});
const dialogData = ref([])
const showModal = ref(false)
const handleEdit = (row)=>{
  showModal.value = true
  dialogData.value = row
  console.log('columns :>> ',data.columns);
  data.columns.map(item=>{
    
    console.log('Object.keys(row) :>> ', Object.keys(row));
    console.log('Object.value(row) :>> ', Object.values(row));
  })
} 
</script>

<style lang="scss" scoped></style>
