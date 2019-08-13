<template>
  <div class="offlineUnlock">
    <el-input type="textarea"
              :autosize="{ minRows: 4, maxRows: 6}"
              v-model="transferJson"></el-input>
    <button class="common-button button-top"
            @click="signTransfer">{{$t('unlock.sign')}}</button>
  </div>
</template>
<script>
import WalletUtil from '@/assets/js/WalletUtil'
export default {
  name: 'offlineUnlock',
  data () {
    return {
      transferJson: '',
      wallet: {}
    }
  },
  mounted () {
    this.wallet = this.$route.params.wallet
  },
  methods: {
    signTransfer () {
      try {
        let tx = WalletUtil.createTx(JSON.parse(this.transferJson))
        let privateKey = this.wallet.privateKey
        privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
        tx.sign(privateKey)
        let serializedTx = '0x' + tx.serialize().toString('hex')
        this.$router.push({ name: 'SendSignTransfer', params: { serializedTx: serializedTx } })
      } catch (error) {
        this.$message.error(error.message)
      }
    }
  }
}
</script>

<style scoped lang="less">
.offlineUnlock {
  .button-top {
    margin-top: 3rem;
  }
}
</style>
