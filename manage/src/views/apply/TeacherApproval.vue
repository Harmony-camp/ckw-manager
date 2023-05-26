<template>
  <div>

  </div>
</template>

<script>
import {GetTeacherApprovallList} from '../../api'
import storage from '../../utils/storage';
import {ref,reactive} from 'vue'
export default {
  setup () {
    const userinfo = storage.getItem("userinfo")

    GetTeacherApprovallList({_id:userinfo._id}).then(res=>{

    })
    return {}
  }
}
</script>

<style lang="scss" scoped>

</style>