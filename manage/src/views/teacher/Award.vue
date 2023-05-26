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
import Query from "../../components/Query.vue";
import BaseTable from "../../components/BaseTable.vue";
import { ref, onMounted } from "vue";
import utils from "../../utils/utils";
import storage from "../../utils/storage";

const userinfo = storage.getItem("userinfo");
const columns = ref([
  {
    label: "获奖类型",
    prop: "HType",
    formatter(row, column, value) {
      return {
        1: "优秀老师",
        2: "优秀教育工作者",
        3: "教学成果奖",
        4: "科研成果奖",
        5: "科技进步奖",
      }[value];
    },
  },
  {
    label: "级别",
    prop: "Level",
    formatter(row, column, value) {
      return {
        1: "校级",
        2: "市级",
        3: "省部级",
        4: "国家级",
      }[value];
    },
  },
  {
    label: "获奖时间",
    prop: "HTime",
    formatter(row, column, value) {
      return utils.formateDate(new Date(value), "MM-dd");
    },
  },
  { label: "积分", prop: "integral" },
]);
let tableData = ref([]);

async function getTeacherApproval(){
  const res = await utils.getTeacherApprovalList("award", userinfo.userId);
  tableData.value = res;
  console.log('res :>> ', res);
}

onMounted(async () => {
  getTeacherApproval()
  
});
</script>

<style lang="scss">
.award-manage {
  // width: 100vw;
  .query-form {
    display: flex;
    align-items: center;
    height: 80px;
  }
}
</style>
