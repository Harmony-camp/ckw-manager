<template>
  <div class="menu-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="menuFormRef">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryForm.menuState">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getMenuList">查询</el-button>
          <el-button @click="handleReset(menuFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)" 
        v-has="'menu-create'"
        >新增</el-button>
      </div>

      <el-table :data="menuList" row-key="_id" >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter=item.formatter
        >
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleAdd(2,scope.row)" v-has="'menu-create'">新增</el-button>
            <el-button size="small" @click="handleEdit(scope.row)" v-has="'menu-edit'">编辑</el-button>
            <el-button type="danger"  size="small" @click="handleDelete(scope.row._id)" v-has="'menu-delete'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="showModal" title="用户新增" >
      <el-form :model="menuForm" label-width="100px" ref="dialogForm" :rules="rules">
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader   v-model="menuForm.parentId" :options="menuList" :props="{checkStrictly:true,value:'_id',label:'menuName'}" clearable/>
          <span>不选，则直接创建一级菜单</span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input  v-model="menuForm.menuName" placeholder="请输入菜单名称"/>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-show="menuForm.menuType==1">
          <!-- <el-input  v-model="menuForm.icon" placeholder="请输入图标，element-plus支持的图标" /> -->
          <el-select v-model="menuForm.icon" placeholder="请选择图标" style="width: 100%;">
            <el-option
              v-for="item in iconList"
              :key="item"
              :label="item"
              :value="item"
            >
            <span style="float: left">{{ item }}</span>
              <span style="
                  float: right;
                  color: var(--el-text-color-secondary);
                  font-size: 16px;
                "> <el-icon><component  :is="item"></component></el-icon>
              </span>
            
          </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="路由地址" prop="path" v-show="menuForm.menuType==1">
          <el-input  v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item  label="权限标识" prop="menuCode" v-show="menuForm.menuType==2">
          <el-input  v-model="menuForm.menuCode" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item  label="组件路径" prop="component" v-show="menuForm.menuType==1">
          <el-input  v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item   label="菜单状态" prop="menuState" v-show="menuForm.menuType==1">
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancle">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import utils from "../utils/utils";
import {ref,reactive,nextTick} from 'vue'
import {MenuList,MenuSubmit} from '../api'
import {ElMessage} from 'element-plus'
import * as ELIcons from '@element-plus/icons-vue'


const iconList = ref([])
const showModal = ref(false)
const action = ref("add")
const menuFormRef = ref()
const dialogForm = ref()
const menuForm = reactive({
  menuType:1,
  menuState:1,
  parentId:[null]
})
const rules = ref({
  menuName:[
    {required:true,message:"请输入菜单名称",trigger:'blur'},
    {min:2,max:10,message:"长度在2-8个字符",trigger:'blur'}

  ]
})

const queryForm = reactive({
  menuState:1
})
const menuList = ref([])
const columns = ref([
  {label:"菜单名称",prop:"menuName",width:180},
  {label:"图标",prop:"icon"},
  {label:"菜单类型",prop:"menuType",width:90,formatter(row,columns,value){
    return {1:"菜单",2:'按钮'}[value]
  }},
  {label:"权限标识",prop:"menuCode"},
  {label:"路由地址",prop:"path"},
  {label:"组件路径",prop:"component"},
  {label:"菜单状态",prop:"menuState",width:90,formatter(row,colums,value){
    return {
      1:"正常",
      2:"停用"
    }[value]
  }},
  {label:"创建时间",prop:"createTime",width:180,formatter(row,colums,value){
    
    return utils.formateDate(new Date(value))
  }},
])

const getMenuList = async ()=>{
  try {
    let list =  await MenuList(queryForm)
    menuList.value = list
  } catch (error) {
    throw new Error(error)
  }
  
}
const handleReset = (form)=>{
  console.log('form :>> ', form);
  form.value.resetFields()
}

const handleAdd = (type,row)=>{
  showModal.value = true
  action.value = "add";
  if(type==2){
    menuForm.parentId = [...row.parentId,row._id].filter(item => item)
  }
}
const handleEdit = (row)=>{
  showModal.value = true
  action.value = "edit"
  nextTick(()=>{
    Object.assign(menuForm,row)
  })
  
}

const handleDelete = async (_id)=>{
  await MenuSubmit({_id,action:"delete"})
  ElMessage({
    type:"success",
    message:"删除成功",
  })
  getMenuList()
}
const handleCancle = ()=>{
  showModal.value = false
  handleReset(dialogForm)
}
const handleSubmit = ()=>{
  dialogForm.value.validate(async (valid)=>{
    if(valid){
      
      let params = {...menuForm,action:action.value}
      console.log('params :>> ', params);
      await MenuSubmit(params)
      showModal.value = false
      ElMessage({type:"success",message:"操作成功"})
      handleReset(dialogForm)
      getMenuList()
    }
  })
}

getMenuList()
for (let iconName in ELIcons) {
	iconList.value.push(iconName)
}

</script>

<style lang="scss"></style>
