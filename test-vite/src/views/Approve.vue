<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="queryForm.applyState">
            <el-option value="" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批拒绝"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
          
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="getApplyList">查询</el-button>
            <el-button @click="handleReset(form)">重置</el-button>
          </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      

      <el-table :data="applyList" >
        
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="handleDetail(scope.row)" v-if="scope.row.curAuditUserName == userinfo.username && [1,2].includes(scope.row.applyState)">审核</el-button>
            
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev,pager,next"
        :total="pager.total"
        @current-change="handleCurrentChange"
        :page-size="pager.pageSize"
      />
    </div>


    <el-dialog title="审核" width="50%" v-model="showDetailModal" destroy-on-close>
      <el-form label-width="120px" label-suffix=":" :model="auditForm" ref="dialogForm" :rules="rules">
        <el-form-item label="申请人"><span>{{ detail.applyUser.username }}</span></el-form-item>
        <el-form-item label="休假类型"><span>{{ detail.applyTypeName }}</span></el-form-item>
        <el-form-item label="休假时间"><span>{{ detail.time }}</span></el-form-item>
        <el-form-item label="休假时长"><span>{{ detail.leaveTime }}</span></el-form-item>
        <el-form-item label="休假原因"><span>{{ detail.reasons }}</span></el-form-item>
        <el-form-item label="审批状态"><span>{{ detail.applyStateName }}</span></el-form-item>
        <el-form-item label="审批人"><span>{{ detail.curAuditUserName }}</span></el-form-item>
        <el-form-item label="备注信息" prop="remark"> <el-input v-model="auditForm.remark" type="textarea" :row="3" placeholder="亲输入审核备注"/> </el-form-item>
      </el-form>
      <template #footer>
        
          <span class="dialog-footer">
            <el-button  @click="handleApprove('refuse')">驳回</el-button>
            <el-button type="primary" @click="handleApprove('pass')"> 审核通过</el-button>
          </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref ,toRaw,nextTick} from "vue";
import { ElMessage } from "element-plus";
import { GetApplyList,LeaveApprove} from "../api";
import utils from '../utils/utils'
import {useStore} from 'vuex'
const store = useStore()

const showDetailModal = ref(false)
const userinfo = store.state.userinfo
const dialogForm = ref("")
const queryForm = reactive({
  applyState:1
});
const columns = reactive([
  { label: "单号", prop: "orderNo" },
  { label: "申请人", prop: "",formatter(row){
    return row.applyUser.username
  }},
  { label: "休假时长", prop: "leaveTime" },
  {
    label: "休假类型",
    prop: "applyType",
    formatter(row, column, value) {
      return {
        1: "事假",
        2: "调休",
        3: "年假",
      }[value];
    },
  },
  {
    label: "休假原因",
    prop: "reasons"
  },
  { label: "申请时间", prop: "createTime",formatter(row,column,value){
    return utils.formateDate(new Date(value))
  } },
  { label: "审批人", prop: "auditUsers"},
  { label: "当前审批人", prop: "curAuditUserName"},
  { label: "审批状态", prop: "applyState",formatter(row,column,value){
    return {
      1:"待审批",
      2:"审批中",
      3:"审批拒绝",
      4:"审批通过",
      5:"作废",
    }[value]
  } },
]);
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total:0
});

const form = ref();
const rules = {
  remark:[
    {required:true,message:"请输入审核备注",trigger:"change"}
  ]
}
const applyList = ref([])
const detail = ref({})
const auditForm = reactive({
  remark:""
})

const getApplyList = async ()=>{
  let params = {...queryForm,...pager,type:"approve"}
  let {list,page} = await GetApplyList(params)
  applyList.value = list
  console.log('applyList :>> ', applyList);
  pager.total = page.total
}

const handleDetail = (row)=>{
  showDetailModal.value = true
  let data = {...row}
  data.applyTypeName = {
    1:"事假",
    2:"调休",
    3:"年假"
  }[data.applyType]
  data.time = (utils.formateDate( new Date(data.startTime),"MM-dd") + "到" + utils.formateDate(new Date(data.endTime),"MM-dd"))
  data.applyStateName = {
    1:"待审批",2:"审批中",3:"审批拒绝",4:"通过",5:"作废"
  }[data.applyState]
  detail.value = data
} 

const handleApprove =  (action)=>{
  dialogForm.value.validate(async valid=>{
    if(valid){
      let params = {action,remark:auditForm.remark,_id:detail.value._id}
      try {
        await LeaveApprove(params)  
        handleClose()
        ElMessage({type:"success",message:"处理成功"})
        getApplyList()
        store.commit("saveNoticeCount",store.state.noticeCount - 1)
      } catch (error) {
        console.log('error.stack :>> ', error.stack);
      }
      
    }
  })
}

const handleClose = ()=>{
  showDetailModal.value = false
  handleReset(dialogForm.value) 
}

const handleReset = (value) => {
  value.resetFields();
};




getApplyList();
</script>
