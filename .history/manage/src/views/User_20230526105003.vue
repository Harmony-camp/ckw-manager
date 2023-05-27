<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="form">
        <el-form-item label="用户Id" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="user.username" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="用户名称" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset(form)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-form inline>
          <el-form-item>
            <el-button
              type="primary"
              @click="handleCreate"
              v-has:add="'user-create'"
              >新增</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-upload 
              v-model:file-list="fileList" 
              :auto-upload="false"
              :show-file-list="false"
              :on-change="fileChange"
              >
              <el-button type="success">批量导入</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button
              type="danger"
              @click="handlePatchDelete"
              v-has="'user-patch-delete'"
              >批量删除</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
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
            <el-button
              size="small"
              @click="handleEdit(scope.row)"
              v-has="'user-edit'"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
              v-has="'user-delete'"
              >删除</el-button
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
    <el-dialog v-model="showModal" title="用户新增">
      <el-form
        :model="userForm"
        label-width="100px"
        ref="elUserForm"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="userForm.username"
            :disabled="action == 'edit'"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            v-model="userForm.userEmail"
            :disabled="action == 'edit'"
            placeholder="请输入用户邮箱"
          >
            <template #append>@gmail.com</template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userForm.job" placeholder="请输入岗位" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            multiple
            style="width: 100%"
            v-model="userForm.roleList"
            placeholder="请选择用户系统角色"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :label="role.roleName"
              :value="role._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            style="width: 100%"
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptList"
            :props="{
              expandTrigger: 'hover',
              checkStrictly: true,
              value: '_id',
              label: 'deptName',
            }"
            clearable
          >
          </el-cascader>
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
import { reactive, ref, toRaw, nextTick } from "vue";
import { ElMessage,ElLoading } from "element-plus";
// import XLSX from 'xlsx'


import {
  UserSubmit,
  GetUserList,
  UserDelete,
  GetRoleAllList,
  GetDeptList,
} from "../api";
import utils from "../utils/utils";

const columns = reactive([
  { label: "用户ID", prop: "userId" },
  { label: "用户名", prop: "username" },
  { label: "用户邮箱", prop: "userEmail" },
  {
    label: "用户角色",
    prop: "role",
    formatter(row, column, value) {
      return {
        0: "管理员",
        1: "普通用户",
      }[value];
    },
  },
  {
    label: "用户状态",
    prop: "state",
    formatter(row, column, value) {
      return {
        1: "在职",
        2: "离职",
        3: "试用期",
      }[value];
    },
  },
  {
    label: "注册时间",
    prop: "createTime",
    formatter(row, column, value) {
      return utils.formateDate(new Date(value));
    },
  },
  {
    label: "最后登录时间",
    prop: "lastLoginTime",
    formatter(row, column, value) {
      return utils.formateDate(new Date(value));
    },
  },
]);
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
});
const userList = ref([]);
const form = ref();
const showModal = ref(false);
const checkedUserIds = ref([]);
const roleList = ref([]);
const deptList = ref([]);
const action = ref("add");
const elUserForm = ref();
const fileList = ref([])
const previewFile = ref(false)
const user = reactive({
  state: 1,
  username: "",
  userId: "",
});
const userForm = reactive({
  state: 3,
});
const rules = reactive({
  username: [
    {
      required: true,
      message: "请输入用户名称",
      trigger: "blur",
    },
  ],
  userEmail: [
    {
      required: true,
      message: "请输入用户邮箱",
      trigger: "blur",
    },
  ],
  mobile: [
    {
      pattern: /1\d{10}/,
      message: "请输入正确的手机格式",
    },
  ],
  deptId: [
    {
      required: true,
      message: "请输入用户邮箱",
      trigger: "blur",
    },
  ],
});

const getUserList = async () => {
  let params = { ...user, ...pager };
  try {
    const { list, page } = await GetUserList(params);
    userList.value = list;
    pager.total = page.total;
    console.log("page :>> ", page);
    console.log("list :>> ", list);
  } catch (error) {
    console.log(error);
  }
};

const handleQuery = () => {
  getUserList();
};
const handleReset = (value) => {
  value.resetFields();
};

const handleCurrentChange = (current) => {
  pager.pageNum = current;
};
const handleDelete = async (row) => {
  await UserDelete({
    userIds: [row.userId],
  });
  ElMessage({
    message: "删除成功",
    type: "success",
  });
  getUserList();
};

const handlePatchDelete = async () => {
  if (checkedUserIds.value.length == 0)
    return ElMessage({ message: "请选择要删除的用户", type: "error" });
  const res = await UserDelete({
    userIds: checkedUserIds.value,
  });
  if (res.nModified > 0) {
    ElMessage({
      message: "删除成功",
      type: "success",
    });
    getUserList();
  } else {
    ElMessage({
      message: "修改失败",
      type: "error",
    });
  }
};
const handleSelectionChange = (list) => {
  console.log(list);
  let arr = [];
  list.map((item) => {
    arr.push(item.userId);
  });
  checkedUserIds.value = arr;
};
const handleCreate = () => {
  action.value = "add";
  showModal.value = true;
};

const getDeptList = async () => {
  const res = await GetDeptList();
  deptList.value = res;
};

const getRoleList = async () => {
  const list = await GetRoleAllList();
  roleList.value = list;
};

const handleCancle = () => {
  showModal.value = false;
  handleReset(elUserForm.value);
};

const handleSubmit = () => {
  console.log("userForm :>> ", userForm);
  elUserForm.value.validate(async (valid) => {
    if (valid) {
      let params = toRaw(userForm);
      console.log("userForm :>> ", userForm.userEmail);
      params.userEmail += "@gmail.com";
      params.action = action.value;
      console.log("params :>> ", params);
      await UserSubmit(params);
      showModal.value = false;
      ElMessage({ message: "用户创建成功", type: "success" });
      handleReset(elUserForm.value);
      getUserList();
    }
  });
};

const handleEdit = (row) => {
  action.value = "edit";
  showModal.value = true;
  nextTick(() => {
    Object.assign(userForm, row);
  });
};


const fileChange = ()=>{

  const loading = ElLoading.service()

  loading.close()
  
}

getUserList();
getRoleList();
getDeptList();

</script>
