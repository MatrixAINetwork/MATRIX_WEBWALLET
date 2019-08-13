<template>
  <div class="green-mining align-center ">
    <el-card class="box-card">
      <div class="header">
        <!-- <label :class="{'active' : type === 'miningTransaction'}"
               @click="changeType('miningTransaction')">{{$t('greenMining.mining_revenue')}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</label> -->
        <label :class="{'active' : type === 'refund'}"
               @click="changeType('refund')">{{$t('header.refund')}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</label>
        <!-- <label :class="{'active' : type === 'campaignNode'}"
               @click="changeType('campaignNode')">{{$t('greenMining.campaign_node')}}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</label> -->
        <label :class="{'active' : type === 'secondaryKey'}"
               @click="changeType('secondaryKey')">{{$t('greenMining.secondKey')}}</label>
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
    <el-card class="box-card campaign-tip"
             v-if="showCampaignTip">
      <div class="title">{{$t('greenMining.beNodeget')}}</div>
      <img :src="lang === 'CN' ? require('../../assets/images/miningDistributionMethod_cn.png') : require('../../assets/images/miningDistributionMethod_en.png')" />
      <hr>
      <div class="title">{{$t('greenMining.howBeNode')}}</div>
      <img :src="lang === 'CN' ? require('../../assets/images/campaignNode_CN.png') : require('../../assets/images/campaignNode_EN.png')"
           class="img-tip" />
      <!-- <div class="msg-tip">
        {{$t('greenMining.other_question')}}
        <span>{{$t('greenMining.FAQ')}}</span>
      </div> -->
    </el-card>
  </div>
</template>

<script>
import Bus from '@/assets/js/Bus'
export default {
  name: 'GreenMining',
  data () {
    return {
      type: 'refund',
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
    if (route.name === 'Refund') {
      this.type = 'refund'
    }
    if (route.path.indexOf('startNode') > -1 || route.path.indexOf('campaignNode') > -1) {
      this.type = 'refund'
      // this.showCampaignTip = true
    }
  },
  methods: {
    changeType (status) {
      if (status !== this.type) {
        this.type = status
      }
      if (status === 'campaignNode') {
        this.$router.push({ path: '/green-mining/campaignNode' })
      } else if (status === 'miningTransaction') {
        this.$router.push({ path: '/green-mining/mining-transaction-overview' })
      } else if (status === 'secondaryKey') {
        this.$router.push({ path: '/green-mining/secondKey' })
      } else if (status === 'refund') {
        this.$router.push({ path: '/green-mining/digAccount' })
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
.green-mining {
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
