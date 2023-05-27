/**
 * api管理
 */

import request from "../utils/request"

/**
 * 用户登录
 * @param {Object} params 
 * @returns 
 */
export  const UserLogin = (params)=>{
  return request({
      url:"/users/login",
      method:"post",
      data:params,
    })
  }

/**
 * 获取是否有信息需要处理
 * @param {Object} params 
 * @returns 
 */
export  const NoticeCount = (params)=>{
  return request({
    url:"/leave/count",
    method:"get",
    data:params,
    // mock:true
  })
}

/**
 * 获取菜单
 * @returns 
 */
export  const MenuList = (params)=>{
  return request({
    url:"/menu/list",
    method:"get",
    data:params,
    // mock:true
  })
}

/**
 * 获取用户列表
 * @param {Object} params 
 * @returns 
 */

export  const GetUserList = (params)=>{
  return request({
    url:"/users/list",
    method:"get",
    data:params,
  })
}
export  const GetAllUserList = ()=>{
  return request({
    url:"/users/all/list",
    method:"get",
    // mock:true
  })
}
/**
 * 删除用户，可批量删除
 * @param {Array} params 
 * @returns 
 */
export  const UserDelete = (params)=>{
  return request({
    url:"/users/delete",
    method:"post",
    data:params,
    // mock:true
  })
}
/**
 * 获取角色信息
 * @returns 
 */
export  const GetRoleAllList = ()=>{
  return request({
    url:"/roles/allList",
    method:"get",
    data:{},
    // mock:true
  })
}
export  const GetRoleList = (param)=>{
  return request({
    url:"/roles/list",
    method:"get",
    data:param,
    // mock:true
  })
}
/**
 * 获取部门信息
 * @returns 
 */
export  const GetDeptList = (params)=>{
  return request({
    url:"/dept/list",
    method:"get",
    data:params,
    // mock:true
  })
}

/**
 * 角色增删改查
 * @param {Object} params 
 * @returns 
 */
export  const UserSubmit = (params)=>{
  return request({
    url:"/users/operate",
    method:"post",
    data:params,
    // mock:true
  })
}
/**
 * 菜单操作
 * @param {Object} params 
 * @returns 
 */
export  const MenuSubmit = (params)=>{
  return request({
    url:"/menu/operate",
    method:"post",
    data:params,
    // mock:true 
  })
}

export  const RoleOperate = (params)=>{
  return request({
    url:"/roles/operate",
    method:"post",
    data:params,
    // mock:true 
  })
}
export  const DeptOperate = (params)=>{
  return request({
    url:"/dept/operate",
    method:"post",
    data:params,
    // mock:true 
  })
}
export  const UpdatePermission = (params)=>request({
    url:"/roles/update/permission",
    method:"post",
    data:params,
    // mock:true 
})



export const getPermissionList = ()=>request.get("/users/getPermissionList")
export const GetApplyList  = params=>request.get("/leave/list",params,{mock:false})
export const LeaveOperate  = params=>request.post("/leave/operate",params,{mock:false})
export const LeaveApprove  = params=>request.post("/leave/approve",params,{mock:false})

export const dataToTestify  = params=>request.post("/teacher/createTestify",params)

//获取注册页面角色
export const getRegisterRoleList = params=>request.get("/roles/allList",params)

//获取模块分类排序数据
export const querySortList = params=>request.get("/teacher/query",params)

export const GetTeacherlList = params=>request.get("/teacher/list",params)
export const GetTeacherApprovallList = params=>request.get("/teacher/approvalList",params)

