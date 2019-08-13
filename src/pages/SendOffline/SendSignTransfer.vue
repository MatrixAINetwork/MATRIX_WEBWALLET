<template>
  <div class="sendSignTransfer">
    <div>
      <el-input type="textarea"
                class="button-top"
                :autosize="{ minRows: 4, maxRows: 6}"
                v-model="information"></el-input>
      <button class="common-button button-top"
              @click="sendTransfer">{{$t('unlock.sendSignInformation')}}</button>
      <div class="error_font">{{$t('OfflineUnlock.sendSignTip')}}</div>
    </div>
    <all-dialog :visible="visible"
                @changeVisible="changeVisible"
                :width="'800px'"
                :msg="msg"
                :hash="hash"></all-dialog>
  </div>
</template>

<script>
import SendTransfer from '@/assets/js/SendTransfer'
import AllDialog from '@/components/TransferDialog/AllDialog'
import store from 'store'
export default {
  name: 'sendSignTransfer',
  data () {
    return {
      information: '',
      hash: '',
      msg: '',
      visible: false,
      address: null
    }
  },
  methods: {
    changeVisible (state) {
      this.visible = state
    },
    sendTransfer () {
      try {
        let newTxData = SendTransfer.getTxParams(this.information)
        this.hash = this.httpProvider.man.sendRawTransaction(newTxData)
        this.visible = true
        if (this.address != null) {
          let recordArray = store.get(this.address)
          if ((typeof (recordArray) === 'string')) {
            recordArray = JSON.parse(recordArray)
          }
          if (recordArray == null) {
            recordArray = []
          }
          recordArray.push({ hash: this.hash, newTxData: { commitTime: newTxData.commitTime, txType: newTxData.txType } })
          store.set(this.address, recordArray)
        }
        this.msg = this.$t('OfflineUnlock.sendSuccess')
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    back () {
      this.$router.back()
    }
  },
  mounted () {
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else if (this.$store.state.wallet != null) {
      this.address = this.$store.getters.wallet.address
    }
    this.information = this.$route.params.serializedTx
  },
  components: {
    AllDialog
  }
}
</script>
<style scoped lang="less">
.sendSignTransfer {
  h4 {
    margin-bottom: 2.5rem;
  }
  .h5-dis {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
  h5 {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    font-weight: bold;
    display: flex;
    margin-left: 16.75rem;
    margin-bottom: 1rem;
  }
  .button-top {
    margin-top: 1.5rem;
  }
  /deep/.el-card__body {
    padding: 2.5rem 4rem 3rem 4rem;
  }
  .back {
    float: right;
    cursor: pointer;
    color: #1c51dd;
    font-size: 0.88rem;
    letter-spacing: 0.13px;
  }
  .error_font {
    font-size: 1rem;
    color: #ed3c1c;
    letter-spacing: 0.11px;
    margin-top: 1rem;
  }
}
</style>
