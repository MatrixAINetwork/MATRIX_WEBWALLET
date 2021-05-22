<template>
  <div class="jointRegular">
    <el-card>
      <div>
        <span class="back-tittle"
              @click="backPage">
          <i class="el-icon-arrow-left"></i>
          {{$t('openWallet.back')}}
        </span>
      </div>
      <el-input readonly=""
                v-model="data.value"
                type="number"></el-input>
      <button class="common-button h5-dis"
              @click="withdraw">{{$t('digAccount.withdraw_deposit')}}</button>
    </el-card>
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
import { joinChildAbi } from '@/assets/js/config.js'
import store from 'store'
import WalletUtil from '@/assets/js/WalletUtil'
import TradingFuns from '@/assets/js/TradingFuns'
import SendTransfer from '@/assets/js/SendTransfer'
import filter from '@/assets/js/filters'
import BigNumber from 'bignumber.js'
import AllDialog from '@/components/TransferDialog/AllDialog'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
export default {
  name: 'jointRegular',
  data () {
    return {
      address: '',
      data: { value: 0 },
      msg: '',
      hash: '',
      confirmOffline: false,
      jsonObj: '',
      sendSignVisible: false,
      information: '',
      visible: false
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
    backPage () {
      this.$router.back()
    },
    withdraw () {
      try {
        let value = new BigNumber(this.data.value)
        if (this.data.isOwner) {
          let allAmount = new BigNumber(this.data.allAmount)
          if (allAmount.minus(value).comparedTo(new BigNumber(100000)) === -1) {
            this.$message.error(this.$t('errorMsgs.jointTotalError'))
            return
          }
        }
        let abiArray = JSON.parse(joinChildAbi)
        let contractAddress = this.data.jointAccount
        let contract = this.httpProvider.man.contract(abiArray).at(contractAddress)
        let nonce = this.httpProvider.man.getTransactionCount(this.address)
        nonce = WalletUtil.numToHex(nonce)
        let data = {
          to: this.data.jointAccount,
          value: 0,
          gasLimit: 210000,
          data: '',
          gasPrice: 18000000000,
          extra_to: [[0, 0, []]],
          nonce: nonce
        }
        // debugger
        let jsonObj = TradingFuns.getTxData(data)
        jsonObj.data = contract.withdraw.getData(this.httpProvider.toWei(new BigNumber(this.data.value).toString(10)), parseInt(this.data.opration))
        if (this.$store.state.wallet != null) {
          let tx = WalletUtil.createTx(jsonObj)
          let privateKey = this.$store.state.wallet.privateKey
          privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
          tx.sign(privateKey)
          let serializedTx = tx.serialize()
          this.newTxData = SendTransfer.getTxParams(serializedTx)
          let hash = this.httpProvider.man.sendRawTransaction(this.newTxData)
          this.hash = hash
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
          this.confirmOffline = true
          this.jsonObj = JSON.stringify(jsonObj)
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    }
  },
  components: {
    AllDialog,
    OfflineDialog,
    sendSign
  },
  watch: {
    $route (to, from) {
      if (to.path.indexOf('joinRegular') > -1) {
        this.data = this.$route.params.data
        this.data.value = filter.weiToNumber(this.data.value).toString(10)
      }
    }
  },
  mounted () {
    this.data = this.$route.params.data
    this.data.value = filter.weiToNumber(this.data.value).toString(10)
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
  }
}
</script>

<style scoped lang="less">
.jointRegular {
  margin: auto;
  width: 1040px;
  /deep/.el-input {
    display: block;
    width: 26.5rem;
  }
  .h5-dis {
    margin-top: 1.5rem;
  }
  h5 {
    font-size: 0.875rem;
    color: #2c365c;
    letter-spacing: 0.13px;
    font-weight: bold;
    display: flex;
    margin-left: 18rem;
    margin-bottom: 1rem;
  }
  .back-tittle {
    position: relative;
    left: 446px;
    cursor: pointer;
    color: #1c51dd;
    font-size: 0.88rem;
    letter-spacing: 0.13px;
  }
}
</style>
