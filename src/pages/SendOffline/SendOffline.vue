<template>
  <div class="sendOffline">
    <el-card class="box-card">
      <div class="query_assets_top">
        <span class="query_assets"
              :class="{'active' : type === 'open'}"
              @click="changeType('open')">{{$t('unlock.sign')}}</span>|
        <span class="query_assets"
              @click="changeType('send')"
              :class="{'active' : type === 'send'}">{{$t('unlock.sendSignature')}}</span>
        <hr>
      </div>
      <router-view></router-view>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'sendOffline',
  data () {
    return {
      status: 'open',
      type: 'open'
    }
  },
  methods: {
    changeType (status) {
      this.type = status
      if (status === 'send') {
        this.$router.push({ path: '/sendOffline/sendSignTransfer' })
      } else {
        this.$router.push({ path: '/sendOffline/offlineUnlock' })
      }
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'OfflineUnlock') {
        this.type = 'open'
      } else {
        this.type = 'send'
      }
    }
  }
}
</script>

<style scoped lang="less">
.sendOffline {
  margin: auto;
  /deep/.el-card__body {
    padding: 1rem 2.5rem 3rem 2.5rem;
  }
  width: 1040px;
  .query_assets_top {
    text-align: left;
  }
  .query_assets {
    font-size: 1rem;
    letter-spacing: 0.15px;
    margin-bottom: 1rem;
    margin-right: 1rem;
    cursor: pointer;
    color: #989a9c;
  }
  hr {
    background-color: #d5d7de;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    border: none;
    height: 1px;
  }
  .active {
    color: #2c365c;
  }
}
</style>
