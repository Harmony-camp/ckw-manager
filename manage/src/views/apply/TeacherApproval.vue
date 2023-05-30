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
            <el-button type="primary" @click="getTeacherApprovallList">查询</el-button>
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
            <el-button size="small" @click="handleDetail(scope.row)" >审核</el-button>
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
        <el-form-item label="获奖类型"><span>{{ detail.HType }}</span></el-form-item>
        <el-form-item label="获奖级别"><span>{{ detail.Level }}</span></el-form-item>
        <el-form-item label="获奖时间"><span>{{ detail.year }}</span></el-form-item>
        <el-form-item label="审批状态"><span>{{ detail.applyStateName }}</span></el-form-item>
        <el-form-item label="审批人"><span>{{ detail.auditUserName }}</span></el-form-item>
        <el-form-item label="文件列表"><span>{{ detail.fileList }}</span> <el-button @click="preview" type="success">预览</el-button> </el-form-item>
        <el-form-item label="备注信息" prop="remark"> <el-input v-model="auditForm.remark" type="textarea" :row="3" placeholder="亲输入审核备注"/> </el-form-item>
      </el-form>
      <template #footer>
          <span class="dialog-footer">
            <el-button  @click="handleApprove('refuse')">驳回</el-button>
            <el-button type="primary" @click="handleApprove('pass')"> 审核通过</el-button>
          </span>
      </template>
    </el-dialog>
    <el-dialog title="预览文件" width="75%" v-model="previewDialog">
      <!-- <iframe :src="previewUrl" width="100%" height="600" frameborder="0"></iframe> -->
      <div class="btn">
      <el-button @click="nextTo(1)">上一个文件</el-button>
      <el-button @click="nextTo(2)">下一个文件</el-button>
    </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { GetTeacherApprovallList} from "../../api";
import utils from '../../utils/utils'
import {useStore} from 'vuex'
const store = useStore()

const showDetailModal = ref(false)
const userinfo = store.state.userinfo
const dialogForm = ref("")
const queryForm = reactive({
  applyState:1
});
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

const getTeacherApprovallList = async ()=>{
  
  let params = {...queryForm,...pager,action:"award"}
  let {list,page} = await GetTeacherApprovallList(params)
  applyList.value = list
  
  pager.total = page.total
}

let fileType = []
let fileList = []
const handleDetail = (row)=>{
  showDetailModal.value = true
  
  let data = {...row}
  data.HType = {
    1: "优秀老师",
        2: "优秀教育工作者",
        3: "教学成果奖",
        4: "科研成果奖",
        5: "科技进步奖",
  }[data.HType]
  data.year = utils.formateDate( new Date(data.year),"MM-dd")
  data.Level = {
    1: "校级",
        2: "市级",
        3: "省部级",
        4: "国家级",
  }[data.Level]
  data.applyStateName = {
    1:"待审批",
    2:"审批中",
    3:"审批拒绝/审批通过",
    4:"作废"
  }[data.state]
  let a = ''
  row.fileList.map(item=>{
    console.log('item :>> ', item);
    let b = (item.name + '').substring( (item.name + '').lastIndexOf(".")+1)
    fileType.push(b)
    fileList.push(a)
     a += `${item.name},`
  })
  
  data.fileList = a
  detail.value = data
  
} 
//TODO:预览第一方案失败
// const fileIndex = ref(0)
// const previewDialog = ref(false)
// const previewUrl = ref()
// function nextTo(next){
//   if(next == 1)fileIndex += 1
//   else fileIndex -= 1
// }
// function preview(){
//   showDetailModal.value = false
//   previewDialog.value = true
//   fileType.map(item=>{
//     if(item == "doc" || item == "docx" || item == "xls" || item == 'xlsx'){
//       previewUrl.value = `https://view.officeapps.live.com/op/view.aspx?src=http://localhost:5173/api/teacher/getFile?fileName=${fileList[fileIndex]}`
//     }else{
//       previewUrl.value = `http://localhost:5173/api/teacher/getFile?fileName=${fileList[fileIndex]}`
//     }
//   })
// }

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


const handleCurrentChange = ()=>{
  
}
getTeacherApprovallList()
</script>

