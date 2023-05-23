<template>
  <div class="action">
    <el-button type="primary" @click="handleOpen">上传佐证材料</el-button>
        <el-dialog title="" v-model="showDialog">
          <el-form ref="dialogForm" :model="awardData" :rules="rules" label-width="120px">
            <el-form-item label="获奖类型" prop="HType" >
              <el-select  placeholder="请选择获奖类型" v-model="awardData.HType" style="width: 100%">
                <el-option  label="优秀教师" :value="1"/>
                <el-option  label="优秀教育工作者" :value="2"/>
                <el-option  label="教学成果奖" :value="3"/>
                <el-option  label="科研成果奖" :value="4"/>
                <el-option  label="科技进步奖" :value="5"/>
              </el-select>
            </el-form-item>
            <el-form-item label="获奖级别" prop="Level">
              <el-select   placeholder="请选择获奖类型" v-model="awardData.Level" style="width: 100%">
                <el-option  label="校级" :value="1"/>
                <el-option  label="市级" :value="2"/>
                <el-option  label="省部级" :value="3"/>
                <el-option    label="国家级" :value="4"/>
              </el-select>
            </el-form-item>
            <el-form-item  label="获奖时间" prop="HTime" placeholder="获奖时间" required>
              <el-date-picker 
              style="width: 100%"
                v-model="awardData.HTime"
                type="date"
                placeholder="选择获奖日期"
              />
            </el-form-item>
            
            <el-form-item prop="fileList" label="上传佐证文件">
              <el-upload
                class="upload-demo"
                drag
                multiple
                ref="uploadRef"
                :auto-upload="false"
                v-model:file-list="awardData.fileList"
                
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                  拖拽文件或者 <em>点击这里上传文件</em>
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="可获得积分：">
              <span>{{ integral }}</span>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="showDialog=false">取消</el-button>
              <el-button @click="handleSubmit" type="success">确定</el-button>
            </span>
          </template>
        </el-dialog>
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


import {ref,reactive,computed,defineProps} from 'vue'
import {UploadSupportingDocuments} from '../api'
import storage from '../utils/storage';
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
const uploadRef = ref()
const showDialog = ref(false)
const dialogForm = ref()
const rules = {
  HTime:[
    {type:"date",required:true,message:"请选择一个日期",trigger:"change"}
  ],
  fileList:[{required:true,message:"请选上传至少一个文件",trigger:"blur"}]
}
const awardData = reactive({
  HType:1,
  Level:1,
  fileList:[]
})
const integral = computed(()=>{
  return awardData.Level + awardData.HType
})
const active = ref(1)
const showModal = ref(false)
const handleEdit = (row)=>{
  showModal.value = true
  let colList = row
  console.log('data :>> ', columns[0]);
} 

const handleOpen = ()=>{
  showDialog.value = true
}



const handleSubmit = ()=>{
  
  dialogForm.value.validate(async valid =>{
    if(valid){
      let formData = new FormData()

      let params = {...awardData}
      params.integral = integral.value
      const userinfo = storage.getItem("userinfo")
      params.userId = userinfo.userId
      params.deptId = userinfo.deptId
      for(const item in params) formData.append(item,params.item)
      console.log('params :>> ', params);
      // await UploadSupportingDocuments(formData)
    }
  })
}

</script>

<style lang="scss" scoped></style>
