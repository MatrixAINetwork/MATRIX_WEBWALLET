<template>
  <div class="createCoin align-center">
    <div class="title">{{$t('createCoin.tittle')}}</div>
    <div class="form">
      <h5>{{$t('createCoin.manCount')}}</h5>
      <el-input readonly="readonly"
                v-model="manCount">
      </el-input>
      <h5>{{$t('createCoin.destruction')}}</h5>
      <el-input readonly="readonly"
                v-model="destruction">
      </el-input>
      <!-- <h5>{{$t('transfer.estimatedGas')}}</h5>
      <el-input v-model="gas">
      </el-input> -->
      <button class="common-button"
              @click="signTransfer">{{$t('createCoin.confirm')}}</button>
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
import AllDialog from '@/components/TransferDialog/AllDialog'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
export default {
  name: 'Contract',
  data () {
    return {
      manCount: 100000,
      destruction: 'MAN.3GJF5vPbrmbUG7ZTFyFogdiuXY3Lp',
      gas: '',
      newTxData: {},
      hash: '',
      msg: '',
      visible: false,
      jsonObj: '',
      confirmOffline: false,
      sendSignVisible: false,
      information: ''
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
    signTransfer () {
      try {
        if (this.$store.state.wallet != null) {
          if (this.$store.state.wallet.privateKey) {
            this.hash = this.httpProvider.man.sendRawTransaction(this.newTxData)
            this.msg = this.$t('createCoin.success')
            this.visible = true
          } else {
            this.jsonObj = this.newTxData
            this.confirmOffline = true
          }
        } else {
          this.jsonObj = this.newTxData
          this.confirmOffline = true
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  },
  mounted () {
    if (this.$store.state.wallet != null) {
      this.newTxData = this.$route.params.newTxData
    } else {
      this.newTxData = this.$route.params.newTxData
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
.createCoin {
  .title {
    font-size: 1.25rem;
    color: #2c365c;
    letter-spacing: 0.18px;
    margin-top: 2.06rem;
  }
  .form {
    width: 26.5rem;
    text-align: left;
    .input-title {
      font-size: 0.88rem;
      color: #2c365c;
      letter-spacing: 0.13px;
      margin: 24px 0 16px 0;
    }
  }
  .common-button {
    margin: 32px 0 48px 0;
  }
  .addButton {
    font-size: 0.875rem;
    color: #1c51dd;
    letter-spacing: 0.13px;
    cursor: pointer;
    margin: 1rem 0 2rem;
    text-align: center;
  }
  .hint-error {
    font-size: 0.875rem;
    color: #ed3c1c;
    letter-spacing: 0.13px;
    float: right;
    cursor: pointer;
  }
}
</style>
