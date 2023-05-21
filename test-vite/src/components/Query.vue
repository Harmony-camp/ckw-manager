<template>
  <el-form>
    <el-form-item>
        <el-input  style="width: 900px;" clearable placeholder="请输入需要查询的内容" class="input-with-select">
          <template #prepend>
            <el-select
              v-model="queryValue"
              placeholder="Select"
              
            >
              <el-option
                v-for="item in data.options"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
          <template #append>
            <el-button type="primary">
              <el-icon style="vertical-align: middle">
                <Search />
              </el-icon>
              <span style="vertical-align: middle"> 查询 </span>
            </el-button>
          </template>
        </el-input>
      
    </el-form-item>
  </el-form>
</template>

<script setup>
import { defineProps, ref } from "vue";
const data = defineProps({
  options: {
    type: Array,
    default: () => [
      { value: "startTime", label: "按起始时间查询" },
      { value: "typeName", label: "按类型查询" },
      { value: "score", label: "按积分查询" },
    ],
  },
});
const queryValue = ref("startTime");
</script>

<style lang="scss" scoped></style>
