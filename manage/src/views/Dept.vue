<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form inline ref="queryForm" :model=queryForm>
        <el-form-item>
          <el-input placeholder="请输入部门名称" v-model="queryForm.deptName"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDeptList">查询</el-button>
          <el-button @click="handleReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleOpen" v-has="'dept-create'">创建</el-button>
      </div>
      <el-table :data="deptList" row-key="_id"  stripe>
        <el-table-column 
          v-for="item in columns"
          :key="item.prop"
          v-bind="item"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)"  v-has="'dept-edit'">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.row._id)"  v-has="'dept-delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="action=='create'?'创建部门':'编辑部门'" v-model="showModal">
      <el-form ref="dialogForm" :model="deptForm" :rules="rules" label-width="120px">
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            placeholder="请选择上级部门"
            clearable
            v-model="deptForm.parentId"
            :props="{checkStrictly:true,value:'_id',label:'deptName'}"
            :options="deptList"
            :show-all-levels="true"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input placeholder="请输入部门名称" v-model="deptForm.deptName"/>
        </el-form-item>
        <el-form-item label="部门负责人" prop="user">
          <el-select @change="handleUser" placeholder="请选择部门负责人" v-model="deptForm.user">
            <el-option 
              v-for="item in userList" 
              :key="item.userId" 
              :label="item.username"
              :value="`${item.userId}/${item.username}/${item.userEmail}`"
              />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人邮箱" prop="userEmail">
          <el-input disabled placeholder="请输入负责人邮箱" v-model="deptForm.userEmail"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="handleSubmit" type="primary">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script >
import { GetDeptList ,GetAllUserList,DeptOperate} from '../api';
import {ElMessage} from 'element-plus'

export default{
  name:'dept',
  data(){
    return {
      queryForm:{
        deptName:""
      },
      columns:[
        {label:"部门名称",prop:"deptName"},
        {label:"负责人",prop:"username"},
        {label:"更新时间",prop:"updateTime"},
        {label:"创建时间",prop:"createTime"},
      ],
      deptList:[],
      pager:{
        pageNum:1,
        pageSize:10
      },
      action:"create",
      showModal:false,
      userList:[],
      deptForm:{
        parentId:[null]
      },
      rules:{
        parentId:[
          {
            required:true,
            message:"请选择上级部门",
            trigger:"blur"
          }
        ],
        deptName:[
          {
            required:true,
            message:"请输入部门名称",
            trigger:"blur"
          }
        ],
        user:[
        {
            required:true,
            message:"请选择负责人",
            trigger:"blur"
          }
        ]
      },
      
    }
  },
  mounted(){
    this.getDeptList()
    this.getUserList()
  },
  methods:{
    async getDeptList(){
      
      let list = await GetDeptList(this.queryForm)
      
      this.deptList = list
    },
    async getUserList(){
      this.userList = await GetAllUserList()
      
    },
    handleReset(form){
      this.$refs[form].resetFields()
    },
    handleOpen(){
      this.action = "create"
      this.showModal = true
    },
    handleEdit(row){
      this.action = "edit"
      this.showModal = true
      
      this.$nextTick(()=>{
        Object.assign(this.deptForm,row,{user:`${row.userId}/${row.username}/${row.userEmail}`})
      })
    },
    async handleDel(_id){
      this.action = "delete"
      await DeptOperate({_id,action:this.action})
      ElMessage({type:"success",message:"删除成功"})
      this.getDeptList()
      
    },
    handleUser(val){
      
      const [userId,username,userEmail] = val.split('/')
      Object.assign(this.deptForm,{userId,username,userEmail})
    },
    handleClose(){
      this.showModal = false
      this.handleReset("dialogForm")

    },
    handleSubmit(){
      this.$refs.dialogForm.validate(async valid =>{
        if(valid){
          let params = {...this.deptForm,action:this.action}
          delete params.user
          await DeptOperate(params)  
          ElMessage({type:"success",message:"操作成功"})
          this.handleClose()
          this.getDeptList()
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>

</style>