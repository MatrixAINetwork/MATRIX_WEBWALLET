<template>
  <div class="startNode">
    <div class="addForm">
      <h1 class="h1-dis">{{$t('startNode.name')}}</h1>
      <button class="common-button button-width"
              @click="startCampaignNode">{{$t('startNode.mortgage-button')}}</button>
    </div>
  </div>
</template>

<script>
import {emailUrl} from '@/assets/js/config'
export default {
  name: 'campaignNode',
  data () {
    return {
      startType: '0',
      mail: ''
    }
  },
  methods: {
    startCampaignNode () {
      this.$router.push({ path: '/green-mining/CampaignNode' })
    },
    sendEmail () {
      let reg = /^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      if (reg.test(this.mail)) {
        this.$http.get('sendEmail/' + emailUrl + '/' + this.mail).then(res => {
          if (res.data.status === 200) {
            this.mail = ''
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
      } else {
        this.$message.warning('请输入有效的邮箱地址')
      }
    }
  },
  mounted () {
  }
}
</script>
<style scoped lang="less">
.startNode {
  text-align: center;
  padding-bottom: 2.5rem;
  /deep/.el-input {
    width: 26.5rem;
    margin-bottom: 2rem;
  }
  .h1-dis {
    margin: 2rem 0 1.5rem;
  }
  h5 {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    font-weight: bold;
    display: flex;
    margin-left: 308px;
    margin-bottom: 1rem;
  }
  .h4-delDis {
    margin-bottom: 0;
    margin-left: 129px;
  }
  hr {
    background-color: #d5d7de;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    border: none;
    height: 1px;
  }
  .button-width {
    width: 200px;
    font-size: 0.88rem;
  }
  .button-email {
    background: #ffffff;
    border: 1px solid #1c51dd;
    border-radius: 2px;
    color: #1c51dd;
    width: 200px;
    height: 2.63rem;
    margin-right: 19px;
    font-size: 0.88rem;
  }
  .radio-style {
    margin-bottom: 1rem;
  }
}
</style>
