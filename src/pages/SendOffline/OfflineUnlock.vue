<template>
  <div class="offlineUnlock">
    <h5>{{$t('OfflineUnlock.noSignTransfer')}}：</h5>
    <el-input type="textarea"
              class="input-bottom"
              :autosize="{ minRows: 4, maxRows: 6}"
              v-model="transferJson"></el-input>
    <unlock-wallet @openWallet="openWallet"></unlock-wallet>
    <div class="error_font">{{$t('OfflineUnlock.offlineTip')}}</div>
  </div>
</template>

<script>
import UnlockWallet from '@/pages/SendOffline/UnlockOfflineWallet'
import WalletUtil from '@/assets/js/WalletUtil'
import LedgerUtil from '@/assets/js/LedgerUtil'
import { chainId } from '@/assets/js/config' // 配置

export default {
  name: 'offlineUnlock',
  data () {
    return {
      copyData: '',
      address: '',
      wallet: {},
      transferJson: ''
    }
  },
  mounted () {
  },
  methods: {
    openWallet (data) {
      if (this.wallet.privateKey) {
        try {
          this.wallet = data
          let tx = WalletUtil.createTx(JSON.parse(this.transferJson))
          let privateKey = this.wallet.privateKey
          privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
          tx.sign(privateKey)
          let serializedTx = '0x' + tx.serialize().toString('hex')
          this.$router.push({ name: 'SendSignTransfer', params: { serializedTx: serializedTx } })
        } catch (e) {
          this.$message.error(this.$t('errorMsgs.jsonError'))
        }
      } else {
        let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        let tx = WalletUtil.createTx(JSON.parse(this.transferJson))
        tx.v = '0x' + chainId.toString(16)
        LedgerUtil.sign(tx.serialize()).then((result) => {
          loading.close()
          let v = '0x' + (parseInt(result.v.toString('hex'), 16) + (chainId * 2 + 8)).toString(16)
          let r = '0x' + result.r.toString('hex')
          let s = '0x' + result.s.toString('hex')
          tx.s = s
          tx.r = r
          tx.v = v
          let serializedTx = '0x' + tx.serialize().toString('hex')
          this.$router.push({ name: 'SendSignTransfer', params: { serializedTx: serializedTx } })
        }).catch(err => {
          loading.close()
          this.$message.error(err.message)
        })
      }
    },
    goPage () {
      this.$router.push({ path: '/sendOffline/sendSignTransfer' })
    }
  },
  components: {
    UnlockWallet
  }
}
</script>

<style scoped lang="less">
.offlineUnlock {
  .keyStoneHintFont {
    font-size: 0.75rem;
    color: #9298ae;
    letter-spacing: 0.11px;
    text-align: center;
  }
  a {
    font-size: 12px;
    color: #1c51dd;
    letter-spacing: 0.11px;
    text-align: center;
    line-height: 17px;
    cursor: pointer;
  }
  .input-bottom {
    margin-bottom: 1rem;
  }
  .error_font {
    font-size: 1rem;
    color: #ed3c1c;
    letter-spacing: 0.11px;
    margin-top: 1rem;
  }
}
</style>
