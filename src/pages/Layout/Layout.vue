<template>
  <div class="layout">
    <el-container>
      <el-header>
        <x-header></x-header>
      </el-header>
      <el-main class="main-width">
        <router-view></router-view>
        <x-tip></x-tip>
      </el-main>
      <el-footer>
        <x-footer></x-footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import XHeader from '@/components/Layout/Header'
import XFooter from '@/components/Layout/Footer'
import XTip from '@/components/Layout/Tip'
export default {
  name: 'Layout',
  components: {
    XHeader,
    XFooter,
    XTip
  }
}
</script>

<style scoped lang="less">
.layout {
  .el-container {
    min-height: 100vh;
    // height: 10%;
    .el-header,
    .el-footer {
      padding: 0;
      background: #2c365c;
      text-align: center;
      text-align: -webkit-center;
      text-align: -moz-center;
    }
    .el-header {
      height: 3.5rem !important;
      line-height: 3.5rem !important;
    }
    // .main-width{
    //   min-height: 90vh;
    // }
    .el-footer {
      height: 3rem !important;
      line-height: 3rem !important;
    }
  }
  .el-main {
    padding: 2rem 0 2.5rem 0;
    justify-content: center;
    text-align: -webkit-center;
    text-align: -moz-center;
  }
}
</style>
