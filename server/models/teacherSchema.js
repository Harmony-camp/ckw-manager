const mongoose = require("mongoose")

const teacherSchema = mongoose.Schema({
  Level:Number, // 级别 分别为 校级:1 市级:2  省部级：3 国家级：4
  HTime:{  // 获奖时间
    type:Date,
    default: Date.now()
  },
  HType:Number, //获奖类型 优秀教师....
  fileList:[],
  integral:Number, //积分
  XType:Number, //项目类型
  subjectProject:String,  //教改项目、课题项目
  amount:Number,
  conversionTime:{
    type:Date,
    default:Date.now()
  },
  ZType:Number, //专利类型 如标准规程。。。
  publicDept:String,
  timePublication:{
    type:Date,
    default:Date.now()
  },
  standardType:Number,
  authorizationTime:{
    type:Date,
    default:Date.now()
  },
  JType:Number,
  organizer:String,
  tutorialName:String,
  publicTime:{
    type:Date,
    default:Date.now()
  },
  honorsAwards:Number,
  words:String,
  thesisTitle:String,
  periodical:String,
  thesisType:Number,
  seePublicationTime:{
    type:Date,
    default:Date.now()
  },
  courseName:Number,
  year:{
    type:Date,
    default:Date.now()
  },
  semester:Number,
  teachingClass:String,
  creditHours:Number,
  state:Number,
  userId:Number
})

module.exports = mongoose.model("teachers",teacherSchema,"teachers")