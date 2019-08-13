<template>
  <div>
    <el-dialog :visible.sync="commonDialogVisible"
               :showClose=false
               customClass="common-dialog"
               :width="width"
               :before-close="handleClose"
               center>
      <div class="content">
        <div class="title">{{title}}</div>
        <div class="msg">{{msg}}</div>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <button @click="confirm('cancel')">{{cancelText}}</button>
        <button @click="confirm('ok')">{{okText}}</button>
      </span>
    </el-dialog>
    <offline-dialog :width="'800px'"
                    :transferJson="jsonObj"
                    :confirmOffline="confirmOffline"
                    @changeConfirmOffline="changeConfirmOffline"
                    @openSendSign="openSendSign"></offline-dialog>
    <send-sign :visible="sendSignVisible"
               :width="'800px'"
               :information="information"
               @changeSendSign="changeSendSign"></send-sign>
    <all-dialog :visible="visible"
                @changeVisible="changeVisible"
                :width="'800px'"
                :msg="allMsg"
                :hash="hash"></all-dialog>
  </div>
</template>

<script>
import WalletUtil from '@/assets/js/WalletUtil'
import SendTransfer from '@/assets/js/SendTransfer'
import { mortgage, contract } from '@/assets/js/config'
import TradingFuns from '@/assets/js/TradingFuns'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
import AllDialog from '@/components/TransferDialog/AllDialog'
import store from 'store'
export default {
  name: 'CommonDialog',
  data () {
    return {
      functions: [],
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: '',
      allMsg: '',
      hash: '',
      visible: false
    }
  },
  methods: {
    changeVisible (state) {
      this.visible = state
    },
    openSendSign () {
      this.sendSignVisible = true
    },
    changeSendSign (data) {
      this.sendSignVisible = false
      if (data != null && data !== false) {
        this.hash = data.hash
        this.visible = true
        this.allMsg = this.$t('mortgageHistory.cancelMortgageSuccess')
      }
    },
    changeConfirmOffline (data) {
      this.confirmOffline = false
      if (data !== false) {
        this.sendSignVisible = true
        this.information = data
      }
    },
    confirm (status) {
      if (status === 'ok') {
        try {
          let tAbi = JSON.parse(mortgage.abi)
          for (let i in tAbi) {
            if (tAbi[i].type === 'function') {
              tAbi[i].inputs.map(function (i) {
                i.value = ''
              })
              this.functions.push(tAbi[i])
            }
          }
          let curFunc = this.functions[4]
          let fullFuncName = WalletUtil.solidityUtils.transformToFullName(curFunc)
          let funcSig = WalletUtil.getFunctionSignature(fullFuncName)
          let typeName = WalletUtil.solidityUtils.extractTypeName(fullFuncName)
          var types = typeName.split(',')
          types = types[0] === '' ? [] : types
          var values = []
          for (let i in curFunc.inputs) {
            if (curFunc.inputs[i].value) {
              if (curFunc.inputs[i].type.indexOf('[') !== -1 && curFunc.inputs[i].type.indexOf(']') !== -1) {
                values.push(curFunc.inputs[i].value.split(','))
              } else {
                values.push(curFunc.inputs[i].value)
              }
            } else values.push('')
          }
          let nonce = this.httpProvider.man.getTransactionCount(this.address)
          nonce = WalletUtil.numToHex(nonce)
          let data = {
            to: contract,
            value: 0,
            gasLimit: 210000,
            data: '',
            gasPrice: 18000000000,
            extra_to: [[0, 0, []]],
            nonce: nonce
          }
          let jsonObj = TradingFuns.getTxData(data)
          jsonObj.data = '0x' + funcSig + WalletUtil.solidityCoder.encodeParams(types, values)
          if (this.$store.state.wallet != null) {
            let tx = WalletUtil.createTx(jsonObj)
            let privateKey = this.$store.state.wallet.privateKey
            privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
            tx.sign(privateKey)
            let serializedTx = tx.serialize()
            this.newTxData = SendTransfer.getTxParams(serializedTx)
            let hash = this.httpProvider.man.sendRawTransaction(this.newTxData)
            this.hash = hash
            this.allMsg = this.$t('successHint.refund')
            this.visible = true
            let recordArray = store.get(this.address)
            if ((typeof (recordArray) === 'string')) {
              recordArray = JSON.parse(recordArray)
            }
            if (recordArray == null) {
              recordArray = []
            }
            recordArray.push({ hash: this.hash, newTxData: { commitTime: this.newTxData.commitTime, txType: this.newTxData.txType } })
            store.set(this.address, recordArray)
          } else {
            this.jsonObj = JSON.stringify(jsonObj)
            this.confirmOffline = true
          }
          this.allMsg = this.$t('successHint.withdrawal')
        } catch (e) {
          this.$message.error(e.message)
        }
      }
      this.$emit('closeDialog', status)
    },
    handleClose () {
      this.$emit('closeDialog', 'cancel')
    }
  },
  props: {
    commonDialogVisible: {
      default: false,
      type: Boolean
    },
    title: {
      default: '',
      type: String
    },
    msg: {
      default: '',
      type: String
    },
    okText: {
      default: '',
      type: String
    },
    cancelText: {
      default: '',
      type: String
    },
    width: {
      default: '30%',
      type: String
    },
    address: {
      default: '',
      type: String
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
/deep/ .el-dialog__body {
  padding: 0 !important;
}
/deep/ .el-dialog__footer {
  background: rgba(44, 54, 92, 0.03);
  border-radius: 0px 0px 2px 2px;
  height: 3.5rem;
  margin-top: 2.06rem;
}
.common-dialog {
  .content {
    text-align: center;
    color: #2c365c;
    .title {
      font-size: 1rem;
      letter-spacing: -0.28px;
      font-weight: bold;
      margin: 0.75rem 0 0.5rem 0;
    }
    .msg {
      font-size: 0.88rem;
      letter-spacing: -0.5px;
      padding: 0 5.38rem;
    }
  }
  .dialog-footer {
    button {
      width: 5rem;
      height: 2rem;
      border-radius: 2px;
      text-align: center;
      letter-spacing: -0.21px;
      font-size: 0.75rem;
    }
    button:last-child {
      margin-left: 1.5rem;
      color: #fff;
      background: #1c51dd;
    }
    button:first-child {
      background: #fafcff;
      border: 1px solid #2c365c;
      color: #2c365c;
    }
  }
}
</style>
