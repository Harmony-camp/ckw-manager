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
      <div class="action">
        <el-button type="primary" @click="handleApply" >申请休假</el-button>
      </div>

      <el-table :data="applyList">
        
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
            <el-button size="small" @click="handleDetail(scope.row)">查看</el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row._id)"
              v-if="[1,2].includes(scope.row.applyState)"
              >作废</el-button
            >
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
    <el-dialog title="申请休假" v-model="showModal" width="70%">
      <el-form ref="dialogForm" :model="leaveForm" label-width="120px" :rules="rules">
        <el-form-item label="休假类型" prop="applyType" required>
          <el-select v-model="leaveForm.applyType">
            <el-option label="事假" :value="1"></el-option>
            <el-option label="调休" :value="2"></el-option>
            <el-option label="年假" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假时间" required>
          <el-row>
            <el-col :span="10">
              <el-form-item prop="startTime" required>
              <el-date-picker
                v-model="leaveForm.startTime"
                type="date"
                placeholder="选择开始日期"
                @change="(val)=>handleDateChange('startTime',val)"
              />
            </el-form-item>
            </el-col>
            <el-col :span="2">-</el-col>
            <el-col :span="10">
              <el-form-item prop="endTime"  required>
              <el-date-picker
                v-model="leaveForm.endTime"
                type="date"
                placeholder="选择结束日期"
                @change="(val)=>handleDateChange('endTime',val)"
              />
            </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
          
          <el-form-item label="休假时长"  required >
              {{leaveForm.leaveTime}}
          </el-form-item>
          <el-form-item label="休假原因"  required prop="reasons">
              <el-input type="textarea" :row="3" placeholder="请输入休假原因" v-model="leaveForm.reasons"/>
          </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="申请休假详情" width="50%" v-model="showDetailModal" destroy-on-close>
      <el-steps :active="detail.applyState>2?3:detail.applyState" align-center>
        <el-step title="待审批"></el-step>
        <el-step title="审批中"></el-step>
        <el-step title="审批通过/审批拒绝"></el-step>
      </el-steps>
      <el-form label-width="120px" label-suffix=":">
        <el-form-item label="休假类型"><span>{{ detail.applyTypeName }}</span></el-form-item>
        <el-form-item label="休假时间"><span>{{ detail.time }}</span></el-form-item>
        <el-form-item label="休假时长"><span>{{ detail.leaveTime }}</span></el-form-item>
        <el-form-item label="休假原因"><span>{{ detail.reasons }}</span></el-form-item>
        <el-form-item label="审批状态"><span>{{ detail.applyStateName }}</span></el-form-item>
        <el-form-item label="审批人"><span>{{ detail.curAuditUserName }}</span></el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref ,toRaw,nextTick} from "vue";
import { ElMessage } from "element-plus";
import { GetApplyList,LeaveOperate} from "../api";
import utils from '../utils/utils'

const showModal = ref(false)
const showDetailModal = ref(false)
const action = ref("create")
const  rules = {
  startTime:[{type:'date',required:true,message:"请输入开始日期",trigger:"change"}],
  endTime:[{type:'date',required:true,message:"请输入结束日期",trigger:"change"}],
  reasons:[{required:true,message:"请输入休假原因",trigger:["change","blur"]}],
}

const queryForm = reactive({
  applyState:1
});
const columns = reactive([
  { label: "单号", prop: "orderNo" },
  { label: "休假时间", prop: "",formatter(row){return utils.formateDate( new Date(row.startTime),"MM-dd") + "到" + utils.formateDate(new Date(row.endTime),"MM-dd")} },
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
const dialogForm = ref({})
const applyList = ref([])
const detail = ref({})
const leaveForm = reactive({
  applyType:1,
  startTime:"",
  endTime:"",
  leaveTime:"0天",
  reasons:""
})

const getApplyList = async ()=>{
  let params = {...queryForm,...pager}
  let {list,page} = await GetApplyList(params)
  console.log('list :>> ', list);
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
const handleDelete = async  (_id)=>{
  try {
    let params = {_id,action:"delete"}
    await LeaveOperate(params)
    ElMessage({type:"success",message:"删除成功"})
    getApplyList()
  } catch (error) {
    throw new Error(error)
  }
}

const handleReset = (value) => {
  value.resetFields();
};

const handleClose = ()=>{
  showModal.value = false
  handleReset(dialogForm.value) 
}

const handleDateChange = (key,val)=>{
  let {startTime,endTime} = leaveForm
  if(!startTime || !endTime) return 
  if(startTime > endTime){
    ElMessage({type:"error",message:"开始日期不能晚于结束日期"})
    leaveForm.leaveTime = "0天"
    setTimeout(()=>{
      leaveForm[key] = ""
    },0)
  }else{
    leaveForm.leaveTime = ((endTime - startTime)/(24*60*60*1000) +1)+"天"
  }
}

const handleSubmit =  ()=>{
  dialogForm.value.validate( async valid =>{
    if(valid){
      try {
        let params= {...leaveForm,action:action.value}
        await LeaveOperate(params)
        ElMessage({type:"success",message:"创建成功"})
        handleClose()
        getApplyList()
      } catch (error) {
        throw new Error(error)
      }
    }
  })
}

const handleCurrentChange = (current) => {
  pager.pageNum = current;
};

const handleApply = ()=>{
  showModal.value = true
  action.value = "create"
}


getApplyList();
</script>
