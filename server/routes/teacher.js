const router = require("koa-router")()
const Teacher = require("../models/teacherSchema")
const User = require("../models/userSchema")
const Dept = require("../models/deptSchema")
const log4js = require("../utils/log4j")
const { koaBody } = require('koa-body')
const util = require("../utils/util")
const fs = require("fs")
const path = require("path")

router.prefix("/teacher")


router.get("/query", async ctx=>{
  let {queryValue,queryInput} = ctx.request.query
  console.log('queryValue :>> ', queryValue);
  try {
    let res
    if(queryInput){
      if(queryValue == "startTime"){
        Teacher.find({HTime})
      }else if (queryValue == "typeName"){

      }
      else if (queryValue == "score"){

      }else{

      }
    }else{
      res =  await Teacher.find({}) || []
    }
    console.log('res :>> ', res);
    ctx.body = util.success("")
  } catch (error) {
    ctx.body = util.fail(error.stack)
  }
})


router.post("/upload",koaBody(),async ctx=>{
  const file = ctx.request.files.file; // 获取上传文件
  // console.log('files :>> ', file);
  // 创建可读流
  
  const reader = fs.createReadStream(file.filepath);
  let filePath = path.join(__dirname, '../public/upload/') + `/${file.originalFilename}`;
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);

  ctx.body = util.success()  
})

router.post("/createTestify",async ctx=>{
  const {  ...params } = ctx.request.body
  let authorization = ctx.request.headers.authorization
  let {data} = util.decoded(authorization)
  let user = await Dept.find({deptName:"审批"})
  user = user[0]
  let auditUserName = user.username
  let auditUserId = user.userId
  let applyUser= {"userId":data.userId,"username":data.username,"userEmail":data.userEmail}

  params.state = 1
  params.auditUserName = auditUserName
  params.applyUser = applyUser
  params.auditUserId = auditUserId
  await Teacher.create(params)
  ctx.body = util.success("上传成功")
})

router.get("/list",async ctx=>{
  const {action,userId}  = ctx.request.query
  let user = await User.findOne({userId})
  
  let res
  if(user.role == 0){
    
    res =  await  Teacher.find({action:action})
  }else{
    res = await Teacher.find({action,userId})
  }
  ctx.body = util.success(res)
})

router.get("/approvalList",async ctx=>{
  const { applyState, action } = ctx.request.query
  const { page, skipIndex } = util.pager(ctx.request.query)
  let authorization = ctx.request.headers.authorization
  let { data } = util.decoded(authorization)
  try {
    let params = {}
    if (action == "award") {
      if (applyState == 1 || applyState == 2) {
        params.$or = [{"applyUser.userId": data.userId,$or:[{state:1},{state:2}] },{auditUserId:data.userId,$or:[{state:1},{state:2}]}]
      } else if (applyState > 2) {
        params = {"applyUser.userId": data.userId ,applyState}
      } else {
        params = {deptId: data.userId }
      }
    } else {
      params = {"applyUser.userId": data.userId }
      if (applyState) params.state = applyState
    }
    
    const query =  Teacher.find(params)
    // console.log('query :>> ', query);
    const list = await query.skip(skipIndex).limit(page.pageSize)
    const total = await Teacher.countDocuments(params)
    ctx.body = util.success({
      page: {
        ...page,
        total
      },
      list
    })
  } catch (error) {
    ctx.body = util.fail(`查询失败${error.stack}`)
  }
})

router.get("/getFile",ctx=>{
  const {fileName}  = ctx.request.query
  console.log('fileName :>> ', fileName);
  ctx.type = (fileName.name + '').substring( (fileName.name + '').lastIndexOf(".")+1);
  // 读取文件
  const pathUrl = path.join(__dirname, `../public/upload/${fileName}`);
  ctx.body = util.success(fs.createReadStream(pathUrl))
})

module.exports = router