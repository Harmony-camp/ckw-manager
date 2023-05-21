<template>
  <div class="award-manage">
    <div class="query-form">
      <Query />
    </div>
    <div class="base-table">
      <BaseTable :columns="columns" :tableData="tableData">
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
                <el-option  label="国家级" :value="4"/>
              </el-select>
            </el-form-item>
            <el-form-item prop="HTime" placeholder="获奖时间" required>
              <el-date-picker 
              style="width: 100%"
                v-model="awardData.HTime"
                type="date"
                placeholder="选择获奖日期"
              />
            </el-form-item>
            
            <el-form-item prop="fileList">
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
              <el-button @click="handleClose">取消</el-button>
              <el-button @click="handleSubmit" type="success">确定</el-button>
            </span>
          </template>
        </el-dialog>
      </BaseTable>
    </div>
  </div>
</template>

<script setup>
import Query from '../../components/Query.vue';
import BaseTable from '../../components/BaseTable.vue';
import {ref,reactive,computed} from 'vue'
import {UploadSupportingDocuments} from '../../api'
import storage from '../../utils/storage';

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

const columns = ref([
      {label:"获奖类型",prop:"HType"},
      {label:"级别",prop:"Level"},
      {label:"获奖时间",prop:"HTime"},{label:"排名",prop:"HRank"}])
let tableData = ref([
  {HType:"优秀教师",Level:"校级",HTime:"2022-04-05",HRank:10,integral:10,fileList:awardData.fileList},
  {HType:"优秀教师",Level:"校级",HTime:"2022-04-05",HRank:10,integral:10,fileList:awardData.fileList},
  {HType:"优秀教师",Level:"校级",HTime:"2022-04-05",HRank:10,integral:10,fileList:awardData.fileList},
  {HType:"优秀教师",Level:"校级",HTime:"2022-04-05",HRank:10,integral:10,fileList:awardData.fileList},
  {HType:"优秀教师",Level:"校级",HTime:"2022-04-05",HRank:10,integral:10,fileList:awardData.fileList},
  {HType:"优秀教师",Level:"校级",HTime:"2022-04-05",HRank:10,integral:10,fileList:awardData.fileList},
])
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
      params.map(item=>{
        formData.append(item)
      })
      let res =  await UploadSupportingDocuments(formData)
    }
  })
}

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