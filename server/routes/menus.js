const router = require("koa-router")()
const util = require("../utils/util")
const Menu = require("../models/menuSchema")

router.prefix("/menu")

router.get("/list",async  ctx =>{
  const {menuName,menuState} = ctx.request.query
  const params = {}
  if(menuName) params.menuName = menuName
  if(menuState) params.menuState = menuState
  let rootList = await Menu.find(params) || []
  const permissionList = util.getTreeMenu(rootList,null,[])
  ctx.body = util.success(permissionList)

})


router.post("/operate",async ctx=>{
  const {_id,action,...params} = ctx.request.body
  let res,info;
  try {
    if(action == 'add'){
      res =  await Menu.create(params)
      info = "创建成功"
    }else if(action == 'edit'){
      params.updateTime = new Date()
      res = await Menu.findByIdAndUpdate(_id,params)
      info = "编辑成功"
    }else{
      res = await Menu.findByIdAndRemove(_id)
      await  Menu.deleteMany({parentId:{$all:[_id]}})
      info = "删除成功"
    }
    ctx.body = util.success("",info)
  } catch (e) {
    ctx.body = util.fail(e.stack)
  }
  
})


module.exports = router