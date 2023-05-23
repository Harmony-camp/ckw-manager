const mongoose = require("mongoose")

const roleSchema = mongoose.Schema({
  
  roleName:String,
  reamrk:String,
  permissionList:{
    checkedKeys:[],
    halfCheckedKeys:[]
  },
  updateTime:{
    type:Date,
    default:Date.now()
  },
  createTime:{
    type:Date,
    default:Date.now()
  },
  remark:String
})

module.exports = mongoose.model("roles",roleSchema,"roles")