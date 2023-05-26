import { createRouter, createWebHashHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue' 

import storage from '../utils/storage'
import {getPermissionList} from '../api'
import utils from '../utils/utils'

const routes = [
  {
    name: "home",
    path: "/",
    component: ()=>import("../components/Home.vue"),
    redirect: "Welcome",
    meta: {
      title: "首页"
    },
    children: [
      {
        name: "welcome",
        path: "/welcome",
        meta: {
          title: "欢迎使用本系统"
        },
        component: () => import("../views/Welcome.vue")
      },
      {
        name: "profile",
        path: "/profile",
        redirect: "analysis",
        meta: {
          title: "个人中心"
        },
        component: () => import("../views/profile/index.vue"),
        children:[
          {
            name: "analysis",
            path: "/profile/analysis",
            meta: {
              title: "个人整体分析"
            },
            component: () => import("../views/profile/Analysis.vue"),
          },
          {
            name: "award-time",
            path: "/profile/award-time",
            meta: {
              title: "获奖时间"
            },
            component: () => import("../views/profile/AwardTime.vue"),
          },
        ]
      },
    ]
  },
  
  {
    name: "login",
    path: "/login",
    meta: {
      title: "登录"
    },
    component: () => import("../views/login/Login.vue")
  },
  {
    name: "register",
    path: "/register",
    meta: {
      title: "注册"
    },
    component: () => import("../views/login/Register.vue")
  },
  
  {
    name: "404",
    path: "/404",
    meta: {
      title: "页面不存在"
    },
    component: () => import("../views/login/404.vue")
  },
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

async function loadAsyncRoutes(){
  let userinfo  = storage.getItem("userinfo") || {}
  if(userinfo.token){
    try{
      const {menuList} =  await getPermissionList()
      let routes = utils.generateRoute(menuList)
      routes.map(route=>{
        let url = `../views/${route.component}.vue`
        route.component =  ()=>import(/* @vite-ignore */url)
        router.addRoute("home",route)        
      })
    }catch(error){
      console.log('error :>> ', error);
    }
  }
}

await loadAsyncRoutes()
function checkPermission(path){
  let routes =[]
  router.getRoutes().forEach(item=>{
    routes.push(item.path)
  })
  return routes.includes(path)
}

router.beforeEach((to,form,next)=>{
  if(checkPermission(to.path) || to.path =="/"){
    document.title = to.meta.title
    next()
  }else{
    next("/404")
  }
})

export default router