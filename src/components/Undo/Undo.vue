<template>
  <div class="undo">
    <div>
      <h1>{{$t('undo.title')}}</h1>
      <h5 v-html="$t('undo.transferHash')"></h5>
      <div>
        <el-input v-model="inputHash"></el-input>
      </div>
      <button class="common-button"
              @click="revocableTransfer">{{$t('transfer.confirm')}}</button>
    </div>
    <all-dialog :visible="visible"
                @changeVisible="changeVisible"
                :width="'800px'"
                :msg="msg"
                :hash="hash"></all-dialog>
    <offline-dialog :width="'800px'"
                    :transferJson="jsonObj"
                    :confirmOffline="confirmOffline"
                    @changeConfirmOffline="changeConfirmOffline"
                    @openSendSign="openSendSign"></offline-dialog>
    <send-sign :visible="sendSignVisible"
               :width="'800px'"
               :information="information"
               @changeSendSign="changeSendSign"></send-sign>
  </div>
</template>

<script>
import TradingFuns from '@/assets/js/TradingFuns'
import WalletUtil from '@/assets/js/WalletUtil'
import SendTransfer from '@/assets/js/SendTransfer'
import AllDialog from '@/components/TransferDialog/AllDialog'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
import store from 'store'
export default {
  name: 'undo',
  data () {
    return {
      msg: '',
      visible: false,
      hash: '',
      address: '',
      tradingObj: {
        value: 0,
        to: '',
        IsEntrustTx: '',
        ExtraTimeTxType: '0',
        gasLimit: 210000,
        gasPrice: 18000000000,
        extra_to: [[4, 0, []]],
        data: '',
        nonce: ''
      },
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: '',
      inputHash: ''
    }
  },
  methods: {
    openSendSign () {
      this.sendSignVisible = true
    },
    changeSendSign (data) {
      this.sendSignVisible = false
      if (data != null && data !== false) {
        this.hash = data.hash
        this.visible = true
      }
    },
    changeConfirmOffline (data) {
      this.confirmOffline = false
      if (data !== false) {
        this.sendSignVisible = true
        this.information = data
      }
    },
    changeVisible (state) {
      this.visible = state
    },
    revocableTransfer () {
      try {
        this.tradingObj.nonce = this.httpProvider.man.getTransactionCount(this.address)
        this.tradingObj.nonce = WalletUtil.numToHex(this.tradingObj.nonce)
        this.tradingObj.to = this.address
        let jsonObj = TradingFuns.getTxData(this.tradingObj)
        jsonObj.data = this.inputHash.trim()
        if (this.$store.state.wallet != null) {
          let tx = WalletUtil.createTx(jsonObj)
          let privateKey = this.$store.state.wallet.privateKey
          privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
          tx.sign(privateKey)
          let serializedTx = tx.serialize()
          let newTxData = SendTransfer.getTxParams(serializedTx)
          this.hash = this.httpProvider.man.sendRawTransaction(newTxData)
          let recordArray = store.get(this.address)
          if ((typeof (recordArray) === 'string')) {
            recordArray = JSON.parse(recordArray)
          }
          if (recordArray == null) {
            recordArray = []
          }
          recordArray.push({ hash: this.hash, newTxData: { commitTime: newTxData.commitTime, txType: newTxData.txType } })
          store.set(this.address, recordArray)
          this.visible = true
        } else {
          this.jsonObj = JSON.stringify(jsonObj)
          this.confirmOffline = true
        }
        this.msg = this.$t('record.undoSuccess')
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  },
  mounted () {
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
  },
  components: {
    AllDialog,
    OfflineDialog,
    sendSign
  }
}
</script>
<style scoped lang="less">
.undo {
  /deep/.el-input {
    width: 26.5rem;
    margin-bottom: 1.5rem;
  }
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
}
</style>
