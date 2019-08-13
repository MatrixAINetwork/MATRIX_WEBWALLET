<template>
  <div class="contract align-center">
    <el-card class="box-card body-card">
      <div class="title">{{$t('contracts.contracts')}}</div>
      <div class="form">
        <div class="input-title">{{$t('contract.coinType')}}</div>
        <el-select v-model="currency"
                   slot="append">
          <el-option label="MAN"
                     value="MAN"></el-option>
          <el-option v-for="item in matrixCoins"
                     :key="item"
                     :label="item"
                     :value="item"></el-option>
        </el-select>
        <div class="input-title">Byte Code：</div>
        <el-input type="textarea"
                  :autosize="{ minRows: 3, maxRows: 4}"
                  v-model="contractObj.byteCode">
        </el-input>
        <div class="input-title">Gas Limit：</div>
        <el-input v-model="contractObj.gasLimit"
                  type="number">
        </el-input>
      </div>
      <button class="common-button"
              @click="signTransfer">{{$t('contract.signTransaction')}}</button>
    </el-card>
    <all-dialog :visible="visible"
                @changeVisible="changeVisible"
                :width="'800px'"
                :msg="msg"
                :contractAddr="contractAddr"
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
import MatrixTx from 'matrixjs-tx'
import WalletUtil from '@/assets/js/WalletUtil'
import SendTransfer from '@/assets/js/SendTransfer'
import TradingFuns from '@/assets/js/TradingFuns'
import AllDialog from '@/components/TransferDialog/contractDialog'
import OfflineDialog from '@/components/TransferDialog/TipOfflineDialog'
import sendSign from '@/components/TransferDialog/sendSignTransfer'
import store from 'store'

export default {
  name: 'Contract',
  data () {
    return {
      contractObj: {
        byteCode: '',
        gasLimit: 3000000,
        gasPrice: 18000000000,
        nonce: '',
        address: ''
      },
      address: '',
      contractAddr: '',
      matrixCoins: [],
      currency: 'MAN',
      visible: false,
      msg: '',
      hash: '',
      confirmOffline: false,
      jsonObj: '',
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
        let contractAddr = WalletUtil.getManAddress(this.contractAddr)
        this.contractAddr = WalletUtil.getCurrencyAddress(contractAddr, this.currency)
        this.visible = true
        this.contractObj = {
          byteCode: '',
          gasLimit: 3000000,
          gasPrice: 18000000000,
          nonce: '',
          address: ''
        }
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
      if (this.contractObj.byteCode.trim() === '') {
        this.$message.error(this.$t('errorMsgs.byteCodeError'))
        return
      }
      try {
        let nowAddress = WalletUtil.getCurrencyAddress(this.address, this.currency)
        let nonce = this.httpProvider.man.getTransactionCount(nowAddress)
        this.nonce = WalletUtil.numToHex(nonce)
        this.contractObj.address = nowAddress
        this.contractObj.nonce = nonce
        let addrTemp = this.address.split('.')[1]
        let toAddress = WalletUtil.manAddressToHex(addrTemp)
        this.contractAddr = WalletUtil.getDeteministicContractAddress(toAddress, this.nonce)
        let jsonObj = TradingFuns.getContractData(this.contractObj)
        jsonObj.currency = this.currency
        if (this.$store.state.wallet != null) {
          let tx = new MatrixTx(jsonObj, true)
          let privateKey = this.$store.state.wallet.privateKey
          privateKey = Buffer.from(privateKey.indexOf('0x') > -1 ? privateKey.substring(2, privateKey.length) : privateKey, 'hex')
          tx.sign(privateKey)
          let serializedTx = tx.serialize()
          let newTxData = SendTransfer.getTxParams(serializedTx, this.currency)
          let contractAddr = WalletUtil.getManAddress(this.contractAddr)
          this.contractAddr = WalletUtil.getCurrencyAddress(contractAddr, this.currency)
          this.hash = this.httpProvider.man.sendRawTransaction(newTxData)
          this.visible = true
          this.contractObj = {
            byteCode: '',
            gasLimit: 3000000,
            gasPrice: 18000000000,
            nonce: '',
            address: ''
          }
          let recordArray = store.get(this.address)
          if ((typeof (recordArray) === 'string')) {
            recordArray = JSON.parse(recordArray)
          }
          if (recordArray == null) {
            recordArray = []
          }
          recordArray.push({ hash: this.hash, newTxData: { commitTime: newTxData.commitTime, txType: newTxData.txType } })
          store.set(this.address, recordArray)
        } else {
          this.jsonObj = JSON.stringify(jsonObj)
          this.confirmOffline = true
        }
        this.msg = this.$t('contracts.contractsSuccess')
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
    this.matrixCoins = this.httpProvider.man.getMatrixCoin('latest')
  },
  components: {
    AllDialog,
    OfflineDialog,
    sendSign
  }
}
</script>

<style scoped lang="less">
.contract {
  .box-card {
    margin: auto;
  }
  .title {
    font-size: 1.25rem;
    color: #2c365c;
    letter-spacing: 0.18px;
    margin-top: 2.06rem;
  }
  .form {
    margin: auto;
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
}
</style>
