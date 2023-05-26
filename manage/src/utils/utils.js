/**
 * 工具函数封装
 */
import {GetTeacherlList} from '../api'
export default{
  formateDate(date,rule){
    let fmt = rule || 'MM-dd hh:mm:ss'
   
    const o = {
      
      "M+":date.getMonth(),
      "d+":date.getDate(),
      "h+":date.getHours(),
      "m+":date.getMinutes(),
      "s+":date.getSeconds(),

    }
    for(let key in o){
      if(new RegExp(`(${key})`).test(fmt)){
        const val = o[key] + ''
        fmt =  fmt.replace(RegExp.$1,RegExp.$1.length==1?val:('00'+val).substring(val.length))
      }
    }
    return date.getFullYear()+"-" + fmt
  },
  generateRoute(menuList){
    let routes = []
    
    const deepList = (list)=>{
      while(list.length){
        let item = list.pop()
        if(item.action){
          routes.push({
            name:item.menuName,
            path:item.path,
            meta:{
              title:item.menuName
            },
            component:item.component
          })
  
        }
        if(item.children && !item.action){
          deepList(item.children)
        }
      }
    }
    deepList(menuList)
    return routes
  },
  async getTeacherApprovalList(action,userId){
    
    let res = await GetTeacherlList({action,userId})
    return res
  }
} 

