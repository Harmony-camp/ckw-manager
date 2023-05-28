const router = require("koa-router")()
const Teacher = require("../models/teacherSchema")
const User = require("../models/userSchema")
const log4js = require("../utils/log4j")
const { koaBody } = require('koa-body')
const util = require("../utils/util")
const fs = require("fs")
const path = require("path")
const { log } = require("console")

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
  console.log('file :>> ', file);
  const reader = fs.createReadStream(file.filepath);
  let filePath = path.join(__dirname, '../public/upload/') + `/${file.originalFilename}`;
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);

  ctx.body = util.success()  
})

router.post("/createTestify",async ctx=>{
  const testify = ctx.request.body
  console.log('testify :>> ', testify);
  let params = {...testify}
  params.state = 1
  Teacher.create(params)
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
  
})

module.exports = router