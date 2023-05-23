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
          <span style="font-size: 20px"> {{ userinfo.username }}</span>
          <span>{{ userinfo.userEmail }}</span>
        </div>
        <div class="user-desc">
          <div class="title">
            <el-icon><CollectionTag /></el-icon>
            <span> 个人描述 </span>
            <hr />
          </div>
          <div class="desc">
            <span>{{ item[1] }}</span>
          </div>

          <div class="awards">
            <el-icon><PieChart /></el-icon>
            <span> 总体获奖情况 </span>
          </div>
          <hr />
          <div class="demo-progress">
            <el-progress
              :text-inside="true"
              :stroke-width="26"
              :percentage="70"
              status="success"
            />
          </div>
        </div>

        <span>最后一次登录：{{ userinfo.lastLoginTime }}</span>
      </el-card>
    </div>
    <div class="right">
      <el-card>
        <el-menu
          :default-active="this.$router.path"
          class="el-menu-demo"
          mode="horizontal"
          router
          @select="handleSelect"
        >
          <el-menu-item index="/profile/analysis">个人整体分析</el-menu-item>
          <el-menu-item index="/profile/award-time">获奖时间</el-menu-item>
        </el-menu>
        <router-view></router-view>
      </el-card>
    </div>
  </div>
</template>

<script>
import storage from "../../utils/storage";
import utils from "../../utils/utils";
import { jitangData } from "../../constants";
export default {
  setup() {
    const userinfo = storage.getItem("userinfo");

    userinfo.lastLoginTime = utils.formateDate(
      new Date(userinfo.lastLoginTime),
      "MM-dd"
    );
    let item = jitangData[Math.floor(Math.random() * jitangData.length)];

    return { userinfo, item };
  },
};
</script>

<style lang="scss" scoped>
.profile-manage {
  display: flex;
  justify-content: space-between;

  .left {
    width: 25vw;
    padding-right: 20px;
    .box-card {
      .userinfo {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px 0;
        > * {
          padding: 5px;
        }
      }
      .user-desc {
        .desc {
          padding-bottom: 25px;
        }
        .demo-progress .el-progress--line {
          margin-bottom: 15px;
          width: 100%;
        }
      }
    }
  }
  .right {
    flex: 1;
  }
}
</style>
