<template>
  <div class="profile-manage">
    <div class="left">
      <el-card class="box-card">
        <template #header>profile</template>
        <div class="userinfo">
          <el-image>
            <template #error>
              <div class="image-slot">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
          <h1> {{ userinfo.username }}</h1>
          <span>{{ userinfo.userEmail }}</span>
          
        </div>
        <div class="user-desc">
          <div class="title">
            <el-icon><CollectionTag /></el-icon>
            <span> 个人描述 </span>
            <hr>
          </div>
          <div class="desc">
            <span>{{ item[1] }}</span>
          </div>
        </div>
        <hr>
        <span>最后一次登录：{{ userinfo.lastLoginTime }}</span>

      </el-card>
    </div>
    <div class="right">
      <el-card>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1">个人整体分析</el-menu-item>
          <el-menu-item index="2">获奖时间</el-menu-item>
      </el-menu>
        <router-view></router-view>
      </el-card>
    </div>
  </div>
</template>

<script>

import storage from "../../utils/storage";
import utils from "../../utils/utils";
import {jitangData} from '../../constants'
export default {
  setup() {
    const userinfo = storage.getItem("userinfo") 
    
    userinfo.lastLoginTime =  utils.formateDate(new Date(userinfo.lastLoginTime),"MM-dd")
    let item = jitangData[Math.floor(Math.random()*jitangData.length)]

    
    return {userinfo,item};
  },
};
</script>

<style lang="scss" scoped>
.profile-manage{
  display: flex;
  justify-content: space-between;
  
  .left{
    width: 25vw;
    padding-right: 20px;
    .box-card{
      
      .userinfo{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px 0;
        >*{
          padding: 5px;
        }
      }
      .user-desc{
        .desc{
          padding-bottom: 25px;
        }
      }
    }
  }
  .right{
    flex: 1;
  }
}
</style>
