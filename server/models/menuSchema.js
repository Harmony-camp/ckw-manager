const mongoose = require("mongoose")

const menuSchema = mongoose.Schema({
  menuName:String,
  menuCode:String,
  menuType:Number,
  path:String,
  icon:String,
  component:String,
  menuState:Number,
  parentId:[mongoose.Types.ObjectId],
  createTime:{
    type:Date,
    default:Date.now()
  },
  updateTime:{
    type:Date,
    default:Date.now()
  },
})

module.exports = mongoose.model("menus",menuSchema,"menus")