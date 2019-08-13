<template>
  <el-dialog :visible.sync="visible"
             :showClose=false
             customClass="send-sign"
             :width="width"
             :before-close="handleClose"
             center>
    <div class="content">
      <h1>{{$t('OfflineUnlock.title')}}</h1>
      <el-input type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                v-model="information"></el-input>
      <button class="common-button button-top"
              @click="sendTransfer">{{$t('unlock.sendSignInformation')}}</button>
      <div class="error_font">{{$t('OfflineUnlock.sendSignTip')}}</div>
    </div>
  </el-dialog>
</template>
<script>
import SendTransfer from '@/assets/js/SendTransfer'
import store from 'store'
export default {
  name: 'TransferDialog',
  methods: {
    handleClose () {
      this.$emit('changeSendSign', false)
    },
    sendTransfer () {
      try {
        let newTxData = SendTransfer.getTxParams(this.information)
        let hash = this.httpProvider.man.sendRawTransaction(newTxData)
        let obj = { newTxData: newTxData, hash: hash }
        let recordArray = store.get(this.$store.state.offline)
        if ((typeof (recordArray) === 'string')) {
          recordArray = JSON.parse(recordArray)
        }
        if (recordArray == null) {
          recordArray = []
        }
        recordArray.push({ hash: hash, newTxData: { commitTime: newTxData.commitTime, txType: newTxData.txType } })
        store.set(this.$store.state.offline, recordArray)
        this.$emit('changeSendSign', obj)
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  },
  data () {
    return {
      product: ''
    }
  },
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    information: {
      default: '',
      type: String
    },
    width: {
      default: '',
      type: String
    }
  }
}
</script>

<style scoped lang="less">
.send-sign {
  /deep/ .el-dialog__body {
    padding: 0 !important;
  }
  /deep/ .el-dialog__header {
    padding: 0;
    height: 2rem;
  }
  /deep/ .el-dialog__footer {
    background: rgba(44, 54, 92, 0.03);
    border-radius: 0px 0px 2px 2px;
    height: 3.5rem;
    margin-top: 2.06rem;
  }
  .content {
    text-align: center;
    .button-top {
      margin-top: 2rem;
    }
  }
  .error_font {
    font-size: 1rem;
    color: #ed3c1c;
    letter-spacing: 0.11px;
    margin-top: 1rem;
  }
}
</style>
