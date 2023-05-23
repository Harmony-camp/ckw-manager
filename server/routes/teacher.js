const router = require("koa-router")()
const Teacher = require("../models/teacherSchema")
const log4js = require("../utils/log4j")
const { koaBody } = require('koa-body')
const util = require("../utils/util")

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
  
  console.log('ctx.body :>> ', ctx.body.files);  
})

module.exports = router