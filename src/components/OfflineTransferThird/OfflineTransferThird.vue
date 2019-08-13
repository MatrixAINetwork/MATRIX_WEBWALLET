<template>
  <div class="offline-transfer-third align-center">
    <unlock-wallet @openWallet="openWallet"></unlock-wallet>
  </div>
</template>

<script>
import UnlockWallet from '@/components/UnlockWallet/UnlockWallet'
import SendTransfer from '@/assets/js/SendTransfer'
import WalletUtil from '@/assets/js/WalletUtil'
export default {
  name: 'OfflineTransferThird',
  data () {
    return {
      sendJson: {},
      newTxData: {},
      ruleForm: {}
    }
  },
  methods: {
    openWallet () {
      let tx = WalletUtil.createTx(this.sendJson)
      let privateKey = this.$store.state.wallet.privateKey
      privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
      tx.sign(privateKey)
      let serializedTx = tx.serialize()
      this.newTxData = SendTransfer.getTxParams(serializedTx)
      this.$router.push({ name: 'OfflineTransferFourth', params: { newTxData: this.newTxData, ruleForm: this.ruleForm } })
    }
  },
  components: {
    UnlockWallet
  },
  mounted () {
    this.sendJson = this.$route.params.sendJson
    this.ruleForm = this.$route.params.ruleForm
  }
}
</script>

<style scoped lang="less">
.offline-transfer-third {
  /deep/ h4 {
    margin-top: 1.56rem;
  }
}
</style>
