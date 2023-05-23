<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="menuFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList">查询</el-button>
          <el-button @click="handleReset(menuFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd"  v-has="'role-create'">创建</el-button>
      </div>

      <el-table :data="roleList"  >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter=item.formatter
        >
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template #default="scope">
            
            <el-button size="small" @click="handleEdit(scope.row)" v-has="'role-edit'">编辑</el-button>
            <el-button size="small" type="primary" @click="handleOpenPermission(scope.row)" v-has="'edit-permission'">设置权限</el-button>
            <el-button type="danger" @click="handelDelete(scope.row._id)"  size="small"  v-has="'role-delete'">删除</el-button>
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
    
    <el-dialog v-model="showModal" title="角色新增" >
      <el-form :model="roleForm" label-width="100px" ref="dialogForm" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :row="2" v-model="roleForm.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancle">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="showPermission" title="权限设置" >
      <el-form label-width="100px" >
        <el-form-item label="角色名称" >
          {{ curRoleName }}
        </el-form-item>
        <el-form-item label="选择权限">
          <el-tree
            ref="permissionTree"
            :data="menuList"
            show-checkbox
            default-expand-all
            node-key="_id"
            :props="{label:'menuName'}"
            >
          </el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermission = false">取消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import utils from "../utils/utils";
import {ref,reactive,nextTick} from 'vue'
import {GetRoleList,RoleOperate,MenuList,UpdatePermission} from '../api'
import {ElMessage} from 'element-plus'



const pager = reactive({
  total:0,
  pageSize:10,
  pageNum :1
})
const roleList = ref([])
const dialogForm = ref()
const action = ref("create")
const showModal = ref(false)
const permissionTree = ref({})
const showPermission = ref(false)
const curRoleName = ref("")
const curRoleId = ref("")
const menuList = ref([])
const actionMap = reactive({})
const queryForm = reactive({
  roleName:""
})
const rules = reactive({
  roleName:[
    {
      required:true,
      message:"请输入角色名称"
    }
  ]
})
const roleForm = reactive({})


const columns = ref([
  {label:"角色名称",prop:"roleName",width:150},
  {label:"备注",prop:"remark"},
  {label:"权限列表",prop:"permissionList",formatter:(row,colums,value)=>{
    //TODO: 还为完成
    let names = [];
    let list = value.halfCheckedKeys || [];
    list.map((key) => {
      let name = actionMap[key];
      if (key && name) names.push(name);
    });
    return names.join(",");
  }},
  {label:"创建时间",prop:"createTime",width:180,formatter(row,colums,value){
      return utils.formateDate(new Date(value))
  }},
  {label:"更新时间",prop:"updateTime",width:180,formatter(row,colums,value){
      return utils.formateDate(new Date(value))
  }},
])

const getRoleList = async ()=>{
  try {
    let {list,page} =  await GetRoleList({...queryForm,...pager})
    roleList.value = list
    pager.total = page.total
    pager.pageSize = page.pageSize
  } catch (error) {
    throw new Error(error)
  }
}
const getMenuList = async ()=>{
  try {
    let list =  await MenuList()
    menuList.value = list
    getActionMap(list)
  } catch (error) {
    throw new Error(error)
  }
}

const  getActionMap = (list)=>{
  const deep = (arr)=>{
    while(arr.length){
      
      let item = arr.pop()
      if (item.children && item.action) {
        actionMap[item._id] = item.menuName;
      }
      if (item.children && !item.action) {
        deep(item.children);
      }
    }
  }
  deep(JSON.parse(JSON.stringify(list)))
  
}

const handleReset = (form)=>{
  
  form.value.resetFields()
}

const handleAdd = ()=>{
  action.value = "create"
  showModal.value = true
}

const handleEdit = (row)=>{
  action.value = "edit"
  showModal.value = true
  nextTick(()=>{
    Object.assign(roleForm,{_id:row._id,roleName:row.roleName,remark:row.remark})
  }) 
}

const handleOpenPermission = (row)=>{
  curRoleName.value = row.roleName
  curRoleId.value = row._id
  showPermission.value = true
  
  let {checkedKeys} =  row.permissionList
  setTimeout(()=>{
    permissionTree.value.setCheckedKeys(checkedKeys)
  })
 
}
const handlePermissionSubmit = async()=>{
  let nodes = permissionTree.value.getCheckedNodes()
  let halfKeys = permissionTree.value.getHalfCheckedKeys()
  let checkedKeys = []
  let parentKeys = []
  nodes.map(node=>{
    if(!node.children){
      checkedKeys.push(node._id)
    }else{
      parentKeys.push(node._id)
    }
  })
  let params = {
    _id:curRoleId.value,
    permissionList:{
      checkedKeys,
      halfCheckedKeys:parentKeys.concat(halfKeys)
    }
  }
  await UpdatePermission(params)
  showPermission.value = false
  ElMessage({type:"success",message:"设置成功"})
  getRoleList()
}
const handelDelete = async  _id => {
  await RoleOperate({_id,action:"delete"})
  ElMessage({type:"success",message:"删除成功"})
  getRoleList()
}

const handleCancle = ()=>{
  showModal.value = false
  handleReset(dialogForm)
}

const handleSubmit = ()=>{
  dialogForm.value.validate(async valid=>{
    if(valid){
      let params = {...roleForm,action:action.value}
      await RoleOperate(params)
      showModal.value = false
      ElMessage({type:"success",message:"创建成功"})
      handleReset(dialogForm)
      getRoleList()
      
    }
  })
}

const handleCurrentChange = (val)=>{
  console.log('val :>> ', val);
  pager.pageNum = val
  getRoleList()
}

getRoleList()
getMenuList()

</script>

<style lang="scss"></style>
