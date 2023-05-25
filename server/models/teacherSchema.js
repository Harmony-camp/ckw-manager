const mongoose = require("mongoose")

const teacherSchema = mongoose.Schema({
  Level:Number, // 级别 分别为 校级:1 市级:2  省部级：3 国家级：4
  HTime:Date,  // 获奖时间,
  HType:Number, //获奖类型 优秀教师....
  fileList:[],
  integral:Number, //积分
  XType:Number, //项目类型
  subjectProject:String,  //教改项目、课题项目
  amount:Number,
  conversionTime:Date,
  ZType:Number, //专利类型 如标准规程。。。
  publicDept:String,
  timePublication:Date,
  standardType:Number,
  authorizationTime:Date,
  JType:Number,
  organizer:String,
  tutorialName:String,
  publicTime:Date,
  honorsAwards:Number,
  words:String,
  thesisTitle:String,
  periodical:String,
  thesisType:Number,
  seePublicationTime:Date,
  courseName:Number,
  year:{
    type:Date,
    default:Date.now()
  },
  semester:Number,
  teachingClass:String,
  creditHours:Number,
  state:Number,
  userId:Number,
  deptId:[]
})

module.exports = mongoose.model("teachers",teacherSchema,"teachers")