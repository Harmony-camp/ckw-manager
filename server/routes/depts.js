const router = require("koa-router")()
const util = require("../utils/util")
const Dept = require('../models/deptSchema')
const log4js = require("../utils/log4j")


router.prefix("/dept")

router.get("/list",async ctx =>{
  let {deptName} = ctx.request.query
  let params = {}
  if(deptName) URLSearchParams.deptName = deptName 
  let rootList = await Dept.find(params)
  if(deptName){
    ctx.body = util.success(rootList)
  }else{
    let treeList =   getTreeDept(rootList,null,[])
    ctx.body = util.success(treeList)
  }
})

function getTreeDept(rootlist,id,list){
  for(let i =0;i<rootlist.length;i++){
    let item = rootlist[i]
    if(String(item.parentId.slice().pop()) == String(id)) {
      list.push(item._doc)
    }
  }
  list.map(item=>{
    item.children=[]
    getTreeDept(rootlist,item._id,item.children)
    if(item.children.length == 0){
      delete item.children
    }
  })
  return list 
}

router.post("/operate",async ctx=>{
  const{_id,action,...params} = ctx.request.body
  let info
  try {
    if(action == "create"){
      
      await Dept.create(params)
      info = "创建成功"
    }else if(action == 'edit'){
      params.updateTime = new Date()
      await Dept.findByIdAndUpdate(_id,params)
      info = "编辑成功"
    }else if(action == 'delete'){
      res = await Dept.findByIdAndRemove(_id)
      await Dept.deleteMany({parentId:{$all:[_id]}})
      info = "删除成功"
    }
    ctx.body = util.success("",info)
  } catch (error) {
    ctx.body = util.fail(error.stack)
  }
})

module.exports = router