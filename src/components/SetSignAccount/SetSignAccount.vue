<template>
  <div class="setSignAccount">
    <el-card>
      <span class="back-tittle"
            @click="backPage">
        <i class="el-icon-arrow-left"></i>
        {{$t('openWallet.back')}}
      </span>
      <el-input v-model="signAddress"
                :placeholder="$t('CampaignNode.dig_address')"></el-input>
      <button class="common-button top-dis"
              @click="setSignAccount">{{$t('jointAdd.updateSign')}}</button>
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
import AllDialog from '@/components/TransferDialog/AllDialog'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
export default {
  name: 'setSignAccount',
  data () {
    return {
      signAddress: '',
      address: '',
      data: {},
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
    setSignAccount (position) {
      try {
        this.signAddress = this.signAddress.trim()
        if (!WalletUtil.validateManAddress(this.signAddress)) {
          this.$message.error(this.$t('transfer.addressTip'))
          return
        }
        let abiArray = JSON.parse(joinChildAbi)
        let contractAddress = this.jointAccount
        let contract = this.httpProvider.man.contract(abiArray).at(contractAddress)
        let nonce = this.httpProvider.man.getTransactionCount(this.address)
        nonce = WalletUtil.numToHex(nonce)
        let data = {
          to: this.jointAccount,
          value: 0,
          gasLimit: 210000,
          data: '',
          gasPrice: 18000000000,
          extra_to: [[0, 0, []]],
          nonce: nonce
        }
        let jsonObj = TradingFuns.getTxData(data)
        jsonObj.data = contract.setSignAccount.getData(WalletUtil.getAddress(this.signAddress))
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
          this.jsonObj = JSON.stringify(jsonObj)
          this.confirmOffline = true
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
  mounted () {
    this.jointAccount = this.$route.params.jointAccount
    if (this.$store.state.offline != null) {
      this.address = this.$store.state.offline
    } else {
      this.address = this.$store.getters.wallet.address
    }
  }
}
</script>

<style scoped lang="less">
.setSignAccount {
  margin: auto;
  width: 1040px;
  .back-tittle {
    position: relative;
    left: 454px;
    cursor: pointer;
    color: #1c51dd;
    font-size: 0.88rem;
    letter-spacing: 0.13px;
  }
  /deep/.el-input {
    display: block;
    width: 26.5rem;
  }
  .top-dis {
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
}
</style>
