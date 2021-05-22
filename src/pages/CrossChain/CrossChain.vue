<template>
  <div class="cross-chain align-center ">
    <el-card class="box-card">
      <div class="header">
         <h1>{{$t('crossChain.CrossChain')}}</h1>
        <!-- <label :class="{'active' : type === 'bridge'}"
               @click="changeType('bridge')">{{$t('Cross Chain')}}</label> -->
        <!-- <label :class="{'active' : type === 'secondaryKey'}"
               @click="changeType('secondaryKey')">{{$t('greenMining.secondKey')}}</label> -->
        <span class="back"
              @click="back"
              v-if="showBack">
          <i class="el-icon-arrow-left"></i>
          {{$t('openWallet.back')}}
        </span>
      </div>
      <keep-alive>
        <router-view />
      </keep-alive>
    </el-card>
  </div>
</template>

<script>
import Bus from '@/assets/js/Bus'
export default {
  name: 'CrossChain',
  data () {
    return {
      type: 'bridge',
      lang: this.$i18n.locale,
      showBack: false,
      showCampaignTip: false
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'MortgageHistory' || to.name === 'HistoricalIncome') {
        this.showBack = true
      } else {
        this.showBack = false
      }
      if (to.name === 'CampaignNode') {
        this.showCampaignTip = true
      } else {
        this.showCampaignTip = false
      }
    }
  },
  created () {
    Bus.$on('changeLang', (data) => {
      this.lang = data
    })
    let route = this.$route
    if (route.name === 'MortgageHistory') {
      this.showBack = true
    }
    if (route.name === 'Bridge') {
      this.type = 'bridge'
    }
    if (route.path.indexOf('startNode') > -1 || route.path.indexOf('campaignNode') > -1) {
      this.type = 'bridge'
      // this.showCampaignTip = true
    }
  },
  methods: {
    changeType (status) {
      if (status !== this.type) {
        this.type = status
      }
      if (status === 'bridge') {
        this.$router.push({ path: '/crossChain/bridge' })
      }
    },
    back () {
      this.$router.back()
    }
  },
  components: {
  }
}
</script>

<style scoped lang="less">
.cross-chain {
  margin: auto;
  width: 1040px;
  .box-card {
    /deep/.el-card__body {
      padding: 0px;
    }
    text-align: left;
    padding: 0 3rem;
    .header {
      height: 4rem;
      line-height: 4rem;
      font-size: 1rem;
      color: #9aa0b6;
      letter-spacing: 0.15px;
      border-bottom: 1px #d5d7de solid;
      label {
        cursor: pointer;
      }
      .active {
        color: #2c365c;
      }
      .back {
        float: right;
        cursor: pointer;
        color: #1c51dd;
        font-size: 0.88rem;
        letter-spacing: 0.13px;
      }
    }
  }
  .campaign-tip {
    margin-top: 2.5rem;
    text-align: center;
    text-align: -webkit-center;
    text-align: -moz-center;
    .title {
      font-size: 1.25rem;
      color: #2c365c;
      font-weight: bold;
      margin: 1.94rem 0 2.13rem 0;
    }
    img {
      width: 57.75rem;
    }
    hr {
      width: 60rem;
      margin: 2.5rem 0 2.5rem 0;
      border: 1px solid #d5d7de;
    }
    .img-tip {
      width: 45rem;
    }
    .msg-tip {
      color: #9298ae;
      font-size: 12px;
      margin: 2.5rem 0 3rem 0;
      span {
        color: #1c51dd;
        cursor: pointer;
      }
    }
  }
}
</style>
