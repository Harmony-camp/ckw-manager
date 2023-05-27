const router = require('koa-router')()
const User = require("../models/userSchema")
const Counter = require("../models/counterSchema")
const Menu = require("../models/menuSchema")
const Role = require("../models/roleSchema")
const util = require("../utils/util")
const jwt = require("jsonwebtoken")
const log4js = require("../utils/log4j")
const md5 = require("md5")
const nodemailer = require("nodemailer")

router.prefix('/users')


router.post("/login", async (ctx) => {
  try {
    const { username, password } = ctx.request.body
    let passwd = password
    if(username != "admin"){
      passwd = md5(password)
    }
    console.log('username :>> ', username);
    const res = await User.findOne({
      username,
      password:passwd
    },)
    const data = res._doc
    
    const token = jwt.sign({ data }, "key", { expiresIn: '10h' })

    if (res) {
      data.token = token
      ctx.body = util.success(data)

    } else {
      ctx.body = util.fail("账号或密码错误")
    }
  }
  catch (error) {
    log4js.error(error);
    ctx.body = util.fail(error.msg)
  }
})

router.get("/list", async ctx => {
  const {
    userId,
    username,
    state, } = ctx.request.query
  const { page, skipIndex } = util.pager(ctx.request.query)
  let params = {}
  if (userId) params.userId = userId
  if (username) params.username = username
  if (state && state != '0') params.state = state
  try {
    const query = User.find(params, { _id: 0, password: 0 })
    const list = await query.skip(skipIndex).limit(page.pageSize)
    const total = await User.countDocuments(params)
    ctx.body = util.success({
      page: {
        ...page,
        total
      },
      list
    })
  } catch (error) {
    ctx.body = util.fail(`查询异常:${error.stack}`)
    log4js.error(error.stack)
  }
})

router.post("/delete",async (ctx)=>{

  const {userIds}  = ctx.request.body
  const res = await User.updateMany({userId:{$in:userIds}},{state:2})
  if(res.modifiedCount) {
    ctx.body = util.success(res,`共删除${res.modifiedCount}条数据`);
     return; 
  }
  ctx.body = util.fail("删除失败")
})

router.post("/operate",async ctx=>{
  const {userId,password,username,userEmail,job,mobile,state,roleList,deptId,action} = ctx.request.body
  if(action == 'add'){
    if(!username || !userEmail || !deptId){
      ctx.body = util.fail("参数错误",util.CODE.PARAM_ERROR)
      return
    }
    
    const res = await User.findOne({$or:[{username},{userEmail}]},'_id username userEmail')
    if(res){
      ctx.body = util.fail(`系统监测到有重复用户，信息如下:${res.username } - ${res.userEmail}`)
    }else{
      const doc = await Counter.findOneAndUpdate({_id:"userId"},{$inc:{sequence_value:1}},{new:true})
      try {
        const user =  new User({
          userId:doc.sequence_value,
          password:md5(password),
          username,
          userEmail,
          role:1, //默认普通用户
          roleList,
          job,
          state,
          deptId,
          mobile
        })
        user.save();
        ctx.body = util.success("","用户创建成功")
      } catch (error) {
        ctx.body = util.success(error.stack,"用户创建失败")
      }
    }
  }else{
    if( !deptId){
      ctx.body = util.fail("部门不能为空",util.CODE.PARAM_ERROR)
      return
    }
    try {
      const res = await User.findOneAndUpdate({userId},{mobile,job,state,roleList,deptId,password:md5(password)})
      ctx.body = util.success({},"更新成功")
    } catch (error) {
      ctx.body = util.fail(error.stack+"更新失败")  
    }
  }
})

router.get("/all/list",async ctx=>{
  try {
    const list = await User.find({},"userId username userEmail")
    ctx.body = util.success(list)
  } catch (error) {
    ctx.body = util.fail(error.stack)
  }
})

router.get("/getPermissionList",async ctx=>{
  let authorization = ctx.request.headers.authorization
  let {data} = util.decoded(authorization)
  
  let menuList = await getMenuList(data.role,data.roleList)
  let actionList = getAction(JSON.parse(JSON.stringify(menuList)))
  ctx.body = util.success({menuList,actionList})
})

async function getMenuList(userRole,roleKeys){
  log4js.info(roleKeys)
  let rootList = []
  if(userRole == 0){
    rootList = await Menu.find({}) || []
  }else{
    let roleList = await Role.find({_id:{$in:roleKeys}})
    let permissionList = []
    roleList.map((role)=>{
      let{checkedKeys,halfCheckedKeys} = role.permissionList
      permissionList = permissionList.concat([...checkedKeys,...halfCheckedKeys])
    })
    permissionList = [...new Set(permissionList)]
    
    rootList = await Menu.find({_id:{$in:permissionList}})
    
  }
  return util.getTreeMenu(rootList,null,[])
}

function getAction(list){
  let _actionList = []
  const deep = arr=>{
    while(arr.length){
      let item = arr.pop()
      if(item.action){
        item.action.map(action=>{
          _actionList.push(action.menuCode)
        })
      }
      if(item.children && !item.action) deep(item.children)
    }
  }
  deep(list)
  return _actionList
}

router.get("/emailcode",async ctx=>{
  const {email} = ctx.request.query
  let res = await  User.findOne({userEmail:email},"userId ")
  
  if(!res){
    ctx.body = util.fail("请输入正确的邮箱")
  }else{
    
    const code = Math.random().toFixed(6).slice(-6)
    util.sendMail(email,code)
    let params = {...res._doc,code:md5(code)}
    ctx.body = util.success(params)
  }
})


module.exports = router
