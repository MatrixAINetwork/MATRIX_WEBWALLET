<template>
  <div class="currentMortgage">
    <div>
      <div class="first-left">
        活期抵押账户： 200 MAN
      </div>
      <h1>转入定期抵押账户</h1>
      <div style="text-align: center;">
        <h5>定期抵押时间</h5>
      </div>
      <div class="dis-bottom">
         <el-select v-model="timeLimit"
                   :placeholder="$t('CampaignNode.selectTimeLimit')">
          <el-option v-for="item in timeLimitList"
                     :key="item.key"
                     :label="item.name"
                     :value="item.key">
          </el-option>
        </el-select>
      </div>
       <h5>定期抵押数量</h5>
      <div class="dis-bottom">
         <el-input v-model="mortgageAddrress" placeholder="输入定期抵押数量"></el-input>
      </div>
      <button class="common-button">{{$t('transfer.confirm')}}</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'currentMortgage',
  data () {
    return {
      mortgageAddrress: '',
      timeLimitList: [{ name: '', key: 'oneMonth' }, { name: '', key: 'threeMonth' }, { name: '', key: 'sixMonth' }],
      timeLimit: ''
    }
  },
  mounted () {
    this.timeLimitList[0].name = this.$t('CampaignNode.oneMonth')
    this.timeLimitList[1].name = this.$t('CampaignNode.threeMonth')
    this.timeLimitList[2].name = this.$t('CampaignNode.sixMonth')
  },
  methods: {

  }
}
</script>
<style scoped lang="less">
.currentMortgage {
  .first-left{
    text-align: left;
  }
  text-align: center;
  padding:1.5rem 0 2.5rem;
  /deep/.el-input {
    width: 26.5rem;
  }
  .dis-bottom{
    margin-top: 1rem;
    margin-bottom: 1.5rem
  }
  h5 {
      font-size: 0.875rem;
      color: #2c365c;
      letter-spacing: 0.13px;
      font-weight: bold;
      display: flex;
      margin-left: 19.75rem;
      margin-bottom: 1rem;
    }
}
</style>
